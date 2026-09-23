# Sanbao 视觉身份与资产方案

状态：D-068 已确认的设计与门禁方案；D-069 已完成三位CXO的源人物选择；D-070 保留为历史第一方声明记录；D-071 已记录用户对冻结 Sanbao_Web 全量素材的完整授权；D-072 已启动并完成 VIS-G2 的结构性语义审查；D-073 已接受其可复算目录锚点并完成 VIS-G3 的53条展示绑定表；D-074 已完成 VIS-G4 的53条 Digital Persona Dossier 投影；D-075 已完成 VIS-G5 的实际静态质量验收；D-076 已接受两条近似视觉风险；D-077 已授权并完成 VIS-G6 本地视觉发行。VIS-G0 已于2026-09-23完成只读来源冻结与元数据盘点；VIS-G1 已于2026-09-24完成并通过，结果为 **COMPLETE_AUTHORIZED**：1,729 个图像为 `APPROVED_DELIVERY`、119 个为 `POOL_ONLY`、`HOLD_VIS_G1=0`；VIS-G2 当前状态为 **COMPLETE_STRUCTURAL_SEMANTICS_WITH_G0_FINGERPRINT_EXCEPTION**，VIS-G3 当前状态为 **COMPLETE_BINDING_TABLE_PENDING_VIS_G5**，VIS-G4 当前状态为 **COMPLETE_DOSSIER_PROJECTION_PENDING_VIS_G5**，VIS-G5 当前状态为 **COMPLETE_STATIC_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK_PENDING_VIS_G6**；VIS-G6 本地发行 `VIR-SANBAO-WEB-2026-09-24-R1` 当前状态为 **COMPLETE_LOCAL_VISUAL_IDENTITY_RELEASE_PENDING_GITHUB_PAGES_DEPLOYMENT**：53条视觉身份、318个 WebP 交付件和 Site 接入已校验，`VIB-AGT-029`与`VIB-AGT-041`保留D-076风险记录，GitHub Pages 部署证据尚待独立验收。

适用范围：本项目3位管理层分身与50位执行岗位的展示性视觉身份，以及 Sanbao_Web 全量图像的来源治理、受限保存和未来复用。D-077 已授权将53条已验收绑定所需的318个 WebP 交付件接入静态 Site；本文仍不构成图片生成、GitHub Release、DSH配置、业务连接或生产运行授权。

关联决定：D-053、D-065、D-067、D-068、D-069、D-071、D-072、D-073、D-074、D-075、D-076、D-077、ADR-0012、ADR-0015。

## 1. 目标与非目标

目标是在不改变既有角色契约的前提下，形成：

1. 3位管理层分身和50位执行岗位各一份稳定、可访问、可追溯的视觉画像。
2. 对 Sanbao_Web 全部图像建立来源、分类、哈希、可见范围和复用状态台账。
3. 将未使用的人物、主题与尺寸变体保留为候选素材池，支持未来新角色创建。
4. 把公开展示、运营资料和受限来源资料明确分层，避免将原图、参考图或生成资料误入静态站点。

非目标如下：

- 不把头像、外貌、画面气质或视觉风格当作角色身份、权限、能力、组织汇报线或人格的依据。
- 不向现有角色目录、Soul、Playbook、Preset Blueprint、Role Release Bundle、Access Contract、MDC/GOC或 Case Control 写入视觉字段。
- 不因视觉资料准备完成而增加运行实例、创建新岗位、进入Shadow、接入DSH或获得生产授权。
- 不物化或公开全量候选池、原生PNG、来源图、参考图、设计输入、提示词或身份参考资料；VIS-G6 仅交付经核验的角色 WebP。

## 2. 不变量

