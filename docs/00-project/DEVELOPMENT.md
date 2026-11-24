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
| 重要且难逆转的取舍 | `docs/adr/`，当前有ADR-0001至ADR-0015 |
| 场景与职责结构数据 | `docs/05-agents/role-catalog.json`、`docs/07-orchestration/collaboration-graph.json` |
| v2组织责任主图 | `docs/04-organization/AI-ORGANIZATION-MAP.md`、`docs/04-organization/organization-graph.json` |
| v2 Agent管理主图 | `docs/05-agents/AGENT-MANAGEMENT-GRAPH.md`、`docs/05-agents/agent-management-graph.json` |
| v2岗位Bundle与生命周期 | `docs/05-agents/AGENT-LIFECYCLE.md`、`docs/05-agents/agent-lifecycle.json` |
| v2八阶段协同与Case记录 | `docs/07-orchestration/COLLABORATION-GRAPH.md`、`docs/07-orchestration/collaboration-graph.json`、`docs/07-orchestration/case-record-contract.json` |
| 场景、角色、规则与协作解释 | `docs/03-scenarios/` 至 `docs/09-governance/` |
| 13条端到端价值流双视图 | `docs/03-scenarios/END-TO-END-VALUE-STREAMS.md`、`docs/03-scenarios/e2e-value-streams.json` |
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

数字分身视觉资产（D-068、D-069、D-070、D-071、D-072、D-073、D-074、D-075、D-076、D-077）：头像、主题变体、alt text、来源、哈希和发布状态属于独立的展示与来源追溯层，不是Business、Skill、Runtime、Access、Assurance或MDC/GOC契约，也不能用作preset resolver、Service Identity、权限、组织汇报线或Case成员选择依据。处理 Sanbao_Web 图像时先阅读[Sanbao视觉身份与资产方案](../12-rollout/SANBAO-VISUAL-IDENTITY-ASSET-PLAN.md)、[VIS-G0来源冻结记录](../12-rollout/visual-assets/SANBAO-WEB-SOURCE-SNAPSHOT-2026-09-23.md)、[VIS-G1权利、来源与公开范围审查](../12-rollout/visual-assets/SANBAO-WEB-VIS-G1-RIGHTS-AND-VISIBILITY-REVIEW-2026-09-23.md)、[VIS-G2语义审查](../12-rollout/visual-assets/SANBAO-WEB-VIS-G2-SEMANTIC-REVIEW-2026-09-24.md)、[VIS-G3绑定审查](../12-rollout/visual-assets/SANBAO-WEB-VIS-G3-BINDING-REVIEW-2026-09-24.md)、[VIS-G4画像审查](../12-rollout/visual-assets/SANBAO-WEB-VIS-G4-DOSSIER-REVIEW-2026-09-24.md)、[VIS-G5静态质量审查](../12-rollout/visual-assets/SANBAO-WEB-VIS-G5-STATIC-QUALITY-REVIEW-2026-09-24.md)及[VIS-G6发行审查](../12-rollout/visual-assets/SANBAO-WEB-VIS-G6-VISUAL-IDENTITY-RELEASE-REVIEW-2026-09-24.md)。VIS-G0已把上游固定为提交`2e676da87999c88fbc70baae9eb5dbf72c2b757e`和tree`4948f180d4e5a0bc8c599022227c384d525729c5`，只登记路径、Git blob ID、字节数、上游清单声明和目录元数据指纹；D-075才对53条已绑定角色的424个交付二进制做实际临时读取与复算。D-071 记录用户对冻结 Sanbao_Web 全量素材的完整第一方授权，覆盖本项目的跨仓库复制、内部保存、裁切/转码/派生、未来素材池、公开展示、商业使用与再分发；VIS-G1 因此已通过，全部1,848个图像均为`SOURCE_RECORDED`，其中1,729个为`APPROVED_DELIVERY`、119个为`POOL_ONLY`、`HOLD_VIS_G1=0`。AGT-001至AGT-050按同ID稳定映射；用户已选择MGT-001天時→AGT-067、MGT-002地利→AGT-090、MGT-003人和→AGT-056作为源人物，53条角色均有 VIS-G3 同人深浅主题结构性绑定。D-075 已确认其中51条为`PASS_FOR_VIS_G5_ASSET_QUALITY`；D-076 已接受`VIB-AGT-029`与`VIB-AGT-041`的64px跨角色展示近似，二者保持`PASS_FOR_VIS_G5_ASSET_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK`并随发行保留风险记录。D-077 已在`VIR-SANBAO-WEB-2026-09-24-R1`中把53条已验收绑定的318个 WebP 接入本地静态站点；候选池、原生PNG及来源、参考、设计、提示词、身份参考资料仍不在公开包中。AGT-090 的原始参考资料、其他 sources、references、设计和总览图保持在受限素材池；AGT-051/052保留原语义，余下候选人物不自动成为岗位或展示绑定。全量候选池仍仅由固定远端来源与G1/G2登记册管理，未物化至本项目；需另行确定私有存储才能归档二进制。视觉素材变动不触发或替代Role Release Bundle，不能把图片显示成功写成运行验收。

