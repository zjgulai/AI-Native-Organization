#!/usr/bin/env node
// knowledge-overlay.mjs — 校验并解析 ai-org-knowledge-overlay.json
// 用法: node scripts/knowledge-overlay.mjs verify
//       node scripts/knowledge-overlay.mjs resolve <ID>   (D-020 / AGT-001 / MGT-003 / SHOP-G1 / BVS-06 ...)
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve as presolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = presolve(dirname(fileURLToPath(import.meta.url)), '..');
const OVERLAY = 'docs/09-governance/knowledge-graph/ai-org-knowledge-overlay.json';
const p = (f) => presolve(ROOT, f);

// 类型路由：ID 模式 → 权威源。routes 作为脚本常量，受 verify 约束（见方案 §5.2）。
const ROUTES = [
  [/^ADR-\d{4}$/, 'ADR', 'docs/adr/'],
  [/^D-\d{3}$/, 'Decision', 'docs/00-project/DECISIONS.md'],
  [/^MGT-\d{3}$/, 'ManagementRole', 'docs/04-organization/management/management-catalog.json'],
  [/^AGT-0(0[1-9]|[1-4]\d|50)$/, 'ProjectRole', 'docs/05-agents/role-catalog.json'],
  [/^AGT-(05[1-9]|0[6-9]\d|10[0-2])$/, 'SourcePersona', 'docs/12-rollout/SANBAO-VISUAL-IDENTITY-ASSET-PLAN.md'],
  [/^VIB-/, 'VisualIdentityBinding', 'docs/12-rollout/SANBAO-VISUAL-IDENTITY-ASSET-PLAN.md'],
  [/^FLOW-\d{2}$/, 'BusinessValueFlow', 'docs/07-orchestration/collaboration-graph.json'],
  [/^(BVS|CVS)-\d{2}$/, 'ValueStream', 'docs/03-scenarios/e2e-value-streams.json'],
  [/^SCN-\d{3}$/, 'BusinessScenario', 'docs/07-orchestration/collaboration-graph.json'],
  [/^STG-\d{2}$/, 'CaseStage', 'docs/07-orchestration/collaboration-graph.json'],
  [/^(ART|REC|FSB|BIND)-/, 'DesignContract', 'docs/07-orchestration/collaboration-graph.json'],
  [/^R?PB-/, 'Playbook', 'docs/06-playbooks/PLAYBOOKS.md'],
  [/^(SHOP|ORG|PILOT|VIS)-G\d$/, 'Gate', 'docs/00-project/STATUS.md'],
  [/^RP-[GM]\d$/, 'Gate', 'docs/12-rollout/ROLE-PRESET-IMPLEMENTATION-TODO.md'],
  [/^MGT-EVAL-/, 'Gate', 'docs/04-organization/management/SHADOW-VERIFICATION.md'],
  [/^EVD-\d{3}$/, 'EvidenceSource', 'docs/14-research/SOURCES.md'],
  [/^F-\d{3}$/, 'Fact', 'docs/01-discovery/FACTS.md'],
];

const REQUIRED = ['corrections', 'supersedes', 'aliases', 'source_personas', 'forbidden_edges', 'gate_families'];
const errs = [], warns = [];

