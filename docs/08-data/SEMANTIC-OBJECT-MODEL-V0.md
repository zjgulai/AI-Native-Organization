# 品牌域对象-关系模型 v0（轻量语义层）

状态：**v0 基线**（2026-11-24 用户逐条评审通过）。DESIGN_ONLY，不构成业务授权、无生产数据。本模型是[FLOW-09-ONTOLOGY-PILOT](FLOW-09-ONTOLOGY-PILOT.md) §3-2 的第二项交付物：六域核心对象 20 个 + 关键关系 34 条，Markdown 表 + JSON Schema，不涉推理。术语口径以[SEMANTIC-GLOSSARY-V0](SEMANTIC-GLOSSARY-V0.md) 为准（`term_refs` 列引用其条目 ID）；对象属性级口径以[FLOW-09-DATA-CONTRACT](FLOW-09-DATA-CONTRACT.md)与两份语义契约为准。

来源标注：【显】=权威文档已定义；【推】=本模型归纳待评审；【数】=待企业数据回填。

## 1. 范围与约定

- **六域 20 对象是上限**（试点方案 §7）：商品 2 / 交易 2 / 渠道 3 / 库存 1 / 品牌资产 6 / 消费者 6；
- **类型分两类**：`entity`=业务实体（持续存在的对象），`artifact`=场景/流程工件（Case 产出，有生命周期）；
- **引用层对象不计入 20**：Case Charter、Stage Artifact、ArtifactEnvelope、Action Intent、Action Receipt、Snapshot、Scope Pack、Service Identity 三类、Policy Gate/Execution Broker、Coverage Matrix、Brand Attribution Report 等已有权威定义（D-024/025/053、数据契约、SERVICE-IDENTITY-SCOPE、BVS-09），本模型只引用不重复定义，见 §5；
- **对象键纪律**：跨源主键（ASIN/SKU/GID）保留原值，未验证映射标 `unmapped`；一切量化事实走 MetricFact 统一对象键；
- **不做**：不定义数据库表/ER 图、不做推理规则、不含实例数据。

## 2. 对象表（20 个）

