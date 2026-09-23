// 从固定 Sanbao_Web Git tree、上游 avatar manifest 与本项目既有 VIS-G0/VIS-G1 登记重建 VIS-G2 语义登记册。
// 用法：
// node scripts/build-sanbao-vis-g2.mjs --manifest /path/avatar-manifest.json --tree /path/tree.json --output docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G2-SEMANTIC-REGISTER-2026-09-24.json
// 边界：只读取元数据并生成登记册；不下载、复制、编辑或发布任何图片二进制。

import { readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { extname, resolve } from 'node:path'

const ROOT = process.cwd()
const args = process.argv.slice(2)

const requiredOption = (name) => {
  const index = args.indexOf(name)
  if (index === -1 || !args[index + 1]) {
    throw new Error('缺少必填参数：' + name)
  }
  return args[index + 1]
}

const optionalOption = (name, fallback) => {
  const index = args.indexOf(name)
  return index === -1 ? fallback : args[index + 1]
}

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))
const sha256 = (value) => createHash('sha256').update(value).digest('hex')
const gitBlobSha1 = (value) =>
  createHash('sha1')
    .update('blob ' + Buffer.byteLength(value) + String.fromCharCode(0))
    .update(value)
    .digest('hex')

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

const manifestPath = resolve(ROOT, requiredOption('--manifest'))
const treePath = resolve(ROOT, requiredOption('--tree'))
const outputPath = resolve(ROOT, requiredOption('--output'))
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
const roleCatalogPath = resolve(
  ROOT,
  optionalOption('--role-catalog', 'docs/05-agents/role-catalog.json')
)

const manifestContent = readFileSync(manifestPath)
const manifest = JSON.parse(manifestContent.toString('utf8'))
const treeResponse = readJson(treePath)
const sourceSnapshot = readJson(sourceSnapshotPath)
const visG1 = readJson(visG1Path)
const roleCatalog = readJson(roleCatalogPath)

const imageExtensions = new Set(['.png', '.webp', '.jpg', '.jpeg', '.svg', '.ico'])
const tree = treeResponse.tree
assert(Array.isArray(tree), 'Git tree 响应缺少 tree 数组')
assert(treeResponse.truncated === false, '固定 Git tree 响应被截断，不能用于 VIS-G2')

const imageItems = tree
  .filter(
    (item) =>
      item.type === 'blob' && imageExtensions.has(extname(item.path).toLowerCase())
  )
  .sort((left, right) => left.path.localeCompare(right.path, 'en'))

const allBlobItems = tree.filter((item) => item.type === 'blob')
const digitalEmployeeImageItems = imageItems.filter((item) =>
  item.path.startsWith('digital-employees/')
)

const imageByPath = new Map(imageItems.map((item) => [item.path, item]))
assert(imageByPath.size === imageItems.length, '固定 tree 出现重复图像路径')

const g1DomainById = new Map(
  visG1.asset_domains.map((domain) => [domain.domain_id, domain])
)

