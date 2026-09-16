# 项目状态

更新日期：2026-09-16

当前阶段：v2根架构、50岗位、12条价值流和完整方案Site已形成。D-050确认目标Shopify是尚无上线产品的空白新店；D-051把当前范围限定为完整方案最终审阅和Shopify店铺治理底座方案，不实例化Case或执行店铺、商品、App、连接、测试订单和业务发布。未来取得独立授权后，才按`SHOP-G2`至`SHOP-G7`推进绿地实施、只读连接、30天基线和FLOW-01 Shadow。D-052授权把本项目文档与Site提交至GitHub并公开部署GitHub Pages；该文档发布不改变Shopify、企业系统、裁员、预算或生产自治权限。

## 已完成

- 项目目录、AGENTS.md和Git初始化；main分支，发布仓库为[zjgulai/AI-Native-Organization](https://github.com/zjgulai/AI-Native-Organization)。
- 记录首轮回答：约50个AI岗位、GMV第一优先级、1013活跃店铺、2000+SKU、渠道比例、OEM与经营痛点，以及连续完成总体规划的要求。
- 读取用户指定飞书组织材料，形成部门聚合评估；保留2354/2352及21/19的统计差异，不用其推导裁撤。
- 按固定源码快照评估CodexLoom、StaffDeck、AgentSpace、OpenOPC和Hive，区分实现、宣传、许可及企业适用边界。
- 核实本机DSH安装元数据及七个Harness插件文档，建立能力矩阵与完整候选落实方案。
- v1.1历史基线曾形成50张岗位卡、8条跨职能流程、8份Playbook、356条类型明确的协作关系、19项部门职责承接和容量/成本方法。
- 完成总体战略及包含20项需求的PRD；用户已确认R02五项框架建议，形成D-011至D-015与ADR-0001。
- 已读取《公司平台和系统全景图（2026-09快照）》，将RootData、PLM、ERP、QMS、WMS、TMS、Amazon、Shopify、CRM及在建品牌AI平台纳入连接资产盘点；资料不等于接口或权限已验证。
- 用户已确认50个Agent按场景动态匹配、自主闭环，选择MCP/tools/API/hooks及工具优先UI/UX，并将HITL和真人负责人后置；已同步50岗位、流程、Playbook、图谱、PRD、平台方案、能力资产归并和未来组织边界，形成D-016至D-019与ADR-0002。
- 用户进一步确认D-020与ADR-0003：50重新定义为逻辑岗位分身；一张紧耦合工单只有一个Case Agent和一个主岗位人格，按需加载Skills；取消LLM多Agent路由与岗位Agent互聊；模型外Policy Gate和Execution Broker拥有资产控制与执行责任。
- 核实Anthropic 2026-09-02 Commerce Agent官方指南、参考实现、Agent Skills与Prompt Caching资料；其中“单Agent”允许窄范围只读Delegate，“Global Cache”不跨组织共享，模型可提案但不能持有无门禁资产权限。
- 用户确认D-021四平面组织视图：5个经营管理、35个业务运营、5个独立控制、5个数据与Agent平台岗位；50个岗位已完成唯一平面归属，8个责任域保留为第二视角。
- 用户确认D-022与ADR-0004五契约管理：全部50个岗位分别受Business、Skill、Runtime、Access和Assurance契约约束，不设置上级Agent，也不允许AI岗位自发布配置。
- 用户确认D-023与ADR-0005：五份契约绑定为不可变Role Release Bundle，采用Draft、Evaluated、Shadow、Limited、Production、Quarantined和Retired七状态生命周期；当前没有岗位Bundle被实例化或进入运行状态。
- 用户确认D-024与ADR-0006：全部8条价值流和当前20个候选场景共用八阶段、产物驱动、门禁推进协议；岗位通过主人格、Skills、阶段产物和保障规则贡献能力，不再形成岗位Agent消息链；场景本身仍待企业验证。
- 用户确认D-025与ADR-0007：一张Case只绑定一条主价值流和一个主场景；跨价值流信号拆成共享`correlation_id`但状态、Bundle、资源和关闭结果独立的Case，只引用已验收Stage Artifact。
- 用户确认D-026与ADR-0008：正常业务保持完整八阶段；仅FLOW-07命中已发布确定性规则时，模型外Emergency Guard才可经Policy Gate、本地原子建单Outbox与Execution Broker执行固定、最小、限制性保护动作；恢复及扩大性动作仍只走正常STG-07。
- 用户确认D-027与R05-Q8：上下文与缓存采用四层、前缀稳定、按引用装配；Global Cache仅同租户/workspace与版本隔离域内复用，客户/员工/业务明细不入共享静态层；权威事实与回执归Case/Event Ledger与system-of-record。
- 用户确认D-028与R05-Q9：模型评估以业务任务闭环成功率为主，补充SLA、异常冻结率和成本；双模型策略用于常规与异常/复杂场景；异步记忆失败不阻塞Case关闭；缓存边界沿D-027固定静态前缀。
- 用户确认D-029与R05-Q10：模型只产出 Action Intent，模型外统一Policy Gate给出 `ALLOW/HOLD/DENY/NO_ACTION` 决议，Execution Broker持有Service Identity并执行受控幂等动作。资产边界未在Access Contract中声明的动作/对象/金额/频率/范围默认拒绝。
- 用户曾以D-030选择Momcozy可穿戴式吸奶器Amazon US样本；D-033现将首个执行渠道调整为Shopify DTC，Amazon范围保留为后续验证模板。
- 已形成中文交互Site首版，将50岗位、四平面组织、八阶段协同、8条价值流、五契约、生命周期、资产边界和首个试点范围汇总为可筛选的管理工作台；该Site仍是本地设计投影，未获得生产发布或业务执行地位。
- 完成Magpie-Horch固定HEAD与当前工作树的只读深度研究：识别其“能力来源—岗位/Skill装配—连接器—桌面表面—确定性Gate—同源发行—安装回退”闭环；根快速Gate实测61/61通过，但50个岗位无损校验仍因L10头像源漂移失败，已明确总绿灯不能替代覆盖说明。
- 形成D-031与ADR-0011：保留8条业务经营流，并增加岗位Bundle、Skill、连接器和Release四条能力供应流；12条流均有5步产品方案和5步分工协作设计，8条业务流岗位范围并集覆盖50/50。
- 更新中文Site为双工作流工作台，可按业务/能力家族筛选并在产品方案、分工协作之间切换；页面仍是本地只读设计投影。
- 用户允许LoopX自主推进BVS-01后，已形成订单、退款/金融、广告、价格、库存和试点准入六类数据对象的结构化契约，明确原始GMV、取消、退款、广告归因和结算现金分离，并定义13项连接证据与10个Shadow验收用例；企业接口和真实数据尚未连接。
- 用户选择“当前无可用入口”后，进一步确认Shopify DTC先行，形成D-033；原Amazon US探针任务已被Shopify试点任务替代，后续入口可用时另建渠道探针。
- D-034确认Shopify首个样本的品牌、市场、产品族、SKU数量和30天窗口；已生成[试点章程](../12-rollout/BVS-01-SHOPIFY-DTC-PILOT-CHARTER.md)和[数据契约](../08-data/BVS-01-SHOPIFY-DTC-DATA-CONTRACT.md)。范围类别确认不等于Shop GID、SKU白名单或连接器已实例化。
- D-035确认Shopify试点原始GMV采用`gross_sales`；折扣、销售冲销、退款、税费、运费、支付状态和结算现金继续作为独立分量，不以静默净额替代原始GMV。
- D-036确认首个Shopify连接新建试点专用Dev Dashboard App；已形成[只读连接器登记契约](../10-platform/deepseek-harness/SHOPIFY-READONLY-CONNECTOR-REGISTRATION.md)，模型不得接触凭据或Token，基础Scope包不默认申请`read_reports`。App尚未创建、安装或连接。
- D-037确认美国主站与专用App归属于同一Shopify Organization，认证固定为`client_credentials`；连接器登记已补齐创建、版本发布、安装、短期Token交换、Scope读回和失败冻结顺序。该决定不表示App或连接已真实建立。
- D-038确认首批SKU白名单生成方法：现有权威报表最近完整30天`gross_sales`原始Top 5，经质量、缺货和账号风险门剔除，不向第6名以后回填；已形成[范围清单契约](../08-data/BVS-01-SHOPIFY-SKU-SCOPE-MANIFEST.md)和[结构化清单](../08-data/bvs-01-shopify-sku-scope-manifest.json)。具体报表与成员仍为空。
- D-039确认首批排名的权威来源为目标Shop的Shopify Admin Analytics导出；已补充CSV快照、Hash、Schema、行数、字段、存储和PII边界。官方`Total sales by product variant`是首选候选，但尚未在目标Shop验证具体报告、套餐、字段或导出选项，也没有实际读取或导出。
- D-040确认首份快照固定使用官方`Total sales by product variant` CSV；缺少Product/Variant/SKU维度、`Gross sales`、`Net quantity`、全部合格行导出能力或唯一SKU/GID映射时进入`HOLD_REPORT_CAPABILITY_MISMATCH`，且不自动切换自定义Analytics或ShopifyQL。
- D-041先确认目标Shopify商店的商品字段是“可穿戴式吸奶器”产品家族成员来源类别；Product层精确判定后由Variants继承，禁止标题或模型推断。该决定当时留下的主选择器分支随后由D-042关闭。
- D-042确认带定义与校验规则的Shopify Product metafield是唯一主选择器；Product type和tag不作为回退。具体Definition、namespace/key、字段类型、允许值、期望值与覆盖率仍待确认。
- D-043确认新建专用`custom.product_family` Definition契约，类型为`single_line_text_field`，初始受控值和成员匹配值为`wearable_breast_pump`；目标Shop创建、ID读回、首次填充与覆盖仍待确认。
- D-044确认以一次性负责人确认的Shopify Product GID清单作为首次填充种子；只有清单绑定全量目录快照、GID 100%解析、重复/跨Shop为0、负责人确认完整且获批回填后读回100%一致，字段才接管持续权威。
- D-045确认目标Shop先完成只读预检并封存`READ_ONLY_PREFLIGHT_EVIDENCE_PACK`，随后才提交独立写入方案；Definition缺失、兼容和不兼容分别进入创建计划、复用/回填计划和HOLD。
- D-046确认`SHOPIFY_BVS01_READ_V1`声明Scope为Products、Orders、Inventory、Locations和Markets五项读取；排除`read_all_orders`、`read_customers`、`read_reports`及全部写Scope。实际Scopes必须精确读回；D-047已补充订单字段政策，访问授权仍未产生。
- D-047确认订单数据采用Level 1最小必要政策；直接身份、客户主档、自由文本、支付和员工字段拒绝，原始响应零持久化，模型只见SKU日聚合。保留期已由D-048补齐；PCD资格、Query Hash与实际调用仍待验证，订单Query继续禁用。
- D-048确认Level 1规范化订单行加密保存45天：30天经营窗口加15天晚到/重放缓冲，期满后24小时内硬删除；删除失败进入`HOLD_RETENTION_DELETE_FAILURE`。PCD资格、Scope读回、Query Hash与删除/访问/备份TTL测试仍待验证，订单Query继续禁用。
- D-049确认Level 1资格直接在目标Dev Dashboard现场只读核验；先分辨App类型、分发/归属和同一Organization关系，再按public review或custom always-available路径解释资格。已建立9项脱敏证据包；当前连接验证未完成，所有目标事实仍为`NOT_OBSERVED`。
- 用户进一步明确Shopify是空白新店且尚无上线产品，形成F-039与D-050：未来绿地顺序改为完整方案Site、店铺底座和首批产品上市；D-033至D-049保留为`SHOP-G6/SHOP-G7`目标状态合同。D-051随后把当前范围收敛为方案审阅，不实例化FLOW-04、FLOW-02或FLOW-06 Case；连续30个完整销售日后才可能启动AGT-023负责的FLOW-01 Shadow。
- 已新增[完整方案地图](../02-strategy/SOLUTION-MAP.md)与[Shopify绿地路线](../12-rollout/SHOPIFY-GREENFIELD-ROADMAP.md)，作为Site完整方案全景、平台架构和绿地八阶段门的源文档。
- D-051将店铺治理收敛为[店铺治理底座方案](../12-rollout/SHOPIFY-STORE-GOVERNANCE-FOUNDATION.md)：六个治理域、十项方案产物、三条未来关联价值流、敏捷变更通路、验收条件和逐动作授权边界均已形成；没有登录或修改Shopify。
- 为避免三套阶段编号冲突，Shopify绿地门统一为`SHOP-G0`至`SHOP-G7`，组织变革门统一为`ORG-G0`至`ORG-G5`，经营试点门统一为`PILOT-G0`至`PILOT-G4`。

## 本轮验收范围

验收对象为本地文档与业务设计数据。完成标准是职责和流程覆盖一致、角色行为与产物可检查、研究可回溯、需求有验收条件、未知项和决策状态清楚；不将文档交付写成企业系统运行验收。

检查包括：50个唯一岗位及对应卡片；8流程的AI结果负责人、参与者、编排者与Playbook映射；20业务场景完整覆盖；关系引用与语义；19部门映射覆盖全部50岗位；需求ID；内部链接、引文脚注、Markdown代码围栏、文件空白及Git状态。

v1.1结构检查曾通过的356条关系仅保留在Git历史。当前本地结构检查已覆盖：50个Role Profiles和岗位卡、四平面5/35/5/5、五类契约、七个生命周期状态、8条业务价值流、4条能力供应流、20个候选场景、8份Playbook、8个有序阶段、64条flow-stage绑定、51条候选flow-scenario绑定、140条待编译Skill Contract的历史role-flow覆盖、338条类型化关系和零条岗位间运行通信边。该结果只验证本地文档与设计数据；未开展五个参考项目运行测试、企业接口测试、Harness配置导入或经营试点。

## 当前待决定

[R05](../01-discovery/interviews/R05-organization-operating-system.md)与R04按一次一个问题推进。R05-Q10已完成；D-050已将R04-Q5现场取证延期到`SHOP-G6`访问门，D-051进一步确认当前只审阅方案而不进入实施。R04-Q2其余口径在后续继续。接下来R05后续项为：

1. Site双工作流版本完成最终内容审阅；D-052已单独授权GitHub与GitHub Pages文档发布。

[R02](../01-discovery/interviews/R02-strategic-decisions.md)已确认，R03回答已记录。[R04自主运行决策包](../01-discovery/interviews/R04-autonomous-runtime.md)在四层图谱明确后继续：

1. 当前仅审阅`SHOP-G1`店铺治理方案；未来取得实施授权后才推进`SHOP-G2`至`SHOP-G5`，并在真实Product/Variant/SKU和访问条件具备后，于`SHOP-G6`按D-049核验App、Scope和数据保护准备度，`SHOP-G7`形成30天报表、产品家族和SKU范围证据（R04-Q5）。
2. 确认100亿公司口径、Shopify以外约束权威来源及质量/停止阈值（R04-Q2剩余部分）。
3. 无策略、无回执或工具失败时的自治冻结与恢复规则（R04-Q3）。
4. 既有Agent资产与50岗位的归并（R04-Q4）。
5. 工具优先UI/UX的工作入口边界（R04-Q6）。
6. 首个新品验证机会与受保护资源（R04-Q7）。

当前下一步是完成Site、源文档和Pages发布链的一致性验收并公开发布。未来若另行授权Shopify实施，再以[店铺治理底座方案](../12-rollout/SHOPIFY-STORE-GOVERNANCE-FOUNDATION.md)生成真实对象实施包；目标Dev Dashboard登录、[L1资格现场证据包](../10-platform/deepseek-harness/SHOPIFY-LEVEL1-QUALIFICATION-EVIDENCE-PACK.md)和API预检延期到`SHOP-G6`，产品家族、Product GID种子、Variant报告和Top 5延期到`SHOP-G7`。

## 实施前尚需落实

首个经营样本的真实账号/商品范围、系统和数据来源、GMV定义与基线、动作策略、预算阈值、企业目标部署、服务身份及验收窗口。当前岗位、组织、管理、生命周期和协同JSON是v2业务设计数据，不是生产导入包；所有Bundle、Case和生产授权仍未实例化。

真人组织设计后置；经营收益、可释放费用和未来HITL介入规则仍需要真实负荷与运行证据。没有已实施裁撤、平台上线或已证明的百亿规模自动运行结论。
