# RP-M1：Magpie-Horch × DSH 预设与适配契约证据

状态：设计基线已形成；尚未实现、导入或运行。  
核验日期：2026-09-17。  
适用决定：D-053 至 D-060、ADR-0013。

本文件把 RP-M1 的只读取证与目标适配设计分开记录。`Observed` 是对
`/Users/lute/project/Magpie-Horch/` 当前源码、固定 vendor pin 和本机派生目录的观察；
`Proposed` 是本项目的外部契约草案；`Unknown` 表示仍须在目标部署和批准的隔离环境中验证。
本轮没有修改 Magpie-Horch 的代码、配置、vendor 或 `~/.dsh/.agent-presets/`。

## 1. RP-M1 结论

1. DSH 原生 preset 是“组合入口”，官方 `preset.yml` 只负责展示元数据；不可变岗位身份、材料 hash、访问契约和业务 Case 语义不能伪装成官方字段。
2. DSH 的 `mount` 可以把一个 session 绑定到一个 preset；`composeFrom` 只把子 Agent 绑定到父 Agent 已有的同一 standing composition，不会解析另一个岗位 preset；`select/recompose` 只允许在 session 尚未开始 turn 时切换。
3. 因此 D-053 的“50 个独立岗位 + 外部固定 Lead/Worker”必须采用 External Case Control + Preset Resolver + team-gui adapter。直接使用 team-gui dynamic planner 或父子 `composeFrom` 都不满足本项目语义。
4. `dsh-skill-subset` 已具备 preset scope 级的逐岗位 Skill 白名单和隐藏其他 Skill 的机制；它能从 `SKILL.md` 读取正文，但目标 Host 是否把它作为稳定的岗位 Playbook loader 仍需运行验证。
5. `AgentRecord` 当前没有 `preset_id` 或 Role Release Bundle 字段，不能用 `systemPrompt` 或 `name` 约定替代不可变绑定。Resolver 必须在模型外保存并校验该绑定。
6. 本轮可冻结“数据归属、适配层、拒绝条件和验证方式”，不能冻结未经目标版本验证的导入键、宿主扩展字段或企业系统连接配置。

## 2. 证据清单（Observed）

| 证据 | 已观察事实 | 来源与定位 | 证据边界 |
| --- | --- | --- | --- |
| E-RP1 | Magpie pin 为社区 Desktop v2.0.5；Harness submodule SHA 与运行时来源分别登记，检查日期为 2026-09-11 | `vendor/dsh-desktop.pin` 第 5–13 行 | 这是 Magpie 固定参照，不等于企业目标部署版本 |
| E-RP2 | 官方 `preset.yml` 的类型只包含 `name`、`description`、`order`；`id` 来自目录名，trust 来自发现根目录 | `vendor/dsh-desktop/deepseek-harness/packages/preset/agent-presets/src/metadata.ts` 第 24–39、56–84 行 | 不应把 `role_id`、bundle hash 或权限写进该官方元数据文件 |
| E-RP3 | `mount(agentCtx,id)` 解析 preset 并把 Agent scope 绑定到 standing mount | `.../agent-presets/src/index.ts` 第 402–427 行 | 证明单 Agent 可绑定 preset，不证明 Case 编排或资产权限 |
| E-RP4 | `composeFrom` 读取父 Agent 的 standing composition，子 Agent 获得同一插件实例、工具注册和 prompt sections | `.../agent-presets/src/index.ts` 第 430–464 行 | 子 Agent 不会因 composeFrom 自动获得另一个岗位 preset |
| E-RP5 | `select` 在 session 已有 turn 时返回 `agent-preset/locked`；成功选择后记录 `agent-preset/selected` | `.../agent-presets/src/index.ts` 第 694–727 行 | preset 绑定是 session 事实，不能在运行中静默换岗 |
| E-RP6 | session projection 从 header 和 `agent-preset/selected` 事件重建当前 preset | `.../agent-presets/src/session.ts` 第 1–44 行 | 适合保存 session 级不可变引用，不是 Role Release Bundle registry |
| E-RP7 | `dsh-skill-subset` 从 `skillsDir/<name>/SKILL.md` 读取 Skill，支持 `skills` 白名单、`hideOthers`、`positiveSource`、`respectFileFlags`；注册和遮蔽都要求非空 `source` | `packages/contract/dsh-skill-subset/lib/index.js` 第 5–21、33–40、113–202 行 | 源码支持不等于目标 Host 已装配、路径可达或已完成运行回放 |
| E-RP8 | `AgentRecord` 只有 name、systemPrompt、provider、model、maxTokens、toolScope 和 fallback；`SquadRecord` 支持 leader、planner、adaptive selection、串并行、成员上限 32 | `packages/surfaces/dsh-agent-team-gui-local/src/types.ts` 第 35–85 行；`src/rpc.ts` 第 19–69 行 | 当前 schema 没有 preset/bundle 绑定；动态 planner 与 adaptive selection 不能用于 D-053 业务路径 |
| E-RP9 | team-gui 初始化注册 `dispatch_to_squad`，普通会话可触发 guaranteed/model-tool 组队；运行服务负责执行、历史与用量 | `packages/surfaces/dsh-agent-team-gui-local/src/index.ts` 第 28–83、86–169 行 | 这是执行和 UI 能力，不是模型外 Case Control、Stage Acceptance 或 Policy Gate |
| E-RP10 | generator 的 `SOURCE_FILES` 目前只有九类旧材料，`renderPersona` 注入岗位卡全文，`PRODUCT_MOUNTS` 为空 | `scripts/role-presets/generate.mjs` 第 179–189、278–311、350–362 行 | 当前派生目录不能证明已包含 Soul、逐岗位 Playbook 或 Blueprint |

