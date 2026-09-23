#!/usr/bin/env node
// 校验 VIS-G6 Visual Identity Release 的公开范围、二进制和页面接入。
// 本校验不会下载、重绘或生成图片；只核验已写入 dist 的 WebP 副本和登记册关系。

import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'

const ROOT = process.cwd()
const args = process.argv.slice(2)
const RELEASE_ID = 'VIR-SANBAO-WEB-2026-09-24-R1'
const PACKAGE_PATH = 'assets/visual-identities/vir-sanbao-web-2026-09-24-r1'

const optionalOption = (name, fallback) => {
  const index = args.indexOf(name)
  if (index === -1) return fallback
  if (!args[index + 1]) throw new Error('选项缺少值：' + name)
  return args[index + 1]
}

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

const rootRelativePath = (value) => {
  const absolute = resolve(ROOT, value)
  assert(
    absolute === ROOT || absolute.startsWith(ROOT + sep),
    '路径必须位于项目根目录内：' + value
  )
  return relative(ROOT, absolute).split(sep).join('/')
}

const projectPath = (value) => resolve(ROOT, rootRelativePath(value))
const readJson = (value) => JSON.parse(readFileSync(projectPath(value), 'utf8'))
const sha256 = (value) => createHash('sha256').update(value).digest('hex')
const webpMagicMatches = (bytes) =>
  bytes.length >= 12 &&
  bytes.subarray(0, 4).toString('ascii') === 'RIFF' &&
  bytes.subarray(8, 12).toString('ascii') === 'WEBP'
const releaseAssetId = (roleId, theme, size) =>
  'VRA-' + roleId + '-' + theme.toUpperCase() + '-' + String(size)
const outputFileName = { 64: 'list-64.webp', 128: 'fallback-128.webp', 256: 'detail-256.webp' }

const paths = {
  visG3: rootRelativePath(
    optionalOption(
      '--vis-g3-bindings',
      'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G3-VISUAL-IDENTITY-BINDINGS-2026-09-24.json'
    )
  ),
  visG4: rootRelativePath(
    optionalOption(
      '--vis-g4-dossiers',
      'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G4-DIGITAL-PERSONA-DOSSIERS-2026-09-24.json'
    )
  ),
  visG5: rootRelativePath(
    optionalOption(
      '--vis-g5-quality-register',
      'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G5-STATIC-QUALITY-REGISTER-2026-09-24.json'
    )
  ),
  release: rootRelativePath(
    optionalOption(
      '--release',
      'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G6-VISUAL-IDENTITY-RELEASE-2026-09-24.json'
    )
  ),
  siteData: rootRelativePath(optionalOption('--site-data', 'dist/data/visual-identities.json')),
  packageDirectory: rootRelativePath(
    optionalOption('--package-directory', 'dist/' + PACKAGE_PATH)
  )
}

assert(
  paths.packageDirectory === 'dist/' + PACKAGE_PATH,
  'VIS-G6 只允许验证固定的公开发行目录'
)

const visG3 = readJson(paths.visG3)
const visG4 = readJson(paths.visG4)
const visG5 = readJson(paths.visG5)
const release = readJson(paths.release)
const siteData = readJson(paths.siteData)

