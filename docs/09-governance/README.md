# 权限与责任治理

状态：D-020至D-026已确认单Case Agent、模型外资产控制、五契约Agent管理、不可变Bundle生命周期、八阶段产物门禁协同、Case唯一主价值流/主场景规则和FLOW-07确定性紧急保护通道。候选动作策略、自治异常与验收要求已写入[PRD](../13-prd/PRD.md)和[平台落实方案](../10-platform/deepseek-harness/IMPLEMENTATION-PLAN.md)；具体动作、额度、Guard规则、服务身份和生产范围尚未授权。

每个岗位的Business、Skill、Runtime、Access和Assurance责任见[Agent五契约管理图](../05-agents/AGENT-MANAGEMENT-GRAPH.md)。AI岗位可以提出配置变更，但不能自行发布或扩大权限；Service Identity、确定性评测、发布门禁、Policy Gate和Execution Broker位于模型外。

五份契约以不可变Role Release Bundle发布，状态转换、隔离和回退规则见[岗位Bundle与生命周期](../05-agents/AGENT-LIFECYCLE.md)。当前没有岗位Bundle已实例化，也没有任何生产授权。

八阶段的Stage Artifact、Stage Acceptance、Assurance Decision、动作尝试和核验回执分别记录，见[场景协同图谱](../07-orchestration/COLLABORATION-GRAPH.md)。Case状态不得使用Bundle的Quarantined状态；Bundle隔离只会让受影响Case进入Frozen并停止新动作。

FLOW-07的Emergency Guard只处理已接收的权威信号，且必须由已发布规则固定场景、范围、保护模板、Policy、TTL、幂等和最大影响边界。唯一Case绑定前的歧义只记录Pre-Case Exception并冻结信号范围，不创建残缺Case或动作。Guard不持有Service Identity；只有Policy为ALLOW且本地Case/Outbox事务提交后，Execution Broker才能执行。TTL不自动恢复，紧急Attempt不完成STG-07；恢复、扩围、外部承诺、退款、召回、销毁和永久变更只走正常八阶段。

每个场景需区分数据读取、分析建议、草稿生成、策略允许动作及禁止动作，并明确执行Agent、范围、额度/条件、有效期、撤回方式、幂等、回执与恢复。

后续交付：

- 动作策略矩阵与职责分离：提出、核验、执行、独立复核、回执查询和恢复分别由哪个Agent/系统承担。
- 对外承诺、财务、账号、商品、库存和人员动作的授权规则。
- 证据与审计要求：哪个Agent/工具依据什么数据和策略，在何时执行了什么，外部结果是什么。
- 自治异常、冻结、恢复、补偿和事故复盘方式；后置HITL如启用则单独记录。
- 平台实际可执行的控制与仅存在于岗位说明中的规则之间的差距。

阈值和策略需兼顾经营风险、接口容量和外部执行能力；不能以提示词、会话或工具UI绕过服务端/目标系统校验。
