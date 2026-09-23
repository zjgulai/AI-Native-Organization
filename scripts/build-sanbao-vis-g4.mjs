// 从既有角色合同与 VIS-G3 绑定表生成 53 条只读 Digital Persona Dossier 投影。
// 用法：
// node scripts/build-sanbao-vis-g4.mjs --output docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G4-DIGITAL-PERSONA-DOSSIERS-2026-09-24.json
// 边界：不复制角色合同或图片二进制；不创建 Visual Identity Release，不改页面、DSH、权限或运行状态。

import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { relative, resolve, sep } from 'node:path'

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
const digest = (value) => createHash('sha256').update(value).digest('hex')
const readJson = (value) => JSON.parse(readFileSync(absoluteProjectPath(value), 'utf8'))
const jsonClone = (value) => JSON.parse(JSON.stringify(value))

const fileReference = (value) => {
  const path = rootRelativePath(value)
  const content = readFileSync(absoluteProjectPath(path))
  return {
    path,
    content_sha256: digest(content),
    bytes: content.length
  }
}

const outputPath = rootRelativePath(requiredOption('--output'))
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
const roleCatalogPath = rootRelativePath(
  optionalOption('--role-catalog', 'docs/05-agents/role-catalog.json')
)
const managementCatalogPath = rootRelativePath(
  optionalOption(
    '--management-catalog',
    'docs/04-organization/management/management-catalog.json'
  )
)
const agentManagementGraphPath = rootRelativePath(
  optionalOption('--agent-management-graph', 'docs/05-agents/agent-management-graph.json')
)
const collaborationGraphPath = rootRelativePath(
  optionalOption('--collaboration-graph', 'docs/07-orchestration/collaboration-graph.json')
)
const agentPlaybookIndexPath = rootRelativePath(
  optionalOption('--agent-playbook-index', 'docs/06-playbooks/role-playbooks/index.json')
)
const agentPresetManifestPath = rootRelativePath(
  optionalOption(
    '--agent-preset-manifest',
    'docs/10-platform/deepseek-harness/preset-blueprints/manifest.json'
  )
)
const managementPresetManifestPath = rootRelativePath(
  optionalOption(
    '--management-preset-manifest',
    'docs/04-organization/management/preset-blueprints/manifest.json'
  )
)
const decisionRightsPath = rootRelativePath(
  optionalOption(
    '--decision-rights',
    'docs/04-organization/management/DECISION-RIGHTS.md'
  )
)
const enforcementPath = rootRelativePath(
  optionalOption('--management-enforcement', 'docs/04-organization/management/ENFORCEMENT.md')
)

const visG2 = readJson(visG2Path)
const visG3 = readJson(visG3Path)
const roleCatalog = readJson(roleCatalogPath)
const managementCatalog = readJson(managementCatalogPath)
const agentManagementGraph = readJson(agentManagementGraphPath)
const collaborationGraph = readJson(collaborationGraphPath)
const agentPlaybookIndex = readJson(agentPlaybookIndexPath)
const agentPresetManifest = readJson(agentPresetManifestPath)
const managementPresetManifest = readJson(managementPresetManifestPath)

