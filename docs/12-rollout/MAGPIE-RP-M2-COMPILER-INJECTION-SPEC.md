# RP-M2：50 个岗位 Preset 同源注入规格与实施结果

状态：材料注入与静态验证已完成；目标 Host loader、实际导入和批量原子替换待 RP-M3/RP-M4。  
日期：2026-09-17。  
前置：RP-M1 已完成只读证据与候选 adapter schema；D-053 至 D-060 已确认。

本文件回答“50 份 Soul、50 份 Role Playbook、50 份 Preset Blueprint 如何进入现有
生成链”的问题，并记录本轮已获授权的实施结果。目标是让一次 compiler 运行能从 AI
组织项目重建 50 个岗位，而不是让工程师逐目录复制 Prompt。

本轮实际改动限定为 Magpie-Horch 的 `scripts/role-presets/generate.mjs`、
`verify-lossless.mjs` 和 `README.md`；实际 `~/.dsh/.agent-presets/agt-001..agt-050`
已重生成。临时输出与默认输出均通过 L1–L12（5106 条断言），连续重生成逐字节一致；
篡改 `agt-001` Soul 快照的反向探针按预期失败。目标 DSH Host 的岗位 Skill loader、导入
schema、真实 mount、Policy Gate/Execution Broker 和业务系统连接未被触碰。

## 1. 通过标准与不通过标准

RP-M2 只有同时满足以下条件，才允许在 Magpie-Horch 中实施：

| 通过标准 | 证据 |
| --- | --- |
| 50 个 role ID、Soul、Role Playbook、Blueprint 一一对应 | 源索引、文件集合和 Blueprint `role_id` 全等 |
| 每个岗位的四类新资产都可追溯 | 原始字节 SHA-256、源 revision、generator revision、依赖版本 |
| Persona 只常驻身份/灵魂/停止信号摘要 | Persona 负向断言：不含完整 Playbook 正文，除非显式启用回退模式 |
| 完整 Playbook 有可寻址的岗位 Skill 入口 | Skill 名称、正文来源、`source`、版本和加载失败状态可回放 |
| Bundle 版本不可变 | 内容变化生成新版本和新 hash；旧 Case 引用不被原地替换 |
| Access 与 Blueprint 一致 | 角色可见工具类别、deny 集合和 Action Intent-only 断言一致 |
| `PRODUCT_MOUNTS={}` 保持为空 | 生成器和出货检查均通过 |
| 生成幂等且失败关闭 | 同一输入二次运行字节一致；缺件、错 ID、hash 漂移直接非零 |

以下情况不算通过：旧版 L1–L10 全绿、目录数量正确、`systemPrompt` 已替换、UI 能显示
角色名称，或本机 preset 能 mount 但没有新资产和 Bundle 证据。

## 2. 当前源材料闭合基线

2026-09-17 在 AI 组织项目执行的只读检查结果：

```text
Role Catalog             50
Soul Contract files      50
Role Playbook files      50
Preset Blueprint files   50
Role Playbook index       50
Blueprint manifest       50
ID sets equal             true
Blueprint status          all blueprint_only_not_importable
production_authorized     all false
external_case_control     all true
peer_chat                 all false
re_delegation             all false
```

权威路径如下：

| 资产 | 源路径 | 识别键 |
| --- | --- | --- |
| Role Profile | `docs/05-agents/roles/AGT-NNN.md` 与 `docs/05-agents/role-catalog.json` | `AGT-NNN` |
| Soul Contract | `docs/05-agents/roles/souls/AGT-NNN.soul.md` | `AGT-NNN` |
| Role Playbook | `docs/06-playbooks/role-playbooks/AGT-NNN.md` | `AGT-NNN` |
| Playbook index | `docs/06-playbooks/role-playbooks/index.json` | `role_id` |
| Preset Blueprint | `docs/10-platform/deepseek-harness/preset-blueprints/AGT-NNN.json` | `role_id` / `preset_id` |
| Blueprint index | `docs/10-platform/deepseek-harness/preset-blueprints/manifest.json` | `role_id` |
| 旧共享来源 | 组织图、管理图、生命周期、协作图、流程、共享 Playbook、ROSTER | 旧 manifest material |