## 3. 事实归属与适配层交叉表

| 层 | 事实归属 | 可由 Magpie 编译/校验 | 不能由该层承担 |
| --- | --- | --- | --- |
| AI 组织事实源 | Role Profile、Soul、Role Playbook、Preset Blueprint、图谱、五契约 | 读取、版本、原始字节 hash、引用闭合 | 不在 Magpie 另建岗位定义 |
| Magpie compiler | 构建规则与输出路径 | 生成官方元数据、Cordis 组合和扩展 manifest；静态拒绝缺件或漂移 | 不把本地生成目录当生产发布物 |
| DSH 原生 runtime | preset mount、scope、Skill/tool registration、session projection | 通过已验证宿主接口装配独立 session | 不决定业务 Lead、Stage、Artifact 验收或企业权限 |
| 外部 Resolver | `preset_id` + Role Release Bundle | 解析、核验版本和工具视图，产生 session binding snapshot | 不降级为 prompt/name 映射 |
| 外部 Case Control | Case、Lead、Worker、Stage、顺序、去重和恢复 | 生成固定 adapter input | 不让模型 planner 重新选成员或扩围 |
| team-gui adapter | 固定 session 执行、有限串并行、UI、运行历史、用量 | 把外部确定的执行计划映射为现有 API | 不启用 dynamic planner、adaptive selection 或自由 dispatch |
| Policy Gate / Execution Broker | Action Intent、Service Identity、外部资产动作、权威 receipt | 记录判定与回执引用 | 不向模型暴露凭据或直接写接口 |

关键结论：`manifest.json` 中的 `role_assets`、`role_release_bundle_ref` 和 Case/Artifact
对象是 Magpie 扩展或外部服务契约，不是 DSH 官方 `preset.yml` 的字段。实现时必须把
“官方可导入部分”和“模型外控制面”分开验证。

## 4. Proposed：角色材料与 Bundle schema

下面是本项目的候选结构，用于 RP-M2 compiler 和 RP-M5 validator 的设计；它不是当前
DSH 可直接导入的配置。字段名在目标 Host 扩展点确认前不得写入 Magpie 出货组合。

### 4.1 `manifest.json` 扩展命名空间

