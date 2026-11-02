# 跨境电商 AI 组织变革

为 Momcozy 相关跨境电商业务制定以场景组织约 50 个 AI 岗位的全链路经营方案和 PRD。企业整体经营规模约 100 亿人民币，主要市场为北美和欧洲，企业整体有1013家活跃店铺、2000+在售SKU；Amazon占比65%，独立站占比15%。当前目标Shopify店是尚无上线产品的空白新店，不能把企业整体SKU口径当作目标店事实。以上经营信息来自企业负责人陈述。

50 指 AI 岗位类型，涵盖全部职责；既有能力包、运行实例与未来真人组织数量分别建模。GMV 为第一优先级，100 亿对应的具体财务/GMV口径和统计年度仍需核对。

## 当前进度

战略框架 v1.1 已完成；D-053与[ADR-0012](docs/adr/0012-independent-role-presets-and-bounded-composition.md)进一步确认：50个岗位各自成为可独立寻址的数字分身，每个岗位拥有独立Soul Contract、Role Playbook、Preset Blueprint、Skills、产物、评估和Access边界；既可独立完成边界清晰的岗位任务，也可由模型外Case Control以Lead/Worker方式受控组队。每张Case仍只保留一个结果责任Lead，Worker只通过已验收ArtifactEnvelope交接，不采用隐式岗位Agent互聊或LLM自由路由。全部8条业务价值流和当前20个候选场景依据D-024共用八阶段门禁协议；D-031与[ADR-0011](docs/adr/0011-business-and-capability-value-streams.md)进一步把Magpie-Horch的岗位、Skill、连接器和Release闭环建模为4条正交能力供应流，形成12条端到端价值流的产品方案与分工协作双视图。资产动作仍由Policy Gate与Execution Broker控制，HITL与真人负责人后置。D-050确认目标Shopify是空白新店且无上线产品；D-051将当前范围固定为完整方案最终审阅与店铺治理底座方案，不实例化Case或执行任何Shopify动作。D-033至D-049定义的Shopify存量GMV、App、Scope、Level 1、45天保留、产品家族、报表和Top 5规则全部保留为目标状态合同，在产品上线并形成连续30个完整销售日后才实例化。D-052只授权把方案仓库与Site公开发布到GitHub Pages。Amazon US契约继续作为后续渠道模板。