源事实归属在 AI 组织变革项目；Magpie 只读、编译和校验。生成目录继续是
`~/.dsh/.agent-presets/` 的派生输出，不回写仓库。

## 3. Compiler 输入与确定性流程

### 3.1 输入快照

每次构建先建立不可变输入快照：

```text
source_root
source_revision
generator_revision
generator_rules_revision
dsh_runtime_pin
role_catalog_hash
soul_index_hash
playbook_index_hash
blueprint_manifest_hash
shared_source_hashes
```

`source_revision` 优先来自 AI 组织仓库 commit；工作树没有 commit 的情况下必须记录
显式快照标识，不得继续使用固定日期伪装成当前版本。`generator_revision` 使用
Magpie 生成器源码 hash；`dsh_runtime_pin` 取已核实的 vendor/runtime 证据。任一
值缺失时，构建可以生成诊断但不得写入出货目录。

### 3.2 每角色编译顺序

```text
load role catalog
  → resolve role card / soul / playbook / blueprint
  → validate ID, refs, status and five contracts
  → calculate raw and canonical hashes
  → derive persona soul summary
  → derive role-playbook Skill descriptor
  → derive Role Release Bundle reference
  → project Blueprint to manifest extension
  → project verified tool rows (RP-M3)
  → render official preset metadata and Cordis composition
  → write to temporary directory
  → read back and verify
  → atomic replace derived preset directory
```

任何输入解析、ID、边界或哈希校验失败都不得进入派生输出。当前实现先在内存完成 50 个
岗位的全部构建，再进入派生目录写盘；这已覆盖材料级失败关闭。完整的 staging 目录、
批量 I/O 原子替换和 resolver 事务仍留在 RP-M3/RP-M4 的 Host 适配门，不把当前实现
描述成已完成的生产级原子发布。角色级工具行与 Case adapter 同样留在 RP-M3/RP-M4。

### 3.3 角色匹配规则

对每个 `AGT-NNN` 必须验证：

1. `role-catalog.id == soul.role_id == playbook.role_id == blueprint.role_id`；
2. `blueprint.preset_id` 与目标目录 `agt-nnn` 的本地映射固定且唯一；
3. Blueprint 的 `identity` 与 Role Profile 的 alias/title/mission/principle 相符；
4. Blueprint 的 `modes`、`prompt_layers`、`tools`、`access`、`assurance` 字段完整；
5. Playbook index、Blueprint manifest、Soul index 中的引用路径均可读取；
6. 所有资产状态仍为设计期，`production_authorized=false`；
7. 跨角色引用只能来自静态图谱或已验收 Artifact，不得产生运行时互聊边。

## 4. 输出结构规格

### 4.1 `preset.yml`

继续只写目标 DSH 官方元数据及 Magpie 已被源码证明可消费的展示字段。角色身份、
Bundle、权限和业务控制不能塞入该文件。是否保留现有 Magpie 展示扩展字段，必须以
目标版本的实际读取证据为准；未核实字段只进入扩展 manifest，不进入官方 metadata。

### 4.2 `manifest.json`

保留旧 `material` 和 `x_lute` 命名空间，在独立命名空间增加新资产投影：

