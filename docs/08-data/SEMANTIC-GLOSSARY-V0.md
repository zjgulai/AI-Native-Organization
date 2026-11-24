# 品牌域语义术语表 v0（SKOS-lite）

状态：**v0 基线**（2026-11-24 用户逐条评审通过）。DESIGN_ONLY，不构成业务授权。本表是[FLOW-09-ONTOLOGY-PILOT](FLOW-09-ONTOLOGY-PILOT.md) §3-1 的首个交付物：品牌域高频术语 48 条，优先消歧「Amazon 口径 vs DTC 口径 vs 内部口径」的同名异义。评审记录：48 条全部通过；证据强度分级刻度（T-CN-04）维持【推】待 G1 数据就绪后定档；覆盖缺口聚合维度确认=渠道×品类×人群段。

## 使用约定

- **ID 规则**：`T-{域}-{序号}`，域代码：CH=渠道、BR=品牌资产、CO=交易、PR=商品、CN=消费者、MT=方法与治理；
- **semantic_tag**：FLOW-09-DATA-CONTRACT 字段回填与 SKL-BRAND `ontology_dependencies.term_ids` 引用的目标；
- **消歧优先**：标「消歧」的条目是同名异义高发区，引用时必须带渠道/口径限定；
- **维护**：术语口径变更走 AGT-045 口径仲裁流程；本表 v0 未覆盖的域术语在对应场景就绪度评估时按需扩充。

## 渠道域（T-CH）

### T-CH-01 渠道 channel
- 定义：品牌触达消费者的交易/内容场域；本试点枚举为 Amazon US、Shopify DTC、社交媒体（五平台）、DME/保险、其他平台。
- 别名：channel / 销售渠道 / 触点
- 消歧：「渠道」在 FLOW-09 语境=品牌资产经营场域；在 FLOW-01 语境=订单归属渠道。同一 channel_id 两流共用。
- 口径：`channel_id` 枚举见 FLOW-09-DATA-CONTRACT §4（amazon_us/dtc_shopify/social_*/dme_insurance/retail_*）。
- 来源：FLOW-09-DATA-CONTRACT §4【显】

### T-CH-02 Amazon US
- 定义：Momcozy 美国站 Amazon 渠道；Brand Registry + Business Reports + Brand Analytics 三层资格已开通。
- 别名：Amazon / 亚马逊美国站
- 消歧：数据「可分析、受限、不可触达」——买家身份与触达动作不可得；与 DTC 的「可分析+可触达」严格分层，不混用结论口径。
- 口径：报表滞后 2–3 周（DQ-F09-07）；周粒度不插值为日（DQ-F09-02）。
- 来源：F-042/F-045/F-047【显】

### T-CH-03 Shopify DTC 独立站
- 定义：Momcozy 独立站（momcozy.com），Shopify 原生 customer 体系；首个试点主渠道。
- 别名：DTC / 独立站 / dtc_shopify
- 口径：可分析+可触达；customer 体系支撑 CRM 级复购/留存指标。
- 来源：F-041【显】

### T-CH-04 社交媒体渠道
- 定义：Instagram/TikTok/YouTube/Facebook/LinkedIn 五平台集合，channel_id 前缀 `social_`。
- 别名：社媒 / 社交渠道
- 口径：声量与情感为代理指标（proxy grade + low confidence）；可触达状态以 F-048 确认为准。
- 来源：FLOW-09-DATA-CONTRACT §3.3【显】

### T-CH-05 DME/保险渠道
- 定义：Durable Medical Equipment 保险报销渠道（Aeroflow/Edgepark 等），channel_id=`dme_insurance`。
- 别名：DME / 医疗器械保险渠道
- 口径：可触达（F-049）；保险核销占比与现金购买占比口径待核实（`dme_channel_mix`）。
- 来源：FLOW-09-DATA-CONTRACT §3.4【显】

### T-CH-06 可分析 analyzable
- 定义：数据资产两级分级之一——该渠道数据可被读取、聚合与分析。
- 别名：可分析级 / analyzable
- 消歧：与「可触达」是两个独立维度；Amazon 数据可分析但不可触达，二者不得互相推断。
- 来源：书2 ch24 三分法 + F-045【显】

