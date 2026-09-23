#!/usr/bin/env node
// 从已通过 VIS-G2 至 VIS-G5 的登记册构建 VIS-G6 Visual Identity Release。
// 本脚本只把 53 条已绑定角色所需的 318 个 WebP 交付件复制到 dist；
// 不物化候选池、PNG 原图、来源图、参考图、提示词或运行时配置。

import { createHash } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'

const ROOT = process.cwd()
const args = process.argv.slice(2)

const RELEASE_ID = 'VIR-SANBAO-WEB-2026-09-24-R1'
const PACKAGE_PATH = 'assets/visual-identities/vir-sanbao-web-2026-09-24-r1'
const DEFAULTS = {
  visG2: 'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G2-SEMANTIC-REGISTER-2026-09-24.json',
  visG3: 'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G3-VISUAL-IDENTITY-BINDINGS-2026-09-24.json',
  visG4: 'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G4-DIGITAL-PERSONA-DOSSIERS-2026-09-24.json',
  visG5: 'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G5-STATIC-QUALITY-REGISTER-2026-09-24.json',
  release: 'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G6-VISUAL-IDENTITY-RELEASE-2026-09-24.json',
  siteData: 'dist/data/visual-identities.json',
  packageDirectory: 'dist/' + PACKAGE_PATH,
  auditDate: '2026-09-24',
  networkWorkers: 8
}

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
const gitBlobSha1 = (value) =>
  createHash('sha1')
    .update(Buffer.concat([Buffer.from('blob ' + value.length + '\0'), value]))
    .digest('hex')
const asJson = (value) => JSON.stringify(value, null, 2) + '\n'
const publicPath = (relativeToDist) => './' + relativeToDist.split(sep).join('/')

const webpMagicMatches = (bytes) =>
  bytes.length >= 12 &&
  bytes.subarray(0, 4).toString('ascii') === 'RIFF' &&
  bytes.subarray(8, 12).toString('ascii') === 'WEBP'

const inputPath = {
  visG2: rootRelativePath(optionalOption('--vis-g2-register', DEFAULTS.visG2)),
  visG3: rootRelativePath(optionalOption('--vis-g3-bindings', DEFAULTS.visG3)),
  visG4: rootRelativePath(optionalOption('--vis-g4-dossiers', DEFAULTS.visG4)),
  visG5: rootRelativePath(optionalOption('--vis-g5-quality-register', DEFAULTS.visG5)),
  release: rootRelativePath(optionalOption('--output', DEFAULTS.release)),
  siteData: rootRelativePath(optionalOption('--site-data', DEFAULTS.siteData)),
  packageDirectory: rootRelativePath(
    optionalOption('--package-directory', DEFAULTS.packageDirectory)
  )
}
const auditDate = optionalOption('--audit-date', DEFAULTS.auditDate)
const networkWorkers = Number(optionalOption('--network-workers', DEFAULTS.networkWorkers))

assert(
  Number.isInteger(networkWorkers) && networkWorkers >= 1 && networkWorkers <= 12,
  '--network-workers 必须是 1 到 12 的整数'
)
assert(
  inputPath.packageDirectory === DEFAULTS.packageDirectory,
  'VIS-G6 只允许写入固定的发行目录：' + DEFAULTS.packageDirectory
)

const visG2 = readJson(inputPath.visG2)
const visG3 = readJson(inputPath.visG3)
const visG4 = readJson(inputPath.visG4)
const visG5 = readJson(inputPath.visG5)

