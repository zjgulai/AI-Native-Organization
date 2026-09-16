# ADR-0006：八阶段产物门禁协同协议

状态：已确认
日期：2026-09-11
决定：D-024

## 背景

ADR-0003已确定一张紧耦合场景工单只运行一个Case Agent，不采用岗位Agent路由或自由互聊。仍需统一回答：50个逻辑岗位如何在8条价值流和20个场景中贡献能力、工作何时可以推进、独立复核如何生效，以及异常如何停止后续动作。

仅用自由会话串联Skills会失去正式交付和接收条件；为每条价值流单独设计状态机会产生八套运行语义，增加Harness配置、评估、恢复和Site解释成本。

## 决定

所有价值流和场景共用一个逻辑八阶段协议：

1. 信号接收。
2. 范围确定与Case创建。
3. 上下文装配。
4. 证据收集与诊断。
5. 方案和标准产物形成。
6. Assurance接收门禁。
7. Action Intent、Policy Gate与Execution Broker受控动作。
8. 回执核验、Case关闭和异步学习候选。

每个阶段必须生成版本化Stage Artifact和Stage Acceptance Record；第六阶段另外生成Assurance Decision。相邻阶段可以在同一次模型回合或工具事务中完成，但逻辑产物和门禁记录不能合并或跳过。无需外部动作的Case也进入第七阶段，并以`NoActionRecord`明确关闭动作分支。

同一Case始终由一个Case Agent持有上下文，并绑定一个主岗位人格与一个固定Role Release Bundle。其他岗位通过Skill、产物schema、判断规则或Assurance Contract贡献能力，不形成岗位Agent消息链。

窄范围只读Delegate只接收最小、不可变、自包含输入，返回可独立验收的类型化产物；不能看到完整会话、调用写入工具、继续委派或改变Case状态。语义Evaluator可以提出拒绝性Finding或标记问题，但最终阶段disposition由确定性门禁记录；Evaluator不能覆盖确定性失败、放宽Access Contract或批准资产动作。

等待、返工和冻结是Case状态。Quarantined是Role Release Bundle生命周期状态；Bundle被隔离会冻结固定使用该Bundle的Case，但不能把两个状态混为一项。

## 替代方案

- 岗位Agent自由互聊：能模拟传统团队，但破坏单一上下文所有权，难以验收、缓存、恢复和限制权限，拒绝。
- 单Case Agent自由调用Skills且只保存最终结果：运行简单，但过程不可接收、不可定位失败和不可安全重入，拒绝。
- 每条价值流使用独立状态机：贴近局部业务，但会复制控制和异常语义，增加跨流程解释成本，拒绝。
- 统一八阶段协议，允许各流程使用不同Skill、产物schema和门禁规则：保留业务差异，同时统一控制面，采用。

## 影响

- `collaboration-graph.json`不再保存岗位之间的聊天或路由边，改为岗位能力来源到价值流、场景候选到价值流、价值流到统一协议及阶段产物转换关系。候选关系不等于已实例化Skill Contract。
- Case/Event Ledger成为阶段、产物、门禁和异常的权威记录；会话历史只服务模型上下文。
- AGT-002保留场景制度、分诊规则和异常协调责任，其运行控制由模型外Case Control执行。
- 独立控制岗位提供Assurance Contract、Eval与审计要求；服务端门禁负责强制执行。
- 首个样本必须证明八阶段可回放、门禁拒绝不可绕过、回执不明不会导致重复动作，之后才能讨论扩大范围。
- 本决定不创建运行Case、Bundle、工具连接、Service Identity或生产授权。
