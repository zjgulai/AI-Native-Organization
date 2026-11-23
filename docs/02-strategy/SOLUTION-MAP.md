# AI组织变革完整方案地图

状态：D-051后的方案总索引。本文把已经确认的组织、场景、Agent、平台、数据、治理、Shopify绿地方案和验证路线组织为八个互不重叠的方案域。它是文档与Site的共同导航；D-052仅授权公开发布这些方案，不代表任何业务系统已经上线。

## 方案目标

用50种独立Role Preset覆盖跨境电商管理与运营全链路，以GMV为第一优先级，同时把取消退款、质量、库存、账号、现金和合规约束单独呈现。运行时每个岗位可独立寻址；复杂Case由Case Control选择一个Lead和若干Worker，Lead持有结果责任，Worker通过ArtifactEnvelope交接；真实资产动作由模型外Policy Gate和Execution Broker控制。

## 八个方案域

| 方案域 | 唯一治理对象 | 不包含 | 上游输入 → 唯一下游产物 | 权威产物 | 当前状态 |
| --- | --- | --- | --- | --- | --- |
| 1. 战略与经营 | 目标、约束、资源组合 | 岗位编排和系统权限 | 企业目标/约束 → `GOAL_AND_CONSTRAINT_LEDGER` | [总体方案](BLUEPRINT.md)、[容量与成本](CAPACITY-AND-COST.md) | 设计已形成，真实口径与基线待验证 |
| 2. 组织与岗位 | 50种长期责任契约 | Case状态和运行实例 | 目标/价值流责任 → `ROLE_PROFILE_CATALOG` | [组织图谱](../04-organization/AI-ORGANIZATION-MAP.md)、[岗位目录](../05-agents/ROSTER.md) | 50/50设计完成，Bundle未实例化 |
| 3. 场景与协同 | 单张Case的状态、阶段和交接 | 价值流产品定义和岗位版本发布 | 信号/岗位/价值流 → `CASE_AND_STAGE_LEDGER` | [自主运行模型](../07-orchestration/AUTONOMOUS-OPERATING-MODEL.md)、[协同图谱](../07-orchestration/COLLABORATION-GRAPH.md) | 协议完成，真实Case未运行 |
| 4. 价值流产品 | 端到端价值结果和闭环边界 | 单个Case执行状态 | 战略目标/能力缺口 → 8 BVS + 4 CVS产品与协作方案 | [端到端价值流](../03-scenarios/END-TO-END-VALUE-STREAMS.md) | 12条流设计完成，企业验收待运行 |
| 5. Agent治理 | Role Release Bundle及其生命周期 | 业务数据和资产动作授权 | 岗位责任/能力版本 → `ROLE_RELEASE_BUNDLE` | [Agent生命周期](../05-agents/AGENT-LIFECYCLE.md)、[管理图谱](../05-agents/AGENT-MANAGEMENT-GRAPH.md) | 目标契约完成，运行实例为0 |
| 6. 平台与工具 | Runtime、Tools、UI和连接器能力 | 业务事实语义和Policy批准 | Bundle/工具契约 → 可探测的运行与连接能力 | [Harness实施方案](../10-platform/deepseek-harness/IMPLEMENTATION-PLAN.md)、[系统接入盘点](../10-platform/deepseek-harness/SYSTEM-INTEGRATION-INVENTORY.md) | 参考架构完成，目标版本与连接待核实 |
| 7. 数据与安全 | 事实来源、数据语义、访问与记忆边界 | 经营优先级和Case编排 | 系统事实/访问政策 → 数据契约、Policy决议与审计证据 | [数据边界](../08-data/README.md)、[治理边界](../09-governance/README.md) | 政策与契约完成，企业数据证据待接入 |
| 8. 验证与变革 | 晋级证据和组织扩展决定 | 生产系统的日常业务执行 | 各域产物/回执 → `STAGE_ACCEPTANCE_AND_SCALE_DECISION` | [验证计划](../11-validation/README.md)、[实施章程](../12-rollout/IMPLEMENTATION-CHARTER.md) | 方案可静态验收，运行阶段尚未开始 |

