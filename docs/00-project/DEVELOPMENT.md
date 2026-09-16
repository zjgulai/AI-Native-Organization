# 长期项目知识

## 项目性质

这是一个通过连续访谈形成经营方案和 PRD 的文档项目。用户要求连续完成总体规划，再集中决定关键取舍；可以标注的未知项不阻断候选稿形成。`dist/`提供PRD、组织图谱、岗位目录和价值流目录的静态交互Site投影；它不是业务运行入口。实际平台配置与业务执行仍依赖相应决定、企业连接和授权。

## 信息归属

| 内容 | 唯一主要记录位置 |
| --- | --- |
| 当前阶段与下一步 | `docs/00-project/STATUS.md` |
| 决策前置条件和本轮问题 | `docs/00-project/DESIGN-TREE.md` |
| 企业事实与来源 | `docs/01-discovery/FACTS.md` |
| 用户原意、回答与追问 | `docs/01-discovery/interviews/` |
| 已确认与待确认的经营取舍 | `docs/00-project/DECISIONS.md` |
| 已澄清业务词汇 | `CONTEXT.md` |
| 重要且难逆转的取舍 | `docs/adr/`，当前有ADR-0001至ADR-0012 |
| 场景与职责结构数据 | `docs/05-agents/role-catalog.json`、`docs/07-orchestration/collaboration-graph.json` |
| v2组织责任主图 | `docs/04-organization/AI-ORGANIZATION-MAP.md`、`docs/04-organization/organization-graph.json` |
| v2 Agent管理主图 | `docs/05-agents/AGENT-MANAGEMENT-GRAPH.md`、`docs/05-agents/agent-management-graph.json` |
| v2岗位Bundle与生命周期 | `docs/05-agents/AGENT-LIFECYCLE.md`、`docs/05-agents/agent-lifecycle.json` |
| v2八阶段协同与Case记录 | `docs/07-orchestration/COLLABORATION-GRAPH.md`、`docs/07-orchestration/collaboration-graph.json`、`docs/07-orchestration/case-record-contract.json` |
| 场景、角色、规则与协作解释 | `docs/03-scenarios/` 至 `docs/09-governance/` |
| 12条端到端价值流双视图 | `docs/03-scenarios/END-TO-END-VALUE-STREAMS.md`、`docs/03-scenarios/e2e-value-streams.json` |
| 平台事实与配置 | `docs/10-platform/deepseek-harness/` |
| 原始来源索引 | `docs/14-research/SOURCES.md` |
| 验收要求及需求追踪 | `docs/13-prd/PRD.md` |
| 中文交互Site | `dist/index.html`、`dist/styles.css`、`dist/app.js`、`dist/data/` |
| 首个BVS-01试点章程 | `docs/12-rollout/BVS-01-SHOPIFY-DTC-PILOT-CHARTER.md` |
| 当前BVS-01数据契约 | `docs/08-data/BVS-01-SHOPIFY-DTC-DATA-CONTRACT.md`、`docs/08-data/bvs-01-shopify-dtc-data-contract.json` |
| 后续Amazon渠道模板 | `docs/08-data/BVS-01-AMAZON-US-DATA-CONTRACT.md`、`docs/08-data/bvs-01-amazon-us-data-contract.json` |

其他文档链接主要记录，不复制易变事实。资料冲突时保留双方依据并提出待决问题，不覆盖历史理由。

## 编号与状态

- `F-xxx`：事实；`D-xxx`：决定；`Rxx-Qx`：访谈问题。
- `SCN-xxx`：业务场景；`FLOW-xx`：跨职能流程；`AGT-xxx`：AI 岗位；`PB-xxx`：Playbook。
- `H-*`：历史真人责任类别。Agent-first v1.1初始运行不使用该类别；未来启用HITL时才重新定义，不是既定真人编制。
- `REQ-xxx`：需求；`EVD-xxx`：外部或平台证据。
- 文档模板中的占位编号不是正式登记项；确定用途时分配编号。
- 对尚未决策的内容使用“待确认”或“候选”；“已决定”必须链接用户回答或明确指示。
- “已验证”注明对象、版本/范围、方法、时间与结果；资料可见只证明资料存在。

