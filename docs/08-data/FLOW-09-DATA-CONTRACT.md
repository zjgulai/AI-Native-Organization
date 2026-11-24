# FLOW-09 品牌资产经营数据契约（四源只读诊断基线）

状态：v1 设计契约（2026-11-24）。服务于[FLOW-09 首个 Case 试点章程](../12-rollout/FLOW-09-BRAND-PILOT-CHARTER.md)（Amazon vs DTC 覆盖缺口诊断）与[装配 Manifest](../12-rollout/FLOW-09-PILOT-CASE-CONTEXT-MANIFEST.json)；配套[服务身份与 Scope 设计](FLOW-09-SERVICE-IDENTITY-SCOPE.md)定义五源 EXPORT_OPERATOR 范围包。本文不包含凭据、客户明细或报表原文，不授权任何数据访问、连接、API 调用、名单导出或对外动作；全部数据源接入仍为 `DESIGN_ONLY`，实例化须经 PILOT-G1 分源验收（见[阶段门评审](../12-rollout/FLOW-09-PILOT-GATE-REVIEW.md)）。

与 [BVS-01 Shopify 契约](BVS-01-SHOPIFY-DTC-DATA-CONTRACT.md) / [BVS-01 Amazon 契约](BVS-01-AMAZON-US-DATA-CONTRACT.md) 的关系：两份 BVS-01 契约面向 FLOW-01 的订单/GMV 事实（SKU 级、30 天窗口、`gross_sales`）；本契约面向 FLOW-09 的**品牌资产诊断事实**（渠道×品类×周期粒度、90 天信号窗+基线快照、可分析/可触达分级）。字段集不同，不复用其 Scope 包与 Query 模板，但复用其口径纪律（来源分级、缺失不补零、PII 最小化、证据包）。

## 1. 已确认范围

| 项目 | 当前值 | 状态 |
| --- | --- | --- |
| 品牌/市场 | Momcozy / 美国 | 已确认（F-041） |
| 品类边界 | 可穿戴式吸奶器主品类；配件/内衣=associated_sales 不混算 | 已确认（F-044） |
| 时间窗 | 信号窗 90 天 + 品牌资产基线快照 | 设计值；数据截止日待实例化固定 |
| 诊断目标 | 三位一体覆盖矩阵 + 渠道数据资产卡 + 细分假设 | 章程 §3 P2/P3 |
| 动作边界 | 只读诊断，预期 `NoActionRecord` | 已确认 |
| 指标框架 | 双层 KPI 字典 v1；L2 代理指标 low 置信度 | 已确认（F-043） |
| 数据获取方式 | 全部为导出/快照路径，无 API 写入；API 只读接入另案 | 设计值 |

## 2. 闭环定义

`品牌信号与渠道事实（四源+竞品工具）→ SKL-BRAND-01 覆盖审计 → SKL-BRAND-04 细分假设 → AGT-029 机会判断包 → Assurance → NoActionRecord → 基线核对`

完成条件是形成可回放的证据包与三级标注（实测/书中报告/假设）的诊断产物；不以模型生成建议为完成，不把代理指标写成真实认知水平。

## 3. 数据源契约

### 3.1 Shopify DTC（momcozy.com，Shopify 原生 customer 体系）

资格：F-041/F-045 确认。可分析 ✅ / 可触达 ✅（customer emails，名单规模待读数）。

| 数据集 | 粒度 | 必需字段 | 获取路径 | 状态 |
| --- | --- | --- | --- | --- |
| `dtc_traffic_source_daily` | 日期 × 来源/媒介 × 落地页 | sessions、orders、revenue、conversion_rate | Shopify Admin Analytics 导出（渠道/流量报告） | 字段待盘点 |
| `dtc_product_performance` | 产品/变体 × 周期 | views、add_to_cart、purchases、revenue | 商品报告/导出 | 字段待盘点 |
| `dtc_customer_cohort_agg` | 周期 × 新客/老客 | new_customers、returning_customers、repeat_rate | 客户报表**仅聚合计数**，禁取个体 | PCD 边界：只取计数不取明细 |
| `dtc_onsite_search` | 词 × 周期 | search_term、count | 站内搜索报告（若有） | 可得性待核实 |
| `dtc_email_engagement` | 活动 × 周期 | sends、open_rate、click_rate | 邮件工具报表（工具待确认） | 可得性待核实 |