D-072 / VIS-G2：后续处理固定 Sanbao_Web 素材时还必须阅读[VIS-G2语义审查](../12-rollout/visual-assets/SANBAO-WEB-VIS-G2-SEMANTIC-REVIEW-2026-09-24.md)与其[机器可读语义登记册](../12-rollout/visual-assets/SANBAO-WEB-VIS-G2-SEMANTIC-REGISTER-2026-09-24.json)，并在更改登记规则后运行`node scripts/build-sanbao-vis-g2.mjs`和`node scripts/verify-sanbao-vis-g2.mjs`。登记册的三层语义为人物族、单项素材和素材关系；候选池关系属于人物族，主题/尺寸/格式/展示适配性属于单项素材，精确二进制与近视觉重复不能混写。VIS-G2 已复核1,848个图像与102个人物族的 manifest 声明矩阵、精确 Git blob 去重（0组）和50/50项目ID/别名映射，但未下载图像或宣称像素、感知相似度、深浅主题实际预览或小尺寸质量已通过。上游`job`/`deliver`只作来源上下文，项目`role-catalog.json`仍是岗位语义权威；受限参考/设计素材在登记册中必须匿名化，禁止写入路径、blob、提示词、外貌或身份参考字段。VIS-G0 历史的三类 locale 目录指纹不可按记录算法复算：D-073 已接受登记册的`VIS-G2-CANONICALIZATION-1` code-point路径序指纹作后续门的可复算锚点，旧值保留且不得说成已复验。VIS-G4画像投影、VIS-G5二进制/视觉验收、VIS-G6页面交付均需独立启动；不得由VIS-G2自动越门。

D-073 / VIS-G3：绑定表的唯一事实源是[VIS-G3机器可读绑定表](../12-rollout/visual-assets/SANBAO-WEB-VIS-G3-VISUAL-IDENTITY-BINDINGS-2026-09-24.json)，修改绑定规则后必须运行`node scripts/build-sanbao-vis-g3.mjs --output docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G3-VISUAL-IDENTITY-BINDINGS-2026-09-24.json`和`node scripts/verify-sanbao-vis-g3.mjs`。50条AGT必须保持`role_id = source_persona_id`；三条MGT必须保持MGT-001→AGT-067、MGT-002→AGT-090、MGT-003→AGT-056；不同角色不得共享源人物。每一角色的深浅主题必须引用同一人物的64px列表图、256px主图/详情图、128px同人后备图和native质量追溯图，且所有引用必须来自VIS-G2的`APPROVED_DELIVERY`与`ELIGIBLE_FOR_PERSONA_BINDING`变体。上游岗位字段不能覆盖项目角色语义；alt text仅为中性草案；状态必须保持`STRUCTURAL_BINDING_PENDING_VIS_G5`和`NOT_CREATED_PENDING_VIS_G5`，直到实际二进制、视觉、可访问性和感知去重通过VIS-G5。绑定表不保存受限来源路径或提示词，也不能触发角色、权限、运行时或页面变更。

D-074 / VIS-G4：Digital Persona Dossier 的唯一机器可读事实源是[VIS-G4登记册](../12-rollout/visual-assets/SANBAO-WEB-VIS-G4-DIGITAL-PERSONA-DOSSIERS-2026-09-24.json)，它以53条独立`dossier_id`投影既有角色合同与VIS-G3绑定，而不是生成53套新的角色合同或图片文件。修改Dossier规则后必须运行`node scripts/build-sanbao-vis-g4.mjs --output docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G4-DIGITAL-PERSONA-DOSSIERS-2026-09-24.json`和`node scripts/verify-sanbao-vis-g4.mjs --dossiers docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G4-DIGITAL-PERSONA-DOSSIERS-2026-09-24.json`。构建器必须只读取项目角色目录、Role Profile、Soul、Role Playbook、Preset Blueprint、执行岗位管理/协同图谱、管理层权责资料和VIS-G3绑定；以`VIS-G4-INPUT-CANONICALIZATION-1`记录223份输入的内容哈希，不能将该摘要误称为图片、Bundle或运行验收。AGT岗位语义以`role-catalog.json`为准，并保留五契约、无自发布、无Service Identity、受控Lead/Worker与`production_authorized=false`；MGT语义以`management-catalog.json`为准，必须保持不进入Case Lead/Worker、无Action Intent/资产动作、默认拒绝和只读聚合边界。Dossier只保存VIS-G3 `binding_id`/`asset_id`，不得写入图像二进制、URL/base64、上游图像路径、Git blob、提示词、外貌或参考资料。MGT-002与MGT-003现有Blueprint各有主产物与`access.scope_source`字段不一致，Dossier只能以`SOURCE_FIELD_NONAUTHORITATIVE_PENDING_RP_REMEDIATION`显式隔离并采用管理层目录的角色语义，不能在VIS-G4静默修复或通过错误字段扩大权限。状态必须保持`COMPLETE_DOSSIER_PROJECTION_PENDING_VIS_G5`、`STRUCTURAL_DOSSIER_PENDING_VIS_G5`、`NOT_CREATED_PENDING_VIS_G5`和`NOT_RENDERABLE_PENDING_VIS_G5_AND_VIS_G6`，直到后续独立门验收。