## 建模约束

50已经明确为AI岗位类型数，GMV为第一优先级；100亿人民币的财务/GMV定义与年度仍待核对。角色类型、能力包、运行实例、任务并发、未来真人组织和供应商投入分别核算。经营可行性需要同时考虑正常任务、工具失败和自治异常；省下的人工时间不直接等于可削减的编制。

组织材料总览2354与19项明细合计2352并不一致，21部门的口径亦未闭合；不静默修正或据此推导裁撤。OEM与内部研发可以并存；产品线集中不等于只售单个SKU。

岗位卡是职责与行为设计，业务技能名称不代表已实现工具。D-053之后，50个岗位各自拥有独立Soul Contract、Role Playbook和Preset Blueprint，可独立处理边界清晰的岗位任务，也可由模型外Case Control编排为Lead/Worker组队；组队通过ArtifactEnvelope交接，不使用隐式岗位聊天。D-020的“岗位不是运行Agent目录”语义由D-053替代，但五契约、Bundle生命周期、Action Intent与模型外执行控制继续有效。AGT-002旧的LLM多Agent路由语义仍由模型外Case Control替代。`role-catalog.json`、`docs/05-agents/roles/souls/`、`docs/06-playbooks/role-playbooks/`和`docs/10-platform/deepseek-harness/preset-blueprints/`是岗位设计资产，仍不是目标Harness导入配置；140条历史岗位-流程关系只是能力来源，51条场景-价值流关系仍待业务验证。修改岗位或流程时，同步卡片、总表、JSON、Soul、Role Playbook、Preset Blueprint、四层图谱、自主运行模型与PRD的直接相关内容。

v2图谱分为组织责任、场景协同、Agent管理和资产边界。正常Action Intent由模型在STG-07提出；Emergency Guard只能按已发布规则生成固定保护Intent。两类Intent都由模型外Policy Gate与Execution Broker控制Service Identity、资产写入、幂等和回执。Presentation Tool只表达展示意图；服务端补齐权威事实，Site负责渲染。长期记忆由独立任务异步提取；经营事实和决策/执行账分别留在system-of-record与Decision/Event Ledger。

D-021确认四平面主视角：经营管理5、业务运营35、独立控制5、数据与Agent平台5。每个岗位必须恰好属于一个组织平面；原8个责任域作为正交业务视角保留。四平面边表示目标、结果、检查和能力供给，不表示行政汇报、Agent消息或权限。

D-022确认五契约管理：每个岗位必须引用Business、Skill、Runtime、Access和Assurance契约；AI岗位和治理岗位都只能提出候选变更，`self_publish`必须为false。确定性门禁只能在已有公司目标、访问上限与保障门槛内自动发布；目标变化、扩权或降低控制需要新公司级契约。

D-023确认不可变Role Release Bundle与七状态生命周期。任何Case必须固定一个Bundle；配置变化创建新Bundle。当前尚无Bundle实例，因此岗位生命周期字段保持null/未实例化，不能因文档完成写成Draft、Shadow或Production。

D-024确认全部价值流和场景共用八阶段产物门禁协议。每个Stage Attempt都有独立Stage Acceptance Record；STG-06 Assurance Decision、STG-07 Execution Attempt和STG-08 Verified Receipt分别建模。Case状态与Bundle生命周期分离；Waiting、Rework Required和Frozen必须持久化`REC-CASE-EXCEPTION`及恢复门禁，执行状态不明时在权威查询落账前禁止产生或重放动作。异步记忆失败不阻塞已经完成的Case关闭。