const domainSpecs = {
  DELIVERY_RENDITIONS: {
    asset_class: 'PERSONA_WEBP_OR_NATIVE_RENDITION',
    subject_scope: 'SINGLE_NAMED_PERSONA',
    subject_annotation_basis: 'PINNED_MANIFEST',
    role_bindability: 'ELIGIBLE_FOR_PERSONA_BINDING',
    visual_style_context: 'SANBAO_COLLECTION_06_PERSONA_RENDITION',
    structural_display_suitability:
      'RENDER_CANDIDATE_PENDING_BINARY_VISUAL_REVIEW'
  },
  SOURCE_SHEETS: {
    asset_class: 'PERSONA_SOURCE_SHEET',
    subject_scope: 'SINGLE_NAMED_PERSONA',
    subject_annotation_basis: 'PINNED_MANIFEST',
    role_bindability: 'SOURCE_TRACE_ONLY',
    visual_style_context: 'UPSTREAM_PERSONA_SOURCE_SHEET',
    structural_display_suitability: 'TRACE_ONLY'
  },
  REFERENCE_INPUTS: {
    asset_class: 'PERSONA_REFERENCE_INPUT',
    subject_scope: 'UNKNOWN_REVIEW_REQUIRED',
    subject_annotation_basis: 'PINNED_PATH_CONVENTION',
    role_bindability: 'REVIEW_REQUIRED',
    visual_style_context: 'RESTRICTED_REFERENCE_INPUT',
    structural_display_suitability: 'RESTRICTED_REVIEW_ONLY'
  },
  DESIGN_INPUT_IMAGE: {
    asset_class: 'DESIGN_INPUT',
    subject_scope: 'UNKNOWN_REVIEW_REQUIRED',
    subject_annotation_basis: 'PINNED_PATH_CONVENTION',
    role_bindability: 'REVIEW_REQUIRED',
    visual_style_context: 'RESTRICTED_DESIGN_INPUT',
    structural_display_suitability: 'RESTRICTED_REVIEW_ONLY'
  },
  DIGITAL_EMPLOYEE_OVERVIEWS: {
    asset_class: 'PERSONA_OVERVIEW',
    subject_scope: 'MULTI_PERSONA_OVERVIEW',
    subject_annotation_basis: 'PINNED_PATH_CONVENTION',
    role_bindability: 'NEVER_ROLE_BINDABLE',
    visual_style_context: 'MULTI_PERSONA_OVERVIEW',
    structural_display_suitability: 'OVERVIEW_ONLY'
  },
  BRAND_LOGO: {
    asset_class: 'BRAND_LOGO',
    subject_scope: 'NON_PERSONA_GRAPHIC',
    subject_annotation_basis: 'PINNED_PATH_CONVENTION',
    role_bindability: 'NEVER_ROLE_BINDABLE',
    visual_style_context: 'BRAND_IDENTITY_GRAPHIC',
    structural_display_suitability: 'BRAND_SURFACE_ONLY'
  },
  WEBSITE_GRAPHICS: {
    asset_class: 'WEBSITE_GRAPHIC',
    subject_scope: 'NON_PERSONA_GRAPHIC',
    subject_annotation_basis: 'PINNED_PATH_CONVENTION',
    role_bindability: 'NEVER_ROLE_BINDABLE',
    visual_style_context: 'WEBSITE_SUPPORT_GRAPHIC',
    structural_display_suitability: 'WEBSITE_SURFACE_ONLY'
  }
}

const domainForPath = (path) => {
  if (path.startsWith('digital-employees/assets/')) return 'DELIVERY_RENDITIONS'
  if (path.startsWith('digital-employees/sources/')) return 'SOURCE_SHEETS'
  if (path.startsWith('digital-employees/references/')) return 'REFERENCE_INPUTS'
  if (path.startsWith('digital-employees/design/')) return 'DESIGN_INPUT_IMAGE'
  if (
    path.startsWith('digital-employees/') &&
    ['.jpg', '.jpeg'].includes(extname(path).toLowerCase())
  ) {
    return 'DIGITAL_EMPLOYEE_OVERVIEWS'
  }
  if (path.startsWith('brand/logo/')) return 'BRAND_LOGO'
  if (path.startsWith('website/assets/')) return 'WEBSITE_GRAPHICS'
  throw new Error('图像路径不属于已批准的七个素材域：' + path)
}

const domainItems = new Map(
  Object.keys(domainSpecs).map((domainId) => [domainId, []])
)
for (const item of imageItems) {
  domainItems.get(domainForPath(item.path)).push(item)
}

const domainGovernance = (domainId) => {
  const domain = g1DomainById.get(domainId)
  assert(domain, 'VIS-G1 未找到素材域：' + domainId)
  return {
    delivery_policy: domain.status,
    visibility_status: domain.public_visibility,
    pool_scope: domain.candidate_pool_disposition,
    default_public_delivery: false
  }
}

const sourceAnchor = sourceSnapshot.upstream
assert(
  sourceAnchor.commit === visG1.source_anchor.commit,
  'VIS-G0 与 VIS-G1 的固定提交不一致'
)
assert(sourceAnchor.tree === visG1.source_anchor.tree, 'VIS-G0 与 VIS-G1 的 tree 不一致')
assert(
  manifestContent.length === sourceSnapshot.pinned_catalogs.avatar_manifest.bytes,
  '上游 avatar manifest 字节数不匹配 VIS-G0 锚点'
)
assert(
  gitBlobSha1(manifestContent) === sourceSnapshot.pinned_catalogs.avatar_manifest.git_blob_sha,
  '上游 avatar manifest Git blob SHA 不匹配 VIS-G0 锚点'
)

assert(
  manifest.employees.length === sourceSnapshot.inventory.digital_employees.employee_count_from_avatar_manifest,
  'avatar manifest 人物数量与 VIS-G0 不一致'
)
assert(roleCatalog.role_count === 50, '项目 role catalog 不含 50 个岗位')

