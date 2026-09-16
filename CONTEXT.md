# 跨境电商 AI 组织变革语境

本词汇表收录本轮请求中含义已明确的交付物概念。

## Language

**AI 岗位分身（Digital Role Profile）**：承担一组持续业务责任的逻辑岗位契约，包含使命、主岗位人格、判断原则、Skills、产物、指标和边界。本项目“约 50 个”统计这类责任角色，不统计运行实例。
_Avoid_: 真人员工编制、50 个常驻模型进程、并发任务数

**Case Agent（场景 Agent）**：拥有一张场景工单完整上下文的单一运行时 Agent。每张工单绑定一个主岗位人格，并按需加载其他岗位贡献的 Skills。
_Avoid_: 50 个岗位互相路由或聊天、用多个 Agent 分割同一紧耦合上下文

**主岗位人格（Primary Role Persona）**：一张场景工单中唯一决定判断风格、结果责任和冲突取舍的岗位人格。辅助 Skills 提供能力，不叠加第二个人格。
_Avoid_: 同一工单同时扮演多个结果负责人、用人格扩大权限

**Skill**：按需加载的领域知识、步骤、检查方法和产物规范。启动上下文只暴露 Skill 的名称与描述，正文在相关场景中读取。
_Avoid_: 独立长期 Agent 身份、把所有 Skill 正文塞入 System Prompt

**Delegate**：由 Case Agent 作为工具调用的窄范围、自包含、可独立验收的任务执行单元。首版仅允许只读分析类 Delegate，且不接收完整会话、不能写资产或继续委派。
_Avoid_: 通用领域子 Agent、隐式多 Agent 路由

**Case Control**：模型外创建工单、装配稳定上下文、限制可见 Skills 和 Tools、推进状态并记录异常的确定性控制能力。AGT-002 的旧“多 Agent 路由器”语义由此替代。
_Avoid_: 让另一个 LLM 决定权限、用自然语言聊天代替工单状态

**OEM**：品牌方通过外部制造商生产产品的产品供应模式。该模式本身不说明品牌方是否保留研发、产品定义或质量责任。
_Avoid_: 无研发能力、全部业务外包

**业务场景**：围绕一个跨境电商经营或运营目标展开，需要相关岗位协作完成的业务活动。
_Avoid_: 单一岗位名称

**Playbook**：特定业务场景中，指导岗位完成职责的操作方法和判断规则。
_Avoid_: 仅有技能名称的岗位简介

**协同关系图谱**：描述业务场景中的参与者、责任以及工作交接关系的图谱。
_Avoid_: 仅有上下级关系的组织架构图

**原始 GMV**：同一业务范围内、按已确认订单事件计算且尚未扣除取消与退款的交易总额；具体订单事件和权威来源由场景数据契约锁定。
_Avoid_: 财务收入、净回款

**经营约束**：GMV目标不能突破的取消退款、现金、客户体验、产品质量或经营损失边界；阈值须由对应业务责任者确认。
_Avoid_: 可选参考指标、单纯的模型告警

**场景工单**：对一项经营目标、其业务范围、责任、证据、状态、决定和结果的持久记录。
_Avoid_: 一段聊天记录、单次Agent会话

**主价值流（Primary Flow）**：一张Case在STG-02必须且只能绑定的一条端到端经营闭环，用于确定该Case的结果责任、阶段语义和控制边界。
_Avoid_: 在一张Case中并列多条价值流、用候选流程清单代替已绑定流程

**主场景（Primary Scenario）**：一张Case在STG-02必须且只能绑定的一个业务问题分类；相关场景可以作为背景引用，但不增加第二份结果责任。
_Avoid_: 把相关场景当成并列主场景、把场景标签当成价值流

**关联Case组（Correlated Case Group）**：同一信号确需触发多条价值流时，以同一`correlation_id`关联的一组Case。每张Case的目标、状态、主岗位、Bundle、资源、异常与关闭结果相互独立。
_Avoid_: 共享可变上下文、一个Case改变另一个Case状态、把关联关系当成共同责任

**跨Case产物引用（Cross-Case Artifact Reference）**：消费方Case对来源Case中已被Stage Acceptance以ACCEPT接收的版本化Stage Artifact建立的只读引用。来源Case、Artifact ID、产物版本与Hash必须和Artifact Envelope一致，接收记录必须属于同一来源Case并实际包含该Artifact。
_Avoid_: 复制摘要代替来源产物、引用未验收产物、借引用修改来源Case

**Case Stage（工单阶段）**：一张场景工单在统一协同协议中的一个逻辑步骤。本项目固定为信号接收、范围与建单、上下文装配、证据与诊断、方案产物、保障门禁、受控动作、结果关闭与学习八个阶段。
_Avoid_: 八个Agent、可以被聊天过程静默跳过的提示词步骤

**Stage Artifact（阶段产物）**：某个Case Stage形成的类型化、版本化且带来源的业务交付，作为下一阶段的唯一正式输入。
_Avoid_: 聊天摘要、没有schema和验收状态的自然语言消息

