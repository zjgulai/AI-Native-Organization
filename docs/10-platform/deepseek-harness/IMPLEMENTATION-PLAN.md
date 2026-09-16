# DeepSeek Harness 框架落实方案

状态：D-020至D-029架构方向已确认，尚未配置或上线。目标是让单Case Agent按50个Role Profiles和八阶段协议，通过MCP、native tools、API和hooks连接业务系统，并以工具UI/UX承载日常工作；Flow-07 Emergency Guard位于Harness模型运行之外。模型侧仅产出Action Intent，模型外Policy Gate与Execution Broker控制资产执行和Service Identity。不生成未经目标版本和schema验证的配置。

## 最小组成

| 部分 | 责任 | 首先复用什么 | 缺口补足原则 |
| --- | --- | --- | --- |
| 系统-of-record | 订单、商品、库存、预算、质量和身份的权威记录 | RootData、ERP、PLM、QMS、WMS、TMS、Amazon、Shopify、CRM等已盘点资产 | 补最小接口契约，不复制全套业务系统 |
| 场景控制 | 信号、Case、八阶段状态、Bundle固定、上下文装配、策略、幂等、回执和自治异常账 | 已有任务、审批、编排或记录服务 | 一个持久化Case/Event Ledger，不能用会话代替 |
| FLOW-07紧急保护 | 权威信号核验、确定性Guard、Policy、STG-02本地事务、Emergency Outbox、幂等派发与权威对账 | 现有事件、策略、事务Outbox与执行服务 | 位于模型外；规则未完整匹配时不执行，不能由Harness Prompt或Skill放宽 |
| Harness执行 | 单Case Agent会话、按需Skills、窄范围只读Delegate和受限工具调用 | 目标DSH部署及已验证插件 | 按Case与五契约装配角色资产 |
| 工具平面 | 读取、确定性校验、写入、外部发起、回执与恢复 | native tools、MCP、API adapter和hooks | 每一项进入能力登记册并绑定策略 |
| 工具工作台 | 工单、调用、策略、回执、异常和结果的工作卡 | Harness Host和现有经营入口 | 展示不承担权限、状态或审计权威性 |

## 50岗位到Harness资产的映射

| 本项目资产 | 目标承载方向 | 尚需验证 |
| --- | --- | --- |
| 50张岗位卡 | 版本化Role Profiles；每张Case只装配一个主岗位人格 | 主岗位与Bundle如何在目标版本固定并回放 |
| 人格与原则 | 指令、评估集和拒绝/冻结行为测试 | 回放能否稳定表现，不能只检查文本加载 |
| 技能与Playbook | 经评估skill、工作流步骤、确定性校验 | 技能发现、优先级、版本、状态持久化 |
| AGT-002场景治理 | 价值流/主岗位selector、Skills装配规则和异常协调建议 | 规则如何由模型外Case Control执行和版本化 |
| 协同图谱 | 八阶段、Stage Artifact、Acceptance Gate、Case状态和能力来源 | Case/Event Ledger如何持久化、重入和关联窄范围Delegate结果 |
| 动作策略 | 业务控制服务及工具guard | 目标系统是否可服务端校验范围、幂等和回执 |
| 工具UI/UX | tool call/result卡及场景视图 | Host展示、脱敏、访问控制和异常可视化 |
| 能力包 | 既有193/46个Agent的技能、知识、工具和评估 | 质量、重复度、权限和成本的实际盘点 |

本机资料说明子Agent使用父方组装，因此不同人格不是权限隔离。首版Delegate仅限最小输入的只读、自包含任务，并通过类型化结果回到主Case；敏感边界仍需要工具scope和服务端动作策略。已核实的workflow不提供检查点和重启续跑，跨天采购、质量、补货或外部事件不能只由workflow承载。

## 工具连接方式

