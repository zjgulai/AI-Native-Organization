// 校验 BP 经济模型的三处一致性：参数算术、页面取值、文档取值。
// 用法：node scripts/verify-bp-economics.mjs
// 返回值：全部通过退出码0；任一失败退出码1并逐项列出。
// 边界：本脚本只检查「同一组数字在三处的取值是否一致、组内算术是否自洽」，
//       不检查这些假设本身是否合理、是否可达成，也不构成任何商业判断。
//
// 事实源：docs/02-strategy/bp-economic-model.json
// 同步目标：docs/02-strategy/BP-ECONOMIC-MODEL.md 与 bp/index.html

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const SOURCE = 'docs/02-strategy/bp-economic-model.json'

const problems = []
const fail = (scope, message) => problems.push(`[${scope}] ${message}`)

// ---------- 读取事实源 ----------

const sourcePath = join(ROOT, SOURCE)
if (!existsSync(sourcePath)) {
  console.error(`ERROR: 找不到事实源 ${SOURCE}`)
  process.exit(1)
}

let model
try {
  model = JSON.parse(readFileSync(sourcePath, 'utf8'))
} catch (err) {
  console.error(`ERROR: ${SOURCE} 不是合法 JSON：${err.message}`)
  process.exit(1)
}

// ---------- 区间运算 ----------

const EPS = model.checks_tolerance ?? 0.02

const bounds = (ranges) => {
  const los = ranges.map((r) => Math.min(...r))
  const his = ranges.map((r) => Math.max(...r))
  return [Math.min(...los), Math.max(...his)]
}

// 区间表达式：既可以是 [[lo,hi]]，也可以是 { op, ... } 的嵌套表达式。
const evaluate = (node) => {
  if (Array.isArray(node)) return bounds(node)
  if (node && typeof node === 'object' && typeof node.op === 'string') {
    const left = evaluate(node.left)
    const right = evaluate(node.right)
    if (node.op === 'mul_ranges') return [left[0] * right[0], left[1] * right[1]]
    if (node.op === 'add_ranges') return [left[0] + right[0], left[1] + right[1]]
    if (node.op === 'div_ranges') return [left[0] / right[1], left[1] / right[0]]
    throw new Error(`表达式不支持的操作：${node.op}`)
  }
  throw new Error(`无法解析的区间表达式：${JSON.stringify(node)}`)
}

const close = (a, b) => Math.abs(a - b) <= EPS

// ---------- 算术检查 ----------

const checkResults = []

for (const check of model.checks ?? []) {
  const id = check.id ?? '(no id)'
  try {
    switch (check.op) {
      case 'mul_ranges':
      case 'add_ranges':
      case 'div_ranges': {
        const got = evaluate({ op: check.op, left: check.left, right: check.right })
        const want = bounds(check.expect)
        if (!close(got[0], want[0]) || !close(got[1], want[1])) {
          fail('算术', `${id}: 计算得 [${got[0].toFixed(4)}, ${got[1].toFixed(4)}]，声明为 [${want[0]}, ${want[1]}]`)
        } else {
          checkResults.push(id)
        }
        break
      }
      case 'range_contains': {
        const outer = bounds(check.outer)
        const inner = bounds(check.inner)
        if (!(inner[0] >= outer[0] - EPS && inner[1] <= outer[1] + EPS)) {
          fail('算术', `${id}: [${inner[0]}, ${inner[1]}] 不落在 [${outer[0]}, ${outer[1]}] 之内`)
        } else {
          checkResults.push(id)
        }
        break
      }
      case 'sum_values': {
        const got = check.values.reduce((a, b) => a + b, 0)
        if (!close(got, check.expect)) fail('算术', `${id}: 求和得 ${got}，声明为 ${check.expect}`)
        else checkResults.push(id)
        break
      }
      case 'pct_sum': {
        const got = check.values.reduce((a, b) => a + b, 0)
        if (!close(got, check.expect)) fail('算术', `${id}: 百分比合计 ${got}%，应为 ${check.expect}%`)
        else checkResults.push(id)
        break
      }
      case 'weighted_pct': {
        const sum = check.parts.reduce((a, p) => a + p.amount * p.pct, 0)
        const got = sum / check.total
        if (!close(got, check.expect)) {
          fail('算术', `${id}: 加权得 ${got.toFixed(4)}%，声明为 ${check.expect}%`)
        } else {
          checkResults.push(id)
        }
        break
      }
      default:
        fail('算术', `${id}: 未知操作 ${check.op}`)
    }
  } catch (err) {
    fail('算术', `${id}: ${err.message}`)
  }
}

