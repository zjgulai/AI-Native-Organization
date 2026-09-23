// 校验由 build-sanbao-vis-g3.mjs 生成的 VIS-G3 视觉绑定表。
// 本校验只核验结构绑定与治理边界；不读取或下载图像二进制。

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = process.cwd()
const args = process.argv.slice(2)

const optionalOption = (name, fallback) => {
  const index = args.indexOf(name)
  return index === -1 ? fallback : args[index + 1]
}
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))
const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

const bindingsPath = resolve(
  ROOT,
  optionalOption(
    '--bindings',
    'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G3-VISUAL-IDENTITY-BINDINGS-2026-09-24.json'
  )
)
const visG2Path = resolve(
  ROOT,
  optionalOption(
    '--vis-g2-register',
    'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G2-SEMANTIC-REGISTER-2026-09-24.json'
  )
)
const roleCatalogPath = resolve(
  ROOT,
  optionalOption('--role-catalog', 'docs/05-agents/role-catalog.json')
)
const managementCatalogPath = resolve(
  ROOT,
  optionalOption(
    '--management-catalog',
    'docs/04-organization/management/management-catalog.json'
  )
)

const bindingsRegister = readJson(bindingsPath)
const visG2 = readJson(visG2Path)
const roleCatalog = readJson(roleCatalogPath)
const managementCatalog = readJson(managementCatalogPath)
const bindings = bindingsRegister.bindings

assert(bindingsRegister.schema_version === '1.0', 'VIS-G3 schema_version 不正确')
assert(bindingsRegister.gate.id === 'VIS-G3', '登记册不是 VIS-G3')
assert(
  bindingsRegister.gate.status === 'COMPLETE_BINDING_TABLE_PENDING_VIS_G5',
  'VIS-G3 状态错误'
)
assert(
  bindingsRegister.source_anchor.commit === visG2.source_anchor.commit &&
    bindingsRegister.source_anchor.tree === visG2.source_anchor.tree &&
    bindingsRegister.source_anchor.vis_g2_register_id === visG2.register_id,
  'VIS-G3 与 VIS-G2 的来源锚点不一致'
)
assert(
  bindingsRegister.source_anchor.canonicalization_acceptance.decision_id === 'D-073' &&
    bindingsRegister.source_anchor.canonicalization_acceptance.status === 'ACCEPTED' &&
    bindingsRegister.source_anchor.canonicalization_acceptance.canonicalization.version ===
      'VIS-G2-CANONICALIZATION-1' &&
    bindingsRegister.source_anchor.canonicalization_acceptance.legacy_g0_fingerprints
      .status === 'RETAINED_HISTORICAL_NOT_VERIFIED',
  'VIS-G2 目录锚点的用户接受记录不完整'
)

for (const status of Object.values(
  bindingsRegister.source_anchor.canonicalization_acceptance.legacy_g0_fingerprints
    .reproduction_status_by_scope
)) {
  assert(
    status === 'MISMATCH_REQUIRES_G0_REMEDIATION',
    'G0 历史目录指纹不得被改写为已复验'
  )
}

assert(Array.isArray(bindings) && bindings.length === 53, 'VIS-G3 必须有53条绑定')
assert(
  new Set(bindings.map((binding) => binding.binding_id)).size === bindings.length &&
    new Set(bindings.map((binding) => binding.role_id)).size === bindings.length &&
    new Set(bindings.map((binding) => binding.source_persona_id)).size ===
      bindings.length,
  'VIS-G3 binding_id、role_id 或 source_persona_id 存在重复'
)
assert(
  bindingsRegister.coverage_summary.total_bindings === 53 &&
    bindingsRegister.coverage_summary.binding_count_by_role_kind.MGT === 3 &&
    bindingsRegister.coverage_summary.binding_count_by_role_kind.AGT === 50 &&
    bindingsRegister.coverage_summary.binding_count_by_status
      .STRUCTURAL_BINDING_PENDING_VIS_G5 === 53 &&
    bindingsRegister.coverage_summary.unique_source_persona_count === 53,
  'VIS-G3 覆盖统计不正确'
)

const g2AssetById = new Map(
  visG2.asset_semantic_index.map((asset) => [asset.asset_id, asset])
)
const roleById = new Map(roleCatalog.roles.map((role) => [role.id, role]))
const managementRoleById = new Map(
  managementCatalog.roles.map((role) => [role.id, role])
)
const expectedMgtSources = {
  'MGT-001': 'AGT-067',
  'MGT-002': 'AGT-090',
  'MGT-003': 'AGT-056'
}
const expectedWebpBySlot = {
  primary_asset_id: 256,
  list_asset_id: 64,
  detail_asset_id: 256,
  fallback_asset_id: 128
}

const checkAsset = (assetId, personaId, theme, expectedSize) => {
  const asset = g2AssetById.get(assetId)
  assert(asset, '绑定引用了不存在的 VIS-G2 素材：' + assetId)
  assert(
    asset.asset_domain === 'DELIVERY_RENDITIONS' &&
      asset.source_persona_id === personaId &&
      asset.semantic_attributes.ui_theme === theme &&
      asset.governance.delivery_policy === 'APPROVED_DELIVERY' &&
      asset.governance.role_bindability === 'ELIGIBLE_FOR_PERSONA_BINDING',
    '绑定素材不满足展示交付条件：' + assetId
  )
  if (expectedSize === 'native') {
    assert(
      asset.asset_class === 'PERSONA_NATIVE_PORTRAIT',
      '绑定质量追溯素材不是原生 PNG：' + assetId
    )
  } else {
    assert(
      asset.asset_class === 'PERSONA_WEBP_RENDITION' &&
        asset.semantic_attributes.declared_rendition_size_px === expectedSize,
      '绑定 WebP 尺寸不正确：' + assetId
    )
  }
}