assert(
  visG2.gate?.id === 'VIS-G2' &&
    visG2.gate?.status === 'COMPLETE_STRUCTURAL_SEMANTICS_WITH_G0_FINGERPRINT_EXCEPTION',
  'VIS-G2 不是当前可接受的结构性来源输入'
)
assert(
  visG3.gate?.id === 'VIS-G3' &&
    visG3.gate?.status === 'COMPLETE_BINDING_TABLE_PENDING_VIS_G5',
  'VIS-G3 绑定表尚未处于可投影状态'
)
assert(
  visG3.source_anchor?.canonicalization_acceptance?.decision_id === 'D-073' &&
    visG3.source_anchor?.canonicalization_acceptance?.status === 'ACCEPTED' &&
    visG3.source_anchor?.canonicalization_acceptance?.canonicalization?.version ===
      'VIS-G2-CANONICALIZATION-1' &&
    visG3.source_anchor?.canonicalization_acceptance?.legacy_g0_fingerprints?.status ===
      'RETAINED_HISTORICAL_NOT_VERIFIED',
  'VIS-G3 缺少 D-073 已接受的可复算来源锚点'
)
assert(roleCatalog.role_count === 50 && roleCatalog.roles?.length === 50, '执行岗位目录不是50项')
assert(
  managementCatalog.role_count === 3 && managementCatalog.roles?.length === 3,
  '管理层目录不是3项'
)
assert(
  agentPlaybookIndex.role_count === 50 && agentPlaybookIndex.roles?.length === 50,
  '执行岗位 Playbook 索引不是50项'
)
assert(agentPresetManifest.roles?.length === 50, '执行岗位 Preset manifest 不是50项')
assert(
  managementPresetManifest.role_count === 3 && managementPresetManifest.blueprints?.length === 3,
  '管理层 Preset manifest 不是3项'
)
assert(
  agentManagementGraph.role_bindings?.length === 50 &&
    collaborationGraph.role_contributions?.length === 50,
  '执行岗位治理或协同图谱不是50项'
)

const bindingByRoleId = new Map(visG3.bindings.map((binding) => [binding.role_id, binding]))
const agentRoleById = new Map(roleCatalog.roles.map((role) => [role.id, role]))
const managementRoleById = new Map(
  managementCatalog.roles.map((role) => [role.id, role])
)
const agentPlaybookByRoleId = new Map(
  agentPlaybookIndex.roles.map((entry) => [entry.role_id, entry])
)
const agentPresetManifestByRoleId = new Map(
  agentPresetManifest.roles.map((entry) => [entry.role_id, entry])
)
const managementPresetManifestByRoleId = new Map(
  managementPresetManifest.blueprints.map((entry) => [entry.role_id, entry])
)
const agentContractBindingByRoleId = new Map(
  agentManagementGraph.role_bindings.map((entry) => [entry.role_id, entry])
)
const agentContributionByRoleId = new Map(
  collaborationGraph.role_contributions.map((entry) => [entry.role_id, entry])
)

const addInput = (manifest, kind, roleId, reference) => {
  const key = [kind, roleId ?? '', reference.path].join('\u0000')
  if (!manifest.has(key)) {
    manifest.set(key, { kind, role_id: roleId ?? null, ...reference })
  }
}

const globalInputManifest = new Map()
const globalReferences = {
  vis_g2_register: fileReference(visG2Path),
  vis_g3_bindings: fileReference(visG3Path),
  role_catalog: fileReference(roleCatalogPath),
  management_catalog: fileReference(managementCatalogPath),
  agent_management_graph: fileReference(agentManagementGraphPath),
  collaboration_graph: fileReference(collaborationGraphPath),
  agent_playbook_index: fileReference(agentPlaybookIndexPath),
  agent_preset_manifest: fileReference(agentPresetManifestPath),
  management_preset_manifest: fileReference(managementPresetManifestPath),
  management_decision_rights: fileReference(decisionRightsPath),
  management_enforcement: fileReference(enforcementPath)
}

for (const [kind, reference] of Object.entries(globalReferences)) {
  addInput(globalInputManifest, kind, null, reference)
}

const publicFieldAllowlist = [
  'display_name',
  'role_title',
  'mission',
  'standard_artifact',
  'approved_visual_identity_release_after_VIS-G5',
  'neutral_alt_text_after_VIS-G5'
]

const visualIdentityProjection = (binding) => ({
  binding_id: binding.binding_id,
  source_persona_id: binding.source_persona_id,
  source_persona_name: binding.source_persona_name,
  source_context_status: binding.source_context_status,
  binding_status: binding.binding_status,
  visual_identity_release: jsonClone(binding.visual_identity_release),
  rendering_policy: jsonClone(binding.presentation.rendering_policy),
  asset_refs_by_theme: jsonClone(binding.presentation.themes),
  alt_text: jsonClone(binding.presentation.alt_text),
  binary_and_visual_quality_status: 'PENDING_VIS_G5'
})

