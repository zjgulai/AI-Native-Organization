# FLOW-09 权限语义声明 v0（主体/客体/条件/时效四元组）

状态：**v0 基线**（2026-11-24 用户逐条评审通过）。DESIGN_ONLY，不构成任何访问、连接、API 调用或数据授权；全部声明的激活以 [FLOW-09-SERVICE-IDENTITY-SCOPE](FLOW-09-SERVICE-IDENTITY-SCOPE.md) §4 激活条件 A1–A7 与 PILOT-G1 分源验收为前提。本声明是[FLOW-09-ONTOLOGY-PILOT](FLOW-09-ONTOLOGY-PILOT.md) §3-4 的第三项交付物：把身份与范围契约语义化为可引用的四元组（subject/object/condition/validity），供语义契约、Skill 契约与未来 Access Contract 对齐口径。

来源标注：【显】=SERVICE-IDENTITY-SCOPE/数据契约已定义；【推】=本声明归纳待评审。

## 1. 三类主体（subject）

| 主体 ID | 名称 | 定义 | 本试点角色 |
| --- | --- | --- | --- |
| S-OP | EXPORT_OPERATOR 导出操作身份 | 具备源系统导出权限的操作身份（人工或既有工具账号），产出脱敏快照 | 五源全部使用；每源绑定一个范围包版本 |
| S-SI | SERVICE_IDENTITY 可编程 API 只读身份 | App/Service Account/Token | **首期不需要**；升级时另立连接器登记契约+新 Scope 包版本+独立授权 |
| S-MS | MODEL_SURFACE 模型可见数据面 | Case Agent/模型可见的数据面 | 仅允许契约数据集聚合行+evidence_ref；原始导出、操作身份、凭据、客户/买家级字段一律不可见 |

模型永不接触：导出文件原文、操作账号凭据、客户/买家级字段、Scope 配置细节。模型只见 `channel_id + period + dataset + aggregates + snapshot_hash + data_grade`。【显·§1】

## 2. 读取侧四元组（五源范围包 × 主体）

四元组格式：`主体 —[动作]→ 客体｜条件｜时效`。动作枚举：`allow_read` / `deny`。

### 2.1 `FLOW09_DTC_ANALYTICS_V1`（Shopify DTC）

| # | 四元组 | 判定 |
| --- | --- | --- |
| P-01 | S-OP —allow_read→ `dtc_traffic_source_daily`/`dtc_product_performance`/`dtc_customer_cohort_agg`/`dtc_onsite_search`/`dtc_email_engagement`｜Admin 后台导出身份；PII 前置排除（非下游过滤）；聚合粒度（日/周）；不新建 App、不申请 read_reports/read_customers｜G1A 验收逐源激活；撤权即冻结 | allow |
| P-02 | S-MS —allow_read→ 同上数据集的**聚合行+evidence_ref**｜仅契约字段；customer email/姓名/电话/地址/订单号/GID、customerJourneySummary、PII 任何形态拒绝｜同 P-01 | allow（受限） |
| P-03 | S-SI —allow_read→ 任何 DTC API 对象｜首期无 API 身份；若未来升级须新建独立 Scope 包并重新决策，不得复用 BVS-01 的 `SHOPIFY_BVS01_READ_V1`（字段集/PCD/保留政策不同）｜升级另案 | deny（默认） |

### 2.2 `FLOW09_AMZ_BRAND_ANALYTICS_V1`（Amazon US）

| # | 四元组 | 判定 |
| --- | --- | --- |
| P-04 | S-OP —allow_read→ `amz_detail_page_traffic`/`amz_search_query_perf`/`amz_market_basket`/`amz_repeat_purchase`/`amz_category_bs`｜Seller Central 导出身份（Brand Registry 持有者/授权运营）；**周粒度+2–3 周滞后必须在快照元数据显式标注**；多账号逐账号快照不混合｜G1B 验收；滞后未标注数据不得进当期结论 | allow |
| P-05 | S-MS —allow_read→ 同上聚合行｜ASIN/搜索词/品类节点×周粒度 sessions/share/rate/rank/volume；买家 ID/订单号/地址/支付信息拒绝；买家评论原文批量导出走 VOC 合规渠道不在此包｜同 P-04 | allow（受限） |
| P-06 | S-SI —allow_read→ Amazon SP-API｜无只读入口（F-021/N4）；第三方估算不得冒充官方报表｜deny（默认） | deny |