assert(
  visG3.gate?.status === 'COMPLETE_BINDING_TABLE_PENDING_VIS_G5' &&
    visG4.gate?.status === 'COMPLETE_DOSSIER_PROJECTION_PENDING_VIS_G5' &&
    visG5.gate?.status ===
      'COMPLETE_STATIC_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK_PENDING_VIS_G6',
  'VIS-G6 输入门状态错误'
)
assert(
  release.schema_version === '1.0' &&
    release.release_id === RELEASE_ID &&
    release.gate?.id === 'VIS-G6' &&
    release.gate?.status ===
      'COMPLETE_LOCAL_VISUAL_IDENTITY_RELEASE_PENDING_GITHUB_PAGES_DEPLOYMENT',
  'VIS-G6 Release 状态或版本不正确'
)
assert(
  release.source_anchor?.repository === 'zjgulai/Sanbao_Web' &&
    release.source_anchor?.commit === '2e676da87999c88fbc70baae9eb5dbf72c2b757e' &&
    release.source_anchor?.tree === '4948f180d4e5a0bc8c599022227c384d525729c5' &&
    release.source_anchor?.canonicalization?.decision_id === 'D-073' &&
    release.source_anchor?.canonicalization?.status === 'ACCEPTED' &&
    release.source_anchor?.canonicalization?.version === 'VIS-G2-CANONICALIZATION-1' &&
    release.source_anchor?.canonicalization?.legacy_g0_fingerprint_status ===
      'RETAINED_HISTORICAL_NOT_VERIFIED',
  'VIS-G6 固定来源锚点或历史 G0 标记错误'
)
assert(
  release.publication?.public_surface === 'GitHub Pages dist static package' &&
    release.publication?.publication_status === 'PENDING_GITHUB_PAGES_DEPLOYMENT' &&
    release.publication?.permitted_material === 'APPROVED_DELIVERY WebP renditions only' &&
    release.publication?.candidate_pool_binary_status === 'NOT_MATERIALIZED_OR_PUBLISHED' &&
    release.publication?.runtime_or_access_impact === 'NONE',
  'VIS-G6 的公开范围或运行边界错误'
)
assert(
  release.coverage_summary?.total_role_visuals === 53 &&
    release.coverage_summary?.management_role_visuals === 3 &&
    release.coverage_summary?.agent_role_visuals === 50 &&
    release.coverage_summary?.public_webp_assets === 318 &&
    release.coverage_summary?.public_native_png_assets === 0 &&
    release.coverage_summary?.public_candidate_assets === 0 &&
    release.coverage_summary?.accepted_owner_visual_risk_bindings === 2,
  'VIS-G6 覆盖统计错误'
)
assert(
  siteData.artifact_kind === 'site_visual_identity_release' &&
    siteData.release_id === RELEASE_ID &&
    siteData.counts?.management === 3 &&
    siteData.counts?.agents === 50 &&
    siteData.counts?.visual_identities === 53 &&
    siteData.counts?.webp_delivery_assets === 318 &&
    siteData.candidate_pool?.status ===
      'RETAINED_IN_GOVERNED_REMOTE_POOL_NOT_INCLUDED_IN_PUBLIC_RELEASE' &&
    siteData.candidate_pool?.role_creation_effect === 'NONE',
  'Site 视觉身份数据的边界或覆盖统计错误'
)

const releasedSerialized = JSON.stringify(release)
const siteSerialized = JSON.stringify(siteData)
for (const forbidden of [
  'source_persona_id',
  'source_persona_name',
  'source_path',
  'source_locator',
  'raw.githubusercontent.com',
  'data:image/',
  'identity_reference',
  'style_references',
  '"prompt"',
  'native_asset',
  '.png'
]) {
  assert(
    !releasedSerialized.includes(forbidden) && !siteSerialized.includes(forbidden),
    'VIS-G6 发布登记册或 Site 数据泄露受限字段：' + forbidden
  )
}
for (const sourceId of ['AGT-056', 'AGT-067', 'AGT-090']) {
  assert(!siteSerialized.includes(sourceId), 'Site 数据泄露管理层上游人物 ID：' + sourceId)
}

