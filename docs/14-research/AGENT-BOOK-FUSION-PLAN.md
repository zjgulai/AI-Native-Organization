# 书4《深入理解 AI Agent》× ToyAgent 融合方案

状态：v0.1 基线（2026-11-25 用户评审「全过」；决策见 D-081）
日期：2026-11-25
决策来源：用户 2026-11-25 五项拍板（见 §0）

评审记录：v0.1-draft → v0.1 基线。评审点：§4 三方映射表（step20≈C1/C2/C3、ch10 失败模式↔D-020 保守性）、§5 体例约定（三链/契约 ID 级引用/配图原创）、§6 精读波次（ch1/2 → ch3/4 → ch10，ch7 可前移）、§8 风险（书 2.0/3.0 版章节重组）。用户确认全部通过，无修改项。

## 0. 已确认决策

| # | 决策点 | 结论 |
| --- | --- | --- |
| 1 | 定位 | 作为「第四本书」进入读书笔记轨（book4），不设独立新轨 |
| 2 | 深度 | 10 章框架索引 + 5 篇精读（ch1/2/3/4/10），其余章节框架级 |
| 3 | ToyAgent 形态 | 只做映射页 + 链接 GitHub/在线 demo；站点不嵌 Java demo，配图自绘原创 |
| 4 | 项目引用粒度 | 映射到「契约 ID」级（PV-21、D-080、SCN-018 等），链公开仓规格页 |
| 5 | 实战轨接口 | 不新增 pilot-assets 组；只在 synthesis/stack 页以叙事形式出现 |

## 1. 背景：三书体系的缺口

现有读书轨是「自上而下」的三层栈，唯独缺最底层运行时：

```
书1《AI Native 组织》   → 组织层：50 岗位 / 8 价值流 / Case Agent / 八阶段协议 / Lead-Worker
书2《弱品牌，强品牌》    → 业务层：品牌域该干什么（场景的「做什么」）
书3《本体驱动的AI数据管理》→ 语义层：机器如何懂业务（场景的「看什么」）
──────────────────────────────────────────────
【缺口】               → 运行时层：一个 Agent 如何 0→1 被造出来、跑起来、被约束（场景的「怎么跑」）
```

用户原始诉求：补上「AI Native Agent 如何从 0 到 1 的设计」这条一直缺失的轨道。素材为两份：

