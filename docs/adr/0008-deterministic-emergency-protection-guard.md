# ADR-0008：FLOW-07模型外确定性紧急保护通道

状态：已确认
日期：2026-09-11
决定：D-026

## 背景

D-024要求全部Case完整运行八阶段协议，D-025要求每张Case只绑定一条主价值流和一个主场景。重大质量或账号事件若等待模型完成诊断和Assurance后才控制暴露，可能扩大客户、商品、库存或账号风险；若让模型自由决定紧急动作，又会绕过资产权限、范围和回执边界。

这里需要区分两件事：正常业务阶段是否完整，以及重大事件能否在模型诊断前由确定性系统执行保护。保护通道不能成为第二个Agent、快捷审批或第七阶段的替代品。

## 决定

1. 正常业务全部继续运行统一八阶段协议。仅FLOW-07的重大质量或账号候选信号可以进入模型外`Emergency Guard`；Guard是确定性保护电路，不是LLM路由器、岗位Agent或第二个Case Agent。
2. 只有下列条件全部成立，Guard才可形成`PROTECT`决定：信号来自已登记的权威来源且可机器核验；命中一个已发布、互斥且未过期的规则；规则固定唯一主场景、Case Charter模板、保护动作模板、最小对象范围、Policy版本、TTL、幂等算法和最大影响边界；模板被证明只会缩小暴露。模型不能选择动作、修改模板或扩展参数与范围。
3. Guard形成固定Action Intent后仍须经过模型外Policy Gate。只有Policy Decision为ALLOW，才能生成Execution Outbox；Execution Broker持有Service Identity并执行。DENY或HOLD不得产生Outbox或Execution Attempt。
4. STG-01 Signal Envelope及其Acceptance先成为权威输入。随后Case Control在一个本地事务中写入Case、STG-02 Stage Attempt、Case Charter及Acceptance、Emergency Guard Decision、固定Action Intent、Policy Decision以及ALLOW时的Execution Outbox。事务失败不得留下可派发Outbox。外部业务系统副作用不可能与本地账本真正原子提交，因此Broker在事务提交后消费Outbox，并以幂等键执行和对账。
5. 紧急动作只允许固定、最小范围、限制性、可逆的保护操作。TTL只限定Intent和Outbox可被首次派发的有效窗口，过期后不得执行，也不会自动恢复业务。重新开放、恢复曝光、扩大范围、外部声明或承诺、退款、召回、销毁及永久变更不得使用Emergency Guard，必须在正常STG-07经过方案、Assurance、Policy Gate与Execution Broker。
6. 在D-025要求的唯一主价值流、主场景和业务范围尚未成立前，规则多匹配、场景不唯一或范围不唯一只能生成`Pre-Case Exception`并冻结受影响信号范围；不得创建Guard Decision、残缺Case、Action Intent、Policy Decision、Outbox或Execution Attempt。零匹配可以记录不含规则或Case引用的`NO_MATCH` Guard Decision并继续正常建单。本地事务提交结果不明时也先使用Pre-Case Exception并按`atomic_commit_ref`查询；只有证明Case已经提交，才能改用Case Exception。合法Case成立后的模板或Policy版本缺失、执行状态不明或权威回执无法核对才记录Case Exception并冻结受影响Case/对象。Policy正常返回DENY或HOLD只表示紧急动作未获许可，仍保留证据并按已发布恢复规则决定Case继续、等待或冻结；不能换会话、改参数或重复建单绕过。
7. Emergency Guard不会完成或跳过正常STG-03至STG-08，也不会把紧急执行尝试伪装成STG-07的Stage Artifact。Case从已验收的STG-02继续装配、诊断、形成方案、接受保障、处理正常动作，并在STG-08汇总紧急与正常动作的权威回执、根因和恢复证据后关闭。

## 替代方案

- 所有动作都等待完整诊断和Assurance：控制语义最简单，但重大事件的可避免暴露可能持续扩大，未采用。
- 让Case Agent或另一个LLM自行判断并执行紧急动作：响应快，但范围、权限和参数不可确定性复现，拒绝。
- 预授权确定性Guard执行固定保护，Case仍完整运行八阶段：兼顾止损速度、单Case责任、可回放控制与后续恢复，采用。

## 影响

- `Emergency Guard`、Policy Gate、Case Control、Case/Event Ledger、Execution Outbox和Execution Broker形成模型外链路；任何提示词或Skill都不能放宽其规则。`Pre-Case Exception`在合法Case存在被证明前保存冻结与恢复证据，不承担Case状态。
- 每条紧急规则必须通过互斥性、权威信号、范围唯一性、模板固定、TTL、幂等、最大影响和失效冻结测试后才能发布。FLOW-07场景映射、selector、具体阈值和动作模板仍未编译。
- Site需要把紧急保护与正常八阶段分开显示：保护原因、固定模板、Policy结论、Outbox/Attempt、权威回执、当前Case阶段和恢复禁区均可追踪。
- 本决定不发布任何Guard规则，不指定实际动作、阈值、账号、商品、系统、Service Identity或生产权限；所有运行计数保持为零。