### T-CH-07 可触达 reachable
- 定义：数据资产两级分级之二——品牌可基于该渠道数据向用户发起主动触达（内容/广告/客服）。
- 别名：可触达级 / reachable
- 消歧：「触达」=品牌→用户的主动动作能力；不是「数据可下载」。Amazon 报表可下载≠可触达买家。
- 来源：SCN-002 §输入 + DQ-F09-09【显】

### T-CH-08 覆盖缺口 coverage gap
- 定义：目标人群×品类×渠道组合中品牌应有触点而实际缺失或弱势的格子；SCN-002 首个诊断产物。
- 别名：coverage gap / 覆盖缺口诊断
- 消歧：**Amazon 口径**=平台内品类搜索/BSR/份额代理下的可见度缺口；**DTC 口径**=独立站流量/转化/人群段覆盖缺口；两口径分列输出，不合并成单一分数。
- 口径：聚合维度=渠道×品类×人群段（SCN-002 语义契约类7-25）。
- 来源：SEMANTIC-CONTRACT-SCN-002【显】

### T-CH-09 三位一体覆盖矩阵
- 定义：场景×媒体×渠道三维覆盖网格，SKL-BRAND-01 的核心产物结构。
- 别名：覆盖矩阵 / 三位一体
- 口径：每格必须有证据引用或显式 unknown，禁止无证据填 covered。
- 来源：SKL-BRAND-01 quality_gates【显】

## 品牌资产域（T-BR）

### T-BR-01 品牌资产 brand asset
- 定义：品牌在认知、考虑、声量、渗透、复购、价格感知六维沉淀的长期资产；对应双层 KPI L2 层。
- 别名：品牌资产指标 / brand asset
- 消歧：①= L2 六指标族（机器口径）；②=书2「品牌资产」叙事框架（五要素，非指标）；③=FLOW-09 价值流名「品牌资产经营」。引用时须指明层级。
- 来源：FLOW-09-DUAL-KPI-CATALOG + SEMANTIC-CONTRACT-AGT-029 类3-9【显】

### T-BR-02 品牌认知度
- 定义：目标人群中能正确识别品牌的比例。
- 口径：定量调研测量；无调研预算时以代理指标降级并标注（F-043）。
- 来源：FLOW-09-DUAL-KPI-CATALOG §3【显】

### T-BR-03 品牌考虑度
- 定义：目标人群购买考虑清单中的出现率。
- 口径：同认知度，季度滚动 12 个月，置信度前提=定量样本。
- 来源：同上【显】

### T-BR-04 声量份额 SOV
- 定义：品牌内容/广告声量占品类比例。
- 口径：`品牌 mention_volume / (品牌+7类竞品 mention_volume)`，分母版本化绑定竞品集（F-046）；须固定监测口径；书中「SOV 与份额正相关」仅方向依据非承诺。
- 消歧：与「市场份额」不同——SOV 是声量占比不是成交占比。
- 来源：FLOW-09-DATA-CONTRACT §3.3【显】

### T-BR-05 品牌渗透率
- 定义：品类渗透率 × 品牌渗透率。
- 口径：依赖品类渗透率输入；口径缺失时分列输出，不合成单值。
- 来源：FLOW-09-DUAL-KPI-CATALOG §3【显】

### T-BR-06 复购/留存
- 定义：老客复购率与会员留存。
- 消歧：**DTC 口径**=Shopify CRM 完整可触达；**Amazon 口径**=买家身份不可触达，只能近似推断，必须标注。
- 来源：FLOW-09-DUAL-KPI-CATALOG §3【显】

### T-BR-07 价格感知
- 定义：愿付溢价/促销依赖度。
- 口径：调研+价格测试，半年窗口；无调研时不可测，记缺口不估算。
- 来源：同上【显】

### T-BR-08 偏好度/NPS 类
- 定义：购买偏好与推荐意愿的代理度量。
- 口径：评论情感分析为代理指标，须标注偏差；非标准 NPS 调研。
- 来源：同上【显】