1. 角色身份的权威来源仍是角色目录、Soul Contract、Role Playbook、Preset Blueprint与版本化 Role Release Bundle。
2. 视觉身份只影响展示、可访问性和来源追溯；它不影响 Service Identity、Action Intent、Policy Gate、Case Lead/Worker资格、预算或数据访问。
3. 每个展示图像必须能追溯到确定的上游仓库、提交或Release、路径、哈希、主题、尺寸与审核状态；不得只引用可漂移的 main 分支。
4. 未分配素材必须保留或登记为不可用状态。候选素材不是已启用的数字员工，不构成3+102或更大的运行范围。
5. 人物的年龄观感、性别表达、族裔、肤色、衣着、笑容、眼镜、姿态、吸引力或所谓“领导感”，不得用于推断业务能力、可信度、合规性、权限或人格。
6. 任何对使命、人格原则、技能、行为边界、数据访问、权限或运行保障的修改，仍只能通过既有五/六类契约和 Role Release Bundle 处理。

## 3. 来源事实与资产边界

上游来源为 https://github.com/zjgulai/Sanbao_Web 。本轮只读盘点确认该仓库包含官网、数字员工和品牌Logo三类资产；数字员工集合包含102个唯一人物、深色与浅色主题、原生PNG、多个WebP尺寸、来源图、逐人清单与哈希。具体、不可漂移的来源版本与全量元数据统计见[VIS-G0 来源冻结记录](visual-assets/SANBAO-WEB-SOURCE-SNAPSHOT-2026-09-23.md)及其[机器可读快照](visual-assets/SANBAO-WEB-SOURCE-SNAPSHOT-2026-09-23.json)。

| 资产类别 | 例子 | 保存与使用规则 |
| --- | --- | --- |
| 展示头像 | 深浅主题WebP、已批准的原生PNG | 可在批准后用于组织图、列表和画像详情 |
| 高分辨率追溯图 | 原生PNG、总览JPG | 保留给质量审阅和来源追溯，不是普通前端默认资源 |
| 受限来源资料 | sources、references、design、生成提示词 | 受限保存，不公开、不放入dist、不默认注入模型 |
| 品牌与站点图形 | Logo、图标、网站背景与插图 | 入台账；不能登记为数字员工头像 |

上游仓库除 Inter 字体外未附加通用开源许可证；这一事实继续作为来源追溯记录。D-071 已将用户对固定来源全量素材的跨仓库复制、内部保存、裁切/转码/派生、素材池、公开展示、商业使用与再分发授权登记为本项目的放行依据。VIS-G1 因此完成分类：头像交付件、品牌与站点图形为 `APPROVED_DELIVERY`；来源、参考、设计与总览图为 `POOL_ONLY` 受限素材池；不再存在 `HOLD_VIS_G1`。

### 3.1 VIS-G0 来源冻结结果