```json
{
  "snapshot_date": "source-declared",
  "source_revision": "<ai-org-revision>",
  "generator_revision": "<magpie-generator-revision>",
  "source_hashes": {
    "role_card": "sha256:<hex>",
    "soul_contract": "sha256:<hex>",
    "role_playbook": "sha256:<hex>",
    "preset_blueprint": "sha256:<hex>",
    "graphs": ["sha256:<hex>"]
  },
  "role_assets": {
    "role_id": "AGT-001",
    "preset_id": "agt-001",
    "role_release_bundle_ref": {
      "bundle_id": "RRB-AGT-001",
      "version": "<immutable-version>",
      "content_hash": "sha256:<hex>",
      "status": "blueprint_only_not_importable"
    },
    "prompt_layers": {
      "persona_summary": "sha256:<hex>",
      "playbook_skill": "agt-001-playbook"
    },
    "access_contract_ref": "AC-AGT-001-<version>",
    "assurance_contract_ref": "AS-AGT-001-<version>",
    "production_authorized": false
  }
}
```

约束：

- `role_assets.role_id`、目录 `preset_id` 和源材料中的角色 ID 必须一一对应；缺失、重复或跨角色引用均拒绝生成。
- `source_hashes` 既保存原始文件 hash，也保存生成器和源 revision；规范化文本 hash 只能作为辅助，不能替代原始字节 hash。
- `role_release_bundle_ref` 固定五份契约的版本和内容 hash。Bundle 变化创建新版本，不能原地覆盖正在运行的 Case。
- `production_authorized=false` 是当前设计资产状态，不因生成成功、mount 成功或 UI 显示而改变。

### 4.2 `Role Release Bundle` 内容边界

| 契约 | 必须固定 | 运行时用途 |
| --- | --- | --- |
| Business | 结果、范围、输入、输出、经营指标、停止条件 | Case Charter 与产物验收 |
| Skill | Skill 名称、版本、正文 hash、加载方式、缺口 | 按需 loader 与技能可用性判断 |
| Runtime | 模式、模型路由、token/SLA、缓存层级、恢复策略 | Resolver 与运行记录 |
| Access | 事实读取、验证、展示、Action Intent 类别及 deny 集合 | 服务端工具过滤与负向测试 |
| Assurance | eval suite、拒答/冻结、审计和发布门 | RP-M5 至 RP-M7 证据 |

## 5. Proposed：外部 Case adapter schema

以下对象由 Case Control/Resolver 生成或验证，team-gui 只接收已冻结的执行投影。
它们不应伪装成 `SquadRecord` 的现有字段。

### 5.1 Resolver 输入与 session binding

```json
{
  "case_id": "CASE-<id>",
  "role_id": "AGT-001",
  "preset_id": "agt-001",
  "role_release_bundle": {
    "bundle_id": "RRB-AGT-001",
    "version": "<immutable-version>",
    "content_hash": "sha256:<hex>"
  },
  "mode": "standalone_role_preset",
  "task_contract_hash": "sha256:<hex>",
  "expected_dsh_runtime": "<verified-runtime-id>",
  "tool_view_hash": "sha256:<hex>"
}
```

Resolver 必须按顺序校验：角色和 preset ID、Bundle hash、源材料状态、目标运行版本、
Skill 可达性、工具视图和 Case 范围。任一项失败返回 `HOLD` 并记录原因；不得创建
一个只带 prompt 的降级 session。成功时写入 session binding snapshot，之后即使 registry
有新版本也不改变该 session。

### 5.2 Case、Stage 和 ArtifactEnvelope

```json
{
  "case": {
    "case_id": "CASE-<id>",
    "primary_flow": "FLOW-01",
    "primary_scenario": "SCN-<id>",
    "lead_role_id": "AGT-001",
    "worker_role_ids": ["AGT-018", "AGT-027"],
    "correlation_id": "CORR-<id>",
    "case_dedupe_key": "<recomputable-key>",
    "bundle_refs": ["RRB-AGT-001-<version>"],
    "state": "Stage-<n>"
  },
  "stage_attempt": {
    "stage_attempt_id": "STA-<id>",
    "stage": "STG-04",
    "owner_role_id": "AGT-018",
    "input_artifact_ids": ["ART-<id>"],
    "acceptance_record_id": "ACCEPT-<id>"
  },
  "artifact_envelope": {
    "artifact_id": "ART-<id>",
    "case_id": "CASE-<id>",
    "source_stage_attempt_id": "STA-<id>",
    "producer_role_id": "AGT-018",
    "artifact_type": "<contracted-type>",
    "schema_version": "<version>",
    "content_hash": "sha256:<hex>",
    "scope_ref": "<scope-contract>",
    "acceptance": {
      "record_id": "ACCEPT-<id>",
      "status": "ACCEPTED",
      "accepted_at": "<timestamp>",
      "accepted_by": "<external-assurance-owner>"
    },
    "expires_at": "<timestamp>"
  }
}
```

