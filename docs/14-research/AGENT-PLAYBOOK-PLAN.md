# AI Agent Guide × 0→1 Agent 工程 Playbook 蒸馏方案

状态：v0.1 基线（2026-11-26 用户评审「全过」；决策见 D-082）
日期：2026-11-26
决策来源：用户 2026-11-26 两轮 grill 全按推荐（Q1–Q11，见 §0）

评审记录：v0.1-draft → v0.1 基线。评审点：§5 模型边界矩阵（记忆/安全/观测=Harness 全建）、§9 章节落点核对（ch06-tools/ch06-brain 跨节点分摊）、§11 风险（N5 信息密度预留拆子页逃生口）、§10 版权口径（无 LICENSE→连代码也不整段搬）。用户确认全部通过，无修改项。

## 0. 已确认决策

| # | 决策点 | 结论 |
| --- | --- | --- |
| Q1 | 产物形态与位置 | 站点新轨 `agent-playbook`（独立轨，不并入 book4/agent-lab） |
| Q2 | 框架骨架 | P0–P8 构建顺序（依赖驱动）为主线，教程原学习顺序降级为节点内「预备知识」 |
| Q3 | 模型边界标注 | 双层：每节点内嵌「模型已具备 vs Harness 必建」边界行 + 框架页全局矩阵 |
| Q4 | 覆盖范围 | 30 章全蒸馏，按「必建节点 / 选型参考 / 运维扩展」三层标注 |
| Q5 | 模型基线 | DeepSeek Chat 模型 + function calling + OpenAI 兼容 API（用户确认假设） |
| Q6 | 自动化路线 | (a) 蒸馏管线自动化：重抓→解析→指纹→增量更新，脚本随站点仓交付 |
| Q7 | 与书4轨关系 | 独立 playbook 轨；与 book4（读书精读）、agent-lab（映射）、toyagent-steps（文章蒸馏）体裁区分 |
| Q8 | 节点粒度 | 11 节点 + 1 框架总纲页 = 12 页；ch01-llm-basics 并入框架页模型基线节 |
| Q9 | AutoAgent 对齐 | 框架页加「AutoAgent 映射」节；节点 spine 保持教程构建顺序不变 |
| Q10 | 代码策略 | 语言中立 + 模式骨架（伪代码/结构示意）；结构性接口（JSON Schema/MCP 报文/状态枚举）可引用；Python 片段仅必要时 5–10 行并注明改写 |
| Q11 | 交付批次 | Phase A = 框架页 + N0–N7（必建路径）；Phase B = N8–N10（扩展/选型/前沿）；管线脚本 Phase A 交付 |

## 1. 背景：三书体系的「0→1」缺口

现有站点四条内容轨各有侧重，唯独没有「从零造一个 Agent」的顺序工程路线：

```
book1-3 读书轨    → 组织/业务/语义三层方法论（自上而下）
book4 读书轨      → Agent 工程原理（模块纵深，李博杰书）
agent-lab         → 书×ToyAgent×项目契约 三方映射（坐标系）
toyagent-steps    → ToyAgent 27 篇原理文章蒸馏（单点深挖）
experiments       → 书4 110 实验 + 22 Skill（资产索引）
──────────────────────────────────────────────
【缺口】           → 没有一条「按构建依赖排序」的 0→1 工程路线：
                    先定义什么 → 跑通最小循环 → 加上下文/工具/记忆
                    → 上可靠性/安全/观测 → 按需扩展形态
```

用户原始诉求：完整蒸馏 https://ai-agent-guide.xiaofuge.cn/ 30 章，形成「从 0 到 1 搭建完整 Agent 的工程实践 playbook」，并以 deepseek-flash 为基线识别「模型已具备 vs 人必须建的 Harness」。

## 2. 素材分析：ai-agent-guide.xiaofuge.cn

### 2.1 站点事实