assert(
  visG2.gate?.id === 'VIS-G2' &&
    visG2.gate?.status === 'COMPLETE_STRUCTURAL_SEMANTICS_WITH_G0_FINGERPRINT_EXCEPTION',
  'VIS-G6 需要已接受 G0 历史指纹例外的 VIS-G2 语义登记册'
)
assert(
  visG3.gate?.id === 'VIS-G3' &&
    visG3.gate?.status === 'COMPLETE_BINDING_TABLE_PENDING_VIS_G5',
  'VIS-G6 需要当前 VIS-G3 结构性绑定表'
)
assert(
  visG4.gate?.id === 'VIS-G4' &&
    visG4.gate?.status === 'COMPLETE_DOSSIER_PROJECTION_PENDING_VIS_G5',
  'VIS-G6 需要当前 VIS-G4 Dossier 投影'
)
assert(
  visG5.gate?.id === 'VIS-G5' &&
    visG5.gate?.status ===
      'COMPLETE_STATIC_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK_PENDING_VIS_G6',
  'VIS-G6 需要已完成 D-076 风险接纳的 VIS-G5 静态质量登记册'
)

const sourceAnchor = visG2.source_anchor
assert(
  sourceAnchor?.repository === 'zjgulai/Sanbao_Web' &&
    sourceAnchor.commit === '2e676da87999c88fbc70baae9eb5dbf72c2b757e' &&
    sourceAnchor.tree === '4948f180d4e5a0bc8c599022227c384d525729c5' &&
    visG3.source_anchor?.commit === sourceAnchor.commit &&
    visG3.source_anchor?.tree === sourceAnchor.tree &&
    visG4.visual_source_anchor?.commit === sourceAnchor.commit &&
    visG4.visual_source_anchor?.tree === sourceAnchor.tree &&
    visG5.source_anchor?.commit === sourceAnchor.commit &&
    visG5.source_anchor?.tree === sourceAnchor.tree,
  'VIS-G2 至 VIS-G5 的固定 Sanbao_Web 来源锚点不一致'
)
assert(
  visG3.source_anchor?.canonicalization_acceptance?.decision_id === 'D-073' &&
    visG3.source_anchor?.canonicalization_acceptance?.status === 'ACCEPTED' &&
    visG3.source_anchor?.canonicalization_acceptance?.canonicalization?.version ===
      'VIS-G2-CANONICALIZATION-1' &&
    visG5.source_anchor?.canonicalization_acceptance?.legacy_g0_fingerprints ===
      'RETAINED_HISTORICAL_NOT_VERIFIED',
  'D-073 的可复算目录锚点记录不完整'
)

const bindings = visG3.bindings
const dossiers = visG4.dossiers
const qualityResults = visG5.binding_quality_results
assert(Array.isArray(bindings) && bindings.length === 53, 'VIS-G3 必须包含 53 条绑定')
assert(Array.isArray(dossiers) && dossiers.length === 53, 'VIS-G4 必须包含 53 份 Dossier')
assert(Array.isArray(qualityResults) && qualityResults.length === 53, 'VIS-G5 必须包含 53 条质量结果')

const bindingByRoleId = new Map(bindings.map((binding) => [binding.role_id, binding]))
const dossierByRoleId = new Map(dossiers.map((dossier) => [dossier.role?.role_id, dossier]))
const qualityByBindingId = new Map(
  qualityResults.map((quality) => [quality.binding_id, quality])
)
const semanticAssetById = new Map(
  visG2.asset_semantic_index.map((asset) => [asset.asset_id, asset])
)
const binaryByAssetId = new Map(
  visG5.asset_binary_results.map((asset) => [asset.asset_id, asset])
)

assert(
  bindingByRoleId.size === 53 &&
    dossierByRoleId.size === 53 &&
    qualityByBindingId.size === 53 &&
    binaryByAssetId.size === 424,
  'VIS-G6 输入存在重复角色、绑定或二进制记录'
)

const expectedManagement = new Map([
  ['MGT-001', { name: '天時', title: '首席执行官 CEO' }],
  ['MGT-002', { name: '地利', title: '首席增长官 CGO' }],
  ['MGT-003', { name: '人和', title: '首席治理官 CGOv' }]
])
const allowedQualityStatus = new Set([
  'PASS_FOR_VIS_G5_ASSET_QUALITY',
  'PASS_FOR_VIS_G5_ASSET_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK'
])
const acceptedRiskBindingIds = new Set(['VIB-AGT-029', 'VIB-AGT-041'])
const selectedAssetSlots = [
  ['list_asset_id', 'list', 64],
  ['fallback_asset_id', 'fallback', 128],
  ['primary_asset_id', 'detail', 256]
]

