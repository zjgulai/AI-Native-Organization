# 多智能体系统的控制与治理：官方一手资料证据汇编

> 交付物性质：**外部官方依据**汇编（可追溯引用）。只陈述文件内容，不含设计建议。
> 证据强度标注：**强** = 标准机构／监管机关／厂商官方文档原文（已直接抓取全文或 PDF 全文）；**中** = 官方页面已存在但正文未完整取得（反爬／JS 渲染／网络受限）；**弱** = 仅有二手转述，未取得一手原文。
> 抓取时间：本轮会话；检索受限情况见文末「未能核实的部分」。

---

## 1. NIST：AI RMF 1.0、生成式 AI Profile、2025–2026 的 agentic 动作

### 1.1 NIST AI 100-1《Artificial Intelligence Risk Management Framework (AI RMF 1.0)》
- 版本：NIST AI 100-1｜发布：**2023 年 1 月**（DOI: 10.6028/NIST.AI.100-1）
- URL：[nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) ｜ 项目页 [nist.gov/itl/ai-risk-management-framework](https://www.nist.gov/itl/ai-risk-management-framework)
- 与「管理层控制」直接相关的原文（已用 PDF 全文核验）：
  - **GOVERN 2 类别定义**：「Accountability structures are in place so that the appropriate teams and individuals are empowered, responsible, and trained for mapping, measuring, and managing AI risks.」
  - **GOVERN 2.1**：「Roles and responsibilities and lines of communication related to mapping, measuring, and managing AI risks are documented and are clear to individuals and teams throughout the organization.」
  - **GOVERN 2.3**：「Executive leadership of the organization takes responsibility for decisions about risks associated with AI system development and deployment.」
  - **GOVERN 3.2**：「Policies and procedures are in place to define and differentiate roles and responsibilities for **human-AI configurations** and oversight of AI systems.」
  - 关于「人机配置」跨度与人工监督必要性（第 5 章 "AI Risks and Trustworthiness" 相关讨论节）：「Human roles and responsibilities in decision making and overseeing AI systems need to be clearly defined and differentiated. **Human-AI configurations can span from fully autonomous to fully manual.** … Some AI systems may not require human oversight, such as models used to improve video compression. **Other systems may specifically require human oversight.**」
  - 「The GOVERN function provides organizations with the opportunity to clarify and define the roles and responsibilities for the humans in the Human-AI team configurations and those who are overseeing the AI system performance.」
  - 「AI risk management approaches for human-AI configurations will be augmented by ongoing research and evaluation. For example, **the degree to which humans are empowered and incentivized to challenge AI system output requires further studies.**」
- 证据强度：**强**（PDF 全文）。
- 备注：NIST 项目页声明「The AI RMF 1.0 is being revised as part of the White House AI Action Plan.」（页面原文）——即 1.0 有修订计划。

### 1.2 NIST AI 600-1《Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile》
- 版本：NIST AI 600-1｜发布：**2024 年 7 月**（封面署 "July 2024"；DOI: 10.6028/NIST.AI.600-1）
- URL：[nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- 「Human-AI Configuration」是该文件的 12 个 GAI 风险类别之一（§2.7），原文：
  - 「GAI system use can involve varying risks of misconfigurations and poor interactions between a system and a human who is interacting with it.」
  - 「…over time, humans may **over-rely** on GAI systems… This phenomenon is an example of **automation bias, or excessive deference to automated systems.** Automation bias can exacerbate other risks of GAI, such as risks of confabulation or risks of bias or homogenization.」
  - 「There may also be concerns about **emotional entanglement** between humans and GAI systems…」
  - 对应可信 AI 特性：「Accountable and Transparent, Explainable and Interpretable, … Safe, Valid and Reliable」
- 与管理层角色／升级／问责直接相关的建议行动（GOVERN 函数下的 Action ID，已核验原文表格）：
  - **GV-2.1-001**：「Establish organizational roles, policies, and procedures for communicating GAI incidents and performance to AI Actors and downstream stakeholders (including those potentially impacted)」
  - **GV-2.1-003**：「Establish processes to verify the AI Actors conducting GAI incident response tasks demonstrate and maintain the appropriate skills and training.」
  - **GV-2.1-005**：为举报组织违法或造成具体负面公共安全风险的吹哨人「Create mechanisms to provide protections for whistleblowers…」
  - **GV-3.2-001**：「Policies are in place to bolster oversight of GAI systems with **independent evaluations or assessments** … proportional to the identified risks.」
  - **GV-3.2-002**：「Consider adjustment of organizational roles and components across lifecycle stages of large or complex GAI systems, including: Test and evaluation, validation, and red-teaming…; Incident response and containment.」
  - **GV-3.2-003**：「Define **acceptable use policies** for GAI interfaces, modalities, and human-AI configurations (i.e., for chatbots and decision-making tasks), including criteria for the kinds of queries GAI applications should refuse to respond to.」
  - **GV-3.2-004**：「Establish policies for **user feedback mechanisms** for GAI systems which include thorough instructions and any mechanisms for **recourse**.」
- 证据强度：**强**（PDF 全文）。
- 备注：**AI 600-1 未设「智能体自主行动」专门风险类别**，其最接近的类别为 Human-AI Configuration，且框架是「人类误配／过度依赖」，而非「智能体自主行动的不可逆后果」。

### 1.3 NIST SP 800-53 Control Overlays for Securing AI Systems（COSAiS）
- 名称：SP 800-53 Control Overlays for Securing AI Systems（COSAiS）
- 关键日期（项目页原文）：**Concept Paper 于 2025 年 8 月 14 日**开放征求意见；页面 **Created July 10, 2025, Updated January 08, 2026**；2026-01-08 发布《Using and Fine-Tuning Predictive AI》annotated outline（讨论稿），反馈截止 2026-02-13。
- URL：[csrc.nist.gov/projects/cosais](https://csrc.nist.gov/projects/cosais) ｜ 用例页 [csrc.nist.gov/projects/cosais/use-cases](https://csrc.nist.gov/projects/cosais/use-cases)
- 与「管理层控制」直接相关的原文：五个拟定用例中明确包含**单智能体与多智能体**两类：
  - 「Using AI Agent Systems (AI Agents) – Single Agent」：Purpose —「AI agent systems have the capability for **autonomous decision-making and taking action to operate with limited human supervision** to achieve complex goals.」
  - 「Using AI Agent Systems (AI Agents) – Multi-Agent」：Purpose —「Multi-agent AI systems have the capability for autonomous decision-making and have **multiple agents working in concert** taking action to operate cooperatively with limited human supervision…」
  - 另三个用例：Adapting and Using Generative AI – Assistant/LLM、Using and Fine-Tuning Predictive AI、Security Controls for AI Developers。overlay 将复用 SP 800-53、SP 800-218A、Draft AI 800-1、AI 100-2e2025。
- 证据强度：**强**（CSRC 官方页面原文，已直接抓取）。
- 状态提示：截至核验时，**agentic 用例的 overlay 文本本身尚未发布**，仅有 concept paper 与用例说明；不能引用为「已生效控制」。

### 1.4 NIST AI 100-2e2025《Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations》
- 版本：NIST AI 100-2e2025｜**2025 年 3 月**（Editorial Review Board 通过日 2025-03-20）
- URL：[nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-2e2025.pdf](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-2e2025.pdf) ｜ 条目页 [csrc.nist.gov/pubs/ai/100/2/e2025/final](https://csrc.nist.gov/pubs/ai/100/2/e2025/final)
- 与 agentic 相关：全文对「agent」的实质讨论有限；正文中的 agent 相关条目为**参考文献**（例：「[353] U.S. AI Safety Institute Technical Staff. Strengthening ai agent hijacking evaluations」）。**该版未把「agent hijacking」设为本体分类条目**。
- 证据强度：**强**（PDF 全文核验）。**注意**：第三方称该版「大幅扩充 agentic 攻击目录」的说法，未能在原文中得到支撑。

### 1.5 NIST 2025–2026 的 agentic 后续动作
- **未取得 NIST 官方发布的「agentic AI profile」或「agentic control overlay」正式文本。** 仅核验到 COSAiS 项目页把单/多智能体列为拟定用例（见 1.3）。
- 二手来源（**弱**，未取得一手原文，不作结论）：Cloud Security Alliance 研究简报提及 NIST AI Agent Standards Initiative、2026-01-08 Federal Register RFI（docket NIST-2025-0035）、预期 Q4 2026 的 "AI Agent Interoperability Profile"，以及 NIST IR 8596 初始草稿（2025-12-16）、NCCoE《Accelerating the Adoption of Software and AI Agent Identity and Authorization》概念文件（2026-02-05）。上述条目**需以 nist.gov / csrc.nist.gov 一手页面复核后方可引用**。
- 证据强度：**弱**。

---

## 2. OWASP：Agentic 威胁清单、LLM Top 10（2025 与 2026）、Agentic Security Initiative、AIVSS

### 2.1 《Agentic AI – Threats and Mitigations》（OWASP GenAI Security Project / Agentic Security Initiative）
- 版本与日期：页面标注 **February 17, 2025**；封面为 v1.0（第三方转载见到 v1.1 标题）。页面自述：「This document is the first in a series of guides from the OWASP Agentic Security Initiative (ASI) to provide a **threat-model-based reference** of emerging agentic threats and discuss mitigations.」
- URL：[genai.owasp.org/resource/agentic-ai-threats-and-mitigations/](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/) ｜ 新闻稿 [genai.owasp.org/2025/12/09/...](https://genai.owasp.org/2025/12/09/owasp-genai-security-project-releases-top-10-risks-and-mitigations-for-agentic-ai-security)
- 「resource exhaustion / budget」类威胁是否在该文件内：**未能取得该 PDF 正文（见「未能核实的部分」）**，故不引用其内部威胁编号。可核验的替代一手来源见 2.3（ASI 清单）与 2.4（AIVSS，含 Agent Cascading Failures、Agent Untraceability）。
- 证据强度：**中**（官方资源页标题与日期已核验；正文未取得）。

### 2.2 OWASP Top 10 for LLM Applications **2025** — LLM06 Excessive Agency
- 版本：OWASP Top 10 for LLM Applications 2025（v2.0 系列）；条目页 [genai.owasp.org/llmrisk/llm062025-excessive-agency/](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/)
- 一手 markdown 全文（已抓取）：[github.com/OWASP/www-project-top-10-for-large-language-model-applications/…/LLM06_ExcessiveAgency.md](https://raw.githubusercontent.com/OWASP/www-project-top-10-for-large-language-model-applications/main/2_0_vulns/LLM06_ExcessiveAgency.md)
- 与委派／权限直接相关的原文：
  - 定义：「Excessive Agency is the vulnerability that enables **damaging actions to be performed in response to unexpected, ambiguous or manipulated outputs from an LLM**…」
  - **根因三条**：「The root cause of Excessive Agency is typically one or more of: **excessive functionality; excessive permissions; excessive autonomy.**」
  - 触发条件含**多智能体场景**：「direct/indirect prompt injection from a malicious user, an earlier invocation of a malicious/compromised extension, or **(in multi-agent/collaborative systems) a malicious/compromised peer agent.**」
  - 缓解「6. Require user approval」：「Utilise **human-in-the-loop control** to require a human to approve high-impact actions before they are taken.」
  - 缓解「7. Complete mediation」：「**Implement authorization in downstream systems rather than relying on an LLM to decide if an action is allowed or not.** Enforce the complete mediation principle…」
  - 缓解「5. Execute extensions in user's context」：「Track user authorization and security scope to ensure actions taken on behalf of a user are executed on downstream systems **in the context of that specific user**, and with the minimum privileges necessary. … require the user to authenticate via OAuth and with the minimum scope required.」
  - 限额类补充控制：「Implement **rate-limiting** to reduce the number of undesirable actions…」（列为「不阻止但限制损害」项）
- 证据强度：**强**（一手 markdown 全文）。
- **重要修正**：用户任务描述中的「LLM08 Vector/Embedding weaknesses」属于该版编制期条目编号；2025 年正式版的编号与名称需以官方条目页为准，本轮未逐条核验 LLM08 的 2025 编号归属。

### 2.3 OWASP Top 10 for Agentic Applications（2026 版）
- 名称与日期：**《OWASP Top 10 for Agentic Applications for 2026》，2025 年 12 月 9 日发布**（新闻稿日期线为 2025-12-10）
- URL：[genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) ｜ 发布稿：[genai.owasp.org/2025/12/09/...](https://genai.owasp.org/2025/12/09/owasp-genai-security-project-releases-top-10-risks-and-mitigations-for-agentic-ai-security)
- 风险清单（ASI01–ASI10）：ASI01 Agent Goal Hijack；**ASI02 Tool Misuse & Exploitation**；**ASI03 Identity & Privilege Abuse**；ASI04 Agentic Supply Chain Vulnerabilities；ASI05 Unexpected Code Execution (RCE)；ASI06 Memory & Context Poisoning；ASI07 Insecure Inter-Agent Communication；ASI08 Cascading Failures；**ASI09 Human-Agent Trust Exploitation**；ASI10 Rogue Agents。
- 与本任务「委派」相关的对应关系（**由 AIVSS v0.8 官方映射表给出的表述**，见 2.4）：Excessive Agency 在 agentic 语境中「can manifest as ASI02: Tool Misuse & Exploitation, ASI03: Identity & Privilege Abuse and ASI08: Cascading Failures.」
- 证据强度：**中—强**：清单名称与发布日期已由官方发布稿与官方资源页标题核验；逐条正文（含 ASI03 关于 **confused deputy** 的专门章节）**未取得**（Cloudflare 拦截）。

### 2.4 OWASP AIVSS v0.8《AIVSS Scoring System For OWASP Agentic AI Core Security Risks》
- 版本：**v0.8**（前版 v0.5）；官方页面显示 v1.0 计划于当年年底发布。页面未标注 v0.8 发布日期；页面新闻条目日期为 **Feb 27, 2026**（AIUC-1 交叉映射）。
- URL：[aivss.owasp.org](https://aivss.owasp.org/) ｜ PDF：[AIVSS v0.8 PDF](https://aivss.owasp.org/assets/publications/AIVSS%20Scoring%20System%20For%20OWASP%20Agentic%20AI%20Core%20Security%20Risks%20v0.8.pdf)
- 十大 Agentic Core Security Risks（已从 PDF 抓取原文章节名）：
  1. Agentic AI Tool Misuse 2. Agent Access Control Violation 3. Agent Cascading Failures 4. **Agent Orchestration and Multi-Agent Exploitation** 5. **Agent Identity Impersonation** 6. Agent Memory and Context Manipulation 7. Insecure Agent Critical Systems Interaction 8. Agent Supply Chain and Dependency Risk 9. **Agent Untraceability** 10. Agent Goal and Instruction Manipulation
- 与「审计／问责」直接相关的原文（§9 Agent Untraceability）：
  - 「Agent Untraceability Risk is the inability to accurately determine **the sequence of events, identities, and authorizations** that lead to an agent's actions.」
  - 「agents often act as **ephemeral proxies**, temporarily assuming the roles and permissions of the users or systems that trigger them. This creates a convoluted and transient trail of activity where a single logical operation can **span multiple identities and system logs**…」
  - 「The impact of this risk is severe, as it fundamentally undermines key pillars of security and governance: **traceability and accountability**. … creating a '**forensic black hole**' where the root cause cannot be definitively identified.」
  - 「**Loss of Chain-of-Action (Repudiation Risk)**: The lack of clear audit trail for [actions]…」
- 与「工具滥用／权限」直接相关的原文（§1 Agentic AI Tool Misuse 归因清单节选）：「Malicious injection or manipulation of tool specifications or schemata」「Lack of due diligence by an agent in tool selection」「**Absence of cryptographic provenance or attestation of tool origin**」「Usage of legacy authentication mechanisms like Basic auth or OAuth1 while accessing external tools」。
- 与「角色与责任」相关的原文（Executive Summary）：「AIVSS is aligned with the NIST AI Risk Management Framework's Govern, Map, Measure, and Manage functions. AIVSS establishes Govern elements through **defined roles and responsibilities for scoring**…」
- 另有 PDF §4.2「**Release Gates and Approval Mechanisms**」章节标题（正文未逐段核验）。
- 证据强度：**强**（PDF 全文）。

### 2.5 Agent Control Standard（ACS）与《State of Agentic AI Security and Governance》
- 名称与日期：**Agent Control Standard（ACS）**，2026 年 9 月 1–2 日宣布捐赠给 OWASP GenAI Security Project（官方发布稿 2026-09-01 / PR Newswire 2026-09-02）；**《State of Agentic AI Security and Governance》v2.01，2026 年 6 月 1 日**（v1.0 为 2025 年 7 月）。
- URL：[OWASP 发布稿](https://genai.owasp.org/2026/09/01/owasp-genai-security-project-unveils-2026-top-10-for-llm-applications-new-agent-control-standard-and-sponsors-as-community-tops-30000-members) ｜ [State of Agentic AI Security and Governance 2.01](https://genai.owasp.org/resource/state-of-agentic-ai-security-and-governance)
- 可核验的一手表述：ACS「complements the project's existing work on agentic AI risks, security controls, identity, **governance** and testing by extending that guidance toward **practical runtime enforcement**.」
- 证据强度：**中**（官方新闻稿原文；ACS 技术规范正文未取得，第三方称其定义 "Agent Control System"、"guardian agent" 执行点、OpenTelemetry + OCSF 可观测层——**弱，未核验**）。

### 2.6 OWASP GenAI LLM Top 10 **2026**
- 版本与日期：**2026 年 8 月 4 日**（官方 repo README 原文：「published August 4, 2026」，另有发布稿日期 2026-09-01/02）
- 一手 markdown：[GenAI-LLM-Top10 / 2026/final](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/tree/main/2026/final)
- 与本任务相关的**重要编号变更**（已抓取一手 markdown 核验）：
  - **LLM03:2026 Excessive Agency**（2025 版为 LLM06）——原文明确：「Within the context of agentic systems, Excessive Agency can manifest as ASI02: Tool Misuse & Exploitation, ASI03: Identity & Privilege Abuse and ASI08: Cascading Failures.」
  - 新增委派链要求（缓解 5 条）：「In **delegated or multi-agent workflows, preserve the original user context and authorization scope across chained tool or agent calls**, rather than relying only on the permissions of the calling agent or service identity.」
  - **LLM06:2026 Unbounded Consumption**（预算控制，见第 5 节）
- 证据强度：**强**（一手 markdown 全文）。

---

## 3. 云厂商的智能体身份与治理原语

### 3.1 Microsoft

| 文件名称 | 版本/状态 | 日期 | 关键原文要点 | URL | 证据强度 |
|---|---|---|---|---|---|
| What is Microsoft Entra Agent ID? | Microsoft Learn，产品文档 | Last updated **2026-06-24** | 「extends Microsoft Entra capabilities to AI agents… purpose-built identity constructs to authenticate, authorize, govern, and protect these **nonhuman identities**」；「Agent identity blueprints serve as templates for creating individual agent identities with **parent-child relationships**」；支持 OAuth 2.0 / MCP / A2A；「All agent authentication and activity is logged for compliance and audit.」 | [learn.microsoft.com/en-us/entra/agent-id/what-is-microsoft-entra-agent-id](https://learn.microsoft.com/en-us/entra/agent-id/what-is-microsoft-entra-agent-id) | **强**（全文） |
| What is the Microsoft agent identity platform | Microsoft Learn | Last updated **2026-06-16** | 三个核心身份构造：**agent identity blueprint / agent identity / agent's user account**；「OAuth 2.0 allows agents to request access tokens that authorize them to access resources **on behalf of themselves or users**, supporting both application-only and delegated access scenarios」；含 agent registry（「a centralized repository for registering and managing agents across an organization」） | [learn.microsoft.com/en-us/entra/agent-id/what-is-agent-id-platform](https://learn.microsoft.com/en-us/entra/agent-id/what-is-agent-id-platform) | **强**（全文） |
| Least privilege for AI agents (agentic identities + RBAC) | Microsoft Learn，Zero Trust / SFI pattern | Last updated **2026-07-15** | 「the security question shifts from whether an agent can complete a task to **whether it should be allowed to perform each action, against which resources, and under whose authority**」；「maintain a **stable, lifecycle-managed agent identity** while making privileges **time-limited** through just-in-time (JIT) entitlements」；五类安全挑战含 **Identity ambiguity**（「unclear which principal is responsible for an action」）、**Permission creep and excessive aggregate privileges**、**Over-broad tool access**、**Weak audit trails**、**Slow revocation and incomplete containment**；建议控制：「Use a unique, dedicated agent identity with a **named owner/sponsor and approver**」「**Deny unreviewed tools, plugins, integrations, and cross-tenant or guest paths by default**」「Log agent identity, role, effective scope, action, resource, **correlation ID**, and '**on behalf of**' user where applicable」；关键成功因素含「Mean time to revoke or disable an agent identity (including token invalidation)」 | [learn.microsoft.com/en-us/security/zero-trust/sfi/least-privilege-for-ai-agents](https://learn.microsoft.com/en-us/security/zero-trust/sfi/least-privilege-for-ai-agents) | **强**（全文） |
| Microsoft Agent 365 overview | Microsoft Learn，产品文档 | 页面未显示版本；页面引述 GA 与许可（第三方称 GA 2026-05-01） | 「Microsoft Agent 365 delivers end-to-end protection for every agent by extending Microsoft's enterprise-grade identity, data, and threat-defense capabilities…」；「Microsoft Entra enforces consistent, risk-based access controls for users **and agents acting on their behalf**, while Microsoft Purview provides deep visibility into data risks…**Establish consistent guardrails for AI agents by centralizing lifecycle management, access control, and compliance across the enterprise.**」；经「Agent 365 registry in the Microsoft 365 admin center」管理生命周期 | [learn.microsoft.com/en-us/microsoft-agent-365/overview](https://learn.microsoft.com/en-us/microsoft-agent-365/overview) | **中**（搜索摘要引用官方页面原文；未直接抓取全文） |
| Audit user interactions with your agents in Microsoft Purview | Microsoft Learn（Copilot Studio 发布计划，**已归档**） | 启用日期行 **Jan 10, 2025**；标记为 archived | 「Copilot Studio logs user interactions with generative AI and **sends the logs to Purview**. These logs give you context for analyzing and understanding the usability of conversations or agents. The logs show which knowledge sources users accessed and include **the text transcript of the conversation**.」；「This feature gives admins a complete audit record of end-user activities when users interact with agents.」 | [learn.microsoft.com/en-us/power-platform/release-plan/2024wave2/…/audit-user-interactions-agents-purview](https://learn.microsoft.com/en-us/power-platform/release-plan/2024wave2/microsoft-copilot-studio/audit-user-interactions-agents-purview) | **强**（全文；但内容已归档） |
| Auditing data agent interactions in Microsoft Purview (preview) | Microsoft Fabric 文档，preview | 无版本号 | 「With audit logging enabled, **user prompts, AI responses, and interaction metadata are captured and stored in Microsoft Purview** through the Microsoft 365 audit pipeline.」「All records are stored in the **Microsoft 365 unified audit log**.」 | [learn.microsoft.com/en-us/fabric/data-science/data-agent-purview-governance](https://learn.microsoft.com/en-us/fabric/data-science/data-agent-purview-governance) | **中**（搜索摘要引用官方原文） |
| Quotas and limits for Microsoft Foundry Agent Service | Microsoft Learn | 无版本号 | 「Foundry Agent Service enforces limits in two places: **Agent Service limits** … **Model limits. Quotas and rate limits for the model deployments your agents call.**」「Agents follow the quotas and rate limits for the model deployments they use.」 | [learn.microsoft.com/en-us/azure/foundry/agents/concepts/limits-quotas-regions](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/limits-quotas-regions) | **中** |
| Manage and increase quotas for resources with Microsoft Foundry | Microsoft Learn | 无版本号 | 「Quota provides the flexibility to actively manage the allocation of rate limits across the deployments within your subscription. Azure assigns quota **per subscription, per region, and per model in units of tokens per minute (TPM)**.」 | [learn.microsoft.com/en-us/azure/foundry/how-to/quota](https://learn.microsoft.com/en-us/azure/foundry/how-to/quota) | **中** |
| Copilot Studio security and governance | Microsoft Learn，Key concepts | 无版本号 | 「Copilot Studio follows a number of security and governance controls and processes, including geographic data residency, **data loss prevention (DLP)**, multiple standards certifications, regulatory compliance, environment routing…」；「**Disable agent publishing**: Your admin can use the Power Platform admin center to turn off the ability to publish agents that use generative AI features for your tenant.」；「**Microsoft Agent 365 serves as a central control plane to observe, govern, and secure Copilot Studio agents.** … These identities can be governed with controls such as **Conditional Access, role-based and attribute-based access controls, and access governance workflows**.」 | [learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance) | **中**（搜索摘要引用官方原文） |
| Using function tools with human in the loop approvals（Microsoft Agent Framework） | Microsoft Learn | 无版本号 | 「You can require human approval before a tool is executed by wrapping it with `tool.ApprovalRequiredFunc`」 | [learn.microsoft.com/en-us/agent-framework/agents/tools/tool-approval](https://learn.microsoft.com/en-us/agent-framework/agents/tools/tool-approval) | **中** |

### 3.2 AWS

| 文件名称 | 版本/日期 | 关键原文要点 | URL | 证据强度 |
|---|---|---|---|---|
| **AWS Well-Architected Agentic AI Lens**（独立 lens，六支柱） | Publication date: **June 10, 2026** | 「Agents act autonomously: Agents invoke tools, modify data, and interact with external systems **without explicit human instruction at each step**. This autonomy demands security controls, **permission boundaries, and human oversight patterns** purpose-built for autonomous operations.」；Responsible agentic AI 五原则含 **Bounded autonomy**、**Transparency and explainability**（「Agent decisions are logged, traced, and auditable」）、**Human oversight**（「**Tiered oversight models match the level of human review to the risk and reversibility of each agent action**」）；成本列为「Cost optimization: … implementing **full cost visibility**」 | [agentic-ai-lens.html](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentic-ai-lens.html) | **强**（全文） |
| AGENTSEC03「Agent identity and permission management」+ AGENTSEC03-BP03「Implement least privilege with dynamic boundaries」 | 同上 lens | 两种委派形态：「Explicitly **on behalf of a user**, where a human initiated the request and the agent's actions must be bounded by that user's permissions」／「**Autonomously**, where the agent acts without a user in the loop」；「**When an agent acts on behalf of a user, the user context propagates as signed token claims through the call chain without the agent ever assuming the user's credentials.**」；「Agents operate under **service identities that are distinct from human identities**, and audit trails attribute every action unambiguously to either an agent or a human actor.」；**三层身份**：「The **agent identity** … (for example, an **AgentCore Workload Identity** with a unique ARN). The **service identity** is what the agent runs as when it invokes AWS services… The **transaction identity** is the per-invocation context carried with a single agent call」；反面模式：「Delegated access implemented by **having the agent assume a user's role rather than carrying user context as signed token claims**, which collapses the audit trail and gives the agent the user's full permission set for the duration of the session.」 | [agentsec03.html](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentsec03.html) ｜ [agentsec03-bp03.html](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentsec03-bp03.html) | **强**（全文） |
| AGENTSEC04／AGENTSEC04-BP02「Human-in-the-loop for critical decisions」 | 同上 lens | 见第 6 节 | [agentsec04.html](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentsec04.html) ｜ [agentsec04-bp02.html](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentsec04-bp02.html) | **强**（全文） |
| AGENTSEC07「Human oversight protection and agent containment」 | 同上 lens | 「Behavioral baselines exist for each agent, and deviations trigger **rapid containment through credential revocation and circuit-breaker activation**, with forensic state captured before isolation.」；「**High-risk agent actions receive independent review from multiple qualified reviewers, with blind review, consensus logic, and escalation for disagreement.**」；Level 4 具体机制：「revoke credentials by **attaching a deny-all policy to the agent's IAM role**, and broadcast quarantine events for **circuit breakers** in dependent workflows」 | [agentsec07.html](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentsec07.html) | **强**（全文） |
| AGENTCOST01「Reasoning and execution cost optimization」 | 同上 lens | 见第 5 节 | [agentcost01.html](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentcost01.html) | **强**（全文） |
| AGENTOPS05「Observability and monitoring for agentic systems」 | 同上 lens | 「Agent decisions, actions, and reasoning are captured in structured, queryable logs and **immutable, PII-safe audit trails** that support debugging, compliance reporting, and forensic analysis.」；Level 4：「**Immutable audit trails use Amazon S3 Object Lock in compliance mode** with PII redaction…」；反面模式：「Logs are stored in **mutable storage without integrity controls** or PII redaction, weakening the evidentiary value of audit trails」 | [agentops05.html](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops05.html) | **强**（全文） |
| Amazon Bedrock AgentCore（服务总览：「What is Amazon Bedrock AgentCore?」） | Developer Guide，无版本号 | 模块与服务：Harness / Runtime / Memory / **Gateway** / **Identity** / Code Interpreter / Browser / Observability / **Payments** / Evaluations / Optimization / **Policy** / **Registry**；Registry 为「a centralized catalog… provides a **governed workflow for publishing, reviewing, and approving resources**」；**Payments**：「a fully managed service that enables microtransaction payments for AI agents to access paid APIs, MCP servers, and content using the x402 protocol and the Machine Payments Protocol (MPP). Payments provides wallet integration, **configurable spending limits**, and end-to-end observability for agent payment operations.」 | [what-is-bedrock-agentcore.html](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html) | **强**（全文） |
| AgentCore Identity（「Provide identity and credential management for agent applications」） | Developer Guide | 「**Agent identities are implemented as workload identities** with specialized attributes…」「The service implements defense-in-depth… **agents never have direct access to long-term secrets or refresh tokens.**」「All credential operations are **logged and audited**…」 | [identity.html](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html) ｜ [identity-outbound-credential-provider.html](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-outbound-credential-provider.html) | **强**（全文） |
| 「Supported authentication patterns」（AgentCore Identity） | Developer Guide | 三种模式：**User-delegated access（authorization code grant）**／**Machine-to-machine（client credentials）**／**On-behalf-of token exchange**；OBO：「The agent exchanges the inbound user token for a new, audience-scoped access token… **binding both the user's identity and the agent's identity into the resulting token.** … Supports standard token exchange (**RFC 8693**) or JWT authorization grant (**RFC 7523**)」；三模式对照表含 Data ownership / User interaction / Operation timing / **Permission scope** | [common-use-cases.html](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/common-use-cases.html) | **强**（全文） |
| 「Policy in Amazon Bedrock AgentCore: Control Agent Interactions」 | Developer Guide | 「Policy in AgentCore **intercepts all agent traffic through Amazon Bedrock AgentCore Gateways and evaluates each request against defined policies in the policy engine before allowing tool access.**」；策略语言为 **Cedar**（另有 Dogwood）；「**By moving security controls outside of agent code**… eliminating the need for custom security implementation and **reducing the risk of policy bypass through agent manipulation.**」；**Temporal Policies**：「Session-scoped rules that reason over the history of actions within a conversation… **requiring that an approval was granted before a transfer, blocking an action after it has run a set number of times, or keeping a running total under a budget.**」 | [policy.html](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html) | **强**（全文） |
| 「Use multi-agent collaboration with Amazon Bedrock Agents」 | User Guide；**服务状态：Amazon Bedrock Agents（现 Agents Classic）已停止接纳新客户，处于 maintenance mode** | 「With multi-agent approach, … you can quickly designate an Amazon Bedrock Agent as the **supervisor** and then associate one or more **collaborator agents** with the supervisor.」「**you must clearly designate the role and responsibilities of the supervisor agent and every collaborator agent on the team and minimize overlapping responsibilities.**」 | [agents-multi-agent-collaboration.html](https://docs.aws.amazon.com/bedrock/latest/userguide/agents-multi-agent-collaboration.html) | **强**（全文） |
| AWS Agentic AI Security Scoping Matrix | AWS 官方页面（被 Well-Architected lens 引用为风险分级参考） | 未取得正文 | [aws.amazon.com/ai/security/agentic-ai-scoping-matrix](https://aws.amazon.com/ai/security/agentic-ai-scoping-matrix/) | **弱**（仅被引用存在） |

### 3.3 Google Cloud

| 文件/产品 | 版本/日期 | 关键原文要点 | URL | 证据强度 |
|---|---|---|---|---|
| **Agent Identity overview**（IAM 文档） | Google Cloud IAM 文档；无版本号/日期 | 「Identity assignment: When you deploy an agent, Google Cloud assigns it a **unique SPIFFE identity and an X.509 certificate. Each X.509 certificate is valid for 24 hours**, and Google Cloud automatically keeps it current…」「Agent Identity is fully integrated with Google's policy systems like **IAM, Principal Access Boundary (PAB), and VPC Service Controls**… It also **integrates with audit logging to ensure accountability and provide clear audit logs both when the agent is acting as itself and when it is acting on behalf of an end user.**」「By default, agent identities use **mutual TLS (mTLS)** with X.509 certificates… When agents interact across the Agent Gateway, they also use **Demonstrating Proof of Possession (DPoP)**, creating double-bound credentials…」 | [docs.cloud.google.com/iam/docs/agent-identity-overview](https://docs.cloud.google.com/iam/docs/agent-identity-overview) | **中**（官方页面 URL 与正文经搜索索引核验；本轮直接抓取被网络层阻断） |
| Use Agent Identity with Agent Runtime | Gemini Enterprise Agent Platform 文档 | Trust domain 格式：`agents.global.org-ORGANIZATION_ID.system.id.goog`（有组织）或 `agents.global.proj-PROJECT_NUMBER.system.id.goog`（无组织）；「grant or deny the agent access to Google Cloud APIs and services using… **Allow policies** … **Deny policies**」；含「access to other agents hosted on Agent Runtime using **Agent2Agent (A2A) Protocol**」 | [docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/agent-identity](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/agent-identity) | **中**（搜索索引核验） |
| Agent Platform access control with IAM | Gemini Enterprise Agent Platform 文档 | 列出 `roles/aiplatform.reasoningEngineServiceAgent`、`roles/aiplatform.serviceAgent` 及其权限（含 `agentregistry.skills.create`/`delete`、`aiplatform.agentAnomalyDetectionScopes.*`） | [docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/access-control](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/access-control) | **中** |
| Generative AI on Agent Platform quotas and system limits | Google Cloud 文档 | 配额表：Online inference requests 30,000 RPM；`aiplatform.googleapis.com/generate_content_image_input_per_base_model_id_and_resolution` 34,000,000；视频输入 192,000,000；RAG Engine 相关配额等 | [docs.cloud.google.com/gemini-enterprise-agent-platform/models/quotas](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/quotas) ｜ [machine-learning/quotas](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/quotas) | **中** |
| What Is Human In The Loop（Google Cloud Discover） | Google Cloud 概念页 | 「Human-in-the-loop (HITL) machine learning is a **collaborative approach that integrates human input and expertise into the lifecycle** of machine learning (ML) and artificial intelligence (AI) systems. Humans actively participate in the training, evaluation, or operation of ML models…」 | [cloud.google.com/discover/human-in-the-loop](https://cloud.google.com/discover/human-in-the-loop) | **中** |

### 3.4 A2A（Agent2Agent）协议

| 文件 | 版本/日期 | 关键原文要点 | URL | 证据强度 |
|---|---|---|---|---|
| **A2A Protocol Specification** | 文档站标注 **v1.0**（由 v0.3.0 演进；v1.0 变更文档《What's New in A2A Protocol v1.0》），版权页署 **Copyright 2026 The Linux Foundation**；2026-08-27 公告「A2A joins the Agentic AI Foundation」 | 章节结构含 **§7 Authentication and Authorization**（7.1 Protocol Security / 7.2 Server Identity Verification / 7.5 Server Authorization Responsibilities / **7.6 In-Task Authorization**，含 7.6.3 Security Considerations、7.6.4 In-Task Authorization Scope）与 **§13 Security Considerations**（**13.1 Data Access and Authorization Scoping**、13.2 Push Notification Security、13.3 Extended Agent Card Access Control、13.4 General Security Best Practices）；v1.0 变更项含「**PKCE support** - Added `pkce_required` field to Authorization Code flow」「**Modern OAuth 2.0 flows** - Added Device Code flow (RFC 8628), removed deprecated implicit/password flows」「Authentication/authorization scoping - **servers MUST only return tasks visible to caller**」「**Agent Card signature verification using JWS and JSON Canonicalization**」 | [a2a-protocol.org/latest/specification/](https://a2a-protocol.org/latest/specification/) ｜ [whats-new-v1](https://a2a-protocol.org/latest/whats-new-v1/) | **中—强**（目录结构、章节名与 v1.0 变更项已直接抓取核验；§7／§13 正文段落未完整取得） |
| Agent Discovery（A2A 官方文档） | A2A 文档站 | Agent Card 是「a JSON document that serves as a **digital 'business card'** for an A2A Server」；发现方式三种：Well-Known URI（`/.well-known/agent-card.json`，依 RFC 8615）、**Curated Registries**（「**Centralized management and governance**」「Support for access controls and trust frameworks」，但「The current A2A specification **does not prescribe a standard API for curated registries**」）、Direct Configuration；安全：「**Registry Selective Disclosure: Registries return different Agent Cards based on the client's identity and permissions.**」「The A2A specification strongly recommends the use of **out-of-band dynamic credentials rather than embedding static secrets within the Agent Card**.」 | [a2a-protocol.org/latest/topics/agent-discovery/](https://a2a-protocol.org/latest/topics/agent-discovery/) | **强**（全文） |

### 3.5 Salesforce

| 文件/产品 | 版本/日期 | 关键原文要点 | URL | 证据强度 |
|---|---|---|---|---|
| Einstein Trust Layer（官方 Help 文章） | Help 文章 id `sf.generative_ai_trust_layer` | 正文未能取得（JS 渲染 + 门户重定向） | [help.salesforce.com/s/articleView?id=sf.generative_ai_trust_layer.htm](https://help.salesforce.com/s/articleView?id=sf.generative_ai_trust_layer.htm&type=5) | **弱**（页面存在，正文未取得；**无法给出可引用的原文短句**） |
| Agentforce 权限（「agent user」模型） | Salesforce 官方培训视频《Set Up Agent Permissions｜Agentforce》 | 「The agent user has a **dedicated user record and profile** in Salesforce.」「The actions that the AI agent can take **depend on the permissions its user is assigned**.」「When you build a customer facing agent with AgentForce, you can automatically create a new agent user… **By default, that user has a limited set of permissions.**」「it's **your responsibility to grant the agent user the specific permissions it needs**… And whenever you iterate on the agent by creating new agent actions, **you must also update the agent user's permissions**.」 | [youtube.com/watch?v=aACtc9UU1bs](https://www.youtube.com/watch?v=aACtc9UU1bs) | **中**（Salesforce 官方账号内容，但为视频非文档） |
| Agentforce Builder（guardrails/topics/actions） | 产品页 | 「Apply **guardrails** with clear instructions, then test and deploy…」「**Topics define the guardrails, in natural language, and the set of actions that can be used within those guardrails.**」（后者出自 Salesforce 官方新闻稿） | [salesforce.com/agentforce/agent-builder](https://www.salesforce.com/agentforce/agent-builder) ｜ [新闻稿 2024-09-17](https://www.salesforce.com/news/press-releases/2024/09/17/agentforce-partner-network-announcement) | **中** |
| Einstein Trust Layer 具体控制项（data masking / zero retention / toxicity scoring / audit trail） | — | 本轮**未能取得 Salesforce 官方条文**。第三方转述（**弱**）称包含 secure data retrieval、prompt injection detection、toxicity detection、data masking、zero data retention、de-tokenization、audit trail monitoring；且「Zero retention applies to the model provider side, not your side」（即 **客户侧仍保留 prompt-response 审计记录**）——此说法需官方条文复核。 | — | **弱** |

---

## 4. 委派链与授权：正式化的「权力委派」机制

### 4.1 IETF RFC 与在编草案（datatracker 状态已逐条核验）

| 文件 | 状态/版本 | 日期 | 与委派/权限直接相关的要点 | URL | 证据强度 |
|---|---|---|---|---|---|
| **RFC 8693《OAuth 2.0 Token Exchange》** | 正式 RFC（Standards Track） | 2020 年 1 月（RFC 编号已核验；发布日期取自 RFC 索引） | 定义 `urn:ietf:params:oauth:grant-type:token-exchange` 授权类型与 JWT claim `act`（actor，实际执行者的委派链）与 `may_act`（谁被允许代理）；被 AWS AgentCore Identity 官方文档直接引用为实现 OBO 委派的基础（见 3.2） | [rfc-editor.org/rfc/rfc8693](https://www.rfc-editor.org/rfc/rfc8693) | **强**（对「被 AWS 官方引用」这一事实为强；本轮的 RFC 正文页未逐段抓取） |
| **draft-ietf-wimse-arch《Workload Identity in a Multi System Environment (WIMSE) Architecture》** | Active Internet-Draft，**-08**，wimse WG，Intended status: Informational，过期日 2027-01-07 | **2026-07-06** | 「Workload Identity Use Cases」含 **3.4.5 Audit Trails**、**3.4.7 Delegation and Impersonation**、**3.4.11 AI and ML-Based Intermediaries**；**PEP/PDP**：「the component enforcing authorization policy acts as a **Policy Enforcement Point (PEP)**: it allows a request to proceed, blocks it, or applies obligations based on the authenticated peer identity and any relevant security context. A deployment may also use a **Policy Decision Point (PDP)**…」；**分层认证的审计要求**：「**Audit records for layered authentication SHOULD record both the transport-layer identity and the application-layer identity**… This allows operators to distinguish the workload or infrastructure component that established the secure channel from the workload or service identity used for application-layer authorization.」；「a destination workload **MUST NOT assume that a transport-layer identity authenticated by an intermediary is the same as the application-layer caller identity** unless that relationship is explicitly established by protocol or deployment policy.」 | [datatracker.ietf.org/doc/draft-ietf-wimse-arch/](https://datatracker.ietf.org/doc/draft-ietf-wimse-arch/) | **强**（全文含原文段落） |
| **draft-ni-wimse-ai-agent-identity《WIMSE Applicability for AI Agents》** | Internet-Draft（related draft），**-02**（datatracker 列表） | 2026-02-28（datatracker 列表日期） | 未取得正文 | [datatracker.ietf.org/group/wimse/documents/](https://datatracker.ietf.org/group/wimse/documents/) | **中**（存在性与版本已核验；内容未核验） |
| **draft-reece-wimse-cross-org-delegation《Cross-Organizational Delegation for Workload and Agent Identity: Problem Statement and Requirements》** | Internet-Draft，**-01** | 2026-07-30（datatracker 列表日期） | 未取得正文 | 同上 WIMSE 文档列表 | **中** |
| **draft-ietf-oauth-transaction-tokens（《Transaction Tokens》，被 WIMSE 架构引用为跨跳安全上下文传递机制）+ draft-araut-oauth-transaction-tokens-for-agents** | datatracker 记录：`draft-oauth-transaction-tokens-for-agents-00`（2025-11-05，标注 Replaced）、`-05`（2026-04-04，标注 Replaced），后续为 `draft-araut-oauth-transaction-tokens-for-agents`；作者 Ashay Raut | 2025-11 起 | WIMSE 架构原文引用：「an externally-facing endpoint is invoked using conventional authorization mechanism, such as an OAuth 2.0 access token. The interaction with another workload may require the **security context associated with the authorization to be passed along the call chain.**」 | [datatracker.ietf.org/doc/draft-oauth-transaction-tokens-for-agents/](https://datatracker.ietf.org/doc/draft-oauth-transaction-tokens-for-agents/) | **中** |
| **draft-oauth-ai-agents-on-behalf-of-user《OAuth 2.0 Extension: On-Behalf-Of User Authorization for AI Agents》** | Internet-Draft，**-01（2025-05，过期 2025-11-09）**、**-02（2026-02-27，datatracker API 记录）**；作者 Senarath & Dissanayaka；**非 WG 文档** | 2025-05 / 2026-02 | 未取得正文；标题即「On-Behalf-Of User Authorization for AI Agents」 | [datatracker.ietf.org/doc/draft-oauth-ai-agents-on-behalf-of-user/](https://datatracker.ietf.org/doc/draft-oauth-ai-agents-on-behalf-of-user/) | **中** |
| **draft-song-oauth-ai-agent-authorization《OAuth2.0 Extention for AI Agent: Authorization on Target》** | Internet-Draft **-00**，Intended status: **Experimental**，过期 2026-01-04 | 2025 年 7 月 | 摘要：「An extension is proposed in the OAuth 2.0 protocol with an optional field `target_id` for **granular authorization**. … **By explicitly identifying the target during authorization, the draft aims to support precise permission management and enhance traceability.**」 | [ietf.org/archive/id/draft-song-oauth-ai-agent-authorization-00.html](https://www.ietf.org/archive/id/draft-song-oauth-ai-agent-authorization-00.html) | **强**（摘要原文已抓取） |
| **draft-1password-agent-identity-local-delegated《Local Delegated Agent Identity Architecture》** | Internet-Draft **-00**，Informational，Expires **2026-11-01**，Part 1 of 6 | 2026 年 4 月 | 「It is the realization of four **AIMS** functions for the local-delegated profile: **Identifier, Credentials, Attestation, Provisioning**」；「**Three classes of identifier are defined: the Human Subject Identifier […]**」；引用并行规范 TXN-AGENTS-GATEWAY 的网关拓扑：「in the gateway pattern, the agent does not hold the delegated AT or directly request `Txn-Token`s; instead, **the gateway holds the AT, requests `Txn-Token`s from the TTS on the agent's behalf**, attaches the AT and `Txn-Token` to outbound requests, and returns sanitized responses…」 | [1password.github.io/agent-identity-specs/draft-1password-agent-identity-local-delegated.html](https://1password.github.io/agent-identity-specs/draft-1password-agent-identity-local-delegated.html) | **强**（原文段落已抓取） |
| 其他相关在编草案（仅核验存在性与日期，未核验内容） | WIMSE related drafts | 2026-02 至 2026-08 | `draft-sweeney-wimse-credential-delegation-00`（Credential Delegation Protocol for AI Agents in Multi-System Environments，22 页，2026-07-27）；`draft-liu-wimse-wit-attestation-00`（Carrying Remote Attestation Evidence in Workload Identity Tokens，2026-03-25）；`draft-mw-wimse-transitive-attestation-00`（2026-02-25）；`draft-reddy-wimse-workload-attestation-00`（2026-06-07）；`draft-winmagic-wimse-condition-bounded-credentials-01`（2026-07-06）；`draft-huang-rats-agentic-eat-cap-attest`（Capability Attestation Extensions for EAT in Agentic AI Systems，2025-12-16）；`draft-wahl-scim-agent-schema`（SCIM: Agentic Identity Schema，-01，2026-02-20）；`draft-chen-agent-decoupled-authorization-model`（A Decoupled Authorization Model for Agent2Agent，2026-08-18） | 2025-12 至 2026-08 | 未取得正文 | [datatracker.ietf.org/api/v1/doc/document/?name__contains=agent](https://datatracker.ietf.org/api/v1/doc/document/?name__contains=agent&format=json) ｜ [WIMSE 文档列表](https://datatracker.ietf.org/group/wimse/documents/) | **中** |

### 4.2 「Confused deputy」在智能体场景的官方表述
- **已核验的一手表述**：OWASP Top 10 for Agentic Applications 2026 的 ASI03「Identity & Privilege Abuse」被第三方一致描述为包含 confused deputy 内容；**但 OWASP 官方 ASI03 正文本轮未取得**，故不引用其内部定义。
- **可引用的官方机制性替代**（已核验原文）：
  - OWASP LLM06:2025 缓解 7「**Complete mediation**」：「Implement authorization in **downstream systems rather than relying on an LLM to decide if an action is allowed or not.**」（[来源](https://raw.githubusercontent.com/OWASP/www-project-top-10-for-large-language-model-applications/main/2_0_vulns/LLM06_ExcessiveAgency.md)）
  - OWASP LLM03:2026 缓解 5：委派链中「**preserve the original user context and authorization scope across chained tool or agent calls**」（[来源](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/tree/main/2026/final)）
  - AWS AGENTSEC03 反面模式：不得让 agent 直接冒用用户角色，而应以**签名 token claim 承载用户上下文**（[来源](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentsec03.html)）
  - AWS AGENTSEC03-BP03 三层身份（agent identity / service identity / transaction identity）（[来源](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentsec03-bp03.html)）
  - AIVSS §1 Tool Misuse 归因项含「**Absence of cryptographic provenance or attestation of tool origin**」（[来源](https://aivss.owasp.org/assets/publications/AIVSS%20Scoring%20System%20For%20OWASP%20Agentic%20AI%20Core%20Security%20Risks%20v0.8.pdf)）
- 证据强度：**中**（上述各条为强；「confused deputy 在 ASI03 中的官方定义」为**未核实**）。

---

## 5. 预算／配额／熔断：面向智能体的成本控制官方条文

### 5.1 OWASP LLM06:2026 Unbounded Consumption（最完整的一手条文）
- 名称/版本：**LLM06:2026 Unbounded Consumption**（OWASP GenAI LLM Top 10 2026，2026-08-04 发布）
- URL：[2026/final/LLM06_UnboundedConsumption.md](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/blob/main/2026/final/LLM06_UnboundedConsumption.md)
- 原文要点：
  - 「**A defining characteristic of this threat is cost asymmetry.** Attackers can trigger disproportionately expensive computation at negligible cost to themselves…」
  - 「…agentic architectures and tool-use protocols (such as MCP) that **amplify a single request into cascading downstream operations**… **Traditional request-rate limiting alone is no longer sufficient. Effective defense demands token-aware cost controls, hard spending caps, agent-level circuit breakers, and continuous cost-attribution monitoring.**」
  - 风险例 2「**Denial of Wallet (DoW)**」：「By initiating a high volume of operations, attackers exploit the cost-per-use model of cloud-based AI services, leading to unsustainable financial burdens…」
  - 风险例 4「**Reasoning-Loop and Thinking-Token Exhaustion**」：「Attackers craft short, benign-looking prompts that result in resource exhaustion by forcing extended-thinking models into prolonged or non-terminating reasoning loops, consuming massive **thinking-token budgets** while bypassing input-size filters…」
  - 风险例 8「**Agent-Tool Interactions Flooding Model Resources**」：「When one tool call fans out into a much larger number of actions, the LLM may need to manage hundreds of calls spawned from a single task, driving token overuse.」
  - 缓解 1「Rate Limiting & Input Size Validation」：「Move beyond requests per second to enforce limits on **tokens-per-minute, tokens-per-day, and estimated cost per request**. Use **pre-flight token estimation to reject requests before inference begins**.」
  - 缓解 2「**Hard Spending Caps**」：「Set **non-overridable budget ceilings per API key, user, team, and cloud account**. These must be **enforcement mechanisms that halt inference when exceeded, rather than alerting thresholds** that fast-accumulating workloads can outpace. Spending caps should also account for cost differences between modalities and tool protocols.」
  - 缓解 6「Limit Queued Actions and Scale Robustly」：「Implement restrictions on the **number of queued actions and total actions**…」
- 证据强度：**强**（一手 markdown 全文）。

### 5.2 AWS
- **AGENTCOST01「Reasoning and execution cost optimization」**（Agentic AI Lens，2026-06-10；[链接](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentcost01.html)）原文：
  - 「Agent reasoning cycles consume tokens through iterative plan-execute-verify-reflect loops, and **multi-agent coordination adds multiplicative overhead**.」
  - 「Agent reasoning cycles are bounded by **explicit termination conditions and confidence-based exits**, so token consumption is predictable and proportional to decision complexity.」
  - Level 2：「Teams have adopted basic termination contracts, including **iteration caps and session-level token budgets**, and tag invocations so **orchestration and worker costs can be reported separately**.」
  - Level 4：「**Termination conditions, iteration limits, and routing policies are enforced at the control-plane boundary through Amazon Bedrock AgentCore Policy and Amazon Bedrock AgentCore Gateway rather than relying on agent self-restraint.** … **Per-tier cost attribution is automated, with AWS Budgets alerts on orchestration-to-execution ratios and supervisor-to-worker ratios.**」
  - 反面模式：「Teams run agents **without explicit iteration caps, confidence thresholds, or token budgets**, which can leave unbounded reasoning loops undetected…」「**Multi-agent workflows pass full conversation history between agents at every handoff, so coordination costs scale with conversation length rather than task complexity.**」
- **AgentCore Payments**（Developer Guide）：提供「wallet integration, **configurable spending limits**, and end-to-end observability for agent payment operations」，协议为 x402 与 Machine Payments Protocol（[链接](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html)）。
- **Policy in AgentCore 的 Temporal Policies**：「blocking an action after it has run a set number of times, or **keeping a running total under a budget**」（[链接](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html)）。
- 证据强度：**强**（全文）。
- 未核验：AWS Budgets「只告警不阻断」的官方原文表述（第三方博客有此说法，**弱**）；Bedrock Guardrails 与预算联动的官方条文未取得。

### 5.3 Microsoft Azure / Foundry
- 配额按「**per subscription, per region, and per model in units of tokens per minute (TPM)**」分配（[Manage and increase quotas for resources with Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/how-to/quota)）。
- Foundry **Agent Service 两层限额**：Agent Service limits（agent/thread artifacts、file uploads、vector store attachments、message counts、tool registration）＋ Model limits（「Quotas and rate limits for the model deployments your agents call」）（[Quotas and limits for Microsoft Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/limits-quotas-regions)）。
- 证据强度：**中**（搜索索引引用官方原文；未直接抓取全文）。

### 5.4 OpenAI
- 官方 Help Center 文章《Managing projects in the API platform》存在（[help.openai.com/en/articles/9186755](https://help.openai.com/en/articles/9186755-managing-projects-in-the-api-platform)），但本轮**被 Cloudflare 拦截（HTTP 403）**，未能核验正文。
- 搜索索引给出的表述（**弱**）：「OpenAI now supports monthly API spend limits at both the organization and project levels. A spend limit can **monitor spend without enforcement**, or you can **enforce it as a hard limit so API requests fail after spend reaches the limit**.」同时索引中亦给出相反表述（默认月度 project limit 为 **soft/notification-only，不阻断调用**）。
- 结论：**OpenAI 侧「硬性 spend limit 是否存在、默认是否为硬限」未能核实**，两个方向的说法在公开页面与社区反馈中并存。**不作为可引用依据。**
- 证据强度：**弱／未核实**。

### 5.5 Google Cloud
- 配额页面给出 per-project、per-region、per-base-model 的 **RPM / 词元吞吐**上限（例：Online inference requests 30,000 RPM；图像输入 34,000,000；视频输入 192,000,000；RAG Engine 60 RPM 等）（[Agent Platform quotas and system limits](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/quotas)）。
- 证据强度：**中**。
- 未核验：Google Cloud 是否存在「per-agent 预算／成本上限」的官方机制条文 → **未找到公开来源**。

### 5.6 LangSmith / LangGraph
- 「Cost tracking」官方文档（LangChain Docs）：「**LangSmith automatically records LLM token usage and costs for major providers**, and also allows you to submit **custom cost data** for any additional components. This gives you a single, unified view of costs across your entire application…」；可挂载 `usage_metadata`（含 `input_tokens` / `output_tokens` / `total_tokens` / `input_token_details.cache_read`）。
- URL：[docs.langchain.com/langsmith/cost-tracking](https://docs.langchain.com/langsmith/cost-tracking)
- 证据强度：**中**（官方文档正文经搜索索引核验）。
- 未核验：LangSmith 是否提供**强制预算熔断**（而非观测）→ **未找到公开来源**。

### 5.7 Anthropic
- 已核验原文：《How we built our multi-agent research system》——「**token usage by itself explains 80% of the variance**, with the number of tool calls and the model choice as the two other explanatory factors.」；「Multi-agent architectures effectively **scale token usage** for tasks that exceed the limits of single agents.」（[anthropic.com/engineering/multi-agent-research-system](https://www.anthropic.com/engineering/multi-agent-research-system)）
- 《Building effective agents》中关于成本与停止条件的原文见第 6 节。
- 证据强度：**中—强**（页面正文经搜索索引摘录核验；本文档未逐段抓取该页全文）。
- 未核验：Anthropic 平台是否提供「per-agent token budget」控制面 → **未找到公开来源**。

---

## 6. 人在环（HITL）升级策略：官方条文

### 6.1 Anthropic《Building effective agents》
- 版本/日期：Engineering blog，**Published Dec 19, 2024**（页面顶部标注「Much of the tooling landscape described in this post has changed since December 2024」）
- URL：[anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)
- 原文（已抓取全文）：
  - 「Agents begin their work with either a command from, or interactive discussion with, the human user. Once the task is clear, agents plan and operate independently, **potentially returning to the human for further information or judgement.**」
  - 「**Agents can then pause for human feedback at checkpoints or when encountering blockers.** The task often terminates upon completion, but it's also common to include **stopping conditions (such as a maximum number of iterations) to maintain control.**」
  - 「**The autonomous nature of agents means higher costs, and the potential for compounding errors.** We recommend extensive testing in sandboxed environments, along with the appropriate guardrails.」
  - 「Agentic systems often **trade latency and cost for better task performance**, and you should consider when this tradeoff makes sense.」
  - 「In the orchestrator-workers workflow, **a central LLM dynamically breaks down tasks, delegates them to worker LLMs, and synthesizes their results.**」
- 证据强度：**强**（全文）。

### 6.2 AWS《AGENTSEC04-BP02 Human-in-the-loop for critical decisions》
- 名称/日期：AWS Well-Architected Agentic AI Lens，2026-06-10
- URL：[agentsec04-bp02.html](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentsec04-bp02.html)
- 原文：
  - 「**Routing every agent action through human review produces rubber-stamp approvals. Routing none produces unbounded autonomy. Risk-tiered approval pauses agents only for the decisions where human judgment actually changes the outcome**, with enough context to make those decisions meaningful.」
  - 「You pause high-risk agent operations for human review before execution, and reviewers receive enough context to make informed decisions **within a defined time window**.」
  - 「**Escalation paths handle cases where primary reviewers are unavailable.**」
  - 「You **log human approval decisions with timestamps and reviewer identities**, creating an auditable record of human oversight for compliance purposes.」
  - 基线分级：「**read-only operations proceed autonomously, low-risk writes require single-reviewer approval, and higher-risk operations (financial transactions, data deletion, external communications) require stricter approval**, which can be single-reviewer, multi-reviewer, or out-of-band…」
  - 风险分类不得由 LLM 决定：「**Risk classification itself can't rely on an LLM exposed to the same untrusted content as the request being evaluated**, because adversarial content could influence the classifier into marking the request as low-risk. **Use deterministic logic (policy engines, rule-based classifiers) as the authoritative signal.**」
  - 默认信任授予的边界：「**Wildcard trust grants** (approving all future operations of a given type with no parameter scoping) **effectively remove human oversight from an entire class of operations and should not be issued.**」
  - 超时与升级：「Timeout policies and escalation paths… **Catch clauses route timed-out executions to an escalation state (notify secondary reviewers, escalate to management, or default to a safe fallback, typically blocking the operation).**」
  - 审计字段：「Capture **reviewer identity, notification and response timestamps, the operation under review, the decision, and any escalation events.**」
- 证据强度：**强**（全文）。

### 6.3 AWS《AGENTSEC07》与《AGENTSEC04》中的监督负载与鲁棒性
- 「**Review queues are prioritized and load-balanced, and reviewer workload is monitored for signs of rubber-stamping**…」（AGENTSEC07）
- 「**High-risk agent actions receive independent review from multiple qualified reviewers, with blind review, consensus logic, and escalation for disagreement.**」（AGENTSEC07）
- 反面模式：「Approval workflows either route every action through human review (**producing reviewer fatigue and rubber-stamping**) or skip review for operations that warrant it, giving the worst of both extremes.」（AGENTSEC04）
- URL：[agentsec07.html](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentsec07.html) ｜ [agentsec04.html](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentsec04.html)
- 证据强度：**强**。

### 6.4 欧盟《人工智能法案》第 14 条（人工监督）
- 名称：**Regulation (EU) 2024/1689（Artificial Intelligence Act），Article 14「Human oversight」**
- 生效时间线（据 artificialintelligenceact.eu 的条文页注记）：「**Comes into force 2 December 2027 (high-risk under Annex III) / 2 August 2028 (high-risk under Annex I), according to Article 113(c)**」；条文页注：「This is the final text of the Artificial Intelligence Act (Regulation (EU) 2024/1689), as it was published in the Official Journal of the European Union in **July, 2024**.」
- URL：[artificialintelligenceact.eu/article/14/](https://artificialintelligenceact.eu/article/14/) ｜ 官方 OJ 全文：[eur-lex.europa.eu/eli/reg/2024/1689/oj/eng](https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng)
- 原文（已抓取全文）：
  - 第 1 款：「High-risk AI systems shall be designed and developed in such a way, including with appropriate human-machine interface tools, that they can be **effectively overseen by natural persons** during the period in which they are in use.」
  - 第 2 款：「Human oversight shall aim to **prevent or minimise the risks to health, safety or fundamental rights**…」
  - 第 3 款：「The oversight measures shall be **commensurate with the risks, level of autonomy and context of use** of the high-risk AI system…」
  - 第 4 款四/五项要点（(a)–(e)）：「to properly understand the relevant **capacities and limitations** of the high-risk AI system and be able to duly monitor its operation, including in view of **detecting and addressing anomalies, dysfunctions and unexpected performance**」；「to remain aware of the possible tendency of automatically relying or over-relying on the output… (**automation bias**)」；「to correctly **interpret** the high-risk AI system's output」；「to decide, in any particular situation, **not to use** the high-risk AI system or to otherwise **disregard, override or reverse** the output」；「to **intervene in the operation** of the high-risk AI system or **interrupt the system through a 'stop' button** or a similar procedure that allows the system to come to a halt in a safe state.」
  - 第 5 款（Annex III 1(a) 情形）：「**no action or decision is taken by the deployer on the basis of the identification resulting from the system unless that identification has been separately verified and confirmed by at least two natural persons** with the necessary competence, training and authority.」
  - 第 26 条第 2 款（部署者义务，经 EUR-Lex 页面核验）：「**Deployers shall assign human oversight to natural persons who have the necessary competence, training and authority, as well as the necessary support.**」
- 证据强度：**强**（条文全文；生效时间线取自该要约网站的条文注记）。

### 6.5 ISO/IEC 42001
- 名称：**ISO/IEC 42001:2023 — Information technology — Artificial intelligence — Management system**
- 日期：**2023 年 12 月**（第三方一致；ISO 官方页 [iso.org/artificial-intelligence/ai-management-systems](https://www.iso.org/artificial-intelligence/ai-management-systems) 说明其为 PDCA 型 AI 管理体系标准，覆盖 ethics、accountability、transparency、data privacy）
- **未取得** ISO/IEC 42001 标准原文（标准为付费文本）；**不引用其条文编号或「human oversight」章节原文。**
- 证据强度：**弱**（标准存在与日期可核，条文不可核）。

### 6.6 厂商「升级策略模板」
- **未找到任何厂商官方发布的、可直接引用的「escalation policy template」。**
- 最接近的可引用官方材料：AWS AGENTSEC04-BP02 的**风险分级 + 超时 + 升级 + 审计字段**清单（见 6.2）；Microsoft Agent Framework 的 `tool.ApprovalRequiredFunc` 工具级审批原语（见 3.1）。
- 证据强度：**中**（前者强，后者中）。

---

## 7. 审计与问责：可追溯性条文与监管表态

### 7.1 AWS
- **AGENTOPS05**：「Agent decisions, actions, and reasoning are captured in **structured, queryable logs and immutable, PII-safe audit trails** that support debugging, compliance reporting, and **forensic analysis**.」Level 4 机制：「Immutable audit trails use **Amazon S3 Object Lock in compliance mode** with PII redaction…」（[链接](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops05.html)）
- **AGENTSEC03 审计原则**：「audit trails attribute every action unambiguously to **either an agent or a human actor**」「the user context propagates as signed token claims through the call chain **without the agent ever assuming the user's credentials**」（[链接](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentsec03.html)）
- **AGENTSEC07 取证与隔离**：「**forensic state captured before isolation**」「revoke credentials by attaching a **deny-all policy** to the agent's IAM role」（[链接](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentsec07.html)）
- **AgentCore Observability**：「a unified view to **trace, debug and monitor agent performance in production**… inspect an agent's execution path, **audit intermediate outputs**… emitted in standardized OpenTelemetry (OTEL)-compatible format」（[链接](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html)）
- 证据强度：**强**。

### 7.2 Microsoft
- **Entra Agent ID**：「All agent authentication and activity is **logged for compliance and audit**.」；专门文档《Sign-in and audit logs for agents》（[链接](https://learn.microsoft.com/en-us/entra/agent-id/sign-in-audit-logs-agents)）
- **Purview + Copilot Studio**：「Copilot Studio logs user interactions with generative AI and **sends the logs to Purview**… include **the text transcript of the conversation**」（已归档发布计划页）；Fabric Data Agent：「**user prompts, AI responses, and interaction metadata are captured and stored in Microsoft Purview** through the Microsoft 365 audit pipeline」「All records are stored in the **Microsoft 365 unified audit log**」
- **Least privilege pattern 审计要求**：「Log **agent identity, role, effective scope, action, resource, correlation ID, and 'on behalf of' user** where applicable」；成功因素「**Percentage of agent actions emitting required audit fields**」「**Percentage of workflows with end-to-end traceability across orchestrator → tools → downstream systems**」
- 证据强度：**强**（least-privilege 页）／**中**（Purview 相关页）。

### 7.3 AWS/A2A：跨跳身份与审计
- WIMSE 架构（-08，2026-07-06）：「**Audit records for layered authentication SHOULD record both the transport-layer identity and the application-layer identity** when both are available and relevant.」
- A2A v1.0：「Authentication/authorization scoping - **servers MUST only return tasks visible to caller**」；§13.1「Data Access and Authorization Scoping」；§7.6「In-Task Authorization Scope」
- 证据强度：**强**（WIMSE）／**中**（A2A 目录与变更项）。

### 7.4 「谁负责」的官方表述
- **可引用的一手表述**：
  - NIST AI RMF 1.0 GOVERN 2.3：「**Executive leadership of the organization takes responsibility for decisions about risks associated with AI system development and deployment.**」
  - NIST AI RMF 1.0：「**All involved AI actors share responsibilities** for designing, developing, and deploying a [system]…」
  - AWS AGENTSEC03：「**audit trails attribute every action unambiguously to either an agent or a human actor**」（归属可判定性，而非法律责任分配）
  - AIVSS §9：「Agent Untraceability… fundamentally undermines key pillars of security and governance: **traceability and accountability**. … makes it difficult to **prove compliance, assign responsibility**, or prevent the recurrence of harmful actions.」
  - EU AI Act Art. 14(4)(d)/(e)：人类须能**推翻/中断**系统输出——即监督者保留最终决定权。
- **未核验**：任何监管机关（UK ICO、SEC、EU）就「自主智能体行为的法律责任归属」发布的专门表态 → **未找到公开来源**。
  - UK ICO 方向：本轮仅取得第三方律所分析（第三方称 ICO 于 2026-03-31 就 ADM 草案指引启动公开咨询、截止 2026-05-29、最终指引预计 2026 年夏；并称 ICO 正在制定 AI 与 ADM 的**法定实务守则**）。**ICO 一手文件本轮未核验**。
  - SEC 方向：**未取得任何一手材料**。
  - EU 方向：仅有 AI Act 第 14 条与第 26 条（已核验）。

---

## 补充：与本任务「管理层控制」直接相关、但本轮仅取得官方「存在性」的条目

| 名称 | 日期/版本 | 状态 | URL | 证据强度 |
|---|---|---|---|---|
| OWASP Agent Control Standard (ACS) | 2026-09-01/02 宣布 | 技术规范正文未取得 | [发布稿](https://genai.owasp.org/2026/09/01/owasp-genai-security-project-unveils-2026-top-10-for-llm-applications-new-agent-control-standard-and-sponsors-as-community-tops-30000-members) | **中** |
| OWASP《State of Agentic AI Security and Governance》2.01 | 2026-06-01 | 正文未取得 | [资源页](https://genai.owasp.org/resource/state-of-agentic-ai-security-and-governance) | **中** |
| AWS Agentic AI Security Scoping Matrix | — | 正文未取得（被 AWS lens 引用） | [aws.amazon.com/ai/security/agentic-ai-scoping-matrix](https://aws.amazon.com/ai/security/agentic-ai-scoping-matrix/) | **弱** |
| NIST COSAiS 单/多智能体 overlay 文本 | 拟定中 | **尚未发布** | [use-cases](https://csrc.nist.gov/projects/cosais/use-cases) | **强**（「尚未发布」这一状态为强） |

---

## 未能核实的部分

**A. 因本轮检索通道受限而未能取得的官方正文**

1. **OWASP GenAI 站点多数资源页正文**（`genai.owasp.org`）被 Cloudflare 反爬拦截（curl 返回 "Checking your browser…"；web_fetch 仅返回页面标题；Apify 配额已耗尽）。因此以下**未能取得正文原文**：
   - 《Agentic AI – Threats and Mitigations》PDF 正文与其威胁编号（tool misuse / privilege compromise / identity spoofing / human manipulation / unintended action / resource exhaustion 的官方编号与定义）；
   - 《OWASP Top 10 for Agentic Applications for 2026》逐条正文（含 **ASI03 Identity & Privilege Abuse 对 confused deputy 的官方定义**、ASI09 Human-Agent Trust Exploitation、ASI10 Rogue Agents 的官方描述）；
   - Agent Control Standard (ACS) 技术规范；
   - 《State of Agentic AI Security and Governance》2.01 正文。
2. **Salesforce 官方文档**（`help.salesforce.com`，JS 渲染 + 重定向）与 **OpenAI 官方文档**（`platform.openai.com` / `help.openai.com`，Cloudflare HTTP 403）：
   - Einstein Trust Layer 的官方条文（data masking / zero retention / toxicity scoring / **Einstein Trust Layer audit trail 的具体字段与保留规则**）**未能取得原文**，故第 3.5 节仅给出**弱**证据；
   - Agentforce 的官方权限文档（agent user / 权限集 / 审计）**未能取得**，仅取得 Salesforce 官方视频口述；
   - OpenAI「organization / project spend limits 是否为硬限」**两个方向的表述并存且均未取得官方原文**，**不作引用**。
3. **Google Cloud 官方文档域**（`docs.cloud.google.com` / `cloud.google.com`）在本轮网络环境下**直接抓取失败**（HTTP 000 / timeout），3.3 节各项为**搜索索引核验（中）**，未取得全文原文。
4. **NIST CSRC 若干页面**（如 AI 100-2e2025 条目页）与 **EUR-Lex OJ 原文页**本轮返回 202 或超时，第 6.4 节的条文以 artificialintelligenceact.eu 的条文页（自述为 OJ 最终文本）+ EUR-Lex 第 26 条第 2 款片段交叉核验。

**B. 未找到公开来源的项目**

1. **NIST 在 2025–2026 发布的正式「agentic AI profile」或「agentic control overlay」文本**：未找到公开来源（COSAiS 仍处拟定用例阶段，单/多智能体 overlay 文本尚未发布）。CSA 研究简报提及的 NIST AI Agent Standards Initiative、2026-01-08 RFI（docket NIST-2025-0035）、NIST IR 8596、NCCoE《Accelerating the Adoption of Software and AI Agent Identity and Authorization》、以及预期 Q4 2026「AI Agent Interoperability Profile」，**本轮均未取得 NIST 一手页面**，列为待复核。
2. **任何厂商官方发布的「escalation policy template」（升级策略模板）**：未找到公开来源。
3. **Google Cloud / Anthropic / LangSmith 是否存在「per-agent 强制预算熔断（强制中断推理）」的官方机制**：未找到公开来源（已知的官方能力为配额/RPM 限制与成本观测；强制预算熔断的一手条文目前只见于 OWASP LLM06:2026 的**建议**与 AWS AgentCore Policy 的 **temporal policy 表达力**）。
4. **AWS Budgets 是否可「阻断」花费的官方原文**：未找到公开来源（仅第三方博客称其「send notifications rather than blocking spend」）。
5. **监管机关就自主智能体责任归属的专门表态**：
   - UK ICO：**未取得一手文件**（仅有第三方律所分析）；
   - SEC：**未找到公开来源**；
   - EU：仅有 AI Act 第 14 条与第 26 条第 2 款（已核验）。
6. **Salesforce「Agentforce Orchestrator」**：未找到该确切名称的官方文档。
7. **NIST AI 100-2e2025 是否「大幅扩充 agentic 攻击目录」**：与原文不符（原文对 agent 的实质讨论有限，agent hijacking 仅出现在参考文献中）；第三方该说法**未获原文支撑**。

**C. 检索工具可用性说明**

本轮会话中 `web_search`、`exa_search`、Apify MCP 的配额/限流相继耗尽，绝大部分证据改为**直接抓取已知官方 URL**（web_fetch + curl + PDF 全文抽取）获得。因此「未能核实」中相当一部分属于**通道受限**，而非官方文件不存在；上述每一条限制均已逐项说明。