| 事实 | 值 |
| --- | --- |
| 作者 | 小傅哥（fuzhengwei），与 ToyAgent、deepseek-harness-java 同作者 |
| 定位 | 《AI Agent 通识教程》——概念→能力→工程→选型→运维的学习顺序 |
| 规模 | **30 章**（sitemap 锚点 #ch00–#ch28 + JSON-LD 第 29 章；实际 chapters/ 目录 30 个 HTML） |
| 技术形态 | SPA 外壳 + `/chapters/chNN-*.html` 静态章节页（marked.js + prismjs 渲染） |
| 源码 | GitHub `fuzhengwei/ai-agent-guide`，chapters/ 目录即全部内容 |
| **LICENSE** | **无 LICENSE 文件** → 按站点内容政策走原创蒸馏重写，不整段搬运代码/正文 |
| 抓取状态 | 30 章 HTML 已落地 `/tmp/aag-chapters/`（~3.6MB），章节↔文件↔标题映射已解析（见 §4） |

### 2.2 与已有素材的关系

- **与 ToyAgent**：同作者配套教程——ToyAgent 是「26 场景可运行串联」，本教程是「30 章概念工程全景」。两者互补不重复：toyagent-steps 蒸馏的是 step 原理文章，本 playbook 蒸馏的是教程章节的工程路线。
- **与书4**：书4 是模块纵深（每章一主题讲原理），教程是广度路线（从零到生产全覆盖）。playbook 是「施工顺序」，书4 是「零件图纸」。
- **与项目**：教程的 Harness/运行时/安全章节与项目契约（D-020/022/023/080、PV-28/29、SCN）高度同构，映射价值与 book4 相当。

## 3. 核心框架：P0–P8 构建脊柱

教程 30 章按**学习顺序**编排（先概念后能力再工程），playbook 按**构建依赖顺序**重排：

```
P0 任务定义      场景/成功标准/可逆性边界 —— 不写代码，先定义 agent 干什么
P1 最小循环      消息→模型→tool_call?→执行→观察→循环        [能跑的骨架]
P2 上下文装配    system prompt + 消息结构 + 预算 + 压缩      [喂什么给大脑]
P3 工具与能力层  schema + 注册表 + 执行器 + 结果回填          [给手脚]
P4 记忆与知识    会话历史 + 长期记忆 + RAG/知识编译           [给记忆]
P5 运行时与Harness Loop引擎 + 运行时 + Harness六组件 + 工业解剖 [骨架工程化] ★核心
P6 安全治理      输入/输出守卫 + 权限矩阵 + 审批门禁 + 沙箱    [免疫系统]
P7 观测与部署    评估 + 可观测 + 事件溯源 + 部署运维          [档案与体检]
P8 扩展形态      编排/多Agent + 交互形态 + 模型服务化/前沿     [按需选装]
```

**排序逻辑**：P0–P1 是「能跑」的最小集；P2–P4 决定「跑得对不对」；P5–P7 决定「敢不敢上生产」；P8 全部是「需要时才装」的扩展。

## 4. 节点结构：11 节点 + 框架页（12 页）

每节点 = 一篇 playbook 页，内含：定位 / 目的与价值 / 技术选型 / **模型边界行** / 蒸馏要点 / 源章节链接 / 站内互链。