const employeesById = new Map()
for (const employee of manifest.employees) {
  assert(/^AGT-\d{3}$/.test(employee.id), 'avatar manifest 存在非法人物 ID：' + employee.id)
  assert(!employeesById.has(employee.id), 'avatar manifest 存在重复人物 ID：' + employee.id)
  employeesById.set(employee.id, employee)
}

const selectedMgtByPersona = new Map(
  visG1.selected_cxo_bindings.map((binding) => [binding.source_persona_id, binding])
)
const expectedMgtSelection = new Map([
  ['AGT-067', 'MGT-001'],
  ['AGT-090', 'MGT-002'],
  ['AGT-056', 'MGT-003']
])
assert(selectedMgtByPersona.size === 3, 'VIS-G1 的 CXO 选择数不等于3')
for (const [personaId, roleId] of expectedMgtSelection) {
  assert(
    selectedMgtByPersona.get(personaId)?.role_id === roleId,
    'VIS-G1 的 CXO 源人物映射错误：' + personaId
  )
}

const roleById = new Map(roleCatalog.roles.map((role) => [role.id, role]))
const roleAlignment = []
for (const role of roleCatalog.roles) {
  const employee = employeesById.get(role.id)
  assert(employee, '项目岗位不存在对应上游人物：' + role.id)
  assert(
    role.alias === employee.name,
    '项目岗位别名与上游人物名称不一致：' + role.id
  )
  roleAlignment.push({
    role_id: role.id,
    source_persona_id: employee.id,
    source_name_match: true,
    upstream_job_matches_project_title: employee.job === role.title,
    upstream_deliver_matches_project_artifact: employee.deliver === role.artifact
  })
}

const sourceRoleRelation = (personaId) => {
  const ordinal = Number(personaId.slice(-3))
  if (ordinal <= 50) {
    return {
      persona_pool_relation: 'EXISTING_ROLE_SOURCE_BASELINE',
      project_role_id: personaId,
      selection_reference: 'D-068'
    }
  }
  if (ordinal === 51 || ordinal === 52) {
    return {
      persona_pool_relation: 'PRESERVE_UPSTREAM_SEMANTICS',
      project_role_id: personaId,
      selection_reference: 'D-068'
    }
  }
  const selected = selectedMgtByPersona.get(personaId)
  if (selected) {
    return {
      persona_pool_relation: 'MGT_SOURCE_SELECTED_PENDING_VIS_G3',
      project_role_id: selected.role_id,
      selection_reference: 'D-069',
      future_role_reuse: 'REQUIRES_EXPLICIT_REBIND_DECISION'
    }
  }
  return {
    persona_pool_relation: 'FUTURE_ROLE_CANDIDATE',
    project_role_id: null,
    selection_reference: 'D-068'
  }
}

const assetIndex = []
const consumedPaths = new Set()

const addAsset = (asset, treeItem) => {
  assert(!consumedPaths.has(treeItem.path), '图像被重复登记：' + treeItem.path)
  consumedPaths.add(treeItem.path)
  assetIndex.push(asset)
}

const publicLocator = (item) => ({
  source_path: item.path,
  git_blob_sha: item.sha,
  bytes: item.size
})

const restrictedLocator = (item) => ({
  source_path_exposure: 'RESTRICTED_BY_DELIVERY_POLICY',
  git_blob_sha_exposure: 'RESTRICTED_BY_DELIVERY_POLICY',
  bytes: item.size
})

const personaFamilies = manifest.employees.map((employee) => {
  const sourceRelation = sourceRoleRelation(employee.id)
  return {
    persona_family_id: 'SANBAO-2e676da-' + employee.id,
    source_persona_id: employee.id,
    upstream_display_name: employee.name,
    neutral_visual_metadata: {
      palette_name: employee.palette.name,
      pose_key: employee.poseKey,
      visual_style_context: domainSpecs.DELIVERY_RENDITIONS.visual_style_context,
      visual_similarity_assessment_status: 'NOT_EVALUATED_IN_VIS_G2'
    },
    expected_delivery_matrix: {
      themes: ['dark', 'light'],
      webp_sizes_px: [32, 48, 64, 80, 128, 256, 512],
      native_png_per_theme: 1
    },
    source_role_relation: sourceRelation
  }
})

