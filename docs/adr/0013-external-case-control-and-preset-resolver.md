# ADR-0013：外部 Case Control、独立 Preset Resolver 与 team-gui 适配

状态：已确认设计方向；尚未实现。日期：2026-09-17。  
适用范围：AI 组织变革项目的 D-053 50 岗位集成路径。  
关联决定：D-054、D-055、D-056、D-057、D-058、D-059、D-060。

## 背景

Magpie-Horch 当前的 `dsh-agent-team-gui` 面向通用多 Agent 团队，支持 dynamic planner、adaptive member selection、模型驱动的 `dispatch_to_squad`、串行/并行执行和质量回合。Magpie 既有 ADR-0020 还把“小队”定义成一个会话中的单一 preset 人格加技能并集，并依据 DSH 的一个会话一个 preset、`composeFrom` 只能 bind 的语义排除了多 preset 小队。

本项目随后确认 D-053：50 个岗位必须各自成为可独立寻址的数字分身，并可在复杂业务中由模型外 Case Control 选择一个 Lead 与若干独立 Worker。D-058 进一步确认，Worker 子会话必须由模型外 resolver 绑定命名 `preset_id` 和不可变 Role Release Bundle，不能只复制 systemPrompt 或依赖 AgentRecord 名称。若直接启用 team-gui 的 dynamic planner，系统会重新引入被取消的 LLM 路由；若继续使用单一父 preset，Worker 又不是真正独立的岗位 preset。

## 决策

1. **两种运行模式并存但不混用。** Magpie 原生通用 team-gui 可以保留其单 preset/通用 planner 模式；D-053 业务路径使用独立的 External Case Control + Preset Resolver + team-gui adapter 模式。
2. **External Case Control 是业务编排唯一责任方。** 它在模型外根据版本化价值流、主场景、阶段门和 Access/Assurance 契约确定一个 Lead、有限 Worker、固定顺序、输入 Artifact 和异常策略。岗位模型不能重新选择成员或阶段。
3. **Preset Resolver 是身份绑定唯一入口。** Resolver 接收 `preset_id`、Role Release Bundle 版本/hash 和 Case 任务合同，验证材料、Bundle、运行版本和工具范围后，创建或打开绑定该 preset 的独立 session。任何缺失、漂移或解析失败都冻结，不降级为 prompt/name 映射。
4. **team-gui 只作为适配层。** 它负责固定成员的 session 执行、有限串行/并行、UI、运行历史和用量观测；D-053 业务 Case 关闭 dynamic planner、adaptive selection、模型驱动 dispatch 和递归再委派。
5. **ArtifactEnvelope 是唯一跨角色交接格式。** team-gui 的 handoff summary 只能作为原始运行记录，必须由 adapter 转换为带 Case、Stage、producer role、artifact type、schema、source refs、Hash、scope、acceptance 和过期信息的 ArtifactEnvelope；未验收产物不能进入下游。
6. **资产动作继续留在模型外。** 角色只输出 Action Intent；Policy Gate 决定 `ALLOW/HOLD/DENY/NO_ACTION`，Execution Broker 持有 Service Identity、执行幂等动作并核验权威回执。team-gui 和 Resolver 都不持有业务系统写权限或凭据。
7. **50 是岗位类型总数，不是单一 Squad 成员数。** team-gui 的 32 成员上限不构成目标缺口；一张 Case 只装配所需有限子集。若业务依赖超过上限，拆为共享 `correlation_id` 的独立 Case，并通过已验收 Artifact 关联。

## 选择理由

- 保留 DSH 的真实 per-session preset 语义，确保每个数字分身可单独寻址、评估、回放和回滚。
- 将业务编排和权限控制放在模型外，满足 D-053 的无 LLM 路由、无隐式 peer chat、Action Intent 和凭据隔离要求。
- 复用 team-gui 已有的 session、执行、UI 和运行历史能力，避免重复建设，同时不把通用 planner 误当作业务控制平面。
- 让静态角色图谱、运行 Case、Stage Acceptance、ArtifactEnvelope、Policy Decision 和 Receipt 各自拥有清晰的事实归属。

## 弃选方案

- **直接启用 team-gui dynamic planner**：会把成员选择、顺序和任务拆解交给模型，违反 D-053 的外部确定性 Case Control。
- **继续使用一个父 preset 加技能并集**：符合 Magpie ADR-0020 的原生小队语义，但无法满足 50 个岗位独立 preset 和 Worker 独立身份要求。
- **只复制 systemPrompt 或 AgentRecord.name**：没有不可变 preset/bundle 证据，无法审计版本、工具范围和回滚。
- **把 50 个岗位全部放进一个 Squad**：超出 team-gui 32 成员约束，也违反一张 Case 只装配必要角色的容量和上下文边界。

## 影响与后续

- 需要新增或验证 Resolver、Case Control、ArtifactEnvelope adapter、Policy Gate 和 Execution Broker 的宿主/服务接口；当前 Magpie 没有这些完整的 D-053 运行契约。
- `AgentRecord` 需要保存不可变 preset/bundle 引用，或由外部 registry 以 session 级不可变快照保存；最终字段需以目标 DSH 官方 schema 和宿主扩展点为准。
- 需要把 `verify-lossless` 扩展为角色资产、工具范围、Resolver 绑定、Case 单 Lead、Artifact Acceptance、无递归委派和无动态路由的验证器。
- 需要先完成 RP-M1 schema 取证，再实施 RP-M2 至 RP-M5；实施顺序不能因当前本地已有 50 个派生目录而跳过。
- 本 ADR 不授权 Shopify、Amazon、广告、库存、财务或其他企业系统的连接、写入、资金动作或生产自治。