const localFileName = {
  list: 'list-64.webp',
  fallback: 'fallback-128.webp',
  detail: 'detail-256.webp'
}

const releaseAssetRecords = []
const publicVisuals = []
const fetchJobs = []

for (const binding of bindings) {
  const dossier = dossierByRoleId.get(binding.role_id)
  const quality = qualityByBindingId.get(binding.binding_id)
  assert(dossier, 'VIS-G4 缺少绑定角色的 Dossier：' + binding.role_id)
  assert(quality, 'VIS-G5 缺少绑定角色的质量结果：' + binding.binding_id)
  assert(
    dossier.visual_identity?.binding_id === binding.binding_id &&
      quality.role_id === binding.role_id &&
      quality.role_kind === binding.role_kind &&
      quality.role_display_name === binding.role_display_name &&
      quality.binary_status === 'VERIFIED' &&
      allowedQualityStatus.has(quality.visual_quality_status),
    'VIS-G3、VIS-G4、VIS-G5 的角色身份或质量状态不一致：' + binding.binding_id
  )
  assert(
    quality.accessibility?.status === 'FINAL_NEUTRAL_TEXT_ACCEPTED_VIS_G5' &&
      quality.assisted_visual_review?.status &&
      quality.cross_theme_coherence?.status === 'PASS_THEME_COHERENCE_SIGNAL',
    'VIS-G5 缺少可访问性或深浅主题质量证据：' + binding.binding_id
  )

  const hasAcceptedRisk = acceptedRiskBindingIds.has(binding.binding_id)
  assert(
    hasAcceptedRisk
      ? quality.visual_quality_status ===
          'PASS_FOR_VIS_G5_ASSET_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK' &&
        quality.owner_risk_decision?.decision_id === 'D-076'
      : quality.visual_quality_status === 'PASS_FOR_VIS_G5_ASSET_QUALITY' &&
        quality.owner_risk_decision == null,
    'D-076 的风险处置与绑定质量状态不一致：' + binding.binding_id
  )

  if (binding.role_kind === 'MGT') {
    const expected = expectedManagement.get(binding.role_id)
    assert(expected, '出现未注册的管理层角色：' + binding.role_id)
    assert(
      binding.role_display_name === expected.name &&
        binding.role_title === expected.title &&
        dossier.role?.display_name === expected.name &&
        dossier.role?.title === expected.title,
      '三位管理层的繁体名称或职务发生漂移：' + binding.role_id
    )
  } else {
    assert(
      /^AGT-(?:00[1-9]|0[1-4][0-9]|050)$/.test(binding.role_id) &&
        binding.role_id === binding.source_persona_id,
      '执行岗位必须保留 AGT-001 至 AGT-050 的同 ID 绑定：' + binding.role_id
    )
  }

  const byTheme = {}
  for (const theme of ['light', 'dark']) {
    const bindingTheme = binding.presentation?.themes?.[theme]
    assert(bindingTheme, 'VIS-G3 缺少主题绑定：' + binding.binding_id + '/' + theme)
    byTheme[theme] = {}
    for (const [slot, publicSlot, expectedSize] of selectedAssetSlots) {
      const sourceAssetId = bindingTheme[slot]
      const semanticAsset = semanticAssetById.get(sourceAssetId)
      const binary = binaryByAssetId.get(sourceAssetId)
      assert(semanticAsset && binary, 'VIS-G6 缺少已验证的交付件：' + sourceAssetId)
      assert(
        semanticAsset.asset_domain === 'DELIVERY_RENDITIONS' &&
          semanticAsset.asset_class === 'PERSONA_WEBP_RENDITION' &&
          semanticAsset.source_persona_id === binding.source_persona_id &&
          semanticAsset.semantic_attributes?.ui_theme === theme &&
          semanticAsset.semantic_attributes?.format === 'webp' &&
          semanticAsset.semantic_attributes?.declared_rendition_size_px === expectedSize &&
          semanticAsset.governance?.delivery_policy === 'APPROVED_DELIVERY' &&
          semanticAsset.governance?.role_bindability === 'ELIGIBLE_FOR_PERSONA_BINDING' &&
          binary.binary_status === 'VERIFIED' &&
          binary.observed?.mime_type === 'image/webp' &&
          binary.observed?.decoded_format === 'webp' &&
          binary.observed?.content_sha256 &&
          binary.observed?.bytes === semanticAsset.source_locator?.bytes &&
          binary.observed?.git_blob_sha1 === semanticAsset.source_locator?.git_blob_sha,
        'VIS-G6 只允许复制已验收的 WebP 交付件：' + sourceAssetId
      )

      const relativeToPackage = [binding.role_id.toLowerCase(), theme, localFileName[publicSlot]].join('/')
      const relativeToDist = PACKAGE_PATH + '/' + relativeToPackage
      const record = {
        release_asset_id:
          'VRA-' + binding.role_id + '-' + theme.toUpperCase() + '-' + String(expectedSize),
        role_id: binding.role_id,
        binding_id: binding.binding_id,
        theme,
        rendition: publicSlot,
        size_px: expectedSize,
        media_type: 'image/webp',
        public_path: publicPath(relativeToDist),
        content_sha256: binary.observed.content_sha256,
        bytes: binary.observed.bytes
      }
      releaseAssetRecords.push(record)
      byTheme[theme][publicSlot] = record.public_path
      fetchJobs.push({
        record,
        sourcePath: semanticAsset.source_locator.source_path,
        expectedGitBlobSha1: semanticAsset.source_locator.git_blob_sha,
        expectedSha256: binary.observed.content_sha256,
        expectedBytes: binary.observed.bytes,
        writeRelativePath: relativeToPackage
      })
    }
  }

  const publicVisual = {
    role_id: binding.role_id,
    role_kind: binding.role_kind,
    display_name: binding.role_display_name,
    title: binding.role_title,
    visual: {
      release_id: RELEASE_ID,
      status: hasAcceptedRisk
        ? 'APPROVED_WITH_ACCEPTED_OWNER_VISUAL_RISK'
        : 'APPROVED_FOR_PUBLIC_PRESENTATION',
      alt_text: {
        light: quality.accessibility.light_alt_text,
        dark: quality.accessibility.dark_alt_text
      },
      assets: byTheme
    }
  }
  if (binding.role_kind === 'MGT') {
    publicVisual.presentation = {
      mission: dossier.role.mission,
      standard_artifact: dossier.role.standard_artifact
    }
  }
  publicVisuals.push(publicVisual)
}

