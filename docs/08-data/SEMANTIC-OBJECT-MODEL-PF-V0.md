# 平台运营域对象-关系模型 v0.1-draft（轻量语义层）

状态：**v0.1 基线**（2026-11-24 用户逐条评审通过）。DESIGN_ONLY，不构成业务授权、无生产数据。本模型是[D-079](../00-project/DECISIONS.md)「语义层按域扩展」的第四个交付物：覆盖产品层规划 v5 平台运营组（Shopify SH1~4 / Amazon AM1~2 / TikTok Shop TT1~5 / 多平台协同 MP1~4，共 15 细分/26 项平台特有工作）的核心对象。**范围边界**：跨平台通用对象已在 [SEMANTIC-OBJECT-MODEL-OPS-V0](SEMANTIC-OBJECT-MODEL-OPS-V0.md)（O-OPS-* 12 对象），本模型只新增平台特有对象并引用 OPS/品牌域既有对象。

来源标注：【显】=权威文档已定义；【推】=本模型归纳待评审；【数】=待企业数据回填。

## 1. 范围与约定

- **平台域 14 对象**：实体 11 / 工件 3；对象 ID 前缀 `O-PF-*`；
- **引用既有对象**：O-PROD-01 Product、O-TRANS-01 Order、O-CH-02 ChannelAccount〔品牌域〕，O-OPS-01~12〔运营域〕以〔B〕/〔O〕标注直接引用，不重复定义；
- **类型分两类**：`entity`=平台侧业务实体（持续存在），`artifact`=交付/应诉工件（有生命周期）；
- **平台版本化**：平台规则、指标、功能随平台版本变化，对象属性中的平台口径标注版本来源；
- **不做**：不定义数据库表、不做推理规则、不含实例数据、不固化任何平台阈值。

## 2. 对象表（14 个）

| ID | 名称 | 类型 | 定义 | 关键属性 | term_refs | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| O-PF-01 | ProductFeed 商品数据源 | entity | 商品数据同步到外部渠道（Google/Meta/AI 购物入口）的分发管道 | feed_ref、目标渠道、字段映射版本、同步状态 | T-PF-03/04 | v5 SH3【显】 |
| O-PF-02 | PageExperiment 页面实验 | entity | Shopify 站点页面 A/B 实验 | 假设、变体、流量分配、实验窗口、结论 | T-PF-02 | v5 SH1【显】 |
| O-PF-03 | MarketConfig 市场配置 | entity | Shopify Markets 分市场技术配置 | 市场、语言/币种/域名、支付/税/运费规则版本 | T-PF-05 | v5 SH2【显】 |
| O-PF-04 | RiskCase 风控案件 | entity | 高风险订单审核+拒付应诉的案件单元 | 订单、风险命中规则、审核结论、拒付状态、应诉时限 | T-PF-06/07 | v5 SH4【显】 |
| O-PF-05 | BrandContent 品牌内容资产 | entity | Amazon A+ 页面/品牌旗舰店/品牌备案材料的品牌内容层 | 内容类型（A+/Store/备案）、关联商品/品牌、审核状态 | T-PF-08/09/10 | v5 AM1【显】 |
| O-PF-06 | FbaRecord FBA 记录 | entity | FBA 入库/库容/赔偿退货核查的记录单元 | 记录类型（入库/库容/赔偿/退货）、货件、期间、状态 | T-PF-11/12 | v5 AM2【显】 |
| O-PF-07 | CreatorProfile 达人档案 | entity | TikTok 达人合作方档案——带货能力/历史合作/内容产出 | 达人 ID、类目、历史 GMV/内容数、合作状态 | T-PF-14/16 | v5 TT2【显】（OPS 域候选对象升级） |
| O-PF-08 | SampleRecord 寄样记录 | entity | 向达人寄样的实物动作记录 | 样品、达人、寄出日期、内容回收状态、效果归因 | T-PF-15 | v5 TT2【显】 |
| O-PF-09 | LiveSession 直播场次 | entity | TikTok 直播场次经营单元 | 场次时间、主播/脚本版本、GMV/转化/新客指标 | T-PF-21 | v5 TT3【显】（OPS 域候选对象升级） |
| O-PF-10 | ShopHealthRecord 店铺健康记录 | entity | TikTok 店铺体验分/违规指标的周期快照 | 期间、体验分、违规记录、处罚状态 | T-PF-19 | v5 TT5【显】 |
| O-PF-11 | PromotionRecord 推广记录 | entity | GMV Max 投放设置与平台活动报名的记录单元 | 类型（gmv_max/平台活动）、目标 ROI、活动期、状态 | T-PF-17/18 | v5 TT4【显】（OPS 域候选对象升级） |
| O-PF-12 | SetupPack 开店建站资料包 | artifact | 开店/建站项目交付物——资料、配置清单、上架方案 | 平台、资料清单、配置项、验收状态 | T-PF-25 | v5 SH/Amazon/TT 开店工作【显】 |
| O-PF-13 | LivePackage 直播策划包 | artifact | 直播场次的策划+脚本+复盘工件 | 脚本版本、排期、复盘结论 | T-PF-21 | v5 TT3【显】 |
| O-PF-14 | DisputePack 应诉材料包 | artifact | 拒付应诉的证据与材料工件 | 证据清单、时限、提交状态（客户执行） | T-PF-07 | v5 SH4【显】 |