// ---------- 参数性质 ----------

const parameters = model.parameters ?? []
if (parameters.length === 0) fail('参数', '参数表为空')
for (const p of parameters) {
  if (p.kind !== 'assumption') {
    fail('参数', `${p.id} ${p.name}: 性质为「${p.kind}」，本表只允许 assumption；实测值须移入证据文档`)
  }
  const hasValue = p.range || (p.first_year_range && p.renewal_range)
  if (!hasValue) fail('参数', `${p.id} ${p.name}: 缺少取值范围`)
  if (!p.replace_with) fail('参数', `${p.id} ${p.name}: 缺少「用什么替换成真的」`)
}

// ---------- 渲染取值 ----------

// HTML 去标签、解码常见实体、压缩空白，得到与浏览器渲染接近的文本。
const htmlToText = (html) =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')

const renderTokens = model.render_tokens ?? {}
const tokenReport = []

for (const [relPath, tokens] of Object.entries(renderTokens)) {
  const full = join(ROOT, relPath)
  if (!existsSync(full)) {
    fail('取值', `${relPath}: 文件不存在`)
    continue
  }
  const raw = readFileSync(full, 'utf8')
  const text = relPath.endsWith('.html') ? htmlToText(raw) : raw.replace(/\s+/g, ' ')
  const missing = tokens.filter((t) => !text.includes(t.replace(/\s+/g, ' ')))
  if (missing.length) {
    for (const t of missing) fail('取值', `${relPath}: 缺少取值「${t}」`)
  } else {
    tokenReport.push({ relPath, count: tokens.length })
  }
}

// ---------- 覆盖检查：事实源里每个参数的呈现值都应能在页面上找到 ----------

const pagePath = join(ROOT, 'bp/index.html')
if (existsSync(pagePath)) {
  const pageText = htmlToText(readFileSync(pagePath, 'utf8'))
  for (const [label, ranges] of Object.entries(model.market ?? {})) {
    const display = String(ranges.display ?? '').replace(/^约\s*/, '')
    const stem = display.split(' / ')[0]
    if (stem && !pageText.includes(stem)) {
      fail('覆盖', `market.${label}: 页面缺少「${stem}」`)
    }
  }
  for (const t of model.capital?.tranches ?? []) {
    const amount = `${t.amount.toLocaleString('en-US')} 万`
    if (!pageText.includes(amount)) fail('覆盖', `capital.${t.id}: 页面缺少「${amount}」`)
  }
} else {
  fail('覆盖', 'bp/index.html 不存在，无法核对页面取值')
}

// ---------- 报告 ----------

const scope = (name) => problems.filter((p) => p.startsWith(`[${name}]`)).length

console.log(`事实源：${SOURCE}`)
console.log(`算术检查：${checkResults.length} 项通过，${scope('算术')} 项失败`)
console.log(`参数性质：${parameters.length} 项，全部为 assumption，${scope('参数')} 项异常`)
console.log(`渲染取值：${tokenReport.map((t) => `${t.relPath}(${t.count})`).join('、') || '无'}，${scope('取值')} 项缺失`)
console.log(`页面覆盖：${scope('覆盖')} 项缺失`)

if (problems.length) {
  console.log('')
  for (const p of problems) console.log(`ERROR: ${p}`)
  console.log(`\n共 ${problems.length} 个问题。`)
  process.exit(1)
}

console.log('\nOK：BP 经济模型的算术、文档取值与页面取值一致。')
console.log('说明：本结果只证明三者写法一致且算术自洽，不证明这些假设成立或可达成。')