| 节点 | slug（拟） | 覆盖章节（文件名） | 层级 |
| --- | --- | --- | --- |
| 框架页 | `agent-playbook.html` | 全部 30 章索引 + 模型边界矩阵 + AutoAgent 映射 + P0–P8 路线图 | — |
| N0 任务定义 | `playbook/n0-任务定义` | ch00-fundamentals + ch02-what-is-agent | 必建 |
| N1 最小循环 | `playbook/n1-最小循环` | ch03-weather-agent + ch04-react-pattern(ReAct) + ch06-tools 上半(FC骨架) | 必建 |
| N2 上下文工程 | `playbook/n2-上下文工程` | ch04-prompt-engineering + ch04b-context-engineering | 必建 |
| N3 工具与能力层 | `playbook/n3-工具层` | ch06-tools 下半 + ch07-mcp + ch08-skills + ch09-cli-capability | 必建 |
| N4 记忆与知识 | `playbook/n4-记忆与知识` | ch05-memory + ch16-rag + ch26-llm-wiki | 必建 |
| N5 运行时与Harness | `playbook/n5-运行时-harness` | ch21-loop-runtime-sandbox + ch22-harness + ch27-dsh-java-anatomy | 必建·核心 |
| N6 安全治理 | `playbook/n6-安全治理` | ch18-security | 必建 |
| N7 观测与部署 | `playbook/n7-观测与部署` | ch17-evaluation + ch19-deployment | 必建 |
| N8 编排与多Agent | `playbook/n8-编排与多agent` | ch10-multi-agent + ch11-langgraph + ch12-framework-comparison | 扩展·选型 |
| N9 交互形态 | `playbook/n9-交互形态` | ch13-dify-coze + ch14-cli-agent + ch15-gui-agent | 扩展·选型 |
| N10 模型服务化与前沿 | `playbook/n10-模型服务化` | ch20-inference-framework + ch24-jev-decision-model + ch23-future-summary | 运维·前沿 |
| 背景 | 并入框架页 | ch01-llm-basics → 「模型基线」节（token/上下文窗口/Transformer 是边界矩阵的证据层） | 背景 |

**章节落点核对**：30/30 全覆盖，无遗漏；ch06-tools 跨 N1/N3（上半 FC 骨架进 N1，下半路由/管理进 N3）。

## 5. 模型边界矩阵（deepseek-flash 基线）

基线假设：DeepSeek Chat 模型（function calling）+ OpenOpenAI 兼容 API。矩阵是全站叙事核心——**模型给「会思考的大脑」，Harness 给「身体+神经+免疫+记忆+档案」**。

| 层 | 模型已具备（不重建） | Harness 必建（人的工程） | 对应节点 |
| --- | --- | --- | --- |
| 理解 | 意图识别、指令遵循、文本/JSON 生成 | — | N0/N1 |
| 推理 | 多步思考（prompt 可引导 ReAct） | 循环节拍：何时调工具、何时停、步数预算 | N1/N5 |
| 工具 | FC：选工具+填参数 | schema 定义、注册表、执行器、结果校验回填 | N3 |
| 上下文 | 窗口内理解 | 装什么/多少/何时压缩/优先级裁剪 | N2/N4 |
| 记忆 | 无（模型无状态） | **全部**：历史管理、压缩、长期记忆、知识库 | N4 |
| 安全 | 提示词约束（不可靠） | **全部确定性防线**：守卫/权限/审批/沙箱 | N6/N5 |
| 观测 | 无 | 全部：日志、trace、评估、事件溯源 | N7 |
| 编排 | 单点推理 | 多 Agent 拓扑、状态机、编排者 | N8 |

每节点页内嵌一行同款边界标注（该节点视角的子集）。

## 6. 站点落地清单

### 6.1 数据与渲染（沿用 book4 体例）

| 项 | 位置 | 说明 |
| --- | --- | --- |
| 框架页数据 | `src/data/agent-playbook.json` | 路线图/矩阵/映射/30 章索引 |
| 节点页数据 | `src/data/agent-playbook/*.json` ×11 | 每节点 slug/lead/sections（沿用 book4 精读 schema） |
| 渲染 | `src/site_pages.py` 新增 `render_agent_playbook` + `render_pb_node` | 复用 book4 section 渲染与 inline() |
| 注册 | `build.py` + `site_data.py`（`AGENT_PLAYBOOK`/`AGENT_PLAYBOOK_NODES`） | 同 book4 模式 |
| 导航 | `site_render.py`：主导航 + 书4侧边栏「关联」组 + 页脚 | playbook 是独立轨，主导航独立入口 |
| 板块矩阵 | `sitemap.json` 新增「Agent Playbook」行 | 同步计数 |
| 首页 | `render_home` 增书4板块旁的 playbook 入口行/板块 | 与 book4/agent-lab/toyagent-steps 并列 |

### 6.2 互链（四轨打通）

- playbook 节点 → book4 对应精读页（b4-XX）、agent-lab 映射、toyagent-steps step、experiments 实验
- book4/index、agent-lab、toyagent-steps、stack 页尾 → 回链 playbook 入口
- 每节点「源章节」链官方教程原页（`https://ai-agent-guide.xiaofuge.cn/chapters/chNN-*.html`）

