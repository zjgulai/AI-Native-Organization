// 从已验收的 VIS-G2 语义登记册和项目角色目录生成 VIS-G3 展示绑定表。
// 用法：
// node scripts/build-sanbao-vis-g3.mjs --output docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G3-VISUAL-IDENTITY-BINDINGS-2026-09-24.json
// 边界：只生成角色到已登记交付素材的绑定草案；不下载、复制、编辑或发布图像二进制。

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

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
const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}
const countBy = (items, selector) =>
  items.reduce((counts, item) => {
    const key = selector(item)
    counts[key] = (counts[key] ?? 0) + 1
    return counts
  }, {})

const outputPath = resolve(ROOT, requiredOption('--output'))
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

const visG2 = readJson(visG2Path)
const roleCatalog = readJson(roleCatalogPath)
const managementCatalog = readJson(managementCatalogPath)

assert(
  visG2.gate.id === 'VIS-G2' &&
    visG2.gate.status ===
      'COMPLETE_STRUCTURAL_SEMANTICS_WITH_G0_FINGERPRINT_EXCEPTION',
  'VIS-G2 语义登记册不是当前可接受的结构性输入'
)
assert(roleCatalog.role_count === 50, '执行岗位目录不是50项')
assert(managementCatalog.role_count === 3, '管理层目录不是3项')
assert(
  visG2.source_integrity.replacement_canonicalization.version ===
    'VIS-G2-CANONICALIZATION-1',
  'VIS-G2 缺少已接受的目录锚点版本'
)

const fingerprintScopes = visG2.source_integrity.g0_fingerprint_reproduction
for (const scope of [
  'repository_blobs',
  'repository_images',
  'digital_employee_images'
]) {
  assert(
    fingerprintScopes[scope]?.g0_declared_reproduction_status ===
      'MISMATCH_REQUIRES_G0_REMEDIATION',
    'VIS-G2 未明确保留 G0 指纹历史异常：' + scope
  )
}

const assetById = new Map(
  visG2.asset_semantic_index.map((asset) => [asset.asset_id, asset])
)
const personaById = new Map(
  visG2.persona_families.map((persona) => [persona.source_persona_id, persona])
)
const roleById = new Map(roleCatalog.roles.map((role) => [role.id, role]))
const managementRoleById = new Map(
  managementCatalog.roles.map((role) => [role.id, role])
)

const mgtSourcePersonaByRoleId = new Map([
  ['MGT-001', 'AGT-067'],
  ['MGT-002', 'AGT-090'],
  ['MGT-003', 'AGT-056']
])
const requiredWebpSizes = [64, 128, 256]

const renditionId = (personaId, theme, size) =>
  'RENDITION-' + personaId + '-' + theme + '-' + size

const selectedRendition = (personaId, theme, size) => {
  const assetId = renditionId(personaId, theme, size)
  const asset = assetById.get(assetId)
  assert(asset, 'VIS-G2 缺少所需交付变体：' + assetId)
  assert(
    asset.source_persona_id === personaId &&
      asset.semantic_attributes.ui_theme === theme &&
      asset.governance.delivery_policy === 'APPROVED_DELIVERY' &&
      asset.governance.role_bindability === 'ELIGIBLE_FOR_PERSONA_BINDING',
    '交付变体不满足 VIS-G3 绑定条件：' + assetId
  )
  if (size === 'native') {
    assert(
      asset.asset_class === 'PERSONA_NATIVE_PORTRAIT',
      '原生质量追溯项类型错误：' + assetId
    )
  } else {
    assert(
      asset.asset_class === 'PERSONA_WEBP_RENDITION' &&
        asset.semantic_attributes.declared_rendition_size_px === size,
      'WebP 尺寸变体错误：' + assetId
    )
  }
  return assetId
}

const presentationRenditions = (personaId) => {
  const themes = Object.fromEntries(
    ['dark', 'light'].map((theme) => [
      theme,
      {
        primary_asset_id: selectedRendition(personaId, theme, 256),
        list_asset_id: selectedRendition(personaId, theme, 64),
        detail_asset_id: selectedRendition(personaId, theme, 256),
        fallback_asset_id: selectedRendition(personaId, theme, 128),
        quality_trace_native_asset_id: selectedRendition(personaId, theme, 'native')
      }
    ])
  )
  return {
    rendering_policy: {
      theme_switching: 'SAME_SOURCE_PERSONA_REQUIRED',
      list_rendition_size_px: 64,
      detail_rendition_size_px: 256,
      fallback_rendition_size_px: 128,
      binary_quality_status: 'PENDING_VIS_G5'
    },
    themes
  }
}

