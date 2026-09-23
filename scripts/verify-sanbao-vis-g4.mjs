// 校验 VIS-G4 Digital Persona Dossier 登记册。
// 本校验只核验角色合同投影、来源复算和视觉绑定边界；不读取或下载图像二进制。

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
const jsonClone = (value) => JSON.parse(JSON.stringify(value))

const dossiersPath = rootRelativePath(
  optionalOption(
    '--dossiers',
    'docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G4-DIGITAL-PERSONA-DOSSIERS-2026-09-24.json'
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

const register = readJson(dossiersPath)
const visG3 = readJson(visG3Path)
const roleCatalog = readJson(roleCatalogPath)
const managementCatalog = readJson(managementCatalogPath)
const agentManagementGraph = readJson(agentManagementGraphPath)
const collaborationGraph = readJson(collaborationGraphPath)
const agentPlaybookIndex = readJson(agentPlaybookIndexPath)
const agentPresetManifest = readJson(agentPresetManifestPath)
const managementPresetManifest = readJson(managementPresetManifestPath)
const dossiers = register.dossiers

assert(register.schema_version === '1.0', 'VIS-G4 schema_version 不正确')
assert(
  register.register_id === 'VIS-G4-SANBAO-WEB-DIGITAL-PERSONA-DOSSIERS-2026-09-24',
  'VIS-G4 register_id 不正确'
)
assert(
  register.gate?.id === 'VIS-G4' &&
    register.gate?.status === 'COMPLETE_DOSSIER_PROJECTION_PENDING_VIS_G5',
  'VIS-G4 门状态不正确'
)
assert(
  register.dossier_policy?.decision_id === 'D-074' &&
    register.dossier_policy?.role_semantics ===
      'PROJECT_ROLE_CATALOG_OR_MANAGEMENT_CATALOG_ONLY' &&
    register.dossier_policy?.visual_identity === 'VIS-G3_BINDING_REFERENCE_ONLY' &&
    register.dossier_policy?.visual_identity_release === 'NOT_CREATED_PENDING_VIS_G5' &&
    register.dossier_policy?.runtime_and_access === 'NO_CHANGE',
  'VIS-G4 决定或治理边界不完整'
)
assert(
  visG3.gate?.id === 'VIS-G3' &&
    visG3.gate?.status === 'COMPLETE_BINDING_TABLE_PENDING_VIS_G5' &&
    register.visual_source_anchor?.commit === visG3.source_anchor?.commit &&
    register.visual_source_anchor?.tree === visG3.source_anchor?.tree &&
    register.visual_source_anchor?.vis_g3_register_id === visG3.register_id &&
    register.visual_source_anchor?.canonicalization_acceptance?.decision_id === 'D-073' &&
    register.visual_source_anchor?.canonicalization_acceptance?.status === 'ACCEPTED' &&
    register.visual_source_anchor?.canonicalization_acceptance?.canonicalization_version ===
      'VIS-G2-CANONICALIZATION-1' &&
    register.visual_source_anchor?.canonicalization_acceptance
      ?.legacy_g0_fingerprint_status === 'RETAINED_HISTORICAL_NOT_VERIFIED',
  'VIS-G4 与 VIS-G3 的来源锚点不一致'
)

assert(Array.isArray(dossiers) && dossiers.length === 53, 'VIS-G4 必须有53条 Dossier')
assert(
  new Set(dossiers.map((dossier) => dossier.dossier_id)).size === dossiers.length &&
    new Set(dossiers.map((dossier) => dossier.role?.role_id)).size === dossiers.length &&
    new Set(dossiers.map((dossier) => dossier.visual_identity?.binding_id)).size ===
      dossiers.length &&
    new Set(dossiers.map((dossier) => dossier.visual_identity?.source_persona_id)).size ===
      dossiers.length,
  'VIS-G4 Dossier、角色、绑定或源人物 ID 存在重复'
)
assert(
  register.coverage_summary?.total_dossiers === 53 &&
    register.coverage_summary?.dossier_count_by_role_kind?.MGT === 3 &&
    register.coverage_summary?.dossier_count_by_role_kind?.AGT === 50 &&
    register.coverage_summary?.independent_role_id_count === 53 &&
    register.coverage_summary?.unique_visual_binding_count === 53 &&
    register.coverage_summary?.unique_source_persona_count === 53 &&
    register.coverage_summary?.visual_status === 'STRUCTURAL_BINDING_PENDING_VIS_G5' &&
    register.coverage_summary?.visual_identity_release === 'NOT_CREATED_PENDING_VIS_G5' &&
    register.coverage_summary?.source_contract_exception_count === 4,
  'VIS-G4 覆盖统计不正确'
)

const canonicalization = register.reproducibility?.canonicalization
assert(
  canonicalization?.version === 'VIS-G4-INPUT-CANONICALIZATION-1' &&
    canonicalization?.algorithm === 'SHA-256' &&
    canonicalization?.input_sorting === 'Unicode code-point order by kind, role_id, path' &&
    canonicalization?.line_format === 'kind<TAB>role_id<TAB>path<TAB>content_sha256<LF>',
  'VIS-G4 输入指纹规则不完整'
)
const inputManifest = register.reproducibility?.input_manifest
assert(Array.isArray(inputManifest) && inputManifest.length === 223, 'VIS-G4 输入清单覆盖不完整')
const inputKeys = new Set()
for (const input of inputManifest) {
  assert(
    typeof input.kind === 'string' &&
      typeof input.path === 'string' &&
      /^[a-f0-9]{64}$/.test(input.content_sha256) &&
      Number.isInteger(input.bytes) &&
      input.bytes >= 0,
    'VIS-G4 输入清单字段不正确：' + JSON.stringify(input)
  )
  const key = [input.kind, input.role_id ?? '', input.path].join('\u0000')
  assert(!inputKeys.has(key), 'VIS-G4 输入清单存在重复：' + key)
  inputKeys.add(key)
  const content = readFileSync(absoluteProjectPath(input.path))
  assert(
    digest(content) === input.content_sha256 && content.length === input.bytes,
    'VIS-G4 输入内容或哈希漂移：' + input.path
  )
}
const sortedInputManifest = inputManifest.slice().sort((left, right) => {
  const leftKey = [left.kind, left.role_id ?? '', left.path].join('\u0000')
  const rightKey = [right.kind, right.role_id ?? '', right.path].join('\u0000')
  return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0
})
assert(
  JSON.stringify(sortedInputManifest) === JSON.stringify(inputManifest),
  'VIS-G4 输入清单未按确定性规则排序'
)
const canonicalInput = inputManifest
  .map((input) => [input.kind, input.role_id ?? '', input.path, input.content_sha256].join('\t') + '\n')
  .join('')
assert(
  digest(canonicalInput) === register.reproducibility?.canonical_input_digest_sha256,
  'VIS-G4 输入目录指纹不可复算'
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

const expectedVisualIdentity = (binding) => ({
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

const assertReference = (reference, expectedPath, label) => {
  assert(
    reference?.path === expectedPath &&
      /^[a-f0-9]{64}$/.test(reference.content_sha256) &&
      Number.isInteger(reference.bytes),
    label + '引用字段不正确'
  )
  const content = readFileSync(absoluteProjectPath(reference.path))
  assert(
    digest(content) === reference.content_sha256 && content.length === reference.bytes,
    label + '引用内容漂移'
  )
}

const assertCommonDossierBoundary = (dossier, binding) => {
  assert(
    dossier.dossier_schema_version === '1.0' &&
      dossier.dossier_status === 'STRUCTURAL_DOSSIER_PENDING_VIS_G5' &&
      dossier.role?.production_authorized === false &&
      JSON.stringify(dossier.visual_identity) === JSON.stringify(expectedVisualIdentity(binding)),
    'Dossier 基本状态或视觉绑定不正确：' + dossier.dossier_id
  )
  assert(
    dossier.visual_identity.binding_status === 'STRUCTURAL_BINDING_PENDING_VIS_G5' &&
      dossier.visual_identity.visual_identity_release?.status ===
        'NOT_CREATED_PENDING_VIS_G5' &&
      dossier.visual_identity.rendering_policy?.binary_quality_status === 'PENDING_VIS_G5' &&
      dossier.visual_identity.alt_text?.status === 'DRAFT_NEUTRAL_TEXT_PENDING_VIS_G5',
    'Dossier 不得越过 VIS-G5：' + dossier.dossier_id
  )
  assert(
    dossier.presentation_projection?.status === 'NOT_RENDERABLE_PENDING_VIS_G5_AND_VIS_G6' &&
      dossier.presentation_projection?.page_integration_status === 'NOT_STARTED_VIS_G6' &&
      dossier.presentation_projection?.publication_status === 'NOT_STARTED_VIS_G6' &&
      dossier.boundary_assertions?.role_contract_impact === 'NONE' &&
      dossier.boundary_assertions?.runtime_or_access_impact === 'NONE' &&
      dossier.boundary_assertions?.dsh_operation === 'NONE' &&
      dossier.boundary_assertions?.visual_identity_release_operation === 'NONE' &&
      dossier.boundary_assertions?.image_binary_operation === 'NONE' &&
      dossier.boundary_assertions?.page_or_publication_operation === 'NONE' &&
      dossier.boundary_assertions?.candidate_pool_reassignment === 'NONE',
    'Dossier 展示或运行边界错误：' + dossier.dossier_id
  )
  assert(
    dossier.governance?.role_release_bundle?.instance_id === null &&
      dossier.governance?.role_release_bundle?.status === 'NOT_INSTANTIATED_REFERENCE_ONLY' &&
      dossier.governance?.role_release_bundle?.operation === 'NONE',
    'Dossier 不得把 Role Release Bundle 写成已实例化：' + dossier.dossier_id
  )
}

const expectedMgtSourcePersonaByRoleId = {
  'MGT-001': 'AGT-067',
  'MGT-002': 'AGT-090',
  'MGT-003': 'AGT-056'
}

for (const dossier of dossiers) {
  const roleId = dossier.role?.role_id
  const binding = bindingByRoleId.get(roleId)
  assert(binding, 'Dossier 引用了不存在的 VIS-G3 角色绑定：' + dossier.dossier_id)
  assertCommonDossierBoundary(dossier, binding)

  if (dossier.role.role_kind === 'AGT') {
    const role = agentRoleById.get(roleId)
    const playbookIndexEntry = agentPlaybookByRoleId.get(roleId)
    const manifestEntry = agentPresetManifestByRoleId.get(roleId)
    const contractBinding = agentContractBindingByRoleId.get(roleId)
    const contribution = agentContributionByRoleId.get(roleId)
    assert(
      role && playbookIndexEntry && manifestEntry && contractBinding && contribution,
      '执行岗位缺少权威输入：' + roleId
    )
    const preset = readJson(playbookIndexEntry.preset_ref)
    assert(
      dossier.dossier_id === 'DPD-' + roleId &&
        binding.role_kind === 'AGT' &&
        binding.source_persona_id === roleId &&
        dossier.role.display_name === role.alias &&
        dossier.role.title === role.title &&
        dossier.role.organization_placement.business_group === role.group &&
        dossier.role.organization_placement.plane_id === contractBinding.plane_id &&
        dossier.role.organization_placement.domain_view_id === contribution.domain_view_id &&
        dossier.role.mission === role.mission &&
        dossier.role.standard_artifact === role.artifact &&
        dossier.role.metrics?.join('\u0000') === [role.metrics].join('\u0000') &&
        dossier.role.role_design_status === role.status &&
        dossier.role.semantic_authority?.source === 'PROJECT_ROLE_CATALOG_ONLY' &&
        dossier.role.semantic_authority?.catalog_version === roleCatalog.version,
      '执行岗位角色语义投影不正确：' + roleId
    )
    assertReference(
      dossier.persona?.role_profile_ref,
      manifestEntry.role_profile_ref,
      roleId + ' Role Profile'
    )
    assertReference(dossier.persona?.soul_contract_ref, manifestEntry.soul_ref, roleId + ' Soul')
    assertReference(
      dossier.persona?.role_playbook_ref,
      manifestEntry.role_playbook_ref,
      roleId + ' Role Playbook'
    )
    assertReference(
      dossier.persona?.preset_blueprint_ref,
      playbookIndexEntry.preset_ref,
      roleId + ' Preset Blueprint'
    )
    assert(
      dossier.persona?.personality === role.personality &&
        dossier.persona?.principles?.join('\u0000') === [role.principle].join('\u0000') &&
        dossier.persona?.behavioral_contract_policy ===
          'REFERENCES_ARE_AUTHORITATIVE_NO_CONTRACT_REWRITE' &&
        preset.role_id === roleId &&
        preset.status === 'blueprint_only_not_importable' &&
        preset.identity.alias === role.alias &&
        preset.identity.title === role.title &&
        preset.identity.mission === role.mission &&
        preset.identity.personality === role.personality &&
        preset.identity.soul_principle === role.principle,
      '执行岗位人格或 Blueprint 身份投影不正确：' + roleId
    )
    assert(
      JSON.stringify(dossier.capability?.skills) === JSON.stringify(preset.skills) &&
        JSON.stringify(dossier.capability?.flow_ids) === JSON.stringify(role.flows) &&
        JSON.stringify(dossier.capability?.scenario_ids) === JSON.stringify(role.scenarios) &&
        JSON.stringify(dossier.capability?.shared_playbook_ids) === JSON.stringify(role.playbooks) &&
        dossier.capability?.role_playbook_id === playbookIndexEntry.playbook_id,
      '执行岗位能力投影不正确：' + roleId
    )
    assert(
      JSON.stringify(dossier.collaboration?.related_role_ids) ===
        JSON.stringify(role.collaborates_with) &&
        JSON.stringify(dossier.collaboration?.standalone_mode) ===
          JSON.stringify(preset.modes.standalone) &&
        JSON.stringify(dossier.collaboration?.case_composition_mode) ===
          JSON.stringify(preset.modes.composition) &&
        dossier.collaboration?.contribution_to_flows?.handoff_boundary ===
          'ACCEPTED_STAGE_ARTIFACT_TO_ARTIFACT_ENVELOPE_ONLY' &&
        dossier.collaboration?.case_composition_mode?.peer_chat === false &&
        dossier.collaboration?.case_composition_mode?.re_delegation === false,
      '执行岗位协同投影不正确：' + roleId
    )
    assert(
      dossier.governance?.contract_model === 'FIVE_CONTRACT_ROLE_GOVERNANCE' &&
        JSON.stringify(dossier.governance?.contract_bindings) ===
          JSON.stringify(contractBinding.contracts) &&
        dossier.governance?.release_rules?.self_publish === false &&
        dossier.governance?.release_rules?.bundle_immutable === true &&
        dossier.governance?.release_rules?.in_place_contract_mutation === false &&
        dossier.governance?.release_rules?.case_bundle_pinned === true &&
        dossier.governance?.release_rules?.service_identity_holder === 'EXECUTION_BROKER' &&
        dossier.governance?.tools?.credentials === 'never_visible_to_model' &&
        dossier.governance?.access?.default_decision === 'deny' &&
        dossier.governance?.assurance?.production_authorized === false &&
        dossier.governance?.dsh_projection?.importable === false,
      '执行岗位治理或 DSH 边界不正确：' + roleId
    )
    assert(
      dossier.source_contract_exceptions?.length === 0,
      '执行岗位不应生成管理层 Blueprint 例外：' + roleId
    )
  } else if (dossier.role.role_kind === 'MGT') {
    const role = managementRoleById.get(roleId)
    const manifestEntry = managementPresetManifestByRoleId.get(roleId)
    assert(role && manifestEntry, '管理层缺少权威输入：' + roleId)
    const preset = readJson(manifestEntry.blueprint_ref)
    assert(
      dossier.dossier_id === 'DPD-' + roleId &&
        binding.role_kind === 'MGT' &&
        binding.source_persona_id === expectedMgtSourcePersonaByRoleId[roleId] &&
        dossier.role.display_name === role.alias &&
        dossier.role.title === role.title &&
        dossier.role.organization_placement.layer === role.layer &&
        dossier.role.organization_placement.management_domain === role.management_domain &&
        JSON.stringify(dossier.role.organization_placement.owned_role_ids) ===
          JSON.stringify(role.owned_role_ids) &&
        dossier.role.organization_placement.owned_role_count === role.owned_role_count &&
        dossier.role.mission === role.mission &&
        dossier.role.standard_artifact === role.artifact &&
        JSON.stringify(dossier.role.metrics) === JSON.stringify(role.metrics) &&
        dossier.role.role_design_status === role.status &&
        dossier.role.semantic_authority?.source === 'MANAGEMENT_CATALOG_ONLY' &&
        dossier.role.semantic_authority?.catalog_version === managementCatalog.version &&
        dossier.role.semantic_authority?.structure_version === managementCatalog.structure_version,
      '管理层角色语义投影不正确：' + roleId
    )
    assertReference(
      dossier.persona?.role_profile_ref,
      preset.role_profile_ref,
      roleId + ' Role Profile'
    )
    assertReference(dossier.persona?.soul_contract_ref, manifestEntry.soul_ref, roleId + ' Soul')
    assertReference(
      dossier.persona?.role_playbook_ref,
      manifestEntry.role_playbook_ref,
      roleId + ' Role Playbook'
    )
    assertReference(
      dossier.persona?.preset_blueprint_ref,
      manifestEntry.blueprint_ref,
      roleId + ' Preset Blueprint'
    )
    assert(
      dossier.persona?.personality === role.personality &&
        dossier.persona?.principles?.join('\u0000') ===
          [role.principle, role.second_principle].filter(Boolean).join('\u0000') &&
        dossier.persona?.behavioral_contract_policy ===
          'REFERENCES_ARE_AUTHORITATIVE_NO_CONTRACT_REWRITE' &&
        preset.identity.alias === role.alias &&
        preset.identity.title === role.title &&
        preset.identity.mission === role.mission &&
        preset.identity.primary_artifact === role.artifact,
      '管理层人格或 Blueprint 身份投影不正确：' + roleId
    )
    assert(
      JSON.stringify(dossier.capability?.skills) === JSON.stringify(preset.skills) &&
        JSON.stringify(dossier.capability?.flow_ids) === JSON.stringify(role.flows) &&
        dossier.capability?.scenario_ids?.length === 0 &&
        dossier.capability?.shared_playbook_ids?.length === 0 &&
        dossier.capability?.role_playbook_id === 'RPB-' + roleId,
      '管理层能力投影不正确：' + roleId
    )
    assert(
      JSON.stringify(dossier.collaboration?.related_role_ids) ===
        JSON.stringify(role.collaborates_with) &&
        JSON.stringify(dossier.collaboration?.standalone_mode) ===
          JSON.stringify(preset.modes.standalone) &&
        JSON.stringify(dossier.collaboration?.case_composition_mode) ===
          JSON.stringify(preset.modes.composition) &&
        JSON.stringify(dossier.collaboration?.management_interface) ===
          JSON.stringify(preset.modes.interface) &&
        JSON.stringify(dossier.collaboration?.decision_rights) ===
          JSON.stringify(role.decision_rights) &&
        JSON.stringify(dossier.collaboration?.decision_rights_explicitly_not_granted) ===
          JSON.stringify(role.decision_rights_explicitly_not_granted) &&
        dossier.collaboration?.case_composition_mode?.case_role_participation === 'none' &&
        dossier.collaboration?.case_composition_mode?.lead_or_worker === false &&
        dossier.collaboration?.case_composition_mode?.peer_chat === false &&
        dossier.collaboration?.case_composition_mode?.re_delegation === false &&
        dossier.collaboration?.handoff_boundary ===
          'VERSIONED_MANAGEMENT_CONTRACT_AND_QUOTA_OR_REPORT_TO_HUMAN_OWNER_ONLY',
      '管理层协同或 Case 边界不正确：' + roleId
    )
    assert(
      dossier.governance?.contract_model === 'MANAGEMENT_DECISION_CONTRACTS' &&
        dossier.governance?.domain_tension === role.domain_tension &&
        dossier.governance?.business_boundary === role.boundary &&
        dossier.governance?.tools?.action_boundary ===
          'no_action_intent_capability_versioned_contract_and_quota_only' &&
        dossier.governance?.access?.default_decision === 'deny' &&
        dossier.governance?.access?.service_identity_holder === 'none' &&
        dossier.governance?.assurance?.production_authorized === false &&
        dossier.governance?.dsh_projection?.importable === false,
      '管理层治理或 DSH 边界不正确：' + roleId
    )
    const expectedExceptionCount = roleId === 'MGT-001' ? 0 : 2
    assert(
      dossier.source_contract_exceptions?.length === expectedExceptionCount,
      '管理层 Blueprint 来源例外数量不正确：' + roleId
    )
    if (roleId !== 'MGT-001') {
      const artifactException = dossier.source_contract_exceptions.find(
        (entry) => entry.exception_id === 'MGT-DOSSIER-SOURCE-ARTIFACT-' + roleId
      )
      const accessException = dossier.source_contract_exceptions.find(
        (entry) => entry.exception_id === 'MGT-DOSSIER-SOURCE-ACCESS-' + roleId
      )
      assert(
        artifactException?.status === 'SOURCE_FIELD_NONAUTHORITATIVE_PENDING_RP_REMEDIATION' &&
          artifactException?.observed_source_value === '全局组合决策包' &&
          artifactException?.authoritative_value === role.artifact &&
          artifactException?.authority === 'MANAGEMENT_CATALOG_ONLY' &&
          accessException?.status === 'SOURCE_FIELD_NONAUTHORITATIVE_PENDING_RP_REMEDIATION' &&
          accessException?.observed_source_value === 'read-only aggregate view contract for MGT-001' &&
          accessException?.authoritative_value ===
            'ROLE_SPECIFIC_READ_ONLY_AGGREGATE_SCOPE_REQUIRED' &&
          dossier.governance?.access?.scope_source_status ===
            'SOURCE_FIELD_NONAUTHORITATIVE_PENDING_RP_REMEDIATION',
        '管理层 Blueprint 来源例外未被正确隔离：' + roleId
      )
    } else {
      assert(
        dossier.governance?.access?.scope_source_status ===
          'BLUEPRINT_REFERENCE_PENDING_TARGET_CONTRACT',
        'MGT-001 access 来源状态不正确'
      )
    }
  } else {
    throw new Error('未知 Dossier 角色类型：' + dossier.dossier_id)
  }
}

const serializedRegister = JSON.stringify(register)
for (const forbiddenValue of [
  '"source_path"',
  '"git_blob_sha"',
  'digital-employees/',
  'data:image/',
  '"appearance"',
  '"prompt"',
  '"identityReference"',
  '"styleReferences"',
  '"poseCorrectionSource"',
  '"skinCorrectionSource"'
]) {
  assert(
    !serializedRegister.includes(forbiddenValue),
    'VIS-G4 Dossier 不应暴露受限来源、图像二进制或上游人物细节：' + forbiddenValue
  )
}

assert(
  register.next_gates?.some(
    (entry) => entry.owner_gate === 'VIS-G5' && entry.status === 'PENDING'
  ) &&
    register.next_gates?.some(
      (entry) => entry.owner_gate === 'VIS-G6' && entry.status === 'NOT_STARTED'
    ) &&
    register.next_gates?.some(
      (entry) =>
        entry.owner_gate === 'ROLE_PRESET_REMEDIATION_SEPARATE_AUTHORIZATION' &&
        entry.status === 'OPEN_SOURCE_EXCEPTION'
    ),
  'VIS-G4 后续门或独立合同修复边界不完整'
)

console.log('PASS VIS-G4 的53份 Digital Persona Dossier 投影、输入指纹与治理边界校验通过')
console.log('  3条 MGT + 50条 AGT；VIS-G5 与 VIS-G6 仍未越过；4条 MGT Blueprint 来源例外已隔离。')
