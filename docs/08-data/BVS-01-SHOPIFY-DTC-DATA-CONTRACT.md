# BVS-01 Shopify DTC经营数据契约与只读连接证据方案

状态：D-051后的目标状态候选契约，当前`HOLD_NO_PUBLISHED_PRODUCTS`。目标Shopify是无上线产品的空白新店，Product/Variant/SKU、30天报表和订单证据尚不存在，缺失不得解释为零。D-034至D-049定义的范围、GMV、App/认证、SKU、产品家族、Scope、Level 1和45天保留规则全部保留，待未来`SHOP-G6/SHOP-G7`条件满足后实例化。本文不包含凭据或销售明细，不授权Protected Customer Data访问、Metafield Definition创建、字段回填、报表/商品读取、商品修改、连接、业务写入、预算动作或对外发送。

## 1. 已确认范围与尚未实例化的对象

| 项目 | 当前值 | 状态 |
| --- | --- | --- |
| 品牌 | Momcozy | 已确认 |
| 渠道 | Shopify DTC / Online Store | 已确认 |
| 市场 | 美国 | 已确认 |
| 商店 | Momcozy美国主Shopify商店 | 业务范围已确认；非敏感`shop_alias`与`shop_id`待提供 |
| 产品族 | 可穿戴式吸奶器 | 已确认 |
| 产品族成员来源 | `custom.product_family` Product metafield精确等于`wearable_breast_pump` | D-043已确认Definition契约，D-044已确认一次性Product GID种子契约；目标Shop实例、真实清单、覆盖率与快照待确认 |
| SKU | 原始Top 5经质量、缺货、账号风险剔除，最终3–5个 | 目标态方法；当前上线商品为0，没有可生成的`variant_id`/SKU白名单 |
| 观察窗口 | 滚动30天 | 已确认；基线对照窗口待决定 |
| AI结果负责人 | AGT-023 独立站经营与转化 | 已确认 |
| 运行方式 | 一张FLOW-01 Case、一个AGT-023主人格、按需Skills | 已确认设计；Bundle与Case尚未实例化 |

“美国主站”不能只用公开域名识别。连接前必须由`shop`查询返回的Shopify GID、永久`myshopify.com`域名、主域名、商店币种、IANA时区和Markets配置共同固定身份。公开品牌域名只作展示别名。

## 2. 闭环定义

本试点产品闭环为：

`Shopify经营信号 → SKU级联合诊断 → Shadow行动包 → NoActionRecord → 基线与约束核对`

当前只读阶段的完成条件是形成可回放的证据、诊断、候选行动和明确的“不执行”记录。它不以模型生成建议作为完成，也不把未执行的建议写成增量GMV。

完整的“投放 × 价格 × 库存”联合闭环需要三类权威事实：

1. **Shopify渠道事实**：订单、销售调整、商品、价格、折扣、渠道库存、流量与Shopify Payments结算候选；
2. **增长成本事实**：Meta、Google、TikTok及其他实际投放平台的花费、归因窗口和回执；
3. **企业约束事实**：ERP/WMS的可承诺库存、在途与成本，QMS的质量准入。

Shopify先行表示先建立第1类入口，不表示第2、3类事实已被Shopify覆盖。缺少广告成本、企业库存或质量证据时，只冻结依赖该事实的判断，不伪造完整闭环。

## 3. Shopify API与权限基线