const registerInputs = new Map(
  release.input_integrity?.registers?.map((entry) => [entry.kind, entry])
)
assert(registerInputs.size === 4, 'VIS-G6 输入指纹必须完整覆盖 VIS-G2 至 VIS-G5')
for (const [kind, path, register] of [
  ['VIS-G2', 'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G2-SEMANTIC-REGISTER-2026-09-24.json', null],
  ['VIS-G3', paths.visG3, visG3],
  ['VIS-G4', paths.visG4, visG4],
  ['VIS-G5', paths.visG5, visG5]
]) {
  const input = registerInputs.get(kind)
  assert(
    input?.path === path &&
      /^[a-f0-9]{64}$/.test(input?.content_sha256 || '') &&
      input.content_sha256 === sha256(readFileSync(projectPath(path))) &&
      (register == null || input.register_id === register.register_id),
    'VIS-G6 输入摘要漂移：' + kind
  )
}
assert(
  release.input_integrity?.webp_canonicalization?.version ===
    'VIS-G6-PUBLIC-WEBP-CANONICALIZATION-1' &&
    release.input_integrity?.webp_canonicalization?.algorithm === 'SHA-256' &&
    release.input_integrity?.webp_canonicalization?.record_format ===
      'release_asset_id<TAB>role_id<TAB>theme<TAB>rendition<TAB>content_sha256<TAB>bytes<LF>' &&
    /^[a-f0-9]{64}$/.test(
      release.input_integrity?.webp_canonicalization?.canonical_digest_sha256 || ''
    ),
  'VIS-G6 WebP 复算规则错误'
)

const bindingByRoleId = new Map(visG3.bindings.map((binding) => [binding.role_id, binding]))
const dossierByRoleId = new Map(visG4.dossiers.map((dossier) => [dossier.role?.role_id, dossier]))
const qualityByBindingId = new Map(
  visG5.binding_quality_results.map((quality) => [quality.binding_id, quality])
)
const releaseVisualByRoleId = new Map(
  release.released_visuals.map((visual) => [visual.role_id, visual])
)
const siteVisualByRoleId = new Map(siteData.visuals.map((visual) => [visual.role_id, visual]))
const assetByReleaseId = new Map(
  release.released_assets.map((asset) => [asset.release_asset_id, asset])
)

assert(
  bindingByRoleId.size === 53 &&
    dossierByRoleId.size === 53 &&
    qualityByBindingId.size === 53 &&
    releaseVisualByRoleId.size === 53 &&
    siteVisualByRoleId.size === 53 &&
    assetByReleaseId.size === 318,
  'VIS-G6 角色或交付件 ID 不能重复且必须全量覆盖'
)

const expectedManagement = new Map([
  ['MGT-001', { name: '天時', title: '首席执行官 CEO' }],
  ['MGT-002', { name: '地利', title: '首席增长官 CGO' }],
  ['MGT-003', { name: '人和', title: '首席治理官 CGOv' }]
])
const acceptedRiskBindingIds = new Set(['VIB-AGT-029', 'VIB-AGT-041'])
const allowedQuality = new Set([
  'PASS_FOR_VIS_G5_ASSET_QUALITY',
  'PASS_FOR_VIS_G5_ASSET_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK'
])
const renditionConfig = [
  ['list', 64],
  ['fallback', 128],
  ['detail', 256]
]

