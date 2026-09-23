#!/usr/bin/env node
// 校验 VIS-G5 静态质量登记册。
// 本校验只读取登记册及其 VIS-G2/VIS-G3 输入；不下载、复制或输出任何图像二进制。

import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { relative, resolve, sep } from 'node:path'

const ROOT = process.cwd()
const args = process.argv.slice(2)

const optionalOption = (name, fallback) => {
  const index = args.indexOf(name)
  return index === -1 ? fallback : args[index + 1]
}

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

const rootRelativePath = (value) => {
  const absolutePath = resolve(ROOT, value)
  assert(
    absolutePath === ROOT || absolutePath.startsWith(ROOT + sep),
    '路径必须位于项目根目录内：' + value
  )
  return relative(ROOT, absolutePath).split(sep).join('/')
}

const absoluteProjectPath = (value) => resolve(ROOT, rootRelativePath(value))
const readJson = (value) => JSON.parse(readFileSync(absoluteProjectPath(value), 'utf8'))
const digest = (value) => createHash('sha256').update(value).digest('hex')
const isSha256 = (value) => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value)
const isGitBlobSha = (value) => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value)
const pairKey = (left, right) => [left, right].sort().join('|')

const qualityRegisterPath = rootRelativePath(
  optionalOption(
    '--quality-register',
    'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G5-STATIC-QUALITY-REGISTER-2026-09-24.json'
  )
)
const visG2Path = rootRelativePath(
  optionalOption(
    '--vis-g2-register',
    'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G2-SEMANTIC-REGISTER-2026-09-24.json'
  )
)
const visG3Path = rootRelativePath(
  optionalOption(
    '--vis-g3-bindings',
    'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G3-VISUAL-IDENTITY-BINDINGS-2026-09-24.json'
  )
)

const register = readJson(qualityRegisterPath)
const visG2 = readJson(visG2Path)
const visG3 = readJson(visG3Path)
const acceptedRiskBindingIds = new Set(['VIB-AGT-029', 'VIB-AGT-041'])
const expectedMonitorPairs = new Set([
  pairKey('AGT-027', 'AGT-030'),
  pairKey('AGT-011', 'AGT-032'),
  pairKey('AGT-016', 'AGT-046')
])
const expectedManagementBindings = {
  'VIB-MGT-001': { roleId: 'MGT-001', roleDisplayName: '天時', sourcePersonaId: 'AGT-067' },
  'VIB-MGT-002': { roleId: 'MGT-002', roleDisplayName: '地利', sourcePersonaId: 'AGT-090' },
  'VIB-MGT-003': { roleId: 'MGT-003', roleDisplayName: '人和', sourcePersonaId: 'AGT-056' }
}

assert(register.schema_version === '1.0', 'VIS-G5 schema_version 不正确')
assert(
  register.register_id === 'VIS-G5-SANBAO-WEB-STATIC-QUALITY-2026-09-24',
  'VIS-G5 register_id 不正确'
)
assert(
  register.gate?.id === 'VIS-G5' &&
    register.gate?.status ===
      'COMPLETE_STATIC_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK_PENDING_VIS_G6',
  'VIS-G5 必须保留两条已接受的视觉近似风险，且不得误报为已发行'
)
assert(
  Array.isArray(register.gate?.excluded) &&
    register.gate.excluded.includes('persistent source-image copy into the project or dist') &&
    register.gate.excluded.includes('Visual Identity Release creation') &&
    register.gate.excluded.includes(
      'page integration, publication, DSH import, runtime, access, Case, or role-contract changes'
    ),
  'VIS-G5 的非写入、非发布边界不完整'
)