**Acceptance Gate（接收门禁）**：依据阶段产物schema、来源、业务范围、约束和Assurance Contract，决定该阶段可接受、等待、返工或冻结的确定性转换记录。
_Avoid_: 另一个普通LLM的口头同意、资产动作授权

**Stage Acceptance Record（阶段接收记录）**：对一次Stage Attempt给出ACCEPT、RETURN、WAIT、FREEZE或CLOSE处置及理由、证据和下一阶段/返回阶段的持久记录。每个阶段都必须产生一份。
_Avoid_: 仅在第六阶段进行一次总验收、用Evaluator Finding直接改变Case状态

**Assurance Decision（保障结论）**：第六阶段根据Assurance Contract、确定性检查和可选只读Evaluator Finding形成的独立复核产物，随后仍由Stage Acceptance Record决定阶段转换。
_Avoid_: Policy Decision、资产动作授权、由发起者覆盖的自我验收

**Case/Event Ledger（工单与事件账）**：保存Case当前阶段、阶段产物版本、门禁结果、外部动作引用、异常和关闭结果的权威记录。
_Avoid_: 模型会话历史、异步长期记忆

**业务范围**：一次场景工单所绑定的品牌、市场、渠道账号、商品集合、时间窗口和规则版本。
_Avoid_: 泛泛的“全公司”或“Amazon”

**资源预留记录（Resource Reservation Record）**：由模型外控制为一张Case单独记录的预算池、库存、产能或其他共享资源主张。记录保留资源引用、范围、Claim Hash、去重键和规则版本；它可以为空或冲突，但本身不授予预算、库存、账号、工具或执行权限。
_Avoid_: 关联Case共用一条预留、把预留当成付款或执行许可、由模型直接改写预留状态

**业务控制层**：承载工单状态、动作策略、幂等、回执、自治异常和恢复的业务记录与校验能力。
_Avoid_: 仅靠提示词的行为约束、AI会话历史

**影子运行**：使用真实信号生成可比较建议和记录，但不对业务系统产生实际写入的验证方式。
_Avoid_: 自动执行、生产上线

**按需 Skill 装配**：Case Control 依据场景、业务范围和已发布配置向一个 Case Agent 暴露必要的 Skill 描述；Case Agent 在任务中读取相关正文。装配结果必须可回放。
_Avoid_: LLM intent router、动态拉起多个岗位 Agent、50 个岗位全员进入上下文

**自主闭环**：AI 岗位在已发布策略和业务范围内，从信号、判断、受控工具调用、回执核对到结果记录完成场景闭环的运行模式；初始阶段不把真人设为常规流程节点。
_Avoid_: 无限制的自动执行、以会话日志替代业务记录

**后置 HITL**：真人介入不是初始运行的必经步骤，而是在运行证据、组织安排和具体策略准备好后才可启用的可选模式。
_Avoid_: 取消动作策略、异常冻结或任何企业责任边界

**工具优先工作台**：Agent 通过 MCP、原生 tools、API 或 hooks 获取信息、执行经策略允许的动作，并按工具调用和回执渲染工作界面；界面不是权限或业务事实的权威记录。
_Avoid_: 仅靠独立看板操作、用 UI 替代服务端校验

**Presentation Tool**：由模型选择内容和展示意图、由服务端补齐权威事实并由 Site 渲染的类型化 UI 工具。其调用记录可以恢复为工作卡片。
_Avoid_: 模型生成任意 HTML、把展示工具兼作批准或资产写入工具

**Emergency Guard（紧急保护电路）**：只面向FLOW-07重大质量或账号候选信号的模型外确定性控制。它依据已发布互斥规则固定主场景、Case范围、保护动作模板、Policy、TTL、幂等和最大影响边界；不运行人格、不持有Service Identity，也不能由模型改参或扩围。
_Avoid_: 第二个Case Agent、LLM紧急审批、绕过八阶段或Policy Gate

**Pre-Case Exception（建单前异常）**：已接收信号尚不能满足唯一主价值流、主场景或业务范围绑定，或本地事务结果尚未证明Case已经提交时，由模型外控制记录的冻结、查询与恢复证据。它不承担Case状态；绑定歧义不得伴随Guard Decision、残缺Case、Action Intent、Policy Decision、Outbox或Execution Attempt，提交结果未知时也不得发起新派发。
_Avoid_: 为了紧急执行先创建字段不完整的Case、把建单前异常当作已进入八阶段

**紧急保护动作（Emergency Protection Action）**：Emergency Guard规则预先固定的最小范围、限制性且可逆的暴露控制。恢复、重新开放、扩大范围、对外承诺、退款、召回、销毁和永久变更不属于紧急保护动作。
_Avoid_: 模型自由选择的动作、以“紧急”为由扩大权限