`VIS-G0` 于2026-09-23以只读方式固定上游提交 [`2e676da87999c88fbc70baae9eb5dbf72c2b757e`](https://github.com/zjgulai/Sanbao_Web/commit/2e676da87999c88fbc70baae9eb5dbf72c2b757e) 及其 Git tree `4948f180d4e5a0bc8c599022227c384d525729c5`。递归 tree 响应未截断；完整仓库为2,084个 blob（417,143,325 bytes），其中1,848个图像文件（397,188,626 bytes）；`digital-employees/` 为1,971个 blob（408,005,031 bytes），其中1,751个图像文件。102位人物的深浅主题、七档 WebP 交付件构成1,428个 WebP 文件。

此门只登记可复算的路径、Git blob ID、字节数、上游清单和元数据指纹；没有下载、复制、重绘、派生或发布任何图片。三位已选CXO的来源图、64px与256px深浅主题交付候选均已以固定路径和 Git blob ID 登记；`SOURCE_LOCKED_AWAITING_VIS_G1` 是 VIS-G0 快照中的当时状态，D-073 后的当前结构性绑定状态以 VIS-G3 绑定表为准。Git blob ID、上游声明的 SHA-256 与本地“目录元数据指纹”的语义不同，详细限制已写入来源冻结记录，不能把它们误称为本项目已完成的图片二进制验收。

### 3.2 VIS-G1 权利与可见性结果

`VIS-G1` 于2026-09-23完成冻结来源的仓库级来源、许可、自述生成过程、参考资料风险信号与公开范围审查；用户于2026-09-24以 D-071 明确完成全量第一方授权后，本门结果更新为 `COMPLETE_AUTHORIZED`。详见[VIS-G1 权利、来源与公开范围审查](visual-assets/SANBAO-WEB-VIS-G1-RIGHTS-AND-VISIBILITY-REVIEW-2026-09-23.md)及其[机器可读登记册](visual-assets/SANBAO-WEB-VIS-G1-RIGHTS-AND-VISIBILITY-REGISTER-2026-09-23.json)。全部 1,848 个图像保持 `SOURCE_RECORDED`：1,729 个同时为 `APPROVED_DELIVERY`，119 个同时为 `POOL_ONLY`，没有 `HOLD_VIS_G1`。

D-071 是本项目对固定来源进行视觉交付、未来素材池、公开展示、商业使用与再分发的授权依据。`POOL_ONLY` 只表示原始来源、参考、设计和总览图不作为默认公开页面交付物；它不是权利 HOLD。MGT-002 地利所选 AGT-090 的原始参考资料同样保持受限素材池策略，不影响其交付头像的 VIS-G1 放行。VIS-G2 至 VIS-G6 仍各自负责素材语义、质量、绑定、交付和页面接入；VIS-G1 不会自动启动这些工作。

### 3.3 VIS-G2 结构性语义结果

D-072 启动的 VIS-G2 已生成 [语义登记册](visual-assets/SANBAO-WEB-VIS-G2-SEMANTIC-REGISTER-2026-09-24.json) 与[审查结论](visual-assets/SANBAO-WEB-VIS-G2-SEMANTIC-REVIEW-2026-09-24.md)。登记册完整覆盖固定 tree 的 1,848 个图像（397,188,626 bytes）和 102 个人物族，将人物候选池、单项主题/尺寸变体、素材治理状态及重复关系分开登记；深浅主题、204 个原生 PNG、1,428 个七档 WebP 的 manifest 声明矩阵完整。按冻结 Git blob ID 的精确重复组为 0，manifest 声明的原生 PNG SHA-256 重复数也为 0；近视觉重复、真实像素/MIME、裁切与小尺寸可读性没有提前声称通过，留待 VIS-G5。

VIS-G2 还确认 AGT-001 至 AGT-050 的项目 ID 与中文别名均为 50/50 匹配；天時→AGT-067、地利→AGT-090、人和→AGT-056 均保持为已选源人物。G2 登记册中“尚未建立 Visual Identity Binding”是该门完成时的历史状态；D-073 后，VIS-G3 已为这 53 个角色建立独立的结构性展示绑定表。项目角色目录继续是角色标题与标准产物的权威；上游 `job`/`deliver` 仅为来源上下文，不能反写角色语义。

固定提交、tree、三个上游目录文件 Git blob、图像数和字节数都已复核；但 VIS-G0 原记录的三类 `en` locale 目录元数据指纹无法按其声明算法复算。VIS-G2 因此保留历史值、显式登记 `G2-EXC-001`，并新增 `VIS-G2-CANONICALIZATION-1` 的 code-point 路径序确定性指纹；不得静默将旧值写成“已复验”。D-073 已接受该新锚点用于后续视觉门，并明确 VIS-G0 旧值仅为历史追溯记录。这一来源锚点处置不改变已冻结来源或素材分类，也不把 VIS-G2/G3 的结构性完成误称为最终图片二进制验收或 Visual Identity Release。

### 3.4 VIS-G3 视觉绑定结果

D-073 启动的 VIS-G3 已生成 [53条视觉身份绑定表](visual-assets/SANBAO-WEB-VIS-G3-VISUAL-IDENTITY-BINDINGS-2026-09-24.json) 与[绑定审查结论](visual-assets/SANBAO-WEB-VIS-G3-BINDING-REVIEW-2026-09-24.md)。50条 AGT 角色均映射至同 ID 源人物；三位管理层固定为天時→AGT-067、地利→AGT-090、人和→AGT-056。每条绑定同时引用同一人物的深色和浅色 64px 列表图、256px 主图/详情图、128px 同人后备图与原生 PNG 质量追溯图；53位源人物唯一，全部引用 `APPROVED_DELIVERY` 且 `ELIGIBLE_FOR_PERSONA_BINDING` 的 VIS-G2 交付变体。

绑定状态统一为 `STRUCTURAL_BINDING_PENDING_VIS_G5`，Visual Identity Release 统一为 `NOT_CREATED_PENDING_VIS_G5`。中性 alt text 仅为草案，实际二进制、裁切、小尺寸可读性、深浅主题预览、感知去重和可访问性仍由 VIS-G5 验收。绑定表是展示层独立事实源，不修改项目角色目录、管理层目录、Soul、Playbook、Preset、Role Release Bundle、Access、Case或运行状态。

### 3.5 VIS-G4 Digital Persona Dossier 结果

D-074 启动的 VIS-G4 已生成 [Digital Persona Dossier 登记册](visual-assets/SANBAO-WEB-VIS-G4-DIGITAL-PERSONA-DOSSIERS-2026-09-24.json) 与[审查结论](visual-assets/SANBAO-WEB-VIS-G4-DOSSIER-REVIEW-2026-09-24.md)。登记册含 53 条可独立寻址的 `dossier_id`：每条把角色身份、使命、人格合同引用、Skills、协同、治理、VIS-G3视觉绑定和版本来源投影为一份只读画像；Soul、Role Playbook、Preset Blueprint及两个角色目录仍是各字段唯一权威，不被复制或改写。

构建器读取 223 份项目文本/JSON资产，并以 `VIS-G4-INPUT-CANONICALIZATION-1` 记录内容哈希与可复算目录摘要。所有画像继续保持设计态、`production_authorized=false`、Role Release Bundle 未实例化、Visual Identity Release 未创建、页面/发布未启动。MGT-002和MGT-003各有 Blueprint 的主产物与`access.scope_source`字段和项目角色资料不一致；VIS-G4 已将4条问题隔离为 `SOURCE_FIELD_NONAUTHORITATIVE_PENDING_RP_REMEDIATION`，采用管理层目录的角色语义且不改写原 Preset。实际二进制/视觉质量仍归 VIS-G5，页面交付仍归 VIS-G6。

### 3.6 VIS-G5 静态质量结果

D-075 启动的 VIS-G5 已生成 [静态质量登记册](visual-assets/SANBAO-WEB-VIS-G5-STATIC-QUALITY-REGISTER-2026-09-24.json) 与[审查结论](visual-assets/SANBAO-WEB-VIS-G5-STATIC-QUALITY-REVIEW-2026-09-24.md)。它只从 D-073 接受的固定提交临时读取当前53条绑定的424个交付二进制：106个原生PNG和318个WebP。424/424均通过实际Git blob、字节、MIME、解码、尺寸和精确SHA-256核验；全部53条都完成深浅主题、原生到WebP一致性、裁切、64px辅助视觉审阅和中性alt text定稿。图片没有持久化到本项目、`dist/`、Pages或DSH。

本门的个体质量验收与跨角色可区分性分别记录：51条为`PASS_FOR_VIS_G5_ASSET_QUALITY`；`VIB-AGT-029`与`VIB-AGT-041`虽各自的主题和尺寸质量合格，但在64px下跨角色过于近似。D-076 已接受该两条风险并保留现有绑定，二者状态为`PASS_FOR_VIS_G5_ASSET_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK`；风险信号与决定不得删除或改写为无近似。三对低风险近似仅记录为未来变更的监测项。D-077 已在此基础上授权 VIS-G6 本地页面/发行工作；GitHub Pages 部署仍须由发布证据单独确认。

## 4. 术语与两条版本线

| 术语 | 定义 |
| --- | --- |
| Source Asset | 上游原始或既有导出图，带固定来源、路径、哈希和分类 |
| Derived Rendition | 从批准素材得到的主题、尺寸、裁切或格式交付件，必须保留派生关系 |
| Visual Identity Binding | 一个角色到同一人物的主图、主题、尺寸、alt text和来源状态的独立展示绑定 |
| Digital Persona Dossier | 角色身份、视觉身份、使命、Soul、能力、协同、治理与来源版本的组合画像卡 |
| Candidate Asset Pool | 未绑定或已退役的候选人物及其他可复用图像；不等同于已创建岗位 |
| Visual Identity Release | 一组可发布的视觉绑定与展示交付件版本 |

| 版本线 | 管理对象 | 何时变化 | 是否改变运行 |
| --- | --- | --- | --- |
| Role Release Bundle | 人格、技能、运行、访问、保障和管理域合同 | 角色运行合同发生变化时 | 是，须走既有生命周期和门禁 |
| Visual Identity Release | 头像、主题、尺寸、alt text、来源与公开范围 | 展示资产或其治理状态发生变化时 | 否，只影响展示投影 |

Visual Identity Release 可以引用某个角色ID与其现有合同版本，但绝不替代或修改该合同。

## 5. 53个视觉身份的映射范围

| 范围 | 来源规则 | 当前状态 |
| --- | --- | --- |
| AGT-001 至 AGT-050 | 与上游同ID人物及其深浅主题变体直接映射 | 50条 VIS-G3 结构性展示绑定已建立；48条通过 VIS-G5，`VIB-AGT-029`与`VIB-AGT-041`带D-076已接受风险，因此50条均可进入未来视觉发行审查；均未发行 |
| MGT-001 天時 | AGT-067 星阑 | VIS-G3 结构性展示绑定与 VIS-G5 质量验收已通过；未创建发布版本 |
| MGT-002 地利 | AGT-090 语桐 | VIS-G3 结构性展示绑定与 VIS-G5 质量验收已通过；原始参考资料仍仅保留于受限素材池，未创建发布版本 |
| MGT-003 人和 | AGT-056 昭禾 | VIS-G3 结构性展示绑定与 VIS-G5 质量验收已通过；未创建发布版本 |
| AGT-051 BoBo、AGT-052 筑程 | 保留上游已有岗位语义和源人物ID | 对应交付图为 `APPROVED_DELIVERY`；不静默改派为CXO |
| AGT-053 至 AGT-102 的未选人物 | 选出三位CXO后，其余仍是候选人物 | 已纳入未来数字员工的候选素材池；不自动成为运行岗位或展示绑定 |

50位执行岗位的直接映射以ID、中文别名、职责和业务域的交叉核验为基础，不需要按外貌重新配岗。D-069已选择三位管理层的源人物：MGT-001天時引用AGT-067星阑，MGT-002地利引用AGT-090语桐，MGT-003人和引用AGT-056昭禾。视觉绑定始终保持原AGT来源ID；例如MGT-001的Visual Identity Binding引用AGT-067，但不得把AGT-067的源人物记录改名为“天時”。

## 6. 三位CXO的候选审阅板

下列短名单基于上游 manifest 中可审计的名称、主题色和构图元数据形成。D-069 已完成三位源人物选择；本表保留为选择依据，不再要求重复选择。VIS-G2 已完成结构性主题/尺寸审查；实际浅色/深色交付件的二进制与视觉质量校验属于 VIS-G5，展示绑定属于 VIS-G3。

### MGT-001 天時

用户已选择AGT-067星阑作为源人物。其余候选继续保留在素材池，不构成弃用或删除。

| 候选源人物 | 上游名称 | 元数据变量 | 审阅重点 |
| --- | --- | --- | --- |
| AGT-053 | 启澄 | 正面、slate-blue | 组织总览中的稳定锚点与小尺寸识别 |
| AGT-067 | 星阑 | 轻微右转、pearl-gray | 侧向动态与整体辨识度 |
| AGT-073 | 承晖 | 正面、pearl-gray | 与AGT-053的正面对比 |
| AGT-079 | 序白 | 左侧肩部、pearl-gray | 详情卡与组织图裁切适配 |
| AGT-085 | 若衡 | 右侧肩部、pearl-gray | 深浅主题的轮廓稳定性 |

### MGT-002 地利

用户已选择AGT-090语桐作为源人物。其余候选继续保留在素材池，不构成弃用或删除。

| 候选源人物 | 上游名称 | 元数据变量 | 审阅重点 |
| --- | --- | --- | --- |
| AGT-054 | 闻溪 | 左侧肩部、sage | 色彩与组织总览并列效果 |
| AGT-060 | 景和 | 右侧肩部、sage | 与AGT-054的方向与主题差异 |
| AGT-063 | 知夏 | 正面、lilac | 渠道/品牌页面的识别度 |
| AGT-071 | 时予 | 轻微左转、slate-blue | 与天時的区分和统一性 |
| AGT-090 | 语桐 | 需以实际深浅主题预览复核构图 | 三人并列时的色彩与轮廓差异 |

### MGT-003 人和

用户已选择AGT-056昭禾作为源人物。其余候选继续保留在素材池，不构成弃用或删除。

| 候选源人物 | 上游名称 | 元数据变量 | 审阅重点 |
| --- | --- | --- | --- |
| AGT-056 | 昭禾 | 轻微左转、teal | 小尺寸与深浅主题呈现 |
| AGT-062 | 若谷 | 轻微右转、teal | 与AGT-056的构图比较 |
| AGT-070 | 沅芷 | 右侧肩部、stone | 组织图和详情卡的留白与中性基调 |
| AGT-081 | 以恒 | 轻微左转、lilac | 三位CXO并列时的辨识度 |
| AGT-092 | 和颂 | 轻微右转、teal | 深浅主题下的轮廓和区分度 |

候选审阅只使用以下六项非人格、非权限标准：小尺寸识别性、深浅主题一致性、裁切与构图适配、三位CXO整体差异、品牌叙事的色彩与构图感受、来源与可治理性。不得从人物外貌推断角色能力或权限。

## 7. 数据模型

### 7.1 素材记录

每一个原始或派生图像至少登记：

| 字段组 | 必要字段 |
| --- | --- |
| 稳定标识 | source_asset_id、visual_asset_id、source_persona_id、asset_class、theme、size、derivative_version |
| 来源追溯 | upstream_repository、upstream_revision、source_path、sha256、mime_type、bytes、width、height |
| 分类 | avatar_delivery、native_png、source_sheet、reference、design_input、overview、logo、website_graphic |
| 治理状态 | rights_status、visibility_status、review_status、risk_notes、approval_reference |
| 复用状态 | candidate_tags、primary_role_id、fallback_for、replacement_asset_id、retired_at |

推荐状态集合：SOURCE_RECORDED、HOLD_VIS_G1、POOL_ONLY、CANDIDATE_REVIEW、APPROVED_DELIVERY、ASSIGNED_PRIMARY、RETIRED、EXCLUDED。D-071 后，全部上游图像同时处于 SOURCE_RECORDED：1,729 个为 APPROVED_DELIVERY，119 个为 POOL_ONLY，HOLD_VIS_G1 为0；后续状态变更仍须保留对应视觉门的验收记录。

### 7.2 角色视觉绑定

每一条 Visual Identity Binding 至少登记：

| 字段 | 含义 |
| --- | --- |
| role_id | MGT-001至MGT-003或AGT-001至AGT-050 |
| visual_identity_release_id | 当前展示版本的稳定ID |
| source_persona_id | 上游人物ID；管理层绑定时仍保留原AGT来源 |
| primary_asset_dark / primary_asset_light | 同一人物对应主题的批准交付图 |
| list_rendition / detail_rendition | 不同页面尺寸的派生件 |
| fallback_asset_id | 主素材不可用时的同一人物后备版本，不得换另一人物 |
| alt_text | 中性、可访问的说明 |
| binding_status / approval_reference | 候选、批准、替换或退役状态与证据 |

这些字段未来存入独立视觉注册表，不写入 role-catalog、management-catalog、Soul、Playbook、Preset或角色Bundle生成输入。

### 7.3 画像卡

每份 Digital Persona Dossier 由八层组成：

1. 角色身份：role_id、显示名称、岗位、组织平面和业务域。
2. 视觉身份：主题头像、alt text、视觉版本与来源状态。
3. 经营使命：责任对象、目标、可衡量结果与标准产物。
4. 判断人格：Soul Contract、原则、拒绝条件和升级边界。
5. 能力边界：Skills、最小输入、输出Artifact、证据要求和评估。
6. 协同关系：独立模式、受控Lead/Worker模式、ArtifactEnvelope交接与冲突处理。
7. 运行与治理：既有五/六类契约引用、数据工具边界、Policy Gate与不可执行事项。
8. 来源与版本：素材来源、哈希、许可状态、发布范围和绑定变更历史。

公开层只展示批准头像、名称、岗位、使命和可观察产物；运营层展示角色设计与协同资料；治理层保存Access、来源审计、受限资料与审批记录。

## 8. 展示交付规则

1. 组织图与列表优先使用32、48或64像素WebP；画像详情使用128或256像素WebP。
2. 深色界面只使用同一人物的深色版本，浅色界面只使用其浅色版本；主题切换不得换人。
3. 圆形和圆角方形裁切必须维持头部、发型和肩部完整，不得制造第二个视觉身份。
4. 前端默认不收录来源图、参考图、生成提示词、设计输入或未经批准的候选图。
5. 所有头像需要中性alt text，例如“天時数字分身形象，深色主题”。
6. Logo、站点图形和人物头像必须分开归类；品牌图不能被误绑定为角色图。

## 9. 门禁与验收

| 门禁 | 工作与产物 | 可验证通过条件 | 明确不能做的事 |
| --- | --- | --- | --- |
| VIS-G0 | 固定上游提交或Release；生成全量目录、路径、哈希、尺寸和分类清单 | 每项资产可追溯到唯一来源版本 | 不复制、不改图、不发布 |
| VIS-G1 | 来源、许可、隐私、参考图和公开范围分级 | 每项素材有 APPROVED_DELIVERY、POOL_ONLY、HOLD 或 EXCLUDED 状态；本轮已通过：1,729项 APPROVED_DELIVERY、119项 POOL_ONLY、0项 HOLD | 不把本门分类误写成图片已复制、页面已接入或视觉发布已完成 |
| VIS-G2 | 素材语义标注、主题尺寸校验和去重分析 | 已完成结构性语义登记：1,848 个素材、102 人物族、主题/尺寸矩阵、候选池关系、精确 Git blob 去重可检索；G0 三类旧目录指纹不可复算异常已显式登记 | 不以外貌推导岗位权限；不把上游声明当作本项目二进制/视觉验收 |
| VIS-G3 | 50条AGT映射与三位MGT展示绑定表 | 已完成53条结构性绑定：50条AGT同ID、三位MGT按 D-069、同人深浅主题、64/256/128/native 变体及中性 alt text 草案均可审阅；Visual Identity Release 仍未创建 | 不擅自替换已选MGT源人物；不把绑定表当作 VIS-G5 质量通过或发布 |
| VIS-G4 | 画像卡与展示投影 | 已完成53条可独立寻址的只读 Dossier：角色资料引用既有权威资产，VIS-G3视觉资料独立版本化，223份输入内容哈希可复算，4条MGT Blueprint来源例外已隔离 | 不复制或改写角色契约；不将来源例外误写为已修复、权限或运行状态 |
| VIS-G5 | 派生件、alt text和静态质量检查 | 已完成：424个实际交付二进制通过核验，53条完成个体质量审阅与alt text定稿；51条通过，`VIB-AGT-029`/`VIB-AGT-041`为D-076已接受风险 | 不把原图、参考图或提示词放入dist；不自动重绑、发行或接入页面 |
| VIS-G6 | 页面接入、发布与未来角色复用 | 已完成本地发行 `VIR-SANBAO-WEB-2026-09-24-R1`：53条展示身份、318个 WebP、深浅主题切换、alt text、公开范围与静态页面接入均已校验；GitHub Pages 部署待独立验收 | 不把候选人物自动变成运行岗位；不公开候选池或受限来源资料 |

视觉接入的完成定义包括：53个角色均有批准或明确HOLD的视觉状态；50条执行岗位映射完整；三位CXO由用户确认；深浅主题和小尺寸展示一致；来源、哈希与可见范围可复核；受限资料不进入公开交付物。上述任何结果都只是视觉资产验收，不是DSH、Case、Policy Gate、企业系统或经营结果验收。

## 10. 当前未完成事项与下一步

以下项目尚未完成：

1. `VIS-G0` 已冻结 Sanbao_Web 的具体Git提交、tree、清单文件、全量计数和三位CXO的关键交付候选；它是来源快照，不是复制后的本地素材库。原记录的三类 locale 目录指纹存在不可复算异常；D-073 已接受 VIS-G2 的版本化替代锚点，历史值保持不改且只作追溯。
2. `VIS-G1` 已于2026-09-24通过。D-071 已完整授权固定来源全量素材；1,729 个交付图可用于后续视觉门，119 个来源、参考、设计和总览图已保留为受限素材池。
3. `VIS-G2` 已完成结构性语义登记与校验：1,848 个素材、102 人物族、204 个原生 PNG、1,428 个 WebP、主题/尺寸矩阵、精确 Git blob 去重和候选池关系均可检索。近视觉去重、像素/MIME、深浅主题预览与小尺寸裁切质量不在本门完成范围。
4. `VIS-G3` 已完成53条可审阅的结构性展示绑定：天時、地利、人和均引用用户已选源人物，50条AGT保持同ID映射。实际质量处置以已完成的 VIS-G5 登记册为准；绑定已由D-077的 VIS-G6 本地发行引用，但绑定表本身仍不是角色合同或运行状态。
5. `VIS-G4` 已创建包含53条可独立寻址画像的机器可读 Dossier 登记册；它只引用角色合同与VIS-G3绑定，不复制角色合同或任何二进制。MGT-002/MGT-003的4条 Blueprint 来源字段例外仍待单独授权的Role/Preset修复，不能由视觉门自动修正。
6. `VIS-G5` 已完成实际二进制和静态质量验收：D-076 已接受`VIB-AGT-029`与`VIB-AGT-041`的近似风险，53条均可进入未来视觉发行审查；近似信号和风险决定仍须随发行保留，不能自动重绑或删除记录。
7. 全量1,848项仍只作为固定远端候选素材池治理；VIS-G6 仅复制了53条已绑定角色所需的318个 WebP 到本项目的`dist/`静态发行包。其余候选、原生PNG、来源、参考、设计和总览图均未物化到项目、GitHub Pages或目标DSH；若要归档候选池，须先决定私有存储与访问控制。
8. 未改变任何角色职责、Soul、Playbook、Preset、Access、评估、Bundle、运行状态或生产权限。

D-077 已授权并完成 VIS-G6 的本地发行：发行登记册、318个 WebP、53条页面投影、深浅主题切换、风险追溯和公开范围都已复核。下一步是按既有 GitHub Pages 工作流部署，并对 Actions、Pages与公网实际字节独立取证；不得跨门把候选人物变成运行岗位或公开受限素材。