const commonBoundaryAssertions = () => ({
  role_contract_impact: 'NONE',
  runtime_or_access_impact: 'NONE',
  dsh_operation: 'NONE',
  visual_identity_release_operation: 'NONE',
  image_binary_operation: 'NONE',
  page_or_publication_operation: 'NONE',
  candidate_pool_reassignment: 'NONE'
})

const commonPresentationProjection = () => ({
  status: 'NOT_RENDERABLE_PENDING_VIS_G5_AND_VIS_G6',
  public_field_allowlist: publicFieldAllowlist,
  page_integration_status: 'NOT_STARTED_VIS_G6',
  publication_status: 'NOT_STARTED_VIS_G6'
})

const agentDossier = (role) => {
  const binding = bindingByRoleId.get(role.id)
  const playbookIndexEntry = agentPlaybookByRoleId.get(role.id)
  const manifestEntry = agentPresetManifestByRoleId.get(role.id)
  const contractBinding = agentContractBindingByRoleId.get(role.id)
  const contribution = agentContributionByRoleId.get(role.id)

  assert(binding?.role_kind === 'AGT', '执行岗位缺少 VIS-G3 绑定：' + role.id)
  assert(playbookIndexEntry, '执行岗位缺少 Playbook 索引：' + role.id)
  assert(manifestEntry, '执行岗位缺少 Preset manifest 项：' + role.id)
  assert(contractBinding, '执行岗位缺少五契约绑定：' + role.id)
  assert(contribution, '执行岗位缺少协同图谱贡献项：' + role.id)
  assert(binding.source_persona_id === role.id, '执行岗位必须同 ID 映射：' + role.id)
  assert(
    playbookIndexEntry.role_title === role.title &&
      playbookIndexEntry.shared_playbooks.join('\u0000') === role.playbooks.join('\u0000'),
    '执行岗位 Playbook 索引语义不一致：' + role.id
  )
  assert(
    manifestEntry.preset_id === playbookIndexEntry.preset_id &&
      manifestEntry.soul_ref === playbookIndexEntry.soul_ref &&
      manifestEntry.role_playbook_ref === playbookIndexEntry.playbook_ref &&
      manifestEntry.role_profile_ref === 'docs/05-agents/roles/' + role.id + '.md',
    '执行岗位 Preset manifest 引用不一致：' + role.id
  )

  const presetReference = fileReference(playbookIndexEntry.preset_ref)
  const preset = readJson(playbookIndexEntry.preset_ref)
  const roleProfileReference = fileReference(manifestEntry.role_profile_ref)
  const soulReference = fileReference(manifestEntry.soul_ref)
  const rolePlaybookReference = fileReference(manifestEntry.role_playbook_ref)

  for (const [kind, reference] of [
    ['agent_role_profile', roleProfileReference],
    ['agent_soul_contract', soulReference],
    ['agent_role_playbook', rolePlaybookReference],
    ['agent_preset_blueprint', presetReference]
  ]) {
    addInput(globalInputManifest, kind, role.id, reference)
  }

  assert(
    preset.role_id === role.id &&
      preset.preset_id === manifestEntry.preset_id &&
      preset.status === 'blueprint_only_not_importable' &&
      preset.role_profile_ref === manifestEntry.role_profile_ref &&
      preset.soul_ref === manifestEntry.soul_ref &&
      preset.role_playbook_ref === manifestEntry.role_playbook_ref,
    '执行岗位 Blueprint 标识或合同引用不一致：' + role.id
  )
  assert(
    preset.identity?.alias === role.alias &&
      preset.identity?.title === role.title &&
      preset.identity?.mission === role.mission &&
      preset.identity?.personality === role.personality &&
      preset.identity?.soul_principle === role.principle,
    '执行岗位 Blueprint 身份语义不一致：' + role.id
  )
  assert(
    preset.skills?.map((skill) => skill.name).join('\u0000') === role.skills.join('\u0000') &&
      preset.shared_playbooks?.join('\u0000') === role.playbooks.join('\u0000'),
    '执行岗位 Blueprint 技能或共享 Playbook 不一致：' + role.id
  )
  assert(
    preset.modes?.standalone?.can_execute_assets === false &&
      preset.modes?.composition?.peer_chat === false &&
      preset.modes?.composition?.re_delegation === false &&
      preset.assurance?.production_authorized === false &&
      role.production_authorized === false &&
      contribution.runtime_agent_created_by_binding === false,
    '执行岗位 Dossier 不能升级为资产执行或运行授权：' + role.id
  )
  assert(
    contractBinding.contracts?.length === 5 &&
      contractBinding.can_publish_own_change === false &&
      contractBinding.can_hold_service_identity === false &&
      contractBinding.production_authorized === false,
    '执行岗位五契约治理不完整：' + role.id
  )

  return {
    dossier_id: 'DPD-' + role.id,
    dossier_schema_version: '1.0',
    dossier_status: 'STRUCTURAL_DOSSIER_PENDING_VIS_G5',
    role: {
      role_id: role.id,
      role_kind: 'AGT',
      display_name: role.alias,
      title: role.title,
      organization_placement: {
        business_group: role.group,
        plane_id: contractBinding.plane_id,
        domain_view_id: contribution.domain_view_id
      },
      mission: role.mission,
      standard_artifact: role.artifact,
      metrics: [role.metrics],
      role_design_status: role.status,
      production_authorized: false,
      semantic_authority: {
        source: 'PROJECT_ROLE_CATALOG_ONLY',
        catalog_version: roleCatalog.version,
        catalog_ref: globalReferences.role_catalog
      }
    },
    persona: {
      personality: role.personality,
      principles: [role.principle],
      behavioral_contract_policy: 'REFERENCES_ARE_AUTHORITATIVE_NO_CONTRACT_REWRITE',
      role_profile_ref: roleProfileReference,
      soul_contract_ref: soulReference,
      role_playbook_ref: rolePlaybookReference,
      preset_blueprint_ref: presetReference
    },
    capability: {
      skills: jsonClone(preset.skills),
      flow_ids: jsonClone(role.flows),
      scenario_ids: jsonClone(role.scenarios),
      shared_playbook_ids: jsonClone(role.playbooks),
      role_playbook_id: playbookIndexEntry.playbook_id
    },
    collaboration: {
      related_role_ids: jsonClone(role.collaborates_with),
      standalone_mode: jsonClone(preset.modes.standalone),
      case_composition_mode: jsonClone(preset.modes.composition),
      contribution_to_flows: {
        primary_eligible_flow_ids: jsonClone(contribution.primary_eligible_flow_ids),
        eligible_flow_ids: jsonClone(contribution.eligible_flow_ids),
        contribution_modes: jsonClone(contribution.contribution_modes),
        handoff_boundary: 'ACCEPTED_STAGE_ARTIFACT_TO_ARTIFACT_ENVELOPE_ONLY'
      }
    },
    governance: {
      contract_model: 'FIVE_CONTRACT_ROLE_GOVERNANCE',
      contract_bindings: jsonClone(contractBinding.contracts),
      release_rules: {
        self_publish: agentManagementGraph.release_rules.self_publish,
        bundle_immutable: agentManagementGraph.release_rules.bundle_immutable,
        in_place_contract_mutation: agentManagementGraph.release_rules.in_place_contract_mutation,
        case_bundle_pinned: agentManagementGraph.release_rules.case_bundle_pinned,
        service_identity_holder: agentManagementGraph.release_rules.service_identity_holder
      },
      role_release_bundle: {
        instance_id: null,
        status: 'NOT_INSTANTIATED_REFERENCE_ONLY',
        operation: 'NONE'
      },
      tools: jsonClone(preset.tools),
      access: jsonClone(preset.access),
      assurance: jsonClone(preset.assurance),
      dsh_projection: jsonClone(preset.dsh_projection)
    },
    visual_identity: visualIdentityProjection(binding),
    source_contract_exceptions: [],
    source_versions: {
      visual_binding_ref: globalReferences.vis_g3_bindings,
      source_anchor: {
        commit: visG3.source_anchor.commit,
        tree: visG3.source_anchor.tree,
        canonicalization_version:
          visG3.source_anchor.canonicalization_acceptance.canonicalization.version,
        legacy_g0_fingerprint_status:
          visG3.source_anchor.canonicalization_acceptance.legacy_g0_fingerprints.status
      },
      role_catalog_version: roleCatalog.version,
      role_playbook_index_version: agentPlaybookIndex.version,
      preset_manifest_schema_version: agentPresetManifest.schema_version
    },
    presentation_projection: commonPresentationProjection(),
    boundary_assertions: commonBoundaryAssertions()
  }
}