| 类型 | 适用场景 | 设计要求 |
| --- | --- | --- |
| native tool | 内部已有服务、数据查询或受控业务动作 | 使用角色scope限制；guard只可拒绝，不能由后续Agent放开 |
| MCP tool | 已有或可建设MCP server的系统能力 | 稳定命名、最小输入输出、认证托管、超时、重连与撤权测试 |
| API adapter | 有正式API但暂无MCP的系统 | 由受控适配器提供schema、限流、幂等、回执和错误翻译 |
| hook/event | 订单、库存、质量、账号或工具结果事件 | 进入场景工单前验证来源、顺序、重复和重放 |
| tool UI | 调用、策略、结果、回执与异常的工作卡 | 仅展示最小必要数据，不替代控制层 |

MCP仅被本机资料证明为tools桥接；不能假设resources或prompts可用。不要在岗位提示词、仓库或工具参数中放置密钥。

## 配置制作步骤

1. **核实目标环境。** 从企业品牌AI平台导出实际运行的基础profile，确认产品身份、Harness/插件版本、工具Host、配置schema、身份托管和审计位置。企业材料的2.0.4说明与本机0.1.2-rc.1安装包不能互相代替。
2. **建立能力登记册。** 为每个系统动作记录对象范围、服务身份、读写类型、schema、限流、策略、幂等、回执、恢复和评估状态。
3. **当前只设计治理底座，未来先建立绿地事实再接只读经营数据。** D-051把当前工作限定为`SHOP-G1`治理方案。未来另行授权后，才按D-050为Shopify空白新店建立Shop、Product、Variant、SKU、价格、库存、合规、市场和交易配置的权威记录；产品上线后于`SHOP-G6`采用D-036专用Dev Dashboard App和[只读连接器登记契约](SHOPIFY-READONLY-CONNECTOR-REGISTRATION.md)。D-037的`client_credentials`、模型外Connector/Token Broker和五项只读Scope保持不变。连续30个完整销售日后才装配订单、退款、报表和`gross_sales`数据集。App创建、版本发布、安装、Token交换和Scope读回均未执行，因此不创建貌似可运行的Harness配置。
4. **装配单Case Agent。** 将50岗位卡、五契约Bundle、Playbook和能力包映射到目标版本允许的preset/skills；Case Control只向一张Case暴露一个主岗位人格、必要Skill描述和契约允许的工具。
5. **建立动作策略。** 每种可写动作声明角色、场景、品牌/市场/账号/商品范围、参数、预算/约束、有效期、幂等、回执和补偿；策略之外一律冻结。
6. **编译FLOW-07 Guard规则。** 每条规则固定权威信号、唯一场景、Case Charter、最小范围、保护模板、Policy、TTL、幂等和最大影响边界；验证互斥、过期、事务失败、重复派发、状态不明和恢复禁入。若唯一Case绑定无法成立，只写Pre-Case Exception并冻结信号范围，不创建Guard Decision、残缺Case或动作记录；零匹配Guard Decision不含规则或Case引用。事务提交结果未知时先以Pre-Case Exception查询账本，证明Case存在后才进入Case异常。规则由业务控制层发布，不进入模型Prompt。
7. **注册工具与事件。** 按真实schema接入native tools、MCP、API adapter和hooks；用工具scope、guard和受控后端共同实现拒绝，而不是靠提示词。
8. **构建工具工作卡。** 从调用参数、策略摘要、外部回执和异常账生成UI；敏感字段遵从系统的数据分类和访问范围。
9. **离线与影子验证。** 回放正常、缺数据、跨账号、策略撤回、重复事件、超预算、429、部分成功、回执丢失、进程重启、能力回退及Emergency Guard的零匹配/多匹配、Outbox重放和TTL过期。
10. **生成目标版本导入材料。** 仅在真实schema、接口和验证通过后生成配置包；按明确业务范围进入有限闭环。

## 工单、策略与动作契约

工单包含：稳定ID、信号与关联ID、价值流/场景、业务范围、主岗位、固定Bundle、当前阶段、Stage Attempt、产物、接收记录、依赖、成本、动作、回执和自治异常引用。字段边界见[Case Record契约](../../07-orchestration/case-record-contract.json)。

动作策略包含：策略ID/版本、适用角色/场景、目标对象范围、参数约束、预算/经营约束、有效期、幂等要求、允许工具、回执查询、补偿和冻结规则。