D-075 / VIS-G5：实际质量的唯一机器可读事实源是[VIS-G5静态质量登记册](../12-rollout/visual-assets/SANBAO-WEB-VIS-G5-STATIC-QUALITY-REGISTER-2026-09-24.json)。运行`python3 scripts/build-sanbao-vis-g5.py --output docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G5-STATIC-QUALITY-REGISTER-2026-09-24.json --reviewer "..." --hold-binding VIB-AGT-029 --hold-binding VIB-AGT-041 --monitor-persona-pair AGT-027,AGT-030 --monitor-persona-pair AGT-011,AGT-032 --monitor-persona-pair AGT-016,AGT-046`后，必须运行`node scripts/verify-sanbao-vis-g5.mjs --quality-register docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G5-STATIC-QUALITY-REGISTER-2026-09-24.json`。构建器只从 D-073 接受的固定提交，把53条VIS-G3绑定展开为424个`APPROVED_DELIVERY`二进制并在内存中读取；逐项核验Git blob、字节、签名MIME、Pillow解码格式与尺寸，记录实际SHA-256及`VIS-G5-BINARY-CANONICALIZATION-1`摘要，不得把来源路径、raw URL、图像、base64、提示词、身份/风格参考写入登记册或项目。质量结果不是角色重映射权：D-075中51条为`PASS_FOR_VIS_G5_ASSET_QUALITY`，`VIB-AGT-029`和`VIB-AGT-041`必须保持`PENDING_OWNER_VISUAL_DECISION`直至用户选择接受风险、替换其中一条绑定后重跑VIS-G3/G5，或请求新变体；三条监测对仅在未来图像变更时复核。`POOL_ONLY`与未绑定素材继续只在固定远端目录中治理，物化全量1,848项前必须另行决定私有存储；VIS-G5不创建Visual Identity Release、页面、`dist/`、Pages、DSH、运行时、Access或Role Release Bundle。

D-076 / VIS-G5 风险接纳：D-075 中 `VIB-AGT-029` 与 `VIB-AGT-041` 的 `PENDING_OWNER_VISUAL_DECISION` 是历史发现，不是当前未决事项。用户已选择接受二者的64px跨角色近似风险，现有 VIS-G3 绑定不变；重建登记册必须使用`--accepted-risk-binding VIB-AGT-029 --accepted-risk-binding VIB-AGT-041 --owner-risk-decision-id D-076`，并得到`COMPLETE_STATIC_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK_PENDING_VIS_G6`。两条的状态必须是`PASS_FOR_VIS_G5_ASSET_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK`，保留近似信号、D-076与监测项；不能把它们改写为无风险或普通通过。D-076本身不是 Visual Identity Release、页面、发布、DSH或运行时授权；它是D-077的一个前置质量处置。

D-077 / VIS-G6 发行与公开部署：唯一的机器可读本地发行事实源是[VIS-G6发行登记册](../12-rollout/visual-assets/SANBAO-WEB-VIS-G6-VISUAL-IDENTITY-RELEASE-2026-09-24.json)，公开部署结果以[公网部署证据](../12-rollout/visual-assets/SANBAO-WEB-VIS-G6-PUBLIC-DEPLOYMENT-EVIDENCE-2026-09-24.json)为准。重建或变更公开交付件时，先运行`node scripts/build-sanbao-vis-g6.mjs`，再运行`node scripts/verify-sanbao-vis-g6.mjs`；两者只接受 VIS-G2/3/4/5 已通过、D-073 可复算锚点和D-076风险处置。`VIR-SANBAO-WEB-2026-09-24-R1`仅将53条已绑定角色的深浅主题64/128/256px WebP（318件）复制到`dist/assets/visual-identities/`并写入`dist/data/visual-identities.json`；该数据只允许站点所需的角色显示资料、交付相对路径、中性alt text和G4允许的展示字段，严禁上游路径、raw URL、Git blob、来源人物、候选池、原生PNG、sources、references、设计输入、提示词或身份参考资料。提交`abfd1733e884adfe7b576e7fa028c8a9e23b67c4`已由GitHub Pages Action `35910354396`成功发布，4个核心静态文件和318个WebP均与发行包匹配，状态为`COMPLETE_PUBLIC_VISUAL_IDENTITY_RELEASE`。以后每次发布仍须重做Actions、Pages与公网实际字节验证；公开展示成功不构成运行时验收。

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