D-025确认一张Case在STG-02只绑定一条主价值流和一个主场景，并使用`case_dedupe_key`防止重复建单；Case必须同时保留去重规则引用与版本，确保键可重算。跨价值流信号拆成共享`correlation_id`的独立Case；各Case分别固定主岗位、Bundle、资源、状态与关闭结果。每张Case必须拥有独立且可为空的`resource_reservation_refs`集合，关联Case不能共用预留记录，预留记录也不授予资产权限。跨Case引用必须把来源Case、Artifact ID、产物版本、Hash与实际接收该Artifact的ACCEPT记录绑定为同一证据链。51条flow-scenario关系仍是候选。

D-026确认FLOW-07的模型外确定性Emergency Guard。STG-01信号先完成接收；命中一条已发布互斥规则且D-025唯一绑定成立后，本地事务将Case、STG-02 Charter/Acceptance、Guard Decision、固定Action Intent、Policy Decision和ALLOW时的Emergency Execution Outbox一起提交。若规则、主场景或范围在建单前不唯一，只生成Pre-Case Exception并冻结信号范围，不创建Guard Decision、残缺Case或动作记录；零匹配结论不含规则或Case引用。本地事务结果未知时也先使用Pre-Case Exception，按账本证明Case已提交后才转为Case Exception。Broker只能消费已提交、未过期的Outbox；外部副作用与本地事务分开，以幂等键和权威回执对账。Emergency Guard不持有Service Identity，不由模型选参或扩围，不完成STG-07；恢复、扩大范围、外部承诺、退款、召回、销毁和永久变更只走正常STG-07。规则、阈值、模板、Service Identity和生产范围仍未配置。

D-028确认模型评估与选型、缓存参数和异步记忆边界。模型选型以Case闭环成功率为首要指标，联动SLA、冻结率和单位案例成本；复杂/高风险场景可触发复核模型。Prompt Cache边界固定为静态前缀（Business/Runtime/Stage/Bundle/人格/技能摘要）并与租户、workspace、版本隔离，易变层和敏感明细不上共享缓存。异步记忆由独立任务从已关闭Case提取结构化候选，异步提取失败不重开Case。任何模型参数、预算目标和SLA变更须在Runtime Contract与评测闸道变更，不由模型本身修改。

D-029确认Action Intent与执行分离：模型只提出Action Intent，不持有Service Identity；Policy Gate独立裁决（ALLOW/HOLD/DENY/NO_ACTION）；Execution Broker独立执行并按幂等键与回执对账，资产边界未明确时默认拒绝。未配置动作为例默认NoActionRecord，紧急动作仍按D-026单向最小模板，不代替正常STG-07恢复与补偿动作。

D-031确认两层价值流：FLOW-01至FLOW-08继续作为业务经营流，并以BVS-01至BVS-08提供产品视图；CVS-01至CVS-04分别管理岗位Bundle、Skill绑定、连接器验收和可回退Release。业务流以业务结果与外部回执闭环，能力流以可复用能力产品闭环。两层流通过版本引用与关联Case连接，状态和验收相互独立；能力发布成功不等于经营成功。每条流同时维护产品方案和分工协作投影；D-053新增独立Role Preset和受控Lead/Worker协作模式。

D-033至D-035确认首个运行样本为Momcozy美国Shopify主站、可穿戴式吸奶器、3–10个高GMV SKU和滚动30天，由AGT-023担任主人格；试点原始GMV固定为`gross_sales`，折扣、销售冲销、退款、税费、运费、支付状态和结算现金分别保留。Shopify只作为首个渠道事实入口：外部广告花费与回执、ERP/WMS可承诺库存和成本、QMS质量准入保持独立权威来源。`PILOT-G1A`通过不能替代跨系统`PILOT-G1B`。具体Shop GID、SKU白名单、App身份和Scopes在实例化前保持未确认。

D-036选择新建试点专用Shopify Dev Dashboard App。模型只调用受限逻辑读取工具，Client Secret和Access Token不得进入Prompt、Skill、Case Artifact、Site或仓库；模型外Policy Gate先校验Shop/SKU/时间窗/字段/Query Hash，Connector再经Token Broker取短期Token。基础Scope包不默认包含`read_reports`，ShopifyQL及其他条件Scope按真实数据缺口和Protected Customer Data条件逐项增加。该决策当时未固定Organization关系和认证路径，后续由D-037补齐。