约束：一张 Case 只能有一个 `primary_flow`、一个 `primary_scenario` 和一个 Lead；
Worker 只能引用状态为 `ACCEPTED` 的输入 Artifact。跨价值流只共享
`correlation_id`，不共享 Case 状态、资源预留或权限。team-gui 的 handoff summary
只能保留为原始运行记录，不能直接作为 `ArtifactEnvelope`。

### 5.3 ActionIntent 与回执

```json
{
  "action_intent": {
    "intent_id": "INTENT-<id>",
    "case_id": "CASE-<id>",
    "stage_attempt_id": "STA-<id>",
    "producer_role_id": "AGT-001",
    "action_type": "<allowlisted-action>",
    "target_ref": "<opaque-target-ref>",
    "parameters": "<schema-validated-payload>",
    "idempotency_key": "<recomputable-key>",
    "requested_at": "<timestamp>"
  },
  "policy_decision": {
    "decision_id": "POL-<id>",
    "status": "ALLOW|HOLD|DENY|NO_ACTION",
    "policy_version": "<version>",
    "reason_code": "<stable-code>"
  },
  "broker_receipt": {
    "receipt_id": "REC-<id>",
    "status": "<authoritative-status>",
    "external_ref": "<opaque-ref>",
    "observed_at": "<timestamp>"
  }
}
```

模型只输出 `ActionIntent`；Policy Gate 和 Execution Broker 在模型外持有 Service
Identity。`broker_receipt` 未被权威系统确认时，Case 不得写成成功。

## 6. 运行映射：DSH 原生能力如何被约束使用

| 本项目动作 | DSH/Magpie 原生能力 | 适配规则 | 禁止降级 |
| --- | --- | --- | --- |
| 启动独立岗位任务 | `agentPresets.mount` / session preset projection | Resolver 先绑定 Bundle，再创建独立 session | 只复制 systemPrompt |
| 加载岗位 Playbook | `dsh-skill-subset` preset scope registration | 每岗白名单、`hideOthers=true`、非空 source、加载失败冻结 | 把“请读取某路径”当成已加载 |
| 复杂 Case 执行 | team-gui 固定成员、串行/有限并行、运行历史 | Case Control 预先给出成员和顺序；adapter 关闭 planner/adaptive | `dispatch_to_squad` 由模型自由调用 |
| 子角色身份 | 独立 session + `agent-preset/selected` 事实 | 每个 Worker 重新 Resolver；session binding 不可变 | `composeFrom` 当作换岗机制 |
| 阶段交接 | team-gui handoff/run history | adapter 生成 ArtifactEnvelope 并检查 Acceptance | 直接传 handoff 文本 |
| 资产动作 | DSH typed tool/外部连接 | 只暴露 read/validate/emit/intent/receipt 类工具；Broker 执行 | 把凭据、写接口或 Service Identity 放入模型 scope |
| UI 卡片 | Host tool view / presentation tool | 工具返回展示意图，服务端补事实 | 由模型直接伪造权威看板 |

## 7. Access 与服务端强制点

默认角色工具视图采用 deny-by-default。静态 prompt 只能帮助模型理解边界，不能替代
服务端拒绝。建议的强制点如下：