### T-BR-09 L1 当期核算层
- 定义：双层 KPI 第一层——当期（周/月）GMV/订单/转化/花费/ROAS 直接核算。
- 消歧：与 L2 严格分层；L1 异常只触发护栏复核，不自动推翻 L2 结论。
- 来源：FLOW-09-DUAL-KPI-CATALOG §1【显】

### T-BR-10 L2 品牌资产层
- 定义：双层 KPI 第二层——长周期（季度起，归因窗口 6–24 个月）品牌资产分项追踪。
- 口径：每指标须声明归因方法（AB/MTA/MMM/代理降级）；品牌广告观察窗不得短于 6 个月。
- 来源：同上 §1/§4【显】

### T-BR-11 品牌原则与传播方案
- 定义：AGT-029 立言的主产物；包含范围、输入版本、证据、判断、建议或 Action Intent、结果与未解决项。
- 别名：传播方案 / 立言产物
- 来源：RPB-AGT-029 §5【显】

### T-BR-12 品牌定义/品牌理想版本
- 定义：SCN-002 机会判断的对照基准；出自 BRAND-GROWTH-METHODOLOGY §5 与书2 ch13。
- 消歧：与「品牌定位」（AGT-029 技能名）相关但不同——定义是判断基准，定位是策略产出。
- 来源：SCN-002 §责任与参与者【显】

### T-BR-13 关联销售 associated_sales
- 定义：主品类之外的配件/内衣等连带销售。
- 口径：单独标注，不计入主品类覆盖/渗透口径；证据包验收须含品类边界应用证明。
- 来源：FLOW-09-DATA-CONTRACT §6【显】

## 交易域（T-CO）

### T-CO-01 GMV
- 定义：渠道成交金额合计；FLOW-01 试点固定口径=`gross_sales`（D-035）。
- 消歧：与净额（net of discounts/refunds）严格区分——折扣、销售冲销、退款、税费、运费、支付状态、结算现金各自独立分量，不以静默净额替代。
- 口径：币种、退款窗口、促销口径须与 AGT-045 契约一致；不同时区不混算。
- 来源：D-035 + KPI 字典 §2【显】

### T-CO-02 订单量/客单价
- 定义：订单数与件单价。
- 口径：耐用品注意配件与订阅混入（关联销售边界同 T-BR-13）。
- 来源：KPI 字典 §2【显】

### T-CO-03 ROAS/广告花费
- 定义：投放消耗与平台归因成交比。
- 消歧：平台归因仅作参考值，非增量结论；SKL-BRAND-02 强制局限声明。
- 来源：KPI 字典 §2【显】

### T-CO-04 转化率/点击率
- 定义：渠道内漏斗指标。
- 消歧：**DTC 口径**=站点闭环可归因；**Amazon 口径**=平台口径，不可跨渠道直接比较。
- 来源：KPI 字典 §2【显】

### T-CO-05 新客/老客占比
- 定义：首购 vs 复购结构占比。
- 消歧：Shopify CRM 完整；Amazon 侧买家身份不可触达，占比只能近似并标注。
- 来源：同上【显】

### T-CO-06 Action Receipt Set
- 定义：FLOW-09 P4 受控执行产物——逐对象执行回执、拒绝与异常记录。
- 消歧：与「Action Intent」（提议）严格区分：Intent 是模型提议，Receipt 是 Broker 执行回执。
- 来源：BVS-09 product_workflow P4【显】

## 商品域（T-PR）

### T-PR-01 品类 category
- 定义：商品分类层级；试点主品类=`wearable_breast_pump`（可穿戴式吸奶器）。
- 口径：category_id 枚举由数据契约固定；品类边界判定在 Product 层，Variant 继承。
- 来源：FLOW-09-DATA-CONTRACT §4 + D-041~043【显】

### T-PR-02 SKU/Variant
- 定义：库存量单位；Shopify 侧为 Variant，Amazon 侧为 ASIN/SKU，跨源映射未验证标 `unmapped`。
- 口径：首批白名单=权威报表最近 30 天 gross_sales Top5 经质量/缺货/账号风险门剔除（D-038）。
- 来源：D-038/D-040【显】

