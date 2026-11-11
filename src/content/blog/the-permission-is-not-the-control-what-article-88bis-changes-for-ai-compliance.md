---
title: 'The permission is not the control: what Article 88bis changes for AI compliance'
description: 'The Digital Omnibus would give AI developers a statutory legitimate interest under Article 88c, renumbered 88bis in Council. The legal shortcut does not remove the engineering: provenance, minimization, unlearning limits, objection APIs, and output controls are now the compliance surface.'
date: 2026-11-11
draft: false
cover: /images/uploads/what-article-88bis-changes-for-ai-compliance.png
coverAlt: Split illustration of a golden approval stamp on legal documents beside a dark data pipeline passing through cyan control gates, contrasting legal permission with runtime technical controls.
tags:
  - field-notes
  - ai-compliance
  - gdpr
  - eu-ai-act
  - digital-omnibus
  - privacy-engineering
---

The Digital Omnibus makes a simple promise: stop making AI developers prove, one dataset at a time, that training a model is a legitimate interest. The proposed Article 88c, renumbered Article 88bis in the Council's October 2026 mandate, would write that permission into the GDPR itself.[^1][^2] For an industry that has spent years arguing about consent and legitimate interest, it looks like the end of a long dispute.

It is not. It is a change in the burden of justification, and a partial one. The clause pre-approves a legal conclusion; it does not pre-approve the system that has to substantiate it. The safeguards it makes mandatory - dataset minimization, residual output protection, enhanced transparency, objection handling, special-category erasure - are not legal formalities. They are data engineering requirements, and they are where the clause will be tested.

This note reads the three texts together: the Commission's November 2025 proposal, the Council's October 2026 mandate, and Joint Opinion 2/2026 from the European Data Protection Board and the European Data Protection Supervisor. It is an engineering reading, not legal advice. The conclusion is that Article 88bis is less a safe harbor than a conditional transfer of risk from the legal memo to the pipeline.

## What the clause actually changes

Article 6(1)(f) has always required a three-part test: a legitimate interest, necessity, and a balancing exercise against the rights and freedoms of data subjects.[^12] The test is contextual. A controller cannot declare an interest legitimate in the abstract; it has to show why this processing, for this purpose, with these data, is proportionate.

Article 88c does not add a new lawful basis. It creates a statutory pre-assessment inside Article 6(1)(f): a pre-approved pathway for processing personal data for the development, training, testing, and operation of AI systems and models.[^1] The pathway is conditional. It applies only where another EU or national law does not require consent, it remains subject to a baseline balancing test, and it depends on the safeguards described below. The Commission's framing is simplification without compromising fundamental rights. The operative effect is to move the legitimacy question from the controller's case-by-case file into the statute.

The scope is broad. Development covers ingestion, pre-processing, feature engineering, pre-training, and fine-tuning. Operation covers inference, prompt processing, output generation, and ongoing fine-tuning.[^1] Those stages carry different risks. During development, the data subject is usually absent and has little expectation that a scraped page will become training data. During operation, the system touches the person directly. Pairing them simplifies the legal test, not the engineering: the controls at ingestion and at serving are not the same.

The Council mandate adds a second expansion. Article 88bis(1) covers "a legitimate interest of the controller or a third party."[^2] That reflects the supply chain: data brokers, platform hosts, and enterprise vendors aggregate and license data to AI developers. It also creates a gap with draft Recital 33a, which remains focused on the controller's own interest and states that AI development does not, in itself, create an automatic or unchallengeable legitimate interest.[^2] Recitals are not operative, but courts use them to resolve ambiguity. The article and the recital are pulling in different directions, and that tension is a litigation surface.

