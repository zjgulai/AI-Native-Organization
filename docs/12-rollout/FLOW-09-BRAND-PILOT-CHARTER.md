# FLOW-09 品牌资产经营首个Case试点章程

状态：v1 设计章程，`PRE_PILOT / DESIGN_ONLY`。本文不授权任何业务动作、生产连接、Case实例化、数据访问、预算或对外动作；所有数据源接入状态、指标阈值与范围边界均为待验证设计基线。与[BVS-01试点章程](BVS-01-SHOPIFY-DTC-PILOT-CHARTER.md)并列：BVS-01验证FLOW-01的GMV战术闭环，本章程验证FLOW-09的品牌资产经营闭环。

## 1. 试点任务

验证一张 FLOW-09 / SCN-002 Case 能否完成：

`品牌信号触发 → 范围建单 → 上下文装配 → 证据诊断 → 机会判断包 → Assurance门禁 → NoActionRecord → 基线核对`

具体实例：**「Momcozy 美国站可穿戴式吸奶品类·Amazon 与独立站覆盖缺口诊断」**——用 SKL-BRAND-01（覆盖审计）+ SKL-BRAND-04（细分假设）产出第一份品牌资产基线，回答 synthesis 页的诊断假设：三位一体覆盖是否均衡、Amazon 与 DTC 的数据资产差距、心智/渠道细分候选是否成立。

主岗位固定为 AGT-029「立言」。Case Control 只运行一个 Case Agent 并固定一份 AGT-029 Role Release Bundle；AGT-006/007 等以 Worker 身份提供 ArtifactEnvelope。

## 2. 范围

| 维度 | 设计范围 | 未来实例化前仍需确认 |
| --- | --- | --- |
| 品牌/市场/品类 | Momcozy / 美国 / 可穿戴式吸奶器品类 | 品类口径与竞品集合清单（版本化） |
| 渠道 | Amazon US + Shopify DTC + 主要社媒（TikTok/Meta/YouTube 待确认） | 各渠道数据接入状态与可用粒度 |
| 场景/价值流 | SCN-002 / FLOW-09 | Case Charter 兼容关系发布确认 |
| 时间窗 | 最近 90 天信号 + 品牌基线快照 | 数据截止时间与口径版本 |
| 结果负责人 | AGT-029 立言 | AGT-029 Bundle 版本与 Hash |
| 动作 | 只读诊断；产物为覆盖审计报告 + 细分假设包 | 全部外部动作走下游场景另行授权 |
| 指标 | 双层 KPI 字典 v1（docs/08-data/FLOW-09-DUAL-KPI-CATALOG.md） | L2 指标数据源可得性与代理降级方案 |
| 预算 | 诊断 Case 本身零外部花费 | 如需付费数据源/调研，另走预算 Case |

## 3. 产品方案工作流

| 步骤 | 能力 | 输入 | 输出 | 完成条件 |
| --- | --- | --- | --- | --- |
| P1 信号汇聚 | 渠道经营信号、VOC、评论、搜索词、社媒声量 | 各源只读快照与数据契约 | `Signal Set` | 每条信号可追溯来源、时间窗与口径 |
| P2 覆盖审计 | SKL-BRAND-01：三位一体矩阵 + 数据资产卡 | Signal Set、渠道清单、品类渗透输入 | `coverage_audit_report` | 矩阵每格有证据或显式未知；可触达判定经 Amazon 现实校验 |
| P3 细分假设 | SKL-BRAND-04：心智/地域/渠道三维可证伪假设 | VOC 证据、竞品密度、覆盖缺口 | `segmentation_hypothesis_pack` | 每条假设含证据阈值与证伪条件 |
| P4 机会判断包 | AGT-029 组织诊断：机会点、证据强度、下游移交建议 | 两份 Skill 产物 + 品牌定义/理想版本 | `Decision Package` | 每条结论三级标注（实测/书中报告/假设） |
| P5 门禁与核对 | Assurance 硬校验 + AGT-005 语义复核 + Policy Gate | Decision Package | `Assurance Decision` + `NoActionRecord` | 无资产动作；口径冲突冻结而非取平均 |

## 4. 分工协作工作流

| 交接 | 主责 | 按需贡献 | 独立保障 | 标准产物与接收条件 |
| --- | --- | --- | --- | --- |
| C1 范围与口径 | AGT-029 | AGT-045、AGT-003 | AGT-050 检查数据边界 | `Case Charter` + `Scope Manifest`；渠道/品类/时间窗唯一 |
| C2 证据供给 | AGT-006、AGT-007 | AGT-021/022（Amazon 侧）、AGT-023（独立站侧）、AGT-028/033（社媒侧） | AGT-044 检查 PII 最小化、AGT-046 数据质量 | `Evidence Pack`；来源/版本/新鲜度/缺口逐项标记 |
| C3 诊断与判断 | AGT-029 | AGT-035（实验可行性）、AGT-041（预算约束提示） | AGT-005 复核推断边界 | `Growth Diagnosis` + `Decision Package`；每项结论有反证与冻结范围 |
| C4 门禁与关闭 | AGT-029 | AGT-005 | Policy Gate + Assurance Gate | `NoActionRecord` + `Case Closure`；学习提取异步触发 |

