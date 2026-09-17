# 项目状态

更新日期：2026-09-17

当前阶段：v2.3独立岗位分身与受控组队方案已形成。D-053确认50个岗位各自拥有独立Role Playbook、Preset Blueprint、Skills、产物、评估集和Access边界，可独立处理边界清晰的岗位任务，也可由模型外Case Control编排为Lead/Worker组队。D-050确认目标Shopify是尚无上线产品的空白新店；D-051把当前范围限定为完整方案最终审阅和Shopify店铺治理底座方案，不实例化Case或执行店铺、商品、App、连接、测试订单和业务发布。D-052授权把本项目文档与Site提交至GitHub并公开部署GitHub Pages；该文档发布不改变Shopify、企业系统、裁员、预算或生产自治权限。

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
- 完成Magpie-Horch固定HEAD与当前工作树的只读深度研究：识别其“能力来源—岗位/Skill装配—连接器—桌面表面—确定性Gate—同源发行—安装回退”闭环；历史基线曾因L10头像源漂移失败，随后旧版50岗位无损校验已在派生输出重建后通过，已明确总绿灯不能替代新Soul/Role Playbook/Blueprint覆盖说明。
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
- D-052发布已完成：方案提交`7c84617467cd2ad1a2db08ccf8cad1072ebe6c4d`已推送至GitHub `main`，GitHub Actions Pages运行[35073360037](https://github.com/zjgulai/AI-Native-Organization/actions/runs/35073360037)成功，[公开Site](https://zjgulai.github.io/AI-Native-Organization/)返回HTTP 200。公网首页、CSS、JS、50岗位数据和12价值流数据与该提交的`dist/`发布包逐字一致；Pages控制面为`build_type=workflow`且强制HTTPS。该证据只验收文档Site发布，不是Shopify、Harness或企业经营上线证据。
- D-053与ADR-0012已完成首批设计资产：由生成器从50岗位目录生成50份独立[Soul Contract](../05-agents/roles/souls/)、50份[Role Playbook](../06-playbooks/role-playbooks/index.json)、50份[DSH Preset Blueprint](../10-platform/deepseek-harness/preset-blueprints/manifest.json)及逐岗位文件。每份资产均声明独立模式、Lead/Worker组队模式、ArtifactEnvelope交接、工具类别、Access和Assurance边界；状态为设计完成但目标DSH导入schema未知，不可直接导入或宣称已运行。
- 已完成Magpie-Horch只读注入审计与[50岗位Preset注入方案](../12-rollout/MAGPIE-HORCH-ROLE-PRESET-INJECTION-PLAN.md)：确认现有生成器只覆盖旧9类材料、旧版L1–L10校验已通过但未覆盖Soul/Role Playbook/Blueprint，且team-gui动态规划与D-053存在边界冲突；当前不修改Magpie-Horch代码、配置或业务连接。
- 用户已确认D-054暂时保留审计期间重建的派生preset，并确认D-055采用“身份/灵魂摘要常驻、Role Playbook按需Skill加载、loader不可用时受控内嵌回退”；DSH loader与schema仍待RP-M1核实。
- 用户已确认D-056：50个岗位默认采用最小权限Access allowlist，平台岗位的额外读取能力逐项例外，所有写动作只输出Action Intent；具体工具schema与服务端拒绝机制仍待RP-M1/RP-M3核实。
- 用户已确认D-057：复杂Case由模型外External Case Control负责编排，team-gui只作为固定执行、UI、运行历史和用量观测适配层；业务Case关闭dynamic planner、adaptive selection和模型驱动路由。
- 用户已确认D-058：通过模型外preset resolver/adapter将preset_id与不可变Role Release Bundle绑定后启动子会话；名称或systemPrompt映射不得作为正式身份依据。
- 用户已确认D-059：生成preset目录继续作为`~/.dsh/.agent-presets/`派生输出，不提交到Magpie-Horch仓库；仓库只保存compiler、规则、schema、验证器和来源引用。
- 用户已确认D-060：compiler一次覆盖全部50个岗位，运行验证先做4个代表岗位影子试验，再按门禁扩展；影子结果不等于生产授权。
- RP-M1只读核验已完成并沉淀为[DSH预设与适配契约证据](../10-platform/deepseek-harness/MAGPIE-RP-M1-SCHEMA-EVIDENCE.md)：记录Magpie vendor pin、官方preset元数据、mount/composeFrom/select会话语义、dsh-skill-subset边界、team-gui schema限制、现有generator材料缺口，以及`role_assets`、Role Release Bundle、Case/Artifact/Action adapter的候选结构。该文档只形成设计基线；目标企业DSH Host、导入schema、服务端权限和外部控制面仍待验证，Magpie-Horch代码与派生preset未被修改。
- 已完成[RP-M2 compiler注入规格](../12-rollout/MAGPIE-RP-M2-COMPILER-INJECTION-SPEC.md)的获准代码落地：Magpie-Horch 的 `generate.mjs`、`verify-lossless.mjs` 与 `README.md` 已扩展到 50 份 Soul / Role Playbook / Blueprint；实际 `~/.dsh/.agent-presets/agt-001..agt-050` 已重生成。L1–L12 共 5106 条断言通过，连续重生成逐字节一致，篡改 Soul 快照的反向探针按预期失败。当前仍不代表目标 Host 的岗位 Skill loader、DSH 导入、业务连接或生产授权已验证；批量 I/O 原子替换与实际岗位 Skill 派生属于后续 Host 适配门。
- 已形成对外BP页面`bp/index.html`（源片段`bp/_body.html`，装配脚本`bp/build.sh`）：十一节结构，第07节并排呈现「已经做完」与「明确没有验证」，第08–09节的市场、定价、单位经济与资金结构**全部标注为示意模型**。
- 经济模型的假设已同步入仓库，不再只存在于BP页面：[BP经济模型与参数来路](../02-strategy/BP-ECONOMIC-MODEL.md)为权威文档，[bp-economic-model.json](../02-strategy/bp-economic-model.json)为机器可读事实源，`scripts/verify-bp-economics.mjs`核对三处一致。脚本强制`parameters[].kind`只允许`assumption`，并核对21项组内算术、参数性质、页面与文档取值字符串；当前21项算术通过、9项参数全部为假设、页面与文档0项缺失。该结果只证明三处写法一致且算术自洽，不证明假设合理或可达成。
- 已形成[实施蓝图](../12-rollout/IMPLEMENTATION-BLUEPRINT.html)：以BP十一节骨架展开的内部实施口径，覆盖资产清单、五条硬约束及其强制机制、八阶段产物门禁、MDC/GOC生效机制、DSH适配八个工作包、六道验证门、三套阶段门命名、排期与停止条件，并单列已识别的源内不一致（RP-G编号双轨、Magpie版本未同步、需求条数口径差异、增长官岗位数笔误、BVS-06名称两种写法、GOC英文全称缺失、RP-M5表述滞后）。该文件只记录设计与静态验证状态，不产生运行能力。
- 本轮已按上述口径校正BP页面三处：定价锚定段落补出`250–900 万 / 年`的推导带宽、「这些数字的来路」表补入团队规模参数、页脚指向仓库内权威文档。BP页面与仓库文档的取值一致性由脚本强制，不再依赖人工同步。

## GitHub Pages发布证据

| 证据层 | 结果 | 边界 |
| --- | --- | --- |
| 本地发布包 | 50岗位、8条业务流、4条能力流、33项PRD需求、6个治理域和10项治理产物检查通过；WCAG A/AA自动审计0项违规 | 自动审计对背景渐变上的598个元素无法计算颜色对比，保留为`incomplete`，不是通过结论 |
| Git commit与远端分支 | 本地HEAD、`origin/main`和GitHub API在首次Pages发布时均为`7c84617467cd2ad1a2db08ccf8cad1072ebe6c4d` | 后续仅文档证据提交不改变已发布`dist/`字节 |
| GitHub Actions | Pages workflow运行`35073360037`成功 | Workflow成功不单独证明公网内容正确 |
| Pages控制面 | `https://zjgulai.github.io/AI-Native-Organization/`，`build_type=workflow`，HTTPS开启 | 控制面配置不替代公网取证 |
| 公网内容 | 首页、`styles.css`、`app.js`、`roles.json`和`e2e-workflows.json`均返回成功并与本地发布包SHA-256字节一致；浏览器加载50岗位和12价值流、无错误覆盖层、无横向溢出 | 不证明企业系统连接、业务权限或经营效果；其中「无横向溢出」的窄屏部分受测量方法所限（Chrome headless视口钳制在500px），已由第三次发布条目纠正 |

### 第二次发布（2026-09-18，D-064）

| 证据层 | 结果 | 边界 |
| --- | --- | --- |
| Git commit与远端分支 | 本地HEAD、`origin/main`与GitHub API均为`df37941cda79ac39ca1b3fa45f36b26c5b12e456`（`65be4d3..df37941`快进推送，6个提交） | 推送成功不证明公网内容正确 |
| GitHub Actions | Pages workflow运行[35258440062](https://github.com/zjgulai/AI-Native-Organization/actions/runs/35258440062)成功 | Workflow成功不单独证明公网内容正确 |
| 公网内容 | `dist/`全部7个文件（`index.html`、`styles.css`、`app.js`、`data/roles.json`、`data/flows.json`、`data/role-assets.json`、`data/e2e-workflows.json`）与本地发布包SHA-256**逐字节一致**；首页返回200、标题正确、岗位数据50条 | 本次提交未改动`dist/`，公网字节与首次发布预期相同 |
| 新增文档可达性 | `docs/12-rollout/IMPLEMENTATION-BLUEPRINT.html`、`docs/02-strategy/BP-ECONOMIC-MODEL.md`、`docs/02-strategy/bp-economic-model.json`、`scripts/verify-bp-economics.mjs`、`bp/index.html`经GitHub API均返回200 | 文件可达不等于内容已被审阅 |
| 本地网络异常与处置 | `github.com`的DNS解析结果`20.205.243.166:443`不可达，`git push`两次失败；改用`--resolve`指向可用IP后推送成功 | 属本机网络/DNS路由问题，不是仓库或权限问题；未修改系统hosts |

### 第三次发布（2026-09-18，D-065）：两份HTML文档进入公网

| 证据层 | 结果 | 边界 |
| --- | --- | --- |
| Git commit与远端分支 | 本地HEAD、`origin/main`均为`351afc198b9fcc61a2227ecfc43c0dee84ba40bc`（`2bf9ce6..351afc1`快进推送） | 推送成功不证明公网内容正确 |
| GitHub Actions | Pages workflow运行[35259854355](https://github.com/zjgulai/AI-Native-Organization/actions/runs/35259854355)成功 | Workflow成功不单独证明公网内容正确 |
| 公网内容 | `dist/`全部**9个文件**与本地发布包SHA-256逐字节一致；`/`、`/bp/index.html`、`/docs/12-rollout/IMPLEMENTATION-BLUEPRINT.html`均返回200 | 本次新增2个文件，首次发布的7个文件字节未变 |
| 此前不可达的纠正 | 第二次发布记录的「文档可达」仅指GitHub API返回200；Pages只上传`./dist`，两份HTML当时在公网均为**404**。本次由`scripts/build-pages-docs.mjs`归入`dist/`，公网转为200 | 文件在GitHub可达不等于在Pages可访问，两者发布面不同 |
| 链接改写 | 实施文档22条仓库内链接改写为GitHub绝对链接、1条改为站内相对链接；17个唯一改写目标经GitHub API校验全部200；BP页自包含，副本与源逐字节一致 | 改写只发生在`dist/`副本，源文档相对链接未改动 |
| 窄屏复核与测量方法纠正 | `bp/index.html`在360/390/414/500/600/768/1024/1280/1440九个宽度**0溢出**；实施文档窄屏下3–5个表格超出视口但全部位于`table-wrap[overflow-x:auto]`内可横向滚动，**0个被裁切** | **Chrome headless把视口钳制在最小500px**，此前「390/414无溢出」实为在500px下测得；本轮改用「宽窗口内嵌固定宽度iframe」才真正触达窄屏 |
| 门户改动 | `dist/index.html`「追溯权威源」新增两条站内入口；按同一方法复测九个宽度，溢出情况与改动前**逐项完全相同**，改动为布局中性 | 门户窄屏下顶部导航`nav[overflow-x:auto]`有3个锚点超出视口，属横向滚动设计，早于本次改动存在 |
| 陈旧副本闸门 | `pages.yml`发布清单增加两份文档，并新增「重跑生成脚本后比对`dist/`」步骤：源文档改动而未重建`dist`时**硬失败**；触发路径相应加入两份源文档与生成脚本 | 该闸门防的是「公网长期展示旧副本而不报错」，不校验内容是否正确 |
| 本地网络 | 本次`git push`一次成功，未使用`--resolve`绕行；DNS异常未复现，故未保留绕行参数 | 异常是否消除未经独立验证，仅记录本次未复现 |

## 本轮验收范围

验收对象为本地文档与业务设计数据。完成标准是职责和流程覆盖一致、角色行为与产物可检查、研究可回溯、需求有验收条件、未知项和决策状态清楚；不将文档交付写成企业系统运行验收。

检查包括：50个唯一岗位及对应卡片；50份Soul Contract、50份Role Playbook、50份Preset Blueprint；8流程的AI结果负责人、参与者、编排者与Playbook映射；20业务场景完整覆盖；关系引用与语义；19部门映射覆盖全部50岗位；需求ID；内部链接、引文脚注、Markdown代码围栏、文件空白及Git状态。

v1.1结构检查曾通过的356条关系仅保留在Git历史。当前本地结构检查已覆盖：50个Role Profiles和岗位卡、50份Role Playbook、50份Preset Blueprint、四平面5/35/5/5、五类契约、七个生命周期状态、8条业务价值流、4条能力供应流、20个候选场景、8份共享Playbook、8个有序阶段、64条flow-stage绑定、51条候选flow-scenario绑定、140条待编译Skill Contract的历史role-flow覆盖、338条类型化关系和零条未经Case Control控制的岗位间运行通信边。该结果只验证本地文档与设计数据；未开展五个参考项目运行测试、企业接口测试、Harness配置导入或经营试点。

## 当前待决定

[R05](../01-discovery/interviews/R05-organization-operating-system.md)与R04按一次一个问题推进。R05-Q10已完成；D-050已将R04-Q5现场取证延期到`SHOP-G6`访问门，D-051进一步确认当前只审阅方案而不进入实施。R04-Q2其余口径在后续继续。接下来R05后续项为：

1. 完整方案Site已完成发布级内容审阅并公开部署；后续管理层评审以公网版本和权威源文档为准。

[R02](../01-discovery/interviews/R02-strategic-decisions.md)已确认，R03回答已记录。[R04自主运行决策包](../01-discovery/interviews/R04-autonomous-runtime.md)在四层图谱明确后继续：

1. 当前仅审阅`SHOP-G1`店铺治理方案；未来取得实施授权后才推进`SHOP-G2`至`SHOP-G5`，并在真实Product/Variant/SKU和访问条件具备后，于`SHOP-G6`按D-049核验App、Scope和数据保护准备度，`SHOP-G7`形成30天报表、产品家族和SKU范围证据（R04-Q5）。
2. 确认100亿公司口径、Shopify以外约束权威来源及质量/停止阈值（R04-Q2剩余部分）。
3. 无策略、无回执或工具失败时的自治冻结与恢复规则（R04-Q3）。
4. 既有Agent资产与50岗位的归并（R04-Q4）。
5. 工具优先UI/UX的工作入口边界（R04-Q6）。
6. 首个新品验证机会与受保护资源（R04-Q7）。

当前下一步是管理层在[公开Site](https://zjgulai.github.io/AI-Native-Organization/)审阅独立岗位分身与组队方案，并指定需要优先回放的岗位/场景；RP-M2 已完成材料注入与静态门禁，后续以目标DSH版本、preset schema、插件、Host tool行为和服务身份边界开展 RP-M3/RP-M4 的隔离适配。具体门禁见[50个独立数字分身实施TODO](../12-rollout/ROLE-PRESET-IMPLEMENTATION-TODO.md)。Shopify仍停在`SHOP-G1`方案状态。未来若另行授权Shopify实施，再以[店铺治理底座方案](../12-rollout/SHOPIFY-STORE-GOVERNANCE-FOUNDATION.md)生成真实对象实施包。

50份Soul、50份Role Playbook、50份Preset Blueprint与管理层设计资产已提交并推送至`origin/main`（`df37941c`），Pages workflow运行`35258440062`成功，公网`dist/`字节与本地一致，见上方「第二次发布」证据表。

管理层设计已形成完整设计资产，**结构为3岗位（2026-09-18由D-062确认）**：1个CEO（MGT-001）与2个二级负责人——MGT-002 增长官（覆盖AGT-001~004、AGT-006~039，共38岗）与 MGT-003 治理官（覆盖AGT-005、AGT-040~050，共12岗），两域并集为全部50岗且**双线归属为0**；v1曾为1个CEO + 8个CXO（共9岗），因用户决定减少协调面而改为v2。主设计见[管理层设计](../04-organization/MANAGEMENT-LAYER.md)，决策归属见[决策权阶梯](../04-organization/management/DECISION-RIGHTS.md)，决定依据见[ADR-0014](../adr/0014-management-decision-rights-plane.md)；3份管理岗位档案、3份Soul、3份Role Playbook、3份Preset蓝图与结构化[管理层目录](../04-organization/management/management-catalog.json)位于`docs/04-organization/management/`。该层的核心约束不变：不进入Case执行链、不作为任何Case的Lead或Worker、不与50个岗位发生会话、不持有Service Identity与Action Intent能力、只读聚合视图，权力只通过版本化契约（MDC/GOC）与资源配额生效。**v2新增承重机制**：合并后治理官同时是指标口径的作者、维护者与被评估者，因此①口径冻结权归AGT-005与外部复核（治理官只有提案权）；②涉治理官自身尺度的争议走**L2b真人所有者**（不经CEO）；③AGT-005复核结论直达CEO与真人所有者、不向治理官汇报。这三条必须由模型外机制保障——若目标Host只能以Prompt表达隔离，MGT-003不得进入Shadow阶段。待决项为MGT-Q1/Q2/Q3、MGT-G8/G9与MGT-Q5（是否设单一通用管理Agent对照臂）；外部证据调研见[AI原生组织管理层调研](../14-research/AI-NATIVE-ORG-MANAGEMENT-LAYER.md)（EVD-036~039）。管理决定的生效机制已单列设计：[管理层决定的生效机制](../04-organization/management/ENFORCEMENT.md)明确MDC/GOC最小机器可读schema、包含关系校验（超出即拒绝不截断）、资源预留与队列语义、指标口径由独立复核冻结、独立控制指标豁免与约束记录经Policy Gate生效；其中三项基线已由D-061确认。该设计未实例化任何管理岗位，也未改变D-022。影子验证见[影子验证设计](../04-organization/management/SHADOW-VERIFICATION.md)，定位为`ORG-G1`工作包，采用`MGT-EVAL-A`抗污染、`MGT-EVAL-B`一致性、`MGT-EVAL-C`生效、`MGT-EVAL-R`层数复审、**新增`MGT-EVAL-R0`结构必要性与`MGT-EVAL-R2`独立性复审**六道门，v2的3个岗位**全部同时先验**（代表子集概念已不成立）。v2验证语料已按SHADOW-VERIFICATION.md §3.5重建并冻结：[eval/management-eval-corpus.v2.json](../04-organization/management/eval/management-eval-corpus.v2.json)（25用例：L-A 12 / L-B 13，确定性子集12、阶梯子集6、L2b 2，`corpus_sha256=2a9977d3…d1d57c`）；v1语料（19用例，`corpus_sha256=64c77da5…ead1d72`）原地保留为结构变更的追溯记录，标记`structure_currency=superseded_by_v2_structure`，**不得引用其Hash证明v2已被验证**。校验脚本`scripts/verify-management-eval-corpus.mjs`在校验两份语料时会核Hash、阈值、结构时效、计数自洽、阶梯取值域、L2b用例形态与「L-A条数=各Playbook §2反模式条数」；**语料冻结不等于验证已执行**：`MGT-EVAL-B`已于2026-09-18执行且**未通过**（阶梯归属一致率4/6=66.7%，阈值100%；L2b识别2/2=100%），台账见[eval/runs/2026-09-18-MGT-EVAL-B/RUN-LOG.md](../04-organization/management/eval/runs/2026-09-18-MGT-EVAL-B/RUN-LOG.md)；两项不一致的阶梯项已按用户决定落地为确定性规则（`DECISION-RIGHTS.md`§3.1混合级别捆绑、§3.2实质变更的证据前提），`LB-MGT001-03`上收分类仍待决。且v1与v2的阶梯口径不同（L1已拆为L1-G/L1-V并新增L2b），结果不可横向比较。`MGT-EVAL-C`依赖三个尚未实现的构件（Case Control读取MDC、资源预留服务、Policy Gate读取约束记录），因此在此之前管理层不得被表述为可运行。

## 实施前尚需落实

首个经营样本的真实账号/商品范围、系统和数据来源、GMV定义与基线、动作策略、预算阈值、企业目标部署、服务身份及验收窗口；50个Preset Blueprint仍需目标DSH schema映射、独立/组队回放和逐岗位评估。当前岗位、Role Playbook、Preset Blueprint、组织、管理、生命周期和协同JSON是业务设计数据，不是生产导入包；所有Bundle、Case和生产授权仍未实例化。

真人组织设计后置；经营收益、可释放费用和未来HITL介入规则仍需要真实负荷与运行证据。没有已实施裁撤、平台上线或已证明的百亿规模自动运行结论。