| Dimension | Commission draft: Article 88c (Nov 2025) | Council mandate: Article 88bis (Oct 2026) | EDPB/EDPS Joint Opinion 2/2026 |
| --- | --- | --- | --- |
| Legal basis | Statutory legitimate interest for AI development and operation under Article 6(1)(f) | Same pathway, subject to conditions and the baseline balancing test | Questions the need for a dedicated clause; Article 6(1)(f) already accommodates AI with a contextual assessment |
| Beneficiaries | The controller's own interest | The controller's interest or a third party's interest | Opposes broad third-party licensing exemptions |
| Scope | Development, training, testing, and operation | Same, including third-party data supply chains | Warns that technology-specific rules cut against Recital 15 neutrality |
| Special-category data | New Article 9(2)(k) route with strict erasure | Erasure, or output suppression where erasure is technically infeasible | Calls for a narrow interpretation and evidence of technical impossibility |
| Objection | Unconditional Article 21 objection as an absolute safeguard | Cross-references standard Article 21 and Article 24 duties | Warns that post-hoc opt-outs fail when data is memorized in model weights |
| Recital alignment | Aligned with the original preamble | Tension with draft Recital 33a | Recitals cannot cure ambiguity in the operative article |

The table is a snapshot, not a final text. The European Parliament's position and the trilogue outcome will decide which column survives. Every version keeps the same shape: a statutory permission attached to technical safeguards.

The commentary converges on the same structural concern: the clause changes the default evidentiary posture without changing the balancing test.[^7][^9] The CCBE and the European Law Institute have proposed narrower, technology-neutral alternatives.[^10][^11] Those alternatives matter for the final text, not for the architecture: the controls below are required under any version that survives.

## The objection is where the argument becomes technical

The EDPB and EDPS make a narrow legal point. They do not reject legitimate interest as a basis for AI development.[^3] They question why a dedicated clause is needed when Article 6(1)(f) already accommodates it, as the Board set out in Opinion 28/2024, provided the controller performs a contextual assessment and implements safeguards.[^4] A technology-specific pathway adds little legal clarity, they argue, while cutting against the technological neutrality principle in Recital 15.[^3] If the clause is retained, their conditions get tighter, not looser.

The regulators' deeper objection is about evidence. A statutory pre-assessment does not eliminate the balancing test; it pre-answers the first question in favor of the developer. The data subject or the supervisory authority then has to contest a processing activity that the legislature has already labeled legitimate.[^3] That is a shift in the burden of justification, and it is the part of the proposal most likely to be litigated. The Schrems cases are the warning: a legal architecture built on a statutory presumption can be unwound in a single judgment.

Civil society goes further. noyb calls the Council mandate a "digital expropriation" of European personal data. An opt-out is not meaningful, it argues, when people do not know their data was scraped, cannot identify the model that ingested it, and cannot remove it from trained weights.[^5][^14] The objection arrives after the data has been incorporated into a system that cannot reliably forget.

Industry's answer is practical. Consent across billions of web pages is not operationally possible, and the lack of a direct relationship with data subjects makes notice-and-choice a fiction.[^6][^8] But the industry position concedes the engineering problem: an objection registry may require collecting more identifiers, not fewer, and removing one data point from a trained network is not a database delete. It is a research problem with no general, auditable solution.

That is the pivot. The three camps disagree about the legal basis. They agree that the safeguards are where the clause will be judged. An objection right that cannot be executed is not a safeguard; it is a press release. Erasure that cannot reach the weights is not erasure; it is a claim. The rest of this note is about making those claims true.

## The safeguards are the system

Article 88c/88bis does not prescribe a compliance program. It prescribes conditions. Read as engineering requirements, they form five control surfaces: minimization, residual output protection, transparency, objection handling, and special-category data. Each has a failure mode that a policy document cannot catch.

### Minimization is an ingestion control

Data minimization is usually written as a principle and implemented as a cleanup task. Under Article 88c/88bis it has to be a gate. The controller must show that the volume and granularity of personal data selected were necessary for the target performance metrics, across source selection, filtering, cleaning, pre-training, and post-training validation.[^1] That is an empirical claim, and it can be tested: how much does each source contribute to evaluation performance, how many identifiable individuals does it add, and what sensitive-data density does it carry? A source that adds a fraction of a point to a benchmark while doubling the sensitive-data load is a weak necessity argument.

The practical control is a source manifest with a decision for every dataset: origin, collection method, contractual basis, robots and terms-of-service status, sensitivity class, and deletion state. Automated classifiers reject high-risk sources before they enter the corpus; deduplication reduces memorization risk and data volume; entity resolution and PII stripping remove identifiers with no training value. Differential privacy and synthetic data can reduce the exposure of any single record, but they are not a substitute for not collecting what you do not need.