```json
{
  "format": "dsh-preset",
  "sourceDshVersion": "<verified-pin>",
  "source_snapshot": {
    "source_root": "<ai-org-root>",
    "source_revision": "<revision>",
    "generator_revision": "<hash>",
    "dependency_versions": {"dsh": "<version>"},
    "source_hashes": {
      "role_card": "sha256:<hex>",
      "soul_contract": "sha256:<hex>",
      "role_playbook": "sha256:<hex>",
      "preset_blueprint": "sha256:<hex>"
    }
  },
  "role_assets": {
    "role_id": "AGT-001",
    "preset_id": "agt-001",
    "soul": {
      "ref": "docs/05-agents/roles/souls/AGT-001.soul.md",
      "sha256": "<hex>",
      "persona_summary_sha256": "<hex>"
    },
    "role_playbook": {
      "ref": "docs/06-playbooks/role-playbooks/AGT-001.md",
      "sha256": "<hex>",
      "skill_id": "role-playbook-agt-001",
      "loader": "target-host-to-be-verified"
    },
    "preset_blueprint": {
      "ref": "docs/10-platform/deepseek-harness/preset-blueprints/AGT-001.json",
      "sha256": "<hex>",
      "version": "1.0.0-design"
    },
    "role_release_bundle_ref": {
      "bundle_id": "RRB-AGT-001",
      "version": "<immutable-version>",
      "content_hash": "sha256:<hex>",
      "status": "blueprint_only_not_importable"
    }
  }
}
```

这段 JSON 是候选扩展结构，不是现在可直接导入 DSH 的 schema。实际实施时必须先
由目标 Host 的 schema/adapter 验证器接受；否则只允许在 AI 组织项目中保存设计样例。

### 4.3 `agent.cordis.yml`

目标组合按五层上下文顺序投影：

```text
immutable policy/tool contracts
→ workspace-stable glossary and bundle ref
→ role-stable identity/soul summary
→ case-stable charter/access/accepted artifacts
→ turn-dynamic signal/receipts/current attempt
```

Persona 常驻内容只包含：

- alias、role ID、使命和组织平面；
- Soul 的灵魂原则及其可检验表现；
- 停止信号、Action Intent-only、凭据不可见和不自由互聊；
- 当前版本和“设计期、未生产授权”声明。

完整 Role Playbook 不直接复制进 persona。它以岗位专属 Skill descriptor 暴露名称、
描述、正文 ref、版本和 hash；目标 loader 读取 `SKILL.md` 正文。loader 未验证前，
不得把 `role_playbook_ref` 当成已加载；受控内嵌只能由 D-055 的回退门单独开启。

## 5. Playbook Skill 装配规格

### 5.1 岗位 Skill 命名

建议稳定 slug：`role-playbook-agt-nnn`。名称只表达可寻址资源，不代表权限或行政
关系。Skill 正文的 frontmatter 至少必须能被当前 `dsh-skill-subset` 解析：

```yaml
---
name: role-playbook-agt-001
description: AGT-001 的独立 Role Playbook；按岗位任务需要读取。
user-invocable: false
---
<Role Playbook 正文>
```

`source` 不能留空。编译器必须在注册前检查 `SKILL.md` 可读、名称合法、正文 hash
与 manifest 一致；失败时让该岗位进入 HOLD，不注册一个“看得见但调用即炸”的 Skill。

### 5.2 源目录与派生目录边界

- AI 组织仓库保存 Role Playbook 原文、Skill 规则、索引和 hash；
- Magpie 仓库保存 compiler、验证器和 schema，不保存 50 个生成目录；
- profile/skills 运行目录若需要 `SKILL.md`，由受控构建步骤派生并记录输入 hash；
- profile 外部产品包不进入 `agt-*` 出货组合，`PRODUCT_MOUNTS` 继续为空；
- 任一岗位只装配自己的岗位 Skill 加上 Blueprint 允许的共享 Skill，`hideOthers=true`。

## 6. 生成器改动边界（后续获准后）

RP-M2 需要触及的 Magpie 文件限定为：

| 文件 | 目标改动 | 不做什么 |
| --- | --- | --- |
| `scripts/role-presets/generate.mjs` | 扩展 source inventory、角色资产解析、hash、persona 摘要、manifest `role_assets`、岗位 Skill descriptor | 不手写 50 个目录；不烘焙外部产品；不伪造 DSH 未知字段 |
| `scripts/role-presets/verify-lossless.mjs` | 增加 Soul/Playbook/Blueprint/Bundle 引用闭合与负向断言 | 不用旧 L1–L10 全绿替代新门禁 |
| `scripts/role-presets/README.md` | 更新输入、输出、回退和重建说明 | 不把派生目录写成事实源 |
| 受批准的新 schema/fixture 文件 | 固定扩展 manifest 和 adapter contract 的结构测试 | 不将候选 schema 宣称为官方 DSH schema |