| 强制点 | 必须拒绝的情况 | 证据 |
| --- | --- | --- |
| Resolver | ID 不匹配、Bundle/hash 漂移、目标版本未知、Skill 缺失 | `HOLD` + resolver audit |
| Skill scope | 非白名单 Skill、空 source、无法读取正文、文件开关冲突 | 注册失败或 model-off |
| team-gui adapter | dynamic planner、adaptive selection、模型驱动 dispatch、递归再委派 | 固定 execution plan + negative test |
| Artifact gate | 输入未验收、scope 不匹配、过期、跨 Case 未绑定 correlation/artifact 证据 | `REWORK_REQUIRED`/`FROZEN` |
| Policy Gate | 未声明 action、目标越界、参数不符合策略、幂等键不可重算 | `DENY` 或 `HOLD` |
| Execution Broker | 无 ALLOW、重复 key、回执不明、Service Identity 不可用 | 不执行或进入对账队列 |
| 数据平面 | 凭据、客户明细、任意 filesystem/shell 写入、直接平台写接口 | 工具不可见 + 宿主拒绝 |

当前 Magpie 的 `toolScope` 可以作为投影点，但不应被当成已闭合的企业服务端权限。
需要在 RP-M3/RP-M5 验证实际调用被拒绝、拒绝原因可审计，并证明没有通过 shell、workflow、
web、jobs 或 delegation 绕过 allowlist。

## 8. Unknown 与验证门

以下项目尚未达到可实施状态：

1. 企业目标 DSH 的实际产品身份、部署形态、Host 版本、插件版本和导入/导出接口；本机 Desktop、CLI 与 vendor pin 的版本不能互相替代。
2. `agent.cordis.yml` 在目标 Host 中可接受的角色级组合字段，以及是否存在官方扩展点保存 `preset_id`/Bundle ref。
3. `dsh-skill-subset` 在目标 profile 中的技能目录来源、生命周期、跨 session 隔离、缓存和失败冻结行为。
4. 外部 Resolver、Case Control、Artifact ledger、Policy Gate 和 Execution Broker 的部署、审计、幂等和恢复接口。
5. team-gui 是否能在不触发普通会话编排 hook 的情况下接收外部固定执行计划；现有 guaranteed mode 不能自动证明这一点。

RP-G1 只有在这些未知项被目标版本证据和用户批准的契约消除后才可通过。当前状态是
“设计可审阅、实现未授权、生产未授权”。

## 9. RP-M1 交付状态与下一步

| RP-M1 项目 | 状态 | 说明 |
| --- | --- | --- |
| 产品、版本、pin 和验证路径 | 已记录 | E-RP1 与平台能力矩阵；目标企业部署仍 Unknown |
| Skill loader 方案 | 源码证实、运行待验证 | 已记录白名单、hideOthers、source 和失败边界 |
| `role_assets`/hash/Bundle schema | Proposed | 本文件给出候选结构，待目标扩展点确认 |
| Case/Artifact/Action adapter schema | Proposed | 明确为模型外契约，不映射成原生 team-gui 字段 |
| 工具 allowlist 与服务端拒绝 | Proposed | 需 RP-M3 实际宿主/插件负向测试 |

下一步按原注入计划执行：

- RP-M2：在 Magpie 代码实施前，先让本项目源材料、manifest 和验证器 schema 通过评审；
- RP-M3：以 50 个 Blueprint 生成角色级工具视图，验证默认拒绝和 Action Intent-only；
- RP-M4：实现或接入 Resolver、Case Control 和 Artifact adapter 的隔离 spike；
- RP-M5：把上述证据转成静态/动态/回放门禁，先覆盖四个代表岗位；
- 未完成 RP-G1 前，不生成貌似可导入的配置，不连接 Shopify/Amazon 或其他业务资产。

## 10. 本轮非目标

- 不修改 Magpie-Horch 任何源码、配置、vendor pin、profile 或派生 preset。
- 不删除或回滚当前 `~/.dsh/.agent-presets/`；该派生目录按 D-054 暂时保留，但不是新角色资产已注入的证明。
- 不创建 Shopify App、连接器、Case、订单、商品、广告、库存或其他业务写入动作。
- 不把设计状态写成 Draft/Shadow/Limited/Production 的运行实例，也不把方案评审当成人员裁撤批准。
