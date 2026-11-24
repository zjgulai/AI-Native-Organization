# G1P-04 数据导出指引

版本：v0.1 基线（2026-11-25 评审通过）。按平台列出各报表的**位置、粒度/时窗要求、注意事项**。菜单路径以各后台实际界面为准（平台 UI 会调整），报表名称为准。导出文件统一按 `G1P-05` 模板打包提交。

**通用要求**：
- 时间窗：诊断信号窗 90 天；建议尽量提供 ≥90 天历史（VOC/差评率基线、漏斗基线同此）；结算类 ≥2 个结算周期。
- 粒度：能到「日/周×对象」的给到该粒度；Amazon 品牌分析类天然周粒度+滞后 2–3 周。
- **不要导出**：客户/买家个人信息（邮箱、姓名、电话、地址、订单号明细、handle、评论用户 ID）。订单号仅在对账用途（B1-3）例外且限对账。
- 每份导出注明：报表名、导出时间、时间窗、账号别名（多账号时）、行数。

---

## 1. Shopify Admin（momcozy.com）

对应 `G1P-02` Part A1、B1-2/B1-4、B7-3、B8。

| 报表/数据 | 位置（参考） | 要求与注意 |
|---|---|---|
| 流量来源（sessions/orders/revenue by referrer/landing page） | Analytics → Reports → Sessions by referrer / Landing page | 日粒度，90 天+ |
| 商品表现（views/add_to_cart/purchases by product/variant） | Analytics → Reports → Sales by product variant 等 | 含加购指标的报表优先 |
| 新老客户聚合（new vs returning、repeat_rate） | Analytics → Reports → Customers / Sales over time | **只要聚合计数**；勿导出 Customers 名单 |
| 站内搜索词 | Analytics → Reports → Online Store search（视套餐） | 若无此报表注明「套餐不支持」 |
| 邮件互动（sends/open/click） | 邮件工具后台（Shopify Email/Klaviyo/其他） | 先确认用哪个工具（A1-6） |
| Payouts/财务 | Settings → Payments → Payouts；Finance 报表 | gross/net/费用/退款分列 |
| 退款/退货明细 | Orders → 导出（按时间窗） | 原因码+金额+时点；聚合优先 |
| 客户分层读数（RFM/生命周期） | Customers → Segments / 客户报表 | **只报分层人数与占比**；名单不出系统 |

## 2. Amazon Seller Central

对应 `G1P-02` Part A2、B1-1/B1-4、B2-1、B3-1~B3-3、B5-1/B5-2、B6-1、B8。

| 报表/数据 | 位置（参考） | 要求与注意 |
|---|---|---|
| Detail Page Sales and Traffic | Reports → Business Reports → Detail Page Sales and Traffic（按子体/ASIN） | Business Reports 历史较长；周粒度可接受 |
| Search Query Performance | Brand Analytics → 报表 | **周粒度、滞后 2–3 周**；导出注明滞后 |
| Market Basket Analysis | Brand Analytics | 同上 |
| Repeat Purchase Behavior | Brand Analytics | 同上 |
| Alternate Purchase Behavior（可选） | Brand Analytics | 若有一并提供 |
| 品类 BSR/排名 | 商品详情页/类目页可见；批量导出用第三方工具 | 注明获取方式 |
| Settlement Report（结算 vs payout、费用拆分、退款准备金） | Reports → Payments/Settlement | 结算周期粒度；≥2 个周期 |
| 交易明细（订单-结算勾稽用） | Reports → Payments → Transaction | 仅限对账用途，订单号字段保留 |
| 退款/退货原因 | Reports → Fulfillment/Returns；支付退款报表 | 原因码+金额+时点 |
| 库存（FBA 可售/在途/预留） | Inventory → Manage FBA Inventory / 库存报表 | 仓×ASIN 日快照 |
| 入库/签收/赔偿/退货 | 装运工作台 + Reports → Fulfillment | 批次级 |
| 账号健康（ODR/VPF/LSR、违规、申诉） | Performance → Account Health | 日/事件级；含申诉状态历史 |
| Advertising（SP/SB/SD 活动×广告组×日） | Advertising 控制台 → 报表 | 花费/销售额/ACOS 聚合 |
| 促销/优惠成本（coupon、秒杀、活动折扣） | Advertising/促销后台 + 订单报表关联 | 活动×SKU 台账 |
| **评价 VOC** | **平台无官方批量导出** | 见下方「VOC 获取说明」 |

**VOC 获取说明（B3-1）**：Amazon 评价原文无官方批量导出渠道。可选：①第三方 VOC/评价分析工具（如已订阅的监控工具是否含评价模块？请确认）；②Helium10/卖家精灵等工具的评价导出功能（需确认条款合规）；③人工抽样导出。请在 `G1P-02` B3-1 回填中给出现有做法。

**多账号注意**：若有多个卖家账号（0-1），每账号报表单独导出并在文件名/元数据标注账号别名，不混合。

## 3. TikTok Shop Seller Center（P2，开店后）

对应 `G1P-02` B1-8、B2-2、B6-2、B8。