D-037确认美国主站与试点专用App归属于同一Shopify Organization，认证路径固定为`client_credentials`。实现顺序固定为：在Dev Dashboard创建专用App、发布含最小Scopes的配置版本、安装到目标Shop、Token Broker使用Client ID/Secret换取短期Token、读回Shop身份与`currentAppInstallation` Scopes；任何一步失败都保持Draft并冻结调用。App、安装、Token和真实API调用仍未发生，模型继续只能看到受限工具与脱敏回执。

D-038固定首批Variant/SKU范围清单的生成方法：使用现有权威报表中目标Shop本地时区最近30个完整自然日，按D-035 `gross_sales`聚合并稳定排序，先截取原始Top 5，再由AGT-018、AGT-017和AGT-027分别提供质量、缺货和账号风险结论；`UNKNOWN`与`BLOCKED`均剔除且不向后回填。最终3–5个才能由AGT-050封存为带版本与Hash的Scope Manifest，少于3个保持HOLD。D-039确认来源类别后，结构化清单进入`DRAFT_REPORT_IDENTITY_PENDING`，具体报告与真实成员仍未确认。

D-039把首批排名的权威来源固定为目标商店的Shopify Admin Analytics CSV导出。来源类别、具体报告、导出快照和最终成员分别建模：只有来源类别已确认时，Manifest保持`DRAFT_REPORT_IDENTITY_PENDING`。首选候选是`Total sales by product variant`，但必须在目标Shop实测Variant/SKU粒度、`Gross sales`、`Net quantity`、过滤器和导出选项；缺字段时HOLD，不按产品级销售分摊，也不以`net_sales`或`total_sales`代替。若报告不含稳定Variant GID，使用单独核验的商品主数据快照完成SKU到GID的一一映射。原始CSV只进批准的企业对象存储，仓库与Site只保留来源引用、配置摘要、Hash、Schema Hash、行数及脱敏结果；D-039不触发`read_reports` Scope或任何连接授权。

D-040进一步固定官方`Total sales by product variant` CSV为首份快照配方。目标Shop现场验收必须记录报告实际引用、必需维度/指标、时间窗、币种、时区、过滤配置、界面实际导出选项文本、全部合格行完整性、文件SHA-256、Schema Hash和行数；不能预设界面一定存在“Full report”按钮。缺字段、只取得页面/分页子集、过滤不可重现或SKU到Variant GID映射非唯一时进入`HOLD_REPORT_CAPABILITY_MISMATCH`，不得自动切换自定义报告或ShopifyQL。在D-041作出前，Manifest状态为`DRAFT_TARGET_SHOP_CAPABILITY_PENDING`；该状态随后由D-041推进。

D-041把产品家族成员的权威来源类别固定为目标Shopify商店的商品字段。成员判定发生在Product层，Variant只继承父Product判定，再通过唯一SKU/Variant GID与销售报告求交集；不得使用标题模糊匹配、模型语义分类或销售表现反推成员。在D-042作出前，Product type、tag和metafield的具体主选择器仍未确认，Manifest使用`DRAFT_MEMBERSHIP_SELECTOR_AND_TARGET_SHOP_CAPABILITY_PENDING`；该临时状态随后由D-042推进。

D-042把唯一主选择器类型固定为Shopify Product metafield，并要求目标Shop存在可读取的Metafield Definition和可重放的Product值快照。选择器类型确认与具体字段定义确认分开记录：definition ID、namespace/key、类型、允许值、期望值、规范化、访问设置和覆盖率均未确认时，状态为`DRAFT_METAFIELD_DEFINITION_AND_TARGET_SHOP_CAPABILITY_PENDING`，`selector_kind_confirmed=true`但`field_definition_confirmed=false`。不得回退到Product type、tag、标题或模型推断；定义缺失、值非法、字段冲突、快照不可重放或Product→Variant→SKU映射非唯一时继续`HOLD_PRODUCT_FAMILY_MEMBERSHIP_AMBIGUOUS`。