- 候选接口为GraphQL Admin API；设计核查时最新稳定版本为`2026-07`。正式连接必须显式固定一个当时受支持版本，并保存响应`X-Shopify-API-Version`，不能在生产契约中使用`latest`或`unstable`。
- 30天窗口位于默认60天订单可见范围内，首轮不申请`read_all_orders`。如果未来扩大历史窗口，再单独申请并验证该权限。
- D-046已确认首轮声明Scopes为`read_products`、`read_orders`、`read_inventory`、`read_locations`和`read_markets`。`read_all_orders`、`read_customers`、`read_reports`和全部`write_*`明确排除；`read_discounts`、`read_returns`、`read_shopify_payments_payouts`也不属于首轮包，未来需要时必须形成新版本和新决定。
- 订单属于Protected Customer Data。D-047已选择Level 1最小必要政策，D-048已确认规范化行45天加密保留，D-049要求在目标Dev Dashboard先读回App类型与Organization关系：public app的Level 1需review，custom app与admin-created custom app按官方类型政策为always available。目标现场证据、字段Schema/Query Hash、删除/访问/备份TTL测试尚未完成，因此`read_orders`仍只存在于声明Scope包，不发布订单Query模板，也不允许读取订单对象。姓名、邮箱、电话、地址、Customer主档、客户旅程、IP、Token、自由文本、支付与员工字段明确拒绝。
- `shopifyqlQuery`需要`read_reports`，当前接口文档还标注需要Level 2 Protected Customer Data访问。D-046已排除该Scope，因此首批预检禁用ShopifyQL；任何调用尝试都必须在取Token前拒绝。未来若确需采用，必须建立新Scope包版本并重新决定，不能通过扩大客户字段范围绕过。
- 普通GraphQL查询按App × Shop的计算成本限流。记录`extensions.cost`及Throttle状态，禁止用固定请求频率替代成本反馈。
- 首轮3–10个SKU与30天窗口优先使用游标分页查询。`bulkOperationRunQuery`虽然读取业务数据，但通过GraphQL mutation创建异步读取任务；只有在集成控制面明确允许后才采用，并把它登记为“只读数据、控制面有状态”的工具能力。Webhook订阅同样需要独立授权，不属于首轮只读探针。

上述Scopes是已确认的声明集合，不表示目标商店已经批准。连接证据必须用`currentAppInstallation.accessScopes`读回实际授权范围，并与5项声明集合完全相等；缺失或多余均进入`HOLD_SCOPE_MISMATCH`。Admin Analytics CSV是独立的受控导出证据路径，不使用App API Scope，也不因D-046获得报表访问授权。

### 3.1 D-046 Scope、Query与激活边界

| 面 | 当前允许的设计范围 | 未满足时 |
| --- | --- | --- |
| 声明Scope | `SHOPIFY_BVS01_READ_V1`固定5项只读Scope | 任意增删必须形成新版本和新决定 |
| 身份与授权读回 | `shop`、`currentAppInstallation.accessScopes` | Shop不唯一或Scope不完全一致时`HOLD_SCOPE_MISMATCH` |
| 商品与Definition预检 | Product metafield Definition冲突审计、Product/Variant/SKU/指定metafield目录快照 | 未发布Query Hash或字段白名单时不得调用 |
| 库存与位置预检 | Inventory Item/Level与Location最小快照 | 不得把Shopify库存冒充ERP/WMS ATP |
| Markets预检 | Market身份与美国市场绑定 | Market不唯一时冻结该范围 |
| 订单读取 | Level 1最小必要字段与45天规范化行保留政策已确认；模板仍不发布 | PCD资格、实际Scope、字段Schema/Query Hash、删除/访问/备份TTL测试任一缺失时一律拒绝 |
| 报表 | Admin Analytics CSV独立导出 | 不调用`read_reports`或ShopifyQL，不把手工导出当作App授权 |

预检激活必须同时具备：目标App/Shop身份、配置版本、模型外Secret Manager与Token Broker引用、5项实际Scope精确读回、已发布Query Hash/变量schema/字段白名单、Level 1资格证据、D-048保留控制、越界拒绝、访问日志、删除、备份TTL、审计与撤权测试。任何条件缺失时，声明包可保留，但连接器保持Draft且API调用为禁用。

### 3.2 D-047至D-048 Level 1订单字段与数据生命周期

