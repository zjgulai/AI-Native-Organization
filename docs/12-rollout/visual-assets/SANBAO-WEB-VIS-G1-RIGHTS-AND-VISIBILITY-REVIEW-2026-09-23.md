# Sanbao_Web VIS-G1 权利、来源与公开范围审查

状态：**已完成并通过（2026-09-24；结果：COMPLETE_AUTHORIZED；D-071 全量素材完整授权已记录）**<br>
冻结来源：[VIS-G0 来源冻结记录](SANBAO-WEB-SOURCE-SNAPSHOT-2026-09-23.md)<br>
机器可读结果：[VIS-G1 权利与可见性登记册](SANBAO-WEB-VIS-G1-RIGHTS-AND-VISIBILITY-REGISTER-2026-09-23.json)

## 结论

VIS-G1 已按用户的明确指令完成，并以 D-071 的全量第一方权利声明与授权作为固定来源的放行依据；结果是 **通过，已完成交付与素材池分类**。

- 冻结来源中的 1,848 个图像文件全部保留为 **SOURCE_RECORDED**：其中 1,729 个为 **APPROVED_DELIVERY**，119 个为 **POOL_ONLY**，`HOLD_VIS_G1=0`。
- 用户授权覆盖本项目所需的跨仓库复制、内部保存、裁切/转码/派生、未来素材池、公开展示、商业使用与再分发；实际执行这些动作仍属于后续视觉门。
- 本项目没有下载、复制、裁切、转码、生成、展示或发布任何图像二进制；没有修改页面、角色运行资产、DSH、业务系统或生产状态。
- 用户明确确认这些均为其本人可完整授权的资产，并强制授权完成 VIS-G1；本项目不再保留生成服务、参考链、肖像/隐私或品牌的 VIS-G1 权利 HOLD。

这是一份项目治理和证据分类结论；D-071 是本项目对固定来源全量素材执行 VIS-G1 的直接授权依据。

## 1. 核验范围与冻结锚点

