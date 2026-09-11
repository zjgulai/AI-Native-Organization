# 跨境电商 AI 组织变革

为 Momcozy 相关跨境电商业务制定以场景组织约 50 个 AI 岗位的全链路经营方案和 PRD。经营规模约 100 亿人民币，主要市场为北美和欧洲，1013 家活跃店铺、2000+ 在售 SKU；Amazon 占比 65%，独立站占比 15%。以上经营信息来自企业负责人陈述。

50 指 AI 岗位类型，涵盖全部职责；既有能力包、运行实例与未来真人组织数量分别建模。GMV 为第一优先级，100 亿对应的具体财务/GMV口径和统计年度仍需核对。

## 当前进度

战略框架 v1.1 已完成；用户随后确认v2根架构：50表示逻辑AI岗位分身与责任契约，每张紧耦合场景工单由一个Case Agent绑定一个主岗位人格并按需加载Skills，不采用LLM多Agent路由或岗位Agent互聊。资产动作由模型外Policy Gate与Execution Broker控制，HITL与真人负责人仍后置。当前优先完成组织、协同、Agent管理和权限边界四层图谱，再进入首个经营样本与系统连接。

- [当前状态与下一步](docs/00-project/STATUS.md)
- [单Case Agent与岗位Skills架构决定](docs/adr/0003-single-case-agent-with-role-skills.md)与[R05组织操作系统访谈](docs/01-discovery/interviews/R05-organization-operating-system.md)
- [已确认的第二轮战略决定](docs/01-discovery/interviews/R02-strategic-decisions.md)、[R03回答记录与R04自主运行决策包](docs/01-discovery/interviews/R04-autonomous-runtime.md)与[第一轮回答](docs/01-discovery/interviews/R01-boundaries.md)
- [设计决策树](docs/00-project/DESIGN-TREE.md)
- [用户已表达的方向与决策记录](docs/00-project/DECISIONS.md)
- [已知事实与证据等级](docs/01-discovery/FACTS.md)
- [总体方案](docs/02-strategy/BLUEPRINT.md)与 [PRD](docs/13-prd/PRD.md)：已确认的战略框架；系统、账号和动作实施另行授权。
- [50 岗位总表](docs/05-agents/ROSTER.md)、[8 条业务流程](docs/03-scenarios/FLOW-CATALOG.md)、[Playbook](docs/06-playbooks/PLAYBOOKS.md)，以及待升级为v2四层图谱的[历史自主运行模型](docs/07-orchestration/AUTONOMOUS-OPERATING-MODEL.md)与[历史协同图谱](docs/07-orchestration/COLLABORATION-GRAPH.md)。
- [现有组织评估](docs/01-discovery/ORGANIZATION-ASSESSMENT.md)、[部门职责承接](docs/04-organization/RESPONSIBILITY-MAP.md)与[容量和成本模型](docs/02-strategy/CAPACITY-AND-COST.md)。
- [五项目深度比较](docs/14-research/REFERENCE-EVALUATION.md)、[DeepSeek Harness 落实方案](docs/10-platform/deepseek-harness/IMPLEMENTATION-PLAN.md)与[系统接入盘点](docs/10-platform/deepseek-harness/SYSTEM-INTEGRATION-INVENTORY.md)。
- [实施章程](docs/12-rollout/IMPLEMENTATION-CHARTER.md)与[架构决策](docs/adr/0001-harness-execution-and-business-control.md)、[ADR-0002](docs/adr/0002-agent-autonomy-and-deferred-hitl.md)。

## 项目与关联仓库

- 本项目：[zjgulai/AI-Native-Organization](https://github.com/zjgulai/AI-Native-Organization)。
- 目标执行平台与社区桌面发行参考：[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)、[DSH Desktop](https://github.com/anywhere-labs/dsh-desktop)。
- 单 Case Agent 与 Commerce Agent 方法参考：[Anthropic commerce-agents](https://github.com/anthropics/commerce-agents)。
- 已完成固定源码快照评估的五个组织项目：[CodexLoom](https://github.com/yan5xu/codexloom)、[StaffDeck](https://github.com/OpenBMB/StaffDeck)、[AgentSpace](https://github.com/HKUDS/AgentSpace)、[OpenOPC](https://github.com/HKUDS/OpenOPC)、[Hive](https://github.com/tt-a1i/hive)。

以上仓库用于平台身份核实、方法设计或静态源码比较，不表示已全部引入、安装、运行或通过企业生产验收。固定 commit、许可及适用限制见[来源索引](docs/14-research/SOURCES.md)和[五项目深度评估](docs/14-research/REFERENCE-EVALUATION.md)。

## 项目目录

```text
.
├── AGENTS.md                         项目协作规则与必读入口
├── CONTEXT.md                        已澄清的业务词汇
├── README.md                         项目入口
├── docs/
│   ├── 00-project/                   状态、路线、设计树、决策、长期开发知识
│   ├── 01-discovery/                 企业事实、逐轮访谈与回答
│   │   └── interviews/
│   ├── 02-strategy/                  目标、经营指标、人数与经济性模型
│   ├── 03-scenarios/                 全链路业务场景与优先级
│   ├── 04-organization/              外部执行边界与未来真人组织
│   ├── 05-agents/                    AI 岗位、人格、行为原则与技能
│   ├── 06-playbooks/                 场景操作、判断规则与异常处理
│   ├── 07-orchestration/             协同关系图谱、交接与运行编排
│   ├── 08-data/                      系统、数据、知识与集成契约
│   ├── 09-governance/                权限、审批、审计与责任边界
│   ├── 10-platform/
│   │   └── deepseek-harness/         平台证据、能力映射与配置落实
│   │       └── configs/              经版本和 schema 核实后的配置
│   ├── 11-validation/               基线、试点、容量、效果与验收
│   ├── 12-rollout/                   组织迁移、人员转型与推广
│   ├── 13-prd/                      最终需求规格与需求追踪
│   └── 14-research/                 官方来源与调研证据索引
└── templates/                       场景、分身与 Playbook 模板
```

重要且难逆转的取舍记录在 `docs/adr/`，当前已有ADR-0001至ADR-0003。岗位和图谱 JSON 是v1.1可检查的业务设计数据，待按v2四层图谱升级，且始终不是 Harness 导入配置；各领域文件区分战略框架、已知事实、实施参数和生产验收。

## 如何推进

1. 每轮先阅读状态、事实、词汇和已经确认的决定。
2. 只讨论前置条件已明确的问题；环境和产品事实由助手核实，企业内部信息与经营取舍由用户补充和决定。
3. 将回答分别写入事实、词汇、决策和场景文档；战略决定、实施参数和生产验收保持不同状态。
4. 先证明Agent场景能在策略、工具和回执约束下闭环，再推导扩展、HITL与未来真人组织。
5. 将确认的方案收敛为 PRD，并用真实试点验证；设计稿、演示和配置草稿不等于生产验收。

## 本轮交付边界

目录与 Git 初始化已完成。当前交付范围为已确认的自主战略框架、五项目比较、PRD和实施章程；战略框架不等于业务权限生效、系统连接、未来真人组织调整或生产上线。
