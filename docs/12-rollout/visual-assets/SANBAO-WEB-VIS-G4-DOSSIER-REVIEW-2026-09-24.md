# Sanbao_Web VIS-G4 Digital Persona Dossier 审查

状态：`COMPLETE_DOSSIER_PROJECTION_PENDING_VIS_G5`<br>
审查日期：2026-09-24<br>
前提：D-074 已授权启动 VIS-G4；VIS-G3 的 53 条结构性视觉绑定与 D-073 接受的 `VIS-G2-CANONICALIZATION-1` 为输入锚点。<br>
范围：把 50 条 AGT 与 3 条 MGT 的既有角色合同、治理资料和 VIS-G3 绑定投影为可独立寻址、可复算的 Digital Persona Dossier。<br>
不含：图片二进制下载/复制/编辑、像素/MIME/感知去重、人工视觉预览、Visual Identity Release、页面接入、公开发布、DSH 导入、运行时或角色合同变更。

本门的机器可读产物是 [VIS-G4 Digital Persona Dossier 登记册](SANBAO-WEB-VIS-G4-DIGITAL-PERSONA-DOSSIERS-2026-09-24.json)。它包含 53 条 `dossier_id`，例如 `DPD-MGT-001`、`DPD-AGT-001`，每条可独立引用。Dossier 是只读投影，不复制或取代 Role Profile、Soul Contract、Role Playbook、Preset Blueprint、Role Release Bundle 或 Visual Identity Binding 的权威事实。

## 1. 覆盖与来源链

| 检查项 | 结果 |
| --- | ---: |
| Digital Persona Dossier | 53 条 |
| 管理层 Dossier | 3 条：天時、地利、人和 |
| 执行岗位 Dossier | 50 条：AGT-001 至 AGT-050 |
| 唯一角色 ID / Dossier ID / VIS-G3 Binding | 53 / 53 / 53 |
| 唯一视觉源人物 | 53 |
| VIS-G3 视觉状态 | 全部 `STRUCTURAL_BINDING_PENDING_VIS_G5` |
| Visual Identity Release | 全部 `NOT_CREATED_PENDING_VIS_G5` |
| 可复算输入 | 223 份已读取的项目文本/JSON资产，均记录内容 SHA-256 |

本门的输入目录使用 `VIS-G4-INPUT-CANONICALIZATION-1`：按 Unicode code-point 顺序排列 `kind<TAB>role_id<TAB>path<TAB>content_sha256<LF>`，再计算 SHA-256。此次输入目录指纹为：

```text
d095dbd3f32fc01797af19f5bf0ddd39624c3915445e79e5d2cb29951ffc88de
```

这个摘要只证明 VIS-G4 使用的角色资料和绑定资料可重算；它不是图片二进制哈希、Role Release Bundle、DSH 导入包或生产验收。

## 2. 53 份画像的八层结构

| 层 | Dossier 投影内容 | 仍然的权威来源 |
| --- | --- | --- |
| 角色身份 | ID、名称、岗位、组织位置、使命、标准产物、指标与设计状态 | `role-catalog.json` 或 `management-catalog.json` |
| 视觉身份 | VIS-G3 binding、深浅主题 `asset_id`、中性 alt text 草案、质量/发布状态 | VIS-G3 绑定表；素材事实仍在 VIS-G2 |
| 经营使命 | 使命、目标与标准产物 | 两类项目角色目录 |
| 判断人格 | 人格、原则、Soul/Role Profile 引用及内容哈希 | Soul Contract 与 Role Profile |
| 能力边界 | Skills、价值流、场景、共享 Playbook、产物合同引用 | Role Playbook 与 Preset Blueprint |
| 协同关系 | 独立模式、受控组队或管理接口、交接边界、协作对象 | Preset Blueprint、协同图谱与管理目录 |
| 运行与治理 | 五契约或管理决策合同、工具类别、默认拒绝、Assurance、DSH候选投影、Bundle非实例化状态 | 管理图、Preset Blueprint、管理权责文件 |
| 来源与版本 | 角色合同/视觉绑定引用、内容哈希、VIS-G3 固定提交/tree 与 D-073 锚点状态 | VIS-G3 与输入目录 |

Soul、Playbook 和 Blueprint 均以“路径 + 内容哈希”方式被引用，而非由 VIS-G4 复制为第二套合同。这样每份分身画像包含完整的可检索信息和来源链，又不会造成岗位职责、人格、权限或运行配置的双写漂移。

