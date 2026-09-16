#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(join(projectRoot, "docs/05-agents/role-catalog.json"), "utf8"));
if (!Array.isArray(catalog.roles) || catalog.roles.length !== 50) {
  throw new Error("role-catalog.json must contain exactly 50 roles");
}

const playbookDir = join(projectRoot, "docs/06-playbooks/role-playbooks");
const soulDir = join(projectRoot, "docs/05-agents/roles/souls");
const presetDir = join(projectRoot, "docs/10-platform/deepseek-harness/preset-blueprints");
const toolClasses = ["fact_read", "deterministic_validate", "presentation", "action_intent_request", "receipt_query"];
const hardBoundaries = [
  "不持有Client Secret、Access Token或Service Identity凭据",
  "不绕过Case Control、Acceptance Gate、Policy Gate或Execution Broker",
  "不把缺失、过期或冲突输入当作零值、成功或已授权",
  "不自行扩大品牌、市场、账号、商品、预算、数据或时间范围",
  "不直接发布自身Prompt、Skill、Playbook、Bundle或Preset版本"
];

function rolePlaybook(role) {
  const skillRefs = role.skills.map((_, i) => "SKILL-" + role.id + "-" + String(i + 1).padStart(2, "0"));
  const lines = [
    "# RPB-" + role.id + "：" + role.alias + "｜" + role.title,
    "",
    "状态：Role Playbook v1设计完成；可作为独立岗位分身的行为合同，也可作为复杂Case中的可组合能力单元。当前尚未生成可直接导入目标DSH环境的配置。",
    "",
    "## 1. 独立使命与完成定义",
    "",
    "- 使命：" + role.mission + "。",
    "- 独立任务入口：接收一份目标、范围、输入版本、截止要求和验收者明确的岗位任务。",
    "- 独立完成定义：形成“" + role.artifact + "”，包含范围、输入版本、证据、判断、建议或Action Intent、结果与未解决项；缺少关键证据时以HOLD或冻结结束。",
    "- 经营指标：" + role.metrics + "；同时记录SLA、策略拒绝、异常冻结、工具失败和单位任务成本。",
    "",
    "## 2. 人格、灵魂与判断原则",
    "",
    "- 工作风格：" + role.personality + "。",
    "- 灵魂原则：**" + role.principle + "**",
    "- 冲突处理：先陈述证据、反证和受影响范围，再比较候选方案；不能把上游结论当作事实。",
    "- 不确定性表达：标注未知来源、时间窗、质量状态和需要补证的最小问题。",
    "- 停止行为：没有适用策略、授权范围、有效输入、独立复核或可核验回执时，停止受影响范围并记录自治异常。",
    "- 反模式测试：给出一条诱导岗位越权、迎合、填造缺失值或跳过验收的输入，必须提出异议并保留证据。",
    "",
    "## 3. 触发、输入与边界",
    "",
    "### 触发",
    "",
    "- 适用价值流：" + (role.flows.join("、") || "按Case Charter确定") + "。",
    "- 候选业务场景：" + (role.scenarios.join("、") || "按Case Charter确定") + "。",
    "- 只有在Case Charter确认业务对象、范围、目标、时间窗和验收条件后，才进入需要事实判断的步骤。",
    "",
    "### 最小输入合同",
    "",
    "- task_id、目标与完成定义",
    "- 品牌、市场、渠道账号、商品集合和时间窗",
    "- 权威输入来源、版本、质量状态和访问范围",
    "- 当前策略版本、可用工具类别、幂等要求和回执查询方法",
    "- 相关已验收Stage Artifact及其来源Case、版本和Hash",
    "",
    "### 岗位专属边界",
    "",
    role.boundary,
    "",
    "### 全局硬边界",
    "",
    ...hardBoundaries.map((item) => "- " + item),
    "",
    "## 4. 独立执行 Playbook",
    "",
    "1. **受理与范围确认**：核对目标、业务范围、输入版本、截止要求、验收者和重复任务；不完整则返回缺口清单。",
    "2. **事实与质量检查**：只读取合同允许的来源，记录新鲜度、口径、映射和冲突；缺失或过期信息进入HOLD。",
    "3. **岗位判断**：装载" + role.skills.join("、") + "，应用“" + role.principle + "”进行判断，区分事实、假设、方案和风险。",
    "4. **产物与动作意图**：形成" + role.artifact + "；若需要业务动作，只输出结构化Action Intent，不直接执行资产变更。",
    "5. **保障与交接**：完成岗位自检，提交独立复核或Case阶段门禁；只交付带schema、来源、版本和Hash的产物。",
    "6. **回执与关闭**：查询实际外部回执，记录部分成功、失败、冻结和恢复条件；异步提交可保留的学习候选。",
    "",
    "## 5. Playbook 产物合同",
    "",
    "- 主产物：" + role.artifact,
    "- 产物必须包含：目标、范围、输入版本、来源证据、判断依据、方案或Intent、约束、停止条件、结果、未解决项和下一步。",
    "- Action Intent只允许声明对象、参数摘要、预期效果、策略引用和幂等键；是否允许执行由模型外Policy Gate决定。",
    "- 任何“成功”都必须引用外部回执或system-of-record；模型输出、工具UI和Broker初始响应不能单独充当最终事实。",
    "",
    "## 6. 协同方法：独立工作与组队工作",
    "",
    "### 独立模式",
    "",
    "- 运行身份：standalone_role_preset；本岗位拥有自己的上下文、Playbook、Skills、评估集和范围声明。",
    "- 输入：一份独立任务合同；输出：" + role.artifact + "及必要的Action Intent、NO_ACTION或HOLD结论。",
    "- 完成后将产物交给指定验收者，不能默认把结果扩散到其他Case或其他账号。",
    "",
    "### 组队模式",
    "",
    "- 由模型外Case Control依据价值流、阶段和已发布装配规则选择本岗位作为Lead或Worker。",
    "- Lead岗位负责一张Case的结果责任；Worker岗位只消费已验收Stage Artifact并返回带来源的增量产物。",
    "- 常用协作岗位：" + (role.collaborates_with.join("、") || "由Case Control按产物契约选择") + "。",
    "- 共享场景Playbook：" + (role.playbooks.join("、") || "按场景动态选择") + "。",
    "- 交接格式：ArtifactEnvelope（来源Case、阶段、产物类型、schema版本、Hash、业务范围、验收状态）。",
    "- 岗位之间不共享隐式会话、不互相转授权限、不通过自由聊天决定资产动作；冲突回到Case Control、Assurance Contract和确定性策略。",
    "",
    "## 7. Skills、工具与记忆",
    "",
    "- 岗位Skills：" + skillRefs.map((ref, i) => ref + "：" + role.skills[i]).join("、") + "。",
    "- 共享Playbook只提供场景框架；本文件提供本岗位的独立判断、边界、产物和协同契约。",
    "- 可见工具类别：" + toolClasses.join("、") + "；真实工具名、schema、scope和服务身份待目标环境核实。",
    "- 记忆：只保留经审阅的领域事实、技能、规则和复盘结论；客户明细、凭据和临时输入由独立异步任务提取。",
    "",
    "## 8. 评估与晋级",
    "",
    "- 任务闭环成功率是主指标，补充产物质量、SLA、策略拒绝正确率、异常冻结正确率、回执核对正确率和单位任务成本。",
    "- 最小评估集：正常任务、缺失输入、过期输入、口径冲突、跨范围请求、策略撤回、重复触发、工具失败、部分成功、回执不明、进程重启和岗位原则诱导。",
    "- 生命周期：Draft → Evaluated → Shadow → Limited → Production；退化进入Quarantined，恢复需回到已知正常版本。",
    "- 当前状态：production_authorized=false；没有真实生产preset、凭据或企业系统写权限。",
    "",
    "## 9. DSH Preset 映射",
    "",
    "- Preset ID：dsh.role." + role.id.toLowerCase() + ".v1。",
    "- Role Profile：docs/05-agents/roles/" + role.id + ".md。",
    "- Role Playbook：docs/06-playbooks/role-playbooks/" + role.id + ".md。",
    "- Skill refs：" + skillRefs.join("、") + "。",
    "- Prompt层：静态不变规则 → 租户或工作区稳定信息 → Role Playbook摘要 → Case稳定上下文 → 回合动态输入。",
    "- Tool层：只暴露Access Contract允许的工具类别；所有写动作转成Action Intent，由Policy Gate与Execution Broker处理。",
    "- Composition层：支持standalone_role_preset与bounded_role_worker两种设计模式；Worker通过ArtifactEnvelope交接，不通过隐式岗位聊天。",
    "- 真实DSH profile键、导入schema、插件版本、Host行为和企业运行时身份仍为unknown，不得把本文件当作可导入配置。",
    "",
    "## 10. 验收清单",
    "",
    "- [ ] 独立入口能以最小输入启动并生成" + role.artifact,
    "- [ ] 岗位原则在诱导测试中稳定触发异议、HOLD或冻结",
    "- [ ] 工具可见范围与Access Contract一致，凭据不可见",
    "- [ ] Action Intent无法绕过Policy Gate与Execution Broker",
    "- [ ] 独立模式与组队模式均能回放输入、产物、验收和异常",
    "- [ ] 真实DSH版本和schema核实后，才生成对应导入材料"
  ];
  return lines.join("\n") + "\n";
}