const managementContractExceptions = (role, preset) => {
  const exceptions = []
  if (preset.modes?.standalone?.completion_artifact !== role.artifact) {
    exceptions.push({
      exception_id: 'MGT-DOSSIER-SOURCE-ARTIFACT-' + role.id,
      status: 'SOURCE_FIELD_NONAUTHORITATIVE_PENDING_RP_REMEDIATION',
      source: 'management_preset_blueprint.modes.standalone.completion_artifact',
      observed_source_value: preset.modes?.standalone?.completion_artifact ?? null,
      authoritative_value: role.artifact,
      authority: 'MANAGEMENT_CATALOG_ONLY',
      impact: 'Dossier keeps the management-catalog primary artifact; no Blueprint is modified by VIS-G4.'
    })
  }
  if (
    role.id !== 'MGT-001' &&
    preset.access?.scope_source === 'read-only aggregate view contract for MGT-001'
  ) {
    exceptions.push({
      exception_id: 'MGT-DOSSIER-SOURCE-ACCESS-' + role.id,
      status: 'SOURCE_FIELD_NONAUTHORITATIVE_PENDING_RP_REMEDIATION',
      source: 'management_preset_blueprint.access.scope_source',
      observed_source_value: preset.access.scope_source,
      authoritative_value: 'ROLE_SPECIFIC_READ_ONLY_AGGREGATE_SCOPE_REQUIRED',
      authority: 'ROLE_PROFILE_AND_ROLE_PLAYBOOK_PENDING_TARGET_CONTRACT',
      impact: 'Dossier does not infer data access from this mismatched Blueprint field; default deny and no asset execution remain in force.'
    })
  }
  return exceptions
}