const sourceContextStatus = (roleId) => {
  const jobMismatch =
    visG2.project_role_alignment.upstream_job_title_mismatch_ids.includes(roleId)
  const deliverMismatch =
    visG2.project_role_alignment.upstream_deliver_artifact_mismatch_ids.includes(
      roleId
    )
  return jobMismatch || deliverMismatch
    ? 'SOURCE_CONTEXT_NONAUTHORITATIVE'
    : 'SOURCE_CONTEXT_MATCHES_PROJECT_LABEL'
}

const bindingForAgent = (role) => {
  const personaId = role.id
  const persona = personaById.get(personaId)
  assert(persona, 'VIS-G2 缺少执行岗位源人物：' + personaId)
  assert(
    persona.source_role_relation.persona_pool_relation ===
      'EXISTING_ROLE_SOURCE_BASELINE' &&
      persona.source_role_relation.project_role_id === role.id,
    '执行岗位的人物候选池关系不正确：' + role.id
  )
  for (const size of requiredWebpSizes) {
    selectedRendition(personaId, 'dark', size)
    selectedRendition(personaId, 'light', size)
  }
  return {
    binding_id: 'VIB-' + role.id,
    role_id: role.id,
    role_kind: 'AGT',
    role_catalog_authority: {
      path: 'docs/05-agents/role-catalog.json',
      version: roleCatalog.version,
      semantic_display_policy: 'PROJECT_ROLE_CATALOG_ONLY'
    },
    role_display_name: role.alias,
    role_title: role.title,
    source_persona_id: personaId,
    source_persona_name: persona.upstream_display_name,
    source_context_status: sourceContextStatus(role.id),
    binding_status: 'STRUCTURAL_BINDING_PENDING_VIS_G5',
    visual_identity_release: {
      status: 'NOT_CREATED_PENDING_VIS_G5',
      proposed_release_id: 'VIR-SANBAO-WEB-2026-09-24-DRAFT'
    },
    presentation: {
      ...presentationRenditions(personaId),
      alt_text: {
        dark: role.alias + '数字分身形象，深色主题',
        light: role.alias + '数字分身形象，浅色主题',
        status: 'DRAFT_NEUTRAL_TEXT_PENDING_VIS_G5'
      }
    },
    governance: {
      approval_references: ['D-068', 'D-073'],
      role_contract_impact: 'NONE',
      runtime_or_access_impact: 'NONE',
      visual_quality_gate: 'VIS-G5_REQUIRED'
    }
  }
}

const bindingForManagement = (role) => {
  const personaId = mgtSourcePersonaByRoleId.get(role.id)
  assert(personaId, '管理层缺少用户确认的源人物：' + role.id)
  const persona = personaById.get(personaId)
  assert(persona, 'VIS-G2 缺少管理层源人物：' + personaId)
  assert(
    persona.source_role_relation.persona_pool_relation ===
      'MGT_SOURCE_SELECTED_PENDING_VIS_G3' &&
      persona.source_role_relation.project_role_id === role.id,
    '管理层源人物与 D-069 映射不一致：' + role.id
  )
  for (const size of requiredWebpSizes) {
    selectedRendition(personaId, 'dark', size)
    selectedRendition(personaId, 'light', size)
  }
  return {
    binding_id: 'VIB-' + role.id,
    role_id: role.id,
    role_kind: 'MGT',
    role_catalog_authority: {
      path: 'docs/04-organization/management/management-catalog.json',
      version: managementCatalog.version,
      semantic_display_policy: 'MANAGEMENT_CATALOG_ONLY'
    },
    role_display_name: role.alias,
    role_title: role.title,
    source_persona_id: personaId,
    source_persona_name: persona.upstream_display_name,
    source_context_status: 'SOURCE_PERSONA_ONLY_ROLE_SEMANTICS_FROM_MANAGEMENT_CATALOG',
    binding_status: 'STRUCTURAL_BINDING_PENDING_VIS_G5',
    visual_identity_release: {
      status: 'NOT_CREATED_PENDING_VIS_G5',
      proposed_release_id: 'VIR-SANBAO-WEB-2026-09-24-DRAFT'
    },
    presentation: {
      ...presentationRenditions(personaId),
      alt_text: {
        dark: role.alias + '数字分身形象，深色主题',
        light: role.alias + '数字分身形象，浅色主题',
        status: 'DRAFT_NEUTRAL_TEXT_PENDING_VIS_G5'
      }
    },
    governance: {
      approval_references: ['D-068', 'D-069', 'D-073'],
      role_contract_impact: 'NONE',
      runtime_or_access_impact: 'NONE',
      visual_quality_gate: 'VIS-G5_REQUIRED'
    }
  }
}

const managementBindings = managementCatalog.roles
  .slice()
  .sort((left, right) => left.id.localeCompare(right.id, 'en'))
  .map(bindingForManagement)
const agentBindings = roleCatalog.roles
  .slice()
  .sort((left, right) => left.id.localeCompare(right.id, 'en'))
  .map(bindingForAgent)
const bindings = [...managementBindings, ...agentBindings]