**Emergency Execution Outbox**：与Case、STG-02 Charter/Acceptance、Guard Decision、固定Action Intent及Policy Decision在同一本地事务中提交的待派发记录。只有Policy为ALLOW且Outbox已提交、未过期时，Execution Broker才能按幂等键消费。
_Avoid_: 把外部系统副作用宣称为数据库原子事务、事务提交前执行、DENY或HOLD后仍派发

**紧急派发TTL**：固定Intent和Outbox允许首次派发的有效窗口；过期后禁止新执行，但不会自动恢复、重新开放或撤销已经生效的保护状态。
_Avoid_: 把TTL当作自动恢复许可、用新Outbox绕过过期记录

**Action Intent**：对业务动作提出的结构化申请，包含来源类型、对象、参数、理由、预期结果和工单引用。正常来源是Case Agent在STG-07形成的方案；紧急来源只能是Emergency Guard按已发布模板确定性生成的固定保护申请。它本身不改变资产状态。
_Avoid_: 已执行动作、业务系统回执

**Policy Gate**：模型外依据身份、业务范围、策略版本、参数、预算、有效期和风险等级确定允许、拒绝或暂存 Action Intent 的确定性控制。
_Avoid_: 另一个普通 LLM 的自我批准、提示词中的软约束

**Execution Broker**：持有受控 Service Identity，在 Policy Gate 允许后调用目标系统并记录幂等键、逐对象结果、回执和补偿状态的模型外执行服务。
_Avoid_: 把凭据或无限制写工具直接交给模型

**Execution Attempt（执行尝试）**：Execution Broker在Policy Decision为ALLOW后向目标系统发起的一次带幂等键请求及其初始响应记录。
_Avoid_: 已核验的最终业务结果、因超时就认定未执行

**Verified Execution Receipt（核验回执）**：在第八阶段把Execution Attempt与目标system-of-record的权威状态逐对象对账后形成的结果记录。
_Avoid_: Broker初始响应、工具UI显示成功、模型对结果的推断

**异步记忆提取**：主响应完成后，由独立进程从允许的会话文本中提取短小、类型化且带来源的长期记忆，写入企业 Memory Store。
_Avoid_: 在用户等待时让主模型保存记忆、把业务事实或审批结果只存在概率性记忆中

**Agent 管理契约**：约束一个AI岗位分身如何定义、获得能力、运行、访问和被验收的版本化配置。本项目分为Business、Skill、Runtime、Access和Assurance五类，彼此不能相互替代。
_Avoid_: 上级Agent、把所有配置塞入一份System Prompt

**Business Contract**：定义岗位使命、主岗位人格、目标、KPI、标准产物、业务范围和冲突取舍的经营契约。
_Avoid_: Prompt全文、模型参数、工具凭据

**Skill Contract**：定义可发现的Skill描述、按需正文、Playbook、知识来源、产物schema、依赖与评估案例的能力契约。
_Avoid_: 长期Agent身份、无版本知识库

**Runtime Contract**：定义模型、effort、上下文与缓存策略、成本、SLO、并发、失败和回退的运行契约。
_Avoid_: 业务目标、资产授权

**Access Contract**：定义数据范围、可见Tools、Action Intent类别、Policy、有效期与撤权方式的访问契约；Service Identity仍由模型外服务持有。
_Avoid_: 把凭据写入岗位配置、用工具可见性代替服务端授权

**Assurance Contract**：定义Eval、独立复核、利益冲突、发布门槛、审计证据与回退条件的保障契约。
_Avoid_: 岗位自测即发布、另一个普通LLM最终批准

**Role Release Bundle**：把一个岗位的Business、Skill、Runtime、Access和Assurance五个确定版本及其完整性Hash绑定在一起的不可变发布清单。Case Agent启动时固定引用一个Bundle。
_Avoid_: “最新配置”、运行中热改某份契约、只有岗位名称没有版本集合

**岗位生命周期**：Role Release Bundle在Draft、Evaluated、Shadow、Limited、Production、Quarantined和Retired七个状态之间按确定性门禁转换的过程。Rollback是选择上一已知正常Bundle的受控操作，不是第八个状态。
_Avoid_: Agent自行升级状态、把设计确认写成生产上线

**Case冻结（Frozen Case）**：某张场景工单因范围冲突、回执不明、关键依赖失效或其固定Bundle被隔离而停止产生新动作的工单状态。
_Avoid_: Role Release Bundle的Quarantined状态、把整家公司或全部岗位一起停掉

**自治异常账**：记录策略拒绝、工具失败、回执不明、范围冲突和冻结/恢复过程的持久记录，用于避免重复动作并支持后续复盘。
_Avoid_: 静默失败、把异常直接标记为完成

**Variant/SKU范围清单（Scope Manifest）**：一张Case可读取和分析的Shopify Variant GID与SKU集合，连同Shop、Market、窗口、来源、风险证据、版本和Hash一起封存。D-038的首批清单先取完整30天`gross_sales`原始Top 5，再剔除质量、缺货或账号风险项。
_Avoid_: 只有SKU文本的手工名单、运行中自动扩容、用高GMV覆盖风险否决
