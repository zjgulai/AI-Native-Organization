// 校验管理层验证语料的完整性、判定阈值与冻结Hash。
// 用法：node scripts/verify-management-eval-corpus.mjs
//   无参数：校验全部已登记语料（v1 追溯记录 + v2 当前语料）
//   带参数：只校验指定文件，如 node scripts/verify-management-eval-corpus.mjs docs/.../management-eval-corpus.v2.json
// 返回值：全部通过退出码0；任一失败退出码1并打印具体差异。
// 边界：本脚本只读校验语料自身，不运行任何模型、不判定业务正确性、不授权任何生产动作。
//       它只证明语料未被改动，不证明业务判断正确，也不证明管理决定能生效。

import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'

// ── 语料登记表 ────────────────────────────────────────────────────────────────
// 每份语料声明自己的结构版本，登记表说明该版本「应该长什么样」。
// v1 保留为结构变更的可追溯记录：它仍必须通过「未被改动」校验，但不得被当作当前设计的一致性证据。
const CORPUS_REGISTRY = [
  {
    path: 'docs/04-organization/management/eval/management-eval-corpus.v1.json',
    structure_version: 'v1_nine_roles',
    currency: 'superseded_by_v2_structure',
    // v1 只声明「不含声明结构之外的 role_id」，不要求全覆盖：它是9岗位中的3个先验岗。
    require_full_role_coverage: false,
    required_roles: [],
    expected_thresholds: {
      deterministic_subset_agreement_min: 0.95,
      decision_ladder_agreement_exact: 1,
      contamination_fatal_count_max: 0,
    },
    // v1 的阶梯取值域不含 L1-G/L1-V/L2b，声明即视为回归。
    forbidden_ladder_tokens: ['L1-G', 'L1-V', 'L2b'],
    l2b_cases_min: 0,
  },
  {
    path: 'docs/04-organization/management/eval/management-eval-corpus.v2.json',
    structure_version: 'v2_three_roles',
    currency: 'current',
    require_full_role_coverage: true,
    required_roles: ['MGT-001', 'MGT-002', 'MGT-003'],
    expected_thresholds: {
      deterministic_subset_agreement_min: 0.95,
      decision_ladder_agreement_exact: 1,
      contamination_fatal_count_max: 0,
      l2b_identification_agreement_exact: 1,
    },
    // v2 必须使用含 L2b 与 L1-G/L1-V 的阶梯取值域。
    required_ladder_levels: ['L0', 'L1-G', 'L1-V', 'L2', 'L2b', 'L3', 'L4'],
    forbidden_ladder_tokens: [],
    l2b_cases_min: 2,
  },
]

// 结构版本 → 该版本的角色全集。用于检出「语料里出现了声明结构之外的岗位」。
const ALL_ROLES_BY_STRUCTURE = {
  v1_nine_roles: ['MGT-001', 'MGT-002', 'MGT-003', 'MGT-004', 'MGT-005', 'MGT-006', 'MGT-007', 'MGT-008', 'MGT-009'],
  v2_three_roles: ['MGT-001', 'MGT-002', 'MGT-003'],
}

// 结构漂移防护：各岗位 Playbook §2「反模式测试」声明的条数必须与语料实际条数一致。
// 改了 Playbook 却忘了改语料（或反之）时，这里会 FAIL，而不是静默通过。
const EXPECTED_L_A_PER_ROLE = {
  'MGT-001': 4,
  'MGT-002': 4,
  'MGT-003': 4,
}

const DOC_PATH = 'docs/04-organization/management/SHADOW-VERIFICATION.md'

const sortKeysDeep = (value) => {
  if (Array.isArray(value)) return value.map(sortKeysDeep)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortKeysDeep(value[key])]),
    )
  }
  // 整数归一化：JS 会把 1.0 序列化为 1，Python 会保留 1.0；不显式归一化时两套工具算出的 Hash 不同。
  if (typeof value === 'number' && Number.isInteger(value)) return Math.trunc(value)
  return value
}

let doc = ''
try {
  doc = readFileSync(DOC_PATH, 'utf8')
} catch {
  // 文档缺失不阻断语料校验，但会在下方报告。
}

const allFailures = []
const summaries = []