## 3. 关系表（18 条）

| ID | 主语 | 谓词 | 宾语 | 基数 | 口径约束 | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| R-PF-01 | O-PF-01 ProductFeed | sourcesFrom | O-OPS-02〔O〕ProductFactSheet | N:1 | feed 字段映射须能回溯事实表版本；渠道适配差异显式标注 | v5 SH3+§07【推】 |
| R-PF-02 | O-PF-01 ProductFeed | distributes | O-PROD-01〔B〕Product | N:M | 一个 feed 可含多商品；跨源映射未验证标 unmapped | 数据契约 §4【推】 |
| R-PF-03 | O-PF-02 PageExperiment | tests | O-OPS-03〔O〕Listing | N:1 | 实验对象是页面呈现；结论须有对照与窗口 | v5 SH1【显】 |
| R-PF-04 | O-PF-03 MarketConfig | configures | (O-OPS-01〔O〕Market × O-CH-02〔B〕ChannelAccount) | 复合 | Shopify Markets 与业务市场一一对应；配置版本化 | v5 SH2【推】 |
| R-PF-05 | O-PF-04 RiskCase | reviews | O-TRANS-01〔B〕Order | N:1 | 审核发生在发货前；拦截/放行是高风险动作（权限 v0.1 B 层） | v5 SH4【显】 |
| R-PF-06 | O-PF-05 BrandContent | features | O-PROD-01〔B〕Product | N:M | A+/Store 挂商品；备案材料挂品牌范围 | v5 AM1【推】 |
| R-PF-07 | O-PF-06 FbaRecord | for | O-PROD-01〔B〕Product | N:1 | FBA 记录按商品×市场粒度 | v5 AM2【推】 |
| R-PF-08 | O-PF-06 FbaRecord | fulfilledVia | O-CH-02〔B〕ChannelAccount | N:1 | 仅 Amazon 渠道账号；币种随市场 | v5 AM2【推】 |
| R-PF-09 | O-PF-07 CreatorProfile | promotes | O-PROD-01〔B〕Product | N:M | 达人带货按商品归因；类目匹配是建联前提 | v5 TT2【推】 |
| R-PF-10 | O-PF-08 SampleRecord | sentTo | O-PF-07 CreatorProfile | N:1 | 寄样是实物+对外承诺动作，须客户确认（权限 v0.1） | v5 TT2【显】 |
| R-PF-11 | O-PF-09 LiveSession | features | O-PROD-01〔B〕Product | N:M | 场次可带多商品；场次 GMV 按商品拆分 | v5 TT3【推】 |
| R-PF-12 | O-PF-09 LiveSession | hostedOn | O-CH-02〔B〕ChannelAccount | N:1 | 仅 TikTok Shop 渠道账号 | v5 TT3【推】 |
| R-PF-13 | O-PF-10 ShopHealthRecord | for | O-CH-02〔B〕ChannelAccount | N:1 | 周期快照；阈值与申诉规则平台版本化 | v5 TT5【推】 |
| R-PF-14 | O-PF-11 PromotionRecord | runsOn | O-CH-02〔B〕ChannelAccount | N:1 | GMV Max/平台活动均绑定账号；预算变更须客户确认 | v5 TT4【显】 |
| R-PF-15 | O-PF-12 SetupPack | for | O-CH-02〔B〕ChannelAccount | N:1 | 开店/建站项目交付物；经 SubScenario（O-OPS-05）归属 | v5 SH/AM/TT【推】 |
| R-PF-16 | O-PF-13 LivePackage | for | O-PF-09 LiveSession | 1:N | 每场次一份策划包；复盘结论回写场次指标 | v5 TT3【推】 |
| R-PF-17 | O-PF-14 DisputePack | for | O-PF-04 RiskCase | 1:1 | 应诉材料一包一案；提交动作客户执行 | v5 SH4【推】 |
| R-PF-18 | O-PF-07 CreatorProfile | measuredBy | O-PF-11 PromotionRecord | N:M | 达人带货效果与投放记录交叉归因（周报 T-PF-16） | v5 TT2+TT4【推】 |