### 6.3 AutoAgent 映射节（框架页）

依据用户 `autoagent-intro.svg`（draw.io，OS 内核隐喻）做静态映射表：

| AutoAgent 层 | playbook 节点 | 说明 |
| --- | --- | --- |
| OS Kernel（运行时） | N5 | Loop 引擎/Harness/dsh-java ≈ Agent 的内核态 |
| System Utilities（Retrieve/Organize/Parse/Constraint） | N2/N4 | 上下文与记忆的系统调用 |
| Tools Pool / workflows Pool | N3 | 工具与能力注册表 |
| Orchestrator Agent | N8 | 编排与多 Agent |
| User Interface: Language | N9 | CLI/GUI/Dify 等交互形态 |
| Developer Mode / Agents·Workflows Creation | N0/N1 | 创建面 = 构建路径本身 |
| ANY LLMs | 全局 | 模型可替换 → Harness 才是产品 |

定位声明：AutoAgent 是产品形态隐喻，playbook 是构建方法——映射节帮助读者「造完知道自己造了个什么」，不改变节点 spine。

## 7. 自动化路线（蒸馏管线）

```
抓取层  scripts/fetch-aag.py     30 章 HTML → /tmp 或仓内 cache（可重跑，~4MB）
解析层  scripts/parse-aag.py     HTML → 结构化 JSON（标题树/段落/代码块/表格/要点抽取）
指纹层  content hash ×30         版本指纹 → 变更检测（新增/修改/删除章节）
蒸馏层  人工+AI 协作              按节点聚合章节 → 写 playbook JSON（原创蒸馏）
构建层  build.py                 JSON → dist/ 静态页（沿用现有管线）
```

- 脚本落点：站点仓 `scripts/`（新建目录），与 build.py 同级，随仓交付
- 指纹文件：`src/data/agent-playbook/source-fingerprint.json`（30 章 hash + 抓取日期）
- 增量更新：重跑 fetch+parse → hash diff → 仅变更章节重新蒸馏 → 重建
- Phase A 交付脚本骨架 + 首跑结果；蒸馏本身是内容工作不是自动化工作（保原创质量）

## 8. 执行计划

### Phase A（本轮目标）

1. 落方案文档（本文档）→ 用户评审 → 升 v0.1 基线 + 录 D-082
2. `scripts/fetch-aag.py` + `scripts/parse-aag.py` + 指纹机制（首跑）
3. 框架页 `agent-playbook.html`（路线图 + 模型边界矩阵 + AutoAgent 映射 + 30 章索引）
4. N0–N7 八个必建节点页（30 章中 21 章覆盖：ch00/02/03/04/04b/04-react/05/06-tools/07/08/09/16/17/18/19/20? — 见 §9 核对表）
5. 导航/页脚/sitemap/首页登记 + 四轨互链
6. 构建验证 + 提交推送 + 线上核验

### Phase B（后续）

7. N8–N10 三个扩展节点页（ch10/11/12/13/14/15/20/23/24/25 剩余章节）
8. 增量蒸馏流程实测（若教程更新）

## 9. 章节覆盖核对表（30/30）

