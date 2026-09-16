# BVS-01 Amazon US经营数据契约与只读连接证据方案

状态：`Deferred Channel Template / Pending Source Verification`。D-033已将首个真实经营闭环切换为Shopify DTC；本文件保留为后续Amazon US渠道样本的数据语义和连接证据模板，不表示企业接口已开放、数据已读取或任何生产动作已获授权。机器可检验的配套清单见[bvs-01-amazon-us-data-contract.json](bvs-01-amazon-us-data-contract.json)。

入口状态（2026-09-16）：当前没有可用的Amazon SP-API、RootData或数智星图只读入口；Shopify只作为首个DTC渠道样本，不满足本契约的Amazon渠道证据要求。Amazon入口可用后再执行本契约。

## 1. 试点范围与完成定义

本契约只覆盖已确认的Momcozy可穿戴式吸奶器、Amazon US、一个账号或店群、3–10个高GMV SKU和滚动30天窗口。近期存在重大质量、缺货或账号风险的SKU先排除。账号标识、SKU清单及排除证据仍待企业材料补齐。

本阶段完成不等于“接上一个API”。必须同时交付：

1. 同一业务范围的六类数据对象能用稳定键关联；
2. 原始GMV、取消、退款、广告归因销售和结算现金分别呈现；
3. 每个来源都有只读身份、范围拒绝、分页、限流、时效、失败和回放证据；
4. RootData或数智星图的经营投影可追溯到渠道或企业权威记录；
5. 缺失、过期、冲突或越界数据会冻结受影响对象，不能被解释为零值或成功。

## 2. 第一性原理：按业务事件分配权威，不指定一个“万能真相库”

权威来源应回答“谁最接近该业务事件并能提供可重放回执”，而不是“哪个系统看起来最完整”。候选责任如下：

| 数据域 | 渠道事实候选 | 企业记录/投影候选 | 本阶段结论 |
| --- | --- | --- | --- |
| 订单与订单状态 | Amazon Orders API或订单报表 | 自研ERP、RootData、数智星图 | Amazon候选为渠道事件权威；映射和完整性需实测 |
| 退款、费用与结算 | Amazon Finances API | 自研ERP、RootData、数智星图 | 渠道财务事件与企业会计分录分层，不互相覆盖 |
| 广告 | 目标账号实际可用的Amazon Ads报表接口 | RootData、数智星图 | 必须保留归因窗口与报表schema，不能与原始GMV混算 |
| 价格与促销 | Amazon报价/促销读取面 | 自研ERP、RootData、数智星图 | 订单发生时有效价格需按时间区间关联 |
| FBA库存 | Amazon FBA Inventory API | ERP、WMS、RootData、数智星图 | FBA与MFN分开；跨系统库存桶先映射再对账 |
| 试点准入 | Amazon账号证据 + QMS + 库存证据 | 版本化Eligibility Decision | 任一必需证据缺失、过期或冲突即不准入 |

RootData和数智星图当前只是经营读取与数据产品候选。企业材料证明系统存在，不证明接口可用、口径正确或具有权威地位。只有通过字段血缘、范围、时效和对账验证后，才能成为BVS-01的默认读取投影。

## 3. 统一业务范围键

所有记录至少带有适用的`tenant_id`、`brand_id`、`marketplace_id`、`selling_partner_id`、`account_scope_id`、`asin`、`seller_sku`、业务事件标识、`source_snapshot_id`及`source_observed_at`。其中：

- `selling_partner_id + marketplace_id + seller_sku`是卖家报价和库存的范围键；
- `order_id + order_item_id`是订单与退款对账的核心业务键；
- `advertiser_account_id + advertised_asin/seller_sku + local_date`是广告日粒度的最低关联键；
- 产品、ASIN、Seller SKU、套装和变体不得直接视为同一层级，必须通过版本化映射表关联；
- 任何缺少账号或市场范围的记录不得进入跨店聚合。

原始客户姓名、地址、邮箱、电话和自由文本不进入该试点数据集。若某接口操作默认返回PII，应改用不含PII的读取面或在进入Case前由确定性脱敏层剔除。

## 4. 六类数据产品

### 4.1 订单事件与原始GMV

最小粒度是一条订单行的状态事件。金额组件分别保存商品本金、运费、礼品包装、税和促销折扣；在经营方确认前，不把这些组件硬编码成唯一GMV公式。

`raw_gmv`的候选计算必须版本化：