const managementAccessProjection = (preset, exceptions) => ({
  default_decision: preset.access.default_decision,
  visible: preset.access.visible,
  not_visible: preset.access.not_visible,
  service_identity_holder: preset.access.service_identity_holder,
  expiry_required: preset.access.expiry_required,
  audit_required: preset.access.audit_required,
  scope_source_status: exceptions.some((entry) => entry.source.endsWith('access.scope_source'))
    ? 'SOURCE_FIELD_NONAUTHORITATIVE_PENDING_RP_REMEDIATION'
    : 'BLUEPRINT_REFERENCE_PENDING_TARGET_CONTRACT'
})

const managementDossier = (role) => {
  const binding = bindingByRoleId.get(role.id)
  const manifestEntry = managementPresetManifestByRoleId.get(role.id)

  assert(binding?.role_kind === 'MGT', '管理层缺少 VIS-G3 绑定：' + role.id)
  assert(manifestEntry, '管理层缺少 Preset manifest 项：' + role.id)
  const presetReference = fileReference(manifestEntry.blueprint_ref)
  const preset = readJson(manifestEntry.blueprint_ref)
  const roleProfileReference = fileReference(preset.role_profile_ref)
  const soulReference = fileReference(manifestEntry.soul_ref)
  const rolePlaybookReference = fileReference(manifestEntry.role_playbook_ref)

  for (const [kind, reference] of [
    ['management_role_profile', roleProfileReference],
    ['management_soul_contract', soulReference],
    ['management_role_playbook', rolePlaybookReference],
    ['management_preset_blueprint', presetReference]
  ]) {
    addInput(globalInputManifest, kind, role.id, reference)
  }

  assert(
    preset.role_id === role.id &&
      preset.preset_id === manifestEntry.preset_id &&
      preset.status === 'blueprint_only_not_importable' &&
      preset.soul_ref === manifestEntry.soul_ref &&
      preset.role_playbook_ref === manifestEntry.role_playbook_ref &&
      preset.decision_rights_ref === decisionRightsPath,
    '管理层 Blueprint 标识或合同引用不一致：' + role.id
  )
  assert(
    preset.identity?.alias === role.alias &&
      preset.identity?.title === role.title &&
      preset.identity?.mission === role.mission &&
      preset.identity?.personality === role.personality &&
      preset.identity?.soul_principle === role.principle &&
      preset.identity?.primary_artifact === role.artifact,
    '管理层 Blueprint 身份语义不一致：' + role.id
  )
  assert(
    preset.modes?.standalone?.can_emit_action_intent === false &&
      preset.modes?.standalone?.can_execute_assets === false &&
      preset.modes?.composition?.case_role_participation === 'none' &&
      preset.modes?.composition?.lead_or_worker === false &&
      preset.modes?.composition?.peer_chat === false &&
      preset.modes?.composition?.re_delegation === false &&
      preset.assurance?.production_authorized === false &&
      role.production_authorized === false,
    '管理层 Dossier 不能升级为 Case、资产执行或运行授权：' + role.id
  )

  const sourceContractExceptions = managementContractExceptions(role, preset)
  const expectedSourcePersonaByRoleId = {
    'MGT-001': 'AGT-067',
    'MGT-002': 'AGT-090',
    'MGT-003': 'AGT-056'
  }
  assert(
    binding.source_persona_id === expectedSourcePersonaByRoleId[role.id] &&
      binding.role_display_name === role.alias &&
      binding.role_title === role.title &&
      binding.role_catalog_authority.semantic_display_policy === 'MANAGEMENT_CATALOG_ONLY',
    '管理层视觉来源或角色语义错误：' + role.id
  )

  return {
    dossier_id: 'DPD-' + role.id,
    dossier_schema_version: '1.0',
    dossier_status: 'STRUCTURAL_DOSSIER_PENDING_VIS_G5',
    role: {
      role_id: role.id,
      role_kind: 'MGT',
      display_name: role.alias,
      title: role.title,
      organization_placement: {
        layer: role.layer,
        management_domain: role.management_domain,
        owned_role_ids: jsonClone(role.owned_role_ids),
        owned_role_count: role.owned_role_count
      },
      mission: role.mission,
      standard_artifact: role.artifact,
      metrics: jsonClone(role.metrics),
      role_design_status: role.status,
      production_authorized: false,
      semantic_authority: {
        source: 'MANAGEMENT_CATALOG_ONLY',
        catalog_version: managementCatalog.version,
        structure_version: managementCatalog.structure_version,
        catalog_ref: globalReferences.management_catalog
      }
    },
    persona: {
      personality: role.personality,
      principles: [role.principle, role.second_principle].filter(Boolean),
      behavioral_contract_policy: 'REFERENCES_ARE_AUTHORITATIVE_NO_CONTRACT_REWRITE',
      role_profile_ref: roleProfileReference,
      soul_contract_ref: soulReference,
      role_playbook_ref: rolePlaybookReference,
      preset_blueprint_ref: presetReference
    },
    capability: {
      skills: jsonClone(preset.skills),
      flow_ids: jsonClone(role.flows),
      scenario_ids: [],
      shared_playbook_ids: [],
      role_playbook_id: 'RPB-' + role.id
    },
    collaboration: {
      related_role_ids: jsonClone(role.collaborates_with),
      standalone_mode: jsonClone(preset.modes.standalone),
      case_composition_mode: jsonClone(preset.modes.composition),
      management_interface: jsonClone(preset.modes.interface),
      decision_rights: jsonClone(role.decision_rights),
      decision_rights_explicitly_not_granted: jsonClone(
        role.decision_rights_explicitly_not_granted
      ),
      decision_rights_ref: globalReferences.management_decision_rights,
      enforcement_ref: globalReferences.management_enforcement,
      handoff_boundary: 'VERSIONED_MANAGEMENT_CONTRACT_AND_QUOTA_OR_REPORT_TO_HUMAN_OWNER_ONLY'
    },
    governance: {
      contract_model: 'MANAGEMENT_DECISION_CONTRACTS',
      domain_tension: role.domain_tension,
      business_boundary: role.boundary,
      role_release_bundle: {
        instance_id: null,
        status: 'NOT_INSTANTIATED_REFERENCE_ONLY',
        operation: 'NONE'
      },
      tools: jsonClone(preset.tools),
      access: managementAccessProjection(preset, sourceContractExceptions),
      assurance: jsonClone(preset.assurance),
      dsh_projection: jsonClone(preset.dsh_projection)
    },
    visual_identity: visualIdentityProjection(binding),
    source_contract_exceptions: sourceContractExceptions,
    source_versions: {
      visual_binding_ref: globalReferences.vis_g3_bindings,
      source_anchor: {
        commit: visG3.source_anchor.commit,
        tree: visG3.source_anchor.tree,
        canonicalization_version:
          visG3.source_anchor.canonicalization_acceptance.canonicalization.version,
        legacy_g0_fingerprint_status:
          visG3.source_anchor.canonicalization_acceptance.legacy_g0_fingerprints.status
      },
      management_catalog_version: managementCatalog.version,
      management_structure_version: managementCatalog.structure_version,
      preset_manifest_version: managementPresetManifest.version
    },
    presentation_projection: commonPresentationProjection(),
    boundary_assertions: commonBoundaryAssertions()
  }
}