## 5. 八阶段运行映射

| 阶段 | 本 Case 责任 | 必须留下的记录 |
| --- | --- | --- |
| STG-01 | 接收品牌节奏/信号触发（例行规划或异常信号） | `Signal Envelope` |
| STG-02 | 固定 FLOW-09、SCN-002、AGT-029、市场/品类/渠道范围 | `Case Charter`、去重键与 Acceptance |
| STG-03 | 固定 AGT-029 Bundle；装载 SKL-BRAND-01/04 与只读工具 | `Context Manifest`；缺 Bundle 则 Waiting |
| STG-04 | AGT-006/007 供证，AGT-029 形成诊断 | `Evidence Pack`、`Diagnosis Record` |
| STG-05 | 覆盖审计报告 + 细分假设包 + 机会判断 | `Decision Package`（三 Skill 产物 schema 齐备） |
| STG-06 | 确定性校验 + AGT-005 复核（重点：书中数据误用、可触达误判、推断越界） | `Assurance Decision` |
| STG-07 | 预期 `NoActionRecord`；下游建议仅以 Action Intent 移交 | `NoActionRecord` 或 Intent+Policy Decision |
| STG-08 | 核对产物完整性与成本；假设清单进入跟踪 | `Case Closure` + 学习提取触发 |

## 6. 50 岗位 MECE 分区（本 Case）

1. **运行主人格（1）**：AGT-029。
2. **业务 Skill 贡献（12）**：AGT-003、006、007、021、022、023、028、033、035、041、045、048（048 仅治理候选，不装配为执行者）。
3. **能力与独立保障（7）**：AGT-005、044、046、047、049、050 及 AGT-002（编排制度）。
4. **本 Case 未装配（30）**：其余岗位；投放执行（AGT-032）、CRM（AGT-034）、社区（AGT-039）等只在下游 Case 装配。

总数 `1 + 12 + 7 + 30 = 50`。未装配不代表岗位删除。

## 7. 数据入口与硬缺口

- **已知可用（设计假设，待核实）**：Shopify 侧订单/流量/商品数据（对接 BVS-01 数据契约）、社媒公开监听、广告平台报表（若已有账号）。
- **硬缺口（必须在实例化前解决或显式降级）**：
  - Amazon 卖家后台数据导出权限与品牌分析模块可用性——决定 L2 指标代理方案；
  - 品牌认知/考虑度调研预算——无则 L2 仅用代理指标并标注置信度；
  - 竞品集合清单与监控频率——需 AGT-007 建立版本化清单；
  - 各渠道「可触达」能力核实——Amazon 买家身份原则上不可触达，CRM 类假设自动降级。
- 缺口不阻塞诊断 Case 启动，但每个缺口必须在产物中记为 `data_gap` 并影响证据等级。
- 逐项核实工具见 [FLOW-09 试点数据可得性核实清单](FLOW-09-PILOT-DATA-READINESS-CHECKLIST.md)：含公开可观察基线（渠道/社媒/品类宽度新发现）、四项硬缺口的访谈问题表、新增发现项 N1–N4 与降级联动规则。

## 8. 验收与停止条件

- **产物验收**：覆盖矩阵每格有证据或「未知」；每条细分假设可证伪；量化表述三级来源标注完整；局限声明随产物流转。
- **经营指标**：证据完备率、假设被下游 Case 引用率、单位诊断成本（对照人工洞察基线）。
- **停止条件**：核心数据源不可用且无法降级；品类口径无法统一；发现输入数据系统性错误（移交 SCN-020）；连续两轮证据补齐仍不达最小输入合同。
- **不得做**：不发布内容、不调预算、不改 Listing/商品、不触达客户、不把诊断结论表述为已验证事实。

## 9. 与既有资产的衔接

- 方法论：[品牌增长方法论](../06-playbooks/BRAND-GROWTH-METHODOLOGY.md)、[SKL-BRAND-01](../06-playbooks/skills/SKL-BRAND-01.md)、[SKL-BRAND-04](../06-playbooks/skills/SKL-BRAND-04.md)；
- 场景规格：[SCN-002](../03-scenarios/SCN-002.md)；
- 指标口径：[FLOW-09 双层 KPI 指标字典](../08-data/FLOW-09-DUAL-KPI-CATALOG.md)；
- 治理边界：D-020~D-029 Case/授权/执行约束不变；本 Case 预期走 `NoActionRecord` 路径。
