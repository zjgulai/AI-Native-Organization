# Sanbao_Web VIS-G2 素材语义、主题尺寸与去重审查

状态：`COMPLETE_STRUCTURAL_SEMANTICS_WITH_G0_FINGERPRINT_EXCEPTION`<br>
审查日期：2026-09-24<br>
范围：固定 Sanbao_Web tree 的元数据、固定 `avatar-manifest.json`、VIS-G0 来源快照、VIS-G1 分类登记册与项目岗位目录。<br>
不含：图像二进制下载或复制、像素/文件签名复算、感知去重、实际视觉预览、Visual Identity Binding、页面接入、发布、DSH 或运行时变更。

本门的机器可读产物是 [VIS-G2 语义登记册](SANBAO-WEB-VIS-G2-SEMANTIC-REGISTER-2026-09-24.json)。它把固定来源中的每一个图像登记为可检索的素材记录，并将“人物候选池”“单个主题/尺寸变体”“素材间关系”严格拆开。本审查不把视觉特征投射为岗位能力、人格、权限或运行身份。

## 1. 来源锚点与审查方法

| 项目 | 结果 |
| --- | --- |
| 上游仓库 | `zjgulai/Sanbao_Web` |
| 固定提交 | `2e676da87999c88fbc70baae9eb5dbf72c2b757e` |
| 固定 Git tree | `4948f180d4e5a0bc8c599022227c384d525729c5` |
| tree 响应 | 未截断；2,122 个 tree 条目 |
| `avatar-manifest.json` Git blob | `5fe37b375d415593c19c3712f225b5e21e7f02f8`，本轮按 Git blob 格式复算匹配 |
| VIS-G0 / VIS-G1 锚点 | 提交、tree 与 manifest 锚点一致 |

本门以固定 tree 的 Git blob ID、路径和字节数建立结构性索引；对 manifest 中已声明的主题、尺寸、原生 PNG SHA-256 与路径进行交叉校验。它没有将“上游声明的 SHA-256”误写为本项目重新下载并核验的二进制 SHA-256。

## 2. 可检索素材覆盖

| 素材域 | 数量 | 结构性语义与展示边界 |
| --- | ---: | --- |
| `DELIVERY_RENDITIONS` | 1,632 | 单一已命名人物的原生 PNG 与 WebP 交付变体；可作为后续展示绑定候选，仍待实际二进制/视觉验收 |
| `SOURCE_SHEETS` | 102 | 逐人来源双联图；仅作受限来源追溯，不作默认前端交付 |
| `REFERENCE_INPUTS` | 12 | 受限参考输入；匿名登记，不暴露原始路径或 Git blob ID |
| `DESIGN_INPUT_IMAGE` | 1 | 受限设计输入；匿名登记，不暴露原始路径或 Git blob ID |
| `DIGITAL_EMPLOYEE_OVERVIEWS` | 4 | 多人物总览，只能用作总览素材，永不绑定单一角色 |
| `BRAND_LOGO` | 94 | 品牌图形，永不绑定数字员工 |
| `WEBSITE_GRAPHICS` | 3 | 站点支撑图形，永不绑定数字员工 |
| **合计** | **1,848** | **397,188,626 bytes** |

登记册为每项素材保存稳定 `asset_id`、素材域、类别、主体范围、主题、声明尺寸、格式、风格上下文、结构性展示适配性、来源定位、候选池关系、交付政策与角色绑定资格。受限素材只保留匿名标识、字节数与受限状态，不写入参考路径、提示词、外貌文本或身份参考资料。

## 3. 人物族、主题与尺寸矩阵

固定 manifest 中有 102 个唯一 `AGT-xxx` 人物族。每个族都具有：

- 1 张声明为 `1774×887` 的来源双联图；
- 深色、浅色各 1 张声明为 `887×887` 的原生 PNG，共 204 张；
- 深色、浅色各 7 档 WebP：`32`、`48`、`64`、`80`、`128`、`256`、`512` px，共 `102 × 2 × 7 = 1,428` 张。

结构性矩阵校验结果为 102/102 人物完整，深浅主题均存在，14 个 WebP 变体和 2 个原生 PNG 变体均存在，manifest 声明的路径、字节数、主题及尺寸档位之间没有缺口。此结果表示“已声明的交付矩阵完整”；主题是否实际换人、画面是否小尺寸可读、裁切是否安全，仍属于后续实际二进制和人工视觉审阅，不得提前宣称通过。

## 4. 语义模型与复用边界

VIS-G2 使用三层语义模型：

| 层 | 记录对象 | 本门的作用 |
| --- | --- | --- |
| 人物族 | 102 个 `source_persona_id` | 保存候选池关系、色板与构图等中性元数据；候选池关系只属于人物，不随每个尺寸重复定义 |
| 单项素材 | 1,848 个资产记录 | 保存素材域、主题、尺寸、格式、风格上下文、展示适配性、来源定位和交付政策 |
| 语义关系 | 同人物、主题配对、尺寸变体、精确二进制重复、近视觉重复 | 防止把“同人物不同尺寸”误判为重复，或把“字节不同”误判为视觉不同 |

人物族分层如下：50 个既有岗位同 ID 来源基线、2 个保留上游语义人物、3 个已选管理层源人物、47 个未来角色候选。`POOL_ONLY` 是单项素材的交付政策，并不自动表示该人物可被新角色使用；未来复用仍需要明确的角色映射与后续门禁。

## 5. 去重与项目岗位交叉核验

### 5.1 可证明的精确重复