## 3. 3+50 视觉身份与角色语义

| 角色范围 | 角色语义权威 | 视觉来源规则 | 结果 |
| --- | --- | --- | --- |
| AGT-001 至 AGT-050 | 项目 `role-catalog.json` | 同 ID 源人物 | 50/50 完整 |
| 天時 / MGT-001 | `management-catalog.json` | AGT-067 星阑 | 已投影 |
| 地利 / MGT-002 | `management-catalog.json` | AGT-090 语桐 | 已投影 |
| 人和 / MGT-003 | `management-catalog.json` | AGT-056 昭禾 | 已投影 |

每条 Dossier 仅转抄 VIS-G3 的稳定 `binding_id` 和 G2 `asset_id`。它不保存上游图像路径、Git blob、原始参考资料、提示词、外貌文本、身份参考或图像二进制。上游 `job`/`deliver` 仍不能覆盖项目角色的标题、使命、产物、技能、人格或权限边界。

## 4. 管理层 Blueprint 来源例外

VIS-G4 发现并隔离了 4 条既有管理层 Blueprint 字段不一致。它们不是本门新产生的角色合同修改；Dossier 继续使用管理层目录、Role Profile 和 Role Playbook 的权威语义，Blueprint 原文件保持不动。

| Dossier | 来源字段 | 原字段值 | Dossier 采用值 / 处理 | 状态 |
| --- | --- | --- | --- | --- |
| 地利 / MGT-002 | `modes.standalone.completion_artifact` | 全局组合决策包 | 增长组合决策包（管理层目录权威） | `SOURCE_FIELD_NONAUTHORITATIVE_PENDING_RP_REMEDIATION` |
| 地利 / MGT-002 | `access.scope_source` | 指向 MGT-001 的只读聚合契约 | 不据此推导权限；保持默认拒绝、无资产执行、待角色专属契约核实 | `SOURCE_FIELD_NONAUTHORITATIVE_PENDING_RP_REMEDIATION` |
| 人和 / MGT-003 | `modes.standalone.completion_artifact` | 全局组合决策包 | 治理与能力决策包（管理层目录权威） | `SOURCE_FIELD_NONAUTHORITATIVE_PENDING_RP_REMEDIATION` |
| 人和 / MGT-003 | `access.scope_source` | 指向 MGT-001 的只读聚合契约 | 不据此推导权限；保持默认拒绝、无资产执行、待角色专属契约核实 | `SOURCE_FIELD_NONAUTHORITATIVE_PENDING_RP_REMEDIATION` |

这四条例外要求后续单独授权的 Role/Preset 修复工作；它们不被藏入画像文字，也不被 VIS-G4 误写成已修复、已导入、已运行或已授权。

## 5. 验证与后续门

| 产物 | 用途 |
| --- | --- |
| [构建器](../../../scripts/build-sanbao-vis-g4.mjs) | 从 223 份固定角色/治理/绑定输入重建 53 条 Dossier 与输入目录摘要 |
| [校验器](../../../scripts/verify-sanbao-vis-g4.mjs) | 校验 3+50 覆盖、角色语义、合同引用与内容哈希、独立/组队边界、VIS-G3 状态、输入摘要、受限字段隔离与 4 条例外 |

```sh
node scripts/build-sanbao-vis-g4.mjs --output docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G4-DIGITAL-PERSONA-DOSSIERS-2026-09-24.json
node scripts/verify-sanbao-vis-g4.mjs --dossiers docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G4-DIGITAL-PERSONA-DOSSIERS-2026-09-24.json
```

验证结果：53/53 Dossier 完整；3/3 管理层与 50/50 执行岗位角色语义正确；VIS-G3 深浅主题同人绑定被原样保留；所有角色仍是设计态、`production_authorized=false`、Role Release Bundle 未实例化、Visual Identity Release 未创建；4 条 MGT Blueprint 来源例外已显式隔离。

`VIS-G5` 仍必须完成实际二进制读取、MIME、真实尺寸、深浅主题预览、裁切、小尺寸可读性、感知去重和最终 alt text 验收。`VIS-G6` 才能在独立授权后创建 Visual Identity Release、把批准后的视觉资料接入页面或 `dist/`、发布，或处理未来角色复用。VIS-G4 不会自动推进这两道门，也不修复上述 Blueprint 来源例外。
