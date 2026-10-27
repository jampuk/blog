---
title: 'The velocity fallacy: what repository data says about AI-written code'
description: 'Six years of repository analytics, a matched control study, and a benchmark against senior engineers all point the same way: AI assistants raise authoring speed, then leave duplication, churn, and complexity behind. Here is the evidence, and the remediation path.'
date: 2026-10-05
draft: false
cover: /images/uploads/the-velocity-fallacy.png
tags:
  - field-notes
  - ai-engineering
  - code-quality
  - technical-debt
---

Every coding assistant makes the same promise, and the promise is real: type less, ship sooner. Developer surveys put daily assistant use above 63 percent of professional engineers, with another 14 percent planning near-term adoption, and it is easy to see why. The tools remove the blank-page problem and turn an afternoon of boilerplate into a handful of prompts.

The question we keep returning to is what the repository keeps afterward. An assistant optimizes for the request in front of it. It writes an atomic snippet that satisfies the immediate test, without a dependable model of your directory hierarchy, your canonical utility functions, or the module boundary you drew three years ago. That is not a character flaw in the model; it is the shape of the tool. But the consequences are measurable, and by now they have been measured repeatedly.

This note collects the strongest evidence we have found: six years of longitudinal repository analytics and three controlled studies on what AI-assisted authoring does to a codebase over time. The short version is that you buy a spike in velocity and finance it with permanent complexity. The longer version is below.

## The repository ledger: refactoring down, duplication up

Developer analytics platform GitClear analyzed more than 600 million changed lines across enterprise and open-source repositories between 2020 and 2026. The dataset is the closest thing we have to a longitudinal record of how assistant-driven code changes the composition of a codebase, and the trend lines are stark.

| Metric | Pre-AI baseline | 2025-2026 YTD | Direction |
| --- | --- | --- | --- |
| Refactored or moved lines | 21% to 25% | 3.8% | Down 82% |
| Copy or pasted lines | 8.3% to 9.4% | 15.7% | Up 67% |
| Short-term churn (revised within 14 days) | 3.3% | 7.1% | More than doubled |
| Block duplication (per 1M changed lines) | 40.3 | 73.0 | Up 81% |
| Cross-file calls (per 1k changed lines) | 343 | 223 | Down 35% |

Healthy evolution used to depend on continuous refactoring: moving, consolidating, and reshaping existing logic so new features land without eroding modularity. That activity has collapsed. Moved code fell below 10 percent of changed lines by 2024 and reached an all-time low of 3.8 percent in 2026. In 2024, for the first time in the dataset's history, within-commit copy and paste overtook moved lines, and it has kept climbing: developers now show roughly a fivefold preference for cloning code over abstracting it.

Churn tells the same story from a different angle. Churn measures the share of code that is reverted, discarded, or heavily modified within two weeks of being committed. From a 3.3 percent pre-AI baseline it rose to 7.1 percent, with newly authored lines churning as high as 7.9 percent. A growing fraction of assistant output is incomplete, misplaced, or wrong at the moment it is written.

### The propagation tax

The structural mechanism behind this is local context. When you ask a model to solve a functional task, it returns a self-contained answer tuned to that task. Because it lacks holistic awareness of the wider repository, it more often re-implements logic in the local file than links to a utility function that already exists elsewhere.

That isolates new code into structural islands, and the connectivity numbers show it: cross-file method calls dropped by 35 percent, while duplicated regions of five or more consecutive lines expanded by 81 percent. The cost of this shows up later, as what maintainers call a propagation tax. When a developer fixes a duplicated block to correct a bug or update a business rule, they take on an unrecorded obligation to find, evaluate, and patch every identical sibling across unrelated files. Cloned code correlates with a 15 to 50 percent increase in downstream defects, not because the first copy was functionally wrong, but because sibling copies drift as maintenance patches land unevenly across undocumented duplicates.

### Model collapse

There is a second-order risk worth naming. As public repositories fill with unrefactored, duplicated assistant output, the next generation of foundation models trains on progressively degraded source data. That feedback loop threatens to institutionalize these architectural anti-patterns inside the very tools generating the code. The debt compounds in the training set, not just in your repository.

