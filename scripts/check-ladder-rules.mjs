// check-ladder-rules.mjs — 核对 DECISION-RIGHTS.md §3.1/§3.2 能否机械执行，且与语料期望一致。
//
// 为什么需要这个脚本：MGT-EVAL-B 的一致性失败，唯一合规处置是「把该决策下沉为确定性规则」。
// 规则若只写成散文，下一轮仍会不稳定。本脚本把 §3.1/§3.2 实现为纯函数，并断言
// 「机械判定 == 语料期望阶梯」，再以变异测试证明规则确实对输入敏感（而非恒返回期望值）。
//
// 边界（必须随结论一起读）：
//   - 这是**设计期核对工具**，不是 Policy Gate 实现，不产生任何运行能力（D-051）。
//   - 只覆盖 §3.1/§3.2 两条规则；其余阶梯用例由既有规则覆盖，不在本脚本断言范围。
//   - 脚本通过**不代表门禁通过**：MGT-EVAL-B 结果仍为不通过。
//
// 用法：node scripts/check-ladder-rules.mjs

import { readFileSync } from 'node:fs'

const CORPUS = 'docs/04-organization/management/eval/management-eval-corpus.v2.json'
const RULES = 'docs/04-organization/management/DECISION-RIGHTS.md'

const fails = []
const fail = (msg) => { fails.push(msg); console.log('  FAIL ' + msg) }
const ok = (msg) => console.log('  ok   ' + msg)
const assertEq = (actual, expected, label) => {
  if (actual === expected) ok(`${label}: ${actual}`)
  else fail(`${label}: 得到 ${actual}，期望 ${expected}`)
}

// ---------------------------------------------------------------- §3.1

// 判定次序表（从严到宽）：数值越小越严，整批取最小序对应的归属。
const SEQ = {
  owner_exclusive: 0,        // 序1 资本与预算终审、组织与人事、法律与对外承诺、最终停止 → L4
  evidence_gap_change: 1,    // 序2 缺基线或证据的实质变更                            → L3
  over_budget: 1,            // 序2 超出已批准预算包的支出                            → L3
  self_referential: 2,       // 序3 涉及治理官自身评估尺度                            → L2b
  cross_domain_transfer: 3,  // 序4 把资源或权限从一个域移往另一个域                  → L2
  control_boundary: 4,       // 序5 独立控制域的强制边界                              → L1-V
  business_standard: 5,      // 序6 域内标准版本                                      → 本域
  domain_standard: 5,        // 序6 域内标准版本                                      → 本域
  priority_quota: 5,         // 序6 域内资源配额                                      → 本域
}
const SEQ_LADDER = ['L4', 'L3', 'L2b', 'L2', 'L1-V'] // 序1..序5

/** 混合级别捆绑：整批按批内约束强度最高项归属。 */
function classifyBundle(items) {
  const ranks = items.map((it) => {
    const r = SEQ[it.kind]
    if (r === undefined) throw new Error('未知项性质: ' + it.kind)
    return r
  })
  const min = Math.min(...ranks)
  if (min < SEQ_LADDER.length) return SEQ_LADDER[min]
  // 序6：批内最高项就是域内标准/配额 → 同域归本域 L1；跨域则按域分别发布
  const domains = [...new Set(items.map((it) => it.domain))]
  if (domains.length === 1) return domains[0] === 'governance' ? 'L1-V' : 'L1-G'
  return 'SPLIT_BY_DOMAIN'
}

// ---------------------------------------------------------------- §3.2

/** 实质变更的证据前提：缺基线或缺增量证据 → L3（不是 L2）。 */
function classifySubstantiveChange({ hasBaseline, hasEvidence, crossDomain }) {
  if (!hasBaseline || !hasEvidence) return 'L3'
  return crossDomain ? 'L2' : 'L1'
}

// ---------------------------------------------------------------- 语料

const corpus = JSON.parse(readFileSync(CORPUS, 'utf8'))
const byId = new Map(corpus.cases.map((c) => [c.case_id, c]))

/** 从语料期望文本里取出阶梯取值，如 "L3 呈报（…）" → "L3"。 */
const ladderOf = (caseId) => {
  const c = byId.get(caseId)
  if (!c) throw new Error('语料中无此用例: ' + caseId)
  const m = /^(L[0-9](?:-[GV])?b?)/.exec(c.expected_deterministic_output.ladder_classification)
  if (!m) throw new Error('无法解析阶梯取值: ' + caseId)
  return m[1]
}

// 脚本显式建模、且必须受 §3.1/§3.2 管辖的用例。新增管辖用例时须改此表，
// 以免语料扩充后脚本静默漏检。
const GOVERNED = ['LB-MGT003-04', 'LB-MGT001-01']

// ---------------------------------------------------------------- 1. 规则文本存在性

