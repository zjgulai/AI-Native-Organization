# 决策记录

## 用户已经明确的方向

| ID | 决定或方向 | 依据 | 边界 |
| --- | --- | --- | --- |
| D-001 | 在当前项目建立完整目录、项目级 AGENTS.md 并初始化 Git | 初始请求 | 不包含 commit、push 或上线 |
| D-002 | 按场景组织与编排岗位/AI 分身，覆盖跨境电商管理和运营全链路 | 初始请求 | 具体场景与角色尚未确定 |
| D-003 | 使用 grill-with-docs 逐轮讨论并共同作决定，最终形成完整方案和 PRD | 初始请求及技能说明 | 不把候选建议自动当成批准 |
| D-004 | 以 DeepSeek Harness 作为用户指定的落地目标平台进行核实与设计 | 初始请求 | 不意味着所有所需能力已被平台支持 |
| D-005 | 默认只在 main 分支工作，禁止 worktree，不主动 commit | 用户提供的项目规则 | 用户明确特别指定时按其范围执行 |
| D-006 | 以约50个AI岗位覆盖全部职责 | R01-Q1回答 | 不规定真人总数，不等于50并发或50永久会话 |
| D-007 | GMV为第一优先级；年度规模使用人民币 | R01-Q2回答 | GMV定义、现金和利润约束尚待决定 |
| D-008 | 明确规则和预算内执行，例外升级给人 | R01-Q6回答 | 具体预算、动作和责任人尚未授权 |
| D-009 | 连续形成完整框架性战略，集中呈现关键取舍 | R01-Q7及继续执行指示 | 战略框架已确认；生产配置和业务动作独立授权 |
| D-010 | 重点评估五个指定项目，按最少必要机制适配 | R01后的补充要求 | 不等于采用五套运行时或授权安装 |
| D-011 | 采用“GMV第一、原始GMV/取消退款/经营约束分开呈现”的经营框架 | 用户确认R02-Q1建议，2026-09-11 | 100亿的统计口径、年度和数值阈值仍需首个场景的数据契约确认 |
| D-012 | 场景业务负责人定义目标、数据口径和经营验收，并拥有跨部门协调权；数字化负责可复用数据产品、工具与可靠性 | 用户确认R02-Q2建议，2026-09-11 | 其中“真人责任人作为常规运行节点”的部分已由D-016替代；数据与工具责任划分仍保留 |
| D-013 | 存量GMV经营与新品验证并行；新品拥有独立责任和受保护验证资源 | 用户确认R02-Q3建议，2026-09-11 | “真人责任”的实现方式已由D-016替代；资源比例、首个机会待明确 |
| D-014 | 采用50岗位、8责任域、8条跨职能流程作为战略框架基线 | 用户确认R02-Q4建议，2026-09-11 | 真实负荷可推动岗位合并、拆分或版本调整；不等于真人编制或已上线能力 |
| D-015 | DeepSeek Harness承担AI执行；现有业务系统优先承载持久工单、业务授权与动作回执，缺口才最小补足 | 用户确认R02-Q5建议，2026-09-11 | 目标部署、真实schema、工具和控制服务尚未确认；无生产配置授权 |
| D-016 | 初始运行采用Agent-first自主闭环：50个长期AI岗位按场景动态匹配；不预设真人负责人或常规HITL节点 | 用户回答R03-Q2、Q6，2026-09-11 | 不等于允许任意生产写入；每次工具动作仍受已发布策略、范围、幂等、回执和恢复规则约束 |
| D-017 | Agent可通过MCP、native tools、API及hooks连接业务系统；工具调用结果可以构成主要工作UI/UX | 用户回答R03-Q4，2026-09-11 | 具体连接器、读写范围、身份、schema、权限和生产动作尚未确认；UI不替代业务控制层 |
| D-018 | 现有系统全景图作为连接资产盘点来源；先以系统-of-record与真实接口能力核实为准 | 用户回答R03-Q5及企业材料，2026-09-11 | 文档列出的“上线/在建/规划”状态不证明MCP/API/webhook或授权存在 |
| D-019 | HITL、真人负责人和真人组织目标后置到运行中再决定；当前不纳入初始Agent闭环依赖 | 用户回答R03-Q6、Q7，2026-09-11 | 后续启用须有明确策略、责任和组织决定；物理/专业/法定动作仍只能通过已获准的外部系统或执行主体完成 |
| D-020 | 将“50个Agent”定义为50个逻辑AI岗位分身与责任契约；每张紧耦合场景工单只运行一个Case Agent、绑定一个主岗位人格并按需加载Skills，取消LLM多Agent路由和岗位Agent互聊 | 用户确认R05-Q1建议，2026-09-11；Anthropic Commerce Agent官方方法 | 替代D-016中“50个长期Agent动态编队”的运行语义，不改变50岗位责任覆盖；窄范围只读Delegate可作为工具；资产动作只可由模型外Policy Gate与Execution Broker执行；不授权任何生产连接或写入 |
| D-021 | 50个岗位采用四平面顶层组织视图：5个经营管理、35个业务运营、5个独立控制、5个数据与Agent平台；原8个责任域保留为第二业务视角 | 用户确认R05-Q2建议，2026-09-11 | 四平面表示责任性质、利益冲突隔离和能力供给，不表示行政上下级、运行实例、Agent路由或数据/工具权限 |
| D-022 | 全部50个岗位不设置上级Agent，统一由Business、Skill、Runtime、Access和Assurance五份版本化契约管理 | 用户确认R05-Q3建议，2026-09-11 | AI岗位只能提出配置变更，不能发布自己的Prompt、Skill、Model、Tool、Memory或Policy；低风险变更仅在确定性评测与策略门禁通过后自动发布，目标、资产权限或控制标准变化需新的公司级契约；当前不产生生产授权 |
| D-023 | 五份契约以不可变Role Release Bundle发布；每个Bundle固定版本与Hash，遵循Draft、Evaluated、Shadow、Limited、Production、Quarantined、Retired七状态生命周期 | 用户确认R05-Q4建议，2026-09-11 | Case启动后固定Bundle；任一契约变化产生新Bundle；Rollback是回到上一已知正常Bundle的受控操作；当前50岗位均未实例化Bundle或进入任何运行状态 |
| D-024 | 全部8条价值流和当前20个候选场景统一采用八阶段、产物驱动、门禁推进的单Case Agent协同协议 | 用户确认R05-Q5建议，2026-09-11 | 统一协议不等于20个候选场景已通过企业验证；每单只有一个上下文所有者和一个主岗位人格；岗位能力通过Skills、阶段产物和保障规则贡献；只读Delegate只能返回类型化产物；硬门禁、Policy Gate和Execution Broker均在模型外；逻辑阶段不得跳过，当前未实例化任何Case |
| D-025 | 每张Case只绑定一条主价值流和一个主场景；同一信号触发多条价值流时创建共享`correlation_id`的独立Case，并只通过已验收Stage Artifact引用协作 | 用户确认R05-Q6建议，2026-09-11 | 每张Case分别拥有目标、完成条件、主岗位、固定Bundle、资源预留、异常和关闭结果；相关场景只作引用；51条flow-scenario关系仍是候选，不产生运行实例或生产授权 |
| D-026 | 正常业务全部运行八阶段；FLOW-07命中已发布确定性重大事件规则且唯一Case绑定成立时，允许模型外Emergency Guard经Policy Gate、原子建单Outbox与Execution Broker执行固定、最小范围、只降低暴露的保护动作 | 用户确认R05-Q7建议，2026-09-11 | 绑定前歧义只记录Pre-Case Exception，不创建残缺Case或动作；Guard不能由模型选参或扩围，不能恢复/重新开放、对外承诺、退款、召回、销毁或永久变更；Case仍完整运行八阶段；具体规则、阈值、模板、身份与生产范围未配置或授权 |
| D-027 | 上下文与缓存采用四层、前缀稳定、按引用装配；Global Cache仅在同一企业租户/workspace与版本隔离域复用；客户、员工和业务明细不得进入共享静态层；权威事实长期由system-of-record与Case/Event Ledger维护 | 用户确认R05-Q8建议，2026-09-11 | 缓存中的会话信息不替代真实状态；溢出只保留规则、异常、动作、回执引用；资产权限和模型参数仍由模型外控制，不由上下文层扩权 |
| D-028 | 模型评估与选择采用端到端业务闭环指标为主线，补充SLA、异常冻结率和成本；并行双模型策略用于常规与异常/复杂工单；异步记忆失败不阻塞Case关闭；Prompt Cache固定静态前缀且不缓存客户明细 | 用户确认R05-Q9答案1（推荐），2026-09-11；Anthropic 商业场景实践和D-027缓存边界对齐 | 选择目标模型族、厂商参数、异步提取频率与阈值尚待目标环境版本确认；模型仍不持有资产权限，不直接扩展Action范围 |
| D-029 | 模型只产出 Action Intent，模型外统一裁决与执行：Policy Gate输出 `ALLOW/HOLD/DENY/NO_ACTION`；Execution Broker 持有Service Identity并进行幂等执行与回执核对 | 用户确认R05-Q10答案1（推荐），2026-09-11 | 对外承诺、退款、召回、销毁、账号变更和永久性动作不在本决策中放开；未配置动作模板/对象范围/预算/并发规则前默认拒绝 |
| D-030 | 首个自主经营样本范围（历史选择） | R04-Q1、用户确认建议1（选项1），2026-09-11 | 原定Amazon US、1个账号/店群、3–10个高GMV SKU、30天窗口；执行顺序已由D-033改为Shopify DTC先行，Amazon契约保留为后续模板 |
| D-031 | 在既有8条业务经营流外增加4条正交能力供应流；每条流同时维护产品方案与分工协作两个投影 | 用户要求深度整合Magpie-Horch端到端闭环并要求MECE，2026-09-16；ADR-0011 | 原FLOW-01至FLOW-08、Playbook和Case唯一性不变；四条能力流分别以岗位Bundle、Skill绑定、连接器验收和可回退Release闭环；不产生岗位Agent互聊或生产授权 |
| D-032 | BVS-01当前不选择Amazon SP-API、RootData或数智星图作为可执行只读入口；后续候选入口为Shopify | 用户选择首个只读入口选项4并补充“后面会从Shopify入口进”，2026-09-16 | 记录的是当前可用性与后续方向，不是连接授权或接口验收；Shopify不能直接充当Amazon渠道事实，除非后续证明它承载了可追溯的Amazon同步数据 |
| D-033 | 首个真实经营闭环切换为Shopify DTC先行；Amazon US不再是首个执行样本 | 用户确认Shopify角色选项1，2026-09-16 | 仅改变试点执行顺序，不改变Amazon 65%渠道的战略优先级；Amazon数据契约保留，待入口可用后验证；Shopify范围类别随后由D-034确认，连接与写入仍未授权 |
| D-034 | Shopify首个试点采用Momcozy美国主站、可穿戴式吸奶器、3–10个高GMV SKU和滚动30天窗口，由AGT-023担任AI结果负责人 | 用户同意建议1，2026-09-16 | 确认的是业务范围类别；GMV公式随后由D-035确认；Shop GID/非敏感别名、具体Variant/SKU白名单、App/服务身份、Scopes和数据质量阈值仍待确认；不产生连接或写入授权 |
| D-035 | Shopify试点以`gross_sales`作为原始GMV：商品售价×数量，折扣、销售冲销、退款、税费、运费、支付状态和结算现金分别呈现 | 用户选择原始GMV口径选项1，2026-09-16 | 该决定固定试点指标定义，不代表100亿公司口径已核实；Shop币种、Markets、订单状态和来源版本仍须从真实商店验证；其他销售分量不得丢弃 |
| D-036 | Shopify首个连接新建BVS-01试点专用Dev Dashboard App；模型只调用受限读取工具，App凭据与Token由模型外Token Broker/Secret Manager管理 | 用户选择连接身份模式选项1，2026-09-16；Shopify当前官方App创建与认证资料 | 确认身份模式，不代表App已创建、安装或授权；同一Shopify Organization关系、认证路径、App/Shop标识和实际Scopes仍待确认；所有`write_*`及任意GraphQL入口保持拒绝 |
| D-037 | Momcozy美国主Shopify商店与BVS-01试点专用Dev Dashboard App归属于同一Shopify Organization；服务端认证固定使用`client_credentials` | 用户选择Organization关系选项1，2026-09-16；Shopify Client credentials grant官方资料 | 只确认组织关系与认证设计；App创建、版本发布、安装、Client ID/Secret托管、短期Token交换、Shop/App标识、实际Scopes和API调用均未发生或未验证；模型仍不得接触凭据和Token |
| D-038 | Shopify首批Variant/SKU白名单使用现有权威报表的最近完整30天数据，按`gross_sales`选取原始Top 5，再剔除质量、缺货或账号风险项 | 用户选择SKU白名单生成方式选项1，2026-09-16 | 不从第6名以后回填；最终3–5个且三类风险均为`CLEAR`才可封存，少于3个则HOLD；报表来源、具体成员、风险权威源、阈值和有效期仍待确认；不授权读取报表、创建App或调用API |
| D-039 | Shopify首批Variant/SKU排名的权威30天来源采用目标商店的Shopify Admin Analytics导出 | 用户选择权威报表来源选项1，2026-09-16；Shopify Analytics与报告导出官方资料 | 确认来源类别，不表示报告已导出或目标Shop已具备所需套餐、字段与导出选项；具体报告路径、Shop身份、时间/币种、文件Hash、SKU/GID映射和风险证据仍待验证；D-039不增加App Scope或授权报表读取 |
| D-040 | 首份Shopify Analytics权威快照采用官方`Total sales by product variant`报告的CSV导出；目标Shop缺少必需字段或无法证明完整导出时严格HOLD | 用户选择具体报告路径选项1，2026-09-16；Shopify Sales reports与Exporting reports官方资料 | 必需维度为Product title、Variant title、Variant SKU，必需指标为Gross sales与Net quantity；报告不含Variant GID时须以独立商品主数据快照完成一一映射；失败不得自动切换自定义Analytics或ShopifyQL；不表示已读取或导出报告，也不增加`read_reports` Scope |
| D-041 | “可穿戴式吸奶器”产品家族成员由目标Shopify商店的商品字段判定，权威来源类别限定为Product type、product tag或product metafield | 用户选择产品家族成员来源选项2，2026-09-16；Shopify Product、Tags与Metafield官方资料 | 成员在Product层判定，所属Variants继承后再与销售报告按SKU/Variant GID求交集；禁止标题模糊匹配；具体采用Product type、tag还是metafield及字段值、匹配谓词和冲突优先级仍待下一决定；不表示已读取或修改Shopify商品数据 |
| D-042 | 产品家族唯一主选择器采用具有定义与校验规则的Shopify Product metafield | 用户选择主选择器选项1，2026-09-16；Shopify Metafield definition与单行文本预设选项官方资料 | 选择器固定在Product层并由Variants继承；definition ID、namespace/key、类型、允许值、期望值、规范化、访问设置和目标Shop覆盖仍待确认；这些字段未确认或快照不一致时继续`HOLD_PRODUCT_FAMILY_MEMBERSHIP_AMBIGUOUS`，不回退到Product type、tag、标题或模型推断；不表示已创建定义、写入字段或读取目标Shop |
| D-043 | 新建专用Product metafield定义：`custom.product_family`、`ownerType=PRODUCT`、`single_line_text_field`，初始受控值与成员精确匹配值为`wearable_breast_pump` | 用户选择Metafield Definition方案选项1，2026-09-16；Shopify Metafield Definition、定义组成与单行文本预设选项官方资料 | 运行时只做规范化值的精确相等判断，不做模糊/大小写修复；Product type、tag和其他字段不回退。初始Admin读取依赖获批App的`read_products`，Storefront/Customer Account暴露默认关闭。该决定只确认Definition契约；同名冲突检查、Definition创建与ID读回、种子来源、值回填、覆盖率、快照及任何写权限仍未确认或授权 |
| D-044 | `custom.product_family`首次填充采用一次性、负责人确认的Shopify Product GID清单作为权威种子 | 用户选择种子来源选项1，2026-09-16 | 清单只用于初始化，必须绑定同一Shop与同一时点的全量Product目录快照，并记录版本、Hash、负责人确认引用和每个Product GID；不得包含凭据、客户数据或销售明细。只有Definition实例无冲突、清单GID 100%解析、重复/跨Shop为0、负责人确认清单对该目录快照完整且获批回填后字段读回100%一致，才可将`seed_coverage_verified`置真并由`custom.product_family`接管持续权威。验收前未列入、缺值、非法值或冲突一律HOLD；该决定不授权访问Shop、创建Definition或回填字段 |
| D-045 | 目标Shop先完成只读预检，再单独提交任何Definition创建或Product metafield回填写入方案 | 用户选择目标Shop实施顺序选项1，2026-09-16 | 只读预检顺序固定为：Shop/App身份与实际Scopes读回→`custom.product_family`同名Definition冲突审计→全量Product目录快照→Product GID种子清单对账→官方Variant报告能力核验→封存`READ_ONLY_PREFLIGHT_EVIDENCE_PACK`。Definition不存在时只形成创建方案；完全兼容时复用并只形成回填方案；不兼容时HOLD且不自动覆盖/迁移。预检通过不授权创建Definition、回填字段或修改商品；写入方案必须引用预检包并另行授权 |
| D-046 | Shopify只读预检首批声明Scope固定为`read_products`、`read_orders`、`read_inventory`、`read_locations`和`read_markets` | 用户选择首批Scope方案选项2，2026-09-16；Shopify Access scopes、Protected Customer Data与Manage access scopes官方资料 | `read_all_orders`、`read_customers`、`read_reports`和全部`write_*`明确排除；30天试点位于订单默认60天可见窗口内，不申请`read_all_orders`。Admin Analytics CSV导出与App API Scope分离。实际授权必须由`currentAppInstallation.accessScopes`读回并与声明集合完全相等，缺失或多余均`HOLD_SCOPE_MISMATCH`。订单属于Protected Customer Data；在字段级策略与对应批准证据另行确认前，`read_orders`只保留在声明包中，不发布订单查询模板。该决定不授权App创建/安装、Protected Customer Data访问、Token交换、API调用或报表导出 |
| D-047 | `read_orders`采用Level 1最小必要Protected Customer Data政策，只处理30天SKU经营指标所需的非直接身份订单与行项目字段 | 用户选择订单数据方案选项1，2026-09-16；Shopify Protected Customer Data、Order、LineItem、orders query与Security best practices官方资料 | 姓名、地址、邮箱、电话、Customer主档、客户旅程/营销同意、IP、Token、订单备注、自定义属性、Metafield、Tag、员工、支付工具、状态URL及其他自由文本字段在Query和下游Shape中均拒绝。允许的设计字段限定为订单/行项目GID、时间/取消/财务/履约/测试状态、Product/Variant/SKU、数量以及MoneyBag金额/币种；正式Query仍须固定字段Schema与Hash。原始API响应零持久化，模型仅接收SKU日聚合；保留期随后由D-048确定。任何GraphQL错误、意外字段或资格/字段脱敏不一致均fail closed。该决定不代表Level 1资格已批准，也不授权App创建/安装、Token交换、API调用或客户数据访问 |
| D-048 | Level 1规范化订单行采用45天加密保留，服务滚动30天经营窗口并预留15天晚到/重放缓冲 | 用户选择保留期选项1，2026-09-16；D-047字段边界 | 45天从Shop时区的源业务日结束时起算，期满后24小时内硬删除；每日删除任务须产生不含订单/客户标识的删除回执，备份同TTL或完成可验证的crypto-erasure。删除失败进入`HOLD_RETENTION_DELETE_FAILURE`，停止新增订单读取与发布；法律保全或其他例外必须由模型外独立审批策略进入隔离存储，不得静默延长。原始API响应仍零持久化，模型仍只见SKU日聚合。该决定只确认数据政策；Level 1资格、实际Scopes、字段Schema/Query Hash、访问审计、删除与备份TTL测试齐备前，`ORDER_LINE_WINDOW_V1`继续禁用，也不授权App创建/安装、Protected Customer Data访问、Token交换或API调用 |
| D-049 | Shopify Level 1资格采用目标Dev Dashboard现场只读核验路径，不以development store替代目标环境证据 | 用户同意建议路径，2026-09-16；Shopify Protected Customer Data、Dev Dashboard、Distribution、Client credentials与User permissions官方资料 | 先核验操作者权限类别、Organization/App/Shop关系、App类型/分发状态、生命周期与声明Scope，再按官方矩阵解释Level 1：public app需review，custom app与admin-created custom app为always available。后者只代表类型政策资格，不证明目标App已创建/安装、Scope已获授或运行访问有效。任何App类型/分发不明、非同一Organization、数据保护要求缺口或Scope差异均HOLD。本轮只封存脱敏证据，不创建/修改App、不选择分发、不提交review、不发布版本、不安装、不交换Token、不调用API，也不读取Protected Customer Data |
| D-050 | Shopify按绿地新店处理，当前先完成完整方案Site与“店铺底座→首批产品上市”路线；产品上线并形成连续30个完整销售日后，才启动FLOW-01存量GMV Shadow | 用户明确Shopify为全新店铺且无上线产品，并要求先把所有方案做到网站，2026-09-16；F-039 | D-033至D-049保留为`SHOP-G6/SHOP-G7`目标状态合同，不再表示当前已有商品、SKU、报表、订单、App或资格证据。当前主Case切换为FLOW-04渠道进入，由AGT-024负责；FLOW-02产品准备与FLOW-06数据工具分别建立共享`correlation_id`的独立关联Case。现场登录与Level 1取证延期至真实产品和访问门具备时；延期不等于失败或已通过。完整方案Site不授权发布、API调用、业务写入、裁员或生产自治；文档发布限制随后由D-052更新 |
| D-051 | 当前只交付并审阅完整方案门户与Shopify店铺治理底座方案，不实例化Case或执行任何Shopify配置、商品、App、连接、测试订单或发布动作 | 用户明确“依然以审阅完整的方案为主，店铺治理底座写方案即可”，2026-09-16；[店铺治理底座方案](../12-rollout/SHOPIFY-STORE-GOVERNANCE-FOUNDATION.md) | D-050的绿地顺序保留为未来实施路线，但“当前执行/开始实例化”由本决定替代为“方案设计与静态验收”。Shopify门命名为`SHOP-G0`至`SHOP-G7`，组织变革门命名为`ORG-G0`至`ORG-G5`，经营试点门命名为`PILOT-G0`至`PILOT-G4`，禁止再使用含义不明的裸`G1/G2` |
| D-052 | 将完整方案提交并推送至`zjgulai/AI-Native-Organization`，通过GitHub Actions把`dist/`公开部署到该仓库的GitHub Pages | 用户明确要求方案完成后上传对应GitHub并部署到对应Pages，2026-09-16 | 发布授权只覆盖本项目方案文档、结构化设计资产、静态Site和Pages工作流；不授权Shopify或其他企业系统登录、配置、API、业务写入、外部业务消息、预算或组织动作。发布前须完成敏感信息、链接、结构、浏览器和Git差异校验，发布后分别核验commit、remote workflow、Pages控制面与公网字节 |
| D-053 | 将50个逻辑岗位升级为50个可独立寻址的数字分身契约：每个岗位拥有独立Role Playbook、独立Preset Blueprint、Skills、产物、评估集和Access边界；同时支持独立执行与复杂Case中的受控组队 | 用户明确要求50个岗位都可独立干活、以DSH preset独立定义，并像Skill一样单独或组队完成复杂场景，2026-09-17 | 替代D-020关于“岗位不形成运行Agent身份”的运行语义；保留五契约、不可变Bundle、Action Intent→Policy Gate→Execution Broker、产物门禁和凭据隔离。组队由模型外Case Control确定性编排，Lead负责Case结果，Worker通过已验收ArtifactEnvelope交接，不使用隐式岗位聊天或相互转授权限。当前只生成设计蓝图，真实DSH导入schema、插件版本、服务身份和生产授权仍未知 |