const managementDossiers = managementCatalog.roles
  .slice()
  .sort((left, right) => left.id.localeCompare(right.id, 'en'))
  .map(managementDossier)
const agentDossiers = roleCatalog.roles
  .slice()
  .sort((left, right) => left.id.localeCompare(right.id, 'en'))
  .map(agentDossier)
const dossiers = [...managementDossiers, ...agentDossiers]

assert(dossiers.length === 53, 'VIS-G4 必须生成53条 Dossier')
assert(
  new Set(dossiers.map((dossier) => dossier.dossier_id)).size === dossiers.length &&
    new Set(dossiers.map((dossier) => dossier.role.role_id)).size === dossiers.length &&
    new Set(dossiers.map((dossier) => dossier.visual_identity.binding_id)).size === dossiers.length &&
    new Set(dossiers.map((dossier) => dossier.visual_identity.source_persona_id)).size ===
      dossiers.length,
  'VIS-G4 Dossier、角色、绑定或源人物 ID 出现重复'
)

const inputManifest = [...globalInputManifest.values()].sort((left, right) => {
  const leftKey = [left.kind, left.role_id ?? '', left.path].join('\u0000')
  const rightKey = [right.kind, right.role_id ?? '', right.path].join('\u0000')
  return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0
})
const canonicalInput = inputManifest
  .map((entry) => [entry.kind, entry.role_id ?? '', entry.path, entry.content_sha256].join('\t') + '\n')
  .join('')

