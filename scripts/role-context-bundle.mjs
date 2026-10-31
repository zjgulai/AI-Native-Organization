#!/usr/bin/env node
// role-context-bundle.mjs — 装配单个岗位的上下文包
// 原则：缺必填字段返回 INCOMPLETE 并列出 missing[]，绝不推断补齐。
// 用法: node scripts/role-context-bundle.mjs assemble AGT-001 [--out dir]
//       node scripts/role-context-bundle.mjs validate <bundle.json>
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve as presolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = presolve(dirname(fileURLToPath(import.meta.url)), '..');
const p = (f) => presolve(ROOT, f);
const read = (f) => (existsSync(p(f)) ? JSON.parse(readFileSync(p(f), 'utf8')) : null);

const SRC = {
  roleCatalog: 'docs/05-agents/role-catalog.json',
  orgGraph: 'docs/04-organization/organization-graph.json',
  mgtCatalog: 'docs/04-organization/management/management-catalog.json',
  playbookIndex: 'docs/06-playbooks/role-playbooks/index.json',
  presetManifest: 'docs/10-platform/deepseek-harness/preset-blueprints/manifest.json',
  collabGraph: 'docs/07-orchestration/collaboration-graph.json',
  overlay: 'docs/09-governance/knowledge-graph/ai-org-knowledge-overlay.json',
};

// 四份资产路径：项目岗位与管理岗位分属两套目录，不得互相推断
const isMgmtId = (id) => /^MGT-\d{3}$/.test(id);
const presetPath = (id) => isMgmtId(id)
  ? `docs/04-organization/management/preset-blueprints/${id}.json`
  : `docs/10-platform/deepseek-harness/preset-blueprints/${id}.json`;
const soulPath = (id) => isMgmtId(id)
  ? `docs/04-organization/management/souls/${id}.soul.md`
  : `docs/05-agents/roles/souls/${id}.soul.md`;
const profilePath = (id) => isMgmtId(id)
  ? `docs/04-organization/management/roles/${id}.md`
  : `docs/05-agents/roles/${id}.md`;
const playbookPath = (id) => isMgmtId(id)
  ? `docs/04-organization/management/playbooks/${id}.md`
  : `docs/06-playbooks/role-playbooks/${id}.md`;

const CONTRACTS = ['BUSINESS', 'SKILL', 'RUNTIME', 'ACCESS', 'ASSURANCE'];

// flow/scenario 交叉校验：role-catalog 声明的绑定必须与 collaboration-graph 的
// 合法配对表一致。叉积不是约束——真约束是 flow_scenario_bindings 的白名单。
const STAGES = Array.from({ length: 8 }, (_, i) => `STG-${String(i + 1).padStart(2, '0')}`);
function crossCheck(flows, scenarios, collab) {
  const flowIds = new Set(collab.flows.map(f => f.id));
  const scnIds = new Set(collab.scenarios.map(s => s.id));
  const pairs = new Set(collab.flow_scenario_bindings.map(b => `${b.flow_id}|${b.scenario_id}`));
  const stageByFlow = new Map();
  for (const b of collab.flow_stage_bindings) {
    if (!stageByFlow.has(b.flow_id)) stageByFlow.set(b.flow_id, new Set());
    stageByFlow.get(b.flow_id).add(b.stage_id);
  }
  const errors = [], warnings = [];

  const badFlows = (flows || []).filter(f => !flowIds.has(f));
  const badScns = (scenarios || []).filter(s => !scnIds.has(s));
  if (badFlows.length) errors.push(`eligible_flows 引用不存在的流: ${badFlows.join(',')}`);
  if (badScns.length) errors.push(`eligible_scenarios 引用不存在的场景: ${badScns.join(',')}`);

  // 每个 eligible flow 必须有完整 8 阶
  for (const f of flows || []) {
    if (!flowIds.has(f)) continue;
    const have = stageByFlow.get(f) || new Set();
    const miss = STAGES.filter(s => !have.has(s));
    if (miss.length) errors.push(`${f} 缺阶段绑定: ${miss.join(',')}`);
  }

  // 合法配对：岗位必须至少有一对，否则无法组 Case
  const legal = [];
  for (const f of flows || []) for (const s of scenarios || []) if (pairs.has(`${f}|${s}`)) legal.push(`${f}|${s}`);
  if (!legal.length) errors.push('无任何合法 flow×scenario 配对，该岗位无法组成 Case');

  // 声明的交叉组合若全部落在白名单外，说明声明与绑定表脱节
  const cross = (flows || []).length * (scenarios || []).length;
  // 仅当叉积规模足够大且全部合法时才值得怀疑过度声明；1×1 之类恒等情形无信号
  // shortcut: 阈值 4 是经验值（区分 1×N 恒等情形与真实宽声明），角色数量或声明粒度变化后需重估
  if (cross >= 4 && legal.length === cross) warnings.push('叉积全部命中绑定表，检查是否过度声明');
  if (legal.length === 1) warnings.push(`仅 1 对合法配对(${legal[0]})，可用场景极窄`);

  return {
    legal_pair_count: legal.length,
    cross_product_count: cross,
    legal_pairs: legal,
    errors, warnings,
    status: errors.length ? 'FAIL' : (warnings.length ? 'PASS_WITH_WARNINGS' : 'PASS'),
  };
}