assert(bindings.length === 53, 'VIS-G3 未生成53条绑定')
assert(
  new Set(bindings.map((binding) => binding.role_id)).size === bindings.length,
  'VIS-G3 role_id 存在重复'
)
assert(
  new Set(bindings.map((binding) => binding.source_persona_id)).size ===
    bindings.length,
  'VIS-G3 不允许不同角色共享同一源人物'
)
assert(
  agentBindings.every((binding) => binding.role_id === binding.source_persona_id),
  'AGT 绑定必须保持同 ID 源人物'
)
assert(
  managementBindings.find((binding) => binding.role_id === 'MGT-001')
    ?.source_persona_id === 'AGT-067' &&
    managementBindings.find((binding) => binding.role_id === 'MGT-002')
      ?.source_persona_id === 'AGT-090' &&
    managementBindings.find((binding) => binding.role_id === 'MGT-003')
      ?.source_persona_id === 'AGT-056',
  '三位管理层源人物映射不正确'
)

const register = {
  schema_version: '1.0',
  register_id: 'VIS-G3-SANBAO-WEB-2026-09-24',
  generated_on: '2026-09-24',
  gate: {
    id: 'VIS-G3',
    status: 'COMPLETE_BINDING_TABLE_PENDING_VIS_G5',
    scope: [
      '53 role-to-source-persona structural visual bindings',
      'same-persona dark/light primary, list, detail, fallback, and native quality-trace rendition references',
      'neutral draft alt text and explicit source/role semantic authority boundaries'
    ],
    excluded: [
      'image binary download, copy, editing, derivation, or pixel/MIME verification',
      'Visual Identity Release creation, page integration, publication, DSH, or runtime changes',
      'any role-contract, access, organizational, or production-state change'
    ]
  },
  source_anchor: {
    repository: visG2.source_anchor.repository,
    commit: visG2.source_anchor.commit,
    tree: visG2.source_anchor.tree,
    vis_g2_register_id: visG2.register_id,
    canonicalization_acceptance: {
      decision_id: 'D-073',
      status: 'ACCEPTED',
      canonicalization:
        visG2.source_integrity.replacement_canonicalization,
      legacy_g0_fingerprints: {
        status: 'RETAINED_HISTORICAL_NOT_VERIFIED',
        reproduction_status_by_scope: Object.fromEntries(
          Object.entries(fingerprintScopes).map(([scope, result]) => [
            scope,
            result.g0_declared_reproduction_status
          ])
        )
      }
    }
  },
  binding_policy: {
    agent_mapping: 'AGT-001 through AGT-050 map to the same source_persona_id',
    management_mapping: {
      'MGT-001': 'AGT-067',
      'MGT-002': 'AGT-090',
      'MGT-003': 'AGT-056'
    },
    theme_switching: 'dark/light must retain the same source_persona_id',
    source_role_semantics: 'PROJECT_OR_MANAGEMENT_CATALOG_ONLY',
    visual_identity_release: 'NOT_CREATED_PENDING_VIS_G5',
    binary_and_visual_quality: 'PENDING_VIS_G5'
  },
  bindings,
  coverage_summary: {
    total_bindings: bindings.length,
    binding_count_by_role_kind: countBy(bindings, (binding) => binding.role_kind),
    binding_count_by_status: countBy(bindings, (binding) => binding.binding_status),
    unique_source_persona_count: new Set(
      bindings.map((binding) => binding.source_persona_id)
    ).size,
    selected_renditions_per_binding: {
      dark: ['primary_256', 'list_64', 'detail_256', 'fallback_128', 'native_quality_trace'],
      light: ['primary_256', 'list_64', 'detail_256', 'fallback_128', 'native_quality_trace']
    }
  },
  next_gates: [
    {
      id: 'G3-OUT-001',
      status: 'NOT_IN_VIS-G3',
      subject: 'Digital Persona Dossier and presentation projection',
      owner_gate: 'VIS-G4'
    },
    {
      id: 'G3-OUT-002',
      status: 'PENDING',
      subject: 'Binary, visual, accessibility, and perceptual-duplicate acceptance',
      owner_gate: 'VIS-G5'
    },
    {
      id: 'G3-OUT-003',
      status: 'NOT_IN_VIS-G3',
      subject: 'Page integration, release, publication, and future-role reuse',
      owner_gate: 'VIS-G6'
    }
  ]
}

writeFileSync(outputPath, JSON.stringify(register, null, 2) + '\n')
console.log('PASS VIS-G3 视觉绑定表已生成：' + outputPath)
console.log(
  '  绑定：' +
    register.coverage_summary.total_bindings +
    '；管理层：' +
    register.coverage_summary.binding_count_by_role_kind.MGT +
    '；执行岗位：' +
    register.coverage_summary.binding_count_by_role_kind.AGT
)
console.log('  Visual Identity Release：NOT_CREATED_PENDING_VIS_G5')