## 4. JSON Schema（模型结构定义）

机器可读模型实例见同目录 `semantic-object-model-pf-v0.json`，结构与 OPS 模型一致，差异仅在 ID 前缀与引用域：

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "SemanticObjectModelPfV01",
  "type": "object",
  "required": ["model_id", "version", "status", "objects", "relations"],
  "properties": {
    "model_id": {"const": "SEMANTIC-OBJECT-MODEL-PF-V01"},
    "version": {"const": "0.1-draft"},
    "status": {"const": "DESIGN_ONLY"},
    "objects": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "kind", "definition", "term_refs", "source"],
        "properties": {
          "id": {"pattern": "^O-PF-\\d{2}$"},
          "name": {"type": "string"},
          "kind": {"enum": ["entity", "artifact"]},
          "definition": {"type": "string"},
          "key_attrs": {"type": "array", "items": {"type": "string"}},
          "term_refs": {"type": "array", "items": {"pattern": "^(T-PF|T-OP|T-CH|T-BR|T-CO|T-PR|T-CN|T-MT)-\\d{2}$"}},
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
          "id": {"pattern": "^R-PF-\\d{2}$"},
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
| 规则与授权 | T-OP-36；v5 §00 | 平台写入/外发动作的客户确认边界（权限语义 v0.1 B 层） |
| 口径确认卡 | T-OP-22；v5 §07 | 跨平台复盘（MP3）与店铺健康口径的共用来源 |
| 商品资料事实表 | O-OPS-02 | ProductFeed/BrandContent/LivePackage 的内容源 |
| Listing/商品卡 | O-OPS-03 + T-PF-13 | PageExperiment/PromotionRecord 的呈现对象 |
| Action Receipt | D-029；权限 v0.1 | B 层动作的客户确认回执载体 |
| 七条主线 | v5 §07 | 平台工作项在接力链中的位置（新平台开通属「新平台」主线） |

## 6. 候选扩展（v0.1 未建，下迭代按场景就绪度评估）

- **Amazon 其他站点对象**：品牌备案/ A+ 在 DE/JP 等站点的本地化变体，随市场覆盖扩展；
- **Walmart/Temu/SHEIN 平台对象**：当前产品边界不含（v5 §01），未来覆盖时按本模型模式扩展；
- **广告投放明细 AdDelivery**：PromotionRecord 已覆盖 GMV Max/活动记录粒度，广告组/关键词级明细待投放数据接入后评估；
- **政策与关税变更 PolicyAlert**：S10.2 的对象化候选（法规版本事件），OPS/PF 两域共用；
- **达人合同/佣金记录**：CreatorProfile 目前只到档案+寄样粒度，合同与佣金结算待 TT2 深化时评估。

## 7. 边界声明

- 本模型为**设计态语义层**：不表示任何对象已实例化、不表示平台数据已接入、不构成业务授权；
- 所有「对平台写入/对外动作」在产品侧一律走客户确认（权限语义 v0.1 B 层），本模型不改变该边界；
- 平台规则阈值（店铺体验分线、FBA 赔偿规则、GMV Max ROI 口径）一律不固化，待平台规则源回填；
- `term_refs` 引用 PF/OPS/品牌域三套术语表 ID；跨体系引用（SubScenario↔SCN）须显式标注来源（D-079）；
- 评审通过后状态升 v0.1 基线，semantic.html 同步登记。

## 评审记录

- 2026-11-24：草稿产出，用户逐条评审通过（14 对象/18 关系全过），升 v0.1 基线。
