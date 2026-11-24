# FLOW-09 品牌诊断服务身份与读取范围设计

状态：v1 设计契约（2026-11-24）。服务于[FLOW-09 数据契约](FLOW-09-DATA-CONTRACT.md)五源数据集的 PILOT-G1 分源验收；配套[阶段门评审](../12-rollout/FLOW-09-PILOT-GATE-REVIEW.md) G1 缺口第 2 项。本文不包含凭据、不授权任何访问、连接、API 调用、名单导出或数据写入；全部身份与范围均为 `DESIGN_ONLY`，实例化须逐源通过 G1A/G1B 验收。

核心设计判断：**FLOW-09 首个诊断 Case 全部走导出/快照路径，不需要任何新的 API 服务身份**。与 BVS-01（需 Dev Dashboard App + Scope + Token Broker）不同，本 Case 的「服务身份」是**提取操作身份 + 范围包 + 证据链**，而非可编程连接器身份。未来若任一源升级为 API 只读接入，须另立连接器登记契约与 Scope 包版本。

## 1. 三类身份模型

| 身份类 | 定义 | 本 Case 范围 |
| --- | --- | --- |
| `EXPORT_OPERATOR` | 具备源系统导出权限的操作身份（人工或既有工具账号），产出脱敏快照 | 五源全部使用；每源绑定一个范围包版本 |
| `SERVICE_IDENTITY` | 可编程 API 只读身份（App/Service Account/Token） | **首期不需要**；列入开放项，升级时另案 |
| `MODEL_SURFACE` | Case Agent/模型可见的数据面 | 仅允许契约数据集的聚合行 + evidence_ref；原始导出文件、操作身份、凭据一律不可见 |

模型永不接触：导出文件原文、操作账号凭据、客户/买家级字段、Scope 配置细节。模型只见 `channel_id + period + dataset + aggregates + snapshot_hash + data_grade`。

## 2. 五源范围包（Scope Packs）

每源一个版本化范围包，命名 `FLOW09_<SRC>_V1`。范围包定义「允许读什么、禁读什么、以什么粒度交付」。

### 2.1 `FLOW09_DTC_ANALYTICS_V1`（Shopify DTC）

| 面 | 允许 | 拒绝 |
| --- | --- | --- |
| 身份 | Admin 后台导出操作身份（人工或既有自动化账号） | 不新建 App；不申请 `read_reports`/`read_customers` Scope |
| 数据集 | `dtc_traffic_source_daily`、`dtc_product_performance`、`dtc_customer_cohort_agg`、`dtc_onsite_search`、`dtc_email_engagement` | 订单行明细、客户名单、单客户旅程 |
| 字段边界 | 聚合计数/比率/金额（保留币种）；`dtc_customer_cohort_agg` 仅 new/returning 计数与 repeat_rate | customer email/姓名/电话/地址/订单号/GID；`customerJourneySummary`；PII 任何形态 |
| 粒度/时效 | 日或周粒度；提取时记录 `extracted_at` 与报表时间窗 | 不接受无时间戳的快照 |
| 快照要求 | CSV/导出文件 → 受控对象存储；仓库只留 `snapshot_hash + 字段字典 + 脱敏样例` | 原始文件不进仓库/Site/Prompt |

**注意**：BVS-01 的 `SHOPIFY_BVS01_READ_V1` Scope 包（5 项只读 Scope）**不适用于本包**——它服务 SKU 选择的订单事实，本包服务品牌分析的聚合事实，两者字段集、PCD 等级、保留政策均不同。若未来 DTC 侧升级 API 只读接入（如 `read_analytics`/`read_reports`），须新建独立 Scope 包并重新决策，不能复用 BVS-01 包或在其上扩字段。

### 2.2 `FLOW09_AMZ_BRAND_ANALYTICS_V1`（Amazon US）

| 面 | 允许 | 拒绝 |
| --- | --- | --- |
| 身份 | Seller Central 导出操作身份（Brand Registry 账号持有者或授权运营） | 不申请 SP-API（无只读入口，F-021/N4）；不用第三方估算冒充官方报表 |
| 数据集 | `amz_detail_page_traffic`、`amz_search_query_perf`、`amz_market_basket`、`amz_repeat_purchase`、`amz_category_bs` | 买家评论原文批量导出（VOC 另走合规渠道）、订单买家信息 |
| 字段边界 | ASIN/搜索词/品类节点 × 周粒度的 sessions、share、rate、rank、volume | 买家 ID、订单号、地址、支付信息 |
| 粒度/时效 | **周粒度，Brand Analytics 滞后 2–3 周**——契约禁止日粒度假设 | 滞后未标注的数据不得进当期结论 |
| 快照要求 | 每报表一份快照；记录账号别名（脱敏）、报表名、导出时间、行数、hash | 多账号场景逐账号快照，不混合未标注 |

### 2.3 `FLOW09_SOCIAL_METRICS_V1`（社交媒体）

| 面 | 允许 | 拒绝 |
| --- | --- | --- |
| 身份 | 各平台原生分析导出操作身份 + 社媒监听工具订阅账号（若有） | 不申请平台 Marketing API 私信/受众导出；不抓取用户隐私数据 |
| 数据集 | `soc_account_metrics`、`soc_mention_sov`、`soc_top_content` | 粉丝/用户个体列表、私信内容、评论用户身份 |
| 字段边界 | 账号级聚合指标（followers/reach/engagement/posts）；mention volume/sentiment_proxy/SOV_proxy；帖子级表现指标 | 用户 handle 列表、评论原文批量、DM 内容 |
| 粒度/时效 | 账号×平台×周；帖子级按发布后 7/30 天窗口 | 评论情感分析仅方向性，置信度 low |
| 快照要求 | 每平台每账号一份；平台账号清单需唯一映射（同名多号即 HOLD） | 跨平台指标不混算（各平台口径不同） |