| ID | 名称 | 域 | 类型 | 定义 | 关键属性 | term_refs | 来源 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| O-PROD-01 | Product 商品 | 商品 | entity | 可售商品单元；Shopify 侧 Variant、Amazon 侧 ASIN/SKU，跨源映射未验证标 `unmapped` | 主键原值、category_id、关联销售标记、生命周期状态 | T-PR-01/02/03 | 数据契约 §4；D-038/040 |
| O-PROD-02 | Category 品类 | 商品 | entity | 商品分类层级；试点主品类=`wearable_breast_pump` | category_id 枚举、品类边界规则 | T-PR-01/03 | 数据契约 §4；D-041~043 |
| O-TRANS-01 | Order 订单 | 交易 | entity | 渠道成交订单事实 | channel_id、period、金额分量（gross_sales 口径，折扣/退款/税费分列） | T-CO-01/02 | D-035；KPI 字典 §2 |
| O-TRANS-02 | MetricFact 指标事实 | 交易 | entity | 一切量化指标事实的统一键载体 | tenant_id/brand_id/market_id/category_id/channel_id/period_start/end/source_system/snapshot_id/snapshot_hash/extracted_at/data_grade；SOV 类附带 competitor_set_version | T-CN-03 | 数据契约 §4 |
| O-CH-01 | Channel 渠道 | 渠道 | entity | 品牌触达消费者的交易/内容场域 | channel_id 枚举（amazon_us/dtc_shopify/social_*/dme_insurance/retail_*） | T-CH-01~05 | 数据契约 §4 |
| O-CH-02 | ChannelAccount 渠道账号 | 渠道 | entity | 渠道内具体账号/店铺/主页实体（社媒账号、Amazon 店铺别名等）；同名多号即 HOLD | 账号唯一映射、所属平台、归属 channel_id | — | SERVICE-IDENTITY-SCOPE §2.3/开放项 3【显】 |
| O-CH-03 | ChannelDataAsset 渠道数据资产 | 渠道 | entity | 某渠道数据的可得性档案；analyzable/reachable 两级独立判定 | 分级、数据集清单、源滞后说明、触达边界 | T-CH-06/07 | 书2 ch24；F-045/048/049；DQ-F09-09 |
| O-INV-01 | InventoryPosition 库存水位 | 库存 | entity | 商品在特定节点的在库/在途/可售/库龄快照 | product_ref、库存节点、四数量、时点 | — | FLOW-03；SCN-007/008【显·v0 仅建此对象】 |
| O-BRAND-01 | BrandAssetMetric 品牌资产指标 | 品牌资产 | entity | L1 当期核算+L2 品牌资产六项指标的量化度量 | metric_id、层级（L1/L2）、归因方法、归因窗（6–24 月）、置信度前提 | T-BR-01~10 | FLOW-09-DUAL-KPI-CATALOG |
| O-BRAND-02 | BrandSignal 品牌信号 | 品牌资产 | entity | 汇聚自 VOC/评论/社媒/搜索/竞品/品类的可行动品牌信号（BVS-09 P1 产出 Brand Signal Set 的元素） | 信号类型、来源、时间戳、强度 | — | BVS-09 product_workflow P1【显】 |
| O-BRAND-03 | CoverageGap 覆盖缺口 | 品牌资产 | artifact | SCN-002 首产物：目标人群×品类×渠道组合中应有触点而缺失/弱势的格子 | 渠道×品类×人群段三维坐标、Amazon/DTC 口径分列 | T-CH-08 | SCN-002 契约类7-25 |
| O-BRAND-04 | BrandAssetDiagnosis 品牌资产诊断 | 品牌资产 | artifact | BVS-09 P2 产物：按认知/偏好/覆盖/忠诚/价格力/品效结构核对品牌资产差距 | 诊断维度、差距结论、证据引用、相关性vs因果标注 | — | BVS-09 product_workflow P2【显】 |
| O-BRAND-05 | BrandActionPackage 品牌行动包 | 品牌资产 | artifact | BVS-09 P3 产物：组合传播/内容/渠道/体验/投资方案 | 方案集、双层指标预期、护栏、停止条件、依赖 | — | BVS-09 product_workflow P3【显】 |
| O-BRAND-06 | BrandCommsPlan 品牌原则与传播方案 | 品牌资产 | artifact | AGT-029 立言主产物 | 目标/范围/输入版本/来源证据/判断依据/方案或 Intent/约束/停止条件/结果/未解决项/下一步（12 字段） | T-BR-11 | RPB-AGT-029 §5；契约类1-1/2 |
| O-CONS-01 | ConsumerSegment 人群段 | 消费者 | entity | 按需求/行为/价值划分的消费者群组 | 细分维度、规模估计、证据引用 | T-CN-01 | SCN-002 §经营目的 |
| O-CONS-02 | VOCSignal VOC 信号 | 消费者 | entity | 店铺评论/客服工单/退货原因/社媒评论私信的原文级信号 | 原文、时间戳、渠道标识、情感代理标注 | T-CN-02 | SCN-002 §输入 |
| O-CONS-03 | CompetitorSet 竞品集合 | 消费者 | entity | 纳入监测与 SOV 分母的竞品清单，版本化管理 | competitor_set_version、成员清单（7 类竞品+4 订阅工具口径） | T-CN-05 | 数据契约 §3.5/§5；F-046 |
| O-CONS-04 | EvidencePack 证据包 | 消费者 | artifact | SCN-002 STG-03/04 上下文装配产物 | 来源齐全率、每条来源/版本/新鲜度/冲突/缺口标注 | — | SCN-002 契约类7-27 |
| O-CONS-05 | DiagnosisRecord 诊断记录 | 消费者 | artifact | SCN-002 STG-04 产物：事实/假设/反证/不确定性分列 | 分析对象、结论链、证伪条件、不确定性标注 | T-CN-04 | SCN-002 契约类4-14 |
| O-CONS-06 | DecisionPackage 市场机会判断包 | 消费者 | artifact | SCN-002 STG-05 最终产物 | 候选细分/机会点列表、证据强度分级、可证伪条件、验证方式（指向下游场景）、数据缺口 | T-CN-04 | SCN-002 契约类1-1/2 |