assert(
  visG2.gate?.id === 'VIS-G2' &&
    visG2.gate?.status === 'COMPLETE_STRUCTURAL_SEMANTICS_WITH_G0_FINGERPRINT_EXCEPTION' &&
    visG3.gate?.id === 'VIS-G3' &&
    visG3.gate?.status === 'COMPLETE_BINDING_TABLE_PENDING_VIS_G5',
  'VIS-G5 输入必须是接受状态的 VIS-G2 与待验收的 VIS-G3'
)
assert(
  register.source_anchor?.repository === visG2.source_anchor?.repository &&
    register.source_anchor?.commit === visG2.source_anchor?.commit &&
    register.source_anchor?.tree === visG2.source_anchor?.tree &&
    register.source_anchor?.commit === visG3.source_anchor?.commit &&
    register.source_anchor?.tree === visG3.source_anchor?.tree &&
    register.source_anchor?.vis_g2_register_id === visG2.register_id &&
    register.source_anchor?.vis_g3_register_id === visG3.register_id &&
    register.source_anchor?.canonicalization_acceptance?.decision_id === 'D-073' &&
    register.source_anchor?.canonicalization_acceptance?.status === 'ACCEPTED' &&
    register.source_anchor?.canonicalization_acceptance?.canonicalization_version ===
      'VIS-G2-CANONICALIZATION-1' &&
    register.source_anchor?.canonicalization_acceptance?.legacy_g0_fingerprints ===
      'RETAINED_HISTORICAL_NOT_VERIFIED',
  'VIS-G5 没有持续使用 D-073 接受的 VIS-G2 来源锚点'
)

const inputFilesByKind = new Map(register.input_integrity?.input_files?.map((entry) => [entry.kind, entry]))
assert(inputFilesByKind.size === 2, 'VIS-G5 输入指纹必须恰好覆盖 VIS-G2 与 VIS-G3')
assert(
  inputFilesByKind.get('VIS-G2')?.sha256 === digest(readFileSync(absoluteProjectPath(visG2Path))) &&
    inputFilesByKind.get('VIS-G3')?.sha256 === digest(readFileSync(absoluteProjectPath(visG3Path))),
  'VIS-G5 输入文件哈希已经漂移'
)
assert(
  register.input_integrity?.binary_canonicalization?.version ===
    'VIS-G5-BINARY-CANONICALIZATION-1' &&
    register.input_integrity?.binary_canonicalization?.algorithm === 'SHA-256' &&
    register.input_integrity?.binary_canonicalization?.record_format ===
      'asset_id<TAB>content_sha256<TAB>git_blob_sha1<TAB>bytes<TAB>mime<TAB>widthxheight<LF>' &&
    isSha256(register.input_integrity?.binary_canonicalization?.canonical_digest_sha256),
  'VIS-G5 二进制可复算规则不完整'
)
assert(
  register.audit_method?.binary_read_strategy === 'FIXED_COMMIT_RAW_CONTENT_TRANSIENT_MEMORY_READ' &&
    register.audit_method?.source_image_persistence === 'NONE',
  'VIS-G5 不得声称持久化来源图像'
)

const serializedRegister = JSON.stringify(register)
for (const forbiddenValue of [
  '"source_path"',
  '"source_locator"',
  '"raw_url"',
  '"style_references"',
  '"identity_reference"',
  'data:image/',
  'raw.githubusercontent.com'
]) {
  assert(!serializedRegister.includes(forbiddenValue), 'VIS-G5 登记册泄露了受限字段：' + forbiddenValue)
}

