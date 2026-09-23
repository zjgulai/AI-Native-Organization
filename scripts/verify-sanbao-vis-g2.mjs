// 校验由 build-sanbao-vis-g2.mjs 生成的 VIS-G2 语义登记册。
// 这是结构、来源锚点与治理边界校验；不读取或下载图像二进制。

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
const countBy = (items, selector) =>
  items.reduce((counts, item) => {
    const key = selector(item)
    counts[key] = (counts[key] ?? 0) + 1
    return counts
  }, {})

const registerPath = resolve(
  ROOT,
  optionalOption(
    '--register',
    'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G2-SEMANTIC-REGISTER-2026-09-24.json'
  )
)
const sourceSnapshotPath = resolve(
  ROOT,
  optionalOption(
    '--source-snapshot',
    'docs/12-rollout/visual-assets/SANBAO-WEB-SOURCE-SNAPSHOT-2026-09-23.json'
  )
)
const visG1Path = resolve(
  ROOT,
  optionalOption(
    '--vis-g1-register',
    'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G1-RIGHTS-AND-VISIBILITY-REGISTER-2026-09-23.json'
  )
)

const register = readJson(registerPath)
const sourceSnapshot = readJson(sourceSnapshotPath)
const visG1 = readJson(visG1Path)
const assets = register.asset_semantic_index
const personas = register.persona_families

assert(register.schema_version === '1.0', 'VIS-G2 schema_version 不正确')
assert(register.gate.id === 'VIS-G2', '登记册不是 VIS-G2')
assert(
  register.gate.status === 'COMPLETE_STRUCTURAL_SEMANTICS_WITH_G0_FINGERPRINT_EXCEPTION',
  'VIS-G2 状态未明确标记 G0 指纹异常'
)
assert(
  register.source_anchor.commit === sourceSnapshot.upstream.commit &&
    register.source_anchor.tree === sourceSnapshot.upstream.tree &&
    register.source_anchor.commit === visG1.source_anchor.commit &&
    register.source_anchor.tree === visG1.source_anchor.tree,
  'VIS-G0、VIS-G1、VIS-G2 来源锚点不一致'
)
assert(
  register.source_anchor.avatar_manifest.git_blob_sha ===
    sourceSnapshot.pinned_catalogs.avatar_manifest.git_blob_sha &&
    register.source_anchor.avatar_manifest.git_blob_sha_verified_from_input === true,
  'avatar manifest Git blob 锚点未验证'
)

assert(Array.isArray(assets) && assets.length === 1848, '素材语义索引未完整覆盖 1,848 个图像')
assert(new Set(assets.map((asset) => asset.asset_id)).size === assets.length, 'asset_id 存在重复')
assert(
  assets.reduce((total, asset) => total + asset.source_locator.bytes, 0) === 397188626,
  '素材字节总数不等于冻结清单'
)
assert(Array.isArray(personas) && personas.length === 102, '人物族索引不是 102 项')
assert(
  new Set(personas.map((persona) => persona.source_persona_id)).size === personas.length,
  'source_persona_id 存在重复'
)