`SHOPIFY_BVS01_ORDER_LEVEL1_V1`只服务于“最近30个完整Shop本地自然日的SKU级GMV与状态核对”。设计Allowlist如下；正式发布前仍须按固定API版本生成字段Schema与Query Hash：

| 对象 | 允许字段组 | 用途 |
| --- | --- | --- |
| Order | `id`、`createdAt`、`updatedAt`、`processedAt`、`cancelledAt`、`cancelReason`、`closed`、`closedAt`、`confirmed`、`test` | 幂等、窗口、取消与测试单隔离 |
| Order状态 | `displayFinancialStatus`、`displayFulfillmentStatus` | 分列财务与履约状态，不推断现金到账 |
| LineItem | `id`、`quantity`、`currentQuantity`、`sku`、`product.id`、`variant.id` | SKU归属、初始数量与退款/移除后数量 |
| LineItem金额 | `originalTotalSet`、`originalUnitPriceSet`、`discountedTotalSet`、`totalDiscountSet`、`priceAfterAllDiscountsBeforeTaxesSet` | 重算Gross、折扣与销售调整；不读取折扣码或支付工具 |
| MoneyBag | `shopMoney.amount/currencyCode`、`presentmentMoney.amount/currencyCode` | 保留Shop与Presentment币种，不静默换算 |

显式Denylist包括：`customer`及其全部字段、`email`、`phone`、`billingAddress`、`shippingAddress`、`displayAddress`、`customerLocale`、`customerJourneySummary`、`customerAcceptsMarketing`、`clientIp`、`cartToken`、`checkoutToken`、`note`、`customAttributes`、`metafields`、`tags`、`staffMember`、`paymentGatewayNames`、`transactions`、支付收款细节、Gift Card、折扣码、`statusPageUrl`、客户可见订单名/确认号及其他自由文本。Customer GID也不读取。

最小化执行发生两次：固定GraphQL模板在请求前只包含Allowlist；响应进入下游前必须与允许Schema完全匹配。GraphQL顶层或字段级`errors`、受资格影响的`null`、意外字段、对象跨Shop或字段Schema Hash不匹配时，整页丢弃并进入`HOLD_PROTECTED_CUSTOMER_DATA_APPROVAL_MISMATCH`或`HOLD_PROTECTED_CUSTOMER_DATA_SHAPE_MISMATCH`，不得把HTTP 200或部分数据记为成功。

原始API响应仅可在Connector进程内存中完成校验和聚合，持久化保留为0。模型、Case Agent和Tool UI只能看到`shop_ref + business_date + variant_ref + sku + quantities + amount_components + currency + status_counts + evidence_ref`的SKU日聚合，不接触原始Order/LineItem GID。生产订单数据不得复制到开发/测试、仓库、Site、Prompt、Skill或跨会话记忆。

D-048允许规范化Level 1订单行在企业批准的隔离存储中加密保存45天：30天经营窗口加15天晚到/重放缓冲。TTL基准为Shop时区的源业务日结束时刻，`expires_at`为该时刻加45天；每日删除任务须在`expires_at`后24小时内完成主存储、索引与缓存硬删除，备份采用相同TTL或可验证crypto-erasure。只允许受限服务身份访问，KMS密钥引用不得对模型可见，也不得产生开发/测试副本。删除回执只记录策略版本、运行时间、到期数、删除数和失败数，不记录行ID、订单ID或客户数据。

若到期后删除窗口结束仍有记录、访问日志缺失或备份TTL/crypto-erasure测试失败，进入`HOLD_RETENTION_DELETE_FAILURE`，停止新的订单读取与数据集发布；模型不能覆盖。法律保全等例外须由模型外独立审批策略进入隔离存储，不得静默延长一般45天窗口。SKU日聚合Case Artifact使用独立证据保留政策，且不得包含Order/Customer标识。`ORDER_LINE_WINDOW_V1`仍保持禁用，直到Level 1资格、实际Scope、字段Schema/Query Hash以及上述删除、访问与备份控制均有证据。