不在 RP-M2 修改：team-gui 业务编排、Policy Gate、Execution Broker、Shopify/Amazon
连接器、服务身份、生产 profile 和业务写权限；这些属于 RP-M3/RP-M4 及另行授权范围。

## 7. 验证任务清单

### 静态验证

- [ ] 50/50 role ID、Soul、Playbook、Blueprint 和 index 引用闭合。
- [ ] 所有原始字节 hash、规范化 hash、源 revision 和 generator revision 可重算。
- [ ] Persona 含 Soul 摘要、停止信号和 Action Intent-only；完整正文只出现在岗位 Skill 或明确回退。
- [ ] 每个岗位的 Skill 名称合法、`SKILL.md` 有 frontmatter、`source` 非空、正文 hash 一致。
- [ ] manifest 新命名空间与旧 `material`/`x_lute` 分离，未覆盖或删除旧来源。
- [ ] 所有 Blueprint 仍为 `blueprint_only_not_importable` 且生产授权为 false。
- [ ] `PRODUCT_MOUNTS` 为空，外部 profile 依赖没有进入出货 preset。

### 行为验证

- [ ] 同一源快照连续生成两次，50 个目录输出逐字节一致。
- [ ] 删除任一 Soul、Playbook、Blueprint 或改变一字节时，生成器非零退出且不发布半成品。
- [ ] 修改 Bundle 内容生成新 bundle hash；旧 session/Case 引用保持原值。
- [ ] Skill loader 失败、空 source、错误 frontmatter 和路径不可达均产生 HOLD/审计事件。
- [ ] 使用单独 session mount 不同角色时，persona、Skill 和 Bundle 不串线。

### 与 RP-M3/RP-M4 的连接验证

- [ ] Blueprint `visible_classes` 与实际工具 scope 一致；未经验证的 concrete tool 不进入组合。
- [ ] resolver 只接受 `preset_id + immutable Role Release Bundle`，不接受 name/systemPrompt 映射。
- [ ] Case Control 传入固定 Lead/Worker/Stage/Artifact；team-gui 不启动 planner/adaptive 路由。
- [ ] handoff 只有经 Acceptance 的 ArtifactEnvelope 才可作为下游输入。

## 8. 运行与发布门

RP-M2 实施前需保存以下证据包：

```text
RP-M2-input-snapshot.json
RP-M2-generator-diff.patch
RP-M2-static-validation.json
RP-M2-output-hash-manifest.json
RP-M2-negative-cases.json
```

证据包保存于批准的构建记录，不把凭据、客户数据或完整运行会话写入仓库。只有
静态验证、读回验证和隔离 mount 都通过，才可进入 RP-M3；通过 RP-M2 仍不等于
Shadow、Limited 或 Production。

## 9. 当前结论

AI 组织项目的 50 份角色资产已经闭合，且 Magpie-Horch 已按本规格完成 source inventory、
manifest、persona/Skill 入口和验证器扩展。当前 50 个派生 preset 已写入
`role_assets` 与 `source_snapshot`，Persona 只常驻身份和 Soul 四段摘要，完整岗位卡、
Soul、Role Playbook、Blueprint 和 Bundle 证据可按 hash 回放。岗位 Skill descriptor 明确
`loader=target-host-to-be-verified`、`installed=false`，因此仍不能宣称岗位 Playbook 已
被目标 Host 加载或可直接导入。

本文件的 RP-M2 代码写入已由用户本轮授权并完成；本文件不授权 DSH 配置导入、业务系统
连接或任何经营动作。后续 Host 适配和生产动作仍需单独授权。
