# 长期项目知识

## 项目性质

这是一个通过连续访谈形成经营方案和 PRD 的文档项目。用户要求连续完成总体规划，再集中决定关键取舍；可以标注的未知项不阻断候选稿形成。实际平台配置与业务执行依赖相应决定和授权，当前没有应用构建或业务运行测试入口。

## 信息归属

| 内容 | 唯一主要记录位置 |
| --- | --- |
| 当前阶段与下一步 | `docs/00-project/STATUS.md` |
| 决策前置条件和本轮问题 | `docs/00-project/DESIGN-TREE.md` |
| 企业事实与来源 | `docs/01-discovery/FACTS.md` |
| 用户原意、回答与追问 | `docs/01-discovery/interviews/` |
| 已确认与待确认的经营取舍 | `docs/00-project/DECISIONS.md` |
| 已澄清业务词汇 | `CONTEXT.md` |
| 重要且难逆转的取舍 | `docs/adr/`，当前有ADR-0001、ADR-0002 |
| 场景与职责结构数据 | `docs/05-agents/role-catalog.json`、`docs/07-orchestration/collaboration-graph.json` |
| 场景、角色、规则与协作解释 | `docs/03-scenarios/` 至 `docs/09-governance/` |
| 平台事实与配置 | `docs/10-platform/deepseek-harness/` |
| 原始来源索引 | `docs/14-research/SOURCES.md` |
| 验收要求及需求追踪 | `docs/13-prd/PRD.md` |

其他文档链接主要记录，不复制易变事实。资料冲突时保留双方依据并提出待决问题，不覆盖历史理由。

## 编号与状态

- `F-xxx`：事实；`D-xxx`：决定；`Rxx-Qx`：访谈问题。
- `SCN-xxx`：业务场景；`FLOW-xx`：跨职能流程；`AGT-xxx`：AI 岗位；`PB-xxx`：Playbook。
- `H-*`：历史真人责任类别。Agent-first v1.1初始运行不使用该类别；未来启用HITL时才重新定义，不是既定真人编制。
- `REQ-xxx`：需求；`EVD-xxx`：外部或平台证据。
- 文档模板中的占位编号不是正式登记项；确定用途时分配编号。
- 对尚未决策的内容使用“待确认”或“候选”；“已决定”必须链接用户回答或明确指示。
- “已验证”注明对象、版本/范围、方法、时间与结果；资料可见只证明资料存在。

## 建模约束

50已经明确为AI岗位类型数，GMV为第一优先级；100亿人民币的财务/GMV定义与年度仍待核对。角色类型、能力包、运行实例、任务并发、未来真人组织和供应商投入分别核算。经营可行性需要同时考虑正常任务、工具失败和自治异常；省下的人工时间不直接等于可削减的编制。

组织材料总览2354与19项明细合计2352并不一致，21部门的口径亦未闭合；不静默修正或据此推导裁撤。OEM与内部研发可以并存；产品线集中不等于只售单个SKU。

岗位卡是职责与行为设计，业务技能名称不代表已实现工具。D-020之后，50个岗位是逻辑Role Profiles，不是运行Agent目录；一张紧耦合工单只有一个Case Agent和一个主岗位人格，其他岗位贡献按需Skills。AGT-002旧的LLM多Agent路由语义已由模型外Case Control替代。两个JSON当前仍是v1.1历史业务设计，不是Harness配置；在v2 schema批准前不得把356条关系继续解释为Agent通信或权限。修改岗位或流程时，同步卡片、总表、JSON、Playbook、四层图谱、自主运行模型与PRD的直接相关内容。

v2图谱分为组织责任、场景协同、Agent管理和资产边界。模型只产生Action Intent；Policy Gate与Execution Broker在模型外控制Service Identity、资产写入、幂等和回执。Presentation Tool只表达展示意图；服务端补齐权威事实，Site负责渲染。长期记忆由独立任务异步提取；经营事实和决策/执行账分别留在system-of-record与Decision/Event Ledger。

五个参考项目按固定源码快照静态核查，公共README能力宣称、代码实现与本地运行结果分别记录。Hive公共源码基线不代表当前发行包；StaffDeck自有Harness不等于DeepSeek Harness。DeepSeek上游、社区Desktop、本机定制安装与企业目标部署分别辨识。

## 文档验证方法

写入前检查 branch 与工作区。写入后检查内部相对链接、编号引用、状态一致性、未决项是否被误写为事实，以及 Git 空白错误；首次创建文件尚未跟踪时，同时检查文件自身。

v2完成前继续核对50个唯一岗位ID、50张岗位卡、8流程、20场景和8份Playbook不丢失。v2结构检查还须核对：每个Case只有一个主岗位；Skills不携带第二个人格；协同边包含阶段、产物和接收条件；Agent管理对象引用Prompt/Skill/Tool/Model/Eval/Memory版本；资产动作经Policy Gate与Execution Broker；Service Identity不属于模型；所有生产授权为false。检查结果只证明文档与设计数据一致。

新增长期方法记录须从本文件和领域入口可达。当前人力与成本方法见[容量和成本模型](../02-strategy/CAPACITY-AND-COST.md)，组织覆盖方法见[职责承接表](../04-organization/RESPONSIBILITY-MAP.md)。

目标Harness版本必须先对齐：企业材料描述的在建平台与本机LUTE Agentic System安装包不是同一版本证据。MCP、native tool、API、hook和tool UI各自进入工具能力登记册，资料列出的系统不等于已有读写权限。当进入代码或配置阶段，先依据实际平台版本补充运行和测试方式，再修改本记录。不得提前编造命令或宣称平台可导入。

## 持续更新

本文件记录稳定方法和项目整体知识。单轮回答进入访谈，经营选择进入决策，临时进度进入 STATUS，避免本文件变成任务流水账。