Keep the manifest, the classifier version, the rejection rate, and the sampling audit. If a supervisor asks why a source was included, the answer should be a document, not a recollection.

### Residual output protection is a runtime property

Training data can survive in model weights. It can be reproduced verbatim, inferred through membership-inference attacks, or extracted through prompt injection and repeated probing. The clause requires safeguards that prevent residual personal data from being disclosed, extracted, or exposed in outputs.[^1] That is not a one-time training task. It is a runtime property, tested per model version and monitored per deployment.

The controls are layered. At training time: deduplication, regularization, differential privacy where the utility trade-off is acceptable, and canary records. At evaluation time: extraction probes, membership-inference tests, and red-team prompts. At serving time: output classifiers, blocklists, rate limits, refusal policies, and retrieval filters. For retrieval-augmented generation, the index is a data store: a deletion that does not reach the vector index is not a deletion.

Machine unlearning deserves a blunt sentence. Exact deletion from a trained network is not a general, auditable operation. The defensible options are to exclude the data before training, retrain where the risk justifies the cost, or suppress it at serving time and document why erasure was not feasible. Output suppression is a fallback, not a magic eraser.

### Transparency has to be machine-readable

The clause requires enhanced transparency about how personal data is ingested, what processing occurs, and which automated mechanisms are used.[^1] A privacy notice that lists categories of data is not enough. The transparency has to describe the actual data path: which sources feed the corpus, which model versions were trained, which evaluations were run, and how an objection can be executed.

That is a documentation problem with an engineering solution. Model cards and data cards, versioned with the model, are the public layer. A record of processing activities (ROPA), linked to dataset versions, is the internal layer. A provenance manifest is the audit layer. The three should agree. When they do not, the privacy notice becomes a liability rather than a control.

### Objection is a distributed systems problem

Article 21 gives data subjects the right to object. The Commission draft made that objection unconditional; the Council text cross-references the standard Article 21 and Article 24 duties, a weaker construction.[^2] Either way, the operational question is the same: when an objection arrives, which systems have to change?

The answer is every system that can reproduce the data: the training corpus, the fine-tuning set, the retrieval index, the cache, the serving filter, and the evaluation set. That requires an objection API, identity resolution, a suppression store, propagation jobs, and an audit trail. An objection that takes ninety days to propagate is not a real-time right.

The registry paradox is real. To exclude a person, you may need to remember an identifier. The response is not to avoid the registry but to minimize it: store only what exclusion requires, hash identifiers where possible, restrict access, set a retention period, and separate the objection store from analytics and training. An opt-out list that becomes a shadow profile is a new compliance problem.

Machine-readable signals help, but the protocol is not the point. The signal has to reach every pipeline that can reproduce the data, and the controller has to prove it did.

### Special-category data: erasure first, suppression second

Web-scale corpora will contain health data, political opinions, trade union membership, and biometric markers. The proposed Article 9(2)(k) derogation is narrow. It permits incidental processing during AI development, subject to a primary duty of prompt erasure from training, validation, and test sets once the data is identified. Where erasure is technically infeasible or disproportionate, a secondary duty of output suppression applies: the data must not influence outputs, be inferred, or be disclosed.[^1]

The sequence is classifier, review, deletion, verification, and only then suppression. The classifier runs before training. The deletion is verified against the dataset version, not assumed from a script exit code. The infeasibility assessment is specific: which data, which model, which constraint, and which alternative was rejected. "We could not find it" is not "it is not there."

| Safeguard | What fails in practice | Minimum control | Evidence to retain |
| --- | --- | --- | --- |
| Dataset minimization | Scraped corpora accumulate identifiers and sensitive data because deletion is deferred | Source allowlists and denylists; classifiers at ingestion; deduplication; per-source necessity review | Source manifest; classifier version; rejection and sampling metrics |
| Residual output protection | A model reproduces memorized text or exposes data through extraction or prompt injection | Deduplication and regularization; differential privacy where appropriate; canaries; extraction probes; output filters and rate limits | Per-version memorization test results; red-team logs; filter configuration |
| Transparency | A privacy notice describes categories, not the actual data path | Model and data cards; ROPA linked to dataset versions; objection instructions | Versioned cards; data lineage; change log |
| Article 21 objection | The opt-out arrives after the data is in the weights, or never reaches the serving stack | Machine-readable endpoint; suppression store; propagation to training, retrieval, and serving; audit trail | Objection receipts; propagation logs; end-to-end test results |
| Article 9 handling | Sensitive data is "handled" by a filter that cannot prove removal | Sensitive-data classifiers; hard deletion; output suppression when erasure is infeasible | Deletion reports; infeasibility assessment; suppression tests |

