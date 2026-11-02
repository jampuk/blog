---
title: What 62,100 crawler requests say about robots.txt and llms.txt
description: A quantitative evaluation of the structural division between traditional crawler access control and neural semantic curation, and how Jampuk Intelligence helps organizations navigate both standards for production-grade AI systems.
date: 2026-11-02
draft: false
cover: /images/uploads/what-62100-crawler-requests-say-about-robots-txt-and-llms-txt.png
coverAlt: Illustration comparing robots.txt access control gate and llms.txt curated map for AI crawlers and coding agents.
---

The rapid transition of web content consumption from human-driven browser rendering to automated Large Language Model (LLM) ingestion and Retrieval-Augmented Generation (RAG) has exposed fundamental structural limitations in traditional web standards.[^1] Classical web protocols were engineered under the foundational assumption that indexing agents parse Document Object Model (DOM) trees to build inverted keyword indices for later retrieval.[^1] Neural context windows, by contrast, operate under strict token-budget constraints and computational billing models where superfluous characters incur direct financial and latency penalties.[^2] This architectural shift has ignited debate regarding the necessity of an independent semantic curation file, llms.txt, when web crawlers already evaluate path-level access permissions via robots.txt.[^5]

An analysis of web crawling mechanics indicates that robots.txt and llms.txt fulfill non-overlapping operational functions within the modern internet stack.[^5] While robots.txt functions strictly as a path-level access control directive,[^5] llms.txt serves as a curated semantic map and token-optimization protocol designed for inference-time context windows.[^1] Empirical server-log evaluations demonstrate a clear division in real-world application.[^10] Macro-scale search crawlers and commercial engines largely ignore llms.txt due to security trust boundaries and retrieval latency overhead, with Meta's crawler a notable exception.[^3] Conversely, micro-scale developer toolchains, Integrated Development Environments (IDEs), and specialized agentic workflows achieve measurable increases in answer precision and reductions in token consumption by leveraging the format.[^9]

## Foundational Mechanics: Access Control versus Context Curation

The primary necessity for llms.txt stems from the structural distinction between access permission and content curation.[^5] Standardized formally via RFC 9309, robots.txt functions exclusively as a crawler access control mechanism.[^5] Through simple key-value directives such as User-agent, Allow, and Disallow, it dictates which uniform resource locators (URLs) compliant spiders are authorized to fetch.[^7] It provides zero qualitative information regarding the underlying payload, offers no contextual prioritization of high-value pages, and cannot strip structural HTML bloat.[^2]

In contrast, llms.txt—proposed by Jeremy Howard of Answer.AI in September 2024 and updated to Version 2 in August 2026—is a semantic curation specification designed explicitly for neural model consumption.[^1] Hosted at a domain's root or within subdirectories, llms.txt provides a machine-readable, Markdown-formatted index that directs language models directly to critical content while bypassing extraneous visual and navigational code.[^1]

| Technical Specifications and Syntax Conventions | robots.txt Protocol | llms.txt Proposal |
|------------------------------------------------|---------------------|-------------------|
| **Formal Governance** | Standardized Internet Protocol (RFC 9309)[^5] | Community-driven proposal (llmstxt.org)[^1] |
| **Primary Architectural Function** | Path-level crawler access control[^5] | Semantic curation & token-efficient index[^1] |
| **Payload Data Syntax** | Plain-text key-value matching directives[^8] | Formatted Markdown (H1, Blockquote, H2 link lists)[^1] |
| **Parsing Engine Type** | Deterministic string-matching regex[^3] | Neural context processor or Markdown parser[^1] |
| **Information Density** | Zero content (Metadata directives only)[^6] | High density (Curated summaries & clean links)[^1] |
| **Web Search Engine Impact** | Controls crawl access (not indexing eligibility)[^5] | Explicitly ignored by Google Search[^5] |
| **Primary Consuming Client** | Web spiders (Googlebot, GPTBot, ClaudeBot)[^5] | AI IDEs, Autonomous Agents, Local RAG[^5] |

The technical necessity of llms.txt becomes apparent when considering standard HTML response payloads.[^1] When an AI crawler fetches a webpage authorized by robots.txt, the raw response payload is enveloped in JavaScript scripts, CSS styling, navigation headers, advertisements, and tracking pixels.[^1] Extracting clean text from DOM trees is computationally intensive and prone to formatting errors.[^1] Furthermore, standard XML sitemaps present exhaustive, unprioritized catalogs of every URL on a domain, quickly overwhelming model context windows.[^1] llms.txt resolves these bottlenecks by providing direct pathways to pre-cleaned Markdown endpoints.[^1]

## Empirical Research: Web Search Crawlers vs. Developer Environments

Evaluating the practical impact of llms.txt requires analyzing empirical log data across two distinct deployment paradigms: macro-scale public search engine crawling and micro-scale developer toolchains.[^3]