### T-PR-03 品类边界
- 定义：主品类与关联销售的判定规则。
- 口径：吸奶器主品类；配件/内衣=关联销售单独标注（F-044）。
- 来源：FLOW-09 试点章程【显】

## 消费者域（T-CN）

### T-CN-01 人群段/消费者细分
- 定义：按需求/行为/价值划分的消费者群组；SCN-002 诊断对象之一。
- 别名：segmentation / 人群包
- 来源：SCN-002 §经营目的【显】

### T-CN-02 VOC
- 定义：Voice of Customer——店铺评论、客服工单、退货原因、社媒评论/私信的原文级信号。
- 口径：原文级、带时间戳与渠道标识；去重后保留分布。
- 来源：SCN-002 §输入【显】

### T-CN-03 三级来源标注
- 定义：量化表述的强制来源标签——【实测 / 书中报告 / 假设】。
- 消歧：机器可读枚举=data_grade：`measured`/`proxy`/`book_reported`/`hypothesis`；书中量化倍数（2.5x/3x/4.3x 等）仅方向依据，禁止当实测或考核基准。
- 来源：SCN-002 §验收 + FLOW-09-DATA-CONTRACT §4 + KPI 字典 §3【显】

### T-CN-04 证据强度分级
- 定义：市场机会判断包中每条结论的置信标注。
- 口径：分级刻度【推·待评审微调】；每条结论必须带可证伪条件。
- 来源：SEMANTIC-CONTRACT-SCN-002 类1-2【显】

### T-CN-05 竞品集合 competitor_set
- 定义：纳入监测与 SOV 分母的竞品清单；版本化管理。
- 口径：7 类竞品+4 订阅监控工具（F-046）；SOV/密度计算必须引用 `competitor_set_version`，无版本引用即拒绝计算（DQ-F09-08）。
- 来源：FLOW-09-DATA-CONTRACT §3.5/§5【显】

## 方法与治理域（T-MT）

### T-MT-01 八阶段协议
- 定义：STG-01 信号接收 → STG-02 建单 → STG-03 上下文装配 → STG-04 证据与诊断 → STG-05 方案产物 → STG-06 Assurance 门禁 → STG-07 受控动作 → STG-08 核验与关闭。
- 口径：产物驱动、门禁推进；岗位通过主人格/Skills/阶段产物贡献，不形成岗位 Agent 消息链。
- 来源：D-024【显】

### T-MT-02 Action Intent
- 定义：模型对业务动作的结构化提议（对象、参数摘要、预期效果、策略引用、幂等键）。
- 消歧：≠执行——是否允许由模型外 Policy Gate 判定（ALLOW/HOLD/DENY/NO_ACTION），Execution Broker 持有 Service Identity 执行。
- 来源：D-029【显】

### T-MT-03 ArtifactEnvelope
- 定义：Worker→Lead/Case 的产物交接格式（来源 Case、阶段、产物类型、schema 版本、Hash、业务范围、验收状态）。
- 消歧：与隐式会话/岗位聊天严格区分——不共享会话、不互转授权限。
- 来源：D-053/RPB §6【显】

### T-MT-04 NoActionRecord
- 定义：诊断型 Case 的预期关闭产物——完成诊断但不产生任何资产动作。
- 口径：SCN-002 预期路径；不等于失败，是「证据→判断→移交」的正常终点。
- 来源：SCN-002 §业务闭环 STG-07【显】

### T-MT-05 Case Charter / case_dedupe_key
- 定义：建单契约（主价值流/主场景/主岗位/业务范围/完成条件）与防重键。
- 口径：一张 Case 只绑定一条主价值流+一个主场景（D-025）；同 dedupe_key 命中直接关联既有 Case。
- 来源：D-025 + SCN-002 STG-02【显】

### T-MT-06 已验收 Stage Artifact 引用
- 定义：跨 Case 只读引用前序已验收产物的机制。
- 别名：REC-CROSS-CASE-ARTIFACT-REF
- 口径：只引用已验收产物；版本更新时由下游 Case 自行判定是否重验。
- 来源：D-025 + SCN-002 §接管与恢复【显】

