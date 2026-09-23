# Sanbao_Web VIS-G3 视觉身份绑定审查

状态：`COMPLETE_BINDING_TABLE_PENDING_VIS_G5`<br>
审查日期：2026-09-24<br>
前提：D-073 已接受 `VIS-G2-CANONICALIZATION-1` 为后续视觉门的可复算目录锚点；VIS-G0 旧指纹保留为历史记录，不再表述为已复验。<br>
范围：将 50 条 AGT 与 3 条 MGT 的项目角色映射到 VIS-G2 已登记、可绑定的同一人物深浅主题交付变体。<br>
不含：图片二进制复制/下载、像素与 MIME 验证、感知去重、人工视觉预览、Visual Identity Release、页面接入、公开发布、DSH 或运行时修改。

本门的机器可读产物是 [VIS-G3 视觉身份绑定表](SANBAO-WEB-VIS-G3-VISUAL-IDENTITY-BINDINGS-2026-09-24.json)。它是展示层的独立绑定事实源，不写入 `role-catalog.json`、管理层目录、Soul、Playbook、Preset、Role Release Bundle、Access Contract 或 Case Control。

## 1. 可复算来源链

| 项目 | 结果 |
| --- | --- |
| 上游固定提交 | `2e676da87999c88fbc70baae9eb5dbf72c2b757e` |
| 固定 tree | `4948f180d4e5a0bc8c599022227c384d525729c5` |
| 语义输入 | [VIS-G2 语义登记册](SANBAO-WEB-VIS-G2-SEMANTIC-REGISTER-2026-09-24.json) |
| 目录锚点 | `VIS-G2-CANONICALIZATION-1`，D-073 已接受 |
| 历史 G0 指纹 | 保留，状态为 `RETAINED_HISTORICAL_NOT_VERIFIED` |
| AGT 角色语义权威 | `docs/05-agents/role-catalog.json` |
| MGT 角色语义权威 | `docs/04-organization/management/management-catalog.json` |

绑定表不复制 G2 中的来源路径或 Git blob ID；每个图像引用均使用稳定 `asset_id` 回指 G2 登记册。这样能让页面、后续质量门和来源审计引用同一份路径/哈希事实，而不会形成第二个素材目录。

## 2. 53 条绑定的固定规则

| 角色范围 | 人物来源规则 | 数量 | 结果 |
| --- | --- | ---: | --- |
| AGT-001 至 AGT-050 | `role_id = source_persona_id` | 50 | 全部按同 ID 映射 |
| MGT-001 天時 | `AGT-067` 星阑 | 1 | 与 D-069 一致 |
| MGT-002 地利 | `AGT-090` 语桐 | 1 | 与 D-069 一致 |
| MGT-003 人和 | `AGT-056` 昭禾 | 1 | 与 D-069 一致 |
| **总计** | 每个角色与每位源人物均唯一 | **53** | **无跨角色共用人物、无跨主题换人** |

三位管理层的绑定引用如下；深色与浅色使用同一源人物，只切换对应主题交付件。

| 角色 | 源人物 | 列表图 | 主图/详情图 | 同人后备图 | 原生质量追溯 |
| --- | --- | --- | --- | --- | --- |
| 天時 / MGT-001 | AGT-067 | `RENDITION-AGT-067-{theme}-64` | `RENDITION-AGT-067-{theme}-256` | `RENDITION-AGT-067-{theme}-128` | `RENDITION-AGT-067-{theme}-native` |
| 地利 / MGT-002 | AGT-090 | `RENDITION-AGT-090-{theme}-64` | `RENDITION-AGT-090-{theme}-256` | `RENDITION-AGT-090-{theme}-128` | `RENDITION-AGT-090-{theme}-native` |
| 人和 / MGT-003 | AGT-056 | `RENDITION-AGT-056-{theme}-64` | `RENDITION-AGT-056-{theme}-256` | `RENDITION-AGT-056-{theme}-128` | `RENDITION-AGT-056-{theme}-native` |

`{theme}` 只能是 `dark` 或 `light`。绑定表已逐项核验上述引用均为 `APPROVED_DELIVERY` 且 `ELIGIBLE_FOR_PERSONA_BINDING`，没有使用来源图、参考图、设计输入、总览、Logo 或站点图形。

## 3. 展示绑定的最小契约

每条绑定包含以下独立展示字段：

| 字段组 | 已固定内容 | 状态 |
| --- | --- | --- |
| 角色语义 | `role_id`、显示名称、岗位标题、权威目录引用 | 已固定；只读引用项目目录 |
| 人物来源 | `source_persona_id`、源人物名称、角色—人物映射依据 | 已固定 |
| 主题与尺寸 | 深浅主题主图/列表图/详情图/同人后备图/原生质量追溯图 | 已固定为 256/64/256/128/native 的结构选择 |
| 可访问性 | “角色名数字分身形象，深色/浅色主题”的中性草案 alt text | 待 VIS-G5 结合实际预览确认 |
| 发布状态 | `NOT_CREATED_PENDING_VIS_G5` | 未创建 Visual Identity Release |
| 质量状态 | `STRUCTURAL_BINDING_PENDING_VIS_G5` | 尚未进行实际二进制、视觉或感知去重验收 |

所有 53 条绑定的 `role_contract_impact` 和 `runtime_or_access_impact` 均为 `NONE`。视觉绑定不使任何角色获得运行身份、Case 资格、权限、工具、预算或生产状态。

## 4. 角色语义与来源人物的边界

角色名称、岗位标题、使命、产物和行为原则继续完全由项目目录定义。对 AGT-001 至 AGT-050，VIS-G2 发现上游 `job` 有 9 项、`deliver` 有 2 项与项目目录不一致；它们已在绑定表中标记为 `SOURCE_CONTEXT_NONAUTHORITATIVE`，不会反写到角色展示内容。三位管理层的源人物仅提供视觉来源，管理层角色语义仅来自 `management-catalog.json`。

因此，“源人物被选作某个角色的视觉形象”不等于“源人物的上游岗位标签成为该角色的职责”。

## 5. 验证、状态与下一门

本轮使用以下产物进行机械复算：

| 产物 | 用途 |
| --- | --- |
| [构建器](../../../scripts/build-sanbao-vis-g3.mjs) | 从 VIS-G2 登记册和两个项目角色目录重建 53 条绑定 |
| [校验器](../../../scripts/verify-sanbao-vis-g3.mjs) | 核验角色完整性、唯一人物、三位 CXO 映射、同人深浅主题、尺寸、交付政策、语义权威和未越门边界 |

```sh
node scripts/build-sanbao-vis-g3.mjs --output docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G3-VISUAL-IDENTITY-BINDINGS-2026-09-24.json
node scripts/verify-sanbao-vis-g3.mjs --bindings docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G3-VISUAL-IDENTITY-BINDINGS-2026-09-24.json
```

验证结果：53/53 角色绑定完整；3/3 管理层映射正确；50/50 AGT 同 ID 映射正确；53 位源人物唯一；所有选定素材均来自 G2 已批准、可绑定的交付变体；Visual Identity Release 仍未创建。

D-074 后，`VIS-G4` 已将这些绑定与既有角色合同投影为 53 条 [Digital Persona Dossier 数据](SANBAO-WEB-VIS-G4-DIGITAL-PERSONA-DOSSIERS-2026-09-24.json)，而未改写角色合同。`VIS-G5` 仍必须先对实际采用的深浅主题交付件完成二进制、真实尺寸、MIME、裁切、小尺寸可读性、感知去重和 alt text 验收。`VIS-G6` 之前不得把本表或 Dossier 视觉资料接入页面、`dist/` 或公开发布。