const expectedDomainCounts = {
  DELIVERY_RENDITIONS: 1632,
  SOURCE_SHEETS: 102,
  REFERENCE_INPUTS: 12,
  DESIGN_INPUT_IMAGE: 1,
  DIGITAL_EMPLOYEE_OVERVIEWS: 4,
  BRAND_LOGO: 94,
  WEBSITE_GRAPHICS: 3
}
const expectedStyleContexts = new Set([
  'SANBAO_COLLECTION_06_PERSONA_RENDITION',
  'UPSTREAM_PERSONA_SOURCE_SHEET',
  'RESTRICTED_REFERENCE_INPUT',
  'RESTRICTED_DESIGN_INPUT',
  'MULTI_PERSONA_OVERVIEW',
  'BRAND_IDENTITY_GRAPHIC',
  'WEBSITE_SUPPORT_GRAPHIC'
])
const expectedStructuralDisplaySuitabilities = new Set([
  'RENDER_CANDIDATE_PENDING_BINARY_VISUAL_REVIEW',
  'TRACE_ONLY',
  'RESTRICTED_REVIEW_ONLY',
  'OVERVIEW_ONLY',
  'BRAND_SURFACE_ONLY',
  'WEBSITE_SURFACE_ONLY'
])
assert(
  JSON.stringify(register.coverage_summary.asset_count_by_domain) ===
    JSON.stringify(expectedDomainCounts),
  '素材域统计与固定清单不一致'
)
assert(
  register.coverage_summary.asset_count_by_delivery_policy.APPROVED_DELIVERY === 1729 &&
    register.coverage_summary.asset_count_by_delivery_policy.POOL_ONLY === 119,
  'APPROVED_DELIVERY / POOL_ONLY 统计不正确'
)
assert(
  register.coverage_summary.delivery_matrix.webp_expected === 1428 &&
    register.coverage_summary.delivery_matrix.webp_actual === 1428 &&
    register.coverage_summary.delivery_matrix.native_png_expected === 204 &&
    register.coverage_summary.delivery_matrix.native_png_actual === 204 &&
    register.coverage_summary.delivery_matrix.delivery_rendition_expected === 1632 &&
    register.coverage_summary.delivery_matrix.delivery_rendition_actual === 1632,
  '深浅主题与七档尺寸交付矩阵不完整'
)

const personaRelationCounts = register.coverage_summary.persona_pool_relation_counts
assert(
  personaRelationCounts.EXISTING_ROLE_SOURCE_BASELINE === 50 &&
    personaRelationCounts.PRESERVE_UPSTREAM_SEMANTICS === 2 &&
    personaRelationCounts.MGT_SOURCE_SELECTED_PENDING_VIS_G3 === 3 &&
    personaRelationCounts.FUTURE_ROLE_CANDIDATE === 47,
  '102 人候选池分层不正确'
)

for (const persona of personas) {
  const personaAssets = assets.filter(
    (asset) => asset.source_persona_id === persona.source_persona_id
  )
  assert(personaAssets.length === 17, '人物素材应为 1 来源图 + 2 原生 PNG + 14 WebP：' + persona.source_persona_id)
  assert(
    personaAssets.filter((asset) => asset.asset_class === 'PERSONA_SOURCE_SHEET').length === 1,
    '人物来源图数量错误：' + persona.source_persona_id
  )
  const deliveryAssets = personaAssets.filter(
    (asset) => asset.asset_domain === 'DELIVERY_RENDITIONS'
  )
  assert(deliveryAssets.length === 16, '人物交付变体数量错误：' + persona.source_persona_id)
  for (const theme of ['dark', 'light']) {
    const themeAssets = deliveryAssets.filter(
      (asset) => asset.semantic_attributes.ui_theme === theme
    )
    assert(themeAssets.length === 8, '人物主题变体数量错误：' + persona.source_persona_id + '/' + theme)
    assert(
      themeAssets.filter((asset) => asset.asset_class === 'PERSONA_NATIVE_PORTRAIT').length === 1,
      '人物主题原生 PNG 数量错误：' + persona.source_persona_id + '/' + theme
    )
    const sizes = themeAssets
      .filter((asset) => asset.asset_class === 'PERSONA_WEBP_RENDITION')
      .map((asset) => asset.semantic_attributes.declared_rendition_size_px)
      .sort((left, right) => left - right)
    assert(
      JSON.stringify(sizes) === JSON.stringify([32, 48, 64, 80, 128, 256, 512]),
      '人物 WebP 尺寸矩阵错误：' + persona.source_persona_id + '/' + theme
    )
  }
}

const selectedMgt = Object.fromEntries(
  personas
    .filter(
      (persona) =>
        persona.source_role_relation.persona_pool_relation ===
        'MGT_SOURCE_SELECTED_PENDING_VIS_G3'
    )
    .map((persona) => [
      persona.source_persona_id,
      persona.source_role_relation.project_role_id
    ])
)
assert(
  JSON.stringify(selectedMgt) ===
    JSON.stringify({ 'AGT-056': 'MGT-003', 'AGT-067': 'MGT-001', 'AGT-090': 'MGT-002' }),
  '三位 CXO 的来源人物映射不正确'
)