## A four-stage control plane

The legal text describes obligations. An operating model needs stages, owners, and gates. We use four stages plus a cross-cutting rights plane. They are not a waterfall; they are a control plane that a dataset or model has to pass before it moves forward.

```text
source selection -> corpus cleaning -> training and validation -> serving
        |                  |                    |                   |
   provenance          deletion report      memorization        output filters
   and contracts       and PET config       and AI-LIA          and objection API
```

**Ingestion and source selection** is where necessity is won or lost. The output is a source inventory with a lawful-interest note per source, a sensitivity scan, and a contract review for third-party data. If a source cannot be described, it cannot be defended.

**Pre-training and cleaning** reduces the corpus to what the model needs. Deduplication, sensitive-data classifiers, hard deletion, and privacy-enhancing technologies are the controls. The evidence is a dataset manifest and a deletion report tied to a version.

**Training and validation** tests the failure modes the clause cares about. The AI-LIA (a legitimate interest assessment scoped to the model, data, and serving stack) and the DPIA should be one assessment with two outputs, not two documents owned by different teams. Canaries, extraction probes, and membership-inference tests belong in the release gate.

**Deployment and serving** is where residual risk becomes visible. Output guardrails, retrieval filters, rate limits, logging, and a kill switch are the minimum. The evidence is a configuration baseline and an exercised incident runbook.

**Rights management** cuts across all four. An objection has to enter at any stage and propagate to every downstream system.

The same control plane, viewed as containers. This is a C4 container diagram: each box is an application or data store, and each arrow is a dependency or evidence flow. The container level is the right altitude here; a context diagram would be too abstract, and a component diagram would claim an implementation detail the post does not have.

```text
C4Container
title Container diagram for the AI compliance control plane

Person(engineer, "AI/ML Engineer", "Selects sources, trains and releases models")
Person(dpo, "DPO / Compliance", "Reviews assessments, evidence and objections")
Person(subject, "Data Subject", "Exercises objection and erasure rights")

System_Boundary(cp, "AI compliance control plane") {
  ContainerDb(registry, "Source Registry", "Metadata store", "Provenance, contracts, sensitivity and deletion state")
  Container(ingest, "Ingestion and Cleaning", "Pipeline", "Classifies, minimizes, deduplicates and deletes")
  Container(train, "Training and Evaluation", "ML platform", "Trains models and runs memorization tests")
  Container(serve, "Serving Gateway", "API and guardrails", "Filters outputs and enforces suppression")
  Container(rights, "Rights Service", "API and workflow", "Receives objections and propagates suppression")
  ContainerDb(evidence, "Evidence Store", "Audit log", "Manifests, reports, test results and propagation logs")
}

System_Ext(sources, "External Data Sources", "Web, vendors and licensed datasets")

Rel(engineer, registry, "Registers sources")
Rel(sources, ingest, "Feeds corpus")
Rel(registry, ingest, "Supplies source policy")
Rel(ingest, train, "Releases curated dataset")
Rel(train, serve, "Promotes model version")
Rel(subject, rights, "Submits objection")
Rel(rights, registry, "Resolves affected datasets")
Rel(rights, train, "Requests retraining or unlearning")
Rel(rights, serve, "Publishes suppression")
Rel(ingest, evidence, "Writes deletion report")
Rel(train, evidence, "Writes evaluation results")
Rel(serve, evidence, "Writes runtime logs")
Rel(dpo, evidence, "Reviews evidence")
```

The gates are the release relationships between containers. A dataset does not move from ingestion to training without a deletion report, and a model does not move from training to serving without memorization results. The evidence store is what makes those gates auditable.