D-078确认新增FLOW-09品牌资产经营价值流：BVS-09「品牌资产经营舱」以AGT-029立言为默认主岗位，绑定SCN-002、009、011、012、013五个候选场景，领域内核为《弱品牌，强品牌：数字时代增长知与行》品牌增长方法论（沉淀于`docs/06-playbooks/BRAND-GROWTH-METHODOLOGY.md`）。本流拥有品牌资产结果闭环，KPI采用品牌资产与GMV双层口径；与FLOW-01的GMV战术闭环按主结果拆分关联Case，不改变D-020~D-029的Case、授权与执行边界，全部生产授权仍为false。

FLOW-09首批可设计资产（均为设计基线，不实例化Case、不连接数据源）：`docs/03-scenarios/SCN-002.md`为首个场景v1规格（按templates/scenario.md九节）；`docs/06-playbooks/skills/`为品牌域Skill契约目录（SKL-BRAND-01覆盖审计、02品效归因、03出海检查、04 VOC细分验证，契约字段按AGT-048治理规范）；`docs/08-data/FLOW-09-DUAL-KPI-CATALOG.md`为双层指标字典（L1当期核算+L2品牌资产，阈值待校准）；`docs/12-rollout/FLOW-09-BRAND-PILOT-CHARTER.md`为首个Case试点章程（覆盖缺口诊断，预期NoActionRecord路径）。`ref/`源书扫描材料已加入`.gitignore`，版权资产永不入库。

语义底座层（书3《本体驱动的AI数据管理》吸收，均为设计方法层，不建语义数据库、不引入RDF/OWL）：`docs/14-research/ONTOLOGY-BOOK-ANALYSIS.md`为全书书评与逐板块映射；`docs/08-data/SEMANTIC-LAYER-STRATEGY.md`为采用范围/FFA映射/分层治理/场景就绪度标准/资产接口约定；`docs/08-data/KNOWLEDGE-ELICITATION-29.md`为「29句话」知识工程模板中文化（7维29式，显性AI提炼+隐性专家提取）；`docs/08-data/FLOW-09-ONTOLOGY-PILOT.md`为品牌域首个本体试点（六类概念域+AGT-029/SCN-002语义契约试填）；`docs/03-scenarios/ONTOLOGY-READINESS.md`为20场景本体就绪度矩阵（优先4/可选10/暂不5）。试填草稿须经用户（业务专家角色）逐条评审后方可定稿；阈值类规则在企业数据回填前标注`pending_data`。Native-ai-organ站点以brand-plan六层结构、pilot-assets语义底座组和semantic.html全景页呈现结果；2026-11-24起书3转为笔记轨成员，站点book3/提供10章框架+6篇精选精读（ch3/5/6/7/8/9），首页统计口径改为三本书。

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

**写入工具会产生非仓库惯例权限（必查）**：实测 `write` 落盘为 0600、`edit` 为 **0000**——后者意味着 owner 自己也读不了，后续 `read`/`edit`/`grep` 全部 EACCES，而症状看起来像别的问题（本轮即因此被误判过一次）。因此**每次 `edit` 之后必须立刻恢复权限**。`python3 scripts/fix-file-perms.py` 可批量修复、`--check` 可用于校验；它用 git 界定管辖范围（被 gitignore 的工具状态目录与 `*.lock` 不在管辖内——锁文件用 0600 本就更合理，不该被「修复」）。

注意 `chmod` 会让 `edit` 判定「文件已变更」而拒绝写入，因此顺序必须是 **edit → chmod → （需要再改时）read → edit**，不能先 chmod 再 edit。

**本机 `github.com:443` 可能不可达，`git push` 会失败（已复现）**：实测 DNS 把 `github.com` 解析到 `20.205.243.166`，该地址 TCP 连接失败（`Failed to connect ... after 75013 ms`、`HTTP2 framing layer`、`Empty reply from server` 三种报错都出现过），而 `api.github.com`、`codeload.github.com` 正常，`140.82.112.3` / `140.82.113.3` 也可用。判定方法是分别探测这三个地址，**不要**据此认为仓库、权限或凭据有问题。临时处置：`git -c http.curloptResolve=github.com:443:140.82.112.3 push origin main`（只对本次命令生效）。这只绕过本机 DNS 路由，不改变身份校验。修复 DNS 后应去掉该参数。

独立岗位资产还要核对50份Soul Contract、50份Role Playbook、50份Preset Blueprint的ID、引用、模式和生产授权状态一致，并验证standalone与Lead/Worker两种运行说明都存在。