assert(
  register.project_role_alignment.source_persona_id_coverage.matched === 50 &&
    register.project_role_alignment.source_alias_coverage.matched === 50 &&
    register.project_role_alignment.upstream_job_title_mismatch_ids.length === 9 &&
    register.project_role_alignment.upstream_deliver_artifact_mismatch_ids.length === 2 &&
    register.project_role_alignment.upstream_job_is_not_project_role_authority === true &&
    register.project_role_alignment.upstream_deliver_is_not_project_role_authority === true,
  '项目岗位语义与上游来源语义的边界未明确'
)

assert(
  register.semantic_relations.exact_binary_duplicate.duplicate_group_count === 0 &&
    register.semantic_relations.exact_binary_duplicate.duplicate_file_count === 0 &&
    register.semantic_relations.upstream_declared_native_png_sha256.duplicate_count === 0 &&
    register.semantic_relations.near_visual_duplicate.status === 'NOT_EVALUATED_IN_VIS_G2',
  '精确去重或感知去重边界不正确'
)

const fingerprints = register.source_integrity.g0_fingerprint_reproduction
for (const [scope, expectedCount, expectedBytes] of [
  ['repository_blobs', 2084, 417143325],
  ['repository_images', 1848, 397188626],
  ['digital_employee_images', 1751, 393408484]
]) {
  const fingerprint = fingerprints[scope]
  assert(fingerprint, '缺少指纹范围：' + scope)
  assert(
    fingerprint.count === expectedCount &&
      fingerprint.bytes === expectedBytes &&
      fingerprint.count_and_byte_anchor_status === 'MATCH' &&
      fingerprint.g0_declared_reproduction_status === 'MISMATCH_REQUIRES_G0_REMEDIATION' &&
      /^[a-f0-9]{64}$/.test(fingerprint.g2_code_point_canonical_sha256),
    'G0 指纹异常记录不完整：' + scope
  )
}

for (const asset of assets) {
  assert(
    expectedStyleContexts.has(asset.semantic_attributes.visual_style_context) &&
      expectedStructuralDisplaySuitabilities.has(
        asset.semantic_attributes.structural_display_suitability
      ),
    '素材缺少受控的风格上下文或结构性展示适配性：' + asset.asset_id
  )
  assert(
    asset.governance.default_public_delivery === false,
    'VIS-G2 不得把素材默认标记为公开交付：' + asset.asset_id
  )
  assert(
    !Object.hasOwn(asset, 'visual_identity_binding') &&
      !Object.hasOwn(asset, 'visual_identity_release'),
    'VIS-G2 不得写入 Visual Identity Binding 或 Release：' + asset.asset_id
  )
  if (
    asset.asset_domain === 'REFERENCE_INPUTS' ||
    asset.asset_domain === 'DESIGN_INPUT_IMAGE'
  ) {
    assert(
      asset.asset_id.startsWith('RESTRICTED-') &&
        !Object.hasOwn(asset.source_locator, 'source_path') &&
        !Object.hasOwn(asset.source_locator, 'git_blob_sha'),
      '受限素材泄露了路径或 Git blob：' + asset.asset_id
    )
  }
}

const serializedRegister = JSON.stringify(register)
for (const forbiddenField of [
  '"appearance"',
  '"prompt"',
  '"identityReference"',
  '"styleReferences"',
  '"poseCorrectionSource"',
  '"skinCorrectionSource"',
  'digital-employees/references/'
]) {
  assert(
    !serializedRegister.includes(forbiddenField),
    'VIS-G2 登记册不应包含受限来源字段：' + forbiddenField
  )
}

const classCounts = countBy(assets, (asset) => asset.asset_class)
assert(
  classCounts.PERSONA_WEBP_RENDITION === 1428 &&
    classCounts.PERSONA_NATIVE_PORTRAIT === 204 &&
    classCounts.PERSONA_SOURCE_SHEET === 102,
  '人物素材分类统计错误'
)

console.log('PASS VIS-G2 语义登记册结构、来源锚点、主题尺寸与治理边界校验通过')
console.log('  图像：1848；人物：102；精确 Git blob 重复组：0')
console.log('  G0 三类旧 metadata fingerprint 均已显式标记为不可复算，待专门更正；未越过 VIS-G2 进入绑定或发布。')