## 3. 关系表（34 条）

基数标记：`1:N`=一对多、`N:M`=多对多（经中介）、`1:1`=一对一。引用层对象以〔R〕标注。

| ID | 主语 | 谓词 | 宾语 | 基数 | 口径约束 | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| R-01 | O-PROD-01 Product | belongsTo | O-PROD-02 Category | N:1 | 每商品唯一主品类；关联销售单独标注不入主品类口径 | D-041~043；契约类2-8 |
| R-02 | O-PROD-01 Product | listedOn | O-CH-02 ChannelAccount | N:M | 经账号中介；未验证跨源映射标 unmapped | 数据契约 §4 |
| R-03 | O-CH-02 ChannelAccount | belongsTo | O-CH-01 Channel | N:1 | 同名多号即 HOLD（范围包规则） | SERVICE-IDENTITY-SCOPE §2.3 |
| R-04 | O-CH-03 ChannelDataAsset | describes | O-CH-01 Channel | 1:1 | analyzable/reachable 独立判定不互推；与企业确认矛盾即冻结该格 | DQ-F09-09 |
| R-05 | O-TRANS-01 Order | contains | O-PROD-01 Product | N:M | 订单行粒度；关联销售项单独标注 | T-BR-13；数据契约 §6 |
| R-06 | O-TRANS-01 Order | placedVia | O-CH-01 Channel | N:1 | channel_id 枚举值域约束 | 数据契约 §4 |
| R-07 | O-TRANS-02 MetricFact | measures | O-CH-01 Channel | N:1 | channel_id 为必带统一键 | 数据契约 §4 |
| R-08 | O-TRANS-02 MetricFact | measures | O-PROD-02 Category | N:1 | category_id 必带；主品类口径 | 同上 |
| R-09 | O-TRANS-02 MetricFact | measures | O-PROD-01 Product | N:1 | 可选维度；ASIN/SKU 粒度时必带 | 同上 |
| R-10 | O-TRANS-02 MetricFact | measures | O-CONS-01 ConsumerSegment | N:1 | 可选维度；cohort 类必带 | 同上【推】 |
| R-11 | O-TRANS-02 MetricFact | derivedFrom | 〔R〕Snapshot 数据快照 | N:1 | 必带 snapshot_id+snapshot_hash；无回放即拒绝进证据包 | DQ-F09-01 |
| R-12 | O-TRANS-02 MetricFact | boundTo | O-CONS-03 CompetitorSet | N:1 | 仅 SOV/密度类必带 competitor_set_version；无版本引用拒绝计算 | DQ-F09-08 |
| R-13 | O-INV-01 InventoryPosition | of | O-PROD-01 Product | N:1 | 在库/在途/可售/库龄四数量分列 | SCN-007/008 |
| R-14 | O-CONS-02 VOCSignal | about | O-PROD-01 Product | N:1 | 可选；原文级带时间戳与渠道标识 | SCN-002 §输入 |
| R-15 | O-CONS-02 VOCSignal | about | O-PROD-02 Category | N:1 | 品类级聚合时必带 | 同上 |
| R-16 | O-CONS-02 VOCSignal | fromChannel | O-CH-01 Channel | N:1 | 渠道标识必带；跨平台不混算 | SERVICE-IDENTITY-SCOPE §2.3 |
| R-17 | O-CONS-02 VOCSignal | evidences | O-CONS-01 ConsumerSegment | N:M | 细分假设须有 VOC 证据支撑 | SCN-002【推】 |
| R-18 | O-CONS-03 CompetitorSet | contains | 竞品条目〔候选〕 | 1:N | 版本化；成员变更升版本号不静默替换 | F-046；DQ-F09-08 |
| R-19 | O-BRAND-01 BrandAssetMetric | measures | Brand〔brand_id〕 | N:1 | L2 六项+归因方法/窗口/置信度前提必填 | KPI 字典 §3/§4 |
| R-20 | O-BRAND-01 BrandAssetMetric | about | O-PROD-02 Category | N:1 | 品类渗透率口径约束（T-BR-05） | 同上 |
| R-21 | O-BRAND-01 BrandAssetMetric | forSegment | O-CONS-01 ConsumerSegment | N:1 | 可选；人群段限定指标必带 | 同上【推】 |
| R-22 | O-BRAND-02 BrandSignal | involves | O-PROD-02 Category | N:1 | 信号须可回溯来源与时间窗 | BVS-09 P1 |
| R-23 | O-BRAND-02 BrandSignal | involves | O-CH-01 Channel | N:1 | 同上 | 同上 |
| R-24 | O-BRAND-02 BrandSignal | involves | O-CONS-03 CompetitorSet | N:1 | 竞品相关信号须绑定版本 | DQ-F09-08 |
| R-25 | O-BRAND-03 CoverageGap | locatedAt | (O-CH-01 Channel × O-PROD-02 Category × O-CONS-01 ConsumerSegment) | 三元 | 三维坐标必填；Amazon/DTC 口径分列不合并单值 | SCN-002 契约类7-25 |
| R-26 | O-BRAND-04 BrandAssetDiagnosis | basedOn | O-BRAND-02 BrandSignal | N:M | 每条诊断结论带证据引用 | BVS-09 P2 |
| R-27 | O-BRAND-04 BrandAssetDiagnosis | basedOn | O-BRAND-01 BrandAssetMetric | N:M | 区分相关性与可干预因果 | BVS-09 P2 boundary |
| R-28 | O-BRAND-04 BrandAssetDiagnosis | identifies | O-BRAND-03 CoverageGap | N:M | 缺口须带三维坐标与口径分列 | SCN-002 契约 |
| R-29 | O-BRAND-05 BrandActionPackage | addresses | O-BRAND-03 CoverageGap | N:M | 每方案声明双层预期+护栏+停止条件+依赖 | BVS-09 P3 |
| R-30 | O-BRAND-06 BrandCommsPlan | serves | Brand〔brand_id〕+ O-BRAND-01 BrandAssetMetric | N:M | 12 字段产物结构；外发动作仅 Action Intent 移交 | RPB-AGT-029 §5；契约类6 |
| R-31 | O-CONS-04 EvidencePack | contains | O-TRANS-02 MetricFact / O-CONS-02 VOCSignal / 〔R〕Snapshot | N:M | 来源齐全率 100%；每条带来源/版本/新鲜度/冲突/缺口标注 | SCN-002 契约类7-27 |
| R-32 | O-CONS-05 DiagnosisRecord | analyzes | 市场信号集（BrandSignal/VOCSignal/MetricFact） | N:M | 事实/假设/反证/不确定性分列；不满足证据充分则缩小结论范围 | SCN-002 契约类4-14 |
| R-33 | O-CONS-06 DecisionPackage | concludes | O-CONS-01 ConsumerSegment 机会点 | N:M | 每条结论带证据强度分级+可证伪条件+三级来源标注 | SCN-002 契约类1/2 |
| R-34 | O-CONS-06 DecisionPackage | proposes | 〔R〕Action Intent → 下游场景 Case | N:M | 本 Case 不执行外部动作；验证方式指向 SCN-011/013 等 | SCN-002 契约类4-16 |