for (const binding of bindings) {
  assert(
    binding.binding_status === 'STRUCTURAL_BINDING_PENDING_VIS_G5' &&
      binding.visual_identity_release.status === 'NOT_CREATED_PENDING_VIS_G5' &&
      binding.governance.role_contract_impact === 'NONE' &&
      binding.governance.runtime_or_access_impact === 'NONE' &&
      binding.governance.visual_quality_gate === 'VIS-G5_REQUIRED',
    'VIS-G3 不得提前生成发布或改变运行合同：' + binding.role_id
  )
  assert(
    binding.presentation.rendering_policy.theme_switching ===
      'SAME_SOURCE_PERSONA_REQUIRED' &&
      binding.presentation.rendering_policy.list_rendition_size_px === 64 &&
      binding.presentation.rendering_policy.detail_rendition_size_px === 256 &&
      binding.presentation.rendering_policy.fallback_rendition_size_px === 128 &&
      binding.presentation.rendering_policy.binary_quality_status === 'PENDING_VIS_G5',
    '主题或展示尺寸策略错误：' + binding.role_id
  )
  for (const theme of ['dark', 'light']) {
    const themeRenditions = binding.presentation.themes[theme]
    assert(themeRenditions, '绑定缺少主题：' + binding.role_id + '/' + theme)
    for (const [slot, size] of Object.entries(expectedWebpBySlot)) {
      checkAsset(themeRenditions[slot], binding.source_persona_id, theme, size)
    }
    checkAsset(
      themeRenditions.quality_trace_native_asset_id,
      binding.source_persona_id,
      theme,
      'native'
    )
  }
  assert(
    binding.presentation.alt_text.dark ===
      binding.role_display_name + '数字分身形象，深色主题' &&
      binding.presentation.alt_text.light ===
        binding.role_display_name + '数字分身形象，浅色主题' &&
      binding.presentation.alt_text.status === 'DRAFT_NEUTRAL_TEXT_PENDING_VIS_G5',
    '中性 alt text 不正确：' + binding.role_id
  )

  if (binding.role_kind === 'AGT') {
    const role = roleById.get(binding.role_id)
    assert(role, '绑定存在未知 AGT 角色：' + binding.role_id)
    assert(
      binding.source_persona_id === binding.role_id &&
        binding.role_display_name === role.alias &&
        binding.role_title === role.title &&
        binding.role_catalog_authority.semantic_display_policy ===
          'PROJECT_ROLE_CATALOG_ONLY',
      'AGT 的角色语义或同 ID 映射不正确：' + binding.role_id
    )
    const expectedContextStatus =
      visG2.project_role_alignment.upstream_job_title_mismatch_ids.includes(
        binding.role_id
      ) ||
      visG2.project_role_alignment.upstream_deliver_artifact_mismatch_ids.includes(
        binding.role_id
      )
        ? 'SOURCE_CONTEXT_NONAUTHORITATIVE'
        : 'SOURCE_CONTEXT_MATCHES_PROJECT_LABEL'
    assert(
      binding.source_context_status === expectedContextStatus,
      'AGT 来源语义状态错误：' + binding.role_id
    )
  } else if (binding.role_kind === 'MGT') {
    const role = managementRoleById.get(binding.role_id)
    assert(role, '绑定存在未知 MGT 角色：' + binding.role_id)
    assert(
      binding.source_persona_id === expectedMgtSources[binding.role_id] &&
        binding.role_display_name === role.alias &&
        binding.role_title === role.title &&
        binding.role_catalog_authority.semantic_display_policy ===
          'MANAGEMENT_CATALOG_ONLY' &&
        binding.source_context_status ===
          'SOURCE_PERSONA_ONLY_ROLE_SEMANTICS_FROM_MANAGEMENT_CATALOG',
      'MGT 的来源人物或角色语义不正确：' + binding.role_id
    )
  } else {
    throw new Error('未知角色类型：' + binding.role_kind)
  }
}

const serializedBindings = JSON.stringify(bindingsRegister)
for (const forbiddenValue of [
  '"appearance"',
  '"prompt"',
  '"identityReference"',
  '"styleReferences"',
  '"poseCorrectionSource"',
  '"skinCorrectionSource"',
  'digital-employees/references/',
  '"source_path"',
  '"git_blob_sha"'
]) {
  assert(
    !serializedBindings.includes(forbiddenValue),
    'VIS-G3 绑定表不应暴露受限来源或路径字段：' + forbiddenValue
  )
}

console.log('PASS VIS-G3 视觉绑定表的53条映射、主题尺寸、治理边界与来源锚点校验通过')
console.log('  3条 MGT + 50条 AGT；同一人物深浅主题保持一致；Visual Identity Release 仍未创建。')