v2完成前继续核对50个唯一岗位ID、50张岗位卡、50份Role Playbook、50份Preset Blueprint、9流程、20场景和9份共享Playbook不丢失。v2结构检查还须核对：13条端到端价值流为9条BVS与4条CVS；BVS与原FLOW一一映射且角色并集覆盖50/50；每条流有5个产品步骤、5个协作步骤、有效结果负责人、完整role_scope、协作角色不越界和production_authorized=false；文档目录与Site投影语义一致。每个Case只有一个主价值流、一个主场景和一个Lead结果负责人；Worker只消费已验收ArtifactEnvelope，不能共享隐式会话或转授权限；跨价值流信号的关联Case状态独立且只引用已验收产物；Skills不携带第二人格；8阶段、72条flow-stage绑定、56条候选flow-scenario绑定和140条历史role-flow覆盖一致；每个阶段有产物与接收记录；STG-01不要求case或Bundle；Bundle从STG-03固定；Case状态不使用Quarantined；Agent管理对象引用Prompt/Skill/Tool/Model/Eval/Memory版本；普通动作与紧急保护均经过Policy Gate和Execution Broker；Emergency Guard为模型外且只限FLOW-07，原子边界只覆盖本地Case/Outbox记录，建单前歧义只能产生Pre-Case Exception，紧急Attempt不充当STG-07且TTL不自动恢复；Service Identity不属于模型；所有生产授权为false。检查结果只证明文档与设计数据一致。

新增长期方法记录须从本文件和领域入口可达。当前人力与成本方法见[容量和成本模型](../02-strategy/CAPACITY-AND-COST.md)，组织覆盖方法见[职责承接表](../04-organization/RESPONSIBILITY-MAP.md)。

50个岗位的Soul、Role Playbook、Preset Blueprint和Site资产由`scripts/build-role-assets.mjs`从`docs/05-agents/role-catalog.json`生成；修改岗位目录后运行`node scripts/build-role-assets.mjs`，再执行50项资产契约、JSON、链接和`git diff --check`验证。生成物仍是设计资产，不能当作DSH导入配置。

Magpie-Horch的50个preset注入方案见[Magpie-Horch × 50个数字岗位分身注入方案](../12-rollout/MAGPIE-HORCH-ROLE-PRESET-INJECTION-PLAN.md)。Magpie只作为同源compiler、静态校验和DSH运行面适配层；其派生输出位于`~/.dsh/.agent-presets/`，不回写第二份岗位事实。实施前必须重新核实DSH schema、role-specific Skill loader、preset resolver、角色级工具强制边界以及模型外Case Control/Policy Gate/Execution Broker；当前不把任何Magpie代码、配置或业务连接视为已修改或已上线。

RP-M1的只读证据与候选适配结构集中记录在[DSH预设与适配契约证据](../10-platform/deepseek-harness/MAGPIE-RP-M1-SCHEMA-EVIDENCE.md)。该记录区分Observed、Proposed和Unknown：官方preset元数据、mount/composeFrom/select会话语义与Skill子集源码已核实；`role_assets`、Role Release Bundle、Case/Artifact/Action adapter仍是外部契约草案，未经目标Host验证不得生成导入配置。

RP-M2的输入、角色匹配、hash、persona/Skill分层、manifest扩展、幂等生成和失败关闭规则见[compiler注入规格](../12-rollout/MAGPIE-RP-M2-COMPILER-INJECTION-SPEC.md)。当前已获授权并完成 Magpie 代码与派生 preset 重建；这些输出仍是设计或派生运行产物，不是生产配置。目标 Host 的岗位 Skill loader、实际导入和外部执行边界必须在后续隔离门验证。

目标Harness版本必须先对齐：企业材料描述的在建平台与本机LUTE Agentic System安装包不是同一版本证据。MCP、native tool、API、hook和tool UI各自进入工具能力登记册，资料列出的系统不等于已有读写权限。当进入代码或配置阶段，先依据实际平台版本补充运行和测试方式，再修改本记录。不得提前编造命令或宣称平台可导入。

## BP、经济模型与实施蓝图

对外 BP 页面位于 `bp/index.html`（源片段 `bp/_body.html`，装配脚本 `bp/build.sh`），是**面向外部读者的商业化论证**；它不复述项目证据，只引用结论，并把「已做完」与「明确没有验证」并排放在第 07 节。BP 不是本仓库的事实源，任何与其冲突的表述以 `docs/` 为准。

[BP 经济模型与参数来路](../02-strategy/BP-ECONOMIC-MODEL.md)是 BP 第 08–09 节全部金额的唯一权威出处。三层关系固定为：机器可读事实源 [bp-economic-model.json](../02-strategy/bp-economic-model.json) → 文档 → 页面。**任何金额改动先改 JSON，再同步文档与页面，最后跑 `node scripts/verify-bp-economics.mjs`。**

该模型有一条会被机械强制的纪律：`parameters[].kind` 只允许 `assumption`。校验脚本对任何其他取值直接 FAIL——这意味着一个参数**不能**被就地改成「实测」而不迁移到证据文档。这条规则的理由是：整份 BP 的可信度押在「假设被明确标为假设」这一件事上，一旦某个数字被静默升级成实测，第 07 节的自我披露就变成了表演。

脚本同时核对三件事：组内算术自洽（区间乘法、加法、除法、加权百分比、包含关系共 21 项）、页面与文档的取值字符串一致、以及资本批次的金额与用途占比相加正确。它**只**证明三处写法一致且算术自洽，不证明假设合理或可达成。

