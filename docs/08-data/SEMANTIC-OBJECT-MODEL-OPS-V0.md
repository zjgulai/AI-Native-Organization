# 运营域对象-关系模型 v0.1-draft（轻量语义层）

状态：**v0.1 基线**（2026-11-24 用户逐条评审通过）。DESIGN_ONLY，不构成业务授权、无生产数据。本模型是[D-079](../00-project/DECISIONS.md)「语义层按域扩展·先运营域」的第二项交付物：覆盖产品层规划 v5 经营场景 S1~S10（37 细分场景/91 项通用工作）的核心对象。**范围边界**：平台运营域（SH*/AM*/TT*/MP* 的 15 细分/26 项平台特有工作）为下迭代；品牌域对象沿用 [SEMANTIC-OBJECT-MODEL-V0](SEMANTIC-OBJECT-MODEL-V0.md)（O-PROD/TRANS/CH/INV/BRAND/CONS 20 对象），本模型只新增运营域并引用既有对象。术语口径以 [SEMANTIC-GLOSSARY-OPS-V0](SEMANTIC-GLOSSARY-OPS-V0.md) 为准；品牌域术语以 [SEMANTIC-GLOSSARY-V0](SEMANTIC-GLOSSARY-V0.md) 为准。

来源标注：【显】=权威文档已定义；【推】=本模型归纳待评审；【数】=待企业数据回填。

## 1. 范围与约定

- **运营域 12 对象**：实体 9 / 工件 3；对象 ID 前缀 `O-OPS-*`；
- **与品牌域模型的关系**：并行不映射（D-079）——本模型的 WorkItem/SubScenario 是产品交付单元，与品牌域 Case/SCN 是组织协同单元，两套编号长期共存，跨体系引用须显式标注来源；
- **类型分两类**：`entity`=业务实体（持续存在），`artifact`=场景/流程工件（有生命周期）；
- **引用既有对象**：O-PROD-01 Product、O-CH-02 ChannelAccount、O-TRANS-02 MetricFact、O-CONS-01/02/05 等品牌域对象以〔B〕标注直接引用，不重复定义；
- **引用层对象**：规则与授权（T-OP-36）、口径确认卡（T-OP-22）、品牌资料（T-OP-35）、共用依据五件套为产品侧概念，登记于 §5 不对象化；
- **不做**：不定义数据库表/ER 图、不做推理规则、不含实例数据。

## 2. 对象表（12 个）

| ID | 名称 | 类型 | 定义 | 关键属性 | term_refs | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| O-OPS-01 | Market 目标市场 | entity | 国家/地区级经营单元；分市场动作的聚合坐标 | market_id 枚举、语言/币种/时区、阶段（测试/放量/品牌） | T-OP-01 | 产品规划 v5 S1【显】 |
| O-OPS-02 | ProductFactSheet 商品资料事实表 | entity | 全局共用依据：商品规格、卖点、能说/不能说的话；版本化 | 版本、字段集（规格/卖点/禁用宣称）、适用市场 | T-OP-06 | v5 §00/§07【显】 |
| O-OPS-03 | Listing 商品页 | entity | 商品在某平台账号×市场的呈现单元 | listing_ref、关联 Product/账号/市场、健康状态、内容版本 | T-OP-07/08/09 | v5 1.3/1.4【显】 |
| O-OPS-04 | ComplianceRequirement 合规要求 | entity | 分市场×品类的准入要求条目 | 要求类型（认证/关税/禁限/标签）、适用市场×品类、有效期、法规版本 | T-OP-04 | v5 1.1 + S10.2【显】 |
| O-OPS-05 | SubScenario 细分场景 | entity | 52 个工作容器：一个问题/一个使用人/一个可验收结果 | 编号（S*/SH*/AM*/TT*/MP*）、所属大类、交付物定义 | T-OP-33 | v5 §03/§05/§06【显】 |
| O-OPS-06 | WorkItem 工作项 | entity | 117 项可验收原子工作；三种交付方式 | 交付方式（一次交办/定时例行/项目阶段）、验收标准、交付结果定义、状态 | T-OP-32 | v5 §03【显】 |
| O-OPS-07 | CustomerTier 客户分层 | entity | RFM/价值/行为分层；触达/权益/预警基础 | 分层规则版本、层级定义、市场/渠道限定 | T-OP-25 | v5 9.1【显】 |
| O-OPS-08 | ReplenishmentSignal 补货信号 | entity | 销量预测→补货建议→在途跟踪的信号流 | 产品、市场、建议量、在途状态、提前期假设 | T-OP-19 | v5 5.1【显】（品牌域候选对象升级） |
| O-OPS-09 | SettlementRecord 结算记录 | entity | 平台结算/扣款/退款的资金事实 | 渠道账号、期间、结算分量（销售/平台费/仓储/退款/税）、币种 | T-OP-24 | v5 6.3/6.4【显】（品牌域候选对象升级） |
| O-OPS-10 | MarketEntryPack 进入决策包 | artifact | S1.1 交付物：进入/观望/不进入+依据+反证 | 结论三态、依据链、反证条件、可证伪条件 | T-OP-02 | v5 1.1【显】 |
| O-OPS-11 | ImprovementSheet 老品改良单 | artifact | S2.3 交付物：商品该改什么+本品问题 vs 品类共性 | 改动项、证据引用、复盘挂钩（月度复盘验证） | T-OP-18 | v5 2.3【显】 |
| O-OPS-12 | WorkAcceptance 工作验收记录 | artifact | 每项工作「交到客户手里」的验收凭证 | 验收结论（接受/退回）、验收人、依据核对结果 | T-OP-32 | v5 §01/§03【显】 |

