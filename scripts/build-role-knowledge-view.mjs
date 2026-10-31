#!/usr/bin/env node
// build-role-knowledge-view.mjs — 从源 JSON 生成岗位派生视图（可再生成，禁止手工编辑）
// 源层不变：实体正文、计数、状态全部留在原文件；本文件只做 ID join 与带哈希的投影。
// 用法: node scripts/build-role-knowledge-view.mjs [--check]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve as presolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = presolve(dirname(fileURLToPath(import.meta.url)), '..');
const p = (f) => presolve(ROOT, f);
const OUT = 'docs/09-governance/knowledge-graph/ai-org-role-view.json';

const SRC = {
  roleCatalog: 'docs/05-agents/role-catalog.json',
  organizationGraph: 'docs/04-organization/organization-graph.json',
  managementCatalog: 'docs/04-organization/management/management-catalog.json',
  e2eValueStreams: 'docs/03-scenarios/e2e-value-streams.json',
  collaborationGraph: 'docs/07-orchestration/collaboration-graph.json',
};

const read = (f) => JSON.parse(readFileSync(p(f), 'utf8'));
const sha = (buf) => createHash('sha256').update(buf).digest('hex');

const raw = {};
for (const [k, f] of Object.entries(SRC)) raw[k] = readFileSync(p(f));
const src = Object.fromEntries(Object.entries(raw).map(([k, b]) => [k, JSON.parse(b.toString('utf8'))]));
const generatedFrom = Object.fromEntries(
  Object.entries(SRC).map(([k, f]) => [k, { path: f, sha256: sha(raw[k]), bytes: raw[k].length }])
);

const nodes = [];
const edges = [];
const push = (id, kind, extra) => nodes.push({ id, kind, runtime: false, ...extra });
const link = (from, to, type, extra) => edges.push({ from, to, type, runtime: false, ...extra });

// --- 节点：50 ProjectRole ---
const orgById = new Map(src.organizationGraph.roles.map(r => [r.id, r]));
for (const r of src.roleCatalog.roles) {
  const o = orgById.get(r.id);
  if (!o) throw new Error(`organization-graph 缺岗位 ${r.id}`);
  push(r.id, 'ProjectRole', {
    alias: r.alias, title: r.title,
    plane_id: o.plane_id, domain_view_id: o.domain_view_id, domain: o.domain,
    status: r.status, production_authorized: r.production_authorized,
    // 以下作为属性保存，不建边（方案 §5.5）
    contract_ref_count: 5,
    skill_count: r.skills.length,
    playbooks: r.playbooks,
    // collaborates_with 只作声明性属性，runtime=false
    declared_common_collaborators: r.collaborates_with,
  });
}

// --- 节点：3 ManagementRole ---
for (const m of src.managementCatalog.roles) {
  push(m.id, 'ManagementRole', {
    alias: m.alias, title: m.title, layer: m.layer,
    management_domain: m.management_domain,
    owned_role_count: m.owned_role_count,
    status: m.status, production_authorized: m.production_authorized,
  });
}

// --- 节点：8 Flow + 20 Scenario（来自 collaboration-graph） ---
for (const f of src.collaborationGraph.flows) {
  const id = f.id || f.flow_id;
  if (!id) throw new Error('flow 缺 id');
  push(id, 'BusinessValueFlow', { name: f.name });
}
for (const s of src.collaborationGraph.scenarios) {
  const id = s.id || s.scenario_id;
  if (!id) throw new Error('scenario 缺 id');
  push(id, 'BusinessScenario', { name: s.name });
}

// --- 边：组织归属 100 ---
for (const e of src.organizationGraph.edges) {
  link(e.from, e.to, e.type, { source: 'organization-graph' });
}

// --- 边：role→flow 140 / role→scenario 127 ---
for (const r of src.roleCatalog.roles) {
  for (const f of r.flows || []) link(r.id, f, 'role_contributes_to_flow', { source: 'role-catalog' });
  for (const s of r.scenarios || []) link(r.id, s, 'role_eligible_for_scenario', { source: 'role-catalog' });
}

// --- 边：management→role 50（只算 ProjectRole；MGT→MGT 是管理层内部覆盖，不入图） ---
const projectRoleIds = new Set(src.roleCatalog.roles.map(r => r.id));
let mgtToRole = 0;
for (const m of src.managementCatalog.roles) {
  for (const t of m.owned_role_ids) {
    if (projectRoleIds.has(t)) { link(m.id, t, 'management_covers_role', { source: 'management-catalog' }); mgtToRole++; }
  }
}

// --- 禁止边自检（方案 §5.7 / overlay forbidden_edges） ---
const forbidden = [];
for (const e of edges) {
  if (e.type === 'management_covers_role' && !projectRoleIds.has(e.to)) forbidden.push(`MGT 覆盖非项目岗位: ${e.from}->${e.to}`);
  if (e.from.startsWith('MGT-') && projectRoleIds.has(e.to) && e.type !== 'management_covers_role')
    forbidden.push(`MGT→Role 非覆盖边: ${e.from}->${e.to} (${e.type})`);
  if (projectRoleIds.has(e.from) && projectRoleIds.has(e.to))
    forbidden.push(`Role→Role 边: ${e.from}->${e.to} (${e.type})`);
}

const kindCount = nodes.reduce((a, n) => (a[n.kind] = (a[n.kind] || 0) + 1, a), {});
const typeCount = edges.reduce((a, e) => (a[e.type] = (a[e.type] || 0) + 1, a), {});

const view = {
  artifact_kind: 'knowledge_role_view',
  version: '1.0.0',
  status: 'derived_regenerable',
  ticket: 'MKG-02',
  created: '2026-10-31',
  authority: '派生视图。真源为 generated_from 列出的五个文件；冲突时以源文件为准。禁止手工编辑。',
  regenerate: 'node scripts/build-role-knowledge-view.mjs',
  runtime: false,
  grants_authorization: false,
  generated_from: generatedFrom,
  counts: { nodes: nodes.length, edges: edges.length, node_kinds: kindCount, edge_types: typeCount },
  nodes,
  edges,
};

const text = JSON.stringify(view, null, 2) + '\n';
if (process.argv.includes('--check')) {
  const prev = existsSync(p(OUT)) ? readFileSync(p(OUT), 'utf8') : '';
  if (prev !== text) { console.error('视图过期：请重跑 node scripts/build-role-knowledge-view.mjs'); process.exit(1); }
  console.log('视图与源文件一致'); process.exit(0);
}
writeFileSync(p(OUT), text);
console.log('nodes', nodes.length, 'edges', edges.length);
console.log('node_kinds', kindCount);
console.log('edge_types', typeCount);
if (forbidden.length) { for (const f of forbidden) console.error('ERR ' + f); process.exit(1); }
console.log('禁止边: 0');