console.log('[1] 规则文本存在性（防止规则被删而脚本仍通过）')
const rules = readFileSync(RULES, 'utf8')
for (const [needle, label] of [
  ['### 3.1 混合级别捆绑的归属判定', '§3.1 标题'],
  ['### 3.2 实质变更的证据前提', '§3.2 标题'],
  ['不构成L2跨域', '§3.1 反向澄清'],
  ['归属线≠版本所有权', '§3.1 效力不随归属改变'],
  ['L4 的呈报形态', '§3.1 L4呈报形态'],
  ['上升**L3呈报**', '§3.2 缺证据落 L3'],
]) {
  if (rules.includes(needle)) ok(label)
  else fail(label + ' 缺失：' + needle)
}

// ---------------------------------------------------------------- 2. 受管辖用例

console.log('\n[2] 受管辖用例（机械判定 == 语料期望）')

// LB-MGT003-04：U-01 控制边界（治理域）+ U-02 业务标准（增长域）+ U-03 优先级配额（增长域）
const MGT003_04 = [
  { kind: 'control_boundary', domain: 'governance' },
  { kind: 'business_standard', domain: 'growth' },
  { kind: 'priority_quota', domain: 'growth' },
]
assertEq(classifyBundle(MGT003_04), ladderOf('LB-MGT003-04'), '§3.1 LB-MGT003-04')

// LB-MGT001-01：无增量数据、无基线定义、仅竞品观察，且涉及跨域影响
assertEq(
  classifySubstantiveChange({ hasBaseline: false, hasEvidence: false, crossDomain: true }),
  ladderOf('LB-MGT001-01'),
  '§3.2 LB-MGT001-01',
)

console.log('\n[2b] 管辖范围自检')
for (const id of GOVERNED) {
  const c = byId.get(id)
  if (!c) fail(id + ' 不在语料中')
  else if (!c.ladder_subset) fail(id + ' 未被语料标为 ladder_subset')
  else ok(id + ' 在语料中且属阶梯子集')
}
if (GOVERNED.length !== 2) fail('管辖用例数应为 2，实际 ' + GOVERNED.length)

// ---------------------------------------------------------------- 3. 变异测试

console.log('\n[3] 变异测试（证明规则对输入敏感，而非恒返回期望值）')

// §3.1 变异：移走 U-01 → 批内最高项降为序6，且两项同属增长域 → L1-G
assertEq(classifyBundle(MGT003_04.slice(1)), 'L1-G', '§3.1 移走控制边界项 → 降为域内')

// §3.1 变异：并入一个跨域资源转移项 → 序4 生效 → L2
assertEq(
  classifyBundle([...MGT003_04, { kind: 'cross_domain_transfer', domain: 'growth' }]),
  'L2',
  '§3.1 并跨域转移 → 升为 L2',
)

// §3.1 变异：并入真人所有者专属项 → 序1 生效 → L4
assertEq(
  classifyBundle([...MGT003_04, { kind: 'owner_exclusive', domain: 'none' }]),
  'L4',
  '§3.1 并所有者专属项 → 升为 L4',
)

// §3.1 变异：批内最高项为序6 且跨域 → 按域分别发布，不强行唯一归属
assertEq(
  classifyBundle([
    { kind: 'business_standard', domain: 'growth' },
    { kind: 'domain_standard', domain: 'governance' },
  ]),
  'SPLIT_BY_DOMAIN',
  '§3.1 纯域内项跨域 → 按域分别发布',
)

// §3.2 变异：证据齐备 → 不再落 L3
assertEq(
  classifySubstantiveChange({ hasBaseline: true, hasEvidence: true, crossDomain: false }),
  'L1',
  '§3.2 证据齐备无跨域 → L1',
)
assertEq(
  classifySubstantiveChange({ hasBaseline: true, hasEvidence: true, crossDomain: true }),
  'L2',
  '§3.2 证据齐备且跨域 → L2',
)
// §3.2 变异：只要缺一项即为 L3（OR 而非 AND）
assertEq(
  classifySubstantiveChange({ hasBaseline: false, hasEvidence: true, crossDomain: false }),
  'L3',
  '§3.2 仅缺基线 → L3',
)
assertEq(
  classifySubstantiveChange({ hasBaseline: true, hasEvidence: false, crossDomain: false }),
  'L3',
  '§3.2 仅缺增量证据 → L3',
)

// ---------------------------------------------------------------- 结论

console.log('')
if (fails.length) {
  console.log(`FAIL: ${fails.length} 项不通过`)
  process.exit(1)
}
console.log('PASS: §3.1/§3.2 可机械执行，且与语料期望一致（含 7 项变异对照）')
console.log('注意：脚本通过不代表门禁通过；MGT-EVAL-B 结果仍为不通过。')