for (const employee of manifest.employees) {
  const familyId = 'SANBAO-2e676da-' + employee.id
  const sourceRelation = sourceRoleRelation(employee.id)
  const sourcePath = 'digital-employees/' + employee.source
  const sourceItem = imageByPath.get(sourcePath)
  assert(sourceItem, 'tree 缺少人物来源图：' + sourcePath)
  addAsset(
    {
      asset_id: 'RESTRICTED-SOURCE-' + employee.id,
      asset_domain: 'SOURCE_SHEETS',
      asset_class: domainSpecs.SOURCE_SHEETS.asset_class,
      subject_scope: domainSpecs.SOURCE_SHEETS.subject_scope,
      subject_annotation_basis: domainSpecs.SOURCE_SHEETS.subject_annotation_basis,
      subject_annotation_status: 'CONFIRMED_METADATA',
      source_persona_id: employee.id,
      rendition_family_id: familyId,
      rendition_relation: 'SOURCE_TO_RENDITION',
      semantic_attributes: {
        ui_theme: 'neutral',
        declared_rendition_size_px: 'source',
        format: extname(sourceItem.path).slice(1).toLowerCase(),
        visual_style_context: domainSpecs.SOURCE_SHEETS.visual_style_context,
        structural_display_suitability:
          domainSpecs.SOURCE_SHEETS.structural_display_suitability,
        dimensions_px: {
          width: employee.sourceDimensions[0],
          height: employee.sourceDimensions[1],
          verification_status: 'UPSTREAM_DECLARED'
        }
      },
      source_locator: {
        ...restrictedLocator(sourceItem),
        upstream_declared_sha256: employee.sourceSha256
      },
      governance: {
        ...domainGovernance('SOURCE_SHEETS'),
        role_bindability: domainSpecs.SOURCE_SHEETS.role_bindability
      },
      persona_pool_relation: sourceRelation.persona_pool_relation
    },
    sourceItem
  )

  for (const theme of ['dark', 'light']) {
    const native = employee.assets[theme].png
    const nativePath = 'digital-employees/' + native.path
    const nativeItem = imageByPath.get(nativePath)
    assert(nativeItem, 'tree 缺少原生头像：' + nativePath)
    assert(nativeItem.size === native.bytes, '原生头像字节数与 manifest 不一致：' + nativePath)
    addAsset(
      {
        asset_id: 'RENDITION-' + employee.id + '-' + theme + '-native',
        asset_domain: 'DELIVERY_RENDITIONS',
        asset_class: 'PERSONA_NATIVE_PORTRAIT',
        subject_scope: domainSpecs.DELIVERY_RENDITIONS.subject_scope,
        subject_annotation_basis: domainSpecs.DELIVERY_RENDITIONS.subject_annotation_basis,
        subject_annotation_status: 'CONFIRMED_METADATA',
        source_persona_id: employee.id,
        rendition_family_id: familyId,
        rendition_relation: 'NATIVE_TO_WEBP_RENDITION',
        semantic_attributes: {
          ui_theme: theme,
          declared_rendition_size_px: 'native',
          format: 'png',
          visual_style_context:
            domainSpecs.DELIVERY_RENDITIONS.visual_style_context,
          structural_display_suitability:
            domainSpecs.DELIVERY_RENDITIONS.structural_display_suitability,
          dimensions_px: {
            width: native.width,
            height: native.height,
            verification_status: 'UPSTREAM_DECLARED'
          }
        },
        source_locator: {
          ...publicLocator(nativeItem),
          upstream_declared_sha256: native.sha256
        },
        governance: {
          ...domainGovernance('DELIVERY_RENDITIONS'),
          role_bindability: domainSpecs.DELIVERY_RENDITIONS.role_bindability
        },
        persona_pool_relation: sourceRelation.persona_pool_relation
      },
      nativeItem
    )

    const webpEntries = Object.entries(employee.assets[theme].webp).sort(
      ([left], [right]) => Number(left) - Number(right)
    )
    assert(webpEntries.length === 7, '人物缺少7档 WebP：' + employee.id + '/' + theme)
    for (const [size, rendition] of webpEntries) {
      const webpPath = 'digital-employees/' + rendition.path
      const webpItem = imageByPath.get(webpPath)
      assert(webpItem, 'tree 缺少 WebP 交付件：' + webpPath)
      assert(webpItem.size === rendition.bytes, 'WebP 字节数与 manifest 不一致：' + webpPath)
      assert(
        rendition.width === Number(size) && rendition.height === Number(size),
        'WebP 尺寸与路径档位不一致：' + webpPath
      )
      addAsset(
        {
          asset_id: 'RENDITION-' + employee.id + '-' + theme + '-' + size,
          asset_domain: 'DELIVERY_RENDITIONS',
          asset_class: 'PERSONA_WEBP_RENDITION',
          subject_scope: domainSpecs.DELIVERY_RENDITIONS.subject_scope,
          subject_annotation_basis: domainSpecs.DELIVERY_RENDITIONS.subject_annotation_basis,
          subject_annotation_status: 'CONFIRMED_METADATA',
          source_persona_id: employee.id,
          rendition_family_id: familyId,
          rendition_relation: 'SIZE_VARIANT',
          semantic_attributes: {
            ui_theme: theme,
            declared_rendition_size_px: Number(size),
            format: 'webp',
            visual_style_context:
              domainSpecs.DELIVERY_RENDITIONS.visual_style_context,
            structural_display_suitability:
              domainSpecs.DELIVERY_RENDITIONS.structural_display_suitability,
            dimensions_px: {
              width: rendition.width,
              height: rendition.height,
              verification_status: 'UPSTREAM_DECLARED'
            }
          },
          source_locator: publicLocator(webpItem),
          governance: {
            ...domainGovernance('DELIVERY_RENDITIONS'),
            role_bindability: domainSpecs.DELIVERY_RENDITIONS.role_bindability
          },
          persona_pool_relation: sourceRelation.persona_pool_relation
        },
        webpItem
      )
    }
  }
}