## 4. JSON Schema（模型结构定义）

机器可读模型实例见同目录 `semantic-object-model-v0.json`，符合以下结构：

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "SemanticObjectModelV0",
  "type": "object",
  "required": ["model_id", "version", "status", "objects", "relations"],
  "properties": {
    "model_id": {"const": "SEMANTIC-OBJECT-MODEL-V0"},
    "version": {"const": "0.1-draft"},
    "status": {"const": "DESIGN_ONLY"},
    "objects": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "domain", "kind", "definition", "term_refs", "source"],
        "properties": {
          "id": {"pattern": "^O-(PROD|TRANS|CH|INV|BRAND|CONS)-\\d{2}$"},
          "name": {"type": "string"},
          "domain": {"enum": ["商品", "交易", "渠道", "库存", "品牌资产", "消费者"]},
          "kind": {"enum": ["entity", "artifact"]},
          "definition": {"type": "string"},
          "key_attrs": {"type": "array", "items": {"type": "string"}},
          "term_refs": {"type": "array", "items": {"pattern": "^T-[A-Z]{2}-\\d{2}$"}},
          "source": {"type": "string"}
        }
      }
    },
    "relations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "subject", "predicate", "object", "cardinality"],
        "properties": {
          "id": {"pattern": "^R-\\d{2}$"},
          "subject": {"type": "string"},
          "predicate": {"type": "string"},
          "object": {"type": "string"},
          "cardinality": {"type": "string"},
          "constraint": {"type": "string"},
          "source": {"type": "string"}
        }
      }
    }
  }
}
```

## 5. 引用层对象（不重复定义，仅登记依赖）

| 对象 | 权威定义 | 本模型中的角色 |
| --- | --- | --- |
| Case / Case Charter | D-025；SCN-002 STG-02 | 业务范围与验收条件的载体（品牌×品类×市场×时间窗） |
| Stage Artifact / ArtifactEnvelope | D-024/053；T-MT-03/06 | 阶段产物与交接信封 |
| Action Intent / Action Receipt Set | D-029；T-MT-02/CO-06 | 模型提议与 Broker 执行回执 |
| NoActionRecord | T-MT-04；SCN-002 STG-07 | 诊断型 Case 正常终点 |
| Snapshot 数据快照 | 数据契约 §5；SERVICE-IDENTITY-SCOPE §3 | 证据单元（snapshot_id/hash/extracted_at/operator_ref/scope_pack_version） |
| Scope Pack 范围包 | SERVICE-IDENTITY-SCOPE §2 | 五源版本化读取范围（FLOW09_*_V1） |
| EXPORT_OPERATOR / SERVICE_IDENTITY / MODEL_SURFACE | SERVICE-IDENTITY-SCOPE §1 | 三类身份（详见 SEMANTIC-PERMISSION-V0） |
| Policy Gate / Execution Broker | D-029；T-MT-07 | 模型外判定与执行 |
| CoverageMatrix 三位一体覆盖矩阵 | T-CH-09；SKL-BRAND-01 | 场景×媒体×渠道网格视图（CoverageGap 的聚合视图） |
| BrandAttributionReport 品牌归因报告 | BVS-09 P5 | 长周期归因产物 |
| Pre-Case Exception | D-026 | 建单前歧义记录 |

## 6. 候选扩展（v0 未建，下迭代按场景就绪度评估）

- **SettlementRecord 结算记录**（SCN-016 对账证据包元素，交易域第 3 对象候选）；
- **ReplenishmentSignal 补货信号 / PurchaseCommitment 采购承诺**（SCN-007/006，库存/交易域候选）；
- **Listing 商品内容**（商品×渠道呈现层，comp_listing_snapshot 对象化候选）；
- **Competitor 竞品条目**（CompetitorSet 的成员对象化，R-18 宾语占位）；
- **非品牌域对象**：随 ONTOLOGY-READINESS 分级逐域扩展，本表不预留。

## 7. 边界声明

- 本模型为**设计态语义层**：不表示任何对象已实例化、不表示数据已接入、不构成业务授权；
- `term_refs` 仅引用术语表条目 ID，不复制口径——口径变更以术语表+数据契约为准；
- 关系表的「口径约束」列是语义约束（什么必须同时成立），不是运行时校验规则；运行时强制由数据契约 DQ-F09 十规则承担；
- 评审通过后状态为 v0 基线，SKL-BRAND 契约 `ontology_dependencies.object_refs` 已回填本模型对象 ID。

## 评审记录

- 2026-11-24：用户逐条评审通过，升 v0 基线。确认项：entity/artifact 二分、MetricFact 归交易域、库存域 v0 仅建 InventoryPosition、R-25 三元关系表达、引用层 11 项登记方式均无误。
- 后续维护：候选扩展 5 项（SettlementRecord/ReplenishmentSignal/PurchaseCommitment/Listing/Competitor）随场景就绪度评估按需建模；非品牌域对象不在本表预留。