[实施蓝图](../12-rollout/IMPLEMENTATION-BLUEPRINT.html)以 BP 的十一节骨架展开为内部实施口径：资产清单、硬约束及其强制机制、八阶段产物门禁、MDC/GOC 生效机制、DSH 适配的八个工作包、六道验证门、三套阶段门命名、排期与停止条件。它把 BP 的论证翻译成「动哪些文件、过哪些门、什么时候该停」，并在 §12 记录已识别的源内不一致（含 RP-G 编号双轨、Magpie 版本未同步、需求条数口径差异等）。

**写作纪律**：实施蓝图只写设计与静态验证状态。凡「已完成」必须能指向文件与校验命令；凡运行侧一律写「未开始 / 未授权 / 未实例化」。它不产生任何运行能力，也不改变 D-051 与 D-052 的范围。

## 管理层资产（决策权平面）

管理层是**决策权平面**，不是Agent层级：1个CEO（MGT-001）与**2个二级负责人**（MGT-002 增长官、MGT-003 治理官）通过版本化管理域合同MDC与资源配额影响模型外Case Control的装配规则，不进入Case执行链、不作为任何Case的Lead或Worker、不与50个岗位发生会话、不持有Service Identity与Action Intent能力，可见面限于只读聚合视图。

**结构版本（v2，2026-09-18）**：v1曾为1个CEO + 8个CXO（共9岗），按用户决定改为3岗。v2不是裁剪而是重新划域，并引入了v1不存在的一个失效模式与三条处置（见下"治理官的独立性"）。v1资产未进入版本控制（`management/`目录当时为未跟踪状态），**无历史版本可回滚**；变更依据见D-062。