## 3. 关系表（18 条）

基数标记：`1:N`=一对多、`N:M`=多对多（经中介）、`1:1`=一对一。〔B〕=品牌域既有对象引用；〔R〕=引用层登记。

| ID | 主语 | 谓词 | 宾语 | 基数 | 口径约束 | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| R-OPS-01 | O-OPS-01 Market | hosts | O-CH-02〔B〕ChannelAccount | 1:N | 一个账号通常服务一个市场；跨市场账号按市场分列实例 | v5 平台运营【推】 |
| R-OPS-02 | O-OPS-02 ProductFactSheet | describes | O-PROD-01〔B〕Product | 1:1 | 版本化；一份事实表对应一个商品；变更触发 1.4 同步链 | v5 §07【显】 |
| R-OPS-03 | O-OPS-03 Listing | presents | O-PROD-01〔B〕Product | N:1 | 同一 Product 可有多个 Listing（平台×市场笛卡尔） | v5 1.3【显】 |
| R-OPS-04 | O-OPS-03 Listing | listedOn | O-CH-02〔B〕ChannelAccount | N:1 | 必经账号中介；跨源映射未验证标 unmapped | 数据契约 §4 |
| R-OPS-05 | O-OPS-03 Listing | targetedAt | O-OPS-01 Market | N:1 | Listing 的本地化维度（T-OP-08）挂在市场上 | v5 1.3【推】 |
| R-OPS-06 | O-OPS-04 ComplianceRequirement | appliesTo | (O-OPS-01 Market × O-PROD-02〔B〕Category) | 二元矩阵 | 分市场×品类双键；法规版本化，有效期必填 | v5 1.1+S10.2【显】 |
| R-OPS-07 | O-OPS-06 WorkItem | belongsTo | O-OPS-05 SubScenario | N:1 | 每个工作项归属唯一细分场景；117 项 ↔ 52 场景 | v5 §03【显】 |
| R-OPS-08 | O-OPS-05 SubScenario | groupedUnder | S1~S10 大类 / 平台组 | N:1 | 经营场景 10 类+平台运营 4 组两层归属 | v5 §03【显】 |
| R-OPS-09 | O-OPS-06 WorkItem | uses | O-OPS-02 ProductFactSheet | N:M | 商品资料是全局共用依据；上新/客服/内容/洞察/平台均引用 | v5 §07【显】 |
| R-OPS-10 | O-OPS-06 WorkItem | governedBy | 〔R〕规则与授权（T-OP-36） | N:1 | 读取+出草稿自动；写入店铺/对外动作必须客户确认 | v5 §00【显】 |
| R-OPS-11 | O-OPS-06 WorkItem | verifiedBy | O-OPS-12 WorkAcceptance | 1:N | 每项工作有验收标准与「交到客户手里的结果」；退回须带原因 | v5 §01【显】 |
| R-OPS-12 | O-OPS-08 ReplenishmentSignal | for | O-PROD-01〔B〕Product | N:1 | 补货建议按商品×市场粒度 | v5 5.1【推】 |
| R-OPS-13 | O-OPS-08 ReplenishmentSignal | in | O-OPS-01 Market | N:1 | 同上；跨平台分配（MP2）时按市场汇总 | v5 MP2【推】 |
| R-OPS-14 | O-OPS-09 SettlementRecord | settledVia | O-CH-02〔B〕ChannelAccount | N:1 | 结算挂账号；币种随市场 | v5 6.3【推】 |
| R-OPS-15 | O-OPS-09 SettlementRecord | covers | O-OPS-01 Market | N:1 | 结算期间×市场粒度 | 同上【推】 |
| R-OPS-16 | O-OPS-07 CustomerTier | segments | O-CONS-01〔B〕ConsumerSegment | N:M | 分析细分与运营分层可交叉但不互替；同一群组双标签 | v5 9.1【推】 |
| R-OPS-17 | O-OPS-10 MarketEntryPack | evaluates | (O-OPS-01 Market × O-OPS-04 ComplianceRequirement × O-OPS-05 SubScenario「1.1」) | 复合 | 结论三态+依据+反证+可证伪条件；输入含成本测算（T-OP-05） | v5 1.1【显】 |
| R-OPS-18 | O-OPS-11 ImprovementSheet | addresses | O-PROD-01〔B〕Product | N:1 | 每商品一张改良单；本品问题 vs 品类共性须分列 | v5 2.3【显】 |