### 3.3 D-036至D-037连接身份与认证

首个连接采用新建BVS-01试点专用Dev Dashboard App，不复用通用企业App，也不使用已停止新建的Shopify Admin旧式custom app。D-037确认目标Shop与App归属于同一Shopify Organization，因此认证固定使用`client_credentials`：在Dev Dashboard创建App和配置版本，安装到目标Shop后，由模型外Token Broker用Client ID与Client Secret向目标Shop Token endpoint换取短期Access Token，并以响应的`expires_in`管理有效期。不得自行改用跨Organization OAuth路径或人工粘贴Token作为失败回退；App类型与分发状态由D-049现场读回，不在设计文档中猜测。

模型、Prompt、Skill和Tool UI均不得接触Client Secret或Access Token。模型只调用`shopify_channel_read`逻辑工具；模型外Policy Gate先校验Shop、Market、Variant/SKU、30天窗口、字段与Query Hash，Connector再经Token Broker取Token并调用固定API版本。App未创建、版本未发布、未安装或身份/Scope读回不一致时保持Draft并冻结调用。详细字段、Scope阶梯、岗位分工和`PILOT-G1A`证据见[Shopify只读连接器登记契约](../10-platform/deepseek-harness/SHOPIFY-READONLY-CONNECTOR-REGISTRATION.md)。

### 3.4 D-049 Level 1目标现场资格证据

[Level 1资格现场证据包](../10-platform/deepseek-harness/SHOPIFY-LEVEL1-QUALIFICATION-EVIDENCE-PACK.md)固定9项证据和六类HOLD。现场先识别操作者权限类别、Organization/App/Shop关系、App类型/分发、生命周期与声明Scope，再依据官方类型矩阵解释资格；政策上的always available不得写成目标App运行访问已验证。当前页面停在Shopify连接验证页，全部目标观察字段仍为`NOT_OBSERVED`，`protected_customer_data_qualification_verified=false`。

### 3.4 D-038 Variant/SKU范围清单

首批范围不依赖尚未授权的连接器进行全量扫描。D-039指定从目标Shop的Shopify Admin Analytics导出CSV，D-040进一步固定`Analytics > Reports > Total sales by product variant`为首份报告路径；冻结最近30个完整Shop本地自然日，以D-035 `gross_sales`聚合到唯一`variant_gid + sku`，稳定排序并截取原始Top 5；再分别引用质量、缺货和账号风险证据，只有三类均为`CLEAR`的对象进入最终清单。风险为`BLOCKED`或`UNKNOWN`均剔除，不从第6名以后回填；最终少于3个时`PILOT-G0`保持HOLD。

最终3–5个对象必须以版本和内容Hash封存，Case、Policy Gate和读取工具固定引用同一版本。完整字段、岗位交接与失败状态见[SKU范围清单契约](BVS-01-SHOPIFY-SKU-SCOPE-MANIFEST.md)。报告身份、Definition契约、一次性Product GID种子契约与只读预检顺序已经确认，但预检访问、目标Shop Definition实例、真实种子清单、成员覆盖、报告字段/完整导出选项和真实成员均未验证，因此清单状态为`DRAFT_READ_ONLY_PREFLIGHT_CONTRACT_CONFIRMED_EXECUTION_PENDING`。

D-041/D-042固定商品字段来源与Product metafield主选择器，D-043固定`custom.product_family`、`single_line_text_field`、预设值`wearable_breast_pump`与`EXACT_EQUALS`成员谓词，D-044固定一次性负责人确认的Product GID清单作为初始化种子。清单必须绑定同Shop全量Product目录快照；GID解析和获批回填后精确值读回均须达到100%，重复/跨Shop须为0，且负责人确认清单完整。运行时不做大小写/空白修复，不得回退到`productType`、tag、标题、模型语义分类或销售表现。首次种子覆盖验收前的未列入、缺值、同名不兼容Definition、非法值或不可重放快照均进入`HOLD_PRODUCT_FAMILY_MEMBERSHIP_AMBIGUOUS`，不生成Top 5。