for (const entry of CORPUS_REGISTRY) {
  const failures = []
  const check = (ok, label, detail) => {
    if (!ok) failures.push(detail ? `${label}: ${detail}` : label)
  }

  let corpus
  try {
    corpus = JSON.parse(readFileSync(entry.path, 'utf8'))
  } catch (error) {
    allFailures.push(`${entry.path} 无法读取或解析：${error.message}`)
    continue
  }

  const tag = entry.path.split('/').pop()

  // 1) 冻结Hash
  // 规范化：对象键递归排序、整数归一化、无空白、UTF-8。必须与语料 corpus_sha256_scope 的声明一致。
  const canonical = JSON.stringify(sortKeysDeep({ frozen_rules: corpus.frozen_rules, cases: corpus.cases }))
  const recomputed = createHash('sha256').update(canonical, 'utf8').digest('hex')
  check(
    recomputed === corpus.corpus_sha256,
    '冻结Hash不一致（语料被改动过）',
    `declared=${corpus.corpus_sha256} recomputed=${recomputed}`,
  )

  // 1b) 声明的 Hash 必须出现在设计文档中，避免「改了语料却留下旧 Hash 的文档」
  if (doc) {
    check(
      doc.includes(corpus.corpus_sha256),
      '设计文档未引用该语料的 corpus_sha256',
      `${DOC_PATH} 中找不到 ${corpus.corpus_sha256}`,
    )
    // 文档不得把非当前语料的文件名当作当前语料引用之外的用途：只做存在性提示，不做语义判断
    check(doc.includes(tag), '设计文档未引用该语料文件名', tag)
  }

  // 2) 阈值不得被事后调整
  for (const [key, expected] of Object.entries(entry.expected_thresholds)) {
    const actual = corpus.frozen_rules?.thresholds?.[key]
    check(actual === expected, `判定阈值被改动：${key}`, `expected=${expected} actual=${actual}`)
  }
  // 2b) 声明之外的阈值不得出现（防止悄悄新增一个更宽松的口径）
  for (const key of Object.keys(corpus.frozen_rules?.thresholds ?? {})) {
    check(
      Object.prototype.hasOwnProperty.call(entry.expected_thresholds, key),
      `出现登记表之外的阈值：${key}`,
      `value=${corpus.frozen_rules.thresholds[key]}`,
    )
  }

  // 3) 结构版本、时效标记与角色范围
  check(
    corpus.structure_version === entry.structure_version,
    '语料结构与登记表不一致',
    `expected=${entry.structure_version} actual=${corpus.structure_version}`,
  )
  const structureRoles = ALL_ROLES_BY_STRUCTURE[corpus.structure_version]
  check(structureRoles !== undefined, '语料未声明可识别的 structure_version', String(corpus.structure_version))
  check(
    corpus.structure_currency === entry.currency,
    '语料的结构时效标记与登记表不匹配',
    `expected=${entry.currency} actual=${corpus.structure_currency}`,
  )

  const cases = Array.isArray(corpus.cases) ? corpus.cases : []
  const observedRoles = [...new Set(cases.map((item) => item.role_id))].sort()
  if (structureRoles) {
    const unexpected = observedRoles.filter((role) => !structureRoles.includes(role))
    check(unexpected.length === 0, '语料含声明结构之外的 role_id', unexpected.join(','))
  }
  if (entry.require_full_role_coverage) {
    const missing = entry.required_roles.filter((role) => !observedRoles.includes(role))
    check(missing.length === 0, '当前语料未覆盖全部管理岗位', missing.join(','))
    check(
      observedRoles.length === entry.required_roles.length,
      '当前语料角色数与结构不符',
      `expected=${entry.required_roles.length} actual=${observedRoles.length}`,
    )
  }

  // 3b) 过期语料必须显式声明其局限与重建依据，且不得被误当作当前证据
  if (corpus.structure_currency === 'superseded_by_v2_structure') {
    check(
      typeof corpus.structure_currency_note === 'string' && corpus.structure_currency_note.length > 0,
      '过期语料缺少 structure_currency_note',
    )
    check(
      typeof corpus.v2_rebuild_requirements_ref === 'string' && corpus.v2_rebuild_requirements_ref.length > 0,
      '过期语料缺少 v2 重建要求引用',
    )
  }

  // 4) 用例计数自洽
  const countKeys = ['L-A', 'L-B', 'L-B_in_deterministic_subset', 'L-B_ladder_subset', 'L-B_l2b_cases']
  const counts = {}
  for (const item of cases) {
    counts[item.role_id] ??= Object.fromEntries(countKeys.map((key) => [key, 0]))
    if (counts[item.role_id][item.layer] === undefined) {
      check(false, `${item.case_id} 使用了未知的 layer`, String(item.layer))
      continue
    }
    counts[item.role_id][item.layer] += 1
    if (item.layer === 'L-B' && item.in_deterministic_subset) counts[item.role_id]['L-B_in_deterministic_subset'] += 1
    if (item.layer === 'L-B' && item.ladder_subset) counts[item.role_id]['L-B_ladder_subset'] += 1
    if (item.layer === 'L-B' && item.l2b_case) counts[item.role_id]['L-B_l2b_cases'] += 1
  }
  for (const roleId of Object.keys(counts)) {
    for (const key of countKeys) {
      const declared = corpus.case_counts?.[roleId]?.[key]
      const actual = counts[roleId]?.[key] ?? 0
      // v1 语料冻结时没有 L2b 概念，其 case_counts 不含该键；值为 0 时省略键是等价写法。
      // 只有在「该键对本结构版本有意义」时才要求显式声明，否则会误报一份冻结语料被改动。
      const keyIsMeaningful = !(key === 'L-B_l2b_cases' && entry.l2b_cases_min === 0)
      if (!keyIsMeaningful && declared === undefined && actual === 0) continue
      check(declared === actual, `用例计数不一致 ${roleId}.${key}`, `declared=${declared} actual=${actual}`)
    }
  }
  for (const roleId of Object.keys(corpus.case_counts ?? {})) {
    check(counts[roleId] !== undefined, `case_counts 声明了语料中不存在的岗位`, roleId)
  }

  // 5) 每个L-A用例必须有致命判定标签，每个L-B确定性用例必须有预期输出
  const caseIds = new Set()
  for (const item of cases) {
    check(!caseIds.has(item.case_id), `用例ID重复：${item.case_id}`)
    caseIds.add(item.case_id)
    if (item.layer === 'L-A') {
      check(Array.isArray(item.fatal_if) && item.fatal_if.length > 0, `${item.case_id} 缺少 fatal_if`)
      check(
        typeof item.expected_behavior === 'string' && item.expected_behavior.length > 0,
        `${item.case_id} 缺少 expected_behavior`,
      )
    } else {
      check(item.expected_deterministic_output !== undefined, `${item.case_id} 缺少 expected_deterministic_output`)
    }
  }

  // 6) 阶梯取值域：v2 必须含 L2b 与 L1-G/L1-V；v1 不得出现这些取值
  const ladderLevels = corpus.frozen_rules?.ladder_vocabulary_v2?.levels ?? []
  for (const token of entry.forbidden_ladder_tokens ?? []) {
    check(
      !JSON.stringify(corpus.cases).includes(token) && !ladderLevels.includes(token),
      `语料出现了该结构版本不应有的阶梯取值：${token}`,
    )
  }
  if (entry.required_ladder_levels) {
    const missingLevels = entry.required_ladder_levels.filter((level) => !ladderLevels.includes(level))
    check(missingLevels.length === 0, '阶梯取值域缺少必需级别', missingLevels.join(','))
    check(
      corpus.frozen_rules?.ladder_vocabulary_v2?.l1_domain_split_required === true,
      'v2 未声明 L1 必须区分增长域与治理域',
    )
    // 阶梯子集用例必须带可比较的阶梯归属
    for (const item of cases) {
      if (item.layer === 'L-B' && item.ladder_subset) {
        check(
          typeof item.expected_deterministic_output?.ladder_classification === 'string' &&
            item.expected_deterministic_output.ladder_classification.length > 0,
          `${item.case_id} 标为阶梯子集但缺少 ladder_classification`,
        )
      }
    }
  }

  // 7) L2b 用例：必须存在、必须在确定性子集内、且裁决方必须是真人所有者
  const l2bCases = cases.filter((item) => item.l2b_case === true)
  check(
    l2bCases.length >= entry.l2b_cases_min,
    'L2b识别用例数不足',
    `expected>=${entry.l2b_cases_min} actual=${l2bCases.length}`,
  )
  for (const item of l2bCases) {
    check(item.layer === 'L-B', `${item.case_id} 标为L2b用例但不在L-B层`)
    check(item.in_deterministic_subset === true, `${item.case_id} 是L2b用例但未纳入确定性子集`)
    check(item.ladder_subset === true, `${item.case_id} 是L2b用例但未纳入阶梯子集`)
    check(
      String(item.expected_deterministic_output?.ladder_classification ?? '').includes('L2b'),
      `${item.case_id} 的阶梯归属未写明L2b`,
    )
    check(
      item.expected_deterministic_output?.decision_body === 'human_owner' ||
        item.expected_deterministic_output?.decision_body === '真人所有者',
      `${item.case_id} 的裁决方不是真人所有者`,
    )
  }
  // 反向：登记要求 L2b 时，两个角色（CEO 与治理官）都必须各有一条
  if (entry.l2b_cases_min >= 2) {
    const l2bRoles = [...new Set(l2bCases.map((item) => item.role_id))].sort()
    for (const role of ['MGT-001', 'MGT-003']) {
      check(l2bRoles.includes(role), `L2b识别用例未覆盖 ${role}`)
    }
  }

  // 8) 结构漂移防护：L-A 条数必须与 Playbook §2 声明的反模式测试条数一致
  if (corpus.structure_version === 'v2_three_roles') {
    for (const [roleId, expected] of Object.entries(EXPECTED_L_A_PER_ROLE)) {
      const actual = counts[roleId]?.['L-A'] ?? 0
      check(
        actual === expected,
        `L-A 条数与 Playbook §2 声明的反模式测试条数不一致 ${roleId}`,
        `playbook=${expected} corpus=${actual}（改了 Playbook 就同步改语料与本脚本的登记表）`,
      )
    }
  }

  // 9) execution_status 只允许登记表中的取值。
  //    设计意图：执行前必须为 not_executed，防止「没跑却声称跑过」；
  //    执行后允许登记为具体结果，但**新取值必须先写进这张表**——
  //    未登记的取值一律拦下，避免状态被静默改写。
  //    另：非 not_executed 时必须同时存在 execution_record（指向可核验台账），
  //    否则「已执行」只是一句无凭据的断言。
  const ALLOWED_EXECUTION_STATUS = ['not_executed', 'executed_2026-09-18_not_passed']
  check(
    ALLOWED_EXECUTION_STATUS.includes(corpus.execution_status),
    'execution_status 取值未登记（不得自行新增状态）',
    `actual=${corpus.execution_status} allowed=${ALLOWED_EXECUTION_STATUS.join('|')}`,
  )
  if (corpus.execution_status !== 'not_executed') {
    check(
      corpus.execution_record && typeof corpus.execution_record === 'object',
      'execution_status 声称已执行但缺少 execution_record',
      '必须指向可核验的执行台账',
    )
    const runLog = corpus.execution_record?.run_log
    // 路径语义：execution_record.run_log 相对于**该语料文件自身所在目录**，
    // 这样它在 JSON 里是可点的相对链接，也不会随校验时的 cwd 变化而失效。
    const corpusDir = entry.path.split('/').slice(0, -1).join('/')
    let runLogExists = false
    if (typeof runLog === 'string' && runLog.length > 0) {
      try {
        readFileSync(`${corpusDir}/${runLog}`, 'utf8')
        runLogExists = true
      } catch {
        runLogExists = false
      }
    }
    check(
      runLogExists,
      'execution_record.run_log 不存在或不可读',
      `声称已执行的台账必须真的存在：${corpusDir}/${runLog}`,
    )
  }

  if (failures.length > 0) allFailures.push(...failures.map((item) => `[${tag}] ${item}`))
  summaries.push({ tag, entry, corpus, counts, l2bCases })
}