function assemble(roleId) {
  const missing = [];
  const out = { role_id: roleId, generated_at_fixed: '2026-10-31' };
  const add = (k, v, required = true) => {
    if (v === undefined || v === null || (Array.isArray(v) && v.length === 0)) {
      if (required) missing.push(k);
      return;
    }
    out[k] = v;
  };

  const cat = read(SRC.roleCatalog);
  const org = read(SRC.orgGraph);
  const mgt = read(SRC.mgtCatalog);
  const overlay = read(SRC.overlay);

  const isProjectRole = /^AGT-0(0[1-9]|[1-4]\d|50)$/.test(roleId);
  const isMgmt = /^MGT-\d{3}$/.test(roleId);

  if (isProjectRole) {
    const r = cat.roles.find(x => x.id === roleId);
    const o = org.roles.find(x => x.id === roleId);
    add('role_kind', 'ProjectRole');
    if (!r) missing.push('role_catalog_entry');
    if (!o) missing.push('organization_graph_entry');
    if (r) {
      add('alias', r.alias); add('title', r.title);
      add('mission', r.mission); add('personality', r.personality);
      add('principle', r.principle); add('boundary', r.boundary);
      add('status', r.status); add('production_authorized', r.production_authorized, false);
      out.production_authorized = r.production_authorized;
      add('eligible_flows', r.flows);
      add('eligible_scenarios', r.scenarios);
      // 交叉校验以 collaboration-graph 的绑定表为准
      const cc = crossCheck(r.flows, r.scenarios, read(SRC.collabGraph));
      out.binding_check = cc;
      if (cc.errors.length) missing.push(...cc.errors.map(e => `binding:${e}`));
      add('shared_playbooks', r.playbooks, false);
      out.shared_playbooks = r.playbooks || [];
      add('standalone_mode', r.autonomy?.profile_loadable === true ? 'role_task' : null);
      add('worker_mode', r.autonomy?.runtime_agent_identity === false ? 'bounded_role_worker' : null);
      add('stop_signals', r.autonomy?.unhandled_exception ? [r.autonomy.unhandled_exception] : null, false);
    }
    if (o) { add('plane', o.plane_id); add('domain', o.domain); }
  } else if (isMgmt) {
    const m = mgt.roles.find(x => x.id === roleId);
    add('role_kind', 'ManagementRole');
    if (!m) missing.push('management_catalog_entry');
    if (m) {
      add('alias', m.alias); add('title', m.title);
      add('mission', m.mission); add('personality', m.personality);
      add('principle', m.principle); add('boundary', m.boundary);
      add('status', m.status);
      out.production_authorized = m.production_authorized;
      add('coverage_role_ids', m.owned_role_ids.filter(x => /^AGT-/.test(x)));
      add('decision_rights_ref', 'docs/04-organization/management/DECISION-RIGHTS.md');
      add('mdc_goc_refs', ['MDC', 'GOC']);
      add('shadow_status', 'MGT-EVAL-B 4/6=66.7%, 阈值100%, 未通过');
      add('standalone_mode', 'management_preset_only');
      add('worker_mode', null, false);
      out.worker_mode = null;
      // MGT 明确不含 Case 角色
      out.case_role = null;
    }
    add('plane', 'PLN-EXC');
    add('domain', null, false);
  } else {
    missing.push('role_id_not_recognized');
  }

  // 四份资产引用
  if (isProjectRole || isMgmt) {
    const arts = { role_profile_ref: profilePath(roleId), soul_ref: soulPath(roleId),
                   role_playbook_ref: playbookPath(roleId),
                   preset_ref: presetPath(roleId) };
    const artsMissing = [];
    for (const [k, f] of Object.entries(arts)) if (!existsSync(p(f))) artsMissing.push(k);
    if (artsMissing.length) missing.push(...artsMissing.map(k => `artifacts.${k}`));
    out.artifacts = arts;
  }

  // 五契约引用：源图里是未解析占位，原样保留，不推断补齐
  out.contract_refs = CONTRACTS.map(t => ({ type: t, ref: null, resolved: false }));

  // 源指针
  out.source_pointers = [SRC.roleCatalog, SRC.orgGraph, presetPath(roleId)]
    .filter(f => existsSync(p(f)));

  // 覆盖层里与该岗位相关的纠错
  out.overlay_corrections = (overlay?.corrections || [])
    .filter(c => (c.claim_ref || '').includes(roleId)).map(c => c.id);

  out.bundle_status = missing.length ? 'INCOMPLETE' : 'COMPLETE';
  out.missing = missing;
  out.grants_authorization = false;
  out.runtime = false;
  return out;
}