const opaqueDomainCounters = new Map()
for (const item of imageItems) {
  if (consumedPaths.has(item.path)) continue
  const domainId = domainForPath(item.path)
  const counter = (opaqueDomainCounters.get(domainId) ?? 0) + 1
  opaqueDomainCounters.set(domainId, counter)
  const spec = domainSpecs[domainId]
  const isRestricted =
    domainId === 'REFERENCE_INPUTS' || domainId === 'DESIGN_INPUT_IMAGE'
  const assetId =
    domainId === 'REFERENCE_INPUTS'
      ? 'RESTRICTED-REFERENCE-' + String(counter).padStart(3, '0')
      : domainId === 'DESIGN_INPUT_IMAGE'
        ? 'RESTRICTED-DESIGN-' + String(counter).padStart(3, '0')
        : domainId + '-' + String(counter).padStart(3, '0')
  addAsset(
    {
      asset_id: assetId,
      asset_domain: domainId,
      asset_class: spec.asset_class,
      subject_scope: spec.subject_scope,
      subject_annotation_basis: spec.subject_annotation_basis,
      subject_annotation_status:
        spec.subject_scope === 'UNKNOWN_REVIEW_REQUIRED'
          ? 'REVIEW_REQUIRED'
          : 'CONFIRMED_METADATA',
      source_persona_id: null,
      rendition_family_id: null,
      rendition_relation: 'NONE',
      semantic_attributes: {
        ui_theme: 'not_applicable',
        declared_rendition_size_px: 'not_applicable',
        format: extname(item.path).slice(1).toLowerCase(),
        visual_style_context: spec.visual_style_context,
        structural_display_suitability: spec.structural_display_suitability,
        dimensions_px: {
          width: null,
          height: null,
          verification_status: 'NOT_BINARY_RECOMPUTED'
        }
      },
      source_locator: isRestricted ? restrictedLocator(item) : publicLocator(item),
      governance: {
        ...domainGovernance(domainId),
        role_bindability: spec.role_bindability
      },
      persona_pool_relation: null
    },
    item
  )
}

assert(consumedPaths.size === imageItems.length, '存在未登记图像')
assert(assetIndex.length === imageItems.length, '资产索引没有完整覆盖固定 tree 图像')

const imageCountByDomain = Object.fromEntries(
  Object.entries(domainSpecs).map(([domainId]) => [
    domainId,
    domainItems.get(domainId).length
  ])
)
for (const [domainId, count] of Object.entries(imageCountByDomain)) {
  assert(
    count === g1DomainById.get(domainId).image_count,
    'VIS-G2 与 VIS-G1 的素材域计数不一致：' + domainId
  )
}

const pathMetadataFingerprint = (items, comparator) =>
  sha256(
    items
      .slice()
      .sort(comparator)
      .map((item) => item.path + '\t' + item.sha + '\t' + item.size + '\n')
      .join('')
  )

const codePointPathComparator = (left, right) =>
  left.path < right.path ? -1 : left.path > right.path ? 1 : 0