- [中文交互Site源文件](dist/index.html)：集中浏览完整方案全景、50岗位、四平面组织、八阶段协同、12条端到端价值流、平台架构、Agent治理与Shopify绿地路线。
- [完整方案地图](docs/02-strategy/SOLUTION-MAP.md)、[Shopify绿地路线](docs/12-rollout/SHOPIFY-GREENFIELD-ROADMAP.md)与[店铺治理底座方案](docs/12-rollout/SHOPIFY-STORE-GOVERNANCE-FOUNDATION.md)：Site的方案索引、未来阶段门和当前只设计不执行的治理方案。
- [12条MECE端到端价值流](docs/03-scenarios/END-TO-END-VALUE-STREAMS.md)、[结构化目录](docs/03-scenarios/e2e-value-streams.json)与[Magpie-Horch深度研究](docs/14-research/MAGPIE-HORCH-DEEP-RESEARCH.md)。
- [当前状态与下一步](docs/00-project/STATUS.md)
- [单Case Agent与岗位Skills架构决定](docs/adr/0003-single-case-agent-with-role-skills.md)与[R05组织操作系统访谈](docs/01-discovery/interviews/R05-organization-operating-system.md)
- [已确认的第二轮战略决定](docs/01-discovery/interviews/R02-strategic-decisions.md)、[R03回答记录与R04自主运行决策包](docs/01-discovery/interviews/R04-autonomous-runtime.md)与[第一轮回答](docs/01-discovery/interviews/R01-boundaries.md)
- [设计决策树](docs/00-project/DESIGN-TREE.md)
- [用户已表达的方向与决策记录](docs/00-project/DECISIONS.md)
- [已知事实与证据等级](docs/01-discovery/FACTS.md)
- [总体方案](docs/02-strategy/BLUEPRINT.md)与 [PRD](docs/13-prd/PRD.md)：已确认的战略框架；系统、账号和动作实施另行授权。
- [50 岗位总表](docs/05-agents/ROSTER.md)、[50份Soul Contract](docs/05-agents/roles/souls/)、[50份Role Playbook](docs/06-playbooks/role-playbooks/index.json)、[8 条共享业务流程](docs/03-scenarios/FLOW-CATALOG.md)、[Playbook](docs/06-playbooks/PLAYBOOKS.md)、[受控独立/组队运行模型](docs/07-orchestration/AUTONOMOUS-OPERATING-MODEL.md)与[八阶段协同图谱](docs/07-orchestration/COLLABORATION-GRAPH.md)。
- [现有组织评估](docs/01-discovery/ORGANIZATION-ASSESSMENT.md)、[部门职责承接](docs/04-organization/RESPONSIBILITY-MAP.md)与[容量和成本模型](docs/02-strategy/CAPACITY-AND-COST.md)。
- [50岗位四平面组织责任图](docs/04-organization/AI-ORGANIZATION-MAP.md)：5个经营管理、35个业务运营、5个独立控制、5个数据与Agent平台岗位。
- [50岗位五契约管理图](docs/05-agents/AGENT-MANAGEMENT-GRAPH.md)：Business、Skill、Runtime、Access和Assurance分别版本化，岗位无自发布权。
- [不可变Bundle与七状态岗位生命周期](docs/05-agents/AGENT-LIFECYCLE.md)：Case固定版本，隔离后禁止新动作，回退从Shadow重新验证。
- [八阶段场景协同图](docs/07-orchestration/COLLABORATION-GRAPH.md)：50个岗位以独立Preset、Soul、Skills、产物和保障规则覆盖8条价值流；51条场景映射仍是待业务验证的候选关系。
- [五项目深度比较](docs/14-research/REFERENCE-EVALUATION.md)、[DeepSeek Harness 落实方案](docs/10-platform/deepseek-harness/IMPLEMENTATION-PLAN.md)、[Magpie-Horch RP-M1证据](docs/10-platform/deepseek-harness/MAGPIE-RP-M1-SCHEMA-EVIDENCE.md)、[RP-M2 compiler注入规格](docs/12-rollout/MAGPIE-RP-M2-COMPILER-INJECTION-SPEC.md)与[系统接入盘点](docs/10-platform/deepseek-harness/SYSTEM-INTEGRATION-INVENTORY.md)。
- [实施章程](docs/12-rollout/IMPLEMENTATION-CHARTER.md)与[架构决策](docs/adr/0001-harness-execution-and-business-control.md)、[ADR-0002](docs/adr/0002-agent-autonomy-and-deferred-hitl.md)。
- [Shopify DTC目标状态试点章程](docs/12-rollout/BVS-01-SHOPIFY-DTC-PILOT-CHARTER.md)、[8数据集契约](docs/08-data/BVS-01-SHOPIFY-DTC-DATA-CONTRACT.md)、[SKU范围清单契约](docs/08-data/BVS-01-SHOPIFY-SKU-SCOPE-MANIFEST.md)、[只读连接器登记契约](docs/10-platform/deepseek-harness/SHOPIFY-READONLY-CONNECTOR-REGISTRATION.md)与[结构化登记](docs/10-platform/deepseek-harness/shopify-readonly-connector-registration.json)：它们是商品上线和30天基线形成后的目标合同；当前没有可实例化的Product/Variant/SKU、报表、订单、App或Scope证据。
- [Shopify Level 1资格现场证据包](docs/10-platform/deepseek-harness/SHOPIFY-LEVEL1-QUALIFICATION-EVIDENCE-PACK.md)与[结构化模板](docs/10-platform/deepseek-harness/shopify-level1-qualification-evidence-pack.json)：定义目标Dev Dashboard只读核验顺序、App类型资格矩阵、9项证据、HOLD规则与禁止动作。
- [实施蓝图](docs/12-rollout/IMPLEMENTATION-BLUEPRINT.html)：以对外BP十一节骨架展开的内部实施口径，覆盖资产清单、五条硬约束及其强制机制、八阶段产物门禁、MDC/GOC生效机制、DSH适配八个工作包、六道验证门、三套阶段门命名、排期与停止条件，并单列已识别的源内不一致。
- [BP经济模型与参数来路](docs/02-strategy/BP-ECONOMIC-MODEL.md)与[机器可读事实源](docs/02-strategy/bp-economic-model.json)：对外BP第08–09节全部金额的权威出处；全部参数性质为「假设」，由`scripts/verify-bp-economics.mjs`强制三处一致。

## 项目与关联仓库