## 待确认决定与实施参数

| 问题 | 对应访谈 | 受影响的后续工作 |
| --- | --- | --- |
| 100亿统计口径、Shopify以外约束权威来源和质量/停止阈值 | R04-Q2 | 经营基线和验收；试点原始GMV已由D-035确定为`gross_sales` |
| 无策略、无回执或工具失败时的自治处置规则 | R04-Q3 | 异常冻结、恢复和避免重复动作 |
| 既有193/46个Agent资产与50长期岗位的整合方式 | R04-Q4 | 能力复用、重复建设和身份治理 |
| 在未来获得实施授权并完成`SHOP-G2`至`SHOP-G5`且`SHOP-G6`访问门开启后，按目标Dev Dashboard路径读回App类型/分发、Organization关系、生命周期和声明Scope；随后验证字段Schema/Query Hash、删除/访问/备份TTL控制、Definition实例、Product GID种子清单、成员覆盖与报告能力 | R04-Q5 | D-050将D-049延期到真实商品和访问条件存在之后；D-051确认当前只写方案，不要求登录。未来登录也不自动授权创建、安装、Token交换或API调用，订单Query继续禁用 |
| 工具优先UI/UX是否作为默认工作入口 | R04-Q6 | 工作台产品范围与记录边界 |
| 首个新品验证机会及受保护资源 | R04-Q7 | 双增长主线落地 |
| 实施预算、上线节奏和扩大条件 | 经营样本验证后 | 实施分期与可行性 |