assert(
  releaseAssetRecords.length === 318 &&
    fetchJobs.length === 318 &&
    new Set(releaseAssetRecords.map((asset) => asset.release_asset_id)).size === 318 &&
    new Set(releaseAssetRecords.map((asset) => asset.public_path)).size === 318,
  'VIS-G6 必须只包含 53 × 2 × 3 = 318 个唯一 WebP 交付件'
)
assert(
  publicVisuals.filter((visual) => visual.role_kind === 'MGT').length === 3 &&
    publicVisuals.filter((visual) => visual.role_kind === 'AGT').length === 50,
  'VIS-G6 的 3+50 展示角色覆盖不完整'
)

const sortedAssets = releaseAssetRecords
  .slice()
  .sort((left, right) => left.release_asset_id.localeCompare(right.release_asset_id, 'en'))
const binaryCanonicalization = sortedAssets
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

const inputIntegrity = [
  ['VIS-G2', inputPath.visG2, visG2.register_id],
  ['VIS-G3', inputPath.visG3, visG3.register_id],
  ['VIS-G4', inputPath.visG4, visG4.register_id],
  ['VIS-G5', inputPath.visG5, visG5.register_id]
].map(([kind, path, registerId]) => ({
  kind,
  register_id: registerId,
  content_sha256: sha256(readFileSync(projectPath(path))),
  path
}))

