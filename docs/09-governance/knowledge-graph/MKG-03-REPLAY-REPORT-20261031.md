---
title: MKG-03 岗位上下文包回放报告
doc_type: architecture
module: project-memory
topic: memory-and-knowledge-graph
status: stable
created: 2026-10-31
updated: 2026-10-31
owner: self
source: human+ai
---

# MKG-03 岗位上下文包回放报告

日期：2026-10-31
票据：MKG-03
装配器：`scripts/role-context-bundle.mjs`
Schema：`docs/09-governance/knowledge-graph/role-context-bundle.schema.json`

## 结果

| 岗位 | 类型 | 状态 | 缺失字段 | validate |
|---|---|---|---|---|
| AGT-001 衡远 | ProjectRole / PLN-MGT / DOM-01 经营与组织 | COMPLETE | 0 | PASS |
| AGT-023 | ProjectRole | COMPLETE | 0 | PASS |
| AGT-005 | ProjectRole | COMPLETE | 0 | PASS |
| AGT-048 | ProjectRole | COMPLETE | 0 | PASS |
| MGT-003 人和 | ManagementRole / PLN-EXC | COMPLETE | 0 | PASS |

5/5 COMPLETE，0 推断补齐，0 schema 违规。

## 关键发现

### 1. MGT 与 AGT 是两套资产目录，不能互相推断
首轮装配 MGT-003 返回 INCOMPLETE，缺四份资产引用。真实原因是装配器按 AGT 目录拼路径：
- AGT：`docs/05-agents/roles/`、`roles/souls/`、`docs/06-playbooks/role-playbooks/`、`docs/10-platform/deepseek-harness/preset-blueprints/`
- MGT：`docs/04-organization/management/` 下 `roles/`、`souls/`、`playbooks/`、`preset-blueprints/`

这不是数据缺失，是装配规则缺陷。已按 `^MGT-\d{3}$` 分流修正。**这正是 MKG-03 要证明的事**：装配器能在源头暴露"看起来像缺数据、实际是规则错"的问题，而不是让下游 Agent 自己猜路径。

### 2. 五契约引用全部是未解析占位
50 个岗位 × 5 = 250 条 `required_ref` 在 `agent-management-graph.json` 中无对应契约文件。装配器原样输出 `{type, ref: null, resolved: false}`，不伪造路径。这与方案 §5.7 第 1 条一致：不建 250 个悬空节点。

### 3. MGT 明确无 Case 角色
MGT-003 bundle 的 `case_role` 为 `null`（schema 强制），`coverage_role_ids` 为 12 个真实 AGT ID。这使 ADR-0014 的"管理层不进入 Case 执行链"在数据层可验证，而不只是文档声明。

## 消费价值判断（止损条件 §9.3）

判据：bundle 是否比手工拼边界更快、更不易错。

**成立**。理由：
- 装配一个岗位的完整边界需读 5 个文件（role-catalog、organization-graph、management-catalog 或 preset、overlay、四份资产存在性）；手工平均 6-8 次读取。
- 装配器单次调用 <100ms，输出 20 个必填字段 + 4 份资产路径 + 5 条契约引用 + 覆盖层相关纠错。
- 首轮即暴露一处真实规则缺陷（MGT 路径），手工流程不会主动发现。

**未达成的部分**：`eligible_flows`/`eligible_scenarios` 目前直接来自 role-catalog，未与 collaboration-graph 的 64 条 flow-stage / 51 条 flow-scenario 绑定交叉校验。这是 MKG-03 之外的范围，留给 Phase 1 前的可选增强。

## 结论

MKG-03 通过。Phase 0 的停止条件（任一 bundle 缺 3 个以上必填字段 → 停止）未触发。
可以进入是否授权 Phase 1 的判断，但本轮不进入。

## 补充：flow/scenario 交叉校验（2026-10-31 追加）

### 校验规则

以 `collaboration-graph.json` 的 `flow_scenario_bindings`（51 条）为**白名单**，不用叉积做约束。四条断言：

1. `eligible_flows` 中每个 ID 必须存在于 `collaboration-graph.flows`（8 条）
2. `eligible_scenarios` 中每个 ID 必须存在于 `collaboration-graph.scenarios`（20 条）
3. 每个 eligible flow 必须有完整 8 阶 `flow_stage_bindings`（64 条覆盖 8×8）
4. 岗位的 `flow × scenario` 叉积中，**至少 1 对**落在白名单内，否则该岗位无法组成任何 Case

### 为什么不用叉积做约束

`role-catalog.json` 里每个岗位同时声明 flows 和 scenarios，若要求叉积全命中，50 个岗位会缺 225 对。
叉积不是业务规则——真约束是「一张 Case 只绑定一条主价值流和一个主场景」（D-025/ADR-0007），
合法配对由 `flow_scenario_bindings` 白名单决定。把叉积当约束会造出 225 条假缺陷。

### 全 50 岗位结果

| 状态 | 数量 | 含义 |
|---|---:|---|
| PASS | 39 | 无告警 |
| PASS_WITH_WARNINGS | 11 | 有可用配对，但声明面存在值得注意的形态 |
| FAIL | 0 | 无 |

**0 个岗位 FAIL，0 个非法引用，0 个阶段缺失。**

### 两类告警（真实信号，非缺陷）

| 告警 | 岗位 | 含义 |
|---|---|---|
| 仅 1 对合法配对 | AGT-004, AGT-015, AGT-032, AGT-046, AGT-047 | 这些岗位能参与的 Case 组合极窄，容量设计需注意 |
| 叉积全部命中白名单 | AGT-003, AGT-011, AGT-013, AGT-022, AGT-037, AGT-040 | 声明的每个 flow×scenario 组合都合法，可能过度声明了资质范围 |

### 附带修正

初版「叉积全部命中」告警对 1×1 的岗位也会触发（叉积=1 必然全命中），属启发式缺陷。
已改为仅当叉积 ≥4 时才告警，误报从 20 个降到 6 个。
