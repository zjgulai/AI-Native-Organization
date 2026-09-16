# 50个独立数字分身实施 TODO

状态：方案与设计资产已完成；DSH Preset 尚未导入，企业系统尚未连接，生产动作未授权。依据：D-053、[ADR-0012](../adr/0012-independent-role-presets-and-bounded-composition.md)。

## 目标

把 50 个 AI 岗位分别做成可独立寻址、可独立验收、可独立回放的数字分身。每个分身同时具备：Role Profile、Soul Contract、Role Playbook、Skills、产物合同、评估集、Access Contract 和 DSH Preset Blueprint。复杂业务由外部 Case Control 以 Lead/Worker 方式组队，Worker 只能通过已验收的 `ArtifactEnvelope` 交接；不启用岗位之间的隐式自由聊天。

这是一套岗位能力供应系统，不是把 50 个模型实例同时常驻。岗位类型、能力包、运行实例、并发任务、外部供应商投入和未来真人编制分别计量。

## 两种运行模式

| 模式 | 入口 | 责任 | 交接 | 允许的模型输出 |
| --- | --- | --- | --- | --- |
| `standalone_role_preset` | 一份岗位任务合同 | 本岗位对岗位产物负责 | 指定验收者接收 `ArtifactEnvelope` | 产物、`Action Intent`、`NO_ACTION` 或 `HOLD` |
| `bounded_role_worker` | 外部 Case Control 派发的阶段任务 | Lead 对 Case 总结果负责，Worker 对增量产物负责 | 只消费已验收 Stage Artifact，返回带来源的产物 | 增量产物、风险、冲突和 `HOLD`；不转授权限 |

两种模式都使用相同的五份契约和不可变 Role Release Bundle。模型只声明 Action Intent；Policy Gate 和 Execution Broker 在模型外决定与执行资产动作。

## 单岗位资产清单

每个 `AGT-001` 至 `AGT-050` 都必须完成下列清单：

- [x] `docs/05-agents/roles/AGT-xxx.md`：岗位责任、人格、原则、技能、产物和基础边界。
- [x] `docs/05-agents/roles/souls/AGT-xxx.soul.md`：独立 Soul Contract，明确判断姿态、反模式、停止信号和协作姿态。
- [x] `docs/06-playbooks/role-playbooks/AGT-xxx.md`：独立触发、最小输入、六步执行、产物、异常、回放和验收 Playbook。
- [x] `docs/10-platform/deepseek-harness/preset-blueprints/AGT-xxx.json`：独立 Preset Blueprint，包含两种运行模式、Prompt 层、Skills、工具类别、Access 和 Assurance 映射。
- [ ] 真实目标 DSH 版本、Preset schema、插件版本、Host 行为和服务身份边界核实（本机 CLI `0.1.5-rc.1` 与应用包内 Harness `0.1.2-rc.1` 仅是本机证据，不能替代目标环境确认）。
- [ ] 将 Blueprint 投影为目标环境可导入格式，并保留源 Blueprint 与投影 hash。
- [ ] 为本岗位建立正常、缺失、冲突、越权、重复、工具失败、部分成功、回执不明和重启回放样例。
- [ ] 通过独立评估后才允许进入 Shadow；评估集或契约变化必须生成新的 Role Release Bundle。

统一索引： [Role Playbook index](../06-playbooks/role-playbooks/index.json) · [DSH Preset manifest](../10-platform/deepseek-harness/preset-blueprints/manifest.json)。

## 分阶段 TODO 与门禁

| 门 | 工作 | 完成证据 | 不能提前做的事 |
| --- | --- | --- | --- |
| RP-G0 资产盘点 | 核对 50 个岗位、Soul、Playbook、Preset、共享 PB 和引用 | 三项数量均为 50；无悬空引用；唯一 `preset_id` | 不导入 DSH，不连接业务系统 |
| RP-G1 契约冻结 | 为每个岗位冻结 Business、Skill、Runtime、Access、Assurance 五契约 | Role Release Bundle manifest、版本和 hash | 不让模型自发布或继承“最新” |
| RP-G2 独立回放 | 用脱敏样例验证 standalone 入口、产物和停止行为 | 可重放输入、输出、拒绝、HOLD、异常和成本记录 | 不执行资产动作 |
| RP-G3 组队回放 | 用一个 Lead 和至少一个 Worker 验证 `ArtifactEnvelope`、冲突和返工 | Case Control 记录、ArtifactEnvelope、Acceptance Record、冲突回退 | 不启用隐式 peer chat 或权限转授 |
| RP-G4 DSH 投影 | 核实目标版本与 schema，生成一份可审阅投影并做静态校验 | 版本、schema、插件、Host、service identity 证据；投影可解析 | 未核实 schema 时不伪造导入 JSON |
| RP-G5 沙箱 | 在隔离环境挂载最小只读工具与 Tool UI，模拟 Policy Gate/Broker | 工具 scope、拒绝、幂等、回执查询和审计日志 | 不使用生产凭据或真实店铺写权限 |
| RP-G6 Shadow | 先跑单岗位，再跑受控组队；结果与基线并行比较 | 任务完成率、质量、SLA、异常冻结率、单位成本、误动作为零 | 不把 Shadow 结果写成生产经营结果 |
| RP-G7 Limited | 对已发布动作模板开放最小范围、短 TTL 和回退 | Policy、Broker、回执、恢复和审计证据完整 | 不扩大市场、账号、商品、预算或动作类别 |
| RP-G8 Production | 逐岗位、逐场景、逐渠道晋级；持续评估和回退 | 生产准入记录、经营结果、自治异常、全成本和外部验收 | 不因平台发布自动宣称经营成功 |