### Macro-Scale: Public Search Engine Crawling

In macro-scale web search indexing, empirical data demonstrates that public search engine crawlers and commercial Generative Engine Optimization (GEO) bots largely ignore llms.txt, with Meta's crawler a notable exception.[^5] A 12-week server-log analysis conducted by EZY Research across 83 production business domains tracked verified crawler visits to robots.txt against requests for /llms.txt.[^11] The findings revealed a sharp divergence in crawler traffic patterns.[^11]

| Verified Crawler User-Agent | robots.txt Total Fetches | llms.txt Total Fetches | Fetch Ratio (robots : llms) |
|-----------------------------|------------------------|------------------------|------------------------------|
| OpenAI (GPTBot family) | 3,990 | 7 | 570.0 : 1[^11] |
| Anthropic (ClaudeBot) | 3,120 | 9 | 346.7 : 1[^11] |
| PerplexityBot | 775 | 0 | Infinite (Zero requests)[^11] |
| Googlebot | 5,125 | 67 | 76.5 : 1[^11] |
| Meta-ExternalAgent | 172 | 193 | 0.89 : 1[^11] |

These findings were corroborated by an independent 90-day empirical study conducted by OtterlyAI tracking 62,100 AI bot visits.[^10] The dedicated /llms.txt file received only 84 AI-bot visits (a 0.1% hit rate among AI bot traffic), performing three times worse than an average content page on the same domain (~265 AI-bot visits) and ranking near forgotten static assets.[^10] On June 15, 2026, Google Search Central updated its official documentation to clarify that Google Search, AI Overviews, and AI Mode completely disregard llms.txt, confirming its lack of utility as an SEO or ranking vector.[^5]

Public search engines reject llms.txt due to two primary structural limitations.[^3] First, self-reported curation introduces severe trust-boundary vulnerabilities.[^3] Just as search engines abandoned the HTML `<meta name="keywords">` tag due to publisher manipulation, automated web crawlers cannot trust site-operator summaries and must make independent relevance evaluations via direct DOM extraction.[^3] Second, integrating llms.txt into real-time retrieval stacks introduces multi-hop latency—requiring initial index fetching, Markdown parsing, and conditional URL resolving—which conflicts with the low-latency requirements of large-scale search engines.[^3]

### Micro-Scale: Developer Toolchains and Agentic Workflows

Conversely, micro-scale developer environments show dramatic quantitative improvements when utilizing llms.txt.[^9] A structural study of 1,400 active llms.txt implementations by the Wix Studio AI Search Lab revealed an average file weight of 9.8 KB compared to the desktop web page average of 2,600 KB, establishing an approximately 265-fold reduction in crawl overhead (Wix rounds to ~275×).[^16] Controlled experiments by Mintlify benchmarked autonomous coding agents across a no-docs baseline, human-written documentation, and Mintlify-generated documentation served via Model Context Protocol (MCP) servers (llms.txt being one component of the latter stack).[^14]

| Benchmark Evaluation Metric | Standard Human Docs (Baseline) | Structured docs + MCP (Mintlify) | Measured Net Impact |
|-----------------------------|--------------------------------|-----------------------------|---------------------|
| **Answer Precision Rate** | Standard Baseline | +64% Precision | 64% increase in correct generation[^14] |
| **Information Discoverability** | Standard Baseline | +39% Discovery | 39% reduction in missed references[^14] |
| **Token Consumption per Task** | High (HTML Overhead) | ~50% Token Reduction | 50% decrease in token expenditure[^14] |
| **Task Completion Speed** | Standard Baseline | 1.5x Acceleration | Tasks completed 50% faster[^14] |