const g0DeclaredComparator = (left, right) => left.path.localeCompare(right.path, 'en')
const fingerprintScopes = {
  repository_blobs: {
    items: allBlobItems,
    declared: sourceSnapshot.inventory.repository_blobs.metadata_fingerprint_sha256,
    expected_count: sourceSnapshot.inventory.repository_blobs.count,
    expected_bytes: sourceSnapshot.inventory.repository_blobs.bytes
  },
  repository_images: {
    items: imageItems,
    declared:
      sourceSnapshot.inventory.repository_image_blobs.metadata_fingerprint_sha256,
    expected_count: sourceSnapshot.inventory.repository_image_blobs.count,
    expected_bytes: sourceSnapshot.inventory.repository_image_blobs.bytes
  },
  digital_employee_images: {
    items: digitalEmployeeImageItems,
    declared:
      sourceSnapshot.inventory.digital_employees.image_metadata_fingerprint_sha256,
    expected_count: sourceSnapshot.inventory.digital_employees.image_blob_count,
    expected_bytes: sourceSnapshot.inventory.digital_employees.image_bytes
  }
}
const fingerprintReproduction = Object.fromEntries(
  Object.entries(fingerprintScopes).map(([scope, definition]) => {
    const g0ReproductionAttempt = pathMetadataFingerprint(
      definition.items,
      g0DeclaredComparator
    )
    return [
      scope,
      {
        count: definition.items.length,
        bytes: definition.items.reduce((total, item) => total + item.size, 0),
        g0_declared_sha256: definition.declared,
        g0_declared_reproduction_attempt_sha256: g0ReproductionAttempt,
        g2_code_point_canonical_sha256: pathMetadataFingerprint(
          definition.items,
          codePointPathComparator
        ),
        g0_declared_reproduction_status:
          g0ReproductionAttempt === definition.declared
            ? 'MATCH'
            : 'MISMATCH_REQUIRES_G0_REMEDIATION',
        count_and_byte_anchor_status:
          definition.items.length === definition.expected_count &&
          definition.items.reduce((total, item) => total + item.size, 0) ===
            definition.expected_bytes
            ? 'MATCH'
            : 'MISMATCH'
      }
    ]
  })
)

const exactDuplicateGroups = new Map()
for (const item of imageItems) {
  const group = exactDuplicateGroups.get(item.sha) ?? []
  group.push(item.path)
  exactDuplicateGroups.set(item.sha, group)
}
const exactDuplicates = [...exactDuplicateGroups.entries()]
  .filter(([, paths]) => paths.length > 1)
  .map(([git_blob_sha, paths]) => ({ git_blob_sha, paths }))

const nativePngSha256 = manifest.employees.flatMap((employee) => [
  employee.assets.dark.png.sha256,
  employee.assets.light.png.sha256
])
const nativePngDuplicateCount = nativePngSha256.length - new Set(nativePngSha256).size

const webpMatrixExpected = manifest.employees.length * 2 * 7
const nativePngExpected = manifest.employees.length * 2
const deliveryExpected = webpMatrixExpected + nativePngExpected
const countBy = (items, key) =>
  items.reduce((counts, item) => {
    const value = item[key]
    counts[value] = (counts[value] ?? 0) + 1
    return counts
  }, {})