**触达边界**：F-048 确认运营允许主动触达，但本 Case 不执行任何触达；触达类动作若未来发生，须另立 Access Contract 声明平台 API 限制与内容合规边界。

### 2.4 `FLOW09_DME_AGG_V1`（DME/保险渠道）

| 面 | 允许 | 拒绝 |
| --- | --- | --- |
| 身份 | 产品线系统导出操作身份（数据权属=产品线，F-049） | 不直接访问 Aeroflow/Edgepark 系统；不导出买家邮箱名单 |
| 数据集 | `dme_order_agg`、`dme_channel_mix`、`dme_overlap_agg` | 买家邮箱/姓名/保险会员号/理赔明细 |
| 字段边界 | 产品线×周期的 orders/units/revenue 聚合、保险核销占比、与 DTC 重叠率（聚合） | 任何可识别个人的字段；名单级数据 |
| 粒度/时效 | 产品线×周期（周/月待产品线口径确认） | 口径未确认前标 `unknown` 不进结论 |
| 快照要求 | 产品线书面确认数据权属+导出方式（API/人工）后生效；本 Case 仅聚合 | 权属证明缺失即该源整体 HOLD |

### 2.5 `FLOW09_COMP_MONITOR_V1`（竞品监控工具）

| 面 | 允许 | 拒绝 |
| --- | --- | --- |
| 身份 | 既有订阅工具账号（Keepa/卖家精灵/Jungle Scout/数字酋长，F-046） | 不新购工具；不超订阅条款的抓取频率 |
| 数据集 | `comp_price_bsr`、`comp_keyword_rank`、`comp_listing_snapshot` | 工具账号凭据、账单信息、非竞品集对象 |
| 字段边界 | 竞品 ASIN/关键词 × 周的 price/bsr/rating/review_count/rank/search_volume | 竞品卖家后台数据、非公开字段 |
| 粒度/时效 | ASIN/关键词×周；listing 快照建议周频 | 工具间同指标冲突时记录差异不取平均（DQ-F09-10） |
| 快照要求 | 竞品集版本化引用（v1=F-046 七类）；每工具导出注明工具名+版本+提取时间 | 无竞品集版本引用的 SOV/密度计算拒绝（DQ-F09-08） |

## 3. 跨源统一规则

1. **快照即证据**：每次提取产出 `snapshot_id + snapshot_hash + extracted_at + operator_ref + scope_pack_version`；模型面只见这些引用与聚合行。
2. **范围漂移即 HOLD**：实际导出字段超出范围包允许集 → 该源该次快照作废重导，不得「先收下再过滤」。
3. **多源不一致不取平均**：同指标跨源差异记录口径原因，分列展示（DQ-F09-10）。
4. **新鲜度分级**：`fresh`（当期窗内）/`stale`（超窗）/`lagged`（Amazon 类生来滞后）；stale 数据不进当期结论。
5. **撤权即冻结**：任一源操作身份权限被撤/工具订阅到期 → 该源标 `unavailable`，依赖它的诊断分支冻结，其余源继续。
6. **升级路径**：任一源未来需要 API 只读接入 → 另立连接器登记契约（参照 SHOPIFY-READONLY-CONNECTOR-REGISTRATION 体例）+ 新 Scope 包版本 + 独立授权；不得在本设计上叠加。

## 4. 激活条件（进 G1A/G1B 前必须具备）

| # | 条件 | 验证方式 |
| --- | --- | --- |
| A1 | 五源范围包逐源确认（本文 §2 各表） | 企业侧书面确认或评审签字 |
| A2 | 每源首份脱敏导出样例 + 字段字典 | 对照数据契约 §3 数据集逐字段核对 |
| A3 | `snapshot_hash` 生成与受控存储路径确认 | 存储不在仓库/Site；hash 可复算 |
| A4 | PII 排除在导出环节前置（不是下游过滤） | 抽样检查导出文件无客户/买家级字段 |
| A5 | Amazon 滞后与周粒度在快照元数据中显式标注 | 抽样检查 |
| A6 | DME 数据权属书面确认（产品线） | 协议/邮件证据 |
| A7 | 社媒触达边界书面化（本 Case 不触达，但边界须声明） | 合规确认 |

## 5. 开放项

1. Shopify：是否需要 `read_reports` 类 Scope 的 API 化评估（当前人工导出够用，升级另案）；
2. Amazon：多账号场景下账号别名清单与各账号报表可用性差异；
3. 社媒：各平台账号唯一映射清单（同名多号处理规则）；
4. DME：产品线导出方式（API/人工）与口径确认；
5. 竞品工具：四工具字段覆盖盘点结果回填；
6. 全部源：首份真实导出样例（脱敏）回填数据契约 §9 开放项。

## 6. 边界声明

本文定义「谁能以什么范围读什么」，不定义「现在就读」。所有 EXPORT_OPERATOR 身份的实际授权、导出执行、文件存储与模型面开放，均须在 PILOT-G1 分源验收通过后按对应范围包逐项激活。本仓库不保存任何导出文件、账号信息或凭据。
