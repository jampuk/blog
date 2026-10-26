---
title: "How we moved a legacy Rails app from EC2 to on-prem VMware"
description: "A lift-and-shift in five moves: pinning an EOL Ruby/Passenger stack into containers, proving the old port was plain HTTP, and migrating MySQL with a ledger you can re-run."
date: 2026-10-18
draft: false
cover: /images/uploads/ec2-to-onprem-vmware-migration.jpg
tags:
  - field-notes
  - devops
  - migration
---

The project: a field-service CRM written in 2009-era Rails - Rails 2.3.18 on Ruby 1.8.7 - managing warranty and repair jobs. It ran on a single EC2 instance, served by Apache and Phusion Passenger on a non-standard port over plain HTTP, with its primary data in a managed cloud MySQL, a read-only integration to the customer's ERP over ODBC across a VPN, and reporting handled by a legacy JasperServer on Tomcat that we found stopped.

The brief was strict. No feature work, no framework upgrades, no rewriting the app. Move it as-is onto the customer's own VMware cluster, in containers, and leave it more secure than we found it.

That meant auditing the host before touching anything, then executing in five moves.

![A lone legacy cloud server on the left, joined by a dotted data path to an on-premises cluster on the right, with containerized database, application, TLS, and migration components floating above the racks](/images/uploads/ec2-to-onprem-vmware-migration.jpg)

## Rule one: pin the versions, never the code

A lift-and-shift lives or dies on version fidelity. The moment you "helpfully" bump Ruby, Rails, or a gem, you inherit a compatibility project you never scoped.

So the first job was discovery, not change. We extracted the exact running versions - Ruby 1.8.7-p370, Rails 2.3.18, Passenger 5.0.28, the database engine - and pinned each one.

Reproducing a 2009 Ruby is not just "use an old image". Ruby 1.8.7 is built against OpenSSL 1.0.1, so the base image is a matching old Ubuntu rather than a clean modern one; the goal is the app's runtime, not a prettier one.

```dockerfile
# not a modern base: Ruby 1.8.7 is built against OpenSSL 1.0.1
FROM ubuntu:14.04
```

RubyGems itself has to be built by hand, because Ruby 1.8.7 predates it being bundled - we compile RubyGems 1.6.2 from source. That RubyGems cannot negotiate a TLS 1.2 + SNI handshake with rubygems.org, so `gem install` straight from the network simply does not work. Every gem is fetched with `curl` (which speaks modern TLS) to a local file, then installed from that file.

```bash
# fetch with modern TLS, install into the old RubyGems from a local file
curl -fsSLO https://rubygems.org/downloads/xml-simple-1.1.5.gem
gem install --local xml-simple-1.1.5.gem --no-ri --no-rdoc
```

Gem pinning has sharp edges you only find by trying. The `mysql` binding is pinned at 2.8.1 because 2.7.3 exists only as a Windows build, so there is no Linux gem to download. `rake` is pinned at 0.8.7 because the app's `Rakefile` requires `rake/rdoctask`, which was removed in 0.9. `xml-simple` is pinned at 1.1.5 because 1.1.6 and later depend on a `rexml` version that cannot run on Ruby 1.8.7 at all.

The trap in this app was **hidden boot-time dependencies**. A vendored reporting plugin calls `gem 'xml-simple'` at the top of a file that loads on every boot, so a missing gem doesn't just break the report pages - the Passenger preloader dies and every URL 500s. The ERP integration has the same shape: its model classes call `establish_connection` as they load, so Rails 2.3 resolves the SQL Server adapter on every boot, and without that adapter plus its native ODBC binding the whole app refuses to start.

We let the build prove it. The image activates each pinned gem explicitly and calls into it - instantiate the XML parser, assert the adapter responds and the ODBC driver loads - so an incompatibility fails the build instead of the first request.

## Prepare the target, not just the app

The app does not move in isolation; the environment moves with it. On the customer's VMware cluster we provisioned Linux VMs, hardened the container runtime as a system service, and stood up a small stack: the database, the app, a TLS-terminating web container, a certificate container, and a one-shot migrator.

