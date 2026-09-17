# AI 原生组织架构与多智能体协作：外部证据调研

调研日期：2026-09-18。方法：web_search / web_fetch / curl 直接抓取官方文档与一手材料；**所有 URL 与数字均经抓取核实，未核实的明确写「未找到公开来源」**。检索工具在调研中途（2026-09-18 约 00:30）遭遇配额限流，导致部分条目只能依赖直接抓取已知 URL；受限项在各节「未能核实的部分」中标注。

证据强度标签：
- **官方文档**：厂商/标准机构自己的文档、帮助中心、发布说明、工程博客
- **一手访谈/一手论文**：当事人公开发言、公司博客署名文章、arXiv 等可引用原始文献
- **二手报道**：媒体报道、第三方转述
- **推测**：无直接来源、由上下文推断（本报告尽量不使用）

数字口径说明：凡涉及 token 倍数、成功率、人数、金额的，均在括号内注明「口径 / 时间 / 来源」。

---

## 第一节　7 个问题的结论

### 问题 1：分层 vs 扁平——主流框架怎样表达「管理层」，其精确职责是什么

**结论：2024–2026 年企业级多智能体框架的架构共识不是「分层还是扁平」的二选一，而是「把管理层拆成可分别取舍的几件事」——任务分解、选人/路由、进度跟踪、终止判定这四件事几乎所有框架都有；而「验收 worker 产物」「重试」「预算/轮次上限」「升级到人」只有部分框架明文写在 manager 上，且越是 2025–2026 年的新版本，越倾向于把这些控制手段外移到代码/平台层，而不是交给一个 LLM 经理。**

| 框架 | 管理者节点叫什么 | 官方定义的管理职责 |
| --- | --- | --- |
| Anthropic（模式，非框架） | orchestrator / lead agent | 分解、委派、综合；努力分档 |
| OpenAI Agents SDK | Manager（agents as tools） | 保留对话控制权、拥有最终答案、合并专家输出、统一执行 guardrails |
| Microsoft AutoGen | GroupChatManager / SelectorGroupChat | 选下一个发言者、终止判定 |
| Microsoft Magentic-One | Orchestrator | 分解+计划（Task Ledger）、进度自省（Progress Ledger）、停滞检测与重规划、终止 |
| Microsoft Agent Framework | Magentic manager / Group Chat orchestrator | 计划、指派、每轮检查进度、停滞则重置重规划；**有明文轮次/停滞/重置上限** |
| LangGraph | supervisor | 控制全部通信流与任务委派、决定调用哪个 agent；支持 supervisor 管 supervisor 的多级 |
| CrewAI | manager agent（hierarchical process） | 任务分派 + **结果验收**（唯一把验收写成明文的框架） |
| Google ADK | coordinator agent（父 LlmAgent） | 推理决定路由到哪个 sub-agent；确定性 workflow agents 完全不咨询模型 |

**逐条要点**

1. **Anthropic 的 orchestrator-workers**：官方定义是「a central LLM dynamically breaks down tasks, delegates them to worker LLMs, and synthesizes their results」，且子任务「aren't pre-defined, but determined by the orchestrator based on the specific input」——即管理层的核心价值被定义为**处理不可预先枚举的子任务**。（官方文档，[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)，Published **2024-12-19**。注意：该页 2026 年已加注记说内容过时，指向 Managed Agents。）

2. **Anthropic 研究系统里 lead agent 的实操职责被写死成规则**：分解并描述子任务（每个子 agent 必须有 objective、output format、工具与来源指引、明确边界）；按复杂度分配努力（简单事实查找 1 个 agent / 3–10 次工具调用；直接比较 2–4 个子 agent / 每个 10–15 次；复杂研究 >10 个子 agent）；并行启动 3–5 个子 agent；综合结果并决定是否继续。（官方文档，[How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)，Published **2025-06-13**）

3. **Anthropic 明说 lead agent 目前管不动 worker**：「the lead agent can't steer subagents, subagents can't coordinate, and the entire system can be blocked while waiting for a single subagent to finish searching」——同步执行下管理层是瓶颈而不是增益。（同上，2025-06-13）