const register = {
  schema_version: '1.0',
  register_id: 'VIS-G2-SANBAO-WEB-2026-09-24',
  generated_on: '2026-09-24',
  gate: {
    id: 'VIS-G2',
    status: 'COMPLETE_STRUCTURAL_SEMANTICS_WITH_G0_FINGERPRINT_EXCEPTION',
    scope: [
      'full path-level semantic index reconstructed from the fixed tree and pinned avatar manifest',
      '102 persona-family semantic records',
      'theme, size, format, delivery-policy, candidate-pool, and role-bindability tagging',
      'structural rendition and exact Git-blob duplicate analysis'
    ],
    excluded: [
      'image binary download, copy, editing, derivation, or local SHA-256 recomputation',
      'perceptual-image hashing or subjective visual similarity judgement',
      'Visual Identity Binding, Visual Identity Release, alt text, page integration, publication, DSH, or runtime changes'
    ]
  },
  source_anchor: {
    repository: sourceAnchor.repository,
    repository_url: sourceAnchor.repository_url,
    commit: sourceAnchor.commit,
    tree: sourceAnchor.tree,
    tree_response_truncated: treeResponse.truncated,
    avatar_manifest: {
      git_blob_sha: sourceSnapshot.pinned_catalogs.avatar_manifest.git_blob_sha,
      bytes: manifestContent.length,
      local_input_sha256: sha256(manifestContent),
      git_blob_sha_verified_from_input: true
    }
  },
  source_integrity: {
    image_count: imageItems.length,
    image_bytes: imageItems.reduce((total, item) => total + item.size, 0),
    g0_declared_canonicalization:
      sourceSnapshot.integrity_semantics.metadata_fingerprint_canonicalization,
    replacement_canonicalization: {
      algorithm: 'SHA-256',
      canonicalization:
        'Sort selected image blobs by Unicode code-point path order; concatenate path, TAB, git_blob_sha, TAB, bytes, LF; hash UTF-8.',
      version: 'VIS-G2-CANONICALIZATION-1'
    },
    g0_fingerprint_reproduction: fingerprintReproduction
  },
  taxonomy: {
    version: 'VIS-G2-TAXONOMY-1.0',
    separation_of_concerns: {
      persona_family:
        'Candidate-pool relation belongs to a source persona, not to each theme or size rendition.',
      asset:
        'Theme, size, format, path provenance, governance, and default delivery policy belong to an individual asset.',
      semantic_relation:
        'Same-persona rendition, theme-pair, size-variant, exact binary duplicate, and near-visual similarity are separate relation types.'
    },
    controlled_values: {
      subject_scope: [
        'SINGLE_NAMED_PERSONA',
        'MULTI_PERSONA_OVERVIEW',
        'NON_PERSONA_GRAPHIC',
        'UNKNOWN_REVIEW_REQUIRED'
      ],
      ui_theme: ['dark', 'light', 'neutral', 'not_applicable'],
      visual_style_context: [
        'SANBAO_COLLECTION_06_PERSONA_RENDITION',
        'UPSTREAM_PERSONA_SOURCE_SHEET',
        'RESTRICTED_REFERENCE_INPUT',
        'RESTRICTED_DESIGN_INPUT',
        'MULTI_PERSONA_OVERVIEW',
        'BRAND_IDENTITY_GRAPHIC',
        'WEBSITE_SUPPORT_GRAPHIC'
      ],
      structural_display_suitability: [
        'RENDER_CANDIDATE_PENDING_BINARY_VISUAL_REVIEW',
        'TRACE_ONLY',
        'RESTRICTED_REVIEW_ONLY',
        'OVERVIEW_ONLY',
        'BRAND_SURFACE_ONLY',
        'WEBSITE_SURFACE_ONLY'
      ],
      rendition_relation: [
        'SOURCE_TO_RENDITION',
        'NATIVE_TO_WEBP_RENDITION',
        'SIZE_VARIANT',
        'NONE'
      ]
    }
  },
  domain_rules: Object.fromEntries(
    Object.keys(domainSpecs).map((domainId) => [
      domainId,
      {
        image_count: imageCountByDomain[domainId],
        ...domainGovernance(domainId),
        ...domainSpecs[domainId]
      }
    ])
  ),
  project_role_alignment: {
    project_role_catalog: 'docs/05-agents/role-catalog.json',
    source_persona_id_coverage: {
      expected: 50,
      matched: roleAlignment.length
    },
    source_alias_coverage: {
      expected: 50,
      matched: roleAlignment.filter((entry) => entry.source_name_match).length
    },
    upstream_job_is_not_project_role_authority: true,
    upstream_deliver_is_not_project_role_authority: true,
    upstream_job_title_mismatch_ids: roleAlignment
      .filter((entry) => !entry.upstream_job_matches_project_title)
      .map((entry) => entry.role_id),
    upstream_deliver_artifact_mismatch_ids: roleAlignment
      .filter((entry) => !entry.upstream_deliver_matches_project_artifact)
      .map((entry) => entry.role_id)
  },
  persona_families: personaFamilies,
  asset_semantic_index: assetIndex,
  semantic_relations: {
    structural_relation_counts: {
      rendition_families: manifest.employees.length,
      theme_pairs: manifest.employees.length * 8,
      size_variant_groups: manifest.employees.length * 2,
      source_to_rendition_groups: manifest.employees.length
    },
    exact_binary_duplicate: {
      method: 'FROZEN_GIT_BLOB_IDENTITY',
      duplicate_group_count: exactDuplicates.length,
      duplicate_file_count: exactDuplicates.reduce(
        (total, duplicate) => total + duplicate.paths.length,
        0
      ),
      duplicate_groups: exactDuplicates
    },
    upstream_declared_native_png_sha256: {
      checked_record_count: nativePngSha256.length,
      duplicate_count: nativePngDuplicateCount,
      upstream_manifest_duplicate_hashes: manifest.validation.duplicatePngHashes
    },
    near_visual_duplicate: {
      status: 'NOT_EVALUATED_IN_VIS_G2',
      reason:
        'Requires an approved perceptual-hash method and visual review; structural rendition relations and exact frozen Git-blob equality must not be misreported as near-visual similarity.'
    }
  },
  coverage_summary: {
    total_image_count: assetIndex.length,
    total_image_bytes: imageItems.reduce((total, item) => total + item.size, 0),
    total_persona_families: personaFamilies.length,
    asset_count_by_domain: imageCountByDomain,
    asset_count_by_delivery_policy: countBy(
      assetIndex.map((asset) => ({
        delivery_policy: asset.governance.delivery_policy
      })),
      'delivery_policy'
    ),
    delivery_matrix: {
      webp_expected: webpMatrixExpected,
      webp_actual: assetIndex.filter(
        (asset) => asset.asset_class === 'PERSONA_WEBP_RENDITION'
      ).length,
      native_png_expected: nativePngExpected,
      native_png_actual: assetIndex.filter(
        (asset) => asset.asset_class === 'PERSONA_NATIVE_PORTRAIT'
      ).length,
      delivery_rendition_expected: deliveryExpected,
      delivery_rendition_actual: assetIndex.filter(
        (asset) => asset.asset_domain === 'DELIVERY_RENDITIONS'
      ).length
    },
    persona_pool_relation_counts: countBy(
      personaFamilies.map((persona) => persona.source_role_relation),
      'persona_pool_relation'
    )
  },
  known_gaps_and_next_gates: [
    {
      id: 'G2-EXC-001',
      status: 'OPEN',
      subject: 'VIS-G0 metadata fingerprint reproducibility',
      detail:
        'The frozen tree count and bytes match VIS-G0, but the documented en-locale reproduction attempt does not match the previously recorded image metadata fingerprint. The new VIS-G2 canonical fingerprint is recorded separately; do not replace the VIS-G0 value without a dedicated correction record.'
    },
    {
      id: 'G2-OUT-001',
      status: 'NOT_IN_VIS-G2',
      subject: 'Perceptual or near-visual duplicate review',
      detail:
        'Requires approved binary/perceptual-hash method and visual review. VIS-G2 completed structural rendition and exact frozen Git-blob analysis only.'
    },
    {
      id: 'G2-OUT-002',
      status: 'NOT_IN_VIS-G2',
      subject: 'Visual Identity Binding and Visual Identity Release',
      detail:
        'VIS-G3 owns the actual 50 AGT mappings and three MGT display bindings; VIS-G2 does not assign a primary image.'
    }
  ]
}