### T-MT-07 Policy Gate / Execution Broker
- 定义：模型外确定性门禁（判定）与执行代理（持有 Service Identity、幂等执行、回执）。
- 口径：模型只提 Action Intent；资产边界未在 Access Contract 声明的动作/对象/金额/频率/范围默认拒绝。
- 来源：D-029【显】

### T-MT-08 授权位
- 定义：各类资产动作的独立授权开关；当前全部 false。
- 口径：翻转需独立评审，不因路线图/本表自动生效；高风险动作逐对象审批。
- 来源：D-029 + ROADMAP【显】

### T-MT-09 PILOT-G0~G4 门禁
- 定义：经营试点五阶段门（范围环境/受控读取/影子闭环/有限动作/扩展）。
- 消歧：与 ORG-G0~G5（组织变革门）、SHOP-G0~G7（店铺绿地门）三套编号并存，引用须带前缀。
- 来源：STATUS 门禁命名约定【显】

### T-MT-10 DESIGN_ONLY / 设计基线
- 定义：全部资产的当前状态标记——设计完成但无生产授权、无数据接入、无实例化。
- 口径：任何「已设计」表述不得写成「已上线/已验证」。
- 来源：全项目边界声明【显】

### T-MT-11 语义底座 semantic layer
- 定义：本试点新增的第六层——业务本体·术语表·事理规则·权限语义的轻量表达（Markdown+JSON Schema）。
- 口径：不建语义数据库、不引入 RDF/OWL；技术栈选型待 FLOW-09 试点验证后评估。
- 来源：SEMANTIC-LAYER-STRATEGY【显】

### T-MT-12 「29 句话」模板
- 定义：书3 §6.1 范式的中文化——7 类 29 式自然语言模板，显性知识 AI 提炼+隐性知识专家提取。
- 来源：KNOWLEDGE-ELICITATION-29【显】

### T-MT-13 本体就绪度
- 定义：场景对语义建模的适配评估——语义复杂度/规则明确度/合规要求/动作风险四维，输出优先/可选/暂不三档。
- 来源：ONTOLOGY-READINESS【显】

### T-MT-14 FFA
- 定义：书3 核心框架——事实（F）/事理（F）/行动（A）一体化动态模型；本项目轻量映射：事实=阶段产物、事理=门禁规则、行动=Action Intent。
- 口径：仅作解释框架，不引入形式化推理。
- 来源：SEMANTIC-LAYER-STRATEGY【显】

## 口径速查（高频消歧对照）

| 术语 | 易混点 | 正确口径 |
| --- | --- | --- |
| 覆盖 | 场景×媒体×渠道矩阵 vs 渠道覆盖缺口 vs 品牌覆盖率 | 按语境区分，引用带限定词 |
| 触达 | 数据可下载 vs 品牌可主动触达用户 | T-CH-07：后者才是 reachable |
| 复购 | DTC CRM 完整 vs Amazon 近似 | 分渠道标注，不可合并 |
| GMV | gross_sales vs 净额 | D-035 固定 gross_sales，分量分列 |
| 声量 | SOV 声量占比 vs 市场份额 | 声量≠成交 |
| 渗透率 | 品类渗透率 vs 品牌渗透率 | T-BR-05 是二者乘积 |
| 品牌资产 | L2 指标族 vs 书2 五要素 vs 流程名 | T-BR-01 消歧三层 |
| Intent/Receipt | 提议 vs 执行回执 | 模型外 Broker 才产生 Receipt |

## 待回填与扩展

- `term_ids` 引用：SKL-BRAND-01~04 的 `ontology_dependencies.term_ids` 已从 PENDING_GLOSSARY_V0 回填本表 ID；
- 阈值类条目（差评率越阈、证据分级刻度、覆盖率公式、差异容忍度）待 G1 数据就绪后在对应契约回填，本表只固定术语不固定数值；
- 非品牌域术语（FLOW-01/03/04 等）随场景就绪度评估按需扩充。
