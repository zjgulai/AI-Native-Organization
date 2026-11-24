# FLOW-09 试点阶段门评审记录

状态：v1 设计评审记录（2026-11-24）。本文是[试点章程](FLOW-09-BRAND-PILOT-CHARTER.md)§8 阶段门在 FLOW-09 首个 Case 上的逐项核对结果；**不是实例化授权、不是数据访问许可、不是运行时部署**。阶段门定义沿用[实施章程](IMPLEMENTATION-CHARTER.md) PILOT-G0~G4。

评审对象：[FLOW-09-PILOT-CASE-CONTEXT-MANIFEST.json](FLOW-09-PILOT-CASE-CONTEXT-MANIFEST.json)（装配基线）+ [数据可得性核实清单](FLOW-09-PILOT-DATA-READINESS-CHECKLIST.md)（F-041~F-049 企业确认）。

## 1. 与 BVS-01 试点的门差异

BVS-01 验证 FLOW-01 的 GMV 战术闭环（Shopify 写路径+SKU 选择），本 Case 验证 FLOW-09 的品牌资产经营闭环（多渠道只读诊断）。差异：

- **预期动作路径不同**：本 Case 设计上就是 `NoActionRecord`——PILOT-G3（有限自主动作）对本 Case 不适用；下游若产生 Action Intent，另开 Case 重新走门。
- **数据源更多元**：BVS-01 只读 Shopify 一个源；本 Case 跨 Amazon/Shopify/社媒/DME 四源，G1 需按源拆分验收（参照 G1A/G1B 分层先例）。
- **品牌资产指标无硬基线**：L2 走代理指标且置信度 low（F-043），G2 验收不要求 L2 水平值，只要求代理口径一致与局限声明齐备。

## 2. 逐门核对

### PILOT-G0 范围与环境 —— 部分通过（PARTIAL）

| 判据 | 状态 | 证据 |
| --- | --- | --- |
| 业务范围（品牌/市场/品类/时间窗） | ✅ | 章程 §2 + Manifest business_scope；品类边界 F-044 锁定吸奶器主品类 |
| AI 结果负责人 | ✅ | AGT-029 立言，Manifest role_assembly 固定 |
| 指标口径 | ✅ | 双层 KPI 字典 v1；L2 代理降级规则 F-043 |
| 约束与动作边界 | ✅ | Manifest authorization 14 项全 false；预期 NoActionRecord |
| 数据源清单与可得性 | ✅ | 四渠道状态经 F-041~F-049 企业确认 |
| 目标 Harness 事实 | ❌ | AGT-029 Release Bundle 版本/Hash 未固定；DSH Preset 装配状态未核实 |
| 工具能力登记册 | ⚠️ | 竞品监控 4 工具已确认订阅（F-046）但字段覆盖未盘点；Amazon 报表导出路径确认但无数据契约文档；社媒/DME 无契约 |

**缺口**：AGT-029 Bundle 固定、FLOW-09 工具能力登记册（四源各自的字段/频率/权限清单）。

### PILOT-G1 受控读取 —— 未就绪（NOT READY，关键路径）

| 判据 | 状态 | 证据/缺口 |
| --- | --- | --- |
| 数据契约 | ⚠️ | BVS-01 Shopify 数据契约存在但面向 FLOW-01 SKU 选择（30 天窗口/gross_sales），**不覆盖 FLOW-09 品牌诊断所需字段**（流量来源、搜索词、品类基线、社媒声量）；Amazon/社媒/DME 三源无契约文档 |
| 服务身份范围 | ❌ | FLOW-09 读取尚无 Service Identity/Scope 定义；BVS-01 的 SHOPIFY_BVS01_READ_V1 scope bundle 不适用于本 Case 的多源读取 |
| 工单/产物记录 | ✅ | 八阶段产物协议已定义（Manifest eight_stage_protocol） |
| 跨范围拒绝验证 | ❌ | 无运行时，未验证 |

**G1 拆分建议**（沿用 G1A/G1B 先例）：

- **PILOT-G1A 自有渠道事实**：Shopify DTC（订单/流量/商品/客户名单规模）+ 社媒公开数据 + DME 名单（经产品线）
- **PILOT-G1B 平台与第三方事实**：Amazon 报表导出（Business Reports/Brand Analytics）+ 竞品监控工具数据（Keepa/卖家精灵/Jungle Scout/数字酋长）

G1A 通过 ≠ G1B 通过；本诊断 Case 缺 G1B 时仍可产出「自有渠道覆盖诊断」，但 Amazon 侧证据只能标 `manual_snapshot` 级。

### PILOT-G2 影子闭环 —— 阻塞（BLOCKED by G1）

通过条件：同一真实信号下八阶段产物可回放、全部 NO_ACTION、无越权/PII/口径冲突。本 Case 无运行时，待 G1 数据契约与身份范围就位后方可影子运行。

### PILOT-G3 有限自主动作 —— 不适用（N/A）

本 Case 设计产物为 NoActionRecord；若诊断建议立项验证实验，仅输出 Action Intent 移交下游场景 Case（如 SCN-011/013），由下游 Case 重新走门。

### PILOT-G4 扩展决定 —— 未到（FUTURE）

需 G2 通过后以真实经营证据评估。

## 3. 关键路径（G0 收尾 → G1 就绪）

1. **AGT-029 Release Bundle 固定**：版本、Hash、Skill 挂载清单（SKL-BRAND-01/04 contract.json 引用已备）。
2. **FLOW-09 数据契约 v1**：按四源分别定义数据集、字段、时间窗、口径、质量状态与 PII 边界；Shopify 源可复用 BVS-01 契约的口径纪律但字段集不同，需扩展而非复用。
3. **Service Identity 与 Scope**：每源只读身份范围；Amazon 走人工导出不涉 API scope；社媒/DME 明确名单获取方式。
4. **工具能力登记册**：四源字段覆盖盘点（Amazon 报表字段、4 个竞品工具覆盖、社媒 API 状态、Shopify customer 读数）。
5. **跨范围拒绝验证设计**：影子运行前的拒绝用例清单（参考 BVS-01 SHP-DC-01~12 先例）。

## 4. Waiting / Frozen 条件（本 Case 特有）

- AGT-029 Bundle 未固定 → STG-03 Waiting（Manifest 已标注）。
- 任一数据源契约缺失且诊断依赖该源 → 对应证据格标 `unknown`，不得推断填充。
- L2 代理指标口径未由 AGT-045 定义 → 品牌资产结论只给方向不给水平。
- 社媒触达边界未书面确认 → 社媒只算可分析（即使 F-048 已确认允许主动触达，Access Contract 层仍需显式声明）。
- Amazon 买家触达假设出现 → 立即冻结该分支（预设不可触达）。

## 5. 评审结论

| 门 | 结论 | 说明 |
| --- | --- | --- |
| G0 | **PARTIAL** | 范围/负责人/指标/约束/数据源就绪；Harness 事实与工具登记册待补 |
| G1 | **NOT READY** | 关键路径：FLOW-09 数据契约 + Service Identity + 工具盘点 |
| G2 | BLOCKED | 待 G1 |
| G3 | N/A | 诊断 Case 无外部动作 |
| G4 | FUTURE | 待 G2 后真实证据 |

**建议下一步**：起草 `docs/08-data/FLOW-09-DATA-CONTRACT.md`（四源数据契约 v1）——这是 G1 的唯一实质缺口；其余 G0 缺项（Bundle 固定、工具盘点）可与契约起草并行。