const riskDispositions = publicVisuals
  .filter((visual) => acceptedRiskBindingIds.has(bindingByRoleId.get(visual.role_id).binding_id))
  .map((visual) => ({
    binding_id: bindingByRoleId.get(visual.role_id).binding_id,
    role_id: visual.role_id,
    disposition: 'ACCEPTED_OWNER_VISUAL_RISK',
    decision_id: 'D-076',
    monitor: 'Retain the near-duplicate signal and re-review only if the visual asset changes.'
  }))

const release = {
  schema_version: '1.0',
  release_id: RELEASE_ID,
  generated_on: auditDate,
  gate: {
    id: 'VIS-G6',
    status: 'COMPLETE_LOCAL_VISUAL_IDENTITY_RELEASE_PENDING_GITHUB_PAGES_DEPLOYMENT',
    scope: [
      '53 approved role visual identities: 3 management identities and 50 AGT identities',
      '318 fixed-commit, quality-verified WebP delivery renditions copied into the static dist package',
      'local Site data projection using the G4 public-field allowlist for management identities',
      'local release verification for public scope, asset integrity, risk traceability, and static page wiring'
    ],
    excluded: [
      'candidate-pool binary materialization or publication',
      'native PNG, source, reference, design-input, overview, prompt, or identity-reference publication',
      'role-contract, Soul, Playbook, Preset, Access, Role Release Bundle, DSH, Case, or production-state change',
      'GitHub Pages deployment evidence; deployment remains a separately observed release surface'
    ]
  },
  source_anchor: {
    repository: sourceAnchor.repository,
    commit: sourceAnchor.commit,
    tree: sourceAnchor.tree,
    canonicalization: {
      decision_id: 'D-073',
      status: 'ACCEPTED',
      version: 'VIS-G2-CANONICALIZATION-1',
      legacy_g0_fingerprint_status: 'RETAINED_HISTORICAL_NOT_VERIFIED'
    }
  },
  decision_references: ['D-068', 'D-069', 'D-071', 'D-073', 'D-074', 'D-075', 'D-076', 'D-077'],
  input_integrity: {
    registers: inputIntegrity,
    webp_canonicalization: {
      version: 'VIS-G6-PUBLIC-WEBP-CANONICALIZATION-1',
      algorithm: 'SHA-256',
      record_format:
        'release_asset_id<TAB>role_id<TAB>theme<TAB>rendition<TAB>content_sha256<TAB>bytes<LF>',
      canonical_digest_sha256: sha256(binaryCanonicalization)
    }
  },
  publication: {
    public_surface: 'GitHub Pages dist static package',
    publication_status: 'PENDING_GITHUB_PAGES_DEPLOYMENT',
    permitted_material: 'APPROVED_DELIVERY WebP renditions only',
    candidate_pool_binary_status: 'NOT_MATERIALIZED_OR_PUBLISHED',
    runtime_or_access_impact: 'NONE'
  },
  coverage_summary: {
    total_role_visuals: 53,
    management_role_visuals: 3,
    agent_role_visuals: 50,
    public_webp_assets: 318,
    public_native_png_assets: 0,
    public_candidate_assets: 0,
    accepted_owner_visual_risk_bindings: riskDispositions.length
  },
  risk_dispositions: riskDispositions,
  released_visuals: publicVisuals,
  released_assets: sortedAssets,
  boundary_assertions: {
    role_contract_impact: 'NONE',
    runtime_or_access_impact: 'NONE',
    dsh_operation: 'NONE',
    candidate_pool_reassignment: 'NONE',
    source_or_reference_material_in_public_delivery: 'NONE'
  }
}