| 章节文件 | 教程章名 | 落点节点 | 层级 |
| --- | --- | --- | --- |
| ch00-fundamentals | 第0章 能力全景 | N0 | 必建 |
| ch01-llm-basics | 第1章 大模型基础 | 框架页·模型基线 | 背景 |
| ch02-what-is-agent | 第2章 什么是Agent | N0 | 必建 |
| ch03-weather-agent | 第3章 第一个Agent | N1 | 必建 |
| ch04-prompt-engineering | 第4章 提示词工程 | N2 | 必建 |
| ch04b-context-engineering | 第5章 上下文工程 | N2 | 必建 |
| ch04-react-pattern | 第6章 ReAct | N1 | 必建 |
| ch05-memory | 第7章 记忆系统 | N4 | 必建 |
| ch06-brain-intent-router | 第8章 意图识别 | N1（路由思想）+N3（工具路由）交叉引用 | 必建 |
| ch21-loop-runtime-sandbox | 第9章 运行时 | N5 | 必建·核心 |
| ch22-harness | 第10章 Harness工程 | N5 | 必建·核心 |
| ch27-dsh-java-anatomy | 第11章 dsh-java解剖 | N5 | 必建·核心 |
| ch16-rag | 第12章 RAG | N4 | 必建 |
| ch26-llm-wiki | 第13章 LLM-Wiki | N4 | 必建 |
| ch06-tools | 第14章 Function Calling | N1（骨架）+N3（路由/管理） | 必建 |
| ch07-mcp | 第15章 MCP | N3 | 必建 |
| ch08-skills | 第16章 Skills | N3 | 必建 |
| ch09-cli-capability | 第17章 CLI能力 | N3 | 必建 |
| ch10-multi-agent | 第18章 多Agent | N8 | 扩展 |
| ch11-langgraph | 第19章 LangGraph | N8 | 扩展 |
| ch12-framework-comparison | 第20章 框架对比 | N8 | 选型 |
| ch13-dify-coze | 第21章 Dify/Coze | N9 | 选型 |
| ch14-cli-agent | 第22章 CLI Agent | N9 | 扩展 |
| ch15-gui-agent | 第23章 GUI Agent | N9 | 扩展 |
| ch17-evaluation | 第24章 评估 | N7 | 必建 |
| ch18-security | 第25章 安全 | N6 | 必建 |
| ch19-deployment | 第26章 部署 | N7 | 必建 |
| ch20-inference-framework | 第27章 推理框架 | N10 | 运维 |
| ch24-jev-decision-model | 第28章 Jev决策 | N10 | 前沿 |
| ch23-future-summary | 第29章 2026展望 | N10 + 框架页路线图印证 | 前沿 |

**Phase A 覆盖**：框架页（30 章索引+ch01 基线）+ N0–N7 = 20 章实质蒸馏（ch06-tools/ch06-brain 跨节点分摊）；**Phase B**：N8–N10 = 10 章。

## 10. 边界与声明

- **版权**：教程仓库无 LICENSE → 全部原创蒸馏重写（与前三本商业书同政策，且比书4更严——连代码也不整段搬）。结构性接口事实（JSON Schema、MCP JSON-RPC 报文、HTTP 端点、状态枚举）属互操作性事实可引用，叙述性内容一律改写。
- **署名与互链**：每节点「源章节」直链官方教程原页；框架页声明素材来源与作者。
- **保守性呈现**：与项目契约冲突处如实标注（同 book4 体例）——如教程默认 Agent 自主循环 vs 项目 D-020 模型外控制面；多 Agent 编排 vs D-020 单 Case 单 Agent。
- **不实例化声明**：playbook 是方法论蒸馏，不表示本站或项目已构建/部署任何 Agent 产品；deepseek-flash 基线分析是「能力边界推断」，非实测 benchmark。
- **AutoAgent**：映射节基于用户提供的构想草图，标注「产品形态隐喻，非已实现系统」。

## 11. 风险与待决

| 风险 | 缓解 |
| --- | --- |
| 30 章内容量大，单节点页信息密度过高 | 节点内按「源章节」分节；N5 三章核心拆为三个 h2 组；必要时单节点拆子页（N5 首选候选） |
| 教程更新导致蒸馏过时 | 指纹机制 + source-fingerprint.json；STATUS 例行检查 |
| deepseek-flash 实际能力与假设不符 | 边界矩阵标注「基线假设」；若用户后续给出具体部署形态可修正 |
| 与 book4/agent-lab 内容重复感 | playbook 讲「施工顺序」，book4 讲「原理纵深」，agent-lab 讲「映射坐标」——互链交叉引用而非重复叙述；每节点开头一句话声明体裁差异 |
| AutoAgent 构想未定型 | 映射节标注草图来源与「隐喻非系统」声明；若 AutoAgent 后续成型可升级为独立映射页 |