注意：BVS-01 的 `SHOPIFY_BVS01_READ_V1` Scope 包排除 `read_reports`/`read_customers`，**不适用于本契约**；FLOW-09 Shopify 侧首期走 Admin 手工导出路径，API 只读接入（如需 `read_reports`/`read_analytics`）须另立 Scope 包版本与决定。`dtc_customer_cohort_agg` 只允许聚合计数；任何客户级字段（email/姓名/订单号）进入请求即拒绝。

### 3.2 Amazon US（Brand Registry + Business Reports + Brand Analytics 已开通）

资格：F-042/F-047 确认。可分析 ✅ / 可触达 ❌（买家身份不可触达，预设不变）。获取路径：Seller Central 手工导出（无 SP-API 只读入口，F-021/N4）。

| 数据集 | 粒度 | 必需字段 | 报表来源 | 状态 |
| --- | --- | --- | --- | --- |
| `amz_detail_page_traffic` | ASIN × 周 | sessions、page_views、unit_session%、revenue、units | Business Reports「Detail Page Sales and Traffic」 | 导出路径确认，字段待样例核实 |
| `amz_search_query_perf` | 搜索词 × 周 | query_volume、click_share、conversion_share | Brand Analytics「Search Query Performance」 | 模块开通确认，字段待样例核实 |
| `amz_market_basket` | ASIN 组合 × 周 | combine_rate、lift | Brand Analytics「Market Basket Analysis」 | 同上 |
| `amz_repeat_purchase` | 品类 × 周 | repeat_purchase_rate、repeat_sales_share | Brand Analytics「Repeat Purchase Behavior」 | 同上 |
| `amz_category_bs` | 品类节点 × 周 | BSR、类目排名 | 品类榜单导出/第三方 | 可得性待核实 |

Brand Analytics 多数报表为**周粒度、含 2–3 周滞后**；契约按周粒度设计，禁止用日粒度假设。缺 Brand Analytics 字段时降级记 `data_gap`，不用第三方估算冒充官方值。

### 3.3 社交媒体（Instagram / TikTok / YouTube / Facebook / LinkedIn）

资格：F-048 确认可主动触达（诊断 Case 不执行触达）。可分析 ✅ / 可触达 ✅（运营允许，Access Contract 另声明合规边界）。

| 数据集 | 粒度 | 必需字段 | 获取路径 | 状态 |
| --- | --- | --- | --- | --- |
| `soc_account_metrics` | 账号 × 平台 × 周 | followers、reach、engagement_rate、posts_count | 各平台原生分析导出 | 平台清单待确认（章程标 TikTok/Meta/YouTube 待确认） |
| `soc_mention_sov` | 周期 × 品牌/竞品集 | mention_volume、sentiment_proxy、SOV_proxy | 社媒监听工具/手工快照 | 工具待确认 |
| `soc_top_content` | 帖子 × 周期 | content_type、views、engagement、link_clicks | 原生分析导出 | 字段待盘点 |

SOV 代理口径：`品牌 mention_volume / (品牌+7 类竞品 mention_volume)`，分母版本化绑定竞品集 v1（F-046）。情感分析只作方向性参考，置信度 low。

### 3.4 DME/保险渠道（Aeroflow / Edgepark 等）

资格：F-049 确认数据归产品线、买家邮箱可获取。可分析 partial / 可触达 ✅（邮箱可获取，诊断 Case 不导出名单）。

| 数据集 | 粒度 | 必需字段 | 获取路径 | 状态 |
| --- | --- | --- | --- | --- |
| `dme_order_agg` | 产品线 × 周期 | orders、units、revenue（聚合） | 产品线系统导出 | 方式待核实（API/人工） |
| `dme_channel_mix` | 周期 | 保险核销占比、现金购买占比 | 产品线报表 | 口径待核实 |
| `dme_overlap_agg` | 周期 | 与 DTC 客户重叠率（聚合） | 产品线+Shopify 聚合对账 | 方法待设计 |