const register = {
  schema_version: '1.0',
  register_id: 'VIS-G4-SANBAO-WEB-DIGITAL-PERSONA-DOSSIERS-2026-09-24',
  generated_on: '2026-09-24',
  gate: {
    id: 'VIS-G4',
    status: 'COMPLETE_DOSSIER_PROJECTION_PENDING_VIS_G5',
    scope: [
      '53 independently addressable read-only Digital Persona Dossier projections',
      'role-design, governance, and VIS-G3 structural visual-binding references',
      'role source facts and visual facts retained as separate authorities'
    ],
    excluded: [
      'image binary download, copy, editing, derivation, pixel/MIME validation, or visual preview',
      'Visual Identity Release creation, page integration, publication, DSH import, or runtime operation',
      'role-contract, Access, Role Release Bundle, Case Control, organizational, or production-state mutation'
    ]
  },
  reproducibility: {
    canonicalization: {
      version: 'VIS-G4-INPUT-CANONICALIZATION-1',
      algorithm: 'SHA-256',
      input_sorting: 'Unicode code-point order by kind, role_id, path',
      line_format: 'kind<TAB>role_id<TAB>path<TAB>content_sha256<LF>'
    },
    canonical_input_digest_sha256: digest(canonicalInput),
    input_manifest: inputManifest
  },
  visual_source_anchor: {
    repository: visG3.source_anchor.repository,
    commit: visG3.source_anchor.commit,
    tree: visG3.source_anchor.tree,
    vis_g2_register_id: visG3.source_anchor.vis_g2_register_id,
    vis_g3_register_id: visG3.register_id,
    canonicalization_acceptance: {
      decision_id: 'D-073',
      status: 'ACCEPTED',
      canonicalization_version:
        visG3.source_anchor.canonicalization_acceptance.canonicalization.version,
      legacy_g0_fingerprint_status:
        visG3.source_anchor.canonicalization_acceptance.legacy_g0_fingerprints.status
    }
  },
  dossier_policy: {
    decision_id: 'D-074',
    role_semantics: 'PROJECT_ROLE_CATALOG_OR_MANAGEMENT_CATALOG_ONLY',
    behavioral_contracts: 'REFERENCES_AND_CONTENT_HASHES_ONLY_NO_CONTRACT_REWRITE',
    visual_identity: 'VIS-G3_BINDING_REFERENCE_ONLY',
    visual_identity_release: 'NOT_CREATED_PENDING_VIS_G5',
    role_release_bundle: 'NOT_INSTANTIATED_REFERENCE_ONLY',
    page_and_publication: 'NOT_STARTED_PENDING_VIS_G5_AND_VIS_G6',
    runtime_and_access: 'NO_CHANGE'
  },
  dossiers,
  coverage_summary: {
    total_dossiers: dossiers.length,
    dossier_count_by_role_kind: {
      MGT: managementDossiers.length,
      AGT: agentDossiers.length
    },
    independent_role_id_count: new Set(dossiers.map((dossier) => dossier.role.role_id)).size,
    unique_visual_binding_count: new Set(
      dossiers.map((dossier) => dossier.visual_identity.binding_id)
    ).size,
    unique_source_persona_count: new Set(
      dossiers.map((dossier) => dossier.visual_identity.source_persona_id)
    ).size,
    visual_status: 'STRUCTURAL_BINDING_PENDING_VIS_G5',
    visual_identity_release: 'NOT_CREATED_PENDING_VIS_G5',
    source_contract_exception_count: dossiers.reduce(
      (count, dossier) => count + dossier.source_contract_exceptions.length,
      0
    )
  },
  next_gates: [
    {
      id: 'G4-OUT-001',
      status: 'PENDING',
      subject: 'Actual binary, MIME, dimensions, perceptual duplicate, preview, crop, small-size, and final alt-text acceptance',
      owner_gate: 'VIS-G5'
    },
    {
      id: 'G4-OUT-002',
      status: 'NOT_STARTED',
      subject: 'Visual Identity Release, page integration, publication, and future-role reuse',
      owner_gate: 'VIS-G6'
    },
    {
      id: 'G4-OUT-003',
      status: 'OPEN_SOURCE_EXCEPTION',
      subject: 'MGT Blueprint source-field discrepancies retained as non-authoritative dossier exceptions',
      owner_gate: 'ROLE_PRESET_REMEDIATION_SEPARATE_AUTHORIZATION'
    }
  ]
}

writeFileSync(absoluteProjectPath(outputPath), JSON.stringify(register, null, 2) + '\n')
console.log('PASS VIS-G4 Digital Persona Dossier 登记册已生成：' + absoluteProjectPath(outputPath))
console.log(
  '  Dossier：' +
    register.coverage_summary.total_dossiers +
    '；管理层：' +
    register.coverage_summary.dossier_count_by_role_kind.MGT +
    '；执行岗位：' +
    register.coverage_summary.dossier_count_by_role_kind.AGT
)
console.log(
  '  角色合同例外：' +
    register.coverage_summary.source_contract_exception_count +
    '；Visual Identity Release：NOT_CREATED_PENDING_VIS_G5'
)