~~~text
raw_gmv = SUM(已确认纳入的订单事件金额组件)
cancellation_amount = 单独汇总的取消事件金额
refund_amount = 单独汇总的退款财务事件金额
~~~

订单更新不能原地覆盖历史事件。修正记录需保留来源事件ID、观察时间和重放顺序，使同一30天窗口可重算。

### 4.2 退款、费用与结算现金

退款和费用以金融交易事件保存，至少区分交易类型、状态、关联订单/发货标识、过账时间和金额组件。`RELEASED`等状态含义按目标接口版本验证，结算现金不作为GMV别名。

### 4.3 广告日报

日粒度保存账户、Campaign、Ad Group和被广告商品，至少包含曝光、点击、花费、归因订单、归因销量、归因销售、币种、时区、归因窗口与报表schema版本。广告归因销售用于解释投放效果，不与订单事件重复计入原始GMV。

Amazon在2026年推出统一报表，并宣布现有Sponsored Ads/DSP报表在2026年末退场；目标账号最终选用的读取面必须经过版本和迁移验证，不能根据文档名称预先锁死接口。

### 4.4 报价与促销区间

每个Seller SKU的挂牌价、运费、落地价、促销标识、促销类型和生效区间分别保存。经营分析按订单购买时间关联当时有效价格，避免用当前快照解释历史订单。

### 4.5 库存位置

FBA至少区分`fulfillable`、`reserved`、`inbound`、`unfulfillable`和`researching`；MFN库存使用经验证的卖家库存来源并单列。Amazon、ERP与WMS中的库存桶可能重叠，未经映射不得相加。

### 4.6 试点准入决定

每个SKU/账号形成版本化Eligibility Decision，记录质量、缺货与账号风险状态、证据引用、规则版本、生效时间和过期时间。缺少任一必需风险证据时`eligible=false`，只影响该对象，不冻结无关SKU。

## 5. 数据质量与冻结语义

| 规则 | 验收方式 | 失败处置 |
| --- | --- | --- |
| 范围完整 | 每条记录可解析到已批准账号、市场和SKU | 隔离记录，冻结受影响范围 |
| 时间与币种完整 | 币种、时区、来源时间、schema版本齐全 | 禁止聚合和同比 |
| 事件幂等 | 同一来源事件重放不改变结果 | 重建受影响分区 |
| 指标分离 | GMV、取消、退款、广告归因和现金无重复别名 | 拒绝发布指标 |
| 库存桶映射 | Amazon/ERP/WMS桶位关系可解释 | 冻结库存依赖建议 |
| 越界拒绝 | 跨账号和范围外SKU读取返回拒绝回执 | 记录Access Exception |

首批阈值不凭经验填数。先用两个完整业务周期形成时效、缺失率、晚到率、重放差异和跨源差异基线，再由经营方确认停止线及有效期。

## 6. 只读连接证据包

每个候选连接器通过CVS-03交付以下13项证据，缺一项不得标记为“已连接”：

1. 连接器身份与版本；
2. 环境和目标账号范围；
3. 实际获批的读取操作；
4. 对应Amazon角色或企业服务身份，不记录密钥；
5. 分页、游标、晚到数据和增量更新行为；
6. 实测限流头、退避和重试策略；
7. 真实成功请求的时间、请求ID或等价来源回执；
8. schema版本与脱敏样本shape hash；
9. 30天窗口的完整性、时效和重复率探针；
10. 范围外SKU和跨账号读取拒绝探针；
11. 超时、部分失败、429/5xx和重放测试；
12. PII字段未进入下游的验证；
13. 身份撤回、连接器禁用及审计可追溯证据。

正式连接器按`Amazon渠道读取 → RootData/数智星图经营投影 → ERP/WMS/QMS交叉对账`分三组验证。任一组未通过时，只降级对应数据域；不伪造全局成功状态。

## 7. 首轮Shadow验收用例

| ID | 用例 | 通过条件 |
| --- | --- | --- |
| DC-01 | 读取范围内单个SKU的30天订单事件 | 可重放、无PII、状态修正不重复计GMV |
| DC-02 | 加入取消和退款事件 | 三类指标分离且能追溯至订单行与金融事件 |
| DC-03 | 关联广告日报 | 归因窗口明确，广告销售不冒充原始GMV |
| DC-04 | 关联价格区间 | 每笔订单匹配发生时有效价格或显式缺口 |
| DC-05 | 关联FBA/MFN库存 | 库存桶不重复相加，快照时间可见 |
| DC-06 | 跨账号/范围外SKU读取 | Policy Gate拒绝并产生审计回执 |
| DC-07 | 模拟分页中断和429 | 从确定性游标恢复，不重复摄取 |
| DC-08 | 制造跨源金额/库存冲突 | 只冻结受影响对象并生成Data Conflict |
| DC-09 | Eligibility证据过期 | 对象退出试点，其他对象继续 |
| DC-10 | 重跑相同30天窗口 | 同一来源版本产生相同结果和shape hash |

