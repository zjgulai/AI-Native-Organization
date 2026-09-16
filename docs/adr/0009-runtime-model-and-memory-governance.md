# ADR-0009：模型评估与运行治理、缓存边界和异步记忆收敛

Status: accepted, 2026-09-11

## Context

在 D-027 后，模型、上下文和缓存已经形成静态分层边界，但仍缺少可执行的 Runtime 运行规则。  
若不先统一评估口径和异步记忆闭环，模型更新后难以比较收益、难以复用 Case 结果，并且会把会话快照误当作长期经营事实。

R05-Q9 的目标是确认第一轮闭环里“模型怎么选、怎么评估、缓存怎么定参、记忆如何闭环”。

## Decision

1. 以“业务任务闭环成功率”为模型评估主指标，补充指标为 STG-01~STG-08 成功率、异常冻结率、重复动作率、95 百分位 SLA、工具成功率和单位工单成本。  
   单次延迟或首 token 速度不作为第一筛选标准。  
2. 采用双模型执行策略：常规场景用主模型，复杂/异常/冲突证据场景在策略门禁后触发复核模型。复核模型只增加确认强度，不扩大执行权限。  
3. Prompt 缓存固定静态前缀（System、Business、Runtime、Stage、Bundle、主岗位人格、技能描述），会话易变层与客户、员工、账号明细不入长期共享缓存。  
4. 异步记忆由 Case 关闭后的独立异步作业提取为结构化候选（case_ref、scope、artifact_refs、来源、时间、风险标签），写入 Memory Store；异步提取失败不阻塞已完成Case的关闭。  
5. 记忆与运行状态不直接触发写权限；任何动作仍需经过 Access Contract、Policy Gate、Execution Broker 与回执核验。

## Considered Options

- 以单模型+更激进缓存参数加速全部场景：实现简单，但复杂异常工单下可追溯性与合规性不足。  
- 不做双模型，用单模型覆盖常规与复核：可降低组件数量，但异常决策的质量监控不足。  
- 完全不启用 Prompt 缓存：稳定但会放大量成本与一致性波动，且不利于高频场景。  

## Consequences

- Runtime Contract 中新增“评估指标、复核门槛、异常重试策略、缓存范围、异步记忆失败行为”字段（保持为候选定义，待环境配置后落表）。  
- `case-record-contract.json` 与 `case-record` 中已补充条款，异步记忆失败不得导致回滚已关闭Case。  
- 该 ADR 不授权任何生产模型参数、服务账号、工具schema、生产写入或资产动作；模型参数值仍需在目标环境核验后再固化。

## Evidence

- [Anthropic：A guide to the anatomy of effective commerce agents](https://claude.com/blog/the-anatomy-of-effective-commerce-agents)，2026-09-02。  
- [Claude Platform：Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)，2026-09-11。  
- [Anthropic官方 commerce-agents 参考实现](https://github.com/anthropics/commerce-agents)。