const sourceAssetById = new Map(visG2.asset_semantic_index.map((asset) => [asset.asset_id, asset]))
const expectedAssetById = new Map()
for (const binding of visG3.bindings) {
  for (const theme of ['dark', 'light']) {
    const themeAssets = binding.presentation?.themes?.[theme]
    assert(themeAssets, 'VIS-G3 缺少主题绑定：' + binding.binding_id + '/' + theme)
    for (const [slot, rendition] of [
      ['list_asset_id', '64'],
      ['fallback_asset_id', '128'],
      ['primary_asset_id', '256'],
      ['quality_trace_native_asset_id', 'native']
    ]) {
      const asset = sourceAssetById.get(themeAssets[slot])
      assert(asset, 'VIS-G3 引用了不存在的 VIS-G2 素材：' + themeAssets[slot])
      assert(
        asset.asset_domain === 'DELIVERY_RENDITIONS' &&
          asset.source_persona_id === binding.source_persona_id &&
          asset.semantic_attributes?.ui_theme === theme &&
          asset.governance?.delivery_policy === 'APPROVED_DELIVERY' &&
          asset.governance?.role_bindability === 'ELIGIBLE_FOR_PERSONA_BINDING',
        'VIS-G3 绑定素材不符合已批准交付范围：' + themeAssets[slot]
      )
      assert(
        rendition === 'native'
          ? asset.asset_class === 'PERSONA_NATIVE_PORTRAIT' && asset.semantic_attributes?.format === 'png'
          : asset.asset_class === 'PERSONA_WEBP_RENDITION' &&
            asset.semantic_attributes?.format === 'webp' &&
            asset.semantic_attributes?.declared_rendition_size_px === Number(rendition),
        'VIS-G3 素材规格错误：' + themeAssets[slot]
      )
      expectedAssetById.set(asset.asset_id, asset)
    }
    assert(
      themeAssets.primary_asset_id === themeAssets.detail_asset_id,
      'VIS-G3 主图与详情图必须仍使用同一 256px 素材：' + binding.binding_id + '/' + theme
    )
  }
}
assert(expectedAssetById.size === 424, 'VIS-G3 应展开为 424 个唯一交付二进制')

const assetResults = register.asset_binary_results
assert(Array.isArray(assetResults) && assetResults.length === 424, 'VIS-G5 二进制结果必须覆盖 424 项')
const actualAssetById = new Map(assetResults.map((result) => [result.asset_id, result]))
assert(actualAssetById.size === 424, 'VIS-G5 二进制结果 asset_id 不能重复')
assert(
  JSON.stringify([...actualAssetById.keys()].sort()) === JSON.stringify([...expectedAssetById.keys()].sort()),
  'VIS-G5 二进制结果与 VIS-G3 绑定交付件集合不一致'
)

const observedSha256s = new Set()
for (const [assetId, expectedAsset] of expectedAssetById) {
  const result = actualAssetById.get(assetId)
  const attributes = expectedAsset.semantic_attributes
  const locator = expectedAsset.source_locator
  const expectedMime = attributes.format === 'png' ? 'image/png' : 'image/webp'
  const expectedRendition =
    expectedAsset.asset_class === 'PERSONA_NATIVE_PORTRAIT'
      ? 'native'
      : String(attributes.declared_rendition_size_px)
  assert(
    result?.source_persona_id === expectedAsset.source_persona_id &&
      result?.theme === attributes.ui_theme &&
      result?.rendition === expectedRendition,
    'VIS-G5 二进制结果角色、主题或尺寸身份错误：' + assetId
  )
  assert(
    result?.expected?.git_blob_sha1 === locator.git_blob_sha &&
      result?.expected?.bytes === locator.bytes &&
      result?.expected?.mime_type === expectedMime &&
      JSON.stringify(result?.expected?.dimensions_px) ===
        JSON.stringify([attributes.dimensions_px.width, attributes.dimensions_px.height]),
    'VIS-G5 二进制预期值没有来自 VIS-G2 固定树：' + assetId
  )
  assert(
    result?.observed?.git_blob_sha1 === locator.git_blob_sha &&
      result?.observed?.bytes === locator.bytes &&
      result?.observed?.mime_type === expectedMime &&
      result?.observed?.decoded_format === attributes.format &&
      JSON.stringify(result?.observed?.dimensions_px) ===
        JSON.stringify([attributes.dimensions_px.width, attributes.dimensions_px.height]) &&
      isSha256(result?.observed?.content_sha256) &&
      isGitBlobSha(result?.observed?.git_blob_sha1),
    'VIS-G5 实际二进制观察值不匹配固定提交：' + assetId
  )
  assert(
    result?.binary_status === 'VERIFIED' &&
      Object.values(result?.binary_checks ?? {}).length === 5 &&
      Object.values(result.binary_checks).every((value) => value === true),
    'VIS-G5 二进制检查未全部通过：' + assetId
  )
  assert(
    result?.static_visual_signal?.algorithm === 'dhash-9x8-and-center-luminance-v1' &&
      /^[a-f0-9]{16}$/.test(result.static_visual_signal.full_dhash_64) &&
      /^[a-f0-9]{16}$/.test(result.static_visual_signal.center_dhash_64) &&
      typeof result.static_visual_signal.edge_energy_64px === 'number',
    'VIS-G5 静态视觉信号不完整：' + assetId
  )
  assert(!observedSha256s.has(result.observed.content_sha256), 'VIS-G5 出现精确重复二进制：' + assetId)
  observedSha256s.add(result.observed.content_sha256)
}