function verify() {
  if (!existsSync(p(OVERLAY))) { errs.push(`覆盖层不存在: ${OVERLAY}`); return; }
  const ov = JSON.parse(readFileSync(p(OVERLAY), 'utf8'));

  for (const k of REQUIRED) if (!Array.isArray(ov[k])) errs.push(`缺字段或非数组: ${k}`);
  if (ov.runtime !== false) errs.push('runtime 必须为 false');
  if (ov.grants_authorization !== false) errs.push('grants_authorization 必须为 false');

  const ids = new Set();
  for (const k of REQUIRED) {
    for (const r of ov[k] || []) {
      // gate_families 以 prefix 作稳定键，其余用 id
      const key = r.id || (k === 'gate_families' ? r.prefix : null);
      if (!key) errs.push(`${k} 有记录缺 ${k === 'gate_families' ? 'prefix' : 'id'}`);
      else if (ids.has(key)) errs.push(`键重复: ${key}`);
      else ids.add(key);
    }
  }

  // 禁止边必须显式带 runtime 排除语义
  for (const fe of ov.forbidden_edges || []) {
    if (!fe.reason) errs.push(`${fe.id} 缺 reason`);
    if (!fe.allowed_alternative) warns.push(`${fe.id} 未给 allowed_alternative`);
  }

  // corrections 的 claim_ref 文件必须存在
  for (const c of ov.corrections || []) {
    const f = (c.claim_ref || '').split(':')[0].split(',')[0].trim();
    if (f && !existsSync(p(f))) errs.push(`${c.id} 指向不存在的文件: ${f}`);
    if (!c.corrected_by) errs.push(`${c.id} 缺 corrected_by`);
    if (!c.verified) errs.push(`${c.id} 缺 verified 日期`);
  }

  // supersedes 替代链：不得自环，且 from != to
  for (const s of ov.supersedes || []) {
    if (s.from === s.to) errs.push(`${s.id} 自环`);
    if (!s.superseded_clause || !s.retained_clause) errs.push(`${s.id} 缺子句级作用域（superseded/retained）`);
  }

  // aliases 的 canonical 必须能在 e2e-value-streams.json 中找到
  const e2e = JSON.parse(readFileSync(p('docs/03-scenarios/e2e-value-streams.json'), 'utf8'));
  const streamIds = new Set(e2e.streams.map(s => s.id));
  for (const a of ov.aliases || []) if (!streamIds.has(a.canonical)) errs.push(`${a.id} canonical 不存在: ${a.canonical}`);

  // source_personas：源人物不得被当成 ProjectRole
  const cat = JSON.parse(readFileSync(p('docs/05-agents/role-catalog.json'), 'utf8'));
  const roleIds = new Set(cat.roles.map(r => r.id));
  const mgtCat = JSON.parse(readFileSync(p('docs/04-organization/management/management-catalog.json'), 'utf8'));
  const mgtIds = new Set(mgtCat.roles.map(r => r.id));
  for (const s of ov.source_personas || []) {
    if (roleIds.has(s.source_persona)) errs.push(`${s.id} 把 ${s.source_persona} 当 ProjectRole，实际应为 SourcePersona`);
    if (!mgtIds.has(s.management_role)) errs.push(`${s.id} management_role 不存在于 management-catalog: ${s.management_role}`);
  }

  // gate_families 必须带 as_of
  for (const g of ov.gate_families || []) {
    if (!g.as_of) errs.push(`${g.prefix} 门族缺 as_of`);
    if (!g.current) errs.push(`${g.prefix} 门族缺 current`);
  }

  // ContractRef 不得成为节点（方案 §5.7 第 1 条）
  const dump = JSON.stringify(ov);
  if (/"ContractRef"/.test(dump)) errs.push('出现 ContractRef 节点，违反 §5.7 第 1 条');
}

function resolveId(id) {
  for (const [re, type, src] of ROUTES) if (re.test(id)) return { id, type, source: src, exists: existsSync(p(src)) };
  return { id, type: 'UNKNOWN', source: null, exists: false };
}

const [, , cmd, arg] = process.argv;
if (cmd === 'verify') {
  verify();
  const ov = existsSync(p(OVERLAY)) ? JSON.parse(readFileSync(p(OVERLAY), 'utf8')) : {};
  const n = REQUIRED.reduce((a, k) => a + (ov[k]?.length || 0), 0);
  console.log(`覆盖层记录: ${n}`);
  for (const k of REQUIRED) console.log(`  ${k}: ${ov[k]?.length ?? 0}`);
  for (const w of warns) console.log(`WARN ${w}`);
  for (const e of errs) console.log(`ERR  ${e}`);
  console.log(errs.length ? `FAIL (${errs.length} 错误)` : 'PASS');
  process.exit(errs.length ? 1 : 0);
} else if (cmd === 'resolve') {
  if (!arg) { console.error('用法: resolve <ID>'); process.exit(2); }
  const r = resolveId(arg);
  const ov = existsSync(p(OVERLAY)) ? JSON.parse(readFileSync(p(OVERLAY), 'utf8')) : {};
  const corr = (ov.corrections || []).filter(c => (c.claim_ref || '').includes(arg));
  const sup = (ov.supersedes || []).filter(s => s.from === arg || s.to === arg);
  console.log(JSON.stringify({ route: r, corrections: corr.map(c => c.id), supersedes: sup.map(s => s.id) }, null, 2));
  process.exit(r.type === 'UNKNOWN' ? 1 : 0);
} else {
  console.error('用法: node scripts/knowledge-overlay.mjs verify | resolve <ID>');
  process.exit(2);
}