- **命名空间与边界**：管理层使用独立`MGT`前缀，不占用`AGT-001~050`编号，不改变50岗位的`role_count`、五契约与既有资产索引。两个管理域的覆盖并集必须等于 AGT-001~050 全集（38 + 12 = 50），**双线归属数必须为0**；v1曾有5处（AGT-002/018/027/038/044），v2已全部消除，回归该状态视为设计缺陷。
- **治理官的独立性是v2承重机制，不得降级为提示词**：口径冻结权归AGT-005与外部复核（治理官只有提案权）；涉及治理官自身评估尺度的争议走**L2b真人所有者**（不经CEO，因CEO的排序输入即争议标的）；AGT-005复核结论直达CEO与真人所有者、**不向治理官汇报**。依据 AWS Well-Architected Agentic AI Lens 的「enforced at the control-plane boundary … rather than relying on agent self-restraint」：**若目标Host只能通过Prompt层表达该隔离，MGT-003不得进入Shadow阶段**——提示词中的约束不构成服务端权限控制（项目平台红线）。
- **仲裁是兜底机制，不是职责**：六个多智能体框架里没有任何一个把"冲突仲裁"写成manager明文职责；Cursor的生产实测显示冲突仲裁角色「created more bottlenecks than it solved」，移除后反而更好。因此CEO的跨域仲裁次数目标**不是变快而是变少**，每次仲裁须产出"哪条规则本可避免"，同类冲突第二次被仲裁计为失败。
- **管理幅度的证据纪律**：Fayol「不得超过6名下属」**找不到任何原始文本支撑，不得引用**；Bloom/Lemos/Sadun/Van Reenen系列**没有管理幅度经验发现**（NBER WP 20102全文零命中）。可引用的是 Graicunas(1933)、Rajan & Wulf、Gallup（均值12.1、中位数5–6）、Pave。上下级比例采用 AWS 的 supervisor-to-worker ratio 口径做**监控**而非硬上限（当前38:1与12:1）。
- **权限阶梯是唯一合法性来源**：任一决策必须落在[决策权阶梯](../04-organization/management/DECISION-RIGHTS.md)的L0至L4之一；没有归属的事项视为未授权并默认HOLD。L4（资本与预算终审、组织与人事变更、法律与对外承诺签署、最终停止确认）不可委托给任何Agent。
- **管理层的权力不是会话权**：管理层的结论只能以MDC/GOC的版本与资源配额形式生效；任何要求管理层直接改变单张Case装配或顺序的实现方案都违反ADR-0014，必须拒绝。
- **反证指标与退出条件**：每个管理岗位必须能被判定为冗余——若连续两个季度无法在决策周期、组合偏差、例外升级率三项中改善至少两项，进入`MGT_REVIEW`。
- **验证语料**：管理层影子验证语料有两份，**当前证据是v2**（`docs/04-organization/management/eval/management-eval-corpus.v2.json`，25用例），v1（`management-eval-corpus.v1.json`，19用例）保留为结构变更的追溯记录并被标记`superseded_by_v2_structure`。由`scripts/verify-management-eval-corpus.mjs`校验两份语料的完整性、阈值与冻结Hash；不带参数时校验登记表内全部语料。
- **校验脚本只证明「语料未被改动」**：它不证明业务判断正确、不证明管理决定能生效、也不证明语料覆盖完整。「语料已冻结」与「验证已执行」是两件事：是否执行、是否通过，只以 `execution_status` 与 `execution_record.run_log` 指向的台账为准。`execution_status` 按**登记表**校验——未登记的取值一律 FAIL；且一旦声称已执行，必须存在可读的台账文件，否则「已执行」只是无凭据的断言。
- **`MGT-EVAL-B` 已执行（2026-09-18）且未通过**：阶梯归属一致率 **4/6 = 66.7%**（阈值 100%），L2b 识别 2/2 = 100%，确定性子集因判分能力不足未独立评估。台账见[eval/runs/2026-09-18-MGT-EVAL-B/RUN-LOG.md](../04-organization/management/eval/runs/2026-09-18-MGT-EVAL-B/RUN-LOG.md)。两项不一致的阶梯项（`LB-MGT001-03` L4 vs L3、`LB-MGT003-04` L2 vs L1-V）须下沉为确定性规则或上收人类，**不得靠调阈值或重试消除**。
- **一致性门禁查不出「稳定地错」**：`LB-MGT001-01` 两次运行都判 L1-G 而期望 L3——它通过了一致性检验，却揭示 `DECISION-RIGHTS.md` §3 的规则缺口：「已批准域标准版本的实质变更（改变阈值／窗口／口径）」按现有升降级规则推不出 L3。一致性门禁能发现「不稳定」，**发现不了「稳定地按规则推导、而规则本身没写清」**；后者要补规则，不能归咎于执行者。**（2026-09-18已补）**：两条缺口分别落地为 `DECISION-RIGHTS.md` **§3.1混合级别捆绑的归属判定**（整批按批内约束强度最高项归属；「多域并列≠L2跨域」；归属线≠版本所有权）与 **§3.2实质变更的证据前提**（缺基线或增量证据 → L3呈报，且不是 L2）。由此得出一条可复用的判据：**门禁不通过的处置不是调阈值，而是把该决策从模型层移出**——落地后它应转为语料中的确定性校验项。
- **影子验证的执行方法论（本轮踩坑得出，适用于后续所有隔离运行）**：①**两次运行的输入必须逐字一致**——手工复制长 prompt 无法保证（实测出现过标点差异），应把 prompt 固化为文件、两次运行只接收「读取同一文件」并记录文件 Hash。②**隔离不能只靠「不提供答案」**，必须显式声明禁止访问范围：岗位资产与评测语料同处一个目录树时，执行者会自然读到期望答案（实测执行者主动引述了 `expected_deterministic_output`）。③**输出契约须与语料期望的字段形态匹配**：契约若要求自由文本而语料期望枚举，「确定性子集一致率」就无法客观判分，只能退化为可精确比对的那一项，报告里必须写明而不是拿它冒充。④作废轮次的原始输出要逐字留存，否则重跑看起来像在挑结果。
- **反模式覆盖由脚本强制**：`EXPECTED_L_A_PER_ROLE` 声明每个管理岗位应有的L-A条数，须等于其 Playbook §2 的反模式条数。改 Playbook 而不同步语料会 FAIL，不静默通过。
- **规则落地必须可机械核验**：`MGT-EVAL-B` 的合规处置是把该决策从模型层移出，因此落地的规则不能只写成散文。`scripts/check-ladder-rules.mjs` 把 `DECISION-RIGHTS.md` §3.1/§3.2 实现为纯函数，断言「机械判定 == 语料期望阶梯」（`LB-MGT003-04` → L1-V、`LB-MGT001-01` → L3），并以 7 项变异对照证明规则对输入敏感而非恒返回期望值；同时做规则文本存在性检查，防止规则被删而脚本仍通过。**它是设计期核对工具，不是 Policy Gate 实现，不产生运行能力（D-051）；脚本通过不代表门禁通过。**
- **阶梯口径变更使结果不可横比**：v1按L0/L1/L2/L3/L4判分，v2把L1拆为L1-G/L1-V并新增L2b。引用任一份语料的结论时必须同时写明其`structure_version`。冻结Hash必须由Node与Python两套实现交叉复算一致——两种语言对整数值的序列化不同（JS输出`1`、Python输出`1.0`），不显式做整数归一化会得到不同的Hash，使冻结形同虚设。
- **当前生成方式**：管理层资产由手工维护（不同于由`scripts/build-role-assets.mjs`生成的50岗位资产）。若后续纳入生成器，须先确认MGT-Q1命名空间与MGT-Q2契约类型，且不得改变50岗位的生成结果。
- **当前状态**：全部3个管理岗位均为设计完成、未实例化、`production_authorized=false`；只读聚合视图的口径与审计契约仍属RP-M1/RP-M3范围，未核实前管理层的输入能力为unknown。
- **外部依据**：[AI原生组织管理层调研](../14-research/AI-NATIVE-ORG-MANAGEMENT-LAYER.md)区分官方文档、一手材料与二手报道，并单列反面证据与证据缺口。

## Site投影规则