The details that matter are the boring ones. The database, app logs, app temp files, and certificates live on named volumes mounted outside the container lifecycle, so replacing a container never touches state. The database port is never published to the host - only the web container's TLS port is exposed, and the web tier is isolated from the database tier, so a compromised app container cannot reach the database directly.

## Retire the custom port

The app was served on a non-standard port over plain HTTP. Before changing anything we proved it, with a TLS handshake probe against the port: the server answered a TLS ClientHello with plain HTTP bytes - *unknown protocol*, no peer certificate, cipher NONE. The only SSL configuration on the host was a stock, self-signed template that was never enabled for this app.

The fix keeps the familiar port number but changes what travels over it. TLS terminates at a reverse proxy in front of the app, so the same port is now HTTPS; the app's own internal port is reachable only from the proxy, and nothing else is published.

Certificates come from Let's Encrypt over the **DNS-01** challenge, so no inbound port 80 or 443 has to be open and no webroot is involved. Until the certificate is issued, the web container serves a self-signed placeholder so the stack is up and health checks pass; once the real certificate lands, it picks it up and reloads without a restart.

Renewal deserves its own note. With no DNS provider API available, renewal cannot be fully unattended - someone has to place the TXT record. So instead of a blind retry loop, it runs as a bounded campaign: an escalating schedule that tries more often as expiry approaches, a minimum gap between attempts, and a verification step that checks the chain, the domain names, and the remaining validity rather than trusting an exit code. A renewal command that exits zero can simply mean "not yet due" and skip the challenge entirely, which looks identical to success.

## Move the data as-is, then prove it

The database was dumped from the source with version-matched flags and restored into the pinned MySQL 5.7 container, so data types, indexes, and query behavior stay identical.

Restores are re-run often enough that we made the migrator idempotent. A ledger table records each unit with a checksum of its source: unchanged units are skipped, changed ones are re-applied, and a forced run redoes everything. Each table file keeps its `CREATE TABLE` and its rows together, so schema and data move as one unit.

The ordering looks backwards but isn't:

```text
tables -> functions -> views -> procedures -> triggers
```

It is circular by nature - one view calls a function, and a function reads another view - and MySQL checks function existence when creating a view but not the reverse, so the functions have to come first.

Scale-wise it was about 2.2 million rows across 54 tables. Two tables dominated: an audit log (~790k rows) and serialized session blobs (~173k), together roughly 44% of everything. Both default to schema-only. Sessions are regenerated on demand and the blobs dated from 2010 onward; the audit table had already been excluded from the original backup script. After loading, the migrator prints per-table row counts and an exact recount of the skipped tables, so a skip is visible rather than inferred, and the app is never allowed to push its own schema over migrated data.

## Prove it works, then hand over the keys

Testing was not just "does it render". We ran smoke tests and core user journeys against the on-prem HTTPS target, and scanned the built container images with a zero-tolerance gate on high and critical unpatched CVEs.

Health checking turned out to be a place where the obvious choice lies. A database ping exits successfully even when the login is refused, which reports "healthy" over a database nobody can actually connect to - so the check is an authenticated query as the app user. The migrator makes the same distinction: a refused login is fatal on the first attempt and prints the fix, while a server that is still starting is waited out.

The audit also found production database and ERP credentials committed in the repository. Those were treated as compromised and rotated; the new stack generates fresh secrets into a git-ignored environment file and regenerates the app's database config inside the container at start, rather than editing it in place.

Handover was part of the job: log aggregation, container auto-restart policies, and as-built documentation covering the build process, deployment steps, configuration, and rollback. Everything - source, manifests, runbooks - transfers to the customer.

## The unglamorous truth

A clean lift-and-shift is mostly restraint. But the real work here was never the servers; the infrastructure move is mechanical. It was the runtime - a 2009-era Ruby stack where every seam decides whether the whole app boots at all: a RubyGems that can't reach the network, one missing gem that takes down the preloader, one native adapter that gates startup. Pin the versions, change the infrastructure, leave the application alone, and prove every claim at the end.