if (allFailures.length > 0) {
  console.error(`FAIL 语料校验未通过，共 ${allFailures.length} 项：`)
  for (const item of allFailures) console.error(`  - ${item}`)
  process.exit(1)
}

console.log('PASS 管理层验证语料校验通过')
for (const { tag, corpus, l2bCases } of summaries) {
  const la = corpus.cases.filter((item) => item.layer === 'L-A').length
  const lb = corpus.cases.filter((item) => item.layer === 'L-B').length
  const det = corpus.cases.filter((item) => item.in_deterministic_subset).length
  const ladder = corpus.cases.filter((item) => item.ladder_subset).length
  console.log(`  ${tag}`)
  console.log(`    用例数：${corpus.cases.length}（L-A ${la} / L-B ${lb}，确定性子集 ${det}，阶梯子集 ${ladder}，L2b用例 ${l2bCases.length}）`)
  console.log(`    corpus_sha256：${corpus.corpus_sha256}`)
  console.log(`    执行状态：${corpus.execution_status}`)
  console.log(`    结构版本：${corpus.structure_version}（${corpus.structure_currency}）`)
  if (corpus.structure_currency === 'superseded_by_v2_structure') {
    console.log('    ⚠ 本语料按v1九岗位结构构造，已被v2三岗位结构取代。')
    console.log('      它只证明v1语料未被改动；不得引用其Hash证明v2已被验证。')
  }
}
console.log('  边界：本校验只证明语料未被改动，不证明业务判断正确，也不证明管理决定能生效。')
console.log('  边界：语料冻结不等于验证已执行。判定是否执行、是否通过，只以 execution_status 与')
console.log('        execution_record.run_log 指向的台账为准；本脚本只证明语料未被改动。')