D-040选定Shopify官方`Total sales by product variant`：官方资料说明其以产品变体粒度拆分销售并包含`Variant SKU`、`Net quantity`和`Gross sales`。目标Shop仍须现场核验实际报告名称、套餐可用性、字段、过滤器和完整导出能力，并记录界面实际显示的导出选项；若报告不存在、缺少Variant/SKU粒度、`Gross sales`或`Net quantity`、只能导出当前页/部分数据、过滤条件不可复现，或SKU到Variant GID不能一一映射，则进入`HOLD_REPORT_CAPABILITY_MISMATCH`。不得自动改用保存的自定义Analytics exploration或ShopifyQL，也不得进行产品级分摊或将`net_sales`、`total_sales`替代原始GMV。报告未提供稳定Variant GID时，另用经核验的商品主数据快照完成SKU到GID的一一映射。原始CSV只保存在企业批准的受控对象存储中，本仓库和Site只保留来源引用、配置摘要、Hash、Schema Hash、行数及脱敏结果。

## 4. 指标契约

Shopify原生销售口径至少保留以下分量，不互相覆盖：

| 指标 | 候选语义 | 当前用途 |
| --- | --- | --- |
| `gross_sales` | 商品售价 × 数量，折扣、销售冲销、税、运费、关税和费用前 | D-035确认的试点原始GMV主指标 |
| `discounts` | 商品折扣及订单级折扣分摊 | 单列调整 |
| `sales_reversals` | 退货、取消、编辑等负向销售调整 | 单列调整；目标版本采用新字段名 |
| `net_sales` | `gross_sales - discounts - sales_reversals` | 商品净销售观察 |
| `shipping_charges` / `taxes` / `duties` / `additional_fees` | 商品外金额组件 | 单列展示 |
| `total_sales` | `net_sales + fees + duties + shipping + taxes` | 客户总支付/收入视图候选，不自动等于GMV |
| `refund_cash` / `payout_cash` | 实际退款交易与结算现金 | 现金视图；不回写GMV定义 |

所有金额保存原始币种、Shop币种、Presentment币种和转换来源。美国市场不等于所有订单均为USD；未验证Markets和币种前禁止强制换算。

D-035已确认本试点的“原始GMV”采用`gross_sales`。`net_sales`和`total_sales`继续作为对照指标；其他分量仍独立保留，取消、退款、支付状态和结算现金不能静默净额化。该试点定义不自动成为公司100亿口径。

## 5. 数据集合同

| 数据集 | 粒度 | 必需内容 | Shopify候选读取面 | 跨系统缺口 |
| --- | --- | --- | --- | --- |
| `shop_scope_manifest` | 一次连接 × Shop × API版本 | Shop GID、永久域名、主域名、币种、时区、Markets、获批Scopes | `shop`、`currentAppInstallation` | 企业渠道/实体代号映射 |
| `sales_line_events` | 订单行状态/销售调整事件 | D-047允许的Order/LineItem GID、Product/Variant/SKU、数量、时间、状态、金额/币种；模型面仅SKU日聚合 | `orders`分页；等待Level 1资格、字段Schema/Query Hash与D-048控制测试后发布模板 | ERP订单映射、内部收入确认 |
| `refund_reversal_events` | 一次退款、退货或销售冲销事件 | Refund/Return/Transaction GID、关联订单行、数量、金额分量、交易状态、发生时间 | 初始禁用；需订单字段政策及后续Return/Transaction能力核验 | 实际银行/财务入账 |
| `product_variant_price_state` | Variant × 有效时间区间 | Product/Variant GID、SKU、状态、销售渠道、price、compare-at、成本可用状态、折扣分配、区间 | Products/Variants、Discount读取面 | ERP商品主数据、完整COGS |
| `inventory_location_snapshot` | InventoryItem × Location × 快照 | available、on_hand、committed、incoming等目标版本支持状态，位置、观察时间 | InventoryItem、InventoryLevel、Location | ERP/WMS可承诺库存与在途去重 |
| `traffic_marketing_daily` | 日期 × 渠道/来源 × 落地页/商品 | Sessions、转化、订单、销售、归因窗口、查询版本 | 首批API禁用；仅保留未来ShopifyQL候选 | 外部广告平台花费与投放回执 |
| `payment_settlement_events` | Payment transaction或Payout事件 | 交易类型/状态、订单、费用、金额、币种、过账/结算时间 | OrderTransaction；适用时Shopify Payments Payouts | ERP/银行结算对账 |
| `pilot_eligibility` | Shop × Variant的版本化准入决定 | 商店健康、质量、缺货、商品状态、证据、规则版本、生效与过期 | 跨源决策产物 | QMS、ERP/WMS及实际店铺风险证据 |