const REQUIRED_FIELDS = ['role_id', 'role_kind', 'plane', 'mission', 'personality', 'principle',
  'boundary', 'status', 'artifacts', 'contract_refs', 'eligible_flows', 'eligible_scenarios',
  'standalone_mode', 'source_pointers'];

function validate(b) {
  const errs = [];
  if (!/^(AGT|MGT)-/.test(b.role_id || '')) errs.push('role_id 非法');
  if (b.grants_authorization !== false) errs.push('grants_authorization 必须 false');
  if (b.runtime !== false) errs.push('runtime 必须 false');
  if (b.role_kind === 'ManagementRole') {
    for (const k of ['coverage_role_ids', 'decision_rights_ref', 'mdc_goc_refs', 'shadow_status'])
      if (!b[k]) errs.push(`MGT 缺必填: ${k}`);
    if (b.case_role !== null) errs.push('MGT 不得含 Case 角色');
  } else {
    for (const k of REQUIRED_FIELDS) if (b[k] === undefined || b[k] === null) errs.push(`缺必填: ${k}`);
    if (b.case_role !== undefined) errs.push('ProjectRole 不应有 case_role 字段');
  }
  if (b.bundle_status === 'COMPLETE' && (b.missing || []).length) errs.push('COMPLETE 但 missing 非空');
  if (b.bundle_status === 'INCOMPLETE' && !(b.missing || []).length) errs.push('INCOMPLETE 但 missing 为空');
  // 契约引用必须是未解析占位，不得伪造
  for (const c of b.contract_refs || []) if (c.resolved !== false) errs.push(`契约 ${c.type} 被伪造成已解析`);
  // flow/scenario 交叉校验
  if (b.role_kind === 'ProjectRole') {
    const cc = b.binding_check;
    if (!cc) errs.push('缺 binding_check');
    else {
      if (cc.status === 'FAIL') errs.push(`binding_check FAIL: ${cc.errors.join('; ')}`);
      if (cc.legal_pair_count < 1) errs.push('binding_check 合法配对数 < 1');
      if (cc.cross_product_count !== (b.eligible_flows || []).length * (b.eligible_scenarios || []).length)
        errs.push('binding_check 叉积计数与 eligible 列表不一致');
    }
  }
  return errs;
}

const [, , cmd, arg, ...rest] = process.argv;
if (cmd === 'assemble') {
  if (!arg) { console.error('用法: assemble <ROLE_ID> [--out DIR]'); process.exit(2); }
  const b = assemble(arg);
  const errs = validate(b);
  const outIdx = rest.indexOf('--out');
  if (outIdx >= 0) {
    const dir = presolve(ROOT, rest[outIdx + 1]);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${arg}.json`), JSON.stringify(b, null, 2) + '\n');
  }
  console.log(`${arg}: ${b.bundle_status}${b.missing.length ? ' missing=' + b.missing.join(',') : ''}`);
  if (errs.length) { for (const e of errs) console.error('ERR ' + e); process.exit(1); }
  process.exit(0);
} else if (cmd === 'validate') {
  if (!arg) { console.error('用法: validate <bundle.json>'); process.exit(2); }
  const b = JSON.parse(readFileSync(presolve(ROOT, arg), 'utf8'));
  const errs = validate(b);
  for (const e of errs) console.error('ERR ' + e);
  console.log(errs.length ? `FAIL ${b.role_id}` : `PASS ${b.role_id}`);
  process.exit(errs.length ? 1 : 0);
} else {
  console.error('用法: assemble <ROLE_ID> [--out DIR] | validate <bundle.json>');
  process.exit(2);
}