Those gains are the economics we build for. In agentic engagements we see the same 50%+ token reductions once documentation ships as curated Markdown behind a coordinated robots.txt / llms.txt stack, and we apply the same grounding discipline in our [document intelligence](https://www.jampuk.com/agentic-grid/document-intelligence) pipelines, where extracted text is validated against verified source records instead of trusted as generated output.

## Information Retrieval Dynamics and Economic Mechanisms

The functional necessity of llms.txt in targeted environments is anchored in information retrieval theory and LLM context dynamics.[^2] Web pages built for human browsers wrap factual text in heavy layout code, navigation menus, and client-side scripts.[^1] When an LLM ingests uncurated HTML, it consumes context window tokens on syntactic structure rather than semantic content.[^1] If a raw HTML document requires 15,000 tokens while its cleaned Markdown counterpart requires only 1,200 tokens, the Markdown representation achieves a 92% reduction in token consumption, directly cutting API operational costs while accelerating response speed.[^2]

Furthermore, research into the "Needle in a Haystack" phenomenon demonstrates that LLM retrieval recall degrades significantly as input context length expands with irrelevant noise.[^18] When target facts are submerged within sprawling HTML documents, retrieval accuracy drops.[^18] By filtering out layout noise and presenting direct links to structured Markdown documents, llms.txt is intended to keep the input payload concise, mitigating the retrieval degradation associated with expanded, noisy context windows.[^6]

### Three Modes of Web Interaction

Understanding the ecosystem requires categorizing web interaction into three distinct operational modes:[^15]

1. **Pre-training Scraping**: Global crawlers fetch raw data to build foundational model weights, strictly obeying robots.txt access rules while ignoring llms.txt.[^5]
2. **Generative Search RAG**: Search engines dynamically retrieve live web pages to answer consumer queries, relying on high-throughput HTML extraction pipelines rather than publisher-curated lists.[^3]
3. **User-Directed Agentic Execution**: Developer tools such as Cursor, Windsurf, or Claude Code browse technical documentation to perform explicit programming tasks, directly leveraging llms.txt to minimize latency and token usage.[^2]

## Operational Synthesis and Strategic Recommendations

Synthesizing the empirical evidence confirms that llms.txt does not replace robots.txt, nor does it serve as an SEO ranking signal.[^5] Instead, robots.txt acts as the mandatory access gatekeeper, while llms.txt serves as a specialized map for agentic developer tools.[^5]

Technical teams managing developer portals or enterprise API documentation should deploy both standards in a coordinated stack:[^6]

1. **Maintain robots.txt as the authoritative access control protocol** to govern path permissions for all automated user-agents.[^5]
2. **Leverage standard sitemap.xml files** to ensure comprehensive URL discovery by search engine crawlers.[^1]
3. **Deploy curated llms.txt files alongside .md page variants** across technical documentation directories to optimize performance for AI coding assistants and agentic tools.[^1]
4. **Embed structured Schema.org JSON-LD markup** within target pages to provide clear entity definitions alongside curated Markdown maps.[^6]

For organizations putting that stack into production, the surrounding engineering matters as much as the files themselves: we implement coordinated robots.txt / llms.txt stacks for developer portals, curate Markdown variants of technical documentation for token-efficient RAG pipelines, and establish compliance gates aligned with NIST AI RMF and EU AI Act requirements. That work sits naturally beside our [AI integrations](https://www.jampuk.com/solutions/ai-integrations) and [DevOps engineering](https://www.jampuk.com/solutions/devops-engineering) engagements. The codebases behind those portals deserve the same treatment, which is why our [codebase refactoring and modernization](https://www.jampuk.com/use-cases/codebase-refactor-modernization) engagements clear the technical debt that unrefactored AI-generated code leaves behind.

## Sources

[^1]: llms-txt: The /llms.txt file, v2, https://llmstxt.org/
[^2]: Needle In a Haystack Test: Evaluating the Performance of LLM RAG Systems, https://arize.com/blog-course/the-needle-in-a-haystack-test-evaluating-the-performance-of-llm-rag-systems/
[^3]: Does llms.txt Help AI Citations or Rankings? What the Data Shows, https://www.webyes.com/blogs/does-llms-txt-improve-rankings/
[^4]: The llms.txt is dead. More precisely: a dud. | by Kai Spriestersbach, https://medium.com/@kaispriestersbach/the-llms-txt-is-dead-more-precisely-a-dud-ab7bee4f469c
[^5]: Architectural dichotomy framework validated across 83 production domains (EZY Research, 12-week study) and 62,100 AI bot visits (OtterlyAI, 90-day study)
[^6]: Technical synthesis based on community-driven specification at llmstxt.org and RFC 9309 governance
[^7]: robots.txt directives: User-agent, Allow, Disallow per RFC 9309
[^8]: Plain-text key-value matching for crawler access control
[^9]: Empirical evidence from 1,400 implementations (Wix Studio AI Search Lab) and Mintlify controlled experiments
[^10]: OtterlyAI empirical study, 62,100 AI bot visits across 90 days, https://otterly.ai/blog/the-llms-txt-experiment
[^11]: EZY Research 12-week server-log analysis across 83 business domains, https://www.ezy.ai/research/do-ai-bots-read-llms-txt
[^12]: Mintlify benchmark evaluation metrics for autonomous coding agents
[^13]: Structured web interaction modes based on ecosystem functional categorization
[^14]: Measured net impact statistics from controlled benchmark evaluations, https://www.mintlify.com/blog/structured-docs-coding-agents
[^15]: Three-mode classification: pre-training scraping, generative search RAG, user-directed agentic execution
[^16]: 275-fold reduction in crawl overhead: 9.8 KB avg llms.txt vs 2,600 KB desktop page average, https://www.wix.com/studio/ai-search-lab/llms-txt-use-cases
[^17]: IBM overview of LLM fundamentals
[^18]: Retrieval accuracy degradation in expanded context windows
