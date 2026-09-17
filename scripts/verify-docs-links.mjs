// 校验仓库内 Markdown 文档的相对链接与锚点，以及 JSON 文件的语法合法性。
// 用法：node scripts/verify-docs-links.mjs
// 返回值：全部通过退出码0；任一失败退出码1并按文件列出问题。
// 边界：本脚本只检查「链接能不能指向存在的文件与锚点」和「JSON 能否解析」，
//       不检查链接语义是否正确、不检查文档结论是否成立。

import { readFileSync, existsSync, statSync } from 'node:fs'
import { readdirSync } from 'node:fs'
import { join, dirname, resolve, relative, sep } from 'node:path'

const ROOT = process.cwd()
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', '.loopx', '.github'])

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const files = walk(ROOT)
const mdFiles = files.filter((f) => f.endsWith('.md'))
const jsonFiles = files.filter((f) => f.endsWith('.json'))

// GitHub 风格的标题锚点：小写、去标点、空格转连字符、保留中日韩字符与连字符。
const slugify = (heading) =>
  heading
    .trim()
    .toLowerCase()
    .replace(/[`*_~[\](){}<>#!?.,:;'"“”‘’·|/\\+=@$%^&]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

// 收集每份文档的锚点集合（标题 + 显式 HTML 锚点）
const anchorsByFile = new Map()
for (const file of mdFiles) {
  const text = readFileSync(file, 'utf8')
  const anchors = new Set()
  let inFence = false
  for (const line of text.split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) anchors.add(slugify(heading[2]))
    for (const m of line.matchAll(/<a\s+(?:id|name)=["']([^"']+)["']/gi)) anchors.add(m[1].toLowerCase())
  }
  anchorsByFile.set(file, anchors)
}

const problems = []

// 1) Markdown 链接
let linkCount = 0
let externalCount = 0
for (const file of mdFiles) {
  const text = readFileSync(file, 'utf8')
  const lines = text.split('\n')
  let inFence = false
  lines.forEach((line, index) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      return
    }
    if (inFence) return
    for (const m of line.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const raw = m[1]
      if (/^(https?:|mailto:|#!)/i.test(raw)) {
        if (/^https?:/i.test(raw)) externalCount += 1
        if (raw.startsWith('#') && raw.length > 1) {
          const anchor = decodeURIComponent(raw.slice(1)).toLowerCase()
          if (!anchorsByFile.get(file).has(anchor)) {
            problems.push(`${relative(ROOT, file)}:${index + 1} 锚点不存在：${raw}`)
          }
        }
        continue
      }
      linkCount += 1
      const [pathPart, anchorPart] = raw.split('#')
      const target = resolve(dirname(file), decodeURIComponent(pathPart))
      if (!existsSync(target)) {
        problems.push(`${relative(ROOT, file)}:${index + 1} 链接目标不存在：${raw}`)
        continue
      }
      if (anchorPart) {
        if (!target.endsWith('.md')) continue
        const anchors = anchorsByFile.get(target)
        if (!anchors) {
          problems.push(`${relative(ROOT, file)}:${index + 1} 锚点指向非Markdown文件：${raw}`)
          continue
        }
        if (!anchors.has(decodeURIComponent(anchorPart).toLowerCase())) {
          problems.push(`${relative(ROOT, file)}:${index + 1} 锚点不存在：${raw}`)
        }
      }
    }
  })
}

// 2) JSON 语法
for (const file of jsonFiles) {
  try {
    JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    problems.push(`${relative(ROOT, file)} JSON 解析失败：${error.message}`)
  }
}

if (problems.length > 0) {
  console.error(`FAIL 文档一致性校验未通过，共 ${problems.length} 项：`)
  for (const item of problems) console.error(`  - ${item}`)
  process.exit(1)
}

console.log('PASS 文档一致性校验通过')
console.log(`  Markdown：${mdFiles.length} 份（相对链接 ${linkCount} 条，外部链接 ${externalCount} 条未做网络校验）`)
console.log(`  JSON：${jsonFiles.length} 份全部可解析`)
console.log('  边界：本校验只证明链接可解析、锚点存在、JSON 合法，不证明文档结论成立。')