D-043固定专用Definition契约：`custom.product_family`、`ownerType=PRODUCT`、`single_line_text_field`、初始预设值`wearable_breast_pump`，成员谓词是规范化存储值的精确相等。设计确认不等于目标Shop实例确认：结构化契约必须分别记录`definition_contract_confirmed=true`、`definition_instance_verified=false`、`definition_id=null`与`seed_coverage_verified=false`。覆盖验收前字段缺失按歧义HOLD处理；覆盖验收通过后，缺失或其他合法值才能按非成员解释。任何同名不兼容Definition、未受控值、大小写/空白漂移或运行时自动规范化都HOLD。初始只需要Admin API读取，Storefront与Customer Account暴露默认关闭；创建Definition和回填Product值属于另行授权的写入动作。

D-044固定一次性负责人确认的Shopify Product GID清单为首次填充种子。初始化清单与持续权威必须分开：清单仅在覆盖验收前提供待写入集合，验收通过后`custom.product_family`成为持续权威，清单保留为不可变审计证据。清单至少绑定`shop_ref`、全量Product目录快照引用/Hash、清单版本/Hash、负责人确认引用、唯一Product GID和期望值；仓库只保存脱敏契约和引用。覆盖验收必须同时满足Definition实例无冲突、清单GID解析率100%、重复/跨Shop为0、负责人对同一目录快照的完整性确认、获批回填后目标值读回率100%及快照可重放。任一项未满足时`seed_coverage_verified=false`，未列入或缺值仍HOLD；选择种子不授予Shop读取、Definition创建或字段写入权限。

D-045把目标Shop实施拆为只读预检和后续写入两个独立授权面。只读预检必须按身份/Scopes读回、Definition冲突审计、全量Product目录快照、种子清单对账、报告能力核验的顺序生成不可变`READ_ONLY_PREFLIGHT_EVIDENCE_PACK`；不得混入Definition创建、`metafieldsSet`、商品修改或App配置扩权。Definition审计固定三态：`ABSENT`只允许形成创建计划，`COMPATIBLE`只允许形成复用/回填计划，`INCOMPATIBLE`进入`HOLD_PRODUCT_FAMILY_MEMBERSHIP_AMBIGUOUS`且禁止自动覆盖或迁移。写入方案必须引用预检包Hash、声明目标对象/前置值/期望值、分批与停止规则、读回验收和恢复策略，并在另行授权前保持不可执行。

D-046将Shopify权限拆为三份不可混用的证据：声明Scope、`currentAppInstallation.accessScopes`实际读回Scope、已发布Query/字段白名单。首批声明集合固定为`read_products`、`read_orders`、`read_inventory`、`read_locations`和`read_markets`；30天订单窗口不需要`read_all_orders`，Admin Analytics CSV导出不触发`read_reports`，`read_customers`和全部`write_*`同样排除。实际集合缺失或多余都进入`HOLD_SCOPE_MISMATCH`。`read_orders`属于Protected Customer Data访问面；在等级、字段、脱敏、存储/保留和批准证据确认前，只能声明而不能发布订单Query模板。凭据、短期Token与实际Scope回执仍由模型外Token Broker/Connector处理，不能进入Prompt、Skill、Case Artifact、Site或仓库。

D-047把`read_orders`固定为Level 1最小必要数据面。Query必须先以静态Allowlist排除姓名、地址、邮箱、电话、Customer主档、客户旅程/营销同意、IP、Token、备注、自定义属性、Metafield、Tag、员工、支付和状态URL等字段；响应再做严格Schema校验，出现GraphQL顶层/字段错误、意外字段、脱敏`null`或PCD资格不一致时整页失败，不接受部分成功。原始响应仅在Connector内存中完成规范化后销毁；原始Order GID不得暴露给模型，模型和Tool UI只接收SKU日聚合与证据计数。生产数据不得进入开发/测试、仓库、Site、Prompt、Skill或长期记忆。`ORDER_LINE_WINDOW_V1`继续保持禁用，直到Level 1资格、实际Scope、字段Schema/Query Hash、保留策略和删除/访问日志测试全部有证据。