动作记录包含：工单ID、来源类型与引用、目标对象、动作及参数摘要、预期对象版本、策略引用、幂等键、请求状态、外部回执、实际效果和恢复记录。正常来源是Case Agent的STG-07 Attempt；紧急来源只能是Emergency Guard的固定模板，并额外绑定Guard Decision、TTL、最大影响和Emergency Outbox。参数或范围变化后必须重新校验；一个会话中的“同意”不能扩展到其他账号、金额和商品。

统一状态流仍为：信号接收→范围与建单→上下文装配→证据与诊断→方案产物→Assurance门禁→受控动作→回执核验与关闭；等待、返工、冻结、补偿和恢复是明确分支。FLOW-07的紧急保护只是在已接收STG-01信号与STG-02建单事务之间增加模型外固定保护分支，不是第九阶段；紧急Attempt最终在STG-08一并核对。执行超时不能直接变成“未执行”；先核对外部系统状态。

## 1013店铺与2000+SKU的运行方式

维护真实账号、市场、商品与SKU映射；按变化事件、商品分组与经营例外触发任务，避免全量逐店逐SKU轮询。共享角色在不同范围复用，工具身份和动作策略按工单绑定。

D-050定义未来按[Shopify绿地路线](../../12-rollout/SHOPIFY-GREENFIELD-ROADMAP.md)完成店铺底座和首批产品上市；D-051则把当前范围固定为完整方案审阅与`SHOP-G1`治理方案，不执行这条路线。只有未来另行授权、上线商品和连续30个完整销售日存在后，才对D-033至D-049确定的Momcozy美国Shopify主站和可穿戴式吸奶器范围，以一次性负责人确认的Product GID清单初始化`custom.product_family=wearable_breast_pump`，覆盖验收后由该字段产生Product级成员集合；所属Variants继承后与官方`Total sales by product variant` CSV求交集，再从完整30天`gross_sales`原始Top 5经三类风险剔除后封存3–5个Variant/SKU；之后以试点专用Dev Dashboard App和`client_credentials`认证完成读取、指标分量重算、数据质量、八阶段产物与NO_ACTION门禁。目标Shop先做只读预检：身份/Scopes→订单资格/字段/45天保留控制→Definition三态→全量目录→种子对账→报告能力→证据包；任何Definition创建或字段回填另案。首批声明Scope固定为五项读取；订单采用Level 1最小必要字段、原始响应零持久化、规范化行45天加密保留、模型仅见SKU日聚合。D-049已固定在目标Dev Dashboard现场取证，不以development store替代：先脱敏记录App类型、所有者Organization、目标Shop Organization与分发状态，再按public app需审查、custom app/admin-created custom app Level 1可用的官方矩阵核对PCD面板、Data protection要求、声明/实际Scopes、用户权限和不可变分发状态。九项证据全部通过前订单Query保持禁用；身份、组织关系、资格、控制、Scope或脱敏任一失败均进入对应HOLD。D-050将现场取证延期到`SHOP-G6`，九项观察均未开始。达到`SHOP-G6`并获得对应授权后，仍须在独立API访问授权下读回实际Scopes并执行预检。Scope不一致进入`HOLD_SCOPE_MISMATCH`，字段Shape异常进入`HOLD_PROTECTED_CUSTOMER_DATA_SHAPE_MISMATCH`，删除控制失败进入`HOLD_RETENTION_DELETE_FAILURE`，成员歧义进入`HOLD_PRODUCT_FAMILY_MEMBERSHIP_AMBIGUOUS`，报告能力不匹配进入`HOLD_REPORT_CAPABILITY_MISMATCH`。Admin导出与App Scope分离。Shopify渠道事实与广告平台、ERP/WMS/QMS约束分别验收；Shopify通过不代表跨系统联合经营闭环通过。D-030的Amazon US范围保留为后续渠道模板。

## 不生成猜测配置

当前没有目标Harness的真实schema、MCP server、API契约、服务身份或生产动作授权。本项目的JSON是业务设计数据，不可直接导入Harness；本文件也不虚构YAML、CLI命令、密钥位置或配置键。