The control plane is not a document. It is the set of gates that can stop a dataset or a model from moving to the next stage. If a gate cannot fail a build, it is not a control; it is a comment. The same discipline we apply to infrastructure - policy as code, immutable artifacts, reproducible builds - applies here. A data protection control that lives only in a PDF is not enforceable at runtime.

## The AI Act will not save you

The AI Act and the GDPR are often discussed as one compliance stack. They are not. The AI Act regulates market access, product safety, risk classification, and provider transparency. The GDPR regulates the lawfulness of personal data processing. They have different legal bases, different regulators, and different evidence files.[^13]

A CE mark, a quality management system conformant with EN 18286, or an Article 50 transparency notice does not create a lawful basis under Article 6. A high-risk system can be fully conformant with the AI Act and still fail the GDPR because its training data was over-collected, its special-category handling was inadequate, or its objection path does not work. The reverse is also true: a GDPR-compliant data pipeline does not make a high-risk system safe.

The timelines diverge as well. Changes to AI Act high-risk timelines, including the proposed shift to December 2027 under the separate AI Omnibus, do not move GDPR obligations.[^15] Data protection authorities enforce now. For global teams, the territorial point is simpler than the timeline: the GDPR follows the offer of goods or services to people in the EU, not the location of the training cluster.[^12] The weights do not have a jurisdiction; the service does. A team in Singapore, London, or San Francisco inherits the pipeline requirements as soon as its model serves European users.

| Question | GDPR | EU AI Act |
| --- | --- | --- |
| May we process the data? | Article 6 and Article 9; DPA oversight | Not the question |
| Is the system safe and conformant? | Not the question | Risk classification, quality management, technical documentation, market surveillance |
| What must affected people be told? | Articles 12 to 15 transparency and access | Article 50 disclosure duties, where applicable |
| How is risk assessed? | DPIA under Article 35 | Risk management under Article 9 and the quality management system |
| What if something goes wrong? | Breach notification under Article 33 | Serious-incident reporting under Article 73 |

Two regulators, two evidence files. The same dataset can appear in both, but the argument is different: in the GDPR file it is evidence of lawfulness and necessity; in the AI Act file it is evidence of data governance and risk control. Other frameworks, such as NIST AI RMF or ISO/IEC 42001, can organize the same evidence, but they do not decide lawfulness either. Do not let one file stand in for the other.

## What to do before trilogue closes

The final text is still being negotiated. That is exactly why the architecture should not wait for it. Four issues in trilogue will decide how much of this becomes mandatory: whether the third-party interest survives, whether the Article 21 objection remains unconditional, whether Article 9(2)(k) requires erasure before suppression, and whether the recital is aligned with the article. The third changes the engineering scope most; the second determines how much of the rights plane is real.

Seven changes are worth making now, whether or not Article 88bis survives in its current form.

1. **Replace the generic LIA with an AI-LIA.** Evaluate model architecture, dataset provenance, memorization risk, serving controls, and the necessity of each data source. Keep the assessment versioned with the model, not filed once and forgotten.
2. **Build a provenance ledger.** For every source, record origin, collection method, contractual basis, robots and terms-of-service status, sensitivity class, retention, and deletion state. If you cannot answer "where did this row come from?", you cannot defend the interest.
3. **Separate collection from ingestion.** A dual pipeline lets you quarantine high-risk sources, strip identifiers, and re-run classification without re-architecting the model. The collection layer can be broad; the ingestion layer should be narrow and policy-gated.
4. **Instrument memorization.** Use canaries, extraction probes, membership-inference tests, and red-team prompts. Record results per model version. You cannot manage what you do not test.
5. **Treat objection as a product surface.** Build the API, the suppression store, the propagation job, and the audit log. Test the full path: object, suppress, refresh the retrieval index or retrain, and verify the output. An objection that only updates a CRM record is not an objection.
6. **Write the fallback.** Document the contextual LIA that would stand if Article 88bis were struck down. The same evidence supports both paths. The fallback is not a legal contingency; it is a design requirement.
7. **Do not outsource accountability to a data vendor.** The Council's third-party interest expansion may help the vendor's argument; it does not transfer your accountability. Contracts need provenance, deletion, audit, and indemnity terms.