- 《深入理解 AI Agent：设计原理与工程实践》（李博杰 著，EPUB 源文件 `ref/AI-Agents-in-Depth-zh-CN-kindle.epub`）——分模块讲工程原理
- [fuzhengwei/ToyAgent](https://github.com/fuzhengwei/ToyAgent)——分模块原理的可运行串联实现

## 2. 素材分析

### 2.1 书：Apache-2.0 开源书（关键事实）

EPUB 溯源至 GitHub 主仓 `bojieli/ai-agent-book`：

| 事实 | 值 |
| --- | --- |
| 协议 | **Apache-2.0**（可合法引用、改编、衍生，需署名） |
| 影响力 | 59.8k stars；16 种语言版本；姊妹篇《深入理解 AI Infra》已开源 |
| 源码 | `book/chapter1~10.md` + `introduction.md` + `afterword.md` 全文 Markdown |
| 配图 | `book/images/` **136 张 SVG 矢量图** + 少量 PNG |
| 配套实验 | `chapter1~10/` 目录共 **109 个实验**（本地项目 + 外部复现轨道） |
| Skills | `skills/` **22 份 SKILL.md**，每主题一份（context-engineering、memory-system、rag-pipeline、tool-design、multi-agent-design、agent-evaluation 等） |
| 在线版 | https://bojieli.github.io/ai-agent-book/astro/ （200 在线，mkdocs/web-astro 构建） |

**版权含义**：与前三本商业书（只能「原创蒸馏」）不同，本书可走更深路线——直链原文章节、引用关键段落、复用 SVG 图（带署名）。站点仍沿用「原创解读+框架索引」的体例，但每章可提供官方原文/在线版/实验入口三链。

### 2.2 书的核心框架（ch002 精读验证）

双重分解：

```
功能分解：Agent = LLM(大脑) + 上下文(当前决策视野) + 工具(感官和手脚)
生产分解：Agent = Model + Harness（上下文组织 / 工具接口 / 运行循环 / 状态 / 约束·验证·纠正）
Harness 五项功能：上下文管理 · 工具接口 · 约束 · 验证 · 纠正
三层学习：上下文适应（会话内） → 外部产物（知识/提示词/Skill/程序） → 参数更新（后训练）
```

十章主线：

| 章 | 主题 | 一句话 |
| --- | --- | --- |
| 1 | AI Agent 入门 | 公式 + Model/Harness 分工 + ReAct + 消融实验方法 |
| 2 | 上下文工程 | 上下文窗口/KV Cache/提示工程/Skills/压缩/子Agent隔离 |
| 3 | 用户记忆和知识库 | 记忆分层/RAG 管道/知识组织与更新/智能体化检索 |
| 4 | 工具 | 工具分类/设计原则/MCP/Skill Hub/层次化与主动发现 |
| 5 | Coding Agent 与通用 Agent | 代码作为元能力；Manus→OpenClaw 演进 |
| 6 | 交互：观测与动作空间扩展 | 异步事件/语音/Computer Use/机器人 |
| 7 | Agent 的评估 | τ²-bench/Pass@k vs Pass^k/LLM-as-Judge/可观测性/消融与 A/B |
| 8 | 模型后训练 | 预训练→mid-training→SFT→RL；奖励设计；环境仿真 |
| 9 | Agent 的持续进化 | 轨迹→学习信号；四种沉淀（知识/指令/程序/参数）；睡眠学习 |
| 10 | 多 Agent 协作 | 共享 vs 不共享上下文 × 拓扑；六种失败模式；A2A；Agent 社会 |

### 2.3 ToyAgent：分模块原理的可运行串联

| 事实 | 值 |
| --- | --- |
| 协议 | Apache-2.0（© 小傅哥） |
| 形态 | Java 17 零依赖；**26 场景 = 26 个接口类 = 26 个 .java 文件**（每文件嵌套实现类即全部逻辑，总 ~9300 行） |
| 核心隐喻 | `public interface Agent { String chat(String input); }`——智能体最小契约 |
| 七条弧线 | 基础内核(01-04) → 记忆知识(05-08) → 工具进化(09-11) → 协作派遣(12-14) → 运行时工程化(15-18) → **人机协同与安全(19-22)** → 扩展形态(23-26) |
| 教学装置 | `MockChatModel`（774 行确定性剧本）→ 零 Key 可看完整轨迹；配 OpenAI 兼容 API 即换真脑 |
| 可视化 | `web/` 原生测试页：对话 + 执行轨迹时间线 + mermaid 时序图 + **27 篇原理文章**（`.flow/.fnode` HTML 图 + callout + 五语言代码切换） |
| 衍生资产 | 姊妹仓 `deepseek-harness-java`（step15-22 来源）；Python/TS/Go/JS 四语言等价实现 |

### 2.4 两者分工（用户判断已验证）

| | 书（模块纵深） | ToyAgent（串联实现） |
| --- | --- | --- |
| 粒度 | 每章一个主题：原理 + 实验 + 边界 + 前沿 | 每个 step 一个接口类：可运行、轨迹可见 |
| 独有覆盖 | 评估方法论、后训练、多 Agent 社会、持续进化闭环 | step19-22 人机协同与安全栈（书内散见 Harness 章节） |
| 资产形态 | 136 SVG 图、109 实验、22 skills、在线版 | 26 场景代码、27 篇文章、5 语言移植 |

## 3. 融合架构：四层栈

书4 补上的是「运行时层」，与前三书构成完整的「0→1 设计」叙事：

```
┌─ 书1 组织层 ─── 50 岗位 · 8 价值流 · Case Agent · 八阶段协议 · Lead/Worker
├─ 书2 业务层 ─── 品牌域场景与方法论（做什么）
├─ 书3 语义层 ─── 本体/事理/数据契约（看什么 = Agent 的上下文源）
├─ 书4 工程层 ─── Agent = LLM + 上下文 + 工具 + Harness（怎么跑）★ 新增
└─ 实战轨 ────── 上述四层在 Momcozy 品牌域的具体实例（42+45 项设计资产）
```

**叙事主线（0→1 路径）**：岗位契约（书1/SCN-019）→ Case Agent 绑定（D-020/D-053）→ Skill 按需加载（D-022）→ 上下文组装（书3 语义底座供数 + 书4 ch2/ch3 工程方法）→ ReAct 循环（书4 ch1 / ToyAgent step03）→ Action Intent → Policy Gate（书4 Harness 约束验证 = 项目 Policy Gate+Execution Broker）→ ES-M/ES-A/ES-X 执行面（D-080）→ Receipt 与评估回流（书4 ch7 / SCN 契约「必须回放」）。

## 4. 三方映射：书章 × ToyAgent step × 项目契约

这是融合方案的核心内容——证明项目设计是该框架的生产级实例化，且标出项目比书/演示仓更保守的治理增量。

| 书章 | ToyAgent steps | 项目契约/资产（公开仓可查） |
| --- | --- | --- |
| ch1 入门（公式/ReAct/Harness） | 01 Chat · 02 Prompt · 03 ReAct · 15 Loop 守卫保险丝 | Case Agent（D-020/D-053）· 八阶段协议（D-024）· Role Release Bundle（D-023）· Emergency Guard（D-026） |
| ch2 上下文工程 | 05 Memory · 10 Skill · 13 Subagent · 17 Runtime 裁剪 | Skill 契约（D-022 五契约）· Stage Artifact 上下文边界 · ES-M 手动交接面 |
| ch3 记忆与知识库 | 05 MemoryAgent · 07 RagAgent · 08 WikiAgent | 书3 语义底座 · G1 数据需求文档 · ArtifactEnvelope 验收产物 |
| ch4 工具 | 04 ToolCall · 09 Mcp · 10 Skill · 11 Registry | MCP/tools/API/hooks 保留方向（AGENTS.md）· ToolRegistry ↔ 工具契约 |
| ch5 Coding Agent | 18 FullAgent · 25 CliAgent | 【边界】项目不实例化 coding agent，标注不覆盖 |
| ch6 交互扩展 | 19 AskAgent · 25 Cli（其余模态不覆盖） | C1/C2/C3 确认流（PV-21/D-080）· ES-X 永久人工面 · 真人 HITL 后置 |
| ch7 评估 | （无直接对应；step15 保险丝部分相关） | 20 场景契约 ×16 条事理 = 评估规格层 · G1 证据包六要件 · FLOW 门禁验收 |
| ch8 后训练 | — | 【边界】模型侧能力，项目不实例化，标注 |
| ch9 持续进化 | 08 WikiAgent · 22 EventSourced | Role Release Bundle 版本演进 · Skill/Playbook 迭代 · G1C 规则集回流 |
| ch10 多 Agent 协作 | 12 MultiAgent · 13 Subagent · 14 A2A | **D-020 单 Case 单 Agent + 模型外 Case Control**——书 ch10 六种失败模式（级联放大/同质趋同/循环失控/理解债）正是该决策的理论依据 · D-053 Lead/Worker ArtifactEnvelope · FLOW-07 Emergency Guard |
| （散见 ch1 Harness + ch6 安全） | 16 Workflow 状态机 · 19 Ask · 20 Approval · 21 Sandbox · 22 EventSourced · 23 Plugin · 24 Hooks · 26 Schedule | 八阶段门禁（D-024）· C1 审核会话/C2 逐条/C3 EG（≈ step20 审批门禁四要素）· ES-M/A/X（≈ step21 纵深防御）· 产物驱动+Envelope（≈ step22 事件溯源） |

**关键叙事点**：

1. **书给方法论，项目给治理**。书/ToyAgent 默认单 Agent 自主循环；项目在其上叠加模型外控制面（Case Control/Policy Gate/EG），把「Agent 能做什么」收敛为「被允许建议什么」——这正是企业级与演示级的分水岭。
2. **ch10 反向验证 D-020**。书列六种多 Agent 失败模式，项目「单 Case 单 Agent + ArtifactEnvelope 交接 + 禁止自由互聊」是对这些失败模式的工程性规避——融合页应如实呈现「书解释了为什么我们这样保守」。
3. **step20 ≈ C1/C2/C3**。ToyAgent 审批门禁（风险分级+审批挂起+会话免审+超时默认 DENY）与 R4 确认流三级（审核会话批量/高风险逐条/EG 规则级）结构同构，可互为参照。
4. **书 ch7 评估 ↔ SCN 契约**。书的 Pass@k/Pass^k、LLM-as-Judge、失败归因、消融/A/B 方法论，正是 20 场景契约「必须回放」清单与 G1 证据包的评估学基础。

## 5. 站点落地清单

沿用 book3 既有机制（`src/data/bookN.json` 元数据 + `src/data/bookN/*.json` 精读 + `render_bN_*` + `build.py` 注册）：

| 产物 | 位置 | 说明 |
| --- | --- | --- |
| 书4 元数据 | `src/data/book4.json` | 仿 book3.json：title/author/publisher→开源仓/ISBN→仓库链接/thesis/parts/chapters/reading_paths |
| 章节框架索引 | `book4/index.html`（由 book4.json 渲染） | 10 章框架 + 每章三链：本站解读 / 官方在线版 / GitHub 原文 |
| 精读 ×5 | `src/data/book4/b4-01~b4-10*.json` + `book4/*.html` | ch1/2/3/4/10 深度解读（框架索引+精读混合体例，同 book3） |
| 三方映射页 | `src/data/agent-lab.json` + `agent-lab.html` | 26 step × 10 章 × 项目契约映射表 + 关键 step 自绘原创 SVG/HTML 图 + ToyAgent/GitHub/在线版链接 |
| 四层叙事页 | `src/data/stack.json` + `stack.html`（或并入 synthesis） | 组织→业务→语义→工程→实战 的 0→1 路径总纲 |
| 合璧页更新 | `triology.json` / `synthesis.json` | 从「三书合璧」扩为「四层合璧」叙事（保持原页兼容，新增层级说明） |
| 导航/地图 | `site_render.py` nav、`sitemap.json`、`index.html` | 新增 book4/agent-lab/stack 入口与阅读路径 |

**体例约定**：

- 精读沿用「框架索引 + 精读」混合：每章给骨架表 + 3-6 篇深读小节 + 思考题/实验入口
- 所有项目侧引用到契约 ID 级（PV-21、D-080、SCN-018、D-020/023/024/053/026、G1-*），链接公开仓 `zjgulai/AI-Native-Organization` 对应目录
- 配图自绘原创（致敬 ToyAgent 的 `.flow` 风格但不复制）；书的 SVG 图可**链接**官方在线版查看，不复制进仓（避免 136 图的版权与体积负担；如需精选 3-5 张关键图可另行评估署名引用）
- ch5/ch6/ch8 标注覆盖边界：项目不实例化 coding agent / 语音机器人等模态 / 模型后训练

## 6. 执行计划

### 第一阶段：骨架（本轮方案批准后立即执行）

1. 内部仓：本方案评审 → 升 v0.1 基线 → DECISIONS.md 录 D-081
2. 站点仓：`book4.json` + `book4/index.html` 框架页 + `agent-lab.json` + `agent-lab.html` 三方映射页 + `stack.html` 四层叙事页
3. 更新：sitemap 板块矩阵、nav、index 阅读路径、triology/synthesis 叙事层
4. 构建验证 + 两库提交推送 + Pages 线上验证

### 第二阶段：精读（按波次）

| 波次 | 章节 | 理由 |
| --- | --- | --- |
| 第一波 | ch1 入门 · ch2 上下文工程 | 地基：公式/Harness/上下文，与项目 Case Agent+Skill 契约映射最密 |
| 第二波 | ch3 记忆知识库 · ch4 工具 | 书3 语义底座的工程侧配套 + MCP/工具生态 |
| 第三波 | ch10 多 Agent 协作 | D-020 保守决策的理论依据，叙事张力最大 |

ch5/6/7/8/9 维持框架级（每章一页骨架+要点+实验入口），ch7 评估在精读排期中可视进度前移——它与 SCN 契约映射价值高。

### 第三阶段（可选，后续议）

- agent-lab 增加「实验地图」：109 个配套实验按章编目，标注可本地复现/需 API Key/外部依赖
- 书 `skills/` 22 份 SKILL.md 与项目 Skill 契约（D-022）的格式对照页
- 姊妹篇《AI Infra》纳入观察清单（不排期）

## 7. 边界与声明

- **版权**：本书 Apache-2.0，引用/链接/改编均合法，需保留署名与 license 链接；前三本商业书的「原创蒸馏非转载」约定不变
- **站点性质**：全部 DESIGN_ONLY / 方法论公开版；不构成已上线产品或业务承诺
- **不实例化声明**：ch5 coding agent、ch6 语音/机器人/Computer Use、ch8 后训练为模型侧或非项目范围，页面明确标注
- **项目保守性声明**：映射页须呈现「书默认自主循环 vs 项目模型外控制面」的治理增量，不回避分歧
- **ToyAgent 引用**：仅链接 GitHub 仓与其在线 demo（如有），不 vendoring 代码进站点仓；Apache-2.0 允许但静态站无运行时必要

## 8. 风险与待决

| 项 | 风险/待决 | 缓解 |
| --- | --- | --- |
| 书版本漂移 | 开源书 2.0/3.0 版章节有重组（ch4 异步并入 ch6 等），EPUB 为 3.0 版 | 以 `book/chapter*.md` 当前 main 为准；框架页标注版本与更新日期 |
| 精读工作量 | 5 篇精读 ≈ book3 六篇量级 | 分波次推进，每波评审后再下一波 |
| agent-lab 数据维护 | 26 step × 10 章 × 项目契约三维表需随项目资产更新 | JSON 数据驱动，与 semantic.json 同规格维护 |
| 项目契约 ID 公开性 | 契约 ID 已在公开仓规格页出现（D-020~D-080 均公开） | 引用前逐一验证公开仓锚点可达 |
| 与实战轨边界 | 用户已定「只叙事不登记」 | stack/synthesis 页叙事引用，不动 pilot-assets |