4. **Anthropic 2026 年的方向是「解耦」而不是「叠层级」**：Managed Agents 把 brain（模型+harness）与 hands（sandbox/工具）和 session（append-only 日志）拆成三个接口，明确目标是「many brains, many hands」，并说「because no hand is coupled to any brain, brains can pass hands to one another」；安全边界做法是凭据永不进入沙箱。（官方文档，[Scaling Managed Agents: Decoupling the brain from the hands](https://www.anthropic.com/engineering/managed-agents)，Published **2026-04-08**）

5. **OpenAI Agents SDK 给了两种明确对立的组织形态，并说清各自适用条件**：Manager（agents as tools）＝「A central manager/orchestrator invokes specialized sub-agents as tools and **retains control of the conversation**」；Handoffs＝「Peer agents hand off control to a specialized agent that takes over the conversation. This is **decentralized**」。官方给出的 manager 适用条件是「You want one agent to own the final answer, combine outputs from multiple specialists, or **enforce shared SDK guardrails in one place**」。（官方文档，[Agents](https://openai.github.io/openai-agents-python/agents/)、[Agent orchestration](https://openai.github.io/openai-agents-python/multi_agent/)，页面无日期）

6. **OpenAI 把「验收」明确放在代码层而非 manager 层**：官方写的是「run the task agent to produce an output, then run an **evaluator agent** to assess that output and provide feedback; stop when the evaluator says the output passes the required criteria」——这是 workflow 代码编排，不是 manager 节点的职责。同时 OpenAI 明确 manager 不接管 guardrails：「Input guardrails still apply only to the first agent in the chain, and output guardrails only to the agent that produces the final output.」（官方文档，[Agent orchestration](https://openai.github.io/openai-agents-python/multi_agent/)、[Handoffs](https://openai.github.io/openai-agents-python/handoffs/)，页面无日期）

6b. **OpenAI 官方《A practical guide to building agents》对 manager 模式的完整定义**（本次已下载 PDF 并抽取原文，7.3 MB，抓取于 2026-09-18）：「The manager pattern empowers a central LLM—the 'manager'—to orchestrate a network of specialized agents seamlessly through tool calls. Instead of losing context or control, the manager intelligently delegates tasks to the right agent at the right time, effortlessly synthesizing the results into a cohesive interaction.」「**This pattern is ideal for workflows where you only want one agent to control workflow execution and have access to the user.**」对应的去中心化模式适用条件是「This pattern is optimal when you don't need a single agent maintaining central control or synthesis—instead allowing each agent to take over execution and interact with the user as needed.」并注明「In the manager pattern, edges represent tool calls whereas in the decentralized pattern, edges represent handoffs that transfer execution between agents.」（官方文档，[A practical guide to building agents（PDF）](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)，页面无日期；本次经 `pdftotext` 抽取正文核实）

7. **Microsoft Magentic-One 的 Orchestrator 是公开系统里职责最完整的 LLM 经理**：任务分解与计划写入 Task Ledger；每步自省写入 Progress Ledger 并回答「是否完成/是否在打转/是否有进展/下一个谁发言/给它什么指令」；维护「卡住计数器」，超过阈值（实验中 ≤2）就跳出内循环、更新 Task Ledger 重新规划；终止条件可参数化为最大尝试次数或最大时限；最后「reviews the full transcript, along with the ledger, and reports either a final answer, or its best educated guess」。（官方文档 + 一手论文，[Magentic-One (AutoGen docs)](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/magentic-one.html)、[arXiv:2411.04468](https://arxiv.org/abs/2411.04468)，Submitted **2024-11-07**）

8. **Microsoft Agent Framework（2026）把管理层的「上限」做成了显式参数**：Magentic manager 有 `max_round_count=10, max_stall_count=3, max_reset_count=2`，官方描述「Consecutive non-progressing rounds increment a stall counter, and exceeding the configured maximum triggers an automatic reset and replan」，并罕见地提供**人工计划评审**（`MagenticPlanReviewRequest`，Python 默认关闭 / .NET 默认开启）。官方博客对 manager 的一句话概括是：「A manager agent turns the task into a plan, assigns work to specialists, checks progress after each round, and revises the plan when the team stops moving.」（官方文档，[Magentic](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/magentic)（Last updated **2026-09-04**）、[Group Chat](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/group-chat)（**2026-08-25**）、[官方博客](https://devblogs.microsoft.com/agent-framework/agent-frameworks-orchestration-patterns-reach-1-0/)，**2026-07-08**）

9. **AutoGen 的 GroupChatManager 职责窄得多**：只做「选下一个发言者」和终止，官方原文「the order of turns is maintained by a Group Chat Manager agent, which selects the next agent to speak upon receiving a message」；终止可用 `MaxMessageTermination(max_messages=25)` 防死循环。任务分解在这套体系里由单独的 Planning Agent 承担。（官方文档，[Group Chat (Core)](https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/group-chat.html)、[Selector Group Chat](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/selector-group-chat.html)，站点 © 2024，页面无日期）

10. **LangGraph 的 supervisor 定义最「集权」**：「The supervisor controls all communication flow and task delegation, making decisions about which agent to invoke based on the current context and task requirements.」并支持「create multi-level hierarchical systems by creating a supervisor that manages multiple supervisors」。但官方已把专用 supervisor 库降级：「We now recommend using the supervisor pattern directly via tools rather than this library for most use cases.」（官方仓库与官方参考页，[langgraph-supervisor-py README](https://github.com/langchain-ai/langgraph-supervisor-py)（README 最后提交 **2026-03-02**）、[LangChain Reference](https://reference.langchain.com/python/langgraph-supervisor)，页面无日期）

11. **CrewAI 是唯一把「验收」写成 manager 明文职责的框架**：「Task Delegation: A manager agent allocates tasks among crew members based on their roles and capabilities. **Result Validation: The manager evaluates outcomes to ensure they meet the required standards.**」同时它有最完整的预算熔断参数：`max_iter`（默认 20）、`max_rpm`、`max_execution_time`、`max_retry_limit`（默认 2）。注意 `allow_delegation` **默认 False**（官方理由是「to give users explicit control」）。（官方文档，[Hierarchical Process](https://docs.crewai.com/en/learn/hierarchical-process)、[Processes](https://docs.crewai.com/en/concepts/processes)、[Agents](https://docs.crewai.com/en/concepts/agents)、[Collaboration](https://docs.crewai.com/en/concepts/collaboration)，页面无日期，文档站版本 v1.15.x）

12. **Google ADK 用「coordinator agent」而不是 manager**：父 LlmAgent 用推理决定 `transfer_to_agent(...)`；子 agent 的 `description`「is primarily used by *other* LLM agents to determine if they should route a task to this agent」。ADK 另有**完全不咨询模型**的确定性 workflow agents（Sequential/Parallel/Loop）：官方定位是「execute in a deterministic and predictable manner... without consulting an AI model for assistance with the orchestration」。ADK 2.0 的协作团队模式下，子 agent 有 `chat`/`task`/`single_turn` 三种模式，且「Each task or single-turn mode agent operates in its own isolated session branch」——即**上下文隔离**是官方设计，与「共享黑板式 manager」不同。（官方文档，[Multi-agent workflow patterns](https://adk.dev/workflows/patterns/)、[Simple agents with LlmAgent](https://adk.dev/agents/llm-agents/)、[Build collaborative agent teams](https://adk.dev/workflows/collaboration/)、[Template agent workflows](https://adk.dev/agents/workflow-agents/)，页面无日期）

13. **六个框架里，没有任何一个把「冲突仲裁」写成 manager 的明文职责**；「升级到人」只有 Microsoft Agent Framework（Magentic plan review）、Google ADK（HITL 模式与 `PolicyEngine` 的 `PolicyOutcome.CONFIRM`）、LangChain（工具层 `HumanInTheLoopMiddleware`）有明确机制，Anthropic / OpenAI SDK / AutoGen / CrewAI 在 manager 定义层面均未见记载。（来源同上）

**各框架官方的「什么时候不要用管理层」口径**

- **OpenAI（最明确的一条，官方 PDF p.15）**：「Our general recommendation is to **maximize a single agent's capabilities first**. More agents can provide intuitive separation of concepts, but can **introduce additional complexity and overhead, so often a single agent with tools is sufficient.**」官方给出的两条拆分准则：Complex logic（if-then-else 过多、模板难扩展）／Tool overload（工具数量不是关键，**定义重叠度**才是；>15 个定义清晰的工具可跑通，<10 个重叠工具反而失败）。（[A practical guide to building agents（PDF）](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)，PDF 元数据创建日 **2025-04-07**，本次经 pdftotext 逐字核实）
- Anthropic：「some domains that require all agents to share the same context or involve many dependencies between agents are not a good fit for multi-agent systems today. For instance, **most coding tasks** involve fewer truly parallelizable tasks than research, and **LLM agents are not yet great at coordinating and delegating to other agents in real time**.」（2025-06-13）
- Microsoft AutoGen：最直白的一条——「start with a single agent for simpler tasks, and transition to a multi-agent team when a single agent proves inadequate.」（[Teams](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/teams.html)）
- Microsoft Agent Framework：Magentic 页提示「If your scenario requires simpler coordination without complex planning, consider using the Group Chat pattern instead.」，并承认「it is **untested** how well the Magentic orchestration will perform outside of the original Magentic-One design.」（2026-09-04）
- LangChain：给出量化的调用次数与 token 对比——一次性请求 Subagents **4 次**模型调用 vs Handoffs/Skills/Router **3 次**，理由是「Subagents adds one extra call because results flow back through the main agent—this overhead provides centralized control」；多域任务 Subagents/Router **约 9K tokens** vs Handoffs **14K+**。（[Multi-agent](https://docs.langchain.com/oss/python/langchain/multi-agent)，页面无日期）
- Google ADK：明确列出**不该用 A2A 远程 agent 的场景**——内部代码组织、性能敏感的内部高频操作、需要共享内存/上下文、简单 helper 函数，因为「A2A's network overhead and serialization/deserialization would be counterproductive」。（[Introduction to A2A](https://adk.dev/a2a/intro/)，页面无日期）

**未能核实的部分（Q1）**：OpenAI AgentKit / Agent Builder 的编排节点官方定义**无法取证**——`developers.openai.com`、`openai.com`、`platform.openai.com` 三个官方入口用 web_fetch 与 curl（带浏览器 UA）重试后仍全部返回 403 / Cloudflare 拦截。因此**没有任何**关于「Agent Builder 存在 manager/orchestrator 节点」的可核实来源，本报告不采用任何搜索摘要作为该结论的依据。除 Anthropic（2024-12-19 / 2025-06-13）、Microsoft Learn（2026-08-25 / 2026-09-04）、Microsoft 博客（2026-07-08）、arXiv（2024-11-07）、OpenAI PDF（2025-04-07）、langgraph-supervisor README（提交 2026-03-02）外，各框架文档站均**页面无日期**。AutoGen 0.2 遗留的 `GroupChatManager.speaker_selection_method` / `max_round` 参数清单未逐字取证。

---

### 问题 2：AI 原生公司的真实组织——管理层剩下了什么，取消了哪些职责

（本节完整逐案证据见同目录 [`AI-NATIVE-ORG-PUBLIC-CASES.md`](AI-NATIVE-ORG-PUBLIC-CASES.md)。）

**结论：2024–2026 年公开案例里，被取消的是「层级」和「纯管理岗位」，几乎没有人取消「管理者」。可核实的动作集中在三类：把管理者的举证责任改成「先证明 AI 做不了才能加人」（Shopify）、把管理层级封顶并要求 leader 继续做一线贡献（Coinbase 5 层 + 不设纯管理者）、以及提高单个管理者的管理跨度（Amazon 的 IC:manager 比例目标）。真正被削减的职责是「信息中转与流程审批」，被保留并被强化的职责是「意图设定、判断、问责与异常升级」。**

1. **Klarna：先高调替代，后公开承认「成本权重过高导致质量下降」**。2024-02-27 官方新闻稿：首月 **230 万次对话 = 客服对话的 2/3**，「相当于 **700 名全职客服**」，重复咨询下降 **25%**，解决时效 **<2 分钟（人工 11 分钟）**，预计 2024 年带来 **4,000 万美元利润改善**。招股书 F-1（2025-11）把口径写进监管文件：**截至 2025-06-30 的 12 个月处理 69% 客服对话**；「700 人」的估算方法是**「2024 年上线后全职客服每月处理的 chat+电话量的平均下降幅度」**；2024 年由此产生约 **3,900 万美元成本节约**。反转发生在 **2025-05-08**：Siemiatkowski 对 Bloomberg 称「cost 成了过于主导的评估因子，结果是质量下降」，公司恢复招聘人工客服。年报口径：**FY2025 处理 80% 对话**，不含顾问的全职员工 **2,831 人**（2024: 3,422；2022: 5,527）。（公司官方 + 一手访谈；[Klarna 2024-02-27 新闻稿](https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/)、[F-1/A](https://www.sec.gov/Archives/edgar/data/2003292/000200329225000024/klarnagroupplcf-1a3.htm)）

2. **Shopify：把「AI 用得好」变成履职前提，并把加人的举证责任翻转到团队身上**。Tobi Lütke **2025-04-07** 内部信逐字：「**Reflexive AI usage is now a baseline expectation at Shopify.**」「**Before asking for more headcount and resources, teams must demonstrate why they cannot get what they want done using AI.**」员工数从 2022 年 **11,600** 降至 2024 年末 **8,100**，FY2025 末约 **7,600**，同期收入 **115.56 亿美元（+30%）**。**未找到公开来源**说明 Shopify 对中层管理者层级/数量做过官方调整。（公司官方；原始发布在 X，本次环境无法抓取 X，逐字引用来自 [Forrester 2025-04-08](https://www.forrester.com/blogs/what-you-can-learn-from-shopifys-ceos-memo-on-workforce-ai/)）

3. **Block：2026-02-26 裁 4,000+ 人，Dorsey 明确把「更小更平的团队」作为 AI 的结构性后果**。裁员后员工数从「超过 10,000」降至「略低于 6,000」；重组费用 **4.5–5.0 亿美元**；消息公布后盘后股价涨约 **25%**。Dorsey 原话：「the intelligence tools we're creating and using, paired with **smaller and flatter teams**, are enabling a new way of working…」「I think most companies are late… **the majority of companies will reach the same conclusion and make similar structural changes.**」**重要更正**：用户问题中的「Block 2025 年砍约 40%」**未找到公开来源**；可核实的近半裁员发生在 **2026-02-26**。Block 2024 年「10% 裁员」与内部 agent「goose」**均未核到一手来源**。（一手 + 二手；[Reuters 2026-02-26](https://www.reuters.com/business/blocks-fourth-quarter-profit-rises-announces-over-4000-job-cuts-2026-02-26)、[Fortune 2026-02-27](https://fortune.com/2026/02/27/block-jack-dorsey-ceo-xyz-stock-square-4000-ai-layoffs/)）

4. **Coinbase 给出了本次调研中最明确的「管理层还剩什么」清单**。SEC Form 8-K（**2026-05-05**，Item 2.05）写明重组目的之一是「**为 AI 时代优化公司运营**」，裁约 **700** 人＝截至 2026-05-01 全球员工的约 **14%**，重组费用 **5,000–6,000 万美元**。Armstrong 全员信的结构规则：**管理层级在 CEO/COO 之下封顶 5 层**；**不设纯管理者**——每位 leader 必须同时是「强且活跃的 individual contributor」；招聘集中在「**AI-native pods**」，并试验把工程/设计/产品合并为一个角色的「**one person teams**」。**反面口径**：Mizuho 分析师 Dan Dolev 对 Bloomberg 称加密寒冬「probably the real reason for most of the cuts」，AI 更可能是「an easy excuse」。（公司官方 + 一手 + 二手；[8-K](https://www.sec.gov/Archives/edgar/data/1679788/000167978826000049/coin-20260505.htm)、[Business Insider](https://www.businessinsider.com/coinbase-layoffs-ai-brian-armstrong-job-cuts-letter-2026-5)）

5. **Amazon 的一手口径是「比例目标」，不是「裁多少管理者」**。Jassy **2024-09-16** 内部备忘录：要在 **2025 Q1 末之前把 individual contributor 对 manager 的比例至少提高 15%**。**「裁掉约 14,000 名管理者」是 Morgan Stanley 的推算，不是亚马逊公告。** 2025-06-17 官方全员信：「in the next few years, we expect that this will **reduce our total corporate workforce** as we get efficiency gains from using AI extensively across the company.」2025-10-28 裁约 **14,000** 个企业岗位（Galetti 信：「**fewer layers and more ownership**」「**removing layers**」），2026-01-28 再裁约 **16,000**，自 2025-10 起累计 **30,000**，遣散成本约 **18 亿美元**。**亚马逊从未公布 15% 比例目标是否达成。**（一手 + 公司官方；[Reuters 2024-09-16](https://www.reuters.com/technology/amazon-mandates-five-days-week-office-starting-next-year-2024-09-16)、[Amazon 官方 2025-06-17](https://www.aboutamazon.com/news/company-news/amazon-ceo-andy-jassy-on-generative-ai)、[GeekWire 2026-01-28](https://www.geekwire.com/2026/amazon-confirms-16000-more-job-cuts-bringing-total-layoffs-to-30000-since-october)）

6. **Salesforce 的 4,000 是客服支持岗口径，且公司要避免把中层作为叙事焦点**。Benioff 在 The Logan Bartlett Show（**2025-08-29**）称「**I've reduced it from 9,000 heads to about 5,000, because I need less heads**」。公司官方声明：「we've seen the number of support cases we handle decline and we **no longer need to actively backfill support engineer roles**」「We've successfully **redeployed hundreds of employees** into other areas like professional services, sales, and customer success」。**被取消的是「支持工程师岗位的回填」，被保留的是复杂/升级场景与专业服务、销售、客户成功。**（一手访谈 + 公司官方；[CNBC 2025-09-02](https://www.cnbc.com/2025/09/02/salesforce-ceo-confirms-4000-layoffs-because-i-need-less-heads-with-ai.html)）

7. **「小团队 + 高 ARR」里唯一由公司官方同时给出收入与人数的是 Cursor**：官方博客（**2025-11-13**）——Series D 融资 **23 亿美元**、投后 **293 亿**，**超 300 人**，**年化收入超 10 亿美元**。Anthropic 与 OpenAI 只有第三方推算（Epoch AI，**2026-05-08**）：Anthropic 约 **300 亿美元 / 3,328 人**（人均约 901 万），OpenAI 约 **250 亿美元 / 4,433 人**（人均约 564 万）。Midjourney 的「约 5 亿美元 / 40 人」**存在来源冲突**（另一来源称 107 人），**只能标估算**。（公司官方 + 第三方数据库；[Cursor 官方博客](https://cursor.com/blog/series-d)）

8. **公开把「因 AI 削中层」说出口的公司不多，且多数口径要打折**：Meta **2026-05-20** 裁约 **8,000** 人（约 10%）并把约 **7,000** 人转入 AI 团队，CPO Janelle Gale 备忘录称「**flatter structure with smaller teams of pods/cohorts**」（原文由 Bloomberg 首发，本次仅取得转述）；Google **2024-12** 管理者/总监/VP 岗位减少 **10%**，但公司对外表述是「效率」，**AI 归因属推断**；Snap **2026-04** 裁 **1,000** 人（16%）、关闭 **300** 空缺，Spiegel 备忘录称「**small squads leveraging AI tools**」；Duolingo **2025-04** 的「AI-first」在 **2025-05-22** 被 von Ahn 公开回撤（「**I do not see AI as replacing what our employees do**」）；Zapier **2025-05** 起要求所有新员工「AI fluent」，一次全员 hackathon 把每周使用 AI 的人从**不到 10%** 提到**超过 50%**（公司自述口径）。（二手为主，逐条已在案例文件中标注强度）

9. **反例是明确存在的，且集中在「问责」与「协调负荷」两点上**（详见第三节）。（多来源）

**未能核实的部分（Q2）**：Block 2024 年「裁员 10% / 约 1,000 人」与内部 agent「goose」**均未取得一手来源**；「Block 2025 年砍约 40%」**与已核实事实不符，未找到公开来源**；Amazon「裁减 14,000 名管理者」为 Morgan Stanley 推算而非公司口径；Midjourney 人数（40 vs 107）与收入两来源矛盾；Telegram「30 名员工」**未取得 Durov 原始表述**；WhatsApp 收购时「约 55 名员工」**未取得一手 URL**；Meta Gale 备忘录原文（Bloomberg 付费墙）**未取得**；Google 的 AI 归因属推断；Shopify 备忘录原始 X 页面**本环境无法抓取**（内容经 Forrester 逐字引用可核）；Klarna 播客口径「7,000→3,000」与年报 FTE 口径冲突，**建议只用年报口径**；Salesforce「AI 承担 30–50% 工作」经 NBC Bay Area 转述、**未取得原始播客全文**；**「Zapier / Automattic 因 AI 削中层」未找到任何官方或可靠来源**（Automattic 官方归因为竞争与诉讼成本，且该模式早于生成式 AI）。

---

### 问题 3：「Agent 当经理」的实证——真实系统里 LLM agent 管理多个 worker agent，效果如何

**结论：截至 2026 年 9 月，公开证据同时支持「管理层有用」和「管理层是主要成本与失败来源」两边，且适用条件已被量化。最硬的一条受控实验结论是：错误放大倍数取决于协调结构——互不通信的独立并行多智能体放大 17.2×，而带集中式编排的降到 4.4×。也就是说，「要不要管理层」在证据层面部分等价于「要不要一个把错误拦截在汇总之前的瓶颈」。**

1. **错误放大倍数有原始论文，且明确区分了「有编排」与「无编排」**：Yubin Kim 等（Google Research + MIT + Google DeepMind），《Towards a Science of Scaling Agent Systems》，[arXiv:2512.08296](https://arxiv.org/abs/2512.08296)（v1 2025-12，v2 2025-12-17）。口径：**180 个受控配置 × 4 个 agentic 基准 × 3 个 LLM 家族，匹配 token 预算（每 trial 平均 4,800 reasoning tokens）**。误差放大因子 Ae：**Single-agent 1.0 / Centralized 4.4（95% CI [3.8, 5.0]）/ Hybrid 5.1 / Decentralized 7.8 / Independent 17.2（95% CI [14.3, 20.1]）**。原文机制解释：「Independent systems amplify errors 17.2× through unchecked error propagation... **Centralized coordination, however, contains this to 4.4× by enforcing validation bottlenecks that intercept errors before aggregation.**」（一手论文）

2. **同一论文给出「加 agent 什么时候变负收益」的阈值**：单 agent 基线准确率超过 **约 45%** 后，增加 agent 出现负回报（β̂=−0.404, p<0.001）；成绩跨度从 **+80.8%**（金融推理，集中式）到 **−70%**（PlanCraft 顺序规划，独立式）；**顺序推理任务上「every multi-agent variant we tested degraded performance by 39–70%」**；架构选择在留出配置上 **87%** 准确可预测。（同上）

3. **成本侧同样是受控测量**：轮次随 agent 数超线性增长——**T = 2.72 × (n + 0.5)^1.724, R² = 0.974, p<0.001**；相对单 agent 的轮次倍数 **Hybrid 6.2×（44.3 vs 7.2）、Centralized 3.8×（27.7）、Decentralized 3.6×（26.1）**；token 效率（每 1,000 token 的成功数）**单 agent 67.7 / Centralized 21.5（差 3.1×）/ Decentralized 23.9 / Hybrid 13.6（差 5.0×）**；边际美元成本（每提升 1% 成功率）**OpenAI Hybrid ≈$0.008 / Google ≈$0.012 / Anthropic Hybrid ≈$0.024**。作者结论：「under fixed computational budgets, **per-agent reasoning capacity becomes prohibitively thin beyond 3–4 agents**」。（同上）

4. **多智能体失败模式有系统分类学，失败率极高**：Mert Cemri 等（UC Berkeley / Stanford 等，**不是 Microsoft Research——这一条常被误标**），《Why Do Multi-Agent LLM Systems Fail?》，[arXiv:2503.13657](https://arxiv.org/abs/2503.13657)（v1 2025-03-17，v3 2025-10-26）。**MAST-Data：1,600+ 条标注执行轨迹，覆盖 7 个 MAS 框架**；分类学来自 150 条轨迹、6 位专家标注者（人标注一致度 **Cohen's κ = 0.88**）；**14 个失败模式 / 3 大类**（系统设计问题、agent 间失配、任务验证）；**总体失败率 41%–86.7%**（原文自注不同基准「not directly comparable」）。高占比模式：步进重复 15.7%、**推理与行动不匹配 13.2%**、未识别任务完成 12.4%、不遵守任务要求 11.8%、错误验证 9.1%、无/不完整验证 8.2%。结论指向组织设计而非模型能力：「many MAS failures arise from the challenges in **organizational design and agent coordination** rather than the limitations of individual task structures」。（一手论文）

5. **验证器不是银弹，但确实减少失败**：同一 MAST 论文原文——「Systems with **explicit verifiers** like MetaGPT and ChatDev generally show **fewer total failures**... However, **the presence of a verifier is not a silver bullet**, as overall MAS success rates can still be low.」实例：ChatDev 生成的国际象棋程序通过编译等表面检查，但存在运行期 bug，「rendering the output unusable despite review phases」；架构权衡上 MetaGPT 比 ChatDev 的 FC1/FC2 失败少 **60–68%**，但 FC3 失败多 **1.56×**。（同上）

6. **Cognition 的立场在 10 个月内发生实质转向，两篇都要看**：2025-06-12《[Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents)》（Walden Yan）主张「you should **by default rule out any agent architectures that don't abide by** 共享上下文 / 动作携带隐含决策两条原则」，并点名批评 openai/swarm 与 microsoft/autogen「actively push concepts which I believe to be the wrong way」。2026-04-22《[Multi-Agents: What's Actually Working](https://cognition.com/blog/multi-agents-working)》自我修正：「10 months ago, I wrote Don't Build Multi-Agents... **A lot has changed since then.**」可行子集被界定为「setups where multiple agents contribute intelligence to a task while **writes stay single-threaded**」。（一手厂商博客；注意第一篇**全文无任何实测数字**，属论证文而非实验）

7. **Cognition 已上线 Manager Devin，并公开了三个管理失败模式**（「LLM 当经理」最直接的一手证据）：「A manager Devin can break a larger task into pieces, **spawn child Devins** to work on them, and coordinate their progress through an **internal MCP**.」失败模式原文：「Managers trained on small-scoped delegation **default to being overly prescriptive**, which backfires when the manager lacks deep codebase context. Agents **assume they share state with their children when they don't**. **Cross-agent communication**... **doesn't happen by default**, because models haven't been trained in environments where it needed to be.」对无结构 swarm 的定性：「we think the unstructured-swarm approach, arbitrary networks of agents negotiating with each other, is **mostly a distraction**. The practical shape is **map-reduce-and-manage: a manager splits work, children execute, the manager synthesizes and reports back.**」（一手厂商博客，2026-04-22）

8. **Cognition 的 verifier 生产数据（唯一带数字的口径）**：「even on PRs written by Devin, **Devin Review catches an average of 2 bugs per PR, of which roughly 58% are severe** (logic errors, missing edge cases, security vulnerabilities)」——口径：Cognition 内部生产数据，样本为 Devin 自己产出的 PR，**未披露 PR 总数与统计窗口**。反直觉发现：「we found this technique to work best when the coding and review agents **do not share any context beforehand**」，归因为 context rot 与注意力机制。（同上）

9. **「弱主模型 + 强 advisor」这一层级形态实测失败，但「强模型之间互看」有效**：Cognition 的 SWE-1.5「smart friend」实验——「**The cost and speed wins were real, but the quality ceiling was set by the primary**, and the primary wasn't strong enough.」而跨前沿模型（Claude + GPT）路由「produced real gains in the trickiest scenarios」，结论是「The delegation logic becomes a **capability router** rather than a difficulty escalator.」（同上，2026-04-22）

10. **Anthropic 官方给出了多智能体的最强正例与最硬成本**：多智能体（Opus 4 lead + Sonnet 4 subagents）比单智能体 Opus 4 在**内部研究评测**上高 **90.2%**；成本上「agents typically use about **4× more tokens than chat** interactions, and **multi-agent systems use about 15× more tokens than chats**」；token 用量单独解释 BrowseComp 性能方差的 **80%**，三因素合计 **95%**。并行化（lead 并行启动 3–5 个子 agent + 子 agent 并行 3+ 工具）使复杂查询**研究时间最多缩短 90%**。（一手官方工程博客，[How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)，2025-06-13）

11. **Anthropic 公开承认其管理层目前「管不动」**：同步执行导致「**the lead agent can't steer subagents, subagents can't coordinate**, and the entire system can be blocked while waiting for a single subagent to finish searching」。（同上）

12. **Anthropic 2026 年的官方取向是反转层级**：advisor strategy 让**弱模型驱动、强模型当顾问**——「inverts a common sub-agent pattern, where a larger orchestrator model decomposes work and delegates to smaller worker models. In the advisor strategy, a smaller, more cost-effective model drives and escalates **without decomposition, a worker pool, or orchestration logic**」。效果：Sonnet + Opus advisor 在 SWE-bench Multilingual 上比 Sonnet 单干 **+2.7 个百分点，同时每任务成本降 11.9%**；Haiku + Opus advisor 在 BrowseComp 上 **41.2% vs Haiku 单干 19.7%**，且比 Sonnet 单干便宜 **85%**。（一手官方博客，[The advisor strategy](https://claude.com/blog/the-advisor-strategy)，2026-04-09）

13. **「多加一层 LLM 自评」在受控实验里往往是负收益**：Jie Huang 等（Google DeepMind + UIUC），《Large Language Models Cannot Self-Correct Reasoning Yet》，[arXiv:2310.01798](https://arxiv.org/abs/2310.01798)（ICLR 2024）。原文：「**LLMs struggle to self-correct their responses without external feedback, and at times, their performance even degrades after self-correction**」。实测（准确率 %，括号为 LLM 调用次数）：GPT-3.5 GSM8K **75.9(1) → 75.1(3) → 74.7(5)**；GPT-3.5 CommonSenseQA **75.8 → 38.1 → 41.8**；GPT-4 GSM8K **95.5 → 91.5 → 89.0**；Llama-2 GSM8K **62.0 → 43.5 → 36.5**。同一论文还指出 Reflexion / RCI 类方法「**Use of oracle labels**」——收益随 oracle 标签消失而消失。（一手论文）

14. **同调用次数下，多智能体辩论不如简单多数投票**：同一论文表 7，GSM8K——Standard 76.7(1)；Self-Consistency **82.5(3)**；Multi-Agent Debate round1 83.2(6) vs Self-Consistency **85.3(6)**；MAD round2 83.0(9) vs Self-Consistency **88.2(9)**。原文：「**multi-agent debate significantly underperforms simple self-consistency using majority voting**」。独立复现见 Smit 等，《[Should we be going MAD?](https://arxiv.org/pdf/2311.17371)》（2023-11）：MAD「**do not reliably outperform** other proposed prompting strategies, such as self-consistency」，且「requires a **higher number of API calls**... ultimately, the **total running cost**」。（一手论文）

15. **正向的 verifier/critic 证据同样存在，但要看条件**：Reflexion（[arXiv:2303.11366](https://arxiv.org/abs/2303.11366)）「**91% pass@1 on HumanEval, surpassing the previous state-of-the-art GPT-4 that achieves 80%**」；CRITIC（[arXiv:2305.11738](https://arxiv.org/abs/2305.11738)，ICLR 2024）在 ChatGPT 上「**7.7 F1 enhancements across three QA tasks, 7.0% absolute gains on three mathematical reasoning tasks, and a 79.2% reduction in toxicity probability**」。但 CRITIC 自己的消融显示：模型**自我批判**贡献极小（−0.03 与 +2.33 F1），「even **fall short compared to the initial output**」，并称结果「underscore the **unreliability of all tested LLMs, when it comes to validating their own results**」——即**有效的是外部工具反馈，不是 LLM 自评**。（一手论文）

16. **真实生产系统的规模数据（无对照，但有量级）**：Cursor，[Scaling long-running autonomous coding](https://cursor.com/blog/scaling-agents)（2026-01-14）——扁平自协调的实测退化：「**Twenty agents would slow down to the effective throughput of two or three**, with most time spent waiting」；无层级时「agents became **risk-averse**... No agent took responsibility for hard problems」；改为 planners/workers + judge 后解决大部分协调问题。规模：**trillions of tokens**；浏览器项目跑了近一周，**>1M LoC / 1,000 个文件**；Solid→React 迁移 **>3 周 +266K/−193K edits**。**反向发现**：初期设的 integrator（质量与冲突仲裁角色）「**created more bottlenecks than it solved**」，移除后更好；结论「**Too little structure and agents conflict, duplicate work, and drift. Too much structure creates fragility.**」（一手厂商工程博客）

17. **「100+ agent 的编排层」在安全域有官方自测数据**：Microsoft，[Defense at AI speed](https://www.microsoft.com/en-us/security/blog/2026/05/12/defense-at-ai-speed-microsofts-new-multi-model-agentic-security-system-tops-leading-industry-benchmark/)（2026-05-12，作者 Taesoo Kim，VP Agentic Security）——「the harness **orchestrates more than 100 specialized AI agents** across an ensemble of frontier and distilled models」。数字：**CyberGym 公开榜 1,507 个真实漏洞复现任务上 88.45%**，「roughly five points above the next entry, 83.1%」；私有测试 **21/21 植入漏洞全部发现、0 误报**；召回 clfs.sys 96% / tcpip.sys 100%。口径：**厂商官方博客自测**，系统仍为 limited private preview；注意官方原词是 agents，不是二手报道常写的「100+ models」。（一手厂商博客）

18. **Magentic-One 的成绩是「与 SOTA 统计相当」，不是「更好」**：Microsoft Research 官方文章原文——「Magentic-One achieves **statistically competitive performance** to the state-of-the-art on multiple challenging agentic benchmarks」，且「While Magentic-One shows strong generalist capabilities, it's **still far from human-level performance and can make mistakes**.」（[Microsoft Research 官方文章](https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/)；架构论文 [arXiv:2411.04468](https://arxiv.org/abs/2411.04468)，2024-11-07）

**未能核实的部分（Q3）**

- **HAL GAIA leaderboard 的成本列**（如单次评测 $178.20 / $7.80）：该页为 JS 渲染，curl 与 web_fetch 均取不到正文，**未在原始页面核实，本报告不引用**。
- **Cursor「用多智能体把 GPU kernel 加速 38%」**（自述 2026-04-14）：仅在 Cursor 博客相关文章列表中见到标题与摘要，**未找到可打开的原文 URL**，38% 口径未核实。
- **是否存在针对《Don't Build Multi-Agents》的正式反驳论文**：未找到。实际存在的「回应」是 (a) Anthropic 次日发布的多智能体研究系统博客（Cognition 自己在脚注中点名），(b) Cognition 2026-04-22 的自我修正。
- **「error amplification up to 17×」作为行业通行常数的说法不成立**：核实为 17.2×，**仅限「独立式（互不通信）」在 4 个基准、固定 4,800 token 预算下的测量值**；同一研究给出集中式 4.4×。**不存在「所有多智能体统一放大 17 倍」的公开证据。**
- **把「层级制 vs 扁平制」的 LLM 调用数 + token + wall-clock 三项同口径做齐的单一研究**：未找到。现有证据是拼接的——Google 那篇给轮次/token/美元（受控但为合成基准），Anthropic 与 Cursor 给 wall-clock 与规模（真实生产但无对照）。

---

### 问题 4：管理层如何做预算/成本控制、权限委派、审计与问责

（本节完整逐条证据见同目录 [`MULTI-AGENT-GOVERNANCE-SOURCES.md`](MULTI-AGENT-GOVERNANCE-SOURCES.md)。）

**结论：2026 年已出现成体系的官方治理原语，但它们一致地把「管理层的控制力」实现为模型外的控制平面（策略引擎、网关、身份系统、预算硬上限），而不是让上层 LLM 自己管自己。最直接的官方措辞来自 AWS：控制要「enforced at the control-plane boundary … rather than relying on agent self-restraint」。**

1. **NIST 定的是「责任在人」，不是「层级由 agent 构成」**：《AI RMF 1.0》NIST AI 100-1（**2023-01**）原文——「GOVERN 2.3: **Executive leadership of the organization takes responsibility for decisions about risks** associated with AI system development and deployment.」「GOVERN 3.2: Policies and procedures are in place to define and differentiate roles and responsibilities for **human-AI configurations** and oversight of AI systems.」以及「**Human-AI configurations can span from fully autonomous to fully manual**… **Other systems may specifically require human oversight.**」（官方标准，[NIST AI 100-1](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf)）

2. **NIST 的 GenAI Profile 把「过度依赖自动化」本身列为风险**：《AI RMF: Generative AI Profile》NIST AI 600-1（**2024-07**）§2.7 Human-AI Configuration——「humans may **over-rely** on GAI systems… This phenomenon is an example of **automation bias, or excessive deference to automated systems.**」；可引用行动含 GV-3.2-003「**Define acceptable use policies**」与 GV-3.2-004 反馈与 **recourse** 机制。**注意：该文件没有「自主行动不可逆后果」这一风险类别。**（官方标准，[NIST AI 600-1](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)）

3. **NIST 的 agentic 控制基线尚未发布**：COSAiS（SP 800-53 Control Overlays for Securing AI Systems）概念文件 **2025-08-14** 征评，五个用例明确含 **Using AI Agent Systems – Single Agent** 与 **– Multi-Agent**（原文描述为「**multiple agents working in concert** … with **limited human supervision**」），但**agentic overlay 文本尚未发布**，不能当作已生效控制。（官方项目页，[COSAiS](https://csrc.nist.gov/projects/cosais)，Updated 2026-01-08）

4. **权限委派的核心争议被 OWASP 写成两条可执行规则**：OWASP LLM06:2025 Excessive Agency 的根因是「**excessive functionality; excessive permissions; excessive autonomy**」，触发条件明确包含「**(in multi-agent/collaborative systems) a malicious/compromised peer agent**」；两条关键缓解是「Utilise **human-in-the-loop control** to require a human to approve high-impact actions」与「**Implement authorization in downstream systems rather than relying on an LLM to decide if an action is allowed**」。（官方文档，[LLM06:2025 一手 markdown](https://raw.githubusercontent.com/OWASP/www-project-top-10-for-large-language-model-applications/main/2_0_vulns/LLM06_ExcessiveAgency.md)）

5. **OWASP 2026 版新增「跨跳保留原始授权范围」的委派链要求**：GenAI LLM Top 10 **2026（2026-08-04 发布）**把 Excessive Agency 移到 **LLM03:2026**，新增 **LLM06:2026 Unbounded Consumption**；新要求原文「In **delegated or multi-agent workflows, preserve the original user context and authorization scope across chained tool or agent calls**, rather than relying only on the permissions of the calling agent or service identity.」**引用「LLM06 Excessive Agency」时必须注明是 2025 版。**（官方文档，[2026 版仓库](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/tree/main/2026/final)）

6. **OWASP 把「编排队列」本身列为风险面**：《OWASP Top 10 for Agentic Applications for 2026》（**2025-12-09** 发布）清单为 ASI01 Goal Hijack｜ASI02 Tool Misuse & Exploitation｜**ASI03 Identity & Privilege Abuse**｜ASI04 Supply Chain｜ASI05 Unexpected Code Execution｜ASI06 Memory & Context Poisoning｜ASI07 Insecure Inter-Agent Communication｜**ASI08 Cascading Failures**｜**ASI09 Human-Agent Trust Exploitation**｜ASI10 Rogue Agents。AIVSS v0.8 另把「**Agent Orchestration and Multi-Agent Exploitation**」「**Agent Identity Impersonation**」「**Agent Untraceability**」列为十大核心风险，§9 描述审计困境：「a single logical operation can **span multiple identities and system logs**」「**forensic black hole**」「Loss of Chain-of-Action (**Repudiation Risk**)」。（官方文档 + 官方 PDF，[发布稿](https://genai.owasp.org/2025/12/09/owasp-genai-security-project-releases-top-10-risks-and-mitigations-for-agentic-ai-security)、[AIVSS v0.8 PDF](https://aivss.owasp.org/assets/publications/AIVSS%20Scoring%20System%20For%20OWASP%20Agentic%20AI%20Core%20Security%20Risks%20v0.8.pdf)；**逐条正文因 Cloudflare 未取得，本报告仅引用清单**）

7. **AWS 用一份专门的 Well-Architected Lens 把「管理层的活」拆成可执行控制项**：《AWS Well-Architected Agentic AI Lens》（**2026-06-10** 发布）AGENTCOST01 写明「multi-agent coordination adds **multiplicative overhead**」，控制手段是「iteration caps and **session-level token budgets**」，且「**enforced at the control-plane boundary through AgentCore Policy and Gateway rather than relying on agent self-restraint**」，并用「**AWS Budgets alerts on orchestration-to-execution ratios and supervisor-to-worker ratios**」——这是本次调研中**唯一把「上级/下级比例」写成监控指标**的官方文档。AGENTSEC07 给出熔断机制：「deviations trigger **rapid containment through credential revocation and circuit-breaker activation**, with **forensic state captured before isolation**」。（官方文档，[Agentic AI Lens](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentic-ai-lens.html)）

8. **委派链的身份模型已标准化到「三层身份 + 用户上下文随签名令牌传递」**：AWS AGENTSEC03 区分「**on behalf of a user**, where a human initiated the request and the agent's actions **must be bounded by that user's permissions**」与「**Autonomously**」，要求「**the user context propagates as signed token claims through the call chain without the agent ever assuming the user's credentials**」；定义为 **agent identity / service identity / transaction identity** 三层；反面模式是「having the agent **assume a user's role** rather than carrying user context as signed token claims, which **collapses the audit trail**」。技术底座是 **RFC 8693 OAuth 2.0 Token Exchange**（claim `act` / `may_act`），**被 AWS AgentCore Identity 官方文档直接引用为实现 on-behalf-of 委派的基础**。（官方文档，[RFC 8693](https://www.rfc-editor.org/rfc/rfc8693)）

9. **微软把 agent 当「非人类身份」纳入既有身份体系**：Microsoft Learn《What is Microsoft Entra Agent ID?》把 agent 定义为「**nonhuman identities**」，并用 blueprint → **parent-child** 表达派生关系；配套文档含《What is the Microsoft agent identity platform?》《Owners, sponsors, and managers》《Sign-in and audit logs》《Authorization in Microsoft Entra Agent ID》——后者 `ms.date` = **2026-06-12**，原文把 agent identity 定位为「让组织**发现、管理并保护**租户内运行的 AI agent，并配有策略执行」，且明确是「**instead of treating agents as either full users or generic apps**」。（官方文档，已验证 URL：[Entra Agent ID](https://learn.microsoft.com/en-us/entra/agent-id/what-is-microsoft-entra-agent-id)、[agent identity platform](https://learn.microsoft.com/en-us/entra/agent-id/what-is-agent-id-platform)、[Owners, sponsors, and managers](https://learn.microsoft.com/en-us/entra/agent-id/agent-owners-sponsors-managers)、[Sign-in and audit logs](https://learn.microsoft.com/en-us/entra/agent-id/sign-in-audit-logs-agents)、[Authorization in Entra Agent ID](https://learn.microsoft.com/en-us/entra/agent-id/authorization-agent-id)）
   - **降级说明**：另有一份标题为《Least privilege for AI agents》的 Learn 页（抓取记录标注 **2026-07-15** 更新），含五类挑战（Identity ambiguity / Permission creep and excessive aggregate privileges / Over-broad tool access / Weak audit trails / Slow revocation and incomplete containment）、「named owner/sponsor and approver」「Deny unreviewed tools … by default」「log … correlation ID and 'on behalf of' user」，以及 KPI「Mean time to revoke or disable an agent identity」。**该页确切 URL 本轮未能在 `entra/agent-id` 目录树中复核到**，故以上细节以「抓取记录」而非可复核链接的形式保留，**引用前需人工定位该页**。

10. **预算控制的官方共识是「硬上限 + 熔断」，不是「提醒」**：OWASP LLM06:2026 Unbounded Consumption 原文——「**A defining characteristic of this threat is cost asymmetry.**」「**Traditional request-rate limiting alone is no longer sufficient. Effective defense demands token-aware cost controls, hard spending caps, agent-level circuit breakers, and continuous cost-attribution monitoring.**」风险例含 **Denial of Wallet**、**Reasoning-Loop and Thinking-Token Exhaustion**、**Agent-Tool Interactions Flooding Model Resources**；缓解要求「**non-overridable budget ceilings per API key, user, team, and cloud account** … must be **enforcement mechanisms that halt inference when exceeded, rather than alerting thresholds**」。（官方文档，[LLM06:2026](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/blob/main/2026/final/LLM06_UnboundedConsumption.md)）

11. **人在环升级有可直接引用的官方政策范本**：AWS《AGENTSEC04-BP02 Human-in-the-loop for critical decisions》原文——「**Routing every agent action through human review produces rubber-stamp approvals. Routing none produces unbounded autonomy. Risk-tiered approval pauses agents only for the decisions where human judgment actually changes the outcome**」；基线为「**read-only operations proceed autonomously, low-risk writes require single-reviewer approval, and higher-risk operations (financial transactions, data deletion, external communications) require stricter approval**」；要求「**Risk classification itself can't rely on an LLM exposed to the same untrusted content** … **Use deterministic logic (policy engines, rule-based classifiers) as the authoritative signal**」；超时须有兜底「**notify secondary reviewers, escalate to management, or default to a safe fallback, typically blocking the operation**」；且「**Wildcard trust grants … should not be issued.**」（官方文档，同上 Lens）

12. **OpenAI 的官方升级触发条件只有两条**：「**Exceeding failure thresholds**: Set limits on agent retries or actions… escalate to human intervention」与「**High-risk actions**: Actions that are sensitive, irreversible, or have high stakes should trigger human oversight until confidence in the agent's reliability grows.」（官方 PDF，[A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)，p.31）

13. **法规层面，欧盟 AI 法案第 14 条把「人类监督」写成设计义务**：Regulation (EU) 2024/1689 Article 14 要求高风险系统「can be **effectively overseen by natural persons**」，监督须「**commensurate with the risks, level of autonomy and context of use**」，含 **automation bias** 防范、**override/reverse** 能力与 **'stop' button**（「come to a halt in a safe state」）；Annex III 1(a) 情形需「**separately verified and confirmed by at least two natural persons**」；Art.26(2)「**Deployers shall assign human oversight to natural persons who have the necessary competence, training and authority**」。**生效时间（据 Art.113(c)）：2027-12-02（Annex III 高风险）/ 2028-08-02（Annex I 高风险）**。（法规条文，[Article 14](https://artificialintelligenceact.eu/article/14/)；OJ 发布 2024-07）

14. **审计要求已细到「传输层身份与应用层身份都要记」**：IETF WIMSE 架构草案 `draft-ietf-wimse-arch-08`（**2026-07-06**，Informational）含 Audit Trails、Delegation and Impersonation、AI and ML-Based Intermediaries 三类用例，原文要求「**Audit records for layered authentication SHOULD record both the transport-layer identity and the application-layer identity**」，并规定「a destination workload **MUST NOT assume that a transport-layer identity authenticated by an intermediary is the same as the application-layer caller identity**」。（标准草案，[WIMSE 文档列表](https://datatracker.ietf.org/group/wimse/documents/)）

**未能核实的部分（Q4）**

- **OWASP genai.owasp.org 全站被 Cloudflare 拦截**：《Agentic AI – Threats and Mitigations》（页面标注 **2025-02-17**）PDF 正文与其威胁编号、Agentic Top 10 2026 逐条正文（含 **ASI03 的 confused deputy 官方定义**）、Agent Control Standard 技术规范、《State of Agentic AI Security and Governance》2.01（**2026-06-01**）正文**均未取得**。
- **Salesforce 官方条文未取得**：Einstein Trust Layer 的 Help 页存在（`sf.generative_ai_trust_layer`）但为 JS 渲染；掩码/零保留/毒性评分/审计字段与保留规则本轮**只有第三方转述，不引用**。可用者仅为 Salesforce **官方培训视频**《Set Up Agent Permissions》——「The agent user has a **dedicated user record and profile**」「**By default, that user has a limited set of permissions**」「whenever you iterate on the agent… **you must also update the agent user's permissions**」。**「Agentforce Orchestrator」这个确切名称未找到任何官方文档**（与问题 6 交叉印证）。
- **NIST 2025–2026 的正式 agentic 文本**：COSAiS 单/多智能体 overlay **尚未发布**；CSA 简报提到的 RFI（docket NIST-2025-0035）、IR 8596、NCCoE agent identity 概念文、Q4 2026 AI Agent Interoperability Profile **均未取得 NIST 一手页**。
- **NIST AI 100-2e2025（2025-03）关于 agent 的扩充说法不成立**：「agent hijacking」**只出现在参考文献**（引用 U.S. AISI），未设为本体分类条目。
- **per-agent 强制预算熔断**：Google Cloud / Anthropic / LangSmith 均**未找到公开来源**；OpenAI 官方 Help（`platform.openai.com`）**403 被拦**，org/project spend limits 是否为硬限**两说并存、未核实**；AWS Budgets 能否直接阻断花费**未找到官方原文**。
- **「agent identity + delegated scopes + attestation」这一命名下的完整整合模式**：**未在任何官方文件中找到**；最接近的是 WIMSE 架构 + 1Password 的 AIMS 草案（Identifier/Credentials/Attestation/Provisioning）+ Microsoft Entra 三构造 + Google Agent Identity（SPIFFE + 24 小时 X.509）。
- **厂商官方 escalation policy 模板**：未找到公开来源。**监管机关就自主智能体责任的专门表态**：未找到公开来源（UK ICO 仅有第三方律所分析；SEC 无一手材料）。

---

### 问题 5：管理幅度——一个管理者能有效管理多少 agent / 多少直接下属

（本节完整逐条证据见同目录 [`SPAN-OF-CONTROL-AND-METRICS.md`](SPAN-OF-CONTROL-AND-METRICS.md)。）

**结论：传统组织理论经验值（4–8 人）的一手可核实性比通常以为的差得多——最常被引用的 Fayol「不得超过 6 名下属」找不到任何原始文本支撑；真正有数据的是 CEO 直接下属从 1986 年约 4.5 人升到 1998–1999 年约 7–8 人。而在 AI 侧，「span of control for AI agents」作为成型概念未找到公开来源；能替代它的是三样东西：厂商的分级扇出建议、模型外的轮次/停滞硬参数、以及一篇量化「超过多少人开始负收益」的受控论文。**

1. **Graicunas 是被逐字核实的古典源头，其结论是「最多 5 人、多数情况 4 人」**：首发《The Bulletin of the International Management Institute》**1933-03**，1937 年重印于 Gulick & Urwick 编《Papers on the Science of Administration》pp.183-187。关系数 a=n、b=n(n−1)、c=n(2ⁿ/2−1)、总数 f=n(2ⁿ/2+n−1)；n=4→44、n=5→100、n=6→222；原文「an increase in complexity of **127 per cent in return for a 20 per cent increase in working capacity**」。**勘误**：常被引用的 n=12 → 24,564 只是 c（群体关系），总数 f=**24,708**。（一手文献转述，[Nickols 的原文整理](https://www.nickols.us/graicunas.htm)）

2. **Fayol 的「≤6 名下属」不应引用**：调查未找到任何原始文本支撑该数字，可确认的只有书目（*General and Industrial Management*, trans. Storrs, Pitman 1949）。**该数字在中英文二手材料中流传极广，这是本节最重要的负面结论。**（未能核实）

3. **Urwick 的「5–6」目前只有二手归属**：L. F. Urwick, "The Manager's Span of Control", *Harvard Business Review*, **1956 May–June, pp.39-47** 存在（p.43 原句已核实），但「5–6」这一数字只在 Nickols 的转述中出现，HBR 原文未取得。另需注意：「高层 3–8、一线至多 30」这类按层区分的说法归于 **Davis 而非 Urwick**。更早来源：Gen. Sir Ian Hamilton,《The Soul and Body of an Army》**1922**, p.229。（一手文献存在，具体数字为二手）

4. **有真实数据的是 CEO 直接下属的历史变化**：Rajan & Wulf（NBER WP 9633, **2003**；*REStat* 2006）——CEO 直接下属**均值 4.46（中位 4）1986 → 6.79（中位 6）1998**；**剔除重大并购后 4.4 → 8.2**；样本 **300+ 家美国大企业（1986–1998）**，数据源 Hewitt Associates。**归属勘误**：HBS WP 12-087 是 **Julie Wulf 独著（2012）**《The Flattened Firm—Not as Advertised》，不是 Rajan & Wulf；该文转述为 **4.5(1986)→近 7(1999)**。（一手论文，[HBS 工作论文页](https://www.hbs.edu/faculty/Pages/item.aspx?num=44299)）

5. **「管理的幅度越宽、结果越好」这一常见引述未找到来源**：核查 Bloom / Lemos / Sadun / Van Reenen 系列后确认——NBER WP 20102 全文「span of control」**零命中**；WP 15129 仅 1 次且为理论假设。**该系列没有 span of control 的经验发现。** 有相关结论的是另一组作者：*Does Management Matter? Evidence from India*（NBER WP 16658 / QJE 2013），作者 **Bloom, Eifert, Mahajan, McKenzie, Roberts**，逐字「One reason better run firms do not dominate the market appears to be constraints on growth derived from **limited managerial span of control**.」（一手论文）

6. **2020–2026 实务基准里一手可核实的是 Gallup 与 Pave**：Gallup（[2026-01-13，Jim Harter](https://www.gallup.com/workplace/700718/span-control-optimal-team-size-managers.aspx)）口径为「**How many people report directly to you?**」，样本量逐年为 2013=2,402 / 2019=2,933 / 2022=7,199 / 2023=3,971 / 2024=4,355 / 2025=8,795；**均值 10.9(2024)→12.1(2025)**，较 2013 增近 50%；**中位数仅 5–6**；<5 人占 37%、<10 人占 66%、10–24 人 22%、≥25 人 13%；元分析覆盖 312 项研究 / 92,252 团队 / 897,971 员工；**97% 的管理者兼任个人贡献者职责，中位占用 40% 时间**。Pave（[2026-03-03](https://www.pave.com/blog-posts/what-is-the-average-span-of-control-benchmark)）：Manager+Sr Mgr 均值 **4.9**（Q4'23 为 4.4），Director+ **4.6**，样本 **257,000+ 管理者**；1,000+ 人公司 **5.89**。**注意 Pave 同源另一版为 4.8→5.7，两版口径不同不可混用。**（官方研究页面）

7. **常被引用的 Lattice 与 McKinsey 幅度数字本轮只有二手转引**：Lattice 的「4.3(2020)→5.2(2022)」与 McKinsey 按管理类型的原型（Player/Coach 3–5、Coach 6–7、Supervisor 8–10、Facilitator 11–15、Coordinator 15+）均来自 HRBench 等第三方转引，**一手未核实**。同样**未找到公开来源**的还有 SHRM / Gartner / Deloitte / PwC / Mercer / WTW / ChartHop / Ravio / Levels.fyi 的幅度基准。**BLS 从未发布过「1 名管理者对 11.5 名员工」这一表述**（Gallup 引述时未给表号年份）。（二手 / 未找到）

8. **AI 侧真正的「扇出上限」证据是三样东西，而不是一个管理幅度理论**：
   - **厂商分级建议**：Anthropic 是唯一给出分级数量的厂商——「**Simple fact-finding requires just 1 agent with 3-10 tool calls, direct comparisons might need 2-4 subagents with 10-15 calls each, and complex research might use more than 10 subagents with clearly divided responsibilities.**」；并行度是「the lead agent **spins up 3-5 subagents in parallel**」；失败基线是「**spawning 50 subagents for simple queries**」。（2025-06-13）
   - **模型外硬参数**：Microsoft Magentic `max_round_count=10, max_stall_count=3, max_reset_count=2`（2026-09-04 更新），并注明 Magentic-One 原设计为 **4 个专门 agent**、且「**untested** outside the original design」；CrewAI `max_iter` **默认 20**、`max_retry_limit` 默认 2；AutoGen `max_turns` **默认 None**（「continue until a termination condition is met」）。**LangGraph 的 `recursion_limit` 官方文档确认存在但未写出默认值**（二手称 25，一手未核实）。
   - **量化拐点**：[Towards a Science of Scaling Agent Systems](https://arxiv.org/abs/2512.08296) 测得单 agent 基线准确率超过**约 45%** 后加 agent 递减乃至负收益（β=**−0.404, p<0.001**），作者结论「under fixed computational budgets, **per-agent reasoning capacity becomes prohibitively thin beyond 3–4 agents**」。
   - **负面结论**：**OpenAI 不存在任何 agent 数量建议**（Agents SDK 编排文档只有 Agents-as-tools / Handoffs 两模式，并行仅提 `asyncio.gather`；Cookbook 示例的 4+1 个属示例规模而非推荐上限）。

9. **唯一把「管理幅度」与 AI 明确写在一起的官方文本是 Gartner 的预测**：Gartner **2024-10-22** 新闻稿称 AI 将带来「**increased span of control** by automating and scheduling tasks, reporting and performance monitoring」，同时警告管理者会被「overwhelmed with additional direct reports」。（官方新闻稿，[Gartner 2025 及以后预测](https://www.gartner.com/en/newsroom/press-releases/2024-10-22-gartner-unveils-top-predictions-for-it-organizations-and-users-in-2025-and-beyond)；**直抓被 Cloudflare 403，内容经检索索引与二手报道双源**）

**未能核实的部分（Q5）**：Fayol 原文数值（**「≤6」无任何原始文本支撑，不应引用**）；Simon 1946 逐字原句（*PAR* Vol.6 No.1, Winter 1946, pp.53-67，DOI 10.2307/973030，JSTOR 被拦）；Urwick 1956 HBR 原文；**「管理幅度从 5 扩到 20+」这一历史论断未找到公开来源**；McKinsey 幅度原型与 Lattice 基准（仅二手转引）；Amazon 只有 two-pizza **团队规模**规则（<10 人），**无 span-of-control 规则**；Microsoft **无**公司统一幅度目标（个别领导自设 8 名工程师 / 7 名 PM，属个人偏好非公司政策）；**「span of control for AI agents」作为成型术语未找到公开来源**。

---

### 问题 6：数字员工/数字分身产品是否提供「管理者」概念，如何组织多个 agent

**结论：市面上的「AI 员工」产品分成泾渭分明的两群。真正提供「管理层/编排层」的是企业平台与框架（Salesforce、Microsoft、AWS、UiPath、Intercom、Glean、Clay、Relevance AI）；而纯粹的 GTM/客服数字员工产品（11x、Artisan、Lindy、Ada、Regie.ai、Sierra）在官方文档层面**基本没有** agent 主管概念——其中 Sierra 的「Supervisor models」是包在 LLM 外的安全护栏，是本次调研中最容易被误读为「管理者」的词。另有三个常被引用的说法经核查**不存在官方来源**：「Agentforce Orchestrator」、「Benioff 说过 agentic org chart」、「Lindy 的 agents manage agents」。**

**判定汇总表**

| 产品 | 是否有管理层概念 | 官方概念名称 | 该层的确切职责 | 官方 URL |
| --- | --- | --- | --- | --- |
| Salesforce Agentforce | **是** | `Multi-Agent Orchestration`；`Super Agent`（orchestrator agent）+ `Connected Subagent` | 单入口接收→按子代理 description 语义路由→传上下文→收回控制权并回复用户；**上限 7 个 Connected Subagent**；**官方明确禁止子代理再路由** | [产品页](https://www.salesforce.com/agentforce/multi-agent-orchestration/) |
| Microsoft Copilot Studio | **是** | `multi-agent orchestration`；`main agent` / `parent orchestrator`；`child agents`；`connected agents` | 判定意图并委派；**子代理不得直接回复用户**；数据交接（`context-inclusion`）；安全（子代理权限不得绕过父代理限制）；审计（父子会话关联） | [authoring-add-other-agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-add-other-agents) |
| Microsoft Agent Framework | **是** | `Magentic` + **`manager_agent`** / `MagenticManager` | 规划→逐轮选下一个 agent→进度账本→停滞检测自动重规划→人审计划→最终汇总；参数 `max_round_count` / `max_stall_count` / `max_reset_count` / `RequirePlanSignoff` | [orchestrations/magentic](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/magentic) |
| Microsoft Agent 365 | **是（控制平面，非 agent）** | `Agent 365` — "the **control plane** for AI agents" | Registry / Access Control / Visualization / Interoperability / Security；待审批请求、无主 agent、30 天活动快照、治理缺口 | [agent-365-overview](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/agent-365-overview) |
| AWS Bedrock Agents (Classic) | **是（已冻结）** | **`supervisor agent`** + collaborator agents，官方称 `hierarchical collaboration model` | supervisor 接问题→自动建计划→路由→整合。**2026-07-30 起不再对新客户开放**，整体进入 maintenance mode | [multi-agent-collaboration](https://docs.aws.amazon.com/bedrock/latest/userguide/agents-multi-agent-collaboration.html) |
| AWS Bedrock AgentCore | **否** | Harness / Gateway / Identity / Policy / Registry | 官方对比表原文：supervisor pattern "**Limited**… Routing mode multi-agent is **not straightforward today**. Full multi-agent collaboration **requires custom framework code**." | [agents-classic-maintenance-mode](https://docs.aws.amazon.com/bedrock/latest/userguide/agents-classic-maintenance-mode.html) |
| AWS Agent Squad | 是（**已脱离 AWS**） | `SupervisorAgent` / `Classifier` / `Orchestrator` | "A **lead agent** coordinates a team of specialized agents in parallel using an **agent-as-tools** architecture"；**项目已迁至 2FastLabs** | [2FastLabs/agent-squad](https://github.com/2FastLabs/agent-squad) |
| UiPath Maestro | **是** | `Maestro` + **`Case Manager Agent`** | "**decides which stage to activate next, which tasks to start, when a stage should complete or exit early, and when to escalate**"；**"decides; the engine executes — never mutates the case directly"**；SLA 升级（reassign / notify management / priority flag） | [Maestro Case](https://docs.uipath.com/maestro/automation-cloud/latest/user-guide/introduction-to-maestro-case) |
| ServiceNow | **部分（仅新闻稿）** | 新闻稿：`AI Agent Orchestrator` / `AI Agent Fabric`；文档实际：`AI Agent Studio` / `AI Control Tower` | 文档层是治理+生命周期+可观测，**无 supervisor/manager agent**；主要文档集全量 topic 检索 "Orchestrator"/"Agent Fabric" **0 命中** | [AI Agent Studio](https://www.servicenow.com/docs/r/zurich/intelligent-experiences/ai-agent-studio.html) |
| Workday | **否（无 supervisor agent）** | `Agent System of Record (ASOR)` / `Agent Gateway` / `Agent Management Hub` | 清点/注册/配置/激活/停用；`Ambient` vs `Delegate` 两种执行模式（以自身权限 or 以人类权限）；审计日志；使用与绩效报告。是**数字劳动力系统记录**，不是运行时 supervisor | [ASOR 文档](https://doc.workday.com/admin-guide/en-us/workday-ai/agents/setup-considerations--agent-system-of-record.html)（Last Updated 2026-08-07） |
| Intercom Fin / Fin Operator | **是** | `Fin Operator` — "an agent that runs your customer operations" | 调试会话、改 Fin 配置、知识库更新、分诊、批量操作、QA monitor。**权限边界：所有改动以 proposal + diff 呈现，需人批准**；"never publishes, deletes, or modifies content directly" | [fin.ai/operator](https://fin.ai/operator) |
| Glean | **部分** | `Agent Orchestration`；`Glean auto-routing`；`Task tool` | admin 定义路由条件（≤15 个 conversational agent，首匹配优先）；Auto 模式 primary agent 用 Task tool 拆子任务委派并汇总 | [agent-routing](https://docs.glean.com/administration/managing-agents/agent-routing) |
| Relevance AI | **部分** | `AI Workforce`；`Super GTM`；`Invent` | 官方原文 "**Super GTM acts as an orchestrator**"，按子代理 description 路由；子代理在独立会话/独立上下文运行；**Agent 间只支持单向通信** | [Workforces](https://relevanceai.com/docs/get-started/core-concepts/workforces) |
| Zapier Agents | **否（无独立层）** | `Call an agent`；`main agent` | main agent 顺序调用并汇总，**按出现顺序执行（非动态路由）**，**上限 <5 个** | [Call an agent](https://help.zapier.com/hc/en-us/articles/37902635257101-Call-an-agent-from-another-agent)（Updated 2026-04-27） |
| **Sierra** | **否** | `Agent OS`；`Horizon`；`Ghostwriter` | 官方叙事是**单一 agent**（"from multi-channel → **single agent**"）。⚠️ **`Supervisor models` 指包在 LLM 外的安全监督层**（防幻觉/防滥用），**不是 agent 主管** | [Agent OS 2.0](https://sierra.ai/blog/agent-os-2-0) |
| Decagon | **部分** | `AOPs`；`Duet`；`Watchtower` | Duet 是**构建/优化层 meta-agent**（每次更新 staged for human review + health report）；**无运行时 supervisor** | [decagon.ai/product/duet](https://decagon.ai/product/duet) |
| Google Gemini Enterprise | **部分（治理/目录层）** | `Agent Gallery`；`Workflow Builder`；`Agent Registry` | 集中治理、可视化、审计所有 agent；文档中 "orchestrator" 仅指**外部**编排器调用已注册 agent | [Gemini Enterprise release notes](https://docs.cloud.google.com/gemini/enterprise/docs/release-notes) |
| Google A2A | **否** | A2A Protocol | 官方明确否认："**Not a sub-agent or tool-call protocol.**"；"Not an agent development kit" | [a2a-protocol.org](https://a2a-protocol.org/latest/) |
| Lindy | **否** | `AI employee` / `AI teammate` | 官方全量导出文档（147 KB）检索 manager agent / subagent / orchestrat / multi-agent / supervisor **全部 0 命中** | [docs.lindy.ai/llms.txt](https://docs.lindy.ai/llms.txt) |
| 11x | **否** | `digital workers`（Alice / Julian） | sitemap 全站 50 页无 manager/supervisor/orchestrator；相邻能力仅 `Intelligent Lead Routing` | [docs.11x.ai/introduction](https://docs.11x.ai/introduction) |
| Artisan | **否** | `Ava, the AI BDR`（Ava 2.0，2026-05-26） | artisan.co 全文 grep orchestrat/manager/supervisor/multi-agent **0 命中**；仅 approval gates / escalation rules / RBAC | [artisan.co/ai-sales-agent](https://www.artisan.co/ai-sales-agent) |
| Regie.ai | **否** | `RegieOne`；`Channel` Orchestration | "orchestration" 仅指跨渠道触点编排 + 人机协同；"Dedicated account manager" 指**人** | [RegieOne](https://regie.ai/blog/introducing-regie-one) |
| Clay | **部分** | `Claygent`；`Workflows` | 官方："Workflows is Clay's primary **orchestration layer**"（模型外节点图，open beta）；**无 supervisor/manager agent** | [Workflows](https://university.clay.com/docs/workflows) |
| Cognigy | **部分（仅营销层）** | `AI Ops & Orchestration` | 产品文档层 `orchestrat` / `multi-agent` **0 命中**；文档里 `supervisor` **全部指人类主管** | [AI Ops & Orchestration](https://www.cognigy.com/platform/ai-ops-and-orchestration) |
| Ada | **否** | `AI Agent`；`Handoffs` | 全量文档索引（437 行）manager / supervisor / orchestrat / workforce **全部 0 命中** | [docs.ada.cx/llms.txt](https://docs.ada.cx/llms.txt) |

**逐条要点**

1. **Salesforce 的层级只有两层，且官方明确禁止第三层**：官方术语是 `orchestrator agent` / `Super Agent` + `Connected Subagent`（**不是**「Agentforce Orchestrator」这个产品名）。官方架构定义（Salesforce Admins 官方博客，**2026-07-27**）：Super Agent 的推理引擎读请求→比对每个 Connected Subagent 的 description→选最佳匹配→传上下文（身份/工单号/订单号）→子代理跑自己的推理和动作→**Super Agent 收回控制权并回复用户**。硬约束原文——推荐**每个 orchestrator agent 最多 7 个 Connected Subagent**；"**Connected Subagents respond — they do not route or orchestrate.** If you ever find one trying to call another Connected Subagent, that's a signal to revisit your architecture."（官方博客，[什么是 SoMA](https://admin.salesforce.com/blog/2026/what-is-soma-and-when-to-build-a-super-agent-or-a-single-agent)；功能 GA **2026-06-15**，[Summer '26 新闻稿](https://www.salesforce.com/news/stories/summer-2026-product-release-announcement/)）

2. **Microsoft 给出了本次调研中最接近「管理者职责清单」的官方文本**：《Multi-agent orchestration patterns and best practices》（Last updated **2026-05-22**）逐条写明父代理职责——**路由**：「The parent **orchestrator** should have clear criteria for when to hand off… Treat the entire connected agent as an agentic '**tool**' with a description, from the perspective of the parent.」；**数据交接**：connected agent 有 `context-inclusion` 控制是否接收会话历史（不能假设自动传递），child agent 则总是拿到父上下文；**安全**：「if the parent agent isn't allowed to delete records but the connected agent can, the parent agent shouldn't call the connected agent in scenarios where deletion might happen without proper approval」；**审计**：「Log when a connected agent was invoked and what it did… identifiers in the telemetry link the two」；**单一响应原则**：「the parent agent is the only one that should deliver the final response. **Subagents are researchers, not responders.**」（官方文档，[multi-agent-patterns](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns)）

3. **Microsoft 还给出了一个可引用的拆分阈值**：官方称当 agent 拥有「**more than 30-40 choices of action**（tools, topics, and other agents）」时会开始退化——这是把「一个管理者该管多少」写成数字的少数官方表述。（官方文档，[authoring-add-other-agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-add-other-agents)，Last updated **2026-05-15**）

4. **UiPath 是唯一把「决策权与执行权分离」写成硬边界的厂商**：`Case Manager Agent` 官方原文——「The Case Manager is the **orchestrator of a case** — the agent that drives lifecycle decisions based on events. It decides **which stage to activate next, which tasks to start, when a stage should complete or exit early, and when to escalate.**」以及关键边界「**The Case Manager Agent decides; the engine executes — it returns decisions and never mutates the case directly.**」升级到人有明确规则：case-level SLA（如 48h）与 stage-level SLA（如 24h），状态 on-track / at-risk / breached，「Escalations — rules triggered when an SLA is at risk or breached (for example, **reassign, notify management, create a priority flag**)」。权限侧有 **Case Personas**（设计期抽象角色，示例含 **Supervisor**），部署期由 admin 绑定用户/组，运行期按 stage 强制作用域。（官方文档，[Maestro Case](https://docs.uipath.com/maestro/automation-cloud/latest/user-guide/introduction-to-maestro-case)）

5. **Intercom 的 `Fin Operator` 是「管理型 agent」里权限设计最保守的**：官方定义「**Operator is an agent that runs your customer operations.** It spots problems, finds opportunities to improve, and it acts on them – **tuning Fin, keeping your knowledge current, and scaling automation** as your business changes.」权限边界原文：「**Fin Operator never publishes, deletes, or modifies content directly. Every change flows through this review step.**」所有改动以 **proposal + diff/摘要**呈现，需人 approve/edit/reject。发布 **2026-05-15**；定价属 Pro add-on（From $99/month），Fin 本体为 **$0.99 per outcome**。（官方产品页与帮助文档，[fin.ai/operator](https://fin.ai/operator)、[帮助文档](https://www.intercom.com/help/en/articles/14707198-fin-operator-explained)）

6. **AWS 的 supervisor 层已被官方冻结，且继任者明确说做不到**：Bedrock Agents 的 `supervisor agent` + collaborator agents 与 `hierarchical collaboration model` 是真实官方概念（preview **2024-12-03**，GA **2025-03-10**），但 **Bedrock Agents（现名 Agents Classic）自 2026-07-30 起不再对新客户开放**，进入 maintenance mode，官方建议迁移到 **AgentCore**；而 AgentCore 的官方对比表把 supervisor pattern 标为「**Limited**… Routing mode multi-agent is **not straightforward today**. Full multi-agent collaboration **requires custom framework code**」。**这是本次调研中「平台级 supervisor 概念被撤回」最直接的一条证据。**（官方文档，[multi-agent-collaboration](https://docs.aws.amazon.com/bedrock/latest/userguide/agents-multi-agent-collaboration.html)、[agents-classic-maintenance-mode](https://docs.aws.amazon.com/bedrock/latest/userguide/agents-classic-maintenance-mode.html)）

7. **「AI 员工」类产品里，明确不提供管理层的占多数，且是用全量文档检索证明的**：Lindy 的官方全量导出文档（`docs.lindy.ai/export-full-docs.md`，147,356 字节）中 agent manager / subagent / orchestrat / multi-agent / supervisor 全部 **0 命中**；Ada 全量索引（437 行）manager / supervisor / orchestrat / workforce 全部 **0 命中**；11x 的 sitemap 全站 50 页无 manager/supervisor/orchestrator；Artisan 官网 + 支持站全文 grep orchestrat/manager/supervisor/multi-agent **0 命中**；Cognigy 产品文档层 `orchestrat` / `multi-agent` **0 命中**。（官方文档全量检索；**这类「否」结论依赖文档站可全量导出，属较强的否定证据**）

8. **三个高频引用经核查没有官方来源**：
   - **「Agentforce Orchestrator」**：未找到该确切名称的官方文档；官方术语是 `orchestrator agent` / `Super Agent` / `Multi-Agent Orchestration`。
   - **「Benioff 说过 agentic org chart / Agentforce 是新组织架构图」**：**未找到任何官方或可靠来源**。可核实的是他在 Agentforce 2.0 发布会（**2024-12-17**）说过「As a CEO, I'm not just managing human beings, but I'm also managing agents. There is an agentic layer around the support today for Salesforce.」（经第三方记录，非 Salesforce 官网原文），以及「digital labor」的表述。
   - **「Lindy 的 agents manage agents / Agent Manager」**：**未找到官方来源**。Lindy 官方博客里确有 "An orchestrator sits above them, coordinating the workflow…"，但上下文讲的是 **LangGraph / CrewAI 等第三方框架通识**，不是 Lindy 能力。
   - 另需注意 **Artisan 官网有一篇《The AI sales org chart: what should AI vs. humans own?》**——这是**「AI vs 真人」的组织设计议题文章**，**不是** agent 层级功能，极易被误引用。

9. **Sierra 是本次调研中最容易被误读的一家**：官方产品叙事其实是**单一 agent**（"the customer experience is moving from a multi-channel to a **single agent** world"）；产品页的 Orchestration 一节编排的是 **skills**（triage / respond / confirm 可组合），不是 agent 层级；而官方 Trust 页的 **`Supervisor models`** 原文是「To mitigate risks inherent in the non-deterministic nature of LLMs, Sierra wraps LLMs in **supervisory layers** to reduce hallucinations, ensure security, and prevent abuse」——**这是包在 LLM 外面的安全护栏，不是 agent 主管。** 另外，**未在 Sierra 官方页面找到统一的 resolution rate 数字**（官方可核实的经营数据是年二回顾里的 "over $150M in ARR"，**2026-02-06**）。（官方文档，[Agent OS 2.0](https://sierra.ai/blog/agent-os-2-0)、[Trust and reliability](https://sierra.ai/product/trust-and-reliability)）

10. **真正有「层级语义」的官方案例只有 5 个，且没有任何一家发布过「AI 组织架构图」**：① Salesforce `Super Agent` → `Connected Subagent`（明确两层且禁止第三层）；② Microsoft Agent Framework `manager_agent` → participants（官方代码变量就叫 `manager_agent` / `MagenticManager`）；③ AWS Bedrock `supervisor agent` → `collaborator agents`（已进维护模式）；④ UiPath `Case Manager Agent`（官方称 "the **orchestrator** of a case"，且唯一把「决策但不执行」写成硬边界）；⑤ Intercom `Fin Operator` → `Fin`（唯一把 proposal+diff 人工审批写成硬边界）。**「chief of staff agent」作为产品概念：未找到任何官方来源。**

**未能核实的部分（Q6）**

- **help.salesforce.com 全部 Help 文章正文**：该站是 JS 渲染 SPA，curl/web_fetch 均只拿到 "Loading"，**「Multi-Agent Orchestration (Beta)」Help 文章（`id=ai.agent_multi_orch.htm`）的确切正文与发布日期未能自行核实**（其存在与 URL 由 Salesforce Admins 官方博客 2026-07-27 的引用证实）；**developer.salesforce.com 对任意 UA 返回 403**；**「Atlas Reasoning Engine 3.0」这个版本号只见于第三方报道，Salesforce 官方页面未能核实**。
- **Sierra 的官方 resolution rate 数字：未找到公开来源**（官方只公布 ARR）。**Decagon 各案例页未标注发布日期，日期不可核验**（Substack 90% resolution、Rippling +32% deflection、Chime 70% chat and voice resolution / −60% support costs、SimplePractice 85% deflection，均为厂商自述且无日期）。
- **Google Cloud 官方域（cloud.google.com / cloudblog）对本机网络全部超时**，Gemini Enterprise 相关结论来自经其他路径核实的官方 release notes 与文档 URL。
- **ServiceNow `AI Control Tower` / `Agent Fabric` 的确切发布日期**：官方新闻稿未标注具体日期（仅记 Knowledge 2025）。**UiPath Case Manager Agent public preview 的确切发布日期**：未找到。
- **「Glean Agents Hub」**：该名称**未找到官方来源**（官方用 `Agent Library`）。**「AI Agent Manager」（Ada）**：未找到任何官方来源。**ADK 2.0 collaborative/graph workflows 的版本日期、A2A 捐赠 Linux Foundation 的具体日期**：未找到。

---

### 问题 7：AI 原生组织用什么指标衡量「管理层是否创造价值」

**结论：衡量 AI 组织价值的指标目前处在「厂商自述、口径互斥、无第三方审计」的状态。被广泛引用为「失败率」的 MIT NANDA 95%，其方法论已被具名同行质疑到要求撤稿的程度；企业侧最值得引用的数字来自 McKinsey 与 Deloitte——只有约 37–39% 的企业认为 AI 对 EBIT 有任何贡献，且仅约 25% 把 40% 以上的 AI 试点推进到生产。**

1. **MIT NANDA 的 95%：报告自身的定义，以及它遭到的方法论批评**
   - 报告全名《The GenAI Divide: State of AI in Business 2025》，MIT NANDA，作者 Challapally / Pease / Raskar / Chari，封面 **July 2025**，标注 **Preliminary Findings**，研究期 **2025-01–06**。**该报告没有公开直链**（需 Google Form 申请），原址现 404、镜像 mlq.ai 现 403。
   - **报告自身的方法论（经镜像索引核实）**：「**52 structured interviews** … **300+ public AI initiatives** … **surveys with 153 leaders**.」「**Success defined as deployment beyond pilot phase with measurable KPIs.**」「**ROI impact measured 6 months post-pilot**」。
   - **口径**：报告逐字「The **95% failure rate** for enterprise AI solutions represents the clearest manifestation of the GenAI Divide」，对应第 6 页漏斗图中 **5% 自定义/任务型企业 AI 工具成功实施**。即**「失败」= 六个月内未产生可持续 P&L/生产率影响，而不是零回报或项目终止**。
   - **样本冲突**：Fortune **2025-08-18** 报道写「150 位领导者访谈 + 350 名员工问卷 + 300 个公开部署」，与报告自身的 52/153/300+ **不一致**。（二手报道，[Fortune](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/)）
   - **批评（有具名专家）**：Kevin Werbach（沃顿教授）逐字「there appears to be **no further support for the 95% claim**. I've read through the document multiple times, and I still can't understand where it comes from.」「**'unsuccessful' explicitly does not mean 'zero returns.'**」，结论「it should release the full supporting data. **If not, it should retract the report.**」Ethan Mollick（沃顿教授，2025-08-21）逐字「I am not sure how generalizable the findings are based on the methodology（**52 interviews, convenience sampled**, failed apparently means **no sustained P&L impact within six months but no coding explanation**）」。Futuriom（**2025-08-26**）指出 95% 只有一句话、无来源说明，漏斗图未标样本量，行业图 x 轴无标签，并指出 NANDA 与 MCP/A2A 厂商存在利益关联、「its connection to MIT is rather loose」。（二手报道与具名评论；**MIT/NANDA 官方回应：未找到公开来源**）

2. **Gartner 的 agentic AI 数字（官方新闻稿）**：**>40% 的 agentic AI 项目将在 2027 年底前被取消**，原因是成本攀升、业务价值不清或风险控制不足；依据是 **2025 年 1 月对 3,412 名 webinar 参与者的调查**（19% 大幅投资 / 42% 保守 / 8% 未投资 / 31% 观望或不确定）。同批发布中 Gartner 提出 **agent washing**——数千家自称 agentic 的厂商中「**only about 130 … are real**」，并预测 **2028 年 33% 的企业软件将包含 agentic AI**（2024 年 <1%）。**注意：agent washing 的判定标准与名单未披露，属方向性估计。**（官方新闻稿，[Gartner 2025-06-25](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027)；**直抓被 Cloudflare 403，内容经检索索引与二手报道双源**；二手转述见 [Staffing Industry Analysts](https://www.staffingindustry.com/news/global-daily-news/gartner-says-agent-washing-is-taking-place)）

3. **Gartner 关于「AI 削中层」的量化预测（与本题最直接相关）**：**2024-10-22** 新闻稿逐字——「**Through 2026, 20% of organizations will use AI to flatten their organizational structure, eliminating more than half of current middle management positions.**」并明确点名 **increased span of control**。另有：到 **2029 年 30% 被 AI 替代裁掉的员工需要重新雇回**（2026-09-09）；**仅 22% 的组织成功把 AI 规模化到多个业务单元**（n=1,303，田野 2026-01–04，2026-09-01）；**近 1/4 组织因 AI 减少初级岗招聘**（2026-07-27）。（官方新闻稿，[Gartner 2024-10-22](https://www.gartner.com/en/newsroom/press-releases/2024-10-22-gartner-unveils-top-predictions-for-it-organizations-and-users-in-2025-and-beyond)；同受 403 限制）

4. **Gartner Hype Cycle 的位置**：AI 2025（2025-08-08）中 AI agents 位于 **Peak of Inflated Expectations**；**Emerging Technologies 2025（2025-09-10 发布）AI Agents 首次入榜**，位置「just shy of the Peak」，预计 **2–5 年**到 Plateau（该年共 30 项技术）；2026 年 Agentic AI Hype Cycle 仍处峰值，**仅 17% 组织已部署 agent，>60% 预计两年内**。（**未取得一手页面，为二手转述**）

5. **企业侧最可引用的 ROI 数字来自 McKinsey 与 Deloitte**：McKinsey《State of AI》**2025** 版——**39%** 认为 AI 对企业级 EBIT 有任何贡献（多数 <5%），**AI 高绩效者约 6%**，88% 至少一个职能常规用 AI；**2026** 版（田野 2026-05-04–06-08，**n=1,719、97 国**）——**37%** EBIT 贡献（与上年持平）、**6%** 高绩效者，且 **2/3** 称过去一年总用工几乎无 AI 相关变化，**仅 14%** 称 AI 导致用工净减少。Deloitte **2026**（n=3,235，24 国，田野 2025-08–09）逐字「**only 25% of respondents have moved 40% or more of their AI pilots into production**」；**30%** 因 AI 使用模式合并或重构组织；**仅 1/5 有成熟的 agent 治理模型**。IBM CEO Study 2025（n=2,000 CEO，33 国，田野 2025-02–04，发布 2025-05-06）逐字「**only 25% of AI initiatives have delivered expected ROI …, and only 16% have scaled enterprise wide**」。（官方研究；**部分页面受 403 限制，建议人工复核**）

6. **有一份组织侧调查直接说明「组织没准备好」**：McKinsey《State of Organizations 2026》（n=10,018 高管，田野 2025-06–09）——**86%** 领导认为组织未准备好把 AI 用于日常运营；障碍为顾虑 AI 46%、监管/伦理/法律 44%、组织性挑战 39%；**53%** 预期 AI 在 1–2 年内仍是辅助工具，**仅 25%** 预期其成为自主队友。Deloitte Q4 2024（n=2,773，14 国，田野 2024-07–09）给出相反口径：**近 3/4** 称最先进的 GenAI 举措达到或超出 ROI 预期。（官方研究）

7. **「80% 的 AI 项目失败」的常见引用需要降级**：RAND 2024（RRA2680-1，**65 位专家结构化访谈，质性研究非统计样本**）原文是「**By some estimates, more than 80 percent of AI projects fail.**」——**「By some estimates」是转引他人估计，不是 RAND 的实测**。同文 **84%** 受访者把「领导层驱动的根因」列为首因，这一条对「管理层是否创造价值」更有用。（官方报告）

8. **智能体生产力指标的官方定义互不兼容，且都是厂商自述**
   - **Salesforce 官方存在两套「解决」口径**（[官方 Blog，2025-12-11](https://www.salesforce.com/blog/support-metrics-agentforce/)）：**Resolutions** 定义为「concluded **without a handoff to a human**」；**Customer-Confirmed Resolution** 定义为「Customer confirms that Agentforce solved their issue」。**两者是不同数字，该页未公布数值。** 自述数字序列为 **63%**（5M+ 会话）→ **70%**（4.3M，2026-06-25）→ **70% 解决 / 32% 升级**（Agentic Enterprise Index，2026-08-07，样本期 2025-02–2026-04）→ **76% / 仅 5% 升级**（客户故事页）。**同一公司两页的升级率为 32% 与 5%，互相冲突，不可混用**；Index 自带免责声明「**These results are not indicative of Salesforce performance.**」
   - **Microsoft Copilot Studio 只有定义、无基准数字**（[2026-06-04 更新](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agent-business-value-metrics-reference)），且其 **Resolution rate 口径逐字包含「用户未回应」**：「either confirmed by the user … **or implied by the flow (the user didn't respond and the agent's logic determined success)**」；微软**自认口径不统一**：「**Each organization defines deflection rate differently.**」**containment rate 的官方定义未找到公开来源。**
   - **独立审计：未找到公开来源。** 63%/70%/76%/80% 全部为**厂商自述**；唯一接近第三方的是 Salesforce **付费委托**的研究，**不能当独立验证**。**「厂商自述 65–86% 在生产中压缩到 40–70%」这一说法未找到公开来源，属内容营销话术，不应引用。**
   - **最系统的口径批评反而来自厂商同行**（需标注利益冲突）：Intercom/Fin 逐字「**most vendors use their own AI to grade their own work.** … This creates an **inherent conflict of interest, especially when the same metric is tied to billing.**」（厂商博客，存在利益冲突）
   - **评测框架层面**：Google ADK 有 **13 个 criteria**（含 `multi_turn_task_success_v1`）；AWS AgentCore 有内置 `Builtin.*` 评测；Azure AI Foundry 有 agent evaluators（**Task Completion**、Tool Call Accuracy 等，2026-08-26 更新）。**注意：Google 的 `multi_turn_task_success_v1` 与 Microsoft 的 `Task Completion` 是同一概念的两个名字——跨厂商指标名不统一。**

9. **组织变革失败率方面可引用的是 Prosci，但其自有页面互相矛盾**：Prosci《Keys to Unlocking AI Adoption》（**n=1,107**：525 一线 + 393 经理 + 193 高管；**田野时间未公开**）——**63%** 称人的因素是首要挑战，**38%** 来自用户熟练度/培训不足，技术实施问题仅 **16%**；另一页写 **56–64%**。**同一 1,107 样本在 Prosci 官网另有「48%」表述——跨页自相矛盾，引用必须注明。** Prosci 广为人知的「70% 变革失败」现仅表述为「**It's commonly said that** 70% of change initiatives fail」，**其自有研究并不支撑**。（官方研究；口径矛盾需标注）

10. **投入侧的量级参考**：Sequoia（David Cahn）的缺口估计为其本人 Substack 一手——**2023-09 $200B → 2024-06 $600B → 2025-06 $840B → 2026-07 $1.5T**；口径是「为支撑当期 AI 基础设施资本开支所需的年度生态收入」，**不是实测回报**。（一手，[AI's $600B question](https://www.sequoiacap.com/article/ais-600b-question/)）

**未能核实的部分（Q7）**：**NANDA 报告原始 PDF 不可得**（原址 404、镜像 403，方法论与引文取自被索引正文，**建议人工获取原件复核**）；MIT/NANDA 无公开回应；Gartner 三处关键页 403；agent washing 判定标准未披露；**Gartner 没有「减少 X 层」的层数预测**；McKinsey 2025 版样本量；**BCG 与 Stanford HAI AI Index 2025 的数字未找到**；S&P Global「42% 企业在 2025 放弃大部分 AI 举措（2024 为 17%）」的原始出处；Deloitte「40% 试点未达 ROI 预期」与 IBM「40% 员工需再培训」**均未能核实**（官方口径分别是「近 3/4 达标」与 **31%**）；BLS 1:11.5 无原始表号年份；OpenAI Evals 官方清单；AWS AgentCore 完整内置清单。

---

## 第二节　可引用的关键案例卡片

> 每张卡片标注**主体 / 时间 / 做了什么 / 结果数字（含口径）/ 对我们的启示（1 句，仅为证据含义，不含设计建议）/ URL / 证据强度**。

### 卡片 1｜Klarna：AI 助手承担 2/3 客服对话，随后公开回调
- **时间**：2024-02-27（首发）→ 2025-05-08（反转）→ 2025-11（招股书口径）→ FY2025 年报
- **做了什么**：上线 OpenAI 驱动的 AI 助手替代一线客服；一年后公开承认「成本权重过高伤害质量」，恢复招聘人工客服。
- **结果数字**：首月 **230 万次对话 = 客服对话的 2/3**、「相当于 **700 名全职客服**」（招股书定义：上线后全职客服每月 chat+电话量的平均降幅）、重复咨询 **−25%**、解决时效 **<2 分钟 vs 人工 11 分钟**、**预计 4,000 万美元**利润改善（2024 年实际口径为约 **3,900 万美元**成本节约）；LTM 至 2025-06-30 处理 **69%** 对话，FY2025 处理 **80%**；不含顾问的全职员工 **2,831 人**（2024: 3,422；2022: 5,527）。
- **启示**：AI 的**处理量占比**可以很高，但「占比高」不等于「成本真的省下来」，也不等于「质量不退化」——Klarna 2025 年客服运营成本 2.03 亿→2.07 亿美元基本持平。
- **URL**：[Klarna 官方新闻稿](https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/) ｜ [F-1/A（SEC）](https://www.sec.gov/Archives/edgar/data/2003292/000200329225000024/klarnagroupplcf-1a3.htm)
- **证据强度**：公司官方（新闻稿 + SEC 文件）／反转部分为一手访谈。

### 卡片 2｜Shopify：把「反身性使用 AI」定为基线履职要求
- **时间**：2025-04-07（内部信）
- **做了什么**：CEO 内部信要求团队在申请新增编制前先证明「AI 做不了」。
- **结果数字**：员工数 2022 年 **11,600** → 2024 年末 **8,100** → FY2025 末约 **7,600**；FY2025 收入 **115.56 亿美元（+30%）**，人均约 **150 万美元**。
- **启示**：这是「把 AI 能力写进岗位基线」而非「取消管理者」的样本——管理者的职责变成了**审核 AI 不可行性的举证**。
- **URL**：[Forrester 逐字引用](https://www.forrester.com/blogs/what-you-can-learn-from-shopifys-ceos-memo-on-workforce-ai/)（原始发布在 X，本环境无法抓取）
- **证据强度**：公司官方（内容可核）／原始页面未直接取证。

### 卡片 3｜Block：Dorsey 称 AI 让「更小更平的团队」成为结构性结论
- **时间**：2026-02-26
- **做了什么**：裁员 4,000+ 人，重组费用 4.5–5.0 亿美元。
- **结果数字**：员工数从 **>10,000 → <6,000**；盘后股价 **+25%**；Q4 2025 gross profit **28.7 亿美元（+24%）**。Dorsey：「**the intelligence tools we're creating and using, paired with smaller and flatter teams, are enabling a new way of working**」；「I think most companies are late… the majority of companies will reach the same conclusion」。
- **启示**：这是目前最激进的公开表述——把「减层」直接归因于 AI 能力，而非仅归因于效率压力。
- **URL**：[Reuters](https://www.reuters.com/business/blocks-fourth-quarter-profit-rises-announces-over-4000-job-cuts-2026-02-26) ｜ [Fortune](https://fortune.com/2026/02/27/block-jack-dorsey-ceo-xyz-stock-square-4000-ai-layoffs/)
- **证据强度**：二手报道（高度一致）＋公司股东信。

### 卡片 4｜Coinbase：管理层级封顶 5 层，取消「纯管理者」岗位类别
- **时间**：2026-05-05（SEC Form 8-K）
- **做了什么**：以「为 AI 时代优化公司运营」为由裁员，并同时改写组织结构规则。
- **结果数字**：裁约 **700** 人＝截至 2026-05-01 全球员工约 **14%**；重组费用 **5,000–6,000 万美元**；**层级在 CEO/COO 之下最多 5 层**；**不设纯管理者**（leader 必须是一线贡献者）；招聘集中在 **AI-native pods**。
- **启示**：这是把「管理层还剩什么」写成规则最清楚的一例——保留层级、保留管理，但**取消「只管不做」这一岗位类别**。
- **URL**：[SEC Form 8-K](https://www.sec.gov/Archives/edgar/data/1679788/000167978826000049/coin-20260505.htm) ｜ [Business Insider](https://www.businessinsider.com/coinbase-layoffs-ai-brian-armstrong-job-cuts-letter-2026-5)
- **证据强度**：公司官方（8-K）＋一手（全员信，经二手转述）。

### 卡片 5｜Amazon：IC:manager 比例至少提高 15%——唯一的官方「管理跨度」动作
- **时间**：2024-09-16（备忘录）→ 2025-06-17（AI 全员信）→ 2025-10-28 与 2026-01-28（两轮裁员）
- **做了什么**：先定比例目标，后以「fewer layers and more ownership」为口径连续两轮裁撤企业岗位。
- **结果数字**：一手目标是 **2025 Q1 末把 IC:manager 比例至少提高 15%**；**「裁 14,000 名管理者」是 Morgan Stanley 推算，非公司口径**；2025-10-28 裁 **14,000**，2026-01-28 再裁 **16,000**，自 2025-10 累计 **30,000**（遣散成本约 **18 亿美元**）。**亚马逊从未公布 15% 目标是否达成。**
- **启示**：公司在「管理跨度」上采取的第一动作是**调整比例**，而不是取消管理层——这与 Framework 侧的 fan-out 上限是同一类杠杆。
- **URL**：[Reuters 2024-09-16](https://www.reuters.com/technology/amazon-mandates-five-days-week-office-starting-next-year-2024-09-16) ｜ [Amazon 官方 2025-06-17](https://www.aboutamazon.com/news/company-news/amazon-ceo-andy-jassy-on-generative-ai) ｜ [GeekWire 2026-01-28](https://www.geekwire.com/2026/amazon-confirms-16000-more-job-cuts-bringing-total-layoffs-to-30000-since-october)
- **证据强度**：一手（备忘录经报道）＋公司官方（全员信）。

### 卡片 6｜Salesforce：客服 9,000 → 约 5,000，AI 承担 30–50% 工作
- **时间**：2025-08-29（播客）／2025-09-02（报道）
- **做了什么**：用 Agentforce 承接客服一线，停止回填支持工程师岗位，把数百人重新部署到专业服务/销售/客户成功。
- **结果数字**：支持岗 **9,000 → 约 5,000**（口径：客服支持岗，**不是全公司裁员**）；AI 承担公司 **30–50%** 工作量（经 NBC Bay Area 转述，**未取得原始播客全文**）。
- **启示**：减少的是**岗位回填**与**一线处理量**，保留并加强的是复杂/升级场景与专业服务等需要判断的职能。
- **URL**：[CNBC 2025-09-02](https://www.cnbc.com/2025/09/02/salesforce-ceo-confirms-4000-layoffs-because-i-need-less-heads-with-ai.html)
- **证据强度**：一手访谈（播客）＋公司官方声明。

### 卡片 7｜Cursor：300 人做出超 10 亿美元年化收入
- **时间**：2025-11-13
- **做了什么**：Series D 融资 23 亿美元。
- **结果数字**：**超 300 人**，**年化收入超 10 亿美元**，投后估值 **293 亿美元**（公司官方同时给出收入与人数——本组案例中唯一）。
- **启示**：极小团队 + 高 ARR 在 AI 公司中确实成立，但**这不证明「无管理层」**——公开材料未披露其内部管理结构。
- **URL**：[Cursor 官方博客](https://cursor.com/blog/series-d)
- **证据强度**：公司官方。

### 卡片 8｜Cognition：Manager Devin 已上线，并公开三个管理失败模式
- **时间**：2026-04-22
- **做了什么**：让一个 manager Devin 拆任务、spawn 子 Devin、通过内部 MCP 协调。
- **结果数字**：Devin 在最大企业客户段使用量近 6 个月约 **8 倍**；Devin Review 平均每个 PR 抓 **2 个 bug**，其中约 **58%** 为严重；**未披露** PR 总数与统计窗口。
- **启示**：「LLM 当经理」在真实产品中已经存在，且**失败模式是沟通类而非能力类**：经理过度指令化、子 agent 误以为与父共享状态、跨 agent 通信默认不发生。
- **URL**：[Multi-Agents: What's Actually Working](https://cognition.com/blog/multi-agents-working)
- **证据强度**：一手厂商博客（含内部生产数据，非受控实验）。

### 卡片 9｜Anthropic：多智能体研究系统——+90.2% 性能，15× token 成本
- **时间**：2025-06-13
- **做了什么**：Lead agent（Opus 4）+ 并行子 agent（Sonnet 4）的研究系统。
- **结果数字**：比单智能体 Opus 4 在**内部研究评测**上高 **90.2%**；多智能体用约 **15×** chat 的 token（单 agent 约 4×）；token 用量单独解释 BrowseComp 方差的 **80%**；并行化使复杂查询研究时间**最多缩短 90%**。
- **启示**：多智能体的收益与成本是**同一个机制**（花更多 token），所以「加层级」的经济性完全取决于任务价值密度。
- **URL**：[Anthropic 工程博客](https://www.anthropic.com/engineering/multi-agent-research-system)
- **证据强度**：官方文档（含内部评测数据）。

### 卡片 10｜Google Research 等：错误放大 17.2× vs 集中式 4.4×
- **时间**：arXiv v1 2025-12，v2 2025-12-17
- **做了什么**：在 180 个受控配置 × 4 个基准 × 3 个 LLM 家族上，匹配 token 预算（每 trial 平均 4,800 reasoning tokens）测量不同拓扑的错误放大。
- **结果数字**：误差放大因子 **Single-agent 1.0 / Centralized 4.4 / Hybrid 5.1 / Decentralized 7.8 / Independent 17.2**；单 agent 基线超过**约 45%** 后加 agent 出现负回报（β=−0.404, p<0.001）；顺序推理任务上「every multi-agent variant we tested degraded performance by **39–70%**」；成本侧轮次 **T = 2.72 × (n + 0.5)^1.724**。
- **启示**：**「有没有一个把错误拦在汇总之前的瓶颈」是比「有几层」更关键的设计变量。**
- **URL**：[arXiv:2512.08296](https://arxiv.org/abs/2512.08296)
- **证据强度**：一手论文（受控实验）。

### 卡片 11｜Cursor 工程博客：20 个 agent 退化成 2–3 个的吞吐
- **时间**：2026-01-14
- **做了什么**：用大量并行 agent 做长周期自主编码（浏览器、Solid→React 迁移等）。
- **结果数字**：扁平自协调时「**Twenty agents would slow down to the effective throughput of two or three**」；无层级时 agents「became **risk-averse**… No agent took responsibility for hard problems」；规模为 **trillions of tokens**、浏览器项目 **>1M LoC / 1,000 文件**、迁移 **>3 周**。
- **启示**：**反向发现两条**——初期设的 integrator（质量与冲突仲裁角色）「**created more bottlenecks than it solved**」；作者结论「**Too little structure and agents conflict… Too much structure creates fragility.**」
- **URL**：[Scaling long-running autonomous coding](https://cursor.com/blog/scaling-agents)
- **证据强度**：一手厂商工程博客（真实生产，无对照）。

### 卡片 12｜UiPath Maestro：唯一把「决策但不执行」写成硬边界的编排层
- **时间**：Maestro GA 2025-04-30；Case Manager Agent 为 Public Preview
- **做了什么**：以 Case Manager Agent 驱动 case 生命周期决策。
- **结果数字**：**无量化结果**；官方给的硬边界是文字规则——「**The Case Manager Agent decides; the engine executes — it returns decisions and never mutates the case directly.**」；升级规则为 case-level SLA（如 48h）与 stage-level SLA（如 24h），触发「reassign, notify management, create a priority flag」。
- **启示**：这是产品化程度最高的「管理层职责边界」样本——**决策权与执行权可以分离，且分离方式写进了文档**。
- **URL**：[UiPath Maestro Case 文档](https://docs.uipath.com/maestro/automation-cloud/latest/user-guide/introduction-to-maestro-case)
- **证据强度**：官方文档。

---

## 第三节　反面证据与争议

> 本节明确列出与「给 AI 员工加一层管理层」相冲突的证据与观点。**不区分「反对加层」与「反对用 LLM 当那层」——两者对本命题的冲击不同，已分别标注。**

### A. 直接反对「加 LLM 管理层」的证据

1. **同一受控实验里，集中式编排虽把错误放大从 17.2× 压到 4.4×，但仍然远高于单 agent 的 1.0×**，且 token 效率（每 1,000 token 的成功数）从单 agent 的 **67.7** 降到集中式 **21.5（差 3.1×）**。即：管理层减少伤害，但没有消除伤害，且代价明确。（[arXiv:2512.08296](https://arxiv.org/abs/2512.08296)）
2. **在顺序推理任务上，「every multi-agent variant we tested degraded performance by 39–70%」**——同一论文。（同上）
3. **单 agent 基线超过约 45% 准确率后，增加 agent 出现负回报**（β=−0.404, p<0.001）。（同上）
4. **LLM 自我批判与自我纠正在同调用次数下常常不如简单多数投票**：GSM8K 上 Self-Consistency **85.3(6 calls)** vs Multi-Agent Debate **83.2(6)**；**88.2(9)** vs **83.0(9)**。原文「multi-agent debate significantly underperforms simple self-consistency using majority voting」。（[arXiv:2310.01798](https://arxiv.org/abs/2310.01798)）
5. **多加一层 LLM 自评会掉分**：GPT-3.5 CommonSenseQA **75.8(1 call) → 38.1(3) → 41.8(5)**；GPT-4 GSM8K **95.5 → 91.5 → 89.0**。（同上）
6. **Cognition 的「弱主模型 + 强 advisor」形态实测失败**：「**The cost and speed wins were real, but the quality ceiling was set by the primary**」。（[Cognition 2026-04-22](https://cognition.com/blog/multi-agents-working)）
7. **OpenAI 的官方推荐是「先最大化单 agent 能力」**：「**maximize a single agent's capabilities first**. More agents can provide intuitive separation of concepts, but can **introduce additional complexity and overhead, so often a single agent with tools is sufficient.**」（[OpenAI PDF](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)，p.15）
8. **Microsoft AutoGen 官方**：「start with a single agent for simpler tasks, and transition to a multi-agent team when a single agent proves inadequate.」（[Teams 文档](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/teams.html)）
9. **Anthropic 官方承认其 lead agent 目前管不动 worker**：「**the lead agent can't steer subagents, subagents can't coordinate**」。（[2025-06-13](https://www.anthropic.com/engineering/multi-agent-research-system)）
10. **Anthropic 2026 年的官方取向是反转层级**：advisor strategy「**inverts a common sub-agent pattern, where a larger orchestrator model decomposes work and delegates to smaller worker models**」，改为「without decomposition, a worker pool, or orchestration logic」。（[The advisor strategy](https://claude.com/blog/the-advisor-strategy)，2026-04-09）
11. **Anthropic 的 Managed Agents 走的是「解耦」而不是「叠层」**：把 brain / hands / session 拆成接口，目标是「many brains, many hands」，并说「brains can pass hands to one another」——没有引入 LLM 管理层。（[2026-04-08](https://www.anthropic.com/engineering/managed-agents)）
12. **Cursor 的 integrator（冲突仲裁角色）实测「created more bottlenecks than it solved」，移除后更好。**（[Cursor](https://cursor.com/blog/scaling-agents)）
13. **框架侧的「不要用」口径成体系**：LangChain 给量化对比（Subagents 4 次调用 vs Handoffs 3 次）；Google ADK 列出不该用 A2A 远程 agent 的场景；Microsoft Agent Framework 承认 Magentic「**untested** outside the original design」。（详见问题 1）
14. **多智能体失败率极高且失败模式以「协调」为主**：MAST 在 7 个 SOTA 开源 MAS 上测得**总体失败率 41%–86.7%**，14 个失败模式中「推理与行动不匹配」占 **13.2%**，结论指向「**organizational design and agent coordination** rather than the limitations of individual task structures」；且「**the presence of a verifier is not a silver bullet**」。（[arXiv:2503.13657](https://arxiv.org/abs/2503.13657)）
15. **有基准论文直接给出「自动设计的多智能体更贵更差」**：「**automatic MAS consistently underperform CoT-SC despite being up to 10x more expensive**」；另一篇给出「**the benefits of MAS over SAS diminish as LLM capabilities improve**」。（[arXiv:2606.13003](https://arxiv.org/abs/2606.13003)、[arXiv:2505.18286](https://arxiv.org/abs/2505.18286)）
16. **平台级 supervisor 概念被厂商自己撤回**：AWS Bedrock Agents 的 `supervisor agent` 自 **2026-07-30** 起不再对新客户开放，进入维护模式；继任的 AgentCore 官方对比表把 supervisor pattern 标为「**Limited**… Routing mode multi-agent is **not straightforward today**. Full multi-agent collaboration **requires custom framework code**.」（[官方文档](https://docs.aws.amazon.com/bedrock/latest/userguide/agents-classic-maintenance-mode.html)）
17. **产品侧：多数「AI 员工」厂商在官方文档层面不提供 agent 主管**（Lindy、Ada、11x、Artisan、Regie.ai 全部为全量文档 0 命中；Sierra 的「Supervisor models」是安全护栏而非主管）。（详见问题 6）

### B. 反对「因 AI 而取消层级/管理者」的证据（支持「层级仍必要」）

1. **问责无法随编制一起压缩**：California Management Review（**2026-07-06**）——「**accountability structures do not scale down as easily as headcount**… what once rolled downhill might start floating upward as layers of humans are replaced with AI」；「**there is no AI chain of command. Algorithms cannot testify, explain, defend their logic, be fined, or go to jail**」。以 Air Canada 聊天机器人案（Moffatt v. Air Canada, 2024 BCCRT 149，**2024-02-14** 裁定公司对聊天机器人陈述负责）为例。（[CMR Berkeley](https://cmr.berkeley.edu/2026/07/ai-cuts-costs-until-it-doesn-t-why-accountability-still-belongs-to-senior-leadership)；管理学期刊评论 + 判例）
2. **AI 落地是「压垮」中层，不是「替代」中层**：HBR（**2026-06-26**）对两家大型咨询公司 18 次半结构化访谈发现，组织把 AI 落地当成 IT 软件部署，结果中层承担了额外协调、审核与变更负荷。（[HBR](https://hbr.org/2026/06/ai-adoption-is-overloading-your-middle-managers)；学术访谈型研究）
3. **「减层」不等于「取消管理」，也可能是加深管理密度**：Nvidia 黄仁勋称自己有约 **60 名直接下属**且不做一对一，理由是「the layer of hierarchy in your company really matters」——这是**用极大的管理跨度换掉中间层**，而不是取消管理。（一手访谈转述）
4. **管理跨度的上限对 agent 同样成立**：Zapier CEO Wade Foster 在被问及「730 名远程员工里有多少可以是 AI agent」时指出管理者的 span of control 对 agent 同样适用，并认为「即便 20 个 agent 也会产生一个人处理不完的任务量」。（**二手播客摘要，原始播客未取得——证据强度弱，仅作线索**）
5. **NIST 把责任明确落在人身上**：AI RMF 1.0「**Executive leadership of the organization takes responsibility for decisions about risks**」。（[NIST AI 100-1](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf)）
6. **欧盟 AI 法案把人类监督写成法定义务**：Art.14 要求高风险系统「can be **effectively overseen by natural persons**」，含 **override/reverse** 与 **'stop' button**；Art.26(2) 要求部署者把监督「**assign … to natural persons who have the necessary competence, training and authority**」。生效时间 **2027-12-02 / 2028-08-02**。（[Article 14](https://artificialintelligenceact.eu/article/14/)）
7. **AWS 官方要求「升级路径必须存在」**：「**Escalation paths handle cases where primary reviewers are unavailable.**」超时须「**notify secondary reviewers, escalate to management, or default to a safe fallback**」——即官方治理框架里**「management」是一个必须存在的升级目的地**。（[Agentic AI Lens](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentic-ai-lens.html)）
8. **同一批「削层」案例里，管理者岗位类别基本都被保留**：Coinbase 保留层级（封顶 5 层）但取消「纯管理者」；Amazon 的目标是提高 IC:manager **比例**而非取消管理；Block 未宣布取消管理者岗位类别。**没有任何一个可核实案例宣布「取消管理层」。**

### C. 数据口径层面的争议（会直接颠覆引用）

1. **MIT NANDA 的「95%」被要求撤稿**：Kevin Werbach 逐字「there appears to be **no further support for the 95% claim**」「**'unsuccessful' explicitly does not mean 'zero returns.'**」，结论「**If not, it should retract the report.**」；Ethan Mollick 指出方法为 **52 次便利抽样访谈**；Futuriom 指出漏斗图未标样本量、行业图 x 轴无标签，且 NANDA 与 MCP/A2A 厂商存在利益关联。（详见问题 7）
2. **Gartner 的关键页无法直接抓取**：`gartner.com` 三处关键页对自动抓取返回 **403 / Cloudflare**，相关内容经检索索引与二手报道双源取得，**引用前建议人工复核**。
3. **agent washing 的「约 130 家」没有公开判定标准与名单**，属方向性估计。
4. **Salesforce 的解决率口径自相矛盾**：官方同一时期两页分别给出升级率 **32%** 与 **5%**；Index 自带免责声明「**These results are not indicative of Salesforce performance.**」
5. **Microsoft 的 Resolution rate 口径逐字包含「用户未回应」**：「or implied by the flow (**the user didn't respond** and the agent's logic determined success)」；微软自认「**Each organization defines deflection rate differently.**」
6. **所有厂商宣称的解决率均无独立审计**：唯一接近第三方的是付费委托研究；最强的方法论批评反而来自厂商同行（Intercom：「**most vendors use their own AI to grade their own work.**」）。

---

## 第四节　证据缺口

> 以下为本轮**未能找到公开来源**、**来源互相矛盾**或**因工具限制无法取证**的部分。按「不影响结论」与「影响结论」分级，**不做推测填充**。

### D1. 影响结论强度的缺口（需要后续人工补齐）

1. **MIT NANDA 报告原始 PDF 不可得**：官方原址 404、镜像 mlq.ai 403。报告的方法论与引文取自被索引正文，**建议人工获取原件复核**；同时 Fortune 报道的样本量（150 访谈 / 350 问卷 / 300 部署）与报告自身（52 / 153 / 300+）**不一致**；**MIT/NANDA 官方回应未找到公开来源**。
2. **Gartner 三处关键页 403**（2025-06-25 agentic 预测、2024-10-22 中层预测、Hype Cycle），内容经检索索引与二手报道双源取得，**建议人工复核原文**。
3. **help.salesforce.com 与 servicenow.com/docs 为 JS 渲染 SPA**，无法抓取正文：「Multi-Agent Orchestration (Beta)」Help 文章正文、Einstein Trust Layer 的掩码/零保留/毒性评分/审计字段与保留规则、ServiceNow `AI Control Tower` / `Agent Fabric` 的确切发布日期**均未取得**。
4. **OWASP genai.owasp.org 全站 Cloudflare 拦截**：《Agentic AI – Threats and Mitigations》PDF 正文与威胁编号、Agentic Top 10 2026 逐条正文（含 **ASI03 confused deputy 官方定义**）、Agent Control Standard 技术规范、《State of Agentic AI Security and Governance》2.01 正文**均未取得**。
5. **Salesforce 的「4,000」存在口径争议**：这是**客服支持岗**口径（9,000→5,000），不是全公司裁员；同时有 WARN 备案数量远小于 4,000 的质疑。**若要写进材料，建议同时标注。**
6. **Klarna 的播客口径与年报口径冲突**：播客称 headcount「7,000→3,000」，年报/招股书 FTE 为 2022 年 **5,527**、2025 年末 **2,831**。**建议只用年报口径。**
7. **Android/Amazon 的「裁减 14,000 名管理者」是 Morgan Stanley 推算**，亚马逊从未公布 15% 比例目标的达成情况。
8. **「Block 2025 年砍约 40%」与已核实事实不符**：可核实的近半裁员发生在 **2026-02-26**。**该说法未找到公开来源，不应引用。**
9. **是否存在针对《Don't Build Multi-Agents》的正式反驳论文**：未找到。实际存在的「回应」是 Anthropic 次日博客与 Cognition 2026-04-22 的自我修正。
10. **「error amplification up to 17×」不能作为行业通行常数**：已核实为 **17.2×，且仅限「独立式（互不通信）」在 4 个基准、固定 4,800 token 预算下的测量值**；同一研究给出集中式 **4.4×**。**不存在「所有多智能体统一放大 17 倍」的公开证据。**
11. **把「层级制 vs 扁平制」的 LLM 调用数 + token + wall-clock 三项同口径做齐的单一研究**：未找到。现有证据是拼接的。
12. **监管机关就自主智能体责任的专门表态**：未找到公开来源（UK ICO 仅有第三方律所分析；SEC 无一手材料）。

### D2. 不影响结论但需标注的缺口

13. **三个高频引用经核查不存在官方来源**：①「**Agentforce Orchestrator**」这一独立产品名；② Benioff 说过「**agentic org chart**」或「Agentforce 是新组织架构图」；③ Lindy 的「**agents manage agents**」。**三者均未找到官方或可靠来源，不应引用。**
14. **「chief of staff agent」作为产品概念**：未找到任何官方来源。
15. **传统管理幅度的古典源头一手性不足**：**Fayol 的「≤6 名下属」找不到任何原始文本支撑，不应引用**；Urwick 的「5–6」只有二手归属（HBR 1956 原文未取得）；Simon 1946 逐字原句（JSTOR 被拦）；**「管理幅度从 5 扩到 20+」这一历史论断未找到公开来源**。
16. **「管理的幅度越宽、结果越好」这一常见引述未找到来源**：Bloom / Lemos / Sadun / Van Reenen 系列**没有 span of control 的经验发现**（NBER WP 20102 全文零命中）。
17. **AI 侧的「span of control」概念本身未找到公开来源**；OpenAI **不存在**任何 agent 数量建议；LangGraph 的 `recursion_limit` 官方未写默认值（二手称 25）。
18. **多数厂商宣称的解决率无发布日期、无独立审计**：Decagon 各案例页未标日期；Sierra 官方**未公布** resolution rate（只公布 ARR）；「厂商自述 65–86% 在生产压缩到 40–70%」**未找到公开来源**。
19. **多处「广为流传」的数字未能核实**：Deloitte「40% 试点未达 ROI 预期」、IBM「40% 员工需再培训」（官方口径为 **31%**）、BCG 的 ROI 调查、Stanford HAI AI Index 2025 的企业采用率、S&P Global「42% 企业在 2025 放弃大部分 AI 举措」的原始出处、BLS「1:11.5」的原始表号年份。
20. **商业产品层的未取证项**：Salesforce「Atlas Reasoning Engine 3.0」版本号（仅第三方）；Sierra 官方 resolution rate；「Glean Agents Hub」与「AI Agent Manager（Ada）」两个名称；UiPath Case Manager Agent public preview 的确切发布日；ADK 2.0 版本日期与 A2A 捐赠 Linux Foundation 的具体日期。
21. **Cloudflare / 网络限制导致的一手缺口**：`developers.openai.com` / `platform.openai.com` / `openai.com` 全部 403（**因此「Agent Builder 存在 orchestrator 节点」没有任何可核实来源**）；`developer.salesforce.com` 403；`cloud.google.com` / `cloudblog` 超时（Google Cloud Agent Identity 相关条目为搜索索引级）；`ada.cx` 营销站 403；本环境**无法抓取 X（Twitter）内容**（Shopify 备忘录原始页面、Block 的 Dorsey 帖因此只能经第三方逐字引用取证）。
22. **检索工具限制声明（影响可复现性）**：本轮调研中段，`web_search` / `exa_search` / `apify` **全部配额耗尽或限流**（firecrawl 返回 `retry_after_seconds ≈ 13768`），后半程全部改为**直接抓取已知 URL**（`web_fetch` + `curl` + 本地去标签 / `pdftotext`）。因此本报告中所有「未找到公开来源」应理解为**「在可用检索条件下未能定位」**，不等于「不存在」。

---

## 附：本报告的来源文件

| 文件 | 内容 |
| --- | --- |
| 本文件 | 7 个问题的结论、案例卡片、反面证据、证据缺口 |
| [`AI-NATIVE-ORG-PUBLIC-CASES.md`](AI-NATIVE-ORG-PUBLIC-CASES.md) | 问题 2 的逐案详版（含 13 条未核实清单） |
| [`MULTI-AGENT-GOVERNANCE-SOURCES.md`](MULTI-AGENT-GOVERNANCE-SOURCES.md) | 问题 4 的逐条治理原语（NIST / OWASP / AWS / Microsoft / Google / Salesforce / IETF） |
| [`SPAN-OF-CONTROL-AND-METRICS.md`](SPAN-OF-CONTROL-AND-METRICS.md) | 问题 5 与问题 7 的逐条证据（含 30+ 项未核实清单） |

> 本文件仅为外部证据汇编，**不含任何设计建议**。所有引号内文字为来源原文摘录；所有数字均注明口径与时间；证据强度按「官方文档 / 一手访谈或论文 / 二手报道 / 推测」标注。