## 4. JSON Schema（模型结构定义）

机器可读模型实例见同目录 `semantic-object-model-ops-v0.json`，结构与品牌域模型一致，差异仅在 ID 前缀与域枚举：

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "SemanticObjectModelOpsV01",
  "type": "object",
  "required": ["model_id", "version", "status", "objects", "relations"],
  "properties": {
    "model_id": {"const": "SEMANTIC-OBJECT-MODEL-OPS-V01"},
    "version": {"const": "0.1-draft"},
    "status": {"const": "DESIGN_ONLY"},
    "objects": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "kind", "definition", "term_refs", "source"],
        "properties": {
          "id": {"pattern": "^O-OPS-\\d{2}$"},
          "name": {"type": "string"},
          "kind": {"enum": ["entity", "artifact"]},
          "definition": {"type": "string"},
          "key_attrs": {"type": "array", "items": {"type": "string"}},
          "term_refs": {"type": "array", "items": {"pattern": "^(T-OP|T-CH|T-BR|T-CO|T-PR|T-CN|T-MT)-\\d{2}$"}},
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
          "id": {"pattern": "^R-OPS-\\d{2}$"},
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
| 规则与授权 | T-OP-36；v5 §00 共用依据 | WorkItem 的授权边界（出草稿自动/对外动作客户确认） |
| 口径确认卡 | T-OP-22；v5 §07 | S6/MP3/9.1 共用经营口径单一来源 |
| 品牌资料 | T-OP-35；v5 §00 | 所有对外表达的品牌宪法输入 |
| 共用依据五件套 | v5 §00 | 商品资料/品牌资料/口径卡/规则授权/数据连接 |
| 店铺与数据连接 | v5 §00 | 各平台店铺、广告、评论、客服的数据来源（客户自配凭证） |
| Action Receipt / 客户确认流 | D-029；v5 §08 | 「客户确认」动作的回执载体（执行型标杆授权模型） |
| 七条主线 | v5 §07 | SubScenario→SubScenario 的接力链视图（上新/口碑/机会/经营/品牌/复购/新平台） |

## 6. 候选扩展（v0.1 未建，下迭代按场景就绪度评估）

- **平台运营域对象**：FBA 库存/库容、GMV Max 投放、店铺体验分、达人档案、短视频脚本、直播场次——随平台域迭代（T-PF 或并入 OP）评估；
- **PurchaseCommitment 采购承诺**：品牌域 deferred 候选，本域 S5 采购成本可承接，暂并入 WorkItem 不单列；
- **Competitor 竞品条目**：品牌域 deferred 候选，运营域 S2.2/S3.3 高频使用，建议两域共建时统一对象化；
- **AdDelivery 投放记录 / Campaign**：广告复盘（T-OP-12）的对象化候选，当前以 MetricFact+WorkItem 覆盖；
- **PolicyAlert 政策与关税变更**：S10.2 的对象化候选（法规版本事件）。

## 7. 边界声明

- 本模型为**设计态语义层**：不表示任何对象已实例化、不表示数据已接入、不构成业务授权；
- 产品规划 v5 全部能力为设计状态（v5 §08 边界）；本模型不改变「对外动作由客户执行」的产品边界；
- `term_refs` 引用 OPS 与品牌域两套术语表 ID；跨体系引用（WorkItem↔Case）须显式标注来源（D-079）；
- 评审通过后状态升 v0.1 基线，产品页/试点资产地图同步登记。

## 评审记录

- 2026-11-24：草稿产出，用户逐条评审通过（12 对象/18 关系全过），升 v0.1 基线。