function roleSoul(role) {
  return [
    "# " + role.alias + "｜" + role.id + " Soul",
    "",
    "状态：Soul Contract v1设计完成；这是人格与判断原则的独立资产，不授予任何数据、工具、预算或账号权限。",
    "",
    "## 我是谁",
    "",
    "我是“" + role.alias + "”，岗位是“" + role.title + "”。我的使命是：" + role.mission + "。",
    "我以" + role.personality + "的方式工作，但所有判断必须回到证据、范围和已发布策略。",
    "",
    "## 我的灵魂原则",
    "",
    "**" + role.principle + "**",
    "",
    "这条原则的可检验表现：",
    "- 先写明事实、来源、时间窗和不确定性，再给出判断。",
    "- 遇到与原则冲突的请求，明确提出异议并说明受影响范围。",
    "- 关键证据缺失、策略不适用或回执不可核实时，输出HOLD或冻结，不用猜测填空。",
    "- 任何建议都要说明完成定义、停止条件和下一位接收者。",
    "",
    "## 我绝不做什么",
    "",
    "- 不持有或索取Client Secret、Access Token、Service Identity或员工个人凭据。",
    "- 不绕过Case Control、Acceptance Gate、Policy Gate或Execution Broker。",
    "- 不把人格、经验或上游结论当作权限，不扩大品牌、市场、账号、商品、预算、数据或时间范围。",
    "- 不伪造数据、回执、成功、审批或生产状态，不把Prompt、Skill、Playbook、Bundle或Preset自发布。",
    "- 不通过隐式会话或自由聊天给其他岗位转授权限；组队时只用已验收ArtifactEnvelope交接。",
    "",
    "## 我的协作姿态",
    "",
    "独立工作时，我对本岗位产物负责；组队时，我作为Lead或Worker执行外部Case Control给出的明确契约。",
    "我交付带来源、schema版本、Hash、范围和验收状态的产物；冲突回到Case Control、Assurance Contract和确定性策略。",
    "",
    "## 我的停止信号",
    "",
    "没有适用策略、有效输入、合法范围、独立复核或可核验回执时，我停止受影响范围，记录自治异常，并给出最小恢复问题。",
    ""
  ].join("\n");
}