assert(
  register.coverage_summary.total_image_count === visG1.inventory.total_image_files,
  'VIS-G2 总图像数与 VIS-G1 不一致'
)
assert(
  register.coverage_summary.asset_count_by_delivery_policy.APPROVED_DELIVERY ===
    visG1.inventory.status_counts.APPROVED_DELIVERY,
  'APPROVED_DELIVERY 计数与 VIS-G1 不一致'
)
assert(
  register.coverage_summary.asset_count_by_delivery_policy.POOL_ONLY ===
    visG1.inventory.status_counts.POOL_ONLY,
  'POOL_ONLY 计数与 VIS-G1 不一致'
)
assert(
  register.coverage_summary.delivery_matrix.webp_actual === webpMatrixExpected,
  'WebP 交付矩阵不完整'
)
assert(
  register.coverage_summary.delivery_matrix.native_png_actual === nativePngExpected,
  '原生 PNG 交付矩阵不完整'
)
assert(
  register.coverage_summary.persona_pool_relation_counts.EXISTING_ROLE_SOURCE_BASELINE === 50 &&
    register.coverage_summary.persona_pool_relation_counts.PRESERVE_UPSTREAM_SEMANTICS === 2 &&
    register.coverage_summary.persona_pool_relation_counts.MGT_SOURCE_SELECTED_PENDING_VIS_G3 === 3 &&
    register.coverage_summary.persona_pool_relation_counts.FUTURE_ROLE_CANDIDATE === 47,
  '102 位人物的候选池分层不完整'
)

writeFileSync(outputPath, JSON.stringify(register, null, 2) + '\n')
console.log('PASS VIS-G2 语义登记册已生成：' + outputPath)
console.log(
  '  图像：' +
    register.coverage_summary.total_image_count +
    '；人物：' +
    register.coverage_summary.total_persona_families +
    '；精确 Git blob 重复组：' +
    register.semantic_relations.exact_binary_duplicate.duplicate_group_count
)
console.log(
  '  VIS-G0 metadata fingerprint：' +
    register.source_integrity.g0_fingerprint_reproduction.repository_images
      .g0_declared_reproduction_status
)
