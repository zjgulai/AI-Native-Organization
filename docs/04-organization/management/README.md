# 管理层资产目录（决策权平面）

状态：设计完成；MGT-Q1、MGT-Q2、MGT-Q3 已由 D-065（2026-09-19）关闭，仍待决者为 MGT-Q5。当前没有管理岗位被实例化，`production_authorized=false`。

结构版本：v2为3岗位结构（CEO + 增长官 + 治理官）。v1曾为9岗位结构（1个CEO + 8个CXO），于2026-09-18按用户决定改为v2。变更理由与代价见[管理层设计](../MANAGEMENT-LAYER.md)§11。

| 资产 | 位置 | 数量 |
| --- | --- | --- |
| 管理层主设计 | [MANAGEMENT-LAYER.md](../MANAGEMENT-LAYER.md) | 1 |
| 决策权阶梯 | [DECISION-RIGHTS.md](DECISION-RIGHTS.md) | 1 |
| 决定生效机制 | [ENFORCEMENT.md](ENFORCEMENT.md) | 1 |
| 影子验证设计 | [SHADOW-VERIFICATION.md](SHADOW-VERIFICATION.md) | 1 |
| 当前冻结验证语料 | [eval/management-eval-corpus.v2.json](eval/management-eval-corpus.v2.json) | v2语料25用例（L-A 12 / L-B 13，L2b 2）；Hash已冻结 |
| `MGT-EVAL-B` 执行台账 | [eval/runs/2026-09-18-MGT-EVAL-B/RUN-LOG.md](eval/runs/2026-09-18-MGT-EVAL-B/RUN-LOG.md) | **已执行（2026-09-18），未通过**：阶梯归属一致率4/6=66.7%（阈值100%）；L2b识别2/2=100%；确定性子集因判分能力不足未独立评估。详见§5.1 |
| v1语料（追溯记录） | [eval/management-eval-corpus.v1.json](eval/management-eval-corpus.v1.json) | v1语料19用例（`superseded_by_v2_structure`，不得作为当前证据） |
| 决定依据 | [ADR-0014](../../adr/0014-management-decision-rights-plane.md) | 1 |
| 结构化目录 | [management-catalog.json](management-catalog.json) | 3个岗位 |
| 管理岗位档案 | [roles/](roles/) | 3 |
| Soul Contract | [souls/](souls/) | 3 |
| Role Playbook | [playbooks/](playbooks/) | 3 |
| Preset Blueprint | [preset-blueprints/manifest.json](preset-blueprints/manifest.json) | 3 |
| 外部证据调研 | [AI-NATIVE-ORG-MANAGEMENT-LAYER.md](../../14-research/AI-NATIVE-ORG-MANAGEMENT-LAYER.md) | 1 |

## 3个管理岗位

| ID | 分身 | 岗位 | 管理域 | 覆盖岗位数 |
| --- | --- | --- | --- | --- |
| MGT-001 | 天時 | 首席执行官 CEO | 全局组合 | 2（增长官、治理官） |
| MGT-002 | 地利 | 首席增长官 CGO | 渠道·品牌·增长·服务·履约·产品 | 38 |
| MGT-003 | 人和 | 首席治理官 CGOv | 财务·合规·质量·账号·数据与AI平台 | 12 |

两个管理域的覆盖岗位并集等于 `AGT-001` 至 `AGT-050` 全集（38 + 12 = 50），**无遗漏、无重复归属**（v1曾有5个岗位双线归属，v2降为0）。唯一需要特别说明的是 **AGT-005 内控审计与独立复核**：它在覆盖上属治理域（故计入治理域的12），但其复核结论与冻结权**不向治理官汇报**，直达CEO与真人所有者（见下"承重机制"）。

## 三条不可违反的边界

1. **不进入Case执行链**：管理层不作为任何Case的Lead或Worker；D-057的External Case Control仍是唯一编排责任方。
2. **不与岗位发生会话**：管理层的权力只通过版本化契约（MDC/GOC）与资源配额生效；任何"二级负责人向下派活"的实现方案都违反ADR-0014。
3. **不持有资产能力**：无可写入工具、无Service Identity、无Action Intent能力；可见面限于只读聚合视图，窄于任一执行岗位。

## v2的承重机制（合并引入，不可省）

把8个CXO合并为2个，制造了一个v1不存在的失效模式：**治理官同时是评估尺子的作者、维护者与被评估者**。三条处置缺一不可，详见[生效机制](ENFORCEMENT.md)§5A（MGT-G8）：

1. 指标口径冻结权归AGT-005+外部复核，治理官只有提案权。
2. 涉及治理官自身评估尺度的争议走**L2b真人所有者**，不经CEO（[决策权阶梯](DECISION-RIGHTS.md)§1.1）。
3. AGT-005复核结论直达CEO与真人所有者，**不向治理官汇报**。

## 待确认清单

> 2026-11-03 核对：MGT-Q1/Q2/Q3 已由 D-065 关闭，下表保留删除线作为历史记录。

| 编号 | 事项 |
| --- | --- |
| ~~MGT-Q1~~ | 已由D-065关闭：MGT命名空间正式采用（preset `mgt-001~003`），AGT-001~050编号不变 |
| ~~MGT-Q2~~ | 已由D-065关闭：MDC/GOC正式成为第六类契约 |
| ~~MGT-Q3~~ | 已由D-065关闭：Action Intent策略模板提案权维持不授予 |
| ~~MGT-Q4~~ | v1的横切事件状态权已由按类型队列分派替代，不再有横切岗位 |
| MGT-Q5 | **是否设「单一通用管理Agent」对照臂**（即`MGT-EVAL-R0`结构必要性门）。**仍未决**：门已设计，对照臂本身未获授权。勿与「全部3岗位同时先验」混淆——后者已定（v1的三岗位子集已无意义） |
| ~~MGT-G3~~ | 已由D-061确认：MDC采用最小schema，超出GOC范围即拒绝不截断 |
| ~~MGT-G4~~ | 已由D-061确认：控制边界强制追溯且fail-closed，同步呈报不等待批准 |
| ~~MGT-G6~~ | 已由D-061确认：不允许抢占，需要中断时走战略停止通道 |
| ~~MGT-G7~~ | v2已定：AGT-005+外部复核并用；自涉争议走L2b |
| MGT-G8 | 3岗结构下评估者同一化的三条处置是否接受；L2b频次是否设为复审触发指标 |
| MGT-G9 | 是否为"增长官申请重新排程"增设形式化通道（建议不加） |

## 使用方式

- 需要判断"某件事该谁定"：查[决策权阶梯](DECISION-RIGHTS.md)。
- 需要判断"某个岗位为什么存在"：查[管理层设计](../MANAGEMENT-LAYER.md)§2与§4。
- 需要判断"某个岗位能不能被撤掉"：查[管理层设计](../MANAGEMENT-LAYER.md)§10的反证指标与`MGT_REVIEW`条件。
- 需要判断"这个决定靠什么生效"：查[生效机制](ENFORCEMENT.md)。