D-048把规范化订单行的可持久化窗口固定为45天加密保留，分解为30天经营窗口和15天晚到/重放缓冲。TTL从Shop时区源业务日结束时起算，期满后24小时内硬删除；主存储、索引、缓存和备份必须同TTL或可验证crypto-erasure，不允许开发副本。每日删除任务只发布策略版本、到期/删除计数和时间戳，不发布行ID或客户数据；删除、访问审计或备份TTL测试失败即`HOLD_RETENTION_DELETE_FAILURE`，停止新订单读取与数据集发布。法律保全等例外只能经模型外独立审批进入隔离存储，不能修改一般45天政策。聚合SKU日Case Artifact使用独立证据保留政策，且不得包含Order/Customer标识。

D-049把Level 1资格核验固定为目标Dev Dashboard现场只读证据，不以development store替代。资格必须先按App类型解释：public app需要review；custom app和admin-created custom app的Level 1按Shopify官方矩阵为always available。政策可用性不等于目标实例、Scope或运行访问已验证。证据包先读回Organization/App/Shop关系、App类型/分发、生命周期、声明Scope和Data protection requirements；任何创建、保存、发布、安装、review提交、Secret/Token处理或API调用都属于独立授权。浏览器停在连接验证或登录页时只记录`BLOCKED_BROWSER_CONNECTION_VERIFICATION`，不得推断目标App事实。

D-050补充了更早的业务事实门：Shopify当前是空白新店且无上线产品。D-033至D-049继续作为未来存量GMV场景的目标合同，但不能再被写成当前已有SKU、报表、订单或App实例。D-051把现实前沿收敛为完整方案审阅与`SHOP-G1`店铺治理方案，不创建Case或执行Shopify动作。未来另行授权后，FLOW-04店铺底座、FLOW-02产品准备与FLOW-06数据工具才按D-025建立共享`correlation_id`但状态独立的关联Case；产品上线并形成连续30个完整销售日后才可能启动FLOW-01 Shadow。Level 1现场取证移到`SHOP-G6`，报表/Top 5/产品家族覆盖移到`SHOP-G7`；延期状态既不是失败，也不是运行验收通过。完整方案源索引见[方案地图](../02-strategy/SOLUTION-MAP.md)，绿地阶段门见[Shopify路线](../12-rollout/SHOPIFY-GREENFIELD-ROADMAP.md)。

五个参考项目按固定源码快照静态核查，公共README能力宣称、代码实现与本地运行结果分别记录。Hive公共源码基线不代表当前发行包；StaffDeck自有Harness不等于DeepSeek Harness。DeepSeek上游、社区Desktop、本机定制安装与企业目标部署分别辨识。

## 文档验证方法

写入前检查 branch 与工作区。写入后检查内部相对链接、编号引用、状态一致性、未决项是否被误写为事实，以及 Git 空白错误；首次创建文件尚未跟踪时，同时检查文件自身。

独立岗位资产还要核对50份Soul Contract、50份Role Playbook、50份Preset Blueprint的ID、引用、模式和生产授权状态一致，并验证standalone与Lead/Worker两种运行说明都存在。