### 2.3 `FLOW09_SOCIAL_METRICS_V1`（社交媒体）

| # | 四元组 | 判定 |
| --- | --- | --- |
| P-07 | S-OP —allow_read→ `soc_account_metrics`/`soc_mention_sov`/`soc_top_content`｜各平台原生分析导出身份+订阅工具账号；账号唯一映射（同名多号即 HOLD）；不申请 Marketing API 私信/受众导出、不抓用户隐私｜G1B；F-048 触达边界书面化（本 Case 不触达） | allow |
| P-08 | S-MS —allow_read→ 同上聚合行｜账号级聚合指标+mention volume/sentiment_proxy/SOV_proxy；用户 handle 列表/评论原文批量/DM 内容拒绝；评论情感仅方向性置信度 low；跨平台指标不混算｜同 P-07 | allow（受限） |
| P-09 | S-OP —allow_read→ 任何触达类动作（私信/受众触达）｜本 Case 不执行任何触达；未来触达须另立 Access Contract 声明平台 API 限制与内容合规边界｜触达动作独立授权 | deny |

### 2.4 `FLOW09_DME_AGG_V1`（DME/保险渠道）

| # | 四元组 | 判定 |
| --- | --- | --- |
| P-10 | S-OP —allow_read→ `dme_order_agg`/`dme_channel_mix`/`dme_overlap_agg`｜产品线系统导出身份（数据权属=产品线，F-049）；**权属书面确认前整体 HOLD**；不直接访问 Aeroflow/Edgepark 系统；口径未确认标 unknown 不进结论｜G1B+A6 权属证据 | allow（条件门） |
| P-11 | S-MS —allow_read→ 同上聚合行｜产品线×周期 orders/units/revenue、保险核销占比、与 DTC 重叠率（聚合）；买家邮箱/姓名/保险会员号/理赔明细/名单级数据拒绝｜同 P-10 | allow（受限） |

### 2.5 `FLOW09_COMP_MONITOR_V1`（竞品监控工具）

| # | 四元组 | 判定 |
| --- | --- | --- |
| P-12 | S-OP —allow_read→ `comp_price_bsr`/`comp_keyword_rank`/`comp_listing_snapshot`｜既有订阅工具账号（Keepa/卖家精灵/Jungle Scout/数字酋长，F-046）；不新购工具、不超订阅条款频率；工具名+版本+提取时间必记｜G1B；工具间同指标冲突记录差异不取平均（DQ-F09-10） | allow |
| P-13 | S-MS —allow_read→ 同上聚合行｜竞品 ASIN/关键词×周 price/bsr/rating/review_count/rank/search_volume；工具账号凭据/账单信息/非竞品集对象拒绝；**无 competitor_set_version 引用的 SOV/密度计算拒绝**（DQ-F09-08）｜同 P-12 | allow（受限） |

## 3. 跨源统一规则的语义化

以下五条把 SERVICE-IDENTITY-SCOPE §3 的规则转写为可被语义契约引用的条件语义：

| # | 规则 | 语义化表达 | 违反处置 |
| --- | --- | --- | --- |
| P-14 | 快照即证据 | 一切 MetricFact 必须可回溯 `snapshot_id+snapshot_hash+extracted_at+operator_ref+scope_pack_version` 五元组 | 无法回放即拒绝进入证据包（DQ-F09-01） |
| P-15 | 范围漂移即 HOLD | 实际导出字段超出范围包允许集 | 该源该次快照作废重导；不得「先收下再过滤」 |
| P-16 | 多源不一致不取平均 | 同指标跨源差异记录口径原因分列展示 | 禁止取平均消除冲突（DQ-F09-10） |
| P-17 | 新鲜度分级 | `fresh`（当期窗内）/`stale`（超窗）/`lagged`（Amazon 类生来滞后） | stale 数据不进当期结论 |
| P-18 | 撤权即冻结 | 任一源操作身份权限被撤/工具订阅到期 | 该源标 `unavailable`，依赖它的诊断分支冻结，其余源继续 |