| 项目 | 已核验事实 | 边界 |
| --- | --- | --- |
| 上游仓库 | [zjgulai/Sanbao_Web](https://github.com/zjgulai/Sanbao_Web)，GitHub 元数据标示为公开 fork，parent/source 指向 lillian-maker/WorldPilot | GitHub 托管和 fork 关系不证明版权、商标、肖像或再授权资格 |
| 固定提交 | [2e676da87999c88fbc70baae9eb5dbf72c2b757e](https://github.com/zjgulai/Sanbao_Web/commit/2e676da87999c88fbc70baae9eb5dbf72c2b757e) | 固定提交只用于可复核来源定位 |
| 固定 tree | 4948f180d4e5a0bc8c599022227c384d525729c5；[递归 tree 响应](https://api.github.com/repos/zjgulai/Sanbao_Web/git/trees/4948f180d4e5a0bc8c599022227c384d525729c5?recursive=1) 为 truncated=false | 本门不下载图片，也不重新计算图片二进制哈希 |
| 审查对象 | VIS-G0 已盘点的 1,848 个图像文件、仓库级说明、数字员工说明及其公开可读元数据 | 不读取、复制或披露提示词、参考图内容、人物身份资料或其他受限源资料 |

仓库提交显示为 unsigned；该信号不否定来源位置，但也不能加强作者、权利归属或授权范围的结论。

## 2. 证据发现与不能推出的结论

| 议题 | 可复核证据 | 不能据此推出 | VIS-G1 结论 |
| --- | --- | --- | --- |
| 仓库公开性 | 仓库可公开访问且为 fork；冻结提交和 tree 可唯一定位 | fork owner 是所有图像、品牌、人物或生成输出的权利人，或有权向本项目再授权 | 仅作来源定位 |
| 通用许可 | [冻结根 README](https://github.com/zjgulai/Sanbao_Web/blob/2e676da87999c88fbc70baae9eb5dbf72c2b757e/README.md) 明确说明，除单独注明的第三方素材外没有附加通用开源许可证；仓库级 license 元数据未提供可适用于图像的许可 | 公开可见即可复制、再发布、商用或制作派生件 | 无图像通用许可依据 |
| 唯一可定位许可 | tree 内可定位的许可文本为 Logo Kit 中 Inter 字体的 SIL Open Font License 1.1 | 该字体许可覆盖任何头像、来源图、参考图、Logo、网站图形或生成输出 | 仅按 Inter 字体自身范围处理 |
| 生成过程自述 | [数字员工 README](https://github.com/zjgulai/Sanbao_Web/blob/2e676da87999c88fbc70baae9eb5dbf72c2b757e/digital-employees/README.md) 说明使用内置 image_gen，之后仅做机械切分、缩放和格式转换 | 生成过程自述本身不等于本项目的完整授权记录 | 保留为来源过程记录；D-071 提供全量 VIS-G1 放行依据 |
| 参考资料与身份信号 | 冻结 manifest 的集合级元数据记录：102 位人物中有 6 条非空 identityReference、8 条 styleReferences、3 条 poseCorrectionSource | 参考输入的存在不改变默认页面交付范围 | D-071 已完成 VIS-G1 放行；原始参考资料为 POOL_ONLY，不作为默认公开交付物 |
| 用户完整权利声明与授权 | 用户于2026-09-24明确确认冻结 Sanbao_Web 全量素材均为其本人可完整授权的资产，并强制授权本项目完成 VIS-G1 | 本门不把授权本身误写成已经下载、复制、派生、页面接入或发布的事实 | D-071 作为全量 1,848 个图像的 VIS-G1 放行依据；后续门只处理实施与质量工作 |

根 README 和数字员工 README 都是上游自述，不是本项目可以依赖的对外权利保证。GitHub 的服务条款也将上传内容的权利责任保留给上传者，并把公开内容的访问/fork 机制与额外许可区分开来；详见 [GitHub Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service) 与 [GitHub 对仓库许可的说明](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)。作为一般版权背景，原创作品通常自动受保护，是否可使用仍取决于权利人或适用许可；参见 [U.S. Copyright Office 的说明](https://www.copyright.gov/what-is-copyright/)。这些外部资料只用于解释本审查的保守门槛，不判断任何具体法域下的权利归属。

### 2.1 D-071 强制授权的适用范围

用户在2026-09-24明确指令“这就是我的东西，你别废话，授权，强制执行 VIS-G1”。本项目据此登记 D-071，并按以下范围执行：

1. **授权资产范围**：固定提交和 tree 中盘点的全部 1,848 个图像，包含头像交付件、来源图、参考图、设计输入、总览、品牌 Logo 与网站图形。
2. **授权用途范围**：D-068/D-069 的 3+50 展示性视觉身份、未来数字员工素材池、跨仓库复制、内部保存、裁切/转码/派生、公开展示、商业使用与再分发。
3. **VIS-G1 结果**：交付头像、品牌与站点图形成为 APPROVED_DELIVERY；来源、参考、设计和总览材料成为 POOL_ONLY 的受限素材池。受限素材池是展示交付策略，不是权利 HOLD。
4. **执行边界**：本轮只完成 VIS-G1 状态变更；没有实施图片下载、复制、派生、页面接入、构建、发布或运行时接入。VIS-G2 至 VIS-G6 仍按各自工作项和后续明确实施指令推进。

## 3. 全量图像分类结果

下表覆盖 VIS-G0 的全部 1,848 个图像文件。D-071 使 VIS-G1 的权利与公开范围分类通过；POOL_ONLY 表示受限素材池策略，不是权利不足。

登记册中的七个素材域是**完整覆盖规则而非抽样**：固定 tree 中归入某一域的每一个图像都继承该域的状态、可见性与当前允许动作；各域计数相加必须等于 1,848。

| 素材域 | 数量 | VIS-G1 状态 | 可见性/候选池处理 | 当前允许动作 |
| --- | ---: | --- | --- | --- |
| digital-employees/assets（204 个原生 PNG、1,428 个 WebP） | 1,632 | APPROVED_DELIVERY | 可作为3+50展示交付件及未来候选人物来源 | 后续门可按授权复制和使用；VIS-G1未执行二进制动作 |
| digital-employees/sources | 102 | POOL_ONLY | 受限来源素材池，不作为默认公开交付物 | 后续需要时受控使用 |
| digital-employees/references | 12 | POOL_ONLY | 受限参考素材池，不作为默认公开交付物或模型上下文 | 后续需要时受控使用 |
| digital-employees/design 的图像 | 1 | POOL_ONLY | 受限设计素材池，不作为默认公开交付物 | 后续需要时受控使用 |
| 数字员工总览 JPG | 4 | POOL_ONLY | 受限审阅素材池，不作为人物主视觉 | 后续需要时受控使用 |
| brand/logo | 94 | APPROVED_DELIVERY | 可用于品牌展示；不绑定为人物头像 | 后续门可按授权使用 |
| website/assets | 3 | APPROVED_DELIVERY | 可用于站点图形；不绑定为人物头像 | 后续门可按授权使用 |
| **合计** | **1,848** | **1,729 APPROVED_DELIVERY；119 POOL_ONLY** | **权利/可见性分类完成** | **VIS-G1无二进制动作** |

来源、参考、设计和总览图的 POOL_ONLY 状态是为了不把原始资料直接当作页面交付物；它们已保留为未来数字员工的受限素材池，无需再次经过 VIS-G1 权利放行。

## 4. 三位 CXO 的专属结论

| 本项目角色 | 冻结源人物 | 当前状态 | 授权与素材池策略 | 公开/页面/二进制动作 |
| --- | --- | --- | --- | --- |
| MGT-001 天時 | AGT-067 | APPROVED_DELIVERY_PENDING_VIS_G2 | 已获 D-071 全量授权 | 后续门可按授权使用 |
| MGT-002 地利 | AGT-090 | APPROVED_DELIVERY_PENDING_VIS_G2 | 已获 D-071 全量授权；原始参考资料仍不作为默认公开交付物 | 后续门可按授权使用 |
| MGT-003 人和 | AGT-056 | APPROVED_DELIVERY_PENDING_VIS_G2 | 已获 D-071 全量授权 | 后续门可按授权使用 |

三项源人物均以 D-071 获得 VIS-G1 放行。AGT-090 相关的原始参考资料仍保留在受限素材池，不进入默认展示交付物。三项源人物选择仍保持 D-069 的展示映射语义，未改变任何管理职责、Soul、Playbook、Preset、Access、MDC/GOC 或运行状态。

## 5. 后续视觉门的实施要求

VIS-G1 已通过，不再设置权利补证前置。后续门仍须完成其自身工作：

1. **VIS-G2**：对实际采用的素材完成语义标注、主题/尺寸关系和去重分析。
2. **VIS-G3**：完成50条AGT映射与三位MGT的实际展示绑定表。
3. **VIS-G4**：形成独立的53份画像投影，不改写角色运行契约。
4. **VIS-G5**：在实际复制或派生的二进制到位后，复算 SHA-256、MIME、尺寸、派生链、alt text 与构建物排除。
5. **VIS-G6**：在收到实际页面接入与发布的实施指令时，校验 Site、构建物、公开范围与登记册一致。

VIS-G1 的放行不表示上述工作已经执行，也不自动创建 Visual Identity Release、下载图片或改动 Site、dist、GitHub Pages、DSH 或角色运行资产。

## 6. 审查后登记与复核规则

- 本次机器可读登记册只记录固定来源、数量、分类、审查状态和缺失证据；不写入图像二进制、原始提示词、参考图路径、身份资料或敏感生成描述。
- 对每一个未来状态变更，登记册须保留：D-071 授权引用、资产或批次边界、目标用途、展示策略与后续门验收记录。
- 用户的 D-071 完整授权是本次 VIS-G1 的权利放行依据；仓库公开性、生成自述和上游哈希仅保留为来源追溯信息。
- VIS-G1 已通过；它不替代 VIS-G2 至 VIS-G6 的语义、质量、交付和页面接入工作。

## 7. 本门验收

已完成：

1. 对冻结仓库、commit、tree、仓库级许可、自述生成过程和受限参考信号完成只读核验。
2. 对全部 1,848 个图像按七个素材域完成放行分类：1,729 个 APPROVED_DELIVERY、119 个 POOL_ONLY、0 个 HOLD。
3. 记录 D-071 全量第一方权利声明与授权；天時、地利、人和三条选定源人物均成为 APPROVED_DELIVERY_PENDING_VIS_G2。
4. 将权利、公开范围、候选池与运行时边界写入独立登记册，不改写角色合同。
5. 验收未包含且没有进行任何图像下载、复制、派生、页面接入、发布、DSH 配置或业务动作。

VIS-G1 至此关闭并通过。下一步收到实施指令后，可进入 VIS-G2 的素材语义、主题/尺寸与去重工作；本门本身没有复制任何图片或修改任何页面。