## The velocity illusion: what the CMU study measured

The strongest controlled evidence comes from Carnegie Mellon University's Software and Societal Systems Department. The team used a difference-in-differences design to track 807 open-source GitHub repositories that adopted the Cursor AI environment between January 2024 and March 2025, comparing them against a matched control group of 1,380 non-AI repositories and scanning both monthly with SonarQube through August 2025.

| Post-adoption | Lines added | Commit volume | Static warnings | Cyclomatic complexity |
| --- | --- | --- | --- | --- |
| Month 1 | +281.3% | +55.4% | +20% to +25% | +25% to +35% |
| Month 2 | +48.4% | +14.5% | +29.7% | +40.7% |
| Month 3+ | 0% | 0% | +29.7% | +40.7% |

The first month is dramatic: lines added spike by 281.3 percent and commit volume by 55.4 percent. Then the gain evaporates. By the third month, commits and code addition return to baseline, and there is no sustained speed advantage over the control repositories.

The quality cost does not evaporate with it. Static analysis warnings settle at an average of 29.7 percent above baseline and stay there, while cyclomatic complexity rises 40.7 percent, a magnitude that routine codebase growth does not explain. The initial speed advantage is spent navigating tangled control logic, resolving warnings, and debugging integration defects introduced during the early generation phase.

### Perception versus measurement

The perception gap is worth its own note. In a controlled productivity study by the nonprofit research institute METR, experienced open-source developers were asked to complete complex, multi-hour tasks with and without state-of-the-art AI assistance. On measured completion time they took roughly 20 percent longer with the tools. Subjectively, they reported feeling faster and more productive.

The explanation is not self-deception so much as a shift in workload. Assistants remove the active friction of writing initial code and replace it with the passive cognitive load of reading, auditing, and debugging generated output. Reading feels lighter than writing. It is not necessarily faster, particularly once subtle logic edge cases enter the picture.

## Measured against senior engineers

To compare AI output against a human standard, Asfandyar et al. (2025) benchmarked 642 solutions generated by leading LLMs, including GPT-4 and Claude 3, against 107 control solutions written by senior engineers with at least ten years of experience, across 107 standardized programming tasks. The solutions were profiled for maintainability, scanned for security defects, and measured at runtime.

| Dimension | Senior developer baseline | LLM output | Deviation |
| --- | --- | --- | --- |
| Cyclomatic complexity | Modular baseline | +34% | Harder to maintain |
| Duplication factor | 1.0x | 2.1x | Structural redundancy |
| OWASP Top 10 defect rate | 8.4% | 22.1% | +163% |
| Runtime execution speed | Baseline | 15% to 40% slower | Efficiency penalty |
| Memory draw | Baseline | More than 25% higher | Inefficient allocation |

The study found a strong correlation between task complexity and quality degradation. On simple algorithmic challenges, LLMs achieve functional correctness. On multi-step system problems, their output exhibits structural entanglement, resource inefficiency, and security defects at rates the senior baseline does not approach. Security analysis from Stanford and static scans from Snyk point the same direction: because models optimize for local syntax completion rather than system boundaries, the suggested code skews permissive, with missing input sanitization, exposed CORS configurations, unencrypted token storage, and absent role checks on administrative routes.

## How vibe-coded apps fail in the wild

When prompting replaces architecture, the failures are not random. They are systematic, and they cluster in the places where local correctness is not enough. The catalog from production rescues reads the same almost every time.

- **Authorization lives in the UI.** The interface hides other tenants' data, but no database row-level security enforces it, so anyone with browser developer tools can read or overwrite records that are not theirs.
- **Payment lifecycles are half-wired.** Checkout works because it was tested. Refund, cancellation, and dispute webhooks were never handled, so users who cancel keep paid access and consume unbilled resources.
- **The database is shipped to the browser.** Client-side filtering pulls entire tables over the wire, producing 500KB and larger payloads per page and an application that buckles as the table grows.
- **Reprompting duplicates automation.** Each round of prompting adds overlapping handlers and event listeners, and users receive duplicate emails while webhooks fire twice per event.
- **No network error handling.** A dropped connection yields blank screens, unhandled promise rejections, or infinite spinners, because nothing wraps the fetch calls.
- **Secrets migrate into prompts.** Service keys, database passwords, and API tokens pasted into a chat window are now permanently logged in a third-party transcript history.