## 4. 动作侧四元组（写/外发边界）

读取侧之外，本试点涉及的动作权限（来自 AGT-029/SCN-002 契约类4/6）：

| # | 四元组 | 判定 |
| --- | --- | --- |
| P-19 | AGT-029/Case Agent —allow→ 只读访问契约数据源+产出结构化产物+Action Intent｜deny：直接执行资产变更、触达客户、发布内容 | allow（只读+Intent） |
| P-20 | 外发/对外动作 —allow→ 已审批内容+已批准外发策略**双条件同时满足**｜批准主体=策略治理链（AGT-002/模型外 Case Control），立言自身无批准权；时限【数】 | 条件门 |
| P-21 | 「重大品牌承诺/危机表态/对外发布」—allow→ 逐对象审批，不得批量放行｜缺策略时默认冻结，超时未决按冻结处理 | 条件门 |
| P-22 | SCN-002 Case —deny→ 发布内容/调整预算/改商品/触达客户｜外部动作仅以 Action Intent 移交下游场景 Case（SCN-011/013 等） | deny |
| P-23 | 授权位（各类资产动作独立开关）—allow→ 当前全部 `false`｜翻转需独立评审，不因路线图/本声明自动生效；高风险动作逐对象审批 | deny（默认） |
| P-24 | 未在 Access Contract 声明的 动作/对象/金额/频率/范围 —allow→ 默认拒绝 | deny（默认） |

## 5. 与既有机制的接口

| 机制 | 接口关系 |
| --- | --- |
| Access Contract（D-022 五份契约之一） | P-19~24 的动作边界是其语义化表达；Access Contract 实例化时逐条对照本表 |
| 授权位/Policy Gate（D-029） | P-23 授权位=false 是 Policy Gate 判定的语义前提；ALLOW/HOLD/DENY/NO_ACTION 枚举不变 |
| Execution Broker + Service Identity | S-SI 升级路径（P-03/06）触发时须另立连接器登记契约+新 Scope 包版本，本表届时升版 |
| Case Charter（D-025） | 读取范围以 Charter 声明的品牌/市场/渠道账号/商品集合/时间窗为界（契约类6-23） |
| DQ-F09 十规则 | P-14~18 是 DQ-F09-01/08/09/10 的语义层表述，口径冲突以数据契约为准 |

## 6. 待评审要点

1. **P-03/06 的 deny 默认**是否符合预期——首期确实无 API 身份，但 deny 语义化后是否会阻碍未来评估？（升级路径已写明另案，不阻塞）
2. **P-09 触达 deny**与 F-048「运营允许主动触达」的关系：本声明限定在「本 Case 不触达」，未来触达动作另立 Access Contract——边界表述是否准确？
3. **P-20 双条件**中「已批准外发策略」的批准主体指代（AGT-002/模型外 Case Control）在真人 HITL 设计确定后需复审（与 AGT-029 契约评审记录一致）；
4. **P-21 时限【数】**为 pending_data，G1 回填；
5. 四元组 JSON 实例见 `semantic-permission-v0.json`，是否需要补充 `scope_pack_version` 字段使其可直接被机器校验？

## 7. 边界声明

- 本声明**不授权任何访问**：S-OP 的实际授权、导出执行、文件存储与模型面开放均须 PILOT-G1 分源验收通过后按对应范围包逐项激活；
- 本仓库不保存任何导出文件、账号信息或凭据；
- 评审已通过（2026-11-24 用户逐条评审），状态为 v0 基线；FLOW-09-SERVICE-IDENTITY-SCOPE 已加语义声明引用指针。

## 评审记录

- 2026-11-24：用户逐条评审通过，升 v0 基线。确认项：S-SI deny 默认不阻塞升级路径、P-09 触达边界（本 Case 不触达/未来另立 Access Contract）、P-20 批准主体指代沿用契约口径、四元组 JSON 实例结构均无误。
- 后续维护：P-20 批准时限 pending_data 待 G1 回填；批准主体「策略治理链」指代在真人 HITL 设计确定后复审；S-SI 升级触发时本表升版并另立连接器登记契约。