建议被采纳时，记录选择、理由、备选项、来源及影响。已决定内容被改变时保留原决定并注明替代关系。

已建立[ADR-0001](../adr/0001-harness-execution-and-business-control.md)，记录Harness执行层与业务控制层分离；[ADR-0002](../adr/0002-agent-autonomy-and-deferred-hitl.md)记录Agent-first与后置HITL的历史选择；[ADR-0003](../adr/0003-single-case-agent-with-role-skills.md)记录单Case结果责任与岗位Skills的历史基线；[ADR-0004](../adr/0004-five-contract-agent-management.md)记录五契约Agent管理与禁止自发布；[ADR-0005](../adr/0005-immutable-release-bundle-lifecycle.md)记录不可变Bundle和七状态生命周期；[ADR-0006](../adr/0006-artifact-gated-eight-stage-collaboration.md)记录八阶段产物门禁协同协议；[ADR-0007](../adr/0007-one-flow-one-scenario-per-case.md)记录Case唯一主价值流/主场景与关联Case规则；[ADR-0008](../adr/0008-deterministic-emergency-protection-guard.md)记录FLOW-07模型外确定性紧急保护通道；[ADR-0009](../adr/0009-runtime-model-and-memory-governance.md)记录模型评估/选型、缓存参数和异步记忆边界；[ADR-0010](../adr/0010-action-intent-policy-gateway-execution-broker-boundaries.md)记录Action Intent、Policy Gate与Execution Broker边界；[ADR-0011](../adr/0011-business-and-capability-value-streams.md)记录8条业务经营流与4条能力供应流的正交建模；[ADR-0012](../adr/0012-independent-role-presets-and-bounded-composition.md)记录50个独立Role Preset与受控Lead/Worker组队。

首轮业务信息及组织材料已经记录；部门人数差异、店铺/账号映射和具体系统清单是待核实事实，不重新列作用户尚未回答的首轮问题。完整候选设计和研究已交付，待决不等于文档仍未形成。
