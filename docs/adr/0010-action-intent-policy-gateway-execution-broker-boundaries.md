# ADR-0010：Intent/Policy/Execution 边界与资产动作守门策略

Status: accepted, 2026-09-11

## Context

在 D-020 至 D-029 流程中，R05-Q10 已明确三个关键边界：Case Agent只产出意图，不执行；模型外统一裁决；执行层持有服务身份与回执。  
若边界不收敛，系统会把“建议”与“资产动作”混为一体，导致权限漂移、重复执行、无法回溯对账，且不易在首轮不确定策略下安全运行。

R05-Q10 的目标是把这部分落地为可追踪的单链条：Action Intent、Policy Decision、Execution Attempt 与资产回执。

## Decision

1. **Action Intent 约束**：模型在 STG-07 仅产出结构化 `Action Intent`，包含目标、对象、参数摘要、风险等级、预算/额度约束、策略引用与幂等键建议。模型不得携带 Service Identity，不得直接调用写操作，不得扩大动作范围或参数。  
2. **Policy Gate 约束**：每个 Intent 在执行前先经过模型外统一 Policy Gate。决策结果仅为 `ALLOW` / `DENY` / `HOLD` / `NO_ACTION` 四类之一，并写入 `REC-POLICY-DECISION`。  
   - `ALLOW`：允许进入执行尝试；  
   - `DENY` / `HOLD`：产出 `Stage Exception`，进入 `Rework` 或 `Frozen`；  
   - `NO_ACTION`：明确无动作，不进入执行。  
3. **Execution Broker 职责**：仅模型外执行器持有 Service Identity，按 `action_intent_id + policy_decision_id + attempt_key` 执行。执行必须幂等、可重放、可核对；同对象同时间窗冲突写入资源锁，禁止并发覆盖。  
4. **资产边界默认拒绝**：未在 Access Contract 中显式允许的动作、对象、账号/店群、金额、频率、窗口、SKU群组一律拒绝。对外承诺、退款、召回、销毁、账号变更、永久性动作默认禁止，需后续 R04 或后置治理确认后方可放行。  
5. **回执与恢复**：Broker执行前先查询权威状态，避免重放副作用；回执未知时不得以推测结果推进。失败/部分成功必须写入异常账并携带恢复条件后进入正常重试或补偿流程。

## Considered Options

- 允许模型直接调用写工具并仅凭提示词约束：实现简单，但权限边界不稳定，难以做并发保护与审计。  
- 将 Policy Gate 与 Broker 融合为一个组件：减少组件数量，但会模糊决策-执行分离，影响追责和恢复。  
- 直接依赖平台原生工作流进行所有策略：可复用性高，但当前目标环境证据不足，且未把资产边界的候选项与回退条件统一到同一闭环。

## Consequences

- 协作数据模型必须支持 `Action Intent` 与 `Policy Decision`、`Execution Attempt`、`Execution Receipt` 的分离记录；本轮以候选字段落地，不授权任何生产参数。  
- 本 ADR 与既有 D-026 一致：FLOW-07 紧急保护仍按已发布确定性规则走固定最小模板，不替代 STG-07 常规执行链路。  
- 未配置 Action 模板、预算阈值、Service Identity、对象范围或恢复策略前，仅允许产出 `NO_ACTION` 或 `STAGE Exception`。  
- 任何生产运行、接口凭据与外部系统动作仍由目标环境的业务控制层正式验证后再接入。

## Evidence

- Anthropic 公开实践与官方说明中关于单一模型外部化权限、单Case协作与网关边界（2026-09-02 讨论结论）  
- 既有项目资料与本地已验证设计：`docs/07-orchestration/AUTONOMOUS-OPERATING-MODEL.md`、`docs/00-project/DEVELOPMENT.md`