Each of these survives surface-level testing and fails under real traffic, multi-tenant data access, and transactional edge cases. The demo and the product diverge precisely where the model had no reason to look.

## Triage, not rewrite

The economics have shifted accordingly. In industry surveys, 81 percent of enterprise technology leaders report an increase in production issues tied to AI-generated code, and 43 percent of AI code additions require manual debugging and refactoring by senior engineers before they are safe. When a fragile build hits its ceiling, the choice is usually framed as rebuild or do nothing. Standard agency rebuild quotes run from $25,000 to $50,000 and up, and they risk discarding hidden business rules that only exist in the code even if the code is messy.

Structured remediation is the third option, and it is the one we practice. It runs in three stages.

1. **Architectural audit and triage.** A senior engineer reads the repository to separate salvageable application logic from structural flaws, mapping security vulnerabilities, circular dependencies, and missing database authorization rules. Credential rotation, data access leaks, and transactional payment webhooks come first.
2. **Regression guardrails and stability contracts.** Before any refactor, integration tests are established across the core user journeys, static analysis quality gates are configured, and modified modules are isolated from unrelated application state so that the tooling cannot break established behavior.
3. **Targeted modernization.** Cloned blocks are consolidated into shared utilities, client-side filtering is replaced with indexed server-side queries, and cyclomatic complexity is reduced, restoring maintainability while the validated UI and product direction stay intact.

Two of our field engagements map onto exactly this shape: the [vibe-coded app rescue](https://www.jampuk.com/use-cases/vibe-coded-app-rescue) for fragile AI-built software, and [codebase refactoring and modernization](https://www.jampuk.com/use-cases/codebase-refactor-modernization) for high-churn AI technical debt.

## What engineering leadership should change

None of this argues against using assistants. We use them, heavily, as instrumented leverage. It argues against using them without review discipline. Four changes to make that real:

- **Realign the metrics.** Lines added and commit volume reward cloning and churn. Track maintainability, refactoring ratio, static warning trends, and long-term defect rates instead.
- **Treat AI output as unverified draft material.** Every generated change should pass the same gates as any other commit: static application security testing, complexity limits, and review by a senior engineer before it reaches production.
- **Enforce canonical architecture.** Establish centralized, documented utility libraries and clear boundaries so an assistant short-circuits toward an existing module instead of duplicating one.
- **Remediate instead of rewriting.** When an AI-built product is unstable, systematic triage, data isolation hardening, and targeted refactoring stabilize the foundation without throwing away what already works.

The tools are leverage, not authors. Velocity is not free; it is debt issued at whatever interest rate your review discipline sets. The teams that ship durably in this era are not the ones who prompt the fastest. They are the ones who keep a hand on the architecture while the agents do the typing.

## Sources

- GitClear, *AI Copilot Code Quality: 2025 Research*. [gitclear.com/ai_assistant_code_quality_2025_research](https://www.gitclear.com/ai_assistant_code_quality_2025_research)
- GitClear, *The Maintainability Gap: 2026 AI Code Quality Research*. [gitclear.com/the_ai_code_quality_maintainability_gap](https://www.gitclear.com/the_ai_code_quality_maintainability_gap)
- Carnegie Mellon University, *The Hidden Cost of AI Speed*. [cs.cmu.edu/news/2026/hidden-cost-ai-speed](https://www.cs.cmu.edu/news/2026/hidden-cost-ai-speed) and *Does AI-Assisted Coding Deliver? A Difference-in-Differences Study*. [arxiv.org/html/2511.04427v2](https://arxiv.org/html/2511.04427v2)
- METR, *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*. [metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study)
- Asfandyar et al., *Benchmarking Quality and Maintainability of AI Generated Code* (2025). [researchgate.net/publication/397322799](https://www.researchgate.net/publication/397322799_Benchmarking_Quality_and_Maintainability_of_AI_Generated_Code)