订单、退款和结算记录只摄取完成指标所需字段。D-047明确不读取Customer GID或任何客户身份字段；订单去重只使用Connector内的订单/行项目对象键，并且原始键不得进入模型面。

## 6. 对象键与映射

所有数据集至少携带`tenant_id`、`brand_id`、`shop_id`、`market_id`、`api_version`、`source_observed_at`和来源游标/快照ID。按域增加：

- 商品：`product_id`、`variant_id`、`inventory_item_id`、`sku`；
- 交易：`order_id`、`line_item_id`、`refund_id`、`return_id`、`transaction_id`；
- 库存：`location_id`、`inventory_item_id`、数量状态；
- 查询：`query_hash`、`bulk_operation_id`（如适用）、`page_cursor`、`requested_cost`、`actual_cost`；
- 关联：企业商品ID、ERP订单ID、WMS库存位置ID，只在映射已验证后写入。

Shopify GID是渠道对象主键，SKU是业务映射键。SKU为空、重复或被复用时不得靠名称猜测Variant关系。

## 7. 数据质量与冻结语义

| 规则 | 验收方式 | 失败处置 |
| --- | --- | --- |
| DQ-SHP-01 Shop唯一性 | Token返回的Shop GID、永久域名和批准别名唯一匹配 | 停止全部探针，产生Scope Exception |
| DQ-SHP-02 SKU白名单 | 每条记录映射到已批准Variant与SKU集合 | 隔离记录，冻结受影响Variant |
| DQ-SHP-03 时间/币种完整 | IANA时区、业务发生时间、观察时间和币种齐全 | 禁止跨日、跨币种汇总 |
| DQ-SHP-04 事件幂等 | 同一对象版本/事件重放结果一致，销售冲销不重复 | 重建受影响分区 |
| DQ-SHP-05 指标分离 | Gross、discount、reversal、net、total、refund、payout可独立重算 | 拒绝发布GMV与现金结论 |
| DQ-SHP-06 库存状态映射 | Shopify与ERP/WMS数量状态有一对一或明确不可比说明 | 冻结库存依赖建议 |
| DQ-SHP-07 来源覆盖 | 投放成本、企业库存、质量任一必需来源缺失均显式标记 | 只允许不依赖缺失来源的诊断 |
| DQ-SHP-08 越界拒绝 | 非白名单Shop、Market、Variant请求被工具层拒绝并留痕 | 记录Access Exception，不向Shopify发请求 |
| DQ-SHP-09 API成本 | 每次查询保存成本和Throttle状态，退避后游标连续 | 冻结该数据域并从最后确认游标恢复 |
| DQ-SHP-10 PII最小化 | 请求字段和下游Shape均无身份字段 | 拒绝数据发布并触发安全复核 |

阈值不凭经验预填。先通过两个完整抓取周期建立新鲜度、缺失、晚到、成本、重放和跨源差异基线，再由经营方确认停止线及有效期。