- 本项目：[zjgulai/AI-Native-Organization](https://github.com/zjgulai/AI-Native-Organization)。
- 中文完整方案Site：[GitHub Pages](https://zjgulai.github.io/AI-Native-Organization/)；由仓库内Pages workflow发布`dist/`静态包。
- 目标执行平台与社区桌面发行参考：[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)、[DSH Desktop](https://github.com/anywhere-labs/dsh-desktop)。
- 单 Case Agent 与 Commerce Agent 方法参考：[Anthropic commerce-agents](https://github.com/anthropics/commerce-agents)。
- 已完成固定源码快照评估的五个组织项目：[CodexLoom](https://github.com/yan5xu/codexloom)、[StaffDeck](https://github.com/OpenBMB/StaffDeck)、[AgentSpace](https://github.com/HKUDS/AgentSpace)、[OpenOPC](https://github.com/HKUDS/OpenOPC)、[Hive](https://github.com/tt-a1i/hive)。

以上仓库用于平台身份核实、方法设计或静态源码比较，不表示已全部引入、安装、运行或通过企业生产验收。固定 commit、许可及适用限制见[来源索引](docs/14-research/SOURCES.md)和[五项目深度评估](docs/14-research/REFERENCE-EVALUATION.md)。

## 项目目录

```text
.
├── .openai/hosting.json              静态Site交付配置
├── AGENTS.md                         项目协作规则与必读入口
├── bp/                               对外BP页面、源片段与装配/预览脚本
├── CONTEXT.md                        已澄清的业务词汇
├── README.md                         项目入口
├── dist/                             中文交互Site与岗位/价值流视图数据
├── docs/
│   ├── 00-project/                   状态、路线、设计树、决策、长期开发知识
│   ├── 01-discovery/                 企业事实、逐轮访谈与回答
│   │   └── interviews/
│   ├── 02-strategy/                  目标、经营指标、人数与经济性模型
│   ├── 03-scenarios/                 全链路业务场景与优先级
│   ├── 04-organization/              外部执行边界与未来真人组织
│   ├── 05-agents/                    AI 岗位、人格、行为原则与技能
│   │   └── roles/souls/              50份独立Soul Contract
│   ├── 06-playbooks/                 场景操作、判断规则与异常处理
│   │   └── role-playbooks/            50份独立Role Playbook
│   ├── 07-orchestration/             协同关系图谱、交接与运行编排
│   ├── 08-data/                      系统、数据、知识与集成契约
│   ├── 09-governance/                权限、审批、审计与责任边界
│   ├── 10-platform/
│   │   └── deepseek-harness/         平台证据、能力映射与配置落实
│   │       └── preset-blueprints/     50份独立DSH Preset设计稿
│   │       └── configs/              经版本和 schema 核实后的配置
│   ├── 11-validation/               基线、试点、容量、效果与验收
│   ├── 12-rollout/                   组织迁移、人员转型与推广
│   ├── 13-prd/                      最终需求规格与需求追踪
│   └── 14-research/                 官方来源与调研证据索引
├── templates/                       场景、分身与 Playbook 模板
└── scripts/                         Role Playbook、Soul与Preset资产生成器
```

重要且难逆转的取舍记录在 `docs/adr/`，当前已有ADR-0001至ADR-0015。岗位、Soul、Playbook、Preset、图谱和端到端价值流JSON是业务设计数据，且始终不是Harness导入配置；各领域文件区分战略框架、已知事实、实施参数和生产验收。

## 如何推进

1. 每轮先阅读状态、事实、词汇和已经确认的决定。
2. 只讨论前置条件已明确的问题；环境和产品事实由助手核实，企业内部信息与经营取舍由用户补充和决定。
3. 将回答分别写入事实、词汇、决策和场景文档；战略决定、实施参数和生产验收保持不同状态。
4. 先证明Agent场景能在策略、工具和回执约束下闭环，再推导扩展、HITL与未来真人组织。
5. 将确认的方案收敛为 PRD，并用真实试点验证；设计稿、演示和配置草稿不等于生产验收。

## 本轮交付边界

目录与 Git 初始化、战略框架、五项目比较、PRD、实施章程及中文交互Site已完成；本轮授权发布方案仓库和GitHub Pages。设计资产公开可读不等于业务权限生效、系统连接、未来真人组织调整或生产上线。

本地最新工作区已补齐50份Soul、Role Playbook和DSH Preset Blueprint，并将Site更新为独立Preset与Lead/Worker组队视图；这些新增改动尚未提交，公网仍以最近一次已发布版本为准。
