# ADR-0007：一张Case绑定一条主价值流和一个主场景

状态：已确认
日期：2026-09-11
决定：D-025

## 背景

D-024已经统一八阶段协同协议，但尚未规定一张Case可以承载多少条价值流和场景。当前20个候选场景中有18个可进入两条至五条候选价值流；场景ID本身不能唯一决定结果责任、完成条件、资源预留、策略或恢复路径。

若把多条价值流装进同一Case，一个分支的等待或冻结会拖住其他分支，多个结果负责人和Bundle版本也会混入同一上下文。若用另一个LLM总控多个Case，则会重新引入被D-020取消的多Agent路由和共享状态问题。

## 决定

1. 每张Case在STG-02必须绑定且只能绑定一个`primary_flow_ref`和一个`primary_scenario_ref`；两者必须符合已发布的兼容关系。其他场景只能作为`related_scenario_refs`提供背景，不增加结果责任。
2. Case使用`case_dedupe_key`防止同一信号、主价值流、主场景和业务范围被重复建单。具体Hash算法在可执行schema阶段确定，但组成项、`case_dedupe_rule_ref`和`case_dedupe_rule_version`必须随Case保留并可回放。
3. 同一信号确需触发多条价值流时，为每条价值流建立状态独立的Case，并共享同一`correlation_id`。每张Case分别拥有目标、完成条件、主岗位、固定Bundle、资源预留、异常和关闭结果。
4. 相关Case只能引用已经由来源Case的Stage Acceptance Record正式接收的Stage Artifact。引用必须保留来源Case、Artifact ID、版本、Hash和接收记录；来源Artifact Envelope中的Case、版本与Hash必须一致，接收记录也必须属于同一来源Case、处置为ACCEPT并实际包含该Artifact。不得用岗位Agent聊天、可变共享上下文或复制后的无来源摘要代替。
5. 一张Case可以等待另一张Case的已验收产物，但不能直接改变另一张Case的状态、重放其动作或共享Service Identity。某张Case等待、返工或冻结不自动传播到整个关联组；只有显式资源冲突或策略规则可以冻结其他受影响范围。

## 替代方案

- 一张Case承载多条价值流：减少Case数量，但混合结果责任、完成条件、预算与库存预留、Bundle版本和失败恢复，拒绝。
- 建立一个LLM总控Case协调其他Case：表面上集中管理，但重新引入多Agent路由、隐式权限与不可回放状态，拒绝。
- 按价值流拆分独立Case，以`correlation_id`和已验收产物引用协同：保持责任与恢复隔离，同时保留跨流程证据关系，采用。

## 影响

- STG-02的Case Charter必须包含唯一主价值流、唯一主场景和去重键；STG-03再依据两者与业务范围选择唯一主岗位和固定Bundle。
- `REC-CASE`必须保留本Case拥有的`resource_reservation_refs`集合，即使集合为空；每条`REC-RESOURCE-RESERVATION`只能属于一张Case，关联Case不得共用记录。该记录由模型外控制，不能授予任何资产或执行权限。
- 51条flow-scenario关系仍是候选兼容关系，D-025不把它们提升为已验证企业事实。
- FLOW-01、FLOW-05和FLOW-07的主岗位selector仍需编译为互斥、带优先级的确定性规则；未唯一匹配时Case保持Waiting。
- Site必须能按`correlation_id`展示关联Case，但每张Case的阶段、异常、动作和关闭结果独立呈现。
- 本决定不创建Case、Bundle、工具连接、资源预留或生产授权。