for (const [roleId, binding] of bindingByRoleId) {
  const dossier = dossierByRoleId.get(roleId)
  const quality = qualityByBindingId.get(binding.binding_id)
  const released = releaseVisualByRoleId.get(roleId)
  const siteVisual = siteVisualByRoleId.get(roleId)
  assert(dossier && quality && released && siteVisual, '角色缺少 VIS-G6 投影：' + roleId)
  assert(
    released.role_kind === binding.role_kind &&
      released.display_name === binding.role_display_name &&
      released.title === binding.role_title &&
      JSON.stringify(siteVisual) === JSON.stringify(released) &&
      quality.role_id === roleId &&
      quality.visual_quality_status &&
      allowedQuality.has(quality.visual_quality_status),
    '角色语义、公开投影或质量状态漂移：' + roleId
  )
  assert(
    released.visual?.release_id === RELEASE_ID &&
      released.visual?.alt_text?.light === quality.accessibility?.light_alt_text &&
      released.visual?.alt_text?.dark === quality.accessibility?.dark_alt_text &&
      quality.accessibility?.status === 'FINAL_NEUTRAL_TEXT_ACCEPTED_VIS_G5' &&
      quality.cross_theme_coherence?.status === 'PASS_THEME_COHERENCE_SIGNAL',
    '角色的 Visual Release、alt text 或主题一致性错误：' + roleId
  )

  const acceptedRisk = acceptedRiskBindingIds.has(binding.binding_id)
  assert(
    acceptedRisk
      ? released.visual.status === 'APPROVED_WITH_ACCEPTED_OWNER_VISUAL_RISK' &&
        quality.visual_quality_status ===
          'PASS_FOR_VIS_G5_ASSET_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK' &&
        quality.owner_risk_decision?.decision_id === 'D-076'
      : released.visual.status === 'APPROVED_FOR_PUBLIC_PRESENTATION' &&
        quality.visual_quality_status === 'PASS_FOR_VIS_G5_ASSET_QUALITY',
    'D-076 风险状态没有被正确保留：' + roleId
  )

  if (binding.role_kind === 'MGT') {
    const expected = expectedManagement.get(roleId)
    assert(expected, '出现未登记的管理层视觉身份：' + roleId)
    assert(
      released.display_name === expected.name &&
        released.title === expected.title &&
        released.presentation?.mission === dossier.role?.mission &&
        released.presentation?.standard_artifact === dossier.role?.standard_artifact &&
        Object.keys(released.presentation).every((key) =>
          ['mission', 'standard_artifact'].includes(key)
        ),
      '管理层只允许展示 G4 公开字段，且繁体名称必须正确：' + roleId
    )
  } else {
    assert(
      /^AGT-(?:00[1-9]|0[1-4][0-9]|050)$/.test(roleId) &&
        roleId === binding.source_persona_id &&
        !Object.prototype.hasOwnProperty.call(released, 'presentation'),
      '执行岗位必须保持 50 个同 ID 视觉绑定且不复制管理层展示字段：' + roleId
    )
  }

  for (const theme of ['light', 'dark']) {
    for (const [rendition, size] of renditionConfig) {
      const assetId = releaseAssetId(roleId, theme, size)
      const asset = assetByReleaseId.get(assetId)
      const expectedPath =
        './' + PACKAGE_PATH + '/' + roleId.toLowerCase() + '/' + theme + '/' + outputFileName[size]
      assert(
        asset?.role_id === roleId &&
          asset.binding_id === binding.binding_id &&
          asset.theme === theme &&
          asset.rendition === rendition &&
          asset.size_px === size &&
          asset.media_type === 'image/webp' &&
          asset.public_path === expectedPath &&
          released.visual?.assets?.[theme]?.[rendition] === expectedPath,
        '发布路径或主题/尺寸映射错误：' + assetId
      )
    }
  }
}

assert(
  Array.isArray(siteData.management) &&
    siteData.management.length === 3 &&
    new Set(siteData.management.map((entry) => entry.role_id)).size === 3 &&
    siteData.management.every((entry) => entry.role_kind === 'MGT'),
  'Site 数据必须单独提供三位管理层展示卡'
)

const expectedRiskDispositions = [...acceptedRiskBindingIds]
  .sort()
  .map((bindingId) => {
    const quality = qualityByBindingId.get(bindingId)
    return {
      binding_id: bindingId,
      role_id: quality.role_id,
      disposition: 'ACCEPTED_OWNER_VISUAL_RISK',
      decision_id: 'D-076',
      monitor: 'Retain the near-duplicate signal and re-review only if the visual asset changes.'
    }
  })
assert(
  JSON.stringify(release.risk_dispositions) === JSON.stringify(expectedRiskDispositions),
  'VIS-G6 必须完整继承 D-076 的两条风险处置'
)

const sortedAssets = release.released_assets
  .slice()
  .sort((left, right) =>
    left.release_asset_id < right.release_asset_id
      ? -1
      : left.release_asset_id > right.release_asset_id
        ? 1
        : 0
  )