const siteData = {
  artifact_kind: 'site_visual_identity_release',
  version: '1.0.0',
  release_id: RELEASE_ID,
  generated_on: auditDate,
  public_presentation_scope:
    'Approved visual presentation only. It does not instantiate a role, grant access, or change a runtime state.',
  counts: {
    management: 3,
    agents: 50,
    visual_identities: 53,
    webp_delivery_assets: 318
  },
  candidate_pool: {
    status: 'RETAINED_IN_GOVERNED_REMOTE_POOL_NOT_INCLUDED_IN_PUBLIC_RELEASE',
    role_creation_effect: 'NONE'
  },
  management: publicVisuals.filter((visual) => visual.role_kind === 'MGT'),
  visuals: publicVisuals
}

const serializedRelease = JSON.stringify(release)
const serializedSiteData = JSON.stringify(siteData)
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
    !serializedRelease.includes(forbidden) && !serializedSiteData.includes(forbidden),
    'VIS-G6 输出不得包含受限来源字段或非 WebP 交付物：' + forbidden
  )
}
for (const sourceId of ['AGT-056', 'AGT-067', 'AGT-090']) {
  assert(
    !serializedSiteData.includes(sourceId),
    '公开 Site 数据不得暴露管理层的上游人物 ID：' + sourceId
  )
}

const packageDirectory = projectPath(inputPath.packageDirectory)
const packageParent = dirname(packageDirectory)
assert(!existsSync(packageDirectory), '发行目录已存在，拒绝覆盖：' + inputPath.packageDirectory)
mkdirSync(packageParent, { recursive: true })
const stageDirectory = mkdtempSync(join(packageParent, '.vis-g6-stage-'))
const rawBaseUrl =
  'https://raw.githubusercontent.com/' + sourceAnchor.repository + '/' + sourceAnchor.commit + '/'

const fetchWithRetry = async (sourcePath) => {
  let lastError
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(rawBaseUrl + sourcePath, {
        headers: { 'user-agent': 'AI-Organization-VIS-G6-Release/1.0' }
      })
      if (!response.ok) throw new Error('HTTP ' + response.status)
      return Buffer.from(await response.arrayBuffer())
    } catch (error) {
      lastError = error
      if (attempt < 3) await new Promise((resolveRetry) => setTimeout(resolveRetry, attempt * 300))
    }
  }
  throw new Error('固定提交交付件读取失败：' + sourcePath + '; ' + String(lastError))
}

const mapLimit = async (items, limit, mapper) => {
  const results = new Array(items.length)
  let cursor = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await mapper(items[index])
    }
  })
  await Promise.all(workers)
  return results
}

const writeAtomic = (relativePath, value) => {
  const destination = projectPath(relativePath)
  mkdirSync(dirname(destination), { recursive: true })
  const temporary = destination + '.vis-g6-tmp-' + process.pid
  writeFileSync(temporary, value)
  renameSync(temporary, destination)
}

try {
  await mapLimit(fetchJobs, networkWorkers, async (job) => {
    const bytes = await fetchWithRetry(job.sourcePath)
    assert(webpMagicMatches(bytes), '下载文件不是 WebP：' + job.record.release_asset_id)
    assert(
      bytes.length === job.expectedBytes &&
        sha256(bytes) === job.expectedSha256 &&
        gitBlobSha1(bytes) === job.expectedGitBlobSha1,
      '下载交付件与 VIS-G5 固定二进制不一致：' + job.record.release_asset_id
    )
    const destination = join(stageDirectory, job.writeRelativePath)
    mkdirSync(dirname(destination), { recursive: true })
    writeFileSync(destination, bytes)
  })

  renameSync(stageDirectory, packageDirectory)
  writeAtomic(inputPath.release, asJson(release))
  writeAtomic(inputPath.siteData, asJson(siteData))
} catch (error) {
  if (existsSync(stageDirectory)) rmSync(stageDirectory, { recursive: true, force: true })
  throw error
}

console.log('OK VIS-G6 Visual Identity Release 已构建')
console.log('  release:', inputPath.release)
console.log('  site data:', inputPath.siteData)
console.log('  package:', inputPath.packageDirectory)
console.log('  角色：53（管理层 3；执行岗位 50）')
console.log('  WebP：318；候选池、PNG 与来源/参考素材：0')