Site是已确认设计资产的交互视图，不建立独立业务事实。完整方案域以`docs/02-strategy/SOLUTION-MAP.md`为导航，Shopify当前实施顺序以`docs/12-rollout/SHOPIFY-GREENFIELD-ROADMAP.md`为准；岗位内容以`docs/05-agents/role-catalog.json`为准，原9条业务流程以`docs/03-scenarios/FLOW-CATALOG.md`为准，13条端到端双工作流以`docs/03-scenarios/e2e-value-streams.json`为结构化权威目录；`dist/data/e2e-workflows.json`只是发布投影，必须保持语义一致。源文档变化时同步更新`dist/data/`及对应页面表述，并复核50岗位、四平面5/35/5/5、BVS/CVS为9/4、BVS岗位覆盖50/50、每流双工作流完整且全部生产授权为false。站点可用性验证至少覆盖HTML入口、CSS/JavaScript/JSON本地引用、JavaScript语法、岗位与价值流数量、负责人/协作角色引用、桌面与移动视口以及本地HTTP响应。

页面必须持续区分设计基线、运行配置、企业系统连接、影子/有限运行和生产验收。Site中的筛选、卡片与图谱用于理解和决策，不获得Policy判定、业务写入或system-of-record地位。

当前Site**尚未**投影管理层（MGT-001至009）：`dist/data/`只包含50岗位与12价值流。管理层资产处于设计待确认状态，在MGT-Q1至MGT-Q5确认前不得加入发布投影，以免把待确认结构当作已确认事实对外发布。

Shopify绿地阶段、组织变革阶段和经营试点阶段必须使用不同命名空间：`SHOP-G*`、`ORG-G*`和`PILOT-G*`。禁止在没有命名空间时写“进入G1/G2”，以免把方案审阅、店铺实施和经营试点混为同一门。

D-051之后，Shopify当前交付始终标为“店铺治理方案包”，不是Case实例、真实配置或开店实施。D-052允许GitHub与GitHub Pages公开发布方案；发布验收必须分别记录本地检查、commit、push、Actions workflow、Pages控制面和公网内容，任何一层成功都不能替代下一层。

### 公开发布面只有 `dist/`

Pages workflow 上传的是 `./dist`，因此**仓库里的文件被提交不等于被公开**：`bp/index.html` 与 `docs/12-rollout/IMPLEMENTATION-BLUEPRINT.html` 都早已在 `main` 上，但在第三次发布前公网请求一直是 **404**。判断一份文档是否已公开，唯一方法是请求它的 Pages URL；不能从「文件在 GitHub 上返回 200」推断——GitHub 可达与 Pages 可达是两个不同的发布面。

发布一份独立 HTML 文档必须走 `node scripts/build-pages-docs.mjs`。它按 `TARGETS` 清单把源文档复制进 `dist/`，并把指向仓库内 `.md` 的相对链接改写为 GitHub 绝对链接——Pages 上没有这些 `.md` 的渲染版本，blob 页才是它们唯一可读的位置；指向同样已发布文档的链接则保持站内相对，使点击后留在站内。**新增公开发布的 HTML 必须在 `TARGETS` 中登记**：发布面应当可枚举、可审阅，隐式地把新文件带进公网是事故而不是功能。

改写只发生在 `dist/` 副本。源文档的相对链接在仓库内是正确的，不应改动。构建是确定性的（两次运行输出哈希一致）。源文档改动后必须重跑本脚本，否则公网会继续展示旧副本而没有任何报错；`pages.yml` 已加闸门强制这一点——它在发布前重跑脚本并比对 `dist/`，副本过期即硬失败，且触发路径已加入两份源文档与生成脚本，使「只改源文档」也能触发这道检查。该闸门防的是「静默展示旧内容」，不校验内容是否正确。

### 窄屏验证的测量陷阱

**Chrome headless 把视口钳制在最小 500px**：即使传 `--window-size=390,900`，`window.innerWidth` 实测仍为 500。因此直接用 `--window-size` 量 390/414 实际上是在量 500px——本仓库此前的「390/414 无溢出」结论正因此失真，不是页面变了。

正确的做法是**在宽窗口（如 1500px）内嵌一个固定宽度的 iframe**：被量文档按该宽度做真实布局，媒体查询也按 iframe 视口生效，再读内部文档的 `scrollWidth`/`clientWidth` 与各元素的 `getBoundingClientRect()`。

判读溢出要分两层：文档级 `scrollWidth > clientWidth` 说明整页横向滚动，是真问题；元素超出视口但位于 `overflow-x:auto` 容器内属**设计内的横向滚动**（门户顶部导航、实施文档的 `table-wrap` 都是这种），只有被 `overflow:hidden` 裁掉才真的不可达。改动版面的提交应同时量改动前后两份并逐项比对，以判断某处溢出是否为本次引入——本次门户新增两条链接即以此方式证明为布局中性。

## 持续更新

本文件记录稳定方法和项目整体知识。单轮回答进入访谈，经营选择进入决策，临时进度进入 STATUS，避免本文件变成任务流水账。