## 8. 只读连接证据包

CVS-03必须交付以下证据，缺一项不得把Shopify标记为“已连接”：

1. App/连接器身份、版本、分发方式和运行环境；
2. 非敏感Shop别名、Shop GID、永久域名、市场和SKU白名单；
3. 实际固定的GraphQL Admin API版本及响应版本头；
4. `currentAppInstallation`读回的实际Scopes；
5. `SHOPIFY_BVS01_ORDER_LEVEL1_V1`字段Schema/Query Hash、Level 1资格、PII排除、模型面聚合Shape、保留与删除证明；
6. 查询/分页/Bulk控制面分类、游标和增量规则；
7. `extensions.cost`、Throttle状态、退避和重试实测；
8. 成功请求的时间、请求ID/等价回执、查询Hash和脱敏Shape Hash；
9. 30天窗口完整性、新鲜度、晚到率和重复率；
10. 非白名单Shop/SKU的本地Policy拒绝证据；
11. GraphQL `errors`、部分数据、超时、Throttle和重放测试；
12. Refund对象与Transaction状态交叉核对，避免把Refund记录等同于现金成功；
13. Token撤回、App卸载/禁用、连接器停用和审计证据；
14. Shopify、广告平台、ERP/WMS/QMS各自覆盖与缺口矩阵。

## 9. 首轮Shadow验收用例

| ID | 用例 | 通过条件 |
| --- | --- | --- |
| SHP-DC-01 | 读取Shop与App安装信息 | Shop唯一，API版本与实际Scopes可追溯 |
| SHP-DC-02 | 读取白名单中一个Variant的30天订单行 | 可重放、无PII、对象键完整 |
| SHP-DC-03 | 加入折扣和销售冲销 | Gross、discount、reversal、net可重算 |
| SHP-DC-04 | 加入Refund与Transaction | 退款记录与资金状态分离 |
| SHP-DC-05 | 关联价格有效区间 | 订单行匹配当时价格或显式缺口 |
| SHP-DC-06 | 关联Shopify库存位置 | 数量状态、位置与快照时间明确 |
| SHP-DC-07 | 请求非白名单Variant/Shop | 工具在发出请求前拒绝并留审计回执 |
| SHP-DC-08 | 模拟游标中断、Throttle和GraphQL部分错误 | 从确认游标恢复，无重复摄取或静默成功 |
| SHP-DC-09 | 尝试ShopifyQL或`read_reports`路径 | 在取Token前拒绝并生成Scope拒绝证据；首批不得静默启用 |
| SHP-DC-10 | 缺少广告花费或ERP/WMS/QMS事实 | 仅冻结依赖域，不宣称完整联合闭环 |
| SHP-DC-11 | 重跑同一30天窗口 | 同一来源版本产生同一结果或可解释晚到差异 |
| SHP-DC-12 | 撤回Token或移除Scope | 连接器停止读取，Case进入Waiting/Frozen并可审计 |

以上均未执行。真实只读连接或合规脱敏回放通过后，才可逐项标记通过。

## 10. 责任与交接

| 责任 | 岗位/控制面 | 交付物 |
| --- | --- | --- |
| 经营范围与关闭结果 | AGT-023 自航 | Case Charter、Shopify行动包、关闭建议 |
| GMV口径与增量 | AGT-003 明镜、AGT-035 试真 | 指标选择、基线、反证和增量方法 |
| 商品/商店对象契约 | AGT-045 同尺 | Shop、Market、Product、Variant、SKU映射 |
| 数据质量 | AGT-046 清源 | 数据集、质量状态、冻结范围 |
| 连接器交付 | AGT-047 接桥 | 工具登记、字段白名单、探针与回执 |
| 库存约束 | AGT-016 知量、AGT-017 衡仓 | 覆盖期、可承诺库存与停止条件 |
| 价格/投放输入 | AGT-026 衡价、AGT-032 点火 | 价格、促销、花费与归因证据 |
| 财务分离 | AGT-040 清账、AGT-041 守金 | 销售、退款、费用、结算与现金对账 |
| 隐私与访问保障 | AGT-044 安界、AGT-050 门卫 | 数据最小化、Scope和越界拒绝结论 |
| 运行可靠性 | AGT-049 稳行 | 限流、重试、游标、冻结和恢复证据 |