v2完成前继续核对50个唯一岗位ID、50张岗位卡、50份Role Playbook、50份Preset Blueprint、8流程、20场景和8份共享Playbook不丢失。v2结构检查还须核对：12条端到端价值流为8条BVS与4条CVS；BVS与原FLOW一一映射且角色并集覆盖50/50；每条流有5个产品步骤、5个协作步骤、有效结果负责人、完整role_scope、协作角色不越界和production_authorized=false；文档目录与Site投影语义一致。每个Case只有一个主价值流、一个主场景和一个Lead结果负责人；Worker只消费已验收ArtifactEnvelope，不能共享隐式会话或转授权限；跨价值流信号的关联Case状态独立且只引用已验收产物；Skills不携带第二人格；8阶段、64条flow-stage绑定、51条候选flow-scenario绑定和140条历史role-flow覆盖一致；每个阶段有产物与接收记录；STG-01不要求case或Bundle；Bundle从STG-03固定；Case状态不使用Quarantined；Agent管理对象引用Prompt/Skill/Tool/Model/Eval/Memory版本；普通动作与紧急保护均经过Policy Gate和Execution Broker；Emergency Guard为模型外且只限FLOW-07，原子边界只覆盖本地Case/Outbox记录，建单前歧义只能产生Pre-Case Exception，紧急Attempt不充当STG-07且TTL不自动恢复；Service Identity不属于模型；所有生产授权为false。检查结果只证明文档与设计数据一致。

新增长期方法记录须从本文件和领域入口可达。当前人力与成本方法见[容量和成本模型](../02-strategy/CAPACITY-AND-COST.md)，组织覆盖方法见[职责承接表](../04-organization/RESPONSIBILITY-MAP.md)。

50个岗位的Soul、Role Playbook、Preset Blueprint和Site资产由`scripts/build-role-assets.mjs`从`docs/05-agents/role-catalog.json`生成；修改岗位目录后运行`node scripts/build-role-assets.mjs`，再执行50项资产契约、JSON、链接和`git diff --check`验证。生成物仍是设计资产，不能当作DSH导入配置。

目标Harness版本必须先对齐：企业材料描述的在建平台与本机LUTE Agentic System安装包不是同一版本证据。MCP、native tool、API、hook和tool UI各自进入工具能力登记册，资料列出的系统不等于已有读写权限。当进入代码或配置阶段，先依据实际平台版本补充运行和测试方式，再修改本记录。不得提前编造命令或宣称平台可导入。

## Site投影规则

Site是已确认设计资产的交互视图，不建立独立业务事实。完整方案域以`docs/02-strategy/SOLUTION-MAP.md`为导航，Shopify当前实施顺序以`docs/12-rollout/SHOPIFY-GREENFIELD-ROADMAP.md`为准；岗位内容以`docs/05-agents/role-catalog.json`为准，原8条业务流程以`docs/03-scenarios/FLOW-CATALOG.md`为准，12条端到端双工作流以`docs/03-scenarios/e2e-value-streams.json`为结构化权威目录；`dist/data/e2e-workflows.json`只是发布投影，必须保持语义一致。源文档变化时同步更新`dist/data/`及对应页面表述，并复核50岗位、四平面5/35/5/5、BVS/CVS为8/4、BVS岗位覆盖50/50、每流双工作流完整且全部生产授权为false。站点可用性验证至少覆盖HTML入口、CSS/JavaScript/JSON本地引用、JavaScript语法、岗位与价值流数量、负责人/协作角色引用、桌面与移动视口以及本地HTTP响应。

页面必须持续区分设计基线、运行配置、企业系统连接、影子/有限运行和生产验收。Site中的筛选、卡片与图谱用于理解和决策，不获得Policy判定、业务写入或system-of-record地位。

Shopify绿地阶段、组织变革阶段和经营试点阶段必须使用不同命名空间：`SHOP-G*`、`ORG-G*`和`PILOT-G*`。禁止在没有命名空间时写“进入G1/G2”，以免把方案审阅、店铺实施和经营试点混为同一门。

D-051之后，Shopify当前交付始终标为“店铺治理方案包”，不是Case实例、真实配置或开店实施。D-052允许GitHub与GitHub Pages公开发布方案；发布验收必须分别记录本地检查、commit、push、Actions workflow、Pages控制面和公网内容，任何一层成功都不能替代下一层。

## 持续更新

本文件记录稳定方法和项目整体知识。单轮回答进入访谈，经营选择进入决策，临时进度进入 STATUS，避免本文件变成任务流水账。
