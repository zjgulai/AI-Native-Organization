# 管理幅度（Span of Control）与「管理层是否创造价值」的证据汇编

> 交付口径：只列证据，不给设计建议。每个数字标注 口径 + 时间 + 来源。
> 一手 = 原始发布方页面；二手 = 权威转述（已标注）。
> 检索环境限制：本次 web_search / exa_search / apify 配额耗尽，主要依靠直接抓取已知 URL 与已索引正文；被 Cloudflare 拦截的页面（gartner.com、census.gov、mckinsey.com、rand.org、bls.gov、medium.com）正文取自其官方页被索引内容，已在正文标注「建议人工复核」。

---

# A. 管理幅度

## A1. 传统组织理论的经典数字与出处

**V. A. Graicunas（1933）——「关系数」公式的原始出处**
- 首发：*The Bulletin of the International Management Institute*，1933 年 3 月；1937 年重印于 Luther Gulick & Lyndall F. Urwick 编 *Papers on the Science of Administration*（哥伦比亚大学公共行政研究所），**pp. 183–187**。〔二手转述，来源：[Span of Control: The Formulas of V. A. Graicunas — Fred Nickols](https://www.nickols.us/graicunas.htm)（2012 撰，2019-08-09 更新）〕

**Graicunas 的关系数公式（最大案：下属之间工作相互依赖）**
- a（直接单一关系，上级→单个下属）= **n**
- b（交叉关系，下属↔下属，双向计数）= **n(n−1)**
- c（直接群体关系，上级→下属组合）= **n(2ⁿ/2 − 1)**
- d = a + b = **n²**；e = a + c = **n(2ⁿ/2)**；**f = a + b + c = n(2ⁿ/2 + n − 1)**
- 口径：f 为「可能需要上级关注的关系总数」；最大案与最小案（下属彼此独立）两套公式并存。〔一手公式表，来源同 Nickols 页〕

**Graicunas 推荐的管理幅度**
- 「Graicunas 本人建议下属人数**最多 5 人，多数情况下大概是 4 人**」；并说明该数字须按工作范围与规模调整（6 名工厂工人 ≠ 6 名事业部总裁）。〔来源同 Nickols 页〕
- 关系数（最大案）：n=2 → **6**；n=4 → **44**；n=5 → **100**；n=6 → **222**；n=12 → **24,564**。
  - **勘误**：24,564 = c = n(2ⁿ/2 − 1) = 12×2047，**只是「直接群体关系」一项**，不是总关系数；总关系 f = a + b + c = 12 + 132 + 24,564 = **24,708**。Nickols 原文把 c 表述为 "total"，不严谨。n=4/5/6 的 44/100/222 用 f 公式复算均正确。
- 原文引语（Nickols 转述 Graicunas）：增加第 5 名直接下属会为上级新增 20 条关系、为每位现有下属新增 9 条，关系总数由 **44 增至 100**——「**an increase in complexity of 127 per cent in return for a 20 per cent increase in working capacity**」。
- Graicunas 对限制幅度的原始论断：「[O]ne of the surest sources of delay and confusion is to allow any superior to be directly responsible for the control of too many subordinates.」〔逐字引语，来源同 Nickols 页〕

**Lyndall Urwick——「5–6」的可引用出处**
- L. F. Urwick, "The Manager's Span of Control", *Harvard Business Review*, **May–June 1956, pp. 39–47**。〔书目，来源同 Nickols 页〕
- Urwick 被引原句（p.43）：「There is nothing which rots morale more quickly and more completely than poor communication and indecisiveness … And there is no condition which more quickly produces a sense of indecision among subordinates or more effectively hampers communication than being responsible to a superior who has too wide a span of control (**p.43**).」
- 「**5 或 6**」这一幅度的归属：Nickols 表述为「spans of control larger than **the five or six recommended by Graicunas and Urwick**」——即 5–6 是**二人共同被引用的推荐值**。⚠️ **Urwick 1956 HBR 原文未能取得**（jstor / hbr 均被拦），无法确认他本人是否写过「5–6」；目前**只有二手归属**。
- ⚠️ **勘误**：「高层 3–8 人、一线主管至多 30 人」这类**按层级区分**的幅度说法，在文献中被归于 **Davis**，**不是 Urwick**。〔来源：Wikipedia 镜像 [Span of control](https://owiki.org/wiki/Span_of_control)〕
- 相关文献（书目已确认，内容未能核实）：**Ouchi & Dowling, "Defining Span of Control", *Administrative Science Quarterly*, Vol. 19, 1974**。
- Urwick 协助 Graicunas 完成 1933 年论文这一事实，出自 Urwick 1956 年该文自述。〔二手转述，来源同 Nickols 页〕
- 更早的军方来源（Graicunas 与 Urwick 共同引用）：General Sir Ian Hamilton, *The Soul and Body of an Army*, Arnold, London, **1922, p.229**：「The nearer we approach the supreme head of the whole organization, the more we ought to work towards groups of three; the closer we get to the foot of the whole organization, the more we work towards groups of six.」〔逐字引语，来源同 Nickols 页〕

**Henri Fayol——未能核实原文**
- **未能核实 Fayol 1916 年《Administration industrielle et générale》原文表述**（Google Books / JSTOR / archive.org 均被拦）。
- 仅能核实书目：Fayol, *General and Industrial Management*, trans. Constance Storrs, London: Sir Isaac Pitman & Sons, **1949**（含 1916 原著前两编）。〔来源：[EBSCO Research Starters](https://www.ebsco.com/research-starters/history/fayol-publishes-general-and-industrial-management)〕
- ⚠️ **网上流传的「Fayol 说不得超过 6 名下属」找不到任何原始文本支撑**，无法确认是 Fayol 原话还是后人追认 → **未能核实，不应引用**。

**Herbert Simon——批评「管理幅度是谚语」**
- 出处书目：Herbert A. Simon, "The Proverbs of Administration", *Public Administration Review*, Vol. 6, No. 1 (Winter **1946**), pp. 53–67；DOI **10.2307/973030**。〔来源：[Defining Span of Control — Ouchi & Dowling, *ASQ*, 1974 / JSTOR 2391977](https://www.jstor.org/stable/2391977) 同时引用 Simon (1945)、Urwick (1956)、Porter and Lawler〕
- Simon 的核心指控：在 Simon 之前，行政理论被其称为「proverbs（谚语）」的原则主导，管理幅度即其中之一；他认为管理幅度与「统一指挥」「专业化」等原则之间存在**彼此矛盾**、无法同时最大化。〔二手概述，来源：[Evaluating Herbert Simon's Contributions to Administrative Behavior](https://pubadmin.institute/administrative-theory/evaluating-herbert-simon-administrative-behavior)〕
- ⚠️ **Simon 1946 年原文逐字句子未能核实**（JSTOR 返回 Cloudflare Challenge，所有 OA 副本不可达）→ **不应凭记忆补写原句**。

**「20 世纪管理幅度从约 5 扩到 20+」这一历史论断**
- **未找到公开来源**以严谨数据支撑这一具体轨迹。可核实的替代数据点见 A2：
  - Graicunas 1933 / Urwick 1956 推荐上限 **5–6**；
  - Rajan & Wulf：CEO 直接下属数 1986 年 **4.46** → 1998 年 **6.79**（见下）；
  - Gallup：美国管理者平均直接下属数 2013 年 **8.2**（二手引述）→ 2024 年 **10.9** → 2025 年 **12.1**；
  - BLS：管理职业约占就业 **8.0%**（2024 基准），反推非管理员工/管理者 ≈ **11.4**。
- 唯一近似说法（**口径不同且无脚注**）：1980 年代扁平化使平均幅度「move closer to **1-to-10**」——该口径是**每名管理者对应的员工数**，与「管理者直接下属数」不是同一指标，且原文未标来源。〔Wikipedia 镜像 [Span of control](https://owiki.org/wiki/Span_of_control)〕
- McKinsey 相关文章开篇称「Throughout the 20th century, many organizations chased the notion of finding and using one ideal universal 'span of control'」，但**该文正文未能抓取（Cloudflare 拦截），其中的具体数字未核实**。〔来源：[McKinsey](https://www.mckinsey.com/capabilities/people-and-organization/our-insights/how-to-identify-the-right-spans-of-control-for-your-organization)〕BCG / Deloitte 的同类说法亦未能核实。

**现代实证修正①：Rajan & Wulf（去层级化）**
- 原始数据（Rajan & Wulf, NBER WP 9633, 2003-04, rev. 2020-06）：**CEO 直接下属数均值 4.46（中位数 4）于 1986 年 → 6.79（中位数 6）于 1998 年**；**剔除重大并购后的平衡样本为 4.4 → 8.2**。
- 口径：breadth = **直接向 CEO 汇报的岗位数**；depth = CEO 与利润中心负责人之间的层级数。样本：**300+ 家美国大型企业（1986–1998，13 年）**，平均约 47,500 名员工；数据源 **Hewitt Associates** 高管/中层薪酬调查。〔[NBER WP 9633 PDF](https://www.nber.org/system/files/working_papers/w9633/w9633.pdf)〕
- ⚠️ **归属勘误**：[HBS Working Paper 12-087](https://www.hbs.edu/ris/Publication%20Files/12-087_bc50bde2-3016-457a-9bee-dc988cb1056b.pdf) **不是 Rajan & Wulf**，而是 **Julie Wulf 独著（2012-04-09）《The Flattened Firm — Not as Advertised》**；该文把同一数据转述为 **4.5（1986）→ 近 7（1999）**（与 4.46→6.79 的差异来自年份区间 1998 vs 1999）。同文另引 **Guadalupe, Li and Wulf (2011)**：较小样本上 CEO 幅度 **4.7（1986–90）→ 9.8（2004–08）**。
- 正式发表：Rajan & Wulf, "The Flattening Firm: Evidence from Panel Data on the Changing Nature of Corporate Hierarchies", *Review of Economics and Statistics*, 2006。

**现代实证修正②：Bloom / Lemos / Sadun / Van Reenen——没有 span of control 专门发现**
- ⚠️ **重要更正**：该组合（Bloom, Lemos, Sadun, Scur, Van Reenen）**没有关于管理幅度的经验发现**。NBER WP 20102《The New Empirical Economics of Management》（2014-05，**5 位作者**）全文检索「span of control」**零命中**；其贡献是**管理实践测量**与管理质量的国际比较，不是幅度研究。〔[NBER WP 20102 PDF](https://www.nber.org/system/files/working_papers/w20102/w20102.pdf)〕
- NBER WP 15129《The Organization of Firms Across Countries》（2009）：全文「span of control」**仅出现 1 次，且只在理论假设中**（"finite span of control"），非经验结果。其发现是：信任/法治 → 更高分权 → 更高生产率，IT 与分权互补；样本近 **4,000 家**企业（美/欧/亚）。〔[NBER WP 15129 PDF](https://www.nber.org/system/files/working_papers/w15129/w15129.pdf)〕
- **「更宽的幅度 → 更好的结果」这一因果或相关结论：未找到公开来源**（在该系列中不存在）。
- 唯一把幅度写进结论的是**另一组作者**：《Does Management Matter? Evidence from India》，NBER WP 16658 / *QJE* 2013，作者为 **Bloom, Eifert, Mahajan, McKenzie, Roberts**（**不是** Lemos/Sadun/Van Reenen）。原文逐字：「One reason better run firms do not dominate the market appears to be **constraints on growth derived from limited managerial span of control**.」该研究同时给出管理实践改善与**决策权下放**同步发生（Management → Decentralization Index 系数 1.695***）。〔[NBER WP 16658 PDF](https://www.nber.org/system/files/working_papers/w16658/w16658.pdf)〕

---

## A2. 2020–2026 管理幅度实务数据

**Gallup（最完整的一手基准）** —— [Span of Control: What's the Optimal Team Size for Managers?](https://www.gallup.com/workplace/700718/span-control-optimal-team-size-managers.aspx)，作者 Jim Harter，**2026-01-13**
- 口径（逐字）：「**How many people report directly to you?**」；定义为 direct report 数。
- 逐年样本量与均值（manager 分析）：**2013 n=2,402；2019 n=2,933；2022 n=7,199；2023 n=3,971；2024 n=4,355；2025 n=8,795**；均值估计 95% 误差 ±0.48～±0.78。
- **均值：2024 年 10.9 → 2025 年 12.1**；自 2013 年首测增长近 **50%**。（Business Insider 另引 Gallup：2013 年为 **8.2**，2019 年约 **9** — [BI, 2026-01](https://www.businessinsider.com/middle-managers-have-more-direct-reports-after-great-flattening-2026-1)〔二手〕）
- **中位数稳定在 5–6**（结论段写 "median span of control stays at six"）。
- 分布：**<5 人 37%**；**<10 人 66%**；**10–24 人 22%**；**≥25 人 13%**。均值上升主要由 ≥25 人团队占比上升 2 个百分点驱动。
- 元分析证据：**312 项研究、104 家组织、26 个行业、46 个国家、92,252 支团队、897,971 名员工**；按小（4–9 人）／中（10–19 人）／大（20+ 人）分组。结论：中小团队中高敬业度与更高生产率、更低离职相关；**20+ 人大团队中该关系随行业而异**。
- 其他：**97%** 管理者兼有独立贡献者（IC）职责；IC 工作占时间中位数 **40%**；Gallup 认为「**12 人或以上的高敬业团队 + 有效管理可以运作良好**」（约为当前中位数 6 人的两倍）。
- 2020 年 Gallup 元分析覆盖 **超过 200,000 支**经理团队。〔[Ideal team size depends on the manager](https://www.gallup.com/workplace/286997/ideal-team-size-depends-manager.aspx)〕

**BLS 管理者/员工比例** —— Gallup 引述「roughly one manager for every 11.5 employees」，**未给表号与年份**。
- 本次按 BLS 就业预测表反推（2024 基准）：管理职业（11-0000）**13,683.4 千人** ÷ 总就业 **170,280.8 千人** = **8.0%** → 非管理员工/管理者 ≈ **11.44**。〔[BLS Occupational projections and characteristics](https://www.bls.gov/emp/tables/occupational-projections-and-characteristics.htm)，建议人工复核〕
- 换口径即不同：OEWS May 2024 管理职业占 **7.1%** → 比值 ≈ **13.1**。〔[BLS OEWS featured data](https://www.bls.gov/oes/2024/may/featured_data.htm)〕
- ⚠️ **BLS 本身从未发布「1:11.5」这一表述**，该比例是 Gallup 的引述或自行推算。

**Pave（唯一找到的薪酬/组织数据商公开基准）** —— [What Is the Average Span of Control for Managers?](https://www.pave.com/blog-posts/what-is-the-average-span-of-control-benchmark)（**2026-03-03**）
- Manager + Senior Manager 平均 **4.9** 个直接下属（Q4 2023 为 4.4）；Director + Senior Director **4.6**（前值 4.3）；样本 **257,000+ 名管理者**；**1,000+ 人公司平均 5.89**。
- 同源另一版本（Pave CEO，2025-10）：Manager+Senior Manager **4.8（Q4'23）→ 5.7（Q2'25）**；Director+ 4.3→4.8；VP+SVP 4.9→5.0；C-Suite 5.6→5.5。
- ⚠️ **两版时点与口径不同（4.9 vs 5.7），不可混用**。
- 早期版本：**199,000+ 名**管理者、9,052 家客户；按层级 M3 4.6 / M4 5.0 / M5 4.5 / M6 5.1 / E7 5.3 / E8 5.9 / E9 6.5；**1–100 人公司 M3 为 2.9，3,000+ 人公司为 5.8**。

**Lattice（二手转引，一手未核实）**
- HRBench 页面（更新 **2026-08-26**）称「**Lattice benchmarking data** 显示人均直接下属数从 **2020 年 4.3 升至 2022 年 5.2**」。〔[HRBench: Span of Control](https://www.hrbench.com/resource/learn/span-of-control)〕→ **二手转引，Lattice 一手报告未核实**。

**McKinsey 原型模型（二手转引，一手未核实）**
- HRBench 转述 McKinsey 按管理类型给出的幅度目标：Player/Coach **3–5**；Coach **6–7**；Supervisor **8–10**；Facilitator **11–15**；Coordinator **15+**。〔二手转引，McKinsey 一手页面抓取失败 → **一手未核实**〕

**Big Tech**
- **Microsoft**：**无**全公司统一幅度目标。部分领导自设目标：Cloud+AI 负责人 Scott Guthrie 目标 **8 名工程师/工程经理、7 名 PM/经理**；Security 负责人 Charlie Bell 目标 **9 名下属/经理**。微软回应「没有一刀切的比例」。〔[Business Insider, 2025-05](https://www.businessinsider.com/microsoft-flattening-management-layers-cutting-jobs-2025-5)〕〔二手〕
- **Amazon**：官方文档化的是**团队规模**规则而非汇报跨度规则 —— two-pizza team「no team should be big enough that it would take more than two pizzas to feed them … **ideally, this is a team of less than 10 people**」，配套 single-threaded ownership / single-threaded leader。〔[AWS Executive Insights](https://aws.amazon.com/executive-insights/content/amazon-two-pizza-team/)〕→ **Amazon 官方文档化的 span-of-control 规则：未找到公开来源**。

**未找到公开来源的供应商基准**
- **ChartHop / Ravio / Levels.fyi**：未找到公开的幅度基准报告。
- **Criteria Corp**《2025–2026 Hiring Benchmark Report》为招聘基准（n=350+ 招聘从业者），**不含幅度基准**。
- **SHRM / Gartner / Deloitte / PwC / Mercer / WTW**：**未找到 2020–2026 年公布中位管理幅度的公开调查**。

---

## A3. 管理幅度是否已被应用到 AI 智能体

**结论先说：「span of control for AI agents」作为一个成型的术语或理论框架，未找到公开来源。** 找到的是**工程侧的并发/扇出上限**与**一篇量化 agent 系统伸缩规律的论文**。

### Anthropic —— 有明确的子代理数量指南（唯一给出「分级数量」的厂商）
来源：Anthropic Engineering, [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)，**Published Jun 13, 2025**。〔一手，已抓取全文〕
- **分级规则（逐字）**：「**Scale effort to query complexity.** Agents struggle to judge appropriate effort for different tasks, so we embedded scaling rules in the prompts. **Simple fact-finding requires just 1 agent with 3-10 tool calls, direct comparisons might need 2-4 subagents with 10-15 calls each, and complex research might use more than 10 subagents with clearly divided responsibilities.** These explicit guidelines help the lead agent allocate resources efficiently and prevent overinvestment in simple queries」。
  - 口径：这是**写在提示词里的努力程度分配规则**，不是硬性并发上限。
- **并行扇出数（逐字）**：「(1) the lead agent **spins up 3-5 subagents in parallel** rather than serially; (2) the subagents use 3+ tools in parallel. These changes **cut research time by up to 90%** for complex queries」。
  - 口径：并行子代理数 **3–5**；收益为复杂查询的**研究耗时最多下降 90%**。
- **失败模式基线（逐字）**：「Early agents made errors like **spawning 50 subagents for simple queries**, scouring the web endlessly for nonexistent sources, and distracting each other with excessive updates.」→ **50 是被明确点名的过度扇出**。
- **成本约束（逐字）**：「agents typically use about **4× more tokens** than chat interactions, and **multi-agent systems use about 15× more tokens** than chats」。
- **性能（口径：内部 research eval，Opus 4 主 + Sonnet 4 子）**：多代理系统比单代理 Opus 4 **高 90.2%**。
- **架构限制（逐字）**：「our lead agents execute subagents **synchronously**, waiting for each set of subagents to complete before proceeding … the lead agent can't steer subagents, subagents can't coordinate, and the entire system can be blocked while waiting for a single subagent to finish searching.」→ Anthropic 自己在文档中指出了**监督带宽**这一瓶颈。
- 另一篇更早的总体原则：Anthropic, [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)，**Dec 19, 2024**，逐字：「When building applications with LLMs, we recommend **finding the simplest solution possible, and only increasing complexity when needed**.」——**未给出任何具体代理数量**。

### OpenAI —— 有编排模式，**未给出数量上限**
- [Agent orchestration — OpenAI Agents SDK](https://openai.github.io/openai-agents-python/multi_agent)：定义两种编排方式（LLM 决策 / 代码决策）与两种核心模式（**Agents as tools** 管理者保留最终答复；**Handoffs** 专家接管本轮）。并行仅表述为「Running multiple agents in parallel, e.g. via Python primitives like `asyncio.gather`. This is useful for speed when you have multiple tasks that don't depend on each other.」→ **无数量建议、无上限**。
- Cookbook 示例 [Parallel Agents with the OpenAI Agents SDK](https://developers.openai.com/cookbook/examples/agents_sdk/parallel_agents) 使用 4 个并行 agent（features / pros_cons / sentiment / recommend）+ 1 个 meta agent。→ **是示例规模，不是推荐上限**。
- [A practical guide to building agents](https://web.archive.org/web/2025/https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents)（2025-04 发布，经 Wayback 索引正文）逐字：「Our general recommendation is to **maximize a single agent's capabilities first**. More agents can provide intuitive separation of concepts, but can introduce additional complexity and overhead, so **often a single agent with tools is sufficient**.」→ **无数量上限，只有"先最大化单代理"的原则**。

### Microsoft / Magentic-One —— 有明确的三类内环上限（文档化默认值）
- [Microsoft Agent Framework — Magentic orchestration](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/magentic)（Last updated **2026-09-04**）示例中显式配置：**`max_round_count=10`、`max_stall_count=3`、`max_reset_count=2`**。
  - 口径：外层协调轮数上限 10；连续无进展轮数达 3 触发重规划；计划重置上限 2。
- 同页注：Magentic-One 原论文设计了 **4 个高度专门化 agent**；且「it is **untested** how well the Magentic orchestration will perform outside of the original Magentic-One design.」〔逐字〕
- Magentic-One 论文（[arXiv:2411.04468](https://arxiv.org/html/2411.04468v1)）：「This nested-loop behavior continues until the Orchestrator determines the task is complete or the team has reached some (**parameterized and configurable**) termination logic, such as reaching a **maximum number of attempts**, or exceeding a specified maximum time limit.」→ 论文本身不给数字。

### LangGraph / CrewAI / AutoGen
- **LangGraph**：[GRAPH_RECURSION_LIMIT 官方文档](https://docs.langchain.com/oss/python/langgraph/errors/GRAPH_RECURSION_LIMIT)确认存在步骤上限 `recursion_limit`，可传 `{"recursion_limit": 1000}` 提高，但**该页未写出默认数值**。二手来源普遍称默认 **25 步**（[machinelearningplus](https://machinelearningplus.com/gen-ai/langgraph-cycles-recursion-limits-agent-loops)、[markaicode](https://markaicode.com/errors/langgraph-recursion-limit-reached-fix)）→ **默认值 25：一手未核实**。
- **CrewAI**：[Agents 官方文档](https://docs.crewai.com/v1.15.18/en/concepts/agents) 逐字：「**Max Iterations** (optional) `max_iter` int — Maximum iterations before the agent must provide its best answer. **Default is 20.**」；「**Max RPM** (optional) `max_rpm` `Optional[int]` — Maximum requests per minute to avoid rate limits.」（示例中 `max_rpm=10`）。另有 `max_retry_limit` 默认 2。→ **这些是单 agent 的迭代/速率上限，不是"一个上级管几个 agent"的上限**。
- **AutoGen**：[conversable_agent 参考文档](https://microsoft.github.io/autogen/0.2/docs/reference/agentchat/conversable_agent) 逐字：「`max_turns` int or None - the maximum number of turns for the chat between the two agents. … **If max_turns is set to None, the chat will continue until a termination condition is met. Default is None.**」另有 `max_consecutive_auto_reply`、GroupChat 的 `max_round`。
- **Magentic-One 的并发上限**：论文与微软文档均只说「parameterized / configurable」，**未给出硬性并发上限**。

### 量化证据：agent 数量与性能的关系（唯一找到的规模化规律论文）
来源：[Towards a Science of Scaling Agent Systems](https://arxiv.org/abs/2512.08296)，arXiv **2512.08296**，v1 **2025-12-09**，v3 **2026-04-08**（作者含 Google / DeepMind / MIT 研究人员）。〔一手摘要页，已抓取〕
- 规模：v3 摘要为 **260 个配置（configurations）、6 个 agentic benchmark、5 种规范架构**（Single-Agent 与 4 类 Multi-Agent：Independent、Centralized、Decentralized、Hybrid）、**3 个 LLM 家族**；标准化工具、提示词与算力以隔离架构效应。（v2 摘要为 180 个配置 / 4 个 benchmark；[v2 HTML](https://arxiv.org/html/2512.08296v2)）
- 三个主导效应：
  1. **工具—协调权衡**（tool-coordination trade-off）：β = **−0.267, p<0.001**；工具密集型任务（如 16 工具的软件工程）承受不成比例的多代理协调开销。
  2. **能力饱和**（capability saturation）：β = **−0.404, p<0.001**；**当单代理基线准确率超过约 45% 时，增加代理带来递减乃至负收益**。
  3. **拓扑相关的错误放大**：**独立（Independent）架构放大错误 17.2×；集中协调（Centralized）将其抑制到 4.4×**。
- 相对单代理基线的性能变化区间：**可分解的金融推理 +80.8%** 至 **顺序规划 −70.0%**。
- 模型拟合：v3 全 benchmark 交叉验证 **R² = 0.373**（带 task-grounded 能力指标时 R²=0.413）；正确预测 **87%** 留出配置的最优架构。
- 逐字结论：「Agent effectiveness depends on **alignment between coordination and task structure**, and that **mismatched coordination degrades the performance**.」

### 多代理失败的分类学
- [Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657) 提出 **MAST（Multi-Agent System Failure Taxonomy）**：**14 种失败模式、3 大类**（specification flaws / inter-agent misalignment / termination gaps）。〔一手论文存在；类别名称来自 [orq.ai 转述](https://orq.ai/blog/why-do-multi-agent-llm-systems-fail) 与作者 LinkedIn 帖，**原文逐字核对未完成**〕

### 与「管理幅度」概念的交叉点（唯一一处把两者写在一起的官方文本）
- Gartner 2024-10-22 新闻稿在预测中层削减时，明确把机制写成幅度扩大：「AI deployment will also allow for **enhanced productivity and increased span of control** by automating and scheduling tasks, reporting and performance monitoring for the [manager]」，并同时警告「managers feeling overwhelmed with additional direct reports」。〔[Gartner, 2024-10-22](https://www.gartner.com/en/newsroom/press-releases/2024-10-22-gartner-unveils-top-predictions-for-it-organizations-and-users-in-2025-and-beyond)，官方页 403，正文取自被索引内容，建议人工复核〕

---

# B. 指标：管理层是否创造价值

## B1. MIT NANDA ——「95% 生成式 AI 试点失败」

**报告身份**
- 标题：**《The GenAI Divide: State of AI in Business 2025》**；出品方 **MIT NANDA（Networked Agents and Decentralized AI）**；作者 **Aditya Challapally、Chris Pease、Ramesh Raskar、Pradyumna Chari**；封面日期 **July 2025**（页面标注 **Preliminary Findings**）；研究期 **2025 年 1–6 月**。
- 报告本身**未公开直链**，通过 Google Form 申请获取（[申请表单](https://docs.google.com/forms/d/e/1FAIpQLSc8rU8OpQWU44gYDeZyINUZjBFwu--1uTbxixK_PRSVrfaH8Q/viewform)）；NANDA 官网 [nanda.media.mit.edu](https://nanda.media.mit.edu/) 只列概览。**媒体广泛报道时间为 2025 年 8 月中下旬**。
- NANDA 是 MIT Media Lab 的衍生项目；[Werbach 与媒体](https://medium.com/@shreyasihalder/the-mit-95-ai-failure-rate-is-not-what-you-think-68e8f43f242d) 均指出「MIT NANDA is a project that originated at MIT but **is not administered or managed by it**」，而所有头条都写成「MIT report」。

**方法论与样本量（报告自身「8.2 Research Methodology and Limitations」原文，经镜像 PDF 索引核实）**
- 「Methodology: **52 structured interviews** across enterprise stakeholders, **systematic analysis of 300+ public AI initiatives and announcements**, and **surveys with 153 leaders**.」
- 「**Success defined as deployment beyond pilot phase with measurable KPIs.**」
- 「**ROI impact measured 6 months post-pilot**, adjusted for department size.」
- 「Confidence intervals calculated using **bootstrap resampling** methods where applicable.」
- 「Sample Limitations: Our sample may not fully [represent …]」
- 来源：[The GenAI Divide PDF（MLQ 镜像）](https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf)。⚠️ 该镜像现已返回 **403 / Cloudflare 拦截**；上述文本取自其被搜索引擎索引的正文。**报告原始地址（nanda.media.mit.edu/ai_report_2025.pdf）现已 404 / 重定向至概览页**。

**「95%」的确切口径**
- 报告内逐字：「**The 95% failure rate for enterprise AI solutions represents the clearest manifestation of the GenAI Divide.**」；另有「result in that **95% of organizations are getting zero return**」。
- 对应口径（Werbach 与 Futuriom 的核查）：报告 **Section 3.2 / 第 6 页漏斗图**中有一个 **5%** 数字，衡量的是 **"custom enterprise AI tools" / "task-specific GenAI tools" 成功实施**的比例；而「成功部署」被定义为「**causing a marked and sustained productivity and/or P&L impact**」。即：**「失败」= 六个月内未产生可持续的 P&L / 生产率影响，而非「零回报」或「项目终止」**。
- **样本与口径冲突（重要）**：Fortune 2025-08-18 报道写作「**150 位领导者访谈 + 350 名员工问卷 + 300 个公开 AI 部署分析**」〔[Fortune, 2025-08-18](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/)〕，而报告自身方法论段写的是「**52 次结构化访谈 + 153 位领导者问卷 + 300+ 公开举措**」。**两个版本的数字不一致**，引用时必须点明。

### 争议与批评（针对 MIT NANDA）

- **Kevin Werbach（宾大沃顿教授、Accountable AI Lab 主任）** —— 最实质的批评者。他按要求填写表单但**未收到报告**，最终从他人 LinkedIn 帖中找到文件；读过多遍后结论：**「there appears to be no further support for the 95% claim. I've read through the document multiple times, and I still can't understand where it comes from.」** 并指出：「There is a 5% number in Section 3.2, for 'custom enterprise AI tools' being 'successfully implemented.' But that's **much narrower**. And successful deployment is defined as 'causing a marked and sustained productivity and/or P&L impact.' In other words, **'unsuccessful' explicitly does not mean 'zero returns.'**」最终要求：**「If MIT Project NANDA stands behind the claims, it should release the full supporting data. If not, it should retract the report.」**〔逐字引语，经 [Futuriom, 2025-08-26](https://www.futuriom.com/articles/news/why-we-dont-believe-mit-nandas-werid-ai-study/2025/08) 转引其 LinkedIn 帖；[Werbach 原帖](https://www.linkedin.com/posts/kevinwerbach_state-of-ai-in-business-2025-activity-7365026841759215616-SQWD)〕
- **Ethan Mollick（宾大沃顿教授）** —— 2025-08-21 在 X 上公开索取报告后写道（逐字）：**「Okay, got the report. I would read it yourself. I am not sure how generalizable the findings are based on the methodology (**52 interviews, convenience sampled**, failed apparently means **no sustained P&L impact within six months but no coding explanation**).」**〔[X 帖, 2025-08-21](https://x.com/emollick/status/1958602041367961972)〕
- **Futuriom（R. Scott Raynovich，2025-08-26）** —— 系统性方法批评：
  - 「Nowhere in the report does it present data to this effect. The 95% figure is presented in **one sentence**, but the authors offer **no detail on where they came up with that number**.」
  - 漏斗图问题：**未说明各层样本量、样本间关系未定义**；「investigated → piloted → successfully implemented」的转化关系不明；「it's a subset of the larger data set. And we're not sure if they are referring to the 5% of all the people that investigated AI, or only those that piloted task-specific AI.」其类比：「It's like saying '95% of drivers failed at driving a car,' when 80% of those people don't even have cars.」
  - **图表缺陷**：行业图 **x 轴无标签**，纵轴 0–4 的数字**未说明含义**；据此得出「Energy & Materials 回报为 0」。
  - **利益冲突指控**：NANDA「builds on Anthropic's MCP and Google's A2A」，部分作者任职于相关厂商，「there is obviously an agenda, and its connection to MIT is **rather loose**」；结论是「an irresponsible and unfounded picture」。
  - 反证数据：Futuriom 自建 **130+ 个**公开企业 AI 案例库，称其中列明具体收益与 ROI。
  - 〔[Futuriom, 2025-08-26](https://www.futuriom.com/articles/news/why-we-dont-believe-mit-nandas-werid-ai-study/2025/08)〕
- **MIT / NANDA 的回应**：截至本次核验，**未找到公开来源显示 MIT 或 NANDA 发布过数据补正或撤回声明**（原文作者 Challapally 只接受过 Fortune 采访为数据辩护，未回应方法质疑）。

---

## B2. Gartner

**Agentic AI 项目的取消预测**
- 逐字：「**Over 40% of agentic AI projects will be canceled by the end of 2027, due to escalating costs, unclear business value or inadequate risk controls**」。
- 时间：**2025-06-25**（悉尼发布）。来源：[Gartner Newsroom, 2025-06-25](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027)。〔官方页 Cloudflare 403，正文经其被索引内容与多来源交叉核实〕
- 依据的量化基础：**2025 年 1 月对 3,412 名 webinar 参与者的调查** —— **19%** 已对 agentic AI 大幅投资、**42%** 保守投资、**8%** 未投资、**31%** 观望或不确定。口径：**投资姿态自述，非项目结果追踪**。
- 同稿另一预测：**2028 年 33% 的企业软件应用将包含 agentic AI，2024 年不足 1%**。
- 归因分析师（逐字，Senior Director Analyst Anushree Verma）：「Most agentic AI projects right now are **early stage experiments or proof of concepts that are mostly driven by hype and are often misapplied**. This can blind organizations to the real cost and complexity of deploying AI agents at scale, stalling projects from moving into production.」

**「Agent washing」与「只有约 130 家是真的」**
- 逐字（同一 2025-06-25 新闻稿）：「Gartner estimates that **only about 130 of the thousands of agentic AI vendors are real**」；「agent washing」定义为**把既有的 AI assistant、RPA、chatbot 重新包装为 agent，而无实质 agentic 能力**。
- Verma 逐字：「Most agentic AI propositions lack significant value or return on investment, as current models don't have the maturity and agency to autonomously achieve complex business goals or follow nuanced instructions over time. **Many use cases positioned as agentic today don't require agentic implementations.**」
- ⚠️ **口径透明度问题**：该数字**未披露判定标准与厂商名单**，指向的报告为付费客户专属。二手转述：[Staffing Industry Analysts](https://www.staffingindustry.com/news/global-daily-news/gartner-says-agent-washing-is-taking-place)。→ **应作为方向性估计，不可当作可复核名单。**

**Hype Cycle 定位**
- **Hype Cycle for Artificial Intelligence 2025**（**2025-08-08** 新闻稿）：「**AI agents and AI-ready data are the two fastest advancing technologies** on the 2025 Gartner Hype Cycle for Artificial Intelligence … placing them at the **Peak of Inflated Expectations**」；同稿称 multimodal AI 与 AI TRiSM 也位于该峰值。〔BusinessWire 稿件经 Yahoo Finance 转载，2025-08-08；原稿 [Yahoo Finance 转载](https://finance.yahoo.com/news/gartner-hype-cycle-identifies-top-120000473.html)〕〔二手〕
- **Hype Cycle for Emerging Technologies 2025**（**2025-09-10** 公开发布）：**AI Agents 首次进入该曲线**，取代了 2024 年版的 Autonomous Agents and Multiagent Systems；Gartner 称其「**just shy of the 'Peak of Inflated Expectations'**」，预期 **2–5 年**达到 Plateau of Productivity；2025 年版共列 **30 项技术**（2024 年版 26 项）。〔[HPCwire/BigDATAwire, 2025-09-12](https://www.hpcwire.com/bigdatawire/2025/09/12/ai-agents-debut-atop-gartner-hype-cycle-for-emerging-tech)〕〔二手，页面 Cloudflare 403，正文取自被索引内容〕
- **Hype Cycle for Agentic AI（2026）**：agentic AI 位于 **Peak of Inflated Expectations**；引 **2026 Gartner CIO and Technology Executive Survey**：**仅 17% 的组织已部署 AI agent**，但**超过 60% 预计两年内部署**——「the most aggressive adoption curve among all emerging technologies measured in the survey」。〔[Gartner: 2026 Hype Cycle for Agentic AI](https://www.gartner.com/en/articles/hype-cycle-for-agentic-ai)，官方页 403，正文取自被索引内容〕

**AI 对组织结构与中层管理的影响**
- **中层削减预测（2014-10-22 新闻稿，逐字）**：「**Through 2026, 20% of organizations will use AI to flatten their organizational structure, eliminating more than half of current middle management positions.**」同稿称这些组织可「capitalize on reduced labor costs」，并指 AI 将带来「**increased span of control** by automating and scheduling tasks, reporting and performance monitoring」。〔[Gartner, 2024-10-22](https://www.gartner.com/en/newsroom/press-releases/2024-10-22-gartner-unveils-top-predictions-for-it-organizations-and-users-in-2025-and-beyond)，官方页 403，建议人工复核〕
- 其他 Gartner 预测（均引自官方新闻稿）：
  - **2026-09-15**：到 2028 年，建立「continuous work redesign」能力的组织维持 AI 驱动工作转型的可能性是 **2 倍**。
  - **2026-09-09**：到 2029 年，因被 AI 替代而裁掉的员工中 **30%** 需要重新雇回。
  - **2026-09-01**：仅 **22%** 组织成功把 AI 规模化到多个业务单元；调查 **2026 年 1–4 月，n=1,303**（营收 ≥ $50M）；2025 年 AI 占职能预算平均 **12%**；**85%** 计划 2026 年增支。
  - **2026-07-27**：近 **1/4** 组织因 AI 自动化减少部分初级岗位招聘。
- **未找到公开来源**：Gartner 官方发布的「AI 将减少 X 层管理层级」的**具体层数**预测。

---

## B3. AI 项目 ROI 归因

**McKinsey State of AI**
- **2025 版（《The state of AI in 2025: Agents, innovation, and transformation》，2025-11 发布）**：**39%** 受访者认为 AI 对**企业级 EBIT** 有任何程度的贡献，且其中多数称 **低于 5%**；「AI 高绩效者」（自报 AI 带来 **≥5% EBIT** 影响且认为价值「显著」）= **约 6%**；**88%** 的组织至少一个职能常规使用 AI（上年 78%）。样本 **n=1,993、约 105 个国家**（n 与国数来自二手整理，McKinsey 页面本身未核到 → **部分未能核实**）。〔[McKinsey State of AI 2025](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-2025)〕
- **2026 版（《The state of AI in 2026: On the road to ROI》）**：田野 **2026-05-04 至 2026-06-08**；**n=1,719、97 个国家**；36% 来自营收 > $1B 的组织。**37%** 称 AI 对组织 EBIT 有正面贡献（**与上年基本持平**）；**6%** 仍为 AI 高绩效者（与上年持平）。**组织/编制口径**：约 **2/3** 称过去一年总用工几乎无 AI 相关变化；**14%**（使用 AI 的组织）称 AI 导致过去一年用工净减少——**不足上年 32% 预期降幅的一半**；**39%** 预计未来一年 AI 会减少总编制。〔[McKinsey State of AI 2026](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)〕
- **《The State of Organizations 2026》**：田野 **2025 年 6–9 月**；**n=10,018** 高管；16 国 17 行业。**86%** 领导认为本组织**未准备好**把 AI 用于日常运营；**1/6** 组织无明确的 C 级 AI 采用负责人；三大障碍＝对 AI 本身的顾虑 **46%**、监管/伦理/法律 **44%**、组织性挑战（含变革管理）**39%**；**53%** 预计未来 1–2 年 AI 主要是辅助工具，仅 **25%** 预期其承担自主队友角色。〔[PDF](https://www.mckinsey.com/~/media/mckinsey/business%20functions/people%20and%20organizational%20performance/our%20insights/the%20state%20of%20organizations/2026/the-state-of-organizations-2026.pdf)〕

**Deloitte State of Generative AI / State of AI in the Enterprise**
- **Q4 2024 版（《The State of Generative AI in the Enterprise: Generating a new future》，发布 2025-01-21）**：**n=2,773**（director–C-suite，均在试用/实施 GenAI）；**14 国 6 行业**；田野 **2024 年 7–9 月**。**>2/3** 受访者称未来 3–6 个月能完全规模化的实验**不超过 30%**；**近 3/4** 称其最先进的 GenAI 举措**达到或超出** ROI 预期；**20%** 称 31% 以上。
  - ⚠️ **广为流传的「40% GenAI 试点未达 ROI 预期」未能在 Deloitte 官方稿件核实**。
- **2026 版（《The State of AI in the Enterprise: The Untapped Edge》，该系列第 7 年）**：**n=3,235**；**24 国 6 行业**；田野 **2025 年 8–9 月**。逐字：「**only 25% of respondents have moved 40% or more of their AI pilots into production**」；**54%** 预计未来 3–6 个月达到。**66%** 报告已获生产力/效率收益；**34%** 真正在「重构业务」；**30%** 围绕 AI 重设计关键流程；**30%** 因 AI 使用模式**合并或重构组织**；仅 **1/5** 企业有成熟的自主 AI Agent 治理模型。〔[Deloitte 2026 新闻稿](https://www.deloitte.com/us/en/about/press-room/state-of-ai-report-2026.html)〕

**BCG**：**未找到本次可核实的 BCG ROI 调查数字** → 未找到公开来源（本轮检索受限）。

**IBM IBV 2025 CEO Study**
- 主体：**2025 IBM CEO Study**，IBM IBV 与 Oxford Economics 合作；发布 **2025-05-06**。
- 样本：**n=2,000 名 CEO；33 个国家、24 个行业；田野 2025 年 2–4 月**。
- ROI 逐字：「**Surveyed CEOs report that only 25% of AI initiatives have delivered expected ROI over the last few years, and only 16% have scaled enterprise wide.**」→ 口径＝**CEO 自评**「过去数年 AI 举措达成预期 ROI 的比例」。
- 人力：**31%** 员工未来三年需再培训/技能重塑（**不是常被引用的 40%**）；**65%** 将用自动化弥补技能缺口；**61%** 已在采用 AI agent；**85%** 预计到 2027 年规模化 AI 效率投资回正 ROI。〔[IBM Newsroom, 2025-05-06](https://newsroom.ibm.com/2025-05-06-ibm-study-ceos-double-down-on-ai-while-navigating-enterprise-hurdles)〕

**RAND（真实测量的对照项）**
- 标题：《The Root Causes of Failure for Artificial Intelligence Projects and How They Can Succeed》，报告号 **RRA2680-1**，**2024 年 8 月**。
- 方法：对 **65 位**有经验的 AI/ML 专家做**结构化访谈**（**质性研究，非统计样本**）。
- 逐字：「**By some estimates, more than 80 percent of AI projects fail. This is twice the already-high rate of failure in corporate information technology (IT) projects that do not involve AI.**」
- 口径关键：**「By some estimates」= 转引他人估计，不是 RAND 实测**。同文实测数字：**84%** 受访者把「领导层驱动的根因」列为 AI 项目失败首要原因。〔[RAND RRA2680-1](https://www.rand.org/pubs/research_reports/RRA2680-1.html)，rand.org 403，建议人工复核〕

**美国人口普查局 BTOS AI 补充调查（真实测量的采用率，非问卷自评 ROI）**
- 口径：BTOS **2026 年 AI 补充问卷**，参考期 **2025 年 11 月 – 2026 年 1 月**；全国代表性样本。
- 数字：**18% 的企业在至少一个业务职能中使用 AI**；按**就业加权**为 **32%**；**预计六个月内达 22%**。大企业与知识密集型行业显著更高，Information / Professional Services / Finance 的**超大型企业达 50%–60%**（就业加权 60%–70%）。采用者中**57% 只在 3 个及以下业务职能中使用 AI**；最常用为 Sales and Marketing（**52%**）。
- 来源：[Census CES-WP-26-25](https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html)（census.gov 403）；同文亦为 [NBER WP 35141](https://www.nber.org/papers/w35141)。〔数字取自官方页被索引正文〕
- BTOS 样本框：约 **120 万家**企业，双周采集，分 6 个 panel（每 panel 约 20 万案例）。〔[Census 新闻稿, 2026-04-23](https://www.census.gov/newsroom/press-releases/2026/btos-apr-23.html)〕

**Stanford HAI AI Index 2025**：**未找到本次可核实的该报告企业采用率数字** → 未找到公开来源（本轮检索受限）。

**AI capex vs 回报：Sequoia 的「$600B question」及其后续**
- 原始：David Cahn（Sequoia Capital），**"AI's $600B Question"，2024 年 6 月**（前作为 2023 年 9 月的「AI's $200B Question」）。〔[Sequoia](https://www.sequoiacap.com/article/ais-600b-question/)；页面为 JS 渲染，正文未抓取〕
- **后续轨迹（作者本人 Substack，一手）**：**2023 年 9 月 $200B → 2024 年 6 月 $600B → 2025 年 6 月 $840B → 2026 年 7 月 $1.5T**。逐字：「The rough shape of the CapEx curve has always been of interest to me … What's notable is that **2026 saw a material re-acceleration over 2025 (driven by long-horizon agentic capabilities)**」。$1.5T 的算法：「taking the expected hyperscaler data center CapEx in 2026 and multiplying it by two (reflecting the margin requirement). Most forecasts have 2026 hyperscaler data center CapEx in the **$750B** ballpark. Doubling that yields the same $1.5T.」〔[David Cahn, "AI's $1.5T Question", Substack](https://dcahn.substack.com/p/ais-15t-question)，正文取自被索引内容，直接抓取失败〕
- 口径说明：这些数字是**「为支撑当期 AI 基础设施资本开支所需的年度生态收入」**，**不是实测回报或亏损**。

---

## B4. 智能体生产力指标：官方定义与已公布基准

### Salesforce Agentforce —— 官方存在**两套「解决」口径**（最重要的发现）
- **官方指标定义分列**（Salesforce Blog, **2025-12-11**，作者 SVP Bernard Slowey）：〔[8 Support Metrics We Monitor for Agentforce on Salesforce Help](https://www.salesforce.com/blog/support-metrics-agentforce/)〕
  - **Resolutions**：「Customer interaction concluded **without a handoff to a human**」→ **未转人工即算解决**。
  - **Customer-Confirmed Resolution**：「Customer confirms that Agentforce solved their issue」→ **客户确认才算**。
  - 另列 Abandons（客户开始会话但未提问即离开）、Hand-Offs to Human (Escalations)、Immediate Customer Initiated Hand-Off。
  - 页面未披露两者的具体数值。
- **已公布的自身数字（口径均为厂商自述 / Customer Zero）**：
  | 数字 | 口径 | 时间 | 来源 |
  |---|---|---|---|
  | **63%** | 「surpassed **five million** customer conversations, resolving **more than 63%** of them **instantly**」 | 页面未标日期 | [Customer Zero 用例页](https://www.salesforce.com/agentforce/case-study/customer-zero/) |
  | **60% → 目标 75% → 最新 76%** | Answer Quality：「percentage of answers from Agentforce that meet our acceptance criteria after an individual question is asked … optimized for the first turn」，pass/fail | 基准为 **2025 年 10 月**；目标「end of this year」；「we just hit **76%** in our most recent test」 | [How Salesforce Measures Agentforce Answer Quality](https://www.salesforce.com/agentforce/use-cases/customer-zero/how-salesforce-measures-answer-quality)（逐字核实通过） |
  | **70% / 4.3M** | 「handled **4.3 million** inquiries and resolved **70 percent** of them」 | **2026-06-25** | [Salesforce Launches Agentforce Help Agent](https://www.salesforce.com/news/stories/agentforce-help-agent-announcement/) |
  | **70% 解决 / 32% 升级** | 「agents handled 170 times more customer service chats than previous years and consistently solved **7 out of 10** of them without needing human help」；「Escalation rates from AI agents to human agents are holding steady at **32%**」 | 发布 **2026-08-07**，样本期 **2025-02 至 2026-04** | [Salesforce Agentic Enterprise Index 2025–2026](https://www.salesforce.com/news/stories/agentic-enterprise-index-insights-2026/) |
  | **76% 解决 / 仅 5% 升级** | 「resolves on average about **76%** of customer queries without a human … escalating only **5%** of inquiries to a human Support Engineer」；累计 **1.7M+** 会话 | 页面未标日期 | [Agentforce for customer support](https://www.salesforce.com/customer-stories/agentforce-for-customer-support/) |
- ⚠️ **最新数字与更早数字互相冲突**（63% vs 70% vs 76%），且**同一公司两个页面的升级率分别为 32% 与 5%**——口径与时间窗不同，**不可混用**。
- ⚠️ **Index 自带免责声明（逐字）**：「To qualify for inclusion, businesses needed to have activated agents in production every month across the analysis period. **These results are not indicative of Salesforce performance.**」
- **Trailhead 官方课程的指标定义**（[Agent Analytics and Monitoring](https://trailhead.salesforce.com/content/learn/modules/agent-analytics-and-monitoring/monitor-agent-metrics-and-scores)）：
  - **Deflection Rate**：Share of sessions that ended without escalation to a support representative or another agent
  - **Escalation Rate**：Share of sessions that escalated to a support representative or another agent
  - **Abandonment Rate**：Share of sessions that timed out or ended without engagement（默认超时 2 小时）
  - **Engagement Rate**：Share of sessions in which the user received a reply tied to an agent-triggered action
  - **Success Rate**：Share of interactions that included action steps and completed without errors
  - **Task Resolution Rate**：Share of sessions evaluated as fully resolved by the **Trust Layer Task Resolution detector**
  - 会话结局分类：Deflected / Escalated / Abandoned / **Ambiguous**（「Could not be classified clearly」）
- ⚠️ help.salesforce.com 全站 JS 渲染，**Agentforce Testing Center / Agentforce Analytics 的正式定义页未能核实**。

### Microsoft Copilot Studio —— **只有定义，无基准数字**，且微软自认口径不统一
- 来源：[Agent metrics reference](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agent-business-value-metrics-reference)，**Last updated 2026-06-04**。
- **Resolution rate**（逐字）：「The share of engaged sessions that ended with a resolved outcome, either confirmed by the user (the user said yes to the End of Conversation question) **or implied by the flow (the user didn't respond and the agent's logic determined success)**.」→ **明确把「用户未回应」计入已解决**。
- 其他官方定义：**Escalation rate**（handed off through the Escalate topic or a Transfer conversation node）；**Abandon rate**（ended after **60 minutes** of inactivity without resolution or escalation）；**Deflection rate**（resolved through self-service rather than escalation to a human）；**First-contact resolution (FCR)**（resolved on first interaction without a return contact **within seven days**）；**Run outcomes (autonomous)**（自主 agent 每次运行的终点状态，成功/不成功 + 平均时长，「the equivalent of resolution-rate for autonomous agents」）；**Engagement rate**；**CSAT**（1–5，1–2 dissatisfied / 3 neutral / 4–5 satisfied）。
- **微软自认口径不统一（逐字）**：「**Each organization defines deflection rate differently.** For example, one organization might consider the Abandon rate along with the Escalation rate as part of their deflection calculation, while another organization might look purely at the Escalation rate.」〔[Deflection overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/deflection-overview)，Last updated **2026-01-20**〕
- 该参考页另给成本参考：真人约 **$5–10/次**，agent session 约 **50 美分**（无日期、无出处引注）。
- **Containment rate 的官方定义：未找到公开来源**（Copilot Studio 只用 deflection / resolution）。
- **微软是否公布实际 benchmark 数值：该参考页只给定义，未公布任何基准数字。**

### Sierra / Decagon / Intercom Fin / Klarna
**Sierra（厂商自述）**
- 客户案例页列出的 resolution rate 区间 **64%–94%**，多数聚集 **65%–77%**（Airtable 80%、Chime 70%+、Funnel Leasing 94%、Ramp 90%、AOL 64% 等）。**均为厂商自述，多数匿名化或未给样本口径**。〔[sierra.ai/customers](https://sierra.ai/customers)；区间与多数聚集的整理来自 [MyAskAI 的二手汇编](https://myaskai.com/blog/sierra-ai-complete-guide-2026)〕
**Sierra τ-bench（罕见的、有方法论可复现的自研基准——但结论对厂商自述不利）**
- 论文 [arXiv:2406.12045](https://arxiv.org/abs/2406.12045)，博文 **2024-06-20**。
- 逐字：「the agent powered by GPT-4o drops to **~25% on pass^8** in τ-retail, which is a **staggering 60% drop** compared to its corresponding pass^1 score」；「even the best performing GPT-4o agent achieving **<50% average success rate** across the two domains」。
- 口径：**pass^k = 同一任务连续 k 次全部成功的概率**（可靠性指标）；pass^8 ≈ 25% 意味着「同一问题对 8 位不同客户都能解决的几率约 1/4」。〔[Sierra blog: τ-bench](https://sierra.ai/blog/benchmarking-ai-agents)〕
**Decagon（厂商自述）**
- 官网客户卡：Chime「**70%** chat and voice resolution」；Duolingo 约 **80%** deflection；NG.CASH 自主解决率从 **13% 升至 70%**；Rippling deflection 从 **38% 升至 50%**；Notion「resolution rate **+34%**」。均无日期、无审计。〔[decagon.ai](https://decagon.ai)〕
- ⚠️ **Chime 同时出现在 Sierra 与 Decagon 的案例中**（各称 70%+ / 70%）——**口径与归属未能核实**。
**Intercom Fin（厂商自述）**
- 逐字：「Fin has industry leading resolution rates, **averaging 76% across 12,000+ customers**, with many seeing over **85%**」；「resolution rate has improved approximately 11% per month since launch, **from 23%** to a current average of 76%」。定价（官方）：「**$0.99 per outcome**, 50 outcomes per month minimum」— 注意用词是 **per outcome 而非 per resolution**。〔[fin.ai](https://fin.ai/)；[fin.ai/pricing](https://fin.ai/pricing)〕
**Klarna —— 原始声明与后续（两个都核实到）**
- **原始（2024-02-27，Klarna 官方新闻稿，逐字）**：**2.3 million conversations** / **two-thirds** of Klarna's customer service chats / equivalent work of **700 full-time agents** / on par with human agents in regard to customer satisfaction score / **25%** drop in repeat inquiries / less than 2 mins vs 11 mins / 23 markets, 35+ languages / **estimated to drive a $40 million USD in profit improvement to Klarna in 2024**。
  - ⚠️ 原稿同时写明「customers can still choose to interact with live agents if they'd prefer」。
  - 〔[Klarna 官方新闻稿, 2024-02-27](https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/)〕
- **后续（2025-05-09）**：Klarna 重新招募人工坐席；CEO Siemiatkowski 对 Bloomberg 表示「I just think it's so critical that you are clear to your customer that there will be always a human if you want」。发言人 Clare Nordstrom 称 AI 仍处理 two-thirds 咨询，response times 改善 82%，repeat issues 降 25%。〔[CX Dive, 2025-05-09](https://www.customerexperiencedive.com/news/klarna-reinvests-human-talent-customer-service-AI-chatbot/747586/)〕
  - ⚠️ **口径注意**：Klarna 官方口径始终是「AI 处理 two-thirds **chats**」，**不是 resolution rate**；2.3M 是首月会话量；700 是「等效工作量」而非裁员人数。

### 「厂商自述解决率不可信 / 独立审计」——关键判定
- **未找到任何针对任一厂商 resolution rate 的具名独立审计**（Salesforce / Sierra / Decagon / Fin 的 63% / 70% / 76% / 80% 全部为**厂商自述**）。
- 唯一接近第三方的是 **Futurum《Agentic Support Services: Benchmarking Enterprise Software Customer Help》**，但它是「**commissioned study by Futurum on behalf of Salesforce, August 2025**」——**Salesforce 付费委托，不能当独立验证**。
- **最系统的口径批评来自厂商同行**（需标注利益冲突）：Intercom/Fin《Resolution Rate vs. Deflection Rate》（**2026-03-10**）逐字自认：「**most vendors use their own AI to grade their own work.** The AI agent handles the conversation, then the same vendor's AI reviews that conversation and decides whether it was 'resolved.' This creates an **inherent conflict of interest, especially when the same metric is tied to billing**.」并提出 **reopen rate**（24/48 小时内同问题再次联系）这一盲区：「A high resolution rate paired with a high reopen rate is, functionally, **a containment rate wearing better clothes**.」〔[fin.ai/learn](https://fin.ai/learn/resolution-rate-vs-deflection-rate)〕——**但 Fin 本身属于被批评的模式**。
- **广为流传的「厂商自述 65–86% 在生产中压缩到 40–70%」：未找到公开来源支持该区间作为独立审计结论。** 追查到的载体均为 AI 客服厂商的内容营销页（MyAskAI、Lorikeet 等），无具名方法论与样本。**不应引用。**
- 「A conversation that ends because the customer gave up counts as a resolution under the first definition」——第三方博客对 Salesforce 口径的转述，**非 Salesforce 官方表述**。

### Agentic AI 评测框架官方文档
- **Google ADK**（[adk.dev/evaluate/criteria](https://adk.dev/evaluate/criteria/)）：**13 个 criteria**，名称逐字：`tool_trajectory_avg_score`（EXACT/IN_ORDER/ANY_ORDER）、`response_match_score`（ROUGE-1）、`response_evaluation_score`、`final_response_match_v2`、`rubric_based_final_response_quality_v1`、`rubric_based_tool_use_quality_v1`、`rubric_based_multi_turn_trajectory_quality_v1`、`hallucinations_v1`（逐句 supported/unsupported/contradictory/disputed/not_applicable）、`safety_v1`、`per_turn_user_simulator_quality_v1`、**`multi_turn_task_success_v1`**（Evaluates if agent achieves goal(s) of conversation）、`multi_turn_trajectory_quality_v1`、`multi_turn_tool_use_quality_v1`。
- **AWS Bedrock AgentCore Evaluations**（[evaluations](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html)；[skill-evaluators](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/skill-evaluators.html)）：LLM-as-a-Judge；内置 evaluator ID 格式 `Builtin.EvaluatorName`（如 `Builtin.Helpfulness`）；每 Region 默认 **1,000 个** evaluation configuration。两个 skill evaluator 定义逐字：`Builtin.SkillSelectionAccuracy`（Yes 1.0 / No 0.0）；`Builtin.SkillInstructionFollowing`（Fully Followed 1.0 / Mostly 0.75 / Partially 0.5 / Minimally 0.25 / Not Followed 0.0）。页面**未显示发布日期**；完整内置清单**未能核实**。
- **Microsoft Azure AI Foundry agent evaluators**（[agent-evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/agent-evaluators)，Last updated **2026-08-26**）：
  - System evaluation：**Task Completion**（preview）、**Customer Satisfaction**（preview，1–5 Likert，六维 helpfulness/completeness/clarity/tone/resolution/adaptability）、**Task Adherence**、**Task Navigation Efficiency**（precision/recall/F1）、**Intent Resolution**。
  - Process evaluation：**Tool Call Accuracy**、**Tool Selection**、**Tool Input Accuracy**、**Tool Output Utilization**、**Tool Call Success**。
  - Quality：**Quality Grader**（preview；relevance/abstention/answer completeness/groundedness/context coverage）。
  - 输出为 binary Pass/Fail。
- **跨厂商指标名不统一**：Google 的 `multi_turn_task_success_v1` 与 Microsoft 的 `Task Completion` 是同一概念的两个名字。
- **OpenAI Evals 官方指标清单：未能核实**（本轮检索受限，未取到官方页面正文）。

---

## B5. AI 驱动组织变革的失败统计

**Prosci（唯一直接针对「变革管理 + AI」的量化调查）**
- 报告：《**Keys to Unlocking AI Adoption**》；**n=1,107**（525 一线员工 + 393 带人经理 + 193 高管）。**田野时间未公开 → 未找到公开来源**。〔[Prosci AI Change Management](https://www.prosci.com/ai-change-management)；[empower.prosci.com/keys-to-ai-adoption](https://empower.prosci.com/keys-to-ai-adoption)〕
- **63%**：组织称「人的因素」是 AI 实施首要挑战。
- **38%**：AI 采用挑战中来自用户熟练度/培训不足的占比；细分＝学习曲线 22% + 提示工程 11% + 培训不足 6%；技术实施问题仅 **16%**。〔[Prosci: ADKAR for AI adoption](https://www.prosci.com/blog/adkar-for-ai-adoption)〕
- **56–64%**：Prosci 把同一批数据写成「人的因素占 AI 实施挑战的 56%–64%」。〔[Why AI Transformation Fails](https://www.prosci.com/blog/why-ai-transformation-fails)；[Enterprise AI adoption best practices](https://www.prosci.com/blog/enterprise-ai-adoption-best-practices)〕
- ⚠️ **Prosci 自身口径互相矛盾**：同一 1,107 样本在官网另有「user proficiency crisis affecting **48%** of organizations」；「38% 来自培训不足」与「38% = 用户熟练度（其中培训不足仅 6%）」两种表述互斥。**引用时必须写「Prosci 官网口径，跨页不一致」。**
- **「70% 变革失败」**：Prosci 现表述为「**It's commonly said that** 70% of change initiatives fail」（2024-03-01）；Prosci 自有 Best Practices 研究**未**支撑该数字；其第 12 版宣称「25 年、10,800+ 从业者**累计**」（累计样本，非单次 n）。→ **70% 已不是 Prosci 自有研究结论，Prosci 把它当「常言」引用。**

**Gartner**：见 B2。与组织变革直接相关的三条：20% 组织削减过半中层（2024-10-22）；30% 被 AI 替代裁掉的员工需重新雇回（到 2029 年，2026-09-09）；仅 22% 组织成功把 AI 规模化到多个业务单元（n=1,303，2026-09-01）。

**McKinsey**：见 B3。最相关的组织口径：**2/3** 组织称过去一年总用工几乎无 AI 相关变化；**14%** 称 AI 导致用工净减少；**86%** 领导认为组织未准备好把 AI 用于日常运营（n=10,018）。

**IBM**：见 B3。**31%** 员工未来三年需再培训/技能重塑；**65%** 将用自动化弥补技能缺口。

**Deloitte**：见 B3。**30%** 组织因 AI 使用模式**合并或重构组织**（n=3,235，田野 2025 年 8–9 月）。

**S&P Global Market Intelligence（42% / 17%）**：**未能核实**（本轮检索未定位到原始出处）。

---

# 未能核实的部分

**A 部分**
1. **Henri Fayol** 关于管理幅度（「少于 6 人」）的原文 —— **未能核实**；只有 1949 年英译本书目，**未找到任何原始文本支撑该数字**，不应引用。
2. **Herbert Simon 1946《The Proverbs of Administration》** 关于 span of control 的逐字原句 —— **未能核实**（JSTOR Cloudflare Challenge，OA 副本不可达）。书目（*Public Administration Review*, Vol. 6, No. 1, Winter 1946, pp. 53–67；DOI 10.2307/973030）已确认。
3. **「20 世纪管理幅度从约 5 扩到 20+」** —— **未找到公开来源**支撑这一具体轨迹。唯一近似说法是「move closer to 1-to-10」，但那是**每名管理者对应的员工数**口径，且原文无脚注。
4. **Urwick 1956 HBR 原文**（pp. 39–47）—— 未能取得；「5–6」目前**只有二手归属**。Urwick 1956 *HBR* 期刊本身在本次核验中未能访问。
5. **Ouchi & Dowling, "Defining Span of Control", *ASQ*, Vol. 19, 1974** —— 书目已确认，**内容未能核实**（JSTOR 2391977 不可达）。
6. **McKinsey 的幅度原型模型**（3–5 / 6–7 / 8–10 / 11–15 / 15+）—— 一手页面被 Cloudflare 拦截，**仅为二手转引（HRBench）**。
7. **Lattice 的幅度基准**（2020 年 4.3 → 2022 年 5.2）—— 一手报告未核实，**仅为二手转引**。
8. **SHRM / Gartner / Deloitte / PwC / Mercer / WTW / ChartHop / Ravio / Levels.fyi** 的 2020–2026 中位管理幅度基准 —— **未找到公开来源**。
9. **Amazon 官方文档化的 span-of-control 规则** —— 未找到（官方只有 two-pizza **团队规模**规则，且该页未给出每位经理的直接下属数）。
10. **Bloom / Lemos / Sadun / Van Reenen 存在「幅度越宽结果越好」的结论** —— **该系列中不存在**（WP 20102 全文「span of control」零命中；WP 15129 仅 1 次且为理论假设）。有幅度结论的是**另一组作者**（Bloom, Eifert, Mahajan, McKenzie, Roberts, QJE 2013）。
11. **Anthropic 分级规则之外的硬性并发上限** —— 未找到；其文档只说 lead agent 并行启动 3–5 个 subagent。
12. **LangGraph `recursion_limit` 默认值 25** —— 官方文档页未写出默认数值，**一手未核实**。
13. **OpenAI Agents SDK / Cookbook 的代理数量推荐上限** —— **不存在**（官方无数量建议，只有「先最大化单代理」的原则）。
14. **MAST 论文（Why Do Multi-Agent LLM Systems Fail?）的 14 种失败模式逐字清单** —— 原文逐字核对未完成。

**B 部分**
13. **MIT NANDA 报告原始 PDF** —— 原址（nanda.media.mit.edu）已 404/重定向，镜像（MLQ）返回 403；本报告中的方法论与引文取自其**被搜索引擎索引的正文**。**建议人工获取原始文件复核一次。**
14. **Fortune 报道的样本（150 访谈 + 350 员工问卷）与报告自身方法论（52 访谈 + 153 领导者问卷）不一致** —— 无法判定哪个为最终版。
15. **MIT / NANDA 对方法论批评的官方回应** —— **未找到公开来源**。
16. **Gartner 官方页面对自动抓取返回 403** —— 2025-06-25 新闻稿、2024-10-22 预测稿、2026 Hype Cycle for Agentic AI 三处关键原句均取自其官方页被索引正文，**建议人工打开页面各复核一次**。
17. **Gartner「agent washing / 约 130 家真 agentic 厂商」的判定标准与厂商名单** —— 未披露，属方向性估计。
18. **Gartner「AI 将减少 X 层管理层级」的层数预测** —— 未找到公开来源。
19. **McKinsey State of AI 2025 的样本量（n=1,993、105 国）** —— McKinsey 页面未核到，**部分未能核实**。
20. **BCG 的 AI ROI 调查数字** —— 未找到公开来源（本轮检索受限）。
21. **Stanford HAI AI Index 2025 的企业采用率数字** —— 未找到公开来源（本轮检索受限）。
22. **S&P Global「42% 企业在 2025 年放弃大部分 AI 举措，2024 年为 17%」的原始出处** —— 未能核实。
23. **Deloitte「40% GenAI 试点未达 ROI 预期」** —— **未能核实**；Deloitte 官方 Q4 2024 口径反而是「近 3/4 达到或超出 ROI 预期」。
24. **IBM「40% 员工需 reskilling」** —— **未能核实**；官方口径为 **31%**。
25. **BLS「1 manager per 11.5 employees」的原始表号与年份** —— 未能核实（本次用就业预测表反推 ≈ 11.44，换 OEWS 口径则 ≈ 13.1）。
26. **Salesforce help.salesforce.com 的 Agentforce Testing Center / Agentforce Analytics 正式定义页** —— 全站 JS 渲染，正文未能核实。
27. **Microsoft「containment rate」的官方定义** —— 未找到公开来源。
28. **OpenAI Evals 官方指标清单** —— 未能核实。
29. **AWS Bedrock AgentCore 的完整内置 evaluator 清单** —— 未能核实（官方页只给 ID 格式与部分示例）。
30. **「厂商自述 resolution rate 65–86% 在生产中压缩到 40–70%」** —— **未找到公开来源**；追查到的载体均为 AI 客服厂商的内容营销页，无具名方法论与样本。
31. **针对任一厂商 resolution rate 的具名独立第三方审计** —— **未找到公开来源**。
32. **Prosci《Keys to Unlocking AI Adoption》的田野时间** —— 未找到公开来源；且 Prosci 官网对同一 1,107 样本给出 38% / 48% / 56–64% 三套互相矛盾的表述。
33. **Prosci「70% 变革失败」的原始研究依据** —— Prosci 现仅以「常言」引用，自有研究未支撑。