本阶段只形成契约与证据要求。`DC-01`至`DC-10`均需目标企业环境中的真实只读连接或合规脱敏回放才能标记通过。

## 8. 50岗位中的责任分工

| 责任 | 岗位 | 交付物 |
| --- | --- | --- |
| BVS-01结果负责 | AGT-021 Amazon业务经营 | 试点范围、业务问题、GMV经营解释 |
| 指标与增量复核 | AGT-003 经营分析与决策支持、AGT-035 增长实验与增量评估 | 口径、基线、归因与对照方法 |
| 主数据与契约 | AGT-045 业务口径与主数据 | 字段、粒度、血缘、质量和版本 |
| 供需约束 | AGT-016 需求预测与补货计划、AGT-017 库存与商品生命周期 | 库存桶、缺货风险和停止条件 |
| 广告/价格输入 | AGT-032 效果广告投放、AGT-026 定价促销与商品组合 | 广告与价格数据验收 |
| 财务保障 | AGT-040 GMV结算与会计对账、AGT-041 经营财务与资金 | 退款、费用、结算和现金分离 |
| 连接器与运行 | AGT-047 系统集成与业务工具、AGT-049 Agent平台与可靠运行 | 只读工具、探针、失败和回放证据 |
| 访问独立检查 | AGT-050 信息安全与权限 | 账号范围、PII剔除、撤权和拒绝回执 |

这些岗位是责任契约。实际运行仍是一张Case绑定一个主岗位人格，按阶段加载Skills和检查规则，不创建岗位Agent自由互聊链。

## 9. 尚待企业材料确认的七项输入

1. Amazon账号/店群的非敏感代号与Marketplace范围；
2. 3–10个SKU的非敏感代号和排除清单证据；
3. 原始GMV纳入哪些金额组件；
4. 六个数据域各自的权威来源与企业投影优先级；
5. 各域可接受延迟、缺失率、冲突率和停止线；
6. Shopify在本路径中的角色，以及对应正式接口、MCP server或受控服务身份的名称和负责人；
7. 30天基线窗口、对照窗口和增量评估方法。

这些输入可以分批补齐。任何未知项都保持`UNCONFIRMED`并冻结依赖它的判断，不把默认建议写成生产事实。

## 10. 当前官方接口证据

- Amazon当前Orders API主版本为`v2026-01-01`，`v0`已标记弃用；目标连接需核实实际应用版本与角色：[Orders API](https://developer-docs.amazon.com/sp-api/docs/orders-api)。
- SP-API支持单笔、批量、报表和Data Kiosk读取，并要求按业务申请角色、处理限流及分页：[Onboarding as a Developer](https://developer-docs.amazon.com/sp-api/docs/onboarding-overview)。
- FBA Inventory API `v1`可读取可售、在途、预留、不可售及调查中库存：[FBA Inventory API](https://developer-docs.amazon.com/sp-api/lang-en_EN/docs/fba-inventory-api)。
- Finances API `v2024-06-19`可按时间和Marketplace读取金融交易，分页与交易状态必须保留：[Finances Use Case Guide](https://developer-docs.amazon.com/sp-api/lang-de_DE/docs/finances-api-v2024-06-19-use-case-guide)。
- SP-API响应中的`x-amzn-RequestId`和在部分响应返回的`x-amzn-RateLimit-Limit`可作为连接器证据的一部分：[Response Format](https://developer-docs.amazon.com/sp-api/lang-pt_BR/docs/response-format)。
- Amazon Ads统一报表于2026年6月GA，Reporting API仍标记beta，既有报表计划在2026年末退场，因此广告契约必须固定报表schema和迁移策略：[Unified Reporting](https://advertising.amazon.com/resources/whats-new/streamline-campaign-analysis-with-unified-reporting)。

以上官方资料证明候选接口能力，不证明Momcozy账号已获角色、接口已连通或数据满足本契约。