这些岗位贡献Skills、schema、规则或Assurance。运行时仍只有一个绑定AGT-023人格的Case Agent；工具服务、Policy Gate和Execution Broker不成为额外岗位人格。

## 11. 当前官方依据

- [GraphQL Admin API](https://shopify.dev/docs/api/admin-graphql/latest)：设计核查时最新稳定版本为`2026-07`；正式调用须固定版本。
- [API versioning](https://shopify.dev/docs/api/usage/versioning)：Shopify按季度发布版本并建议持续升级；响应版本头用于核实实际版本。
- [Access scopes](https://shopify.dev/docs/api/usage/access-scopes)：订单默认可见最近60天，`read_all_orders`需要额外批准；可用`currentAppInstallation`核对Scopes。
- [ShopifyQL query](https://shopify.dev/docs/api/admin-graphql/2026-01/queries/shopifyqlQuery)：需要`read_reports`并返回列定义、数据与解析错误。
- [ShopifyQL sales schema](https://shopify.dev/docs/api/shopifyql/latest/schemas/sales_revenue/sales)：定义Gross、Discount、Sales Reversal、Net和Total Sales的分量关系。
- [API limits](https://shopify.dev/docs/api/usage/limits)：GraphQL Admin API按App × Shop计算查询成本，需按返回成本和Throttle状态治理。
- [Bulk query](https://shopify.dev/docs/api/usage/bulk-operations/queries)：Bulk Operation异步读取数据并生成JSONL结果，但创建与轮询属于有状态控制面。
- [Protected customer data](https://shopify.dev/docs/apps/launch/protected-customer-data)：订单等资源受保护，要求最小化处理并按用途申请相应等级。
- [Refund query](https://shopify.dev/docs/api/admin-graphql/latest/queries/refund)：Refund存在不代表资金已成功退回，需核对关联Transaction状态。
- [Dev Dashboard app](https://shopify.dev/docs/apps/build/dev-dashboard/create-apps-using-dev-dashboard)：新App从Dev Dashboard创建、版本化并声明Scopes；用于自有组织商店的服务端连接可按官方client credentials流程取短期Token。
- [Client credentials grant](https://shopify.dev/docs/apps/build/authentication-authorization/client-credentials-grant)：自有组织商店的服务端App以Client ID/Secret换取24小时Access Token；凭据必须留在Secret Manager或受控环境变量中。
- [Legacy admin-created custom apps](https://shopify.dev/docs/apps/build/authentication-authorization/legacy/admin-custom-apps)：Shopify Admin内直接创建的旧式custom app已不能新建，仅存量App继续维护，不能作为新试点的默认入口。

官方资料只证明接口语义，不证明Momcozy商店已安装App、批准Scopes或满足数据质量要求。

## 12. 下一项经营决定

D-049已确认目标Dev Dashboard现场只读资格证据路径；D-050将其延期到`SHOP-G6`，D-051明确当前只写店铺治理方案。未来获得实施与访问授权、完成`SHOP-G2`至`SHOP-G5`后，才按9项证据读回App类型/分发、Organization关系、生命周期、声明Scope和数据保护准备度，并核验字段Schema/Query Hash、45天删除/访问/备份TTL控制、Definition三态、同Shop全量Product目录、真实种子清单和报告能力，再封存预检证据包。任何写入方案都必须引用预检包Hash并另行授权；对话和仓库不接收销售行、订单明细、客户信息、Secret或Token。