- 固定 Git tree 的 1,848 个图像按 Git blob ID 分组：**0 个完全相同二进制重复组**。
- manifest 已声明的 204 个原生 PNG SHA-256：**0 个重复**。
- “近视觉重复”状态为 `NOT_EVALUATED_IN_VIS_G2`。它需要批准的感知哈希方法、实际图像二进制与人工审阅；不能由路径、名称、色板或 Git blob 不同替代。

### 5.2 3+50 来源映射边界（VIS-G2 历史快照）

| 范围 | 结构性结果 |
| --- | --- |
| AGT-001 至 AGT-050 | 项目角色 ID 和中文别名与固定来源人物均为 50/50 匹配 |
| MGT-001 天時 | 源人物 `AGT-067` 星阑；保持 `MGT_SOURCE_SELECTED_PENDING_VIS_G3` |
| MGT-002 地利 | 源人物 `AGT-090` 语桐；保持 `MGT_SOURCE_SELECTED_PENDING_VIS_G3` |
| MGT-003 人和 | 源人物 `AGT-056` 昭禾；保持 `MGT_SOURCE_SELECTED_PENDING_VIS_G3` |

表中的 `MGT_SOURCE_SELECTED_PENDING_VIS_G3` 是 VIS-G2 完成时的历史状态；D-073 后的当前展示绑定状态以 VIS-G3 绑定表为准。上游 `job` 与本项目岗位标题有 9 条不一致，上游 `deliver` 与项目标准产物有 2 条不一致。它们不是人物 ID 映射失败：项目 `docs/05-agents/role-catalog.json` 仍是岗位语义唯一权威；上游字段只保留为来源上下文，不得写入角色展示标题、使命、职责或标准产物。

本门没有写入任何 `ASSIGNED_PRIMARY`、Visual Identity Binding 或 Visual Identity Release。三位管理层只保留已确认的源人物选择，尚未建立实际展示绑定。

## 6. VIS-G0 目录指纹复算异常

VIS-G0 冻结的提交、tree、图像数和字节数全部匹配；三份上游目录文件的 Git blob 锚点也匹配。但 VIS-G0 写入的“按 `en` locale 排序、以 `path<TAB>git_blob_sha<TAB>bytes<LF>` 拼接并 SHA-256”的目录指纹，无法按其自身说明复算。为避免静默覆盖历史记录，VIS-G2 保留旧值，另立版本化、Unicode code-point 路径序的确定性指纹。

| 范围 | count / bytes | G0 声明规则复算值 | VIS-G2 code-point 确定性指纹 | 状态 |
| --- | ---: | --- | --- | --- |
| 全仓 blob | 2,084 / 417,143,325 | `e00e27b35d2af3aeca1ddcf06ba5c59d5065d4eefe37cac756d652de4c867349` | `ce4514cd7c511e45bdba1f4c31bdf66d1c281d013663eb9f37f7e62d64baf86f` | 与 G0 历史值不一致 |
| 全仓图像 | 1,848 / 397,188,626 | `e618f6ceae63e6efb0d7286c5ef7ba61741b4d8c4ee290851d00daca339c40f3` | `436268f18b85fc10dd03bf861d046382cb8f0591e6f619027e7f437947fffc4d` | 与 G0 历史值不一致 |
| `digital-employees/` 图像 | 1,751 / 393,408,484 | `69d22e8db967d560aa8fa2b13d6645b49553d833c63ad4d11ab90aba2936fc12` | `879674f5e30b9b9444b897c7b25d2c7bf0f7d6020e56a95517ec686ed60da7ac` | 与 G0 历史值不一致 |

这是一项来源元数据可复算性异常，而不是来源漂移：固定 commit/tree、三个目录 blob、数量与字节数均已复核。D-073 已接受登记册中的 `VIS-G2-CANONICALIZATION-1` 作为后续视觉门的可复算目录锚点，同时保留 G0 历史值和异常记录；不得把旧值静默改写为“已复验”。该接受不改变 VIS-G2 的二进制与视觉验证边界，不得将其结构性完成误写为最终图片二进制验收或完整 Visual Identity Release。

## 7. 产物、复算与下一门

| 产物 | 用途 |
| --- | --- |
| [语义登记册](SANBAO-WEB-VIS-G2-SEMANTIC-REGISTER-2026-09-24.json) | 102 人物族、1,848 素材、主题/尺寸矩阵、来源定位、交付政策、候选池关系与指纹异常的机器可读事实源 |
| [构建器](../../../scripts/build-sanbao-vis-g2.mjs) | 从固定 tree、manifest、VIS-G0、VIS-G1 和项目角色目录重建登记册 |
| [校验器](../../../scripts/verify-sanbao-vis-g2.mjs) | 校验锚点、全量覆盖、主题尺寸、去重边界、3+50 映射、敏感字段隔离与未越门情况 |

本轮校验命令：

```sh
node scripts/build-sanbao-vis-g2.mjs --manifest /path/to/avatar-manifest.json --tree /path/to/tree.json --output docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G2-SEMANTIC-REGISTER-2026-09-24.json
node scripts/verify-sanbao-vis-g2.mjs --register docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G2-SEMANTIC-REGISTER-2026-09-24.json
```

`VIS-G3` 已在 D-073 后完成独立的 50 条 AGT 和 3 条 MGT 可审阅展示绑定表，见 [VIS-G3视觉绑定审查](SANBAO-WEB-VIS-G3-BINDING-REVIEW-2026-09-24.md)；该表仍是结构性绑定，不是 Visual Identity Release。`VIS-G5` 才负责实际采用图像的二进制、MIME、真实像素、感知去重、深浅主题预览与小尺寸质量验收；`VIS-G6` 才能在独立授权后接入页面和发布。当前没有将任何图片复制进本项目或 `dist/`，也没有变更角色合同、权限、DSH 或运行状态。