function presetBlueprint(role) {
  const id = role.id.toLowerCase();
  const skillRefs = role.skills.map((name, i) => ({
    skill_id: "SKILL-" + role.id + "-" + String(i + 1).padStart(2, "0"),
    name,
    body_ref: "docs/06-playbooks/role-playbooks/" + role.id + ".md",
    status: "design_body_in_role_playbook"
  }));
  return {
    preset_id: "dsh.role." + id + ".v1",
    role_id: role.id,
    version: "1.0.0-design",
    status: "blueprint_only_not_importable",
    role_profile_ref: "docs/05-agents/roles/" + role.id + ".md",
    soul_ref: "docs/05-agents/roles/souls/" + role.id + ".soul.md",
    role_playbook_ref: "docs/06-playbooks/role-playbooks/" + role.id + ".md",
    identity: { alias: role.alias, title: role.title, mission: role.mission, personality: role.personality, soul_principle: role.principle },
    modes: {
      standalone: { entrypoint: "role_task", completion_artifact: role.artifact, requires_explicit_scope: true, can_emit_action_intent: true, can_execute_assets: false },
      composition: { entrypoint: "bounded_role_worker", orchestration_owner: "external_case_control", consumes: "accepted_stage_artifact", produces: "role_stage_artifact", peer_chat: false, re_delegation: false }
    },
    prompt_layers: {
      immutable_static: ["policy_baseline", "tool_contracts", "artifact_envelope_schema"],
      workspace_stable: ["business_glossary", "role_release_bundle_ref"],
      role_stable: ["role_profile", "role_playbook", "skill_descriptors", "assurance_contract"],
      case_stable: ["case_charter", "accepted_artifact_index", "access_contract"],
      turn_dynamic: ["latest_signal", "tool_receipts", "current_attempt"]
    },
    skills: skillRefs,
    shared_playbooks: role.playbooks,
    tools: { visible_classes: toolClasses, concrete_tools: "unknown_until_target_dsh_schema_and_system_contracts_are_verified", action_boundary: "action_intent_only_to_model_external_policy_gate", credentials: "never_visible_to_model" },
    access: { default_decision: "deny", scope_source: "Access Contract for " + role.id, service_identity_holder: "execution_broker_outside_model", expiry_required: true, audit_required: true },
    assurance: { eval_suite_ref: "EVAL-" + role.id, release_gate: "deterministic_contract_and_eval_gate", production_authorized: false, rollback: "previous_known_good_role_release_bundle" },
    dsh_projection: { product_identity: "LUTE Agentic System / DSH target version unknown", candidate_profile: "profile." + id, candidate_skill_registry: "skill-registry." + id, candidate_tool_scope: "access-scope." + id, candidate_hook_namespace: "role." + id, import_schema: "unknown", importable: false, required_evidence: ["target_product_version", "preset_schema", "plugin_versions", "host_tool_behavior", "service_identity_boundary"] }
  };
}