The engineering work behind that list is unglamorous: data lineage, classifiers, evaluation harnesses, audit logs, and APIs that enforce policy at runtime. That is where we spend our time. If your team is building this control plane, the [EU AI regulation notes](https://www.jampuk.com/resources/ai-regulations/eu/) and our [compliance engineering work](https://www.jampuk.com/resources/compliance/) are the natural next reads.

The Digital Omnibus is an attempt to make the GDPR legible to machine learning. Its weakness is that it legislates a conclusion - legitimate interest - while leaving the evidence to engineering. The organizations that fare best will not be the ones that cite Article 88bis the loudest. They will be the ones that can show, per source and per model version, why the data was necessary, what was removed, how the model was tested, and how an objection traveled through the system.

That is the compliance work the clause cannot do for you. It is also the work that survives whichever way the Court of Justice rules. Statutes grant permission. Pipelines produce evidence.

## Sources

[^1]: European Commission, Proposal for a Regulation as regards the simplification of the digital legislative framework (Digital Omnibus), COM(2025) 837, 19 November 2025. https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52025PC0837
[^2]: Council of the European Union, Digital Omnibus mandate, ST 14756/26, October 2026. https://data.consilium.europa.eu/doc/document/ST-14756-2026-INIT/en/pdf
[^3]: European Data Protection Board and European Data Protection Supervisor, Joint Opinion 2/2026 on the Digital Omnibus, 10 February 2026. https://www.edpb.europa.eu/system/files/2026-02/edpb_edps_jointopinion_202602_digitalomnibus_en.pdf
[^4]: European Data Protection Board, Opinion 28/2024 on certain data protection aspects related to the processing of personal data in the context of AI models, December 2024. https://www.edpb.europa.eu/system/files/2024-12/edpb_opinion_202428_ai-models_en.pdf
[^5]: noyb, "AI: EU Member States approve 'digital expropriation' for AI companies." https://noyb.eu/en/ai-eu-member-states-approve-digital-expropriation-europeans-ai-companies
[^6]: Considerati, "Article 88c GDPR: A New Route for AI Processing." https://www.considerati.com/publications/article-88c-gdpr-a-new-route-for-ai-processing/
[^7]: European Law Blog, "A Tempting Shortcut: How the Digital Omnibus Would Re-engineer the GDPR." https://europeanlawblog.eu/a-tempting-shortcut-how-the-digital-omnibus-would-re/
[^8]: IAPP, "EU Digital Omnibus amendments to GDPR to facilitate AI training miss the mark." https://iapp.org/news/a/eu-digital-omnibus-amendments-to-gdpr-to-facilitate-ai-training-miss-the-mark
[^9]: Timelex, "One bus, many passengers: how the Digital Omnibus rewrites the EU digital rulebook." https://www.timelex.eu/en/blog/one-bus-many-passengers-how-digital-omnibus-rewrites-eu-digital-rulebook
[^10]: CCBE, comments on the Digital Omnibus on AI and the Digital Omnibus on Data, March 2026. https://www.ccbe.eu/fileadmin/speciality_distribution/public/documents/IT_LAW/ITL_Position_papers/EN_ITL_20260327_CCBE-comments-on-Digital-Omnibus-on-AI-and-Digital-Omnibus-on-Data.pdf
[^11]: European Law Institute, Proposed Revisions to the Digital Omnibus. https://www.europeanlawinstitute.eu/fileadmin/user_upload/p_eli/Publications/ELI_Response_-_Proposed_Revisions_to_the_Digital_Omnibus.pdf
[^12]: Regulation (EU) 2016/679 (General Data Protection Regulation). https://eur-lex.europa.eu/eli/reg/2016/679/oj
[^13]: Regulation (EU) 2024/1689 (Artificial Intelligence Act). https://eur-lex.europa.eu/eli/reg/2024/1689/oj
[^14]: noyb, Digital Omnibus Report, December 2025. https://noyb.eu/sites/default/files/2025-12/noyb%20Digital%20Omnibus%20Report%20V1.pdf
[^15]: European Commission, AI Omnibus proposal, COM(2025) 836, 19 November 2025. https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52025PC0836