**PII 边界**：本 Case 只取聚合计数与占比；买家邮箱存在但不在诊断范围导出。任何名单级数据请求即拒绝。

### 3.5 竞品监控工具（Keepa / 卖家精灵 / Jungle Scout / 数字酋长）

资格：F-046 确认订阅存在。可分析 ✅。

| 数据集 | 粒度 | 必需字段 | 工具 | 状态 |
| --- | --- | --- | --- | --- |
| `comp_price_bsr` | 竞品 ASIN × 周 | price、bsr、rating、review_count | Keepa/Jungle Scout | 字段覆盖待盘点 |
| `comp_keyword_rank` | 关键词 × 竞品 × 周 | organic_rank、ad_rank、search_volume | 卖家精灵/数字酋长 | 字段覆盖待盘点 |
| `comp_listing_snapshot` | 竞品 ASIN × 快照 | title、bullet、image_count、a_plus | 各工具 | 频率待定（建议周） |

竞品集版本化：v1 = Willow/Elvie/Spectra/Medela/Lansinoh/Eufy/白牌聚合（F-046），维护责任建议 AGT-007；工具间数据冲突时记录差异不取平均。

## 4. 统一对象键与映射

所有数据集至少携带：`tenant_id`、`brand_id`、`market_id`、`category_id=wearable_breast_pump`、`channel_id`、`period_start/end`（ISO 周或自然日）、`source_system`、`snapshot_id`、`snapshot_hash`、`extracted_at`、`data_grade`（`measured`/`proxy`/`book_reported`/`hypothesis`）。

- `channel_id` 枚举：`amazon_us`、`dtc_shopify`、`social_ig`/`social_tt`/`social_yt`/`social_fb`/`social_li`、`dme_insurance`、`retail_target`/`retail_walmart`（首期标 unknown）。
- `competitor_set_version`：所有 SOV/密度计算必须引用版本化竞品集。
- ASIN/SKU/GID 各源主键保留原值；跨源映射（如 Amazon ASIN ↔ Shopify variant）只在映射已验证后写入，未验证标 `unmapped`。

## 5. 数据质量与冻结语义

| 规则 | 验收方式 | 失败处置 |
| --- | --- | --- |
| DQ-F09-01 来源身份 | 每个快照记录 source_system+snapshot_id+hash，可回放 | 无法回放即拒绝进入证据包 |
| DQ-F09-02 周期对齐 | 各源按 ISO 周或声明粒度对齐；Amazon 周粒度不插值为日 | 粒度不一致的指标分列展示不混算 |
| DQ-F09-03 缺失≠零 | 无数据记 `data_gap`+原因，不得解释为 0 | 推断填充即拒绝发布 |
| DQ-F09-04 币种完整 | 金额保留原币种与汇率来源；不静默换算 | 跨币种汇总禁止 |
| DQ-F09-05 PII 最小化 | 只允许聚合计数；客户/买家级字段一律拒绝 | 命中即丢弃整页并安全复核 |
| DQ-F09-06 代理标注 | 一切代理指标带 `proxy` grade 与置信度 | 漏标即退回 STG-04 补证 |
| DQ-F09-07 新鲜度 | 每源记录 extracted_at 与源滞后说明（Amazon 2–3 周） | 超窗数据标 stale 不进当期结论 |
| DQ-F09-08 竞品集版本 | SOV/密度计算绑定 competitor_set_version | 无版本引用即拒绝计算 |
| DQ-F09-09 触达分级 | 每渠道数据资产卡标 analyzable/reachable 并对照 F-045/048/049 | 与企业确认矛盾即冻结该格 |
| DQ-F09-10 跨源冲突 | 同指标多源不一致时记录差异与口径原因 | 禁止取平均消除冲突 |

## 6. 证据包要求

PILOT-G1 分源验收（G1A 自有渠道 / G1B 平台第三方）前，每源须提交：