const canonical = sortedAssets
  .map((asset) =>
    [
      asset.release_asset_id,
      asset.role_id,
      asset.theme,
      asset.rendition,
      asset.content_sha256,
      asset.bytes
    ].join('\t') + '\n'
  )
  .join('')
assert(
  sha256(canonical) === release.input_integrity.webp_canonicalization.canonical_digest_sha256,
  'VIS-G6 WebP 目录摘要不可复算'
)

const deliveredPaths = new Set()
for (const asset of release.released_assets) {
  assert(
    /^[a-f0-9]{64}$/.test(asset.content_sha256 || '') &&
      Number.isInteger(asset.bytes) &&
      asset.bytes > 0 &&
      asset.public_path.startsWith('./' + PACKAGE_PATH + '/'),
    'WebP 交付登记字段不完整：' + asset.release_asset_id
  )
  const filePath = projectPath('dist/' + asset.public_path.slice(2))
  const bytes = readFileSync(filePath)
  assert(
    webpMagicMatches(bytes) && bytes.length === asset.bytes && sha256(bytes) === asset.content_sha256,
    '公开 WebP 文件与登记册不一致：' + asset.public_path
  )
  deliveredPaths.add(rootRelativePath('dist/' + asset.public_path.slice(2)))
}

const listFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = join(directory, entry.name)
    return entry.isDirectory() ? listFiles(filePath) : [filePath]
  })
const packageFiles = listFiles(projectPath(paths.packageDirectory))
  .filter((filePath) => statSync(filePath).isFile())
  .map((filePath) => rootRelativePath(filePath))
assert(
  packageFiles.length === 318 &&
    packageFiles.every((filePath) => filePath.endsWith('.webp')) &&
    JSON.stringify(packageFiles.slice().sort()) === JSON.stringify([...deliveredPaths].sort()),
  '公开发行目录只能包含已登记的 318 个 WebP 交付件'
)

const indexHtml = readFileSync(projectPath('dist/index.html'), 'utf8')
const appJs = readFileSync(projectPath('dist/app.js'), 'utf8')
const styles = readFileSync(projectPath('dist/styles.css'), 'utf8')
assert(
  indexHtml.includes('href="#visual-identities"') &&
    indexHtml.includes('id="visual-identities"') &&
    indexHtml.includes('id="management-identity-grid"') &&
    indexHtml.includes('data-visual-theme="light"'),
  '首页未提供 VIS-G6 的导航、管理层卡片容器或主题切换入口'
)
assert(
  appJs.includes('loadJson("./data/visual-identities.json")') &&
    appJs.includes('renderVisualIdentities') &&
    appJs.includes('renderPortrait') &&
    appJs.includes('data-portrait-fallback'),
  '前端未接入公开视觉身份数据、头像渲染或同主题后备图'
)
assert(
  styles.includes('.visual-identities-workbench') &&
    styles.includes('.management-identity-grid') &&
    styles.includes('.portrait-frame') &&
    styles.includes('[data-theme="dark"]'),
  '前端未提供视觉身份的布局、头像和深色主题样式'
)
for (const forbidden of ['raw.githubusercontent.com', 'Sanbao_Web']) {
  assert(
    !indexHtml.includes(forbidden) && !appJs.includes(forbidden),
    '公开页面不得热链或嵌入受限来源：' + forbidden
  )
}
const visualSection = indexHtml.slice(
  indexHtml.indexOf('id="visual-identities"'),
  indexHtml.indexOf('id="roles"')
)
assert(
  !visualSection.includes('data:image/') && !appJs.includes('data:image/'),
  '视觉身份页面不得内嵌 Base64 或 data URI 图像'
)

console.log('PASS VIS-G6：53 个角色、318 个本地 WebP 交付件和 Site 页面接入已校验')
console.log('  管理层：天時、地利、人和；执行岗位：50')
console.log('  D-076 已接受风险：VIB-AGT-029、VIB-AGT-041；候选池仍未物化或公开')
console.log('  发行登记册保留部署前状态；GitHub Pages 发布结果须以独立部署证据确认')