const canonicalBinaryInput = assetResults
  .slice()
  .sort((left, right) => left.asset_id.localeCompare(right.asset_id))
  .map((result) => {
    const dimensions = result.observed.dimensions_px
    return [
      result.asset_id,
      result.observed.content_sha256,
      result.observed.git_blob_sha1,
      result.observed.bytes,
      result.observed.mime_type,
      `${dimensions[0]}x${dimensions[1]}`
    ].join('\t')
  })
  .join('\n') + '\n'
assert(
  digest(canonicalBinaryInput) === register.input_integrity.binary_canonicalization.canonical_digest_sha256,
  'VIS-G5 424 项实际二进制指纹不可复算'
)
assert(
  register.coverage_summary?.bindings === 53 &&
    register.coverage_summary?.source_personas === 53 &&
    register.coverage_summary?.unique_binary_assets === 424 &&
    register.coverage_summary?.unique_native_png === 106 &&
    register.coverage_summary?.unique_webp_renditions === 318 &&
    register.coverage_summary?.binary_verified === 424 &&
    register.coverage_summary?.binary_sha256_exact_duplicate_groups === 0 &&
    register.coverage_summary?.perceptual_duplicate_candidates === 13,
  'VIS-G5 覆盖或二进制统计不正确'
)

const visG3BindingById = new Map(visG3.bindings.map((binding) => [binding.binding_id, binding]))
const qualityByBindingId = new Map(register.binding_quality_results?.map((result) => [result.binding_id, result]))
assert(qualityByBindingId.size === 53, 'VIS-G5 质量结果必须恰好覆盖 53 条唯一绑定')
assert(
  JSON.stringify([...qualityByBindingId.keys()].sort()) === JSON.stringify([...visG3BindingById.keys()].sort()),
  'VIS-G5 质量结果与 VIS-G3 角色绑定集合不一致'
)