- 结算报表、店铺体验分/违规记录、GMV Max 广告数据：Seller Center 对应模块导出。
- 若尚未开店，标注「未开通」即可，不阻塞。

## 4. 社交媒体平台原生分析

对应 `G1P-02` Part A3、B3-5。

| 平台 | 位置（参考） | 要求 |
|---|---|---|
| Instagram | Insights / Professional dashboard | 账号级周指标：followers/reach/engagement/posts |
| TikTok | Analytics | 同上 |
| YouTube | YouTube Studio → Analytics | 同上 |
| Facebook | Meta Business Suite / Insights | 同上 |
| LinkedIn | Page analytics | 公司页级指标 |
| X/Twitter | Analytics（若有运营） | 同上 |
| 帖子级表现 | 各平台帖子分析 | views/engagement/link clicks，发布后 7/30 天窗口 |

- **不要导出**：粉丝/用户个体列表、私信内容、评论用户 handle。
- 声量/提及/SOV 走社媒监听工具（A3-4 确认是哪个）。

## 5. 竞品监控工具（Keepa/卖家精灵/Jungle Scout/数字酋长）

对应 `G1P-02` Part A5、B8-2。

| 工具 | 可提供数据（预期） | 要确认 |
|---|---|---|
| Keepa | 价格历史、BSR 历史、类目排名 | 导出方式、历史深度、API 是否另案 |
| 卖家精灵 | 关键词排名、搜索量、竞品分析 | 字段覆盖、更新频率 |
| Jungle Scout | 关键词排名、listing 分析 | 同上 |
| 数字酋长 | （待确认覆盖范围） | 覆盖哪些数据类型 |

- 逐工具给出字段覆盖表（哪些指标有、更新频率、导出格式）。
- Eufy 具体产品型号清单一并提供（A5-2）。

## 6. 财务/ERP/银行/税务

对应 `G1P-02` Part B1、Part 0-5。

| 数据 | 来源 | 要求 |
|---|---|---|
| 订单-结算勾稽 | 结算报表+订单报表关联生成 | 订单号↔结算行映射 |
| 汇率记录（平台折算 vs 实际到账） | 财务/ERP 系统 | 交易日粒度，双口径 |
| 银行到账记录 | 财务系统导出 | 只取金额/日期/对方户名摘要 |
| 销售税/VAT 申报资料 | 财务/税务系统+平台报表 | 各市场税率、代扣代缴口径 |

## 7. 合规资质

对应 `G1P-02` Part B4。

| 数据 | 形式 | 要求 |
|---|---|---|
| 产品合规证书台账 | 台账表（产品×市场×资质类型×有效期） | 证书文件本体不入库，登记元数据即可 |
| 市场×品类合规要求矩阵 | 表格 | 准入资质/标签/认证要求 |
| Listing 合规自查记录 | 运营台账 | 宣称-证据映射，SKU×渠道 |

## 8. 履约与库存

对应 `G1P-02` Part B5。

| 数据 | 来源 | 要求 |
|---|---|---|
| FBA 库存快照 | Seller Central | 日粒度，仓×ASIN |
| FBA 入库/签收/赔偿/退货 | 装运工作台+报表 | 批次/订单级 |
| 在途库存与头程物流 | 物流商/货代系统导出 | 批次级 |
| 订单履约异常 | 各渠道+物流系统 | 订单级，聚合优先 |
| DTC 仓库存 | WMS/3PL 系统导出 | SKU×仓×日 |

## 9. 达人与客户分层

对应 `G1P-02` Part B7。

| 数据 | 来源 | 要求 |
|---|---|---|
| 达人档案与合作状态 | 运营台账/CRM | 建联/寄样/带货/佣金，达人级 |
| 寄样发货与回执 | 物流+台账 | 批次/达人级 |
| 客户分层（RFM/生命周期/会员/订阅） | Shopify Segments/CRM | **只报分层人数与占比；可触达名单留系统内，不导出文件** |
| 复购/流失事件（聚合） | CRM/分析工具 | 客户×周期聚合 |

## 10. 多平台商品与价格

对应 `G1P-02` Part B8。

| 数据 | 来源 | 要求 |
|---|---|---|
| 商品资料快照（标题/属性/类目/变体） | 各平台后台导出/feed 文件 | SKU×平台×快照 |
| 跨平台价格与促销快照 | 平台报表/合规工具 | SKU×平台×日 |
| 库存分配与超卖事件 | 库存系统+平台报表 | SKU×平台×日 |

---

## 提交打包

每源一份证据包，按 `G1P-05` 模板填写；文件命名建议 `G1_<源简称>_YYYYMM_<序号>`（如 `G1_SHOPIFY_202611_01`）。原始导出文件存企业侧受控位置，我方接收脱敏样例+字段字典+快照哈希。

## 评审记录

- 2026-11-25：草稿产出（10 个平台/系统导出指引）。
- 2026-11-25：用户评审通过（报表名称为准+菜单路径以实际界面为准的表述、B3-1 评价三路径诚实标注），升 v0.1 基线。