1. 报表/导出样例（脱敏，含字段字典与截图）；
2. 时间窗与粒度说明（含 Amazon 滞后说明）；
3. 字段→数据集映射表与 PII 排除声明；
4. snapshot_hash 与提取时间；
5. 缺口清单（本契约「状态」列为待核实项的回填结果）；
6. 品类边界应用证明（associated_sales 已剔除）。

## 7. 首轮 Shadow 验收用例

| ID | 用例 | 通过条件 |
| --- | --- | --- |
| F09-DC-01 | Shopify 流量/商品/客户聚合三报表导出 | 字段齐全、周期对齐、无客户级字段 |
| F09-DC-02 | Amazon Business Reports + Brand Analytics 四报表导出 | 周粒度、字段与 §3.2 一致、滞后已标注 |
| F09-DC-03 | 社媒各平台原生分析导出 | 账号清单唯一、指标口径可追溯 |
| F09-DC-04 | DME 产品线聚合报表 | 仅聚合计数、权属=产品线有书面确认 |
| F09-DC-05 | 竞品工具四工具字段覆盖盘点 | 覆盖矩阵形成、冲突记录规则生效 |
| F09-DC-06 | 覆盖矩阵首版生成 | 每格有证据或显式 unknown；Amazon 格标不可触达 |
| F09-DC-07 | 注入缺失源（模拟 Amazon 报表缺周） | 记 data_gap，结论降级不推断 |
| F09-DC-08 | 注入客户级字段请求 | 工具层拒绝并留痕 |
| F09-DC-09 | SOV 计算引用旧版竞品集 | 检出版本不一致并拒绝 |
| F09-DC-10 | 全源重跑同一窗口 | 同 snapshot 产生同结果或可解释晚到差异 |

以上均未执行。真实导出样例与脱敏回放通过后才可逐项标记。

## 8. 责任与交接

| 责任 | 岗位/控制面 | 交付物 |
| --- | --- | --- |
| 数据契约维护 | AGT-045 同尺 | 本契约版本、字段字典、口径裁决 |
| 数据质量 | AGT-046 清源 | DQ-F09 逐项状态、冻结范围 |
| 连接/导出执行 | AGT-047 接桥（CVS-03/04） | 各源导出样例、snapshot_hash、证据包 |
| PII 与访问 | AGT-044 安界、AGT-050 门卫 | 聚合边界声明、越界拒绝证据 |
| 证据供给 | AGT-006/007（Worker） | Evidence Pack、Diagnosis Record |
| 结果负责 | AGT-029 立言 | Decision Package、Case Closure |
| 渠道事实解释 | AGT-021/022（Amazon）、AGT-023（DTC）、AGT-028/033（社媒） | 渠道侧口径说明与异常标注 |

## 9. 当前状态与开放项

**已具备**：四源资格与可触达分级（F-041~F-049）、品类边界（F-044）、竞品集 v1（F-046）、双层 KPI 口径（KPI 字典 v1）、Amazon 三层报表资格（F-042/F-047）。

**待实例化前补齐**（对应 Manifest open_items）：

1. Shopify：customer 名单规模/同意率读数、流量/搜索/邮件报表字段盘点、是否需要 `read_reports` 类 Scope 另案；
2. Amazon：卖家账号数、四报表实际导出字段/频率/历史深度样例、FBA/FBM 结构；
3. 社媒：平台账号清单确认、各平台 API/导出状态、触达合规边界书面化；
4. DME：名单与报表获取方式、规模、同意状态、保险核销口径；
5. 竞品工具：四工具字段覆盖盘点、Eufy 产品型号清单、监控频率；
6. AGT-045 完成 L2 代理指标口径定义（品牌词搜索/直接访问/社媒声量/SOV 代理）。

## 10. 边界声明

本契约是数据语义与质量基线，不是连接授权。任何真实导出、API 调用、名单获取或数据写入均须另行授权并经 Policy Gate/Execution Broker；本仓库不保存报表原文、客户明细、凭据或 Token。