for (const [bindingId, binding] of visG3BindingById) {
  const result = qualityByBindingId.get(bindingId)
  const acceptedRisk = acceptedRiskBindingIds.has(bindingId)
  assert(
    result?.role_id === binding.role_id &&
      result?.role_kind === binding.role_kind &&
      result?.role_display_name === binding.role_display_name &&
      result?.source_persona_id === binding.source_persona_id &&
      result?.binary_status === 'VERIFIED',
    'VIS-G5 质量结果的角色语义或来源人物发生漂移：' + bindingId
  )
  assert(
    result?.visual_quality_status ===
      (acceptedRisk
        ? 'PASS_FOR_VIS_G5_ASSET_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK'
        : 'PASS_FOR_VIS_G5_ASSET_QUALITY') &&
      result?.owner_decision_reason ===
        (acceptedRisk ? 'OWNER_ACCEPTED_PERCEPTUAL_NEAR_DUPLICATE_RISK_D-076' : null) &&
      JSON.stringify(result?.owner_risk_decision) ===
        JSON.stringify(
          acceptedRisk
            ? {
                status: 'ACCEPTED',
                decision_id: 'D-076',
                scope:
                  'Perceptual near-duplicate display risk accepted; no automatic remap, release, or page operation.'
              }
            : null
        ),
    'VIS-G5 视觉质量处置错误：' + bindingId
  )
  for (const theme of ['dark', 'light']) {
    const expectedTheme = binding.presentation.themes[theme]
    const actualTheme = result?.themes?.[theme]
    assert(
      actualTheme?.native_asset_id === expectedTheme.quality_trace_native_asset_id,
      'VIS-G5 原生追溯资产错误：' + bindingId + '/' + theme
    )
    for (const rendition of ['64', '128', '256']) {
      const expectedAssetId = expectedTheme[
        rendition === '64' ? 'list_asset_id' : rendition === '128' ? 'fallback_asset_id' : 'primary_asset_id'
      ]
      const quality = actualTheme?.rendition_quality?.[rendition]
      assert(
        quality?.asset_id === expectedAssetId &&
          quality?.comparison_algorithm === 'native-lanczos-rgb-psnr-and-dhash-v1' &&
          quality?.status === 'PASS_NATIVE_RENDITION_COHERENCE' &&
          typeof quality?.psnr_db === 'number' &&
          quality.psnr_db >= 30 &&
          Number.isInteger(quality?.dhash_hamming_distance) &&
          quality.dhash_hamming_distance <= 12,
        'VIS-G5 原生到 WebP 的质量结果不合格：' + bindingId + '/' + theme + '/' + rendition
      )
    }
  }
  assert(
    result?.cross_theme_coherence?.algorithm ===
      'center-crop-luminance-correlation-and-dhash-v1' &&
      result.cross_theme_coherence.status === 'PASS_THEME_COHERENCE_SIGNAL' &&
      typeof result.cross_theme_coherence.center_luminance_correlation === 'number' &&
      result.cross_theme_coherence.center_luminance_correlation >= 0.35 &&
      Number.isInteger(result.cross_theme_coherence.center_dhash_hamming_distance) &&
      result.cross_theme_coherence.center_dhash_hamming_distance <= 24,
    'VIS-G5 深浅主题一致性结果不合格：' + bindingId
  )
  assert(
    result?.accessibility?.dark_alt_text === binding.presentation.alt_text.dark &&
      result?.accessibility?.light_alt_text === binding.presentation.alt_text.light &&
      result?.accessibility?.status === 'FINAL_NEUTRAL_TEXT_ACCEPTED_VIS_G5' &&
      result.accessibility.policy ===
        'Neutral role-and-theme description; no appearance, prompt, source, or identity-reference detail.',
    'VIS-G5 中性 alt text 未正确固定：' + bindingId
  )
  assert(
    result?.assisted_visual_review?.status ===
      (acceptedRisk
        ? 'ACCEPTED_OWNER_VISUAL_RISK_DECISION'
        : 'ACCEPTED_ASSISTED_VISUAL_REVIEW') &&
      typeof result.assisted_visual_review.reviewer === 'string' &&
      result.assisted_visual_review.reviewer.length > 0,
    'VIS-G5 辅助视觉复核状态错误：' + bindingId
  )
  assert(
    result?.visual_identity_release?.status === 'NOT_CREATED_PENDING_VIS_G6' &&
      result?.presentation_projection?.status === 'NOT_RENDERABLE_PENDING_VIS_G6',
    'VIS-G5 不得提前创建视觉发布或展示投影：' + bindingId
  )
}

for (const [bindingId, expected] of Object.entries(expectedManagementBindings)) {
  const result = qualityByBindingId.get(bindingId)
  assert(
    result?.role_id === expected.roleId &&
      result?.role_display_name === expected.roleDisplayName &&
      result?.source_persona_id === expected.sourcePersonaId &&
      !result.accessibility.dark_alt_text.includes(expected.sourcePersonaId) &&
      !result.accessibility.light_alt_text.includes(expected.sourcePersonaId),
    '三个管理分身的繁体显示名或角色语义映射错误：' + bindingId
  )
}