## 复杂场景组队协议

1. Case Control 先确定一条主价值流、一个主场景、业务范围、完成条件和去重键。
2. Case Control 选择一个 Lead Preset，并把 Lead、Worker、阶段、输入 Artifact、输出 schema、Access Contract 和 Bundle 版本写入装配清单。
3. Worker 只读取清单中已验收的 Artifact；缺失、过期、冲突或超范围时返回 `HOLD` 和最小缺口，不自行补全。
4. Worker 产出 `ArtifactEnvelope`：`case_id`、`stage_id`、`producer_role_id`、`artifact_type`、`schema_version`、`source_refs`、`hash`、`scope`、`acceptance_status`、`expires_at`。
5. Case Control 验收后才把产物交给 Lead 或下一个 Worker。拒绝进入 Rework，权限问题进入 Frozen，状态不明先查询权威回执。
6. Lead 汇总决策包并输出 Action Intent；Policy Gate、Execution Broker 和 system-of-record 在模型外完成资产控制和结果核对。

## DSH 配置投影边界

当前仓库提供的是 provider-neutral Blueprint，不是未经核实的 DSH 导入包。投影时必须逐项获得：产品身份与版本、Preset schema、Skills registry schema、Tool/MCP schema、Host 生命周期行为、插件版本、Service Identity 位置、审计字段和回退接口。任何一个证据缺失，保持 `blueprint_only_not_importable`。

建议的目标映射（名称仅是概念，不代表已存在的配置键）：

| Blueprint 区块 | 目标运行时职责 | 校验方式 |
| --- | --- | --- |
| `identity` + `soul_ref` | 独立岗位人格和判断原则 | 越权诱导与反模式回放 |
| `prompt_layers` | 静态、工作区、岗位、Case、回合上下文分层 | 缓存命中与上下文泄漏测试 |
| `skills` + `shared_playbooks` | 按需能力加载 | Skill 版本、来源和适用范围校验 |
| `tools` + `access` | 工具类别与默认拒绝 | 工具 schema、scope、TTL、审计测试 |
| `modes.composition` | Lead/Worker 受控组队 | ArtifactEnvelope 和无 peer chat 断言 |
| `assurance` | 评估、准入、隔离、回退 | Bundle 生命周期回放 |

## 完成定义

本项目的“50 个独立员工已完成”必须同时满足：

- 50 个岗位各有可读且互不混淆的 Soul、Playbook、Preset Blueprint、技能引用、产物和边界。
- 任一岗位可以用最小任务合同独立启动、产出、停止、回放和验收。
- 任意复杂 Case 可以由 Case Control 选择一个 Lead 和若干 Worker；交接只发生在已验收 ArtifactEnvelope 上。
- 角色身份、人格和协同方式不扩大数据或资产权限；Action Intent 不能绕过模型外 Policy Gate 与 Execution Broker。
- DSH 的真实版本、schema、插件和服务身份证据齐全后，才能从 Blueprint 生成投影；投影和生产发布分开验收。
- Shadow、Limited、Production 都有结果、异常、成本、权限和外部回执证据；当前仓库状态仍是设计完成、生产未授权。

## 当前执行顺序

1. 完成 RP-G0 静态盘点与网站展示（本轮）。
2. 选取一个管理岗位、一个运营岗位、一个控制岗位和一个平台岗位做 RP-G2/RP-G3 代表性回放。
3. 核实 DSH 目标版本/schema 后，才生成第一份导入投影；其余 46 个岗位批量投影。
4. 先以只读和 `NO_ACTION` Shadow 验证全链路，再讨论有限动作和真人 HITL 负荷。

## 未决的经营取舍

- 50 个岗位的优先实例化顺序与首批业务场景。
- 各岗位的真实 SLA、质量阈值、成本预算和异常升级对象。
- Lead/Worker 的并发上限、租户隔离和跨价值流 `correlation_id` 规则。
- 未来真人负责人、HITL 触发条件和组织编制决策。