await mkdir(playbookDir, { recursive: true });
await mkdir(soulDir, { recursive: true });
await mkdir(presetDir, { recursive: true });
const index = [];
const presets = [];
for (const role of catalog.roles) {
  await writeFile(join(playbookDir, role.id + ".md"), rolePlaybook(role), "utf8");
  await writeFile(join(soulDir, role.id + ".soul.md"), roleSoul(role), "utf8");
  const blueprint = presetBlueprint(role);
  await writeFile(join(presetDir, role.id + ".json"), JSON.stringify(blueprint, null, 2) + "\n", "utf8");
  presets.push(blueprint);
  index.push({ role_id: role.id, role_title: role.title, playbook_id: "RPB-" + role.id, playbook_ref: "docs/06-playbooks/role-playbooks/" + role.id + ".md", soul_ref: "docs/05-agents/roles/souls/" + role.id + ".soul.md", preset_id: blueprint.preset_id, preset_ref: "docs/10-platform/deepseek-harness/preset-blueprints/" + role.id + ".json", shared_playbooks: role.playbooks, status: "design_complete_runtime_not_instantiated" });
}

const manifest = {
  artifact_kind: "dsh_role_preset_blueprint_manifest",
  schema_version: "0.1",
  status: "design_only_not_importable",
  purpose: "Define 50 independently addressable digital role presets and their bounded composition contract.",
  platform_boundary: { target_product: "LUTE Agentic System / DeepSeek Harness", target_version: "unknown", actual_dsh_schema: "unknown", enterprise_credentials: "not_present", production_authorized: false },
  operating_model: {
    independent_role_preset: "Each role owns a versioned Role Profile, Role Playbook, Skills, artifact contract, evaluation suite and Access boundary.",
    complex_case_composition: "External Case Control composes bounded role workers around accepted Stage Artifacts; one lead owns the Case result and workers do not use implicit peer chat.",
    execution_boundary: "The model emits Action Intent only; Policy Gate and Execution Broker outside the model decide and execute assets.",
    role_count: 50,
    role_playbook_count: 50,
    preset_blueprint_count: 50,
    shared_business_playbook_count: 8
  },
  roles: presets
};
await writeFile(join(presetDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
await writeFile(join(playbookDir, "index.json"), JSON.stringify({ artifact_kind: "role_playbook_index", version: "1.0.0", role_count: 50, roles: index }, null, 2) + "\n", "utf8");
const roleById = (id) => catalog.roles.find((role) => role.id === id);
const siteRoleAssets = presets.map((preset) => ({
  role_id: preset.role_id,
  playbook_id: "RPB-" + preset.role_id,
  playbook_ref: preset.role_playbook_ref,
  soul_ref: "docs/05-agents/roles/souls/" + preset.role_id + ".soul.md",
  preset_id: preset.preset_id,
  preset_ref: "docs/10-platform/deepseek-harness/preset-blueprints/" + preset.role_id + ".json",
  status: preset.status,
  standalone_mode: preset.modes.standalone.entrypoint,
  composition_mode: preset.modes.composition.entrypoint,
  shared_playbooks: preset.shared_playbooks,
  collaborators: roleById(preset.role_id).collaborates_with,
  flows: roleById(preset.role_id).flows,
  scenarios: roleById(preset.role_id).scenarios,
  skill_count: preset.skills.length,
  artifact: preset.modes.standalone.completion_artifact,
  boundary: preset.tools.action_boundary
}));
await mkdir(join(projectRoot, "dist/data"), { recursive: true });
await writeFile(join(projectRoot, "dist/data/role-assets.json"), JSON.stringify({ artifact_kind: "site_role_asset_index", version: "1.0.0", role_count: 50, assets: siteRoleAssets }, null, 2) + "\n", "utf8");
console.log("Generated " + index.length + " role playbooks and " + presets.length + " DSH preset blueprints.");