const duplicateAnalysis = register.perceptual_duplicate_analysis
assert(
  duplicateAnalysis?.algorithm === 'dark-native-center-dhash-and-luminance-correlation-v1' &&
    duplicateAnalysis?.candidates?.length === 13 &&
    duplicateAnalysis?.boundary ===
      'A perceptual candidate is not an identity conclusion and cannot create or remap a role.',
  'VIS-G5 感知重复分析边界不完整'
)
for (const candidate of duplicateAnalysis.candidates) {
  const containsAcceptedRiskBinding =
    acceptedRiskBindingIds.has(candidate.left_binding_id) ||
    acceptedRiskBindingIds.has(candidate.right_binding_id)
  assert(
    candidate.status ===
      (containsAcceptedRiskBinding
        ? 'ACCEPTED_OWNER_VISUAL_RISK_DECISION'
        : 'DISTINCT_PERSONA_CONFIRMED_BY_ASSISTED_VISUAL_REVIEW'),
    'VIS-G5 自动候选未按人工复核结果处置：' + candidate.left_binding_id + '/' + candidate.right_binding_id
  )
}
const highRiskCandidate = duplicateAnalysis.candidates.find(
  (candidate) => pairKey(candidate.left_source_persona_id, candidate.right_source_persona_id) === pairKey('AGT-029', 'AGT-041')
)
assert(
  highRiskCandidate?.left_binding_id === 'VIB-AGT-029' &&
    highRiskCandidate?.right_binding_id === 'VIB-AGT-041' &&
    highRiskCandidate?.status === 'ACCEPTED_OWNER_VISUAL_RISK_DECISION',
  'AGT-029/AGT-041 的近似视觉风险必须由 D-076 显式接受，而非自动放行'
)
const actualMonitorPairs = new Set(
  duplicateAnalysis.manual_monitor_pairs?.map((pair) => pairKey(pair.left_source_persona_id, pair.right_source_persona_id))
)
assert(
  actualMonitorPairs.size === expectedMonitorPairs.size &&
    [...expectedMonitorPairs].every((pair) => actualMonitorPairs.has(pair)) &&
    duplicateAnalysis.manual_monitor_pairs.every(
      (pair) => pair.status === 'MONITOR_ONLY_AFTER_ASSISTED_VISUAL_REVIEW'
    ),
  'VIS-G5 的三条非阻断监测对不完整'
)
assert(
  register.assisted_visual_review?.status === 'COMPLETED_WITH_ACCEPTED_OWNER_RISK' &&
    typeof register.assisted_visual_review.reviewer === 'string' &&
    register.assisted_visual_review.reviewer.length > 0 &&
    JSON.stringify(register.assisted_visual_review.owner_hold_binding_ids) === JSON.stringify([]) &&
    JSON.stringify(register.assisted_visual_review.owner_accepted_risk_binding_ids) ===
      JSON.stringify([...acceptedRiskBindingIds].sort()) &&
    register.assisted_visual_review.owner_risk_decision_id === 'D-076' &&
    register.assisted_visual_review.contact_sheet_summary === null,
  'VIS-G5 应记录完整人工复核及两条所有者已接受风险，且不得持久化临时联系表'
)
assert(
  register.candidate_material_pool?.status === 'CATALOGED_REMOTE_PINNED_NOT_MATERIALIZED' &&
    register.candidate_material_pool?.source_register === visG2.register_id &&
    register.candidate_material_pool?.boundary.includes('POOL_ONLY materials are not copied into this repository'),
  'VIS-G5 候选素材池的远端目录与非物化边界错误'
)
assert(
  register.next_gate?.id === 'VIS-G6' &&
    register.next_gate?.status === 'NOT_STARTED_REQUIRES_SEPARATE_AUTHORIZATION' &&
    register.next_gate?.preconditions?.includes(
      'record and preserve every accepted owner visual-risk decision without auto-remapping'
    ),
  'VIS-G6 不得因接受风险决定而自动启动，仍须单独授权'
)

console.log('PASS VIS-G5 的 424 个实际二进制、53 条质量结果、alt text 和 D-076 两条已接受视觉风险已校验')
console.log('  53 条可进入未来 Visual Identity Release 审查；VIB-AGT-029/041 保留已接受风险记录；VIS-G6 仍未启动。')