每项PRD需求和主要产物只能归入一个主方案域；跨域只通过版本化产物引用。这样，“协同”只管理Case怎样推进，“价值流”只管理为什么从端到端形成结果，“Agent治理”只管理岗位能力版本，“数据与安全”只管理事实和访问边界。

## 推荐审阅顺序

```text
战略目标与边界
  → 50岗位责任
  → 独立岗位Preset与Lead/Worker协同协议
  → 12条端到端价值流
  → Agent五契约与生命周期
  → Harness平台和工具
  → 数据、权限与资产边界
  → 验证路线与Shopify方案
```

管理层按此顺序确认“为什么做、谁负责、如何流转、交付什么能力、怎样控制、凭什么晋级”。任一层的未知项进入HOLD，不阻止无依赖的其他方案域继续审阅。

## 敏捷畅通的三条循环

| 循环 | 入口 | 运行方法 | 出口 | 阻塞如何显式化 |
| --- | --- | --- | --- | --- |
| 决策循环 | 经营目标、机会或风险 | 用目标与约束账排序，只保留一个明确结果负责人和当前优先级 | 已确认的价值流/场景范围 | 未决经营取舍进入决策表，不混入执行Prompt |
| 交付循环 | 唯一范围的Case | Lead/Worker Preset按八阶段产生Artifact并逐门接收 | 回执已核对的业务结果或`NO_ACTION` | Waiting、Rework、Frozen分别记录原因和恢复门 |
| 能力循环 | 业务Case发现能力缺口 | 建立独立CVS Case，交付Bundle、Skill、连接器或Release | 新建业务Case显式固定的新版本 | 能力发布成功不等于经营成功，旧Case不静默升级 |

## 一张业务闭环

```text
经营信号
  → Case Control唯一建单
  → Case Control装配Lead/Worker Preset、Bundle、Skills和Tools
  → 八阶段Artifact与Acceptance Gate
  → Action Intent
  → Policy Gate：ALLOW / HOLD / DENY / NO_ACTION
  → Execution Broker使用受控Service Identity
  → system of record回执
  → 结果核对、Case关闭、异步记忆与评测
```

四平面岗位、九条业务流和四条能力流是同一系统的不同视图，不产生隐式岗位Agent互聊。组织图回答责任归属，价值流回答结果闭环，五契约回答Agent版本管理，平台图回答运行和资产控制。

## 当前方案主线

Shopify当前是空白新店且尚无上线产品。D-050保留未来实施顺序，D-051把本轮限制为完整方案与店铺治理底座方案：

1. 当前审阅Site和[Shopify店铺治理底座方案](../12-rollout/SHOPIFY-STORE-GOVERNANCE-FOUNDATION.md)，只验收治理对象、产物、责任、HOLD和未来授权条件，不登录或配置Shopify。
2. 未来另行授权后，才按[Shopify绿地路线](../12-rollout/SHOPIFY-GREENFIELD-ROADMAP.md)实例化FLOW-04、FLOW-02和FLOW-06关联Case，并推进`SHOP-G2`至`SHOP-G5`。
3. 首批产品上线并形成连续30个完整销售日后，才按D-033至D-049启动FLOW-01存量GMV Shadow；App、Scope、Level 1、45天保留、产品家族和报表仍是目标状态合同。
4. Shopify闭环验证后，再按独立渠道Case扩展到Amazon及其他店铺；Shopify数据不得替代Amazon渠道事实。

## 状态解释

- **设计已完成**：有可审阅的职责、流程、契约、边界和验收定义。
- **待实例化**：需要真实Shop、Product、Variant/SKU、App、接口或平台版本才能生成实例。
- **待验证**：需要离线、Shadow、有限运行或生产证据。
- **方案已公开**：GitHub与GitHub Pages可访问方案资产，仅证明文档发布成功。
- **未授权**：页面和文档不授予裁员、预算、Shopify或企业系统动作、业务发布或对外承诺。
