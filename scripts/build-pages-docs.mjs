// build-pages-docs.mjs — 把独立的 HTML 文档归入 dist/ 发布包，使它们在 GitHub Pages 上可访问。
//
// 用法：node scripts/build-pages-docs.mjs
// 返回值：全部成功退出码 0；任一校验失败退出码 1。
//
// ── 为什么需要这个脚本 ────────────────────────────────────────────────
// `.github/workflows/pages.yml` 只上传 `./dist`。因此**只有 dist/ 里的文件会被公开**；
// 仓库其他目录下的 HTML 即使已提交，公网访问也是 404。手工复制可以做一次，但会静默过期：
// 源文档改了、dist 副本没改，公网就会长期展示旧内容而没有任何报错。
//
// ── 本脚本做两件事 ──────────────────────────────────────────────────
// 1. 复制（不改写）：自包含的 HTML 原样进入 dist/。
// 2. 复制并改写链接：对含相对链接的 HTML，按下面的规则把仓库内链接改写为公网可达形式。
//
// ── 链接改写规则 ────────────────────────────────────────────────────
// 对源文件中每个 `href="X"`：
//   - `#anchor` / `http(s)://` / `mailto:` → 原样保留；
//   - 解析后落在 `bp/` 下 → 改写为「从发布副本所在目录到 `dist/bp/...`」的相对路径，
//     使点击后留在站内（BP 本身也在 dist 里，站内跳转比跳 GitHub 更顺）；
//   - 其余 → 改写为 `https://github.com/<slug>/{blob|tree}/main/<仓库相对路径>`。
//     仓库内的 `.md` 在 Pages 上没有渲染版本，GitHub 的 blob 页才是它们唯一可读的位置。
//     `tree` 用于目录（如 `docs/adr/`），`blob` 用于文件。
//
// ── 边界 ────────────────────────────────────────────────────────────
// 本脚本只处理 `TARGETS` 中显式列出的文档，不做全仓扫描——发布面应当是可枚举、可审阅的，
// 隐式地把新文件带进公网是事故而不是功能。
// 本脚本不改写源文档：仓库内的相对链接在仓库内是正确的，改写只应发生在发布副本上。

import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
import { join, dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REPO_SLUG = 'zjgulai/AI-Native-Organization'
const BRANCH = 'main'
const GITHUB = `https://github.com/${REPO_SLUG}`

// 发布清单：唯一的事实源。新增公开发布的 HTML 必须在此登记。
const TARGETS = [
  { src: 'bp/index.html', out: 'dist/bp/index.html' },
  { src: 'docs/12-rollout/IMPLEMENTATION-BLUEPRINT.html', out: 'dist/docs/12-rollout/IMPLEMENTATION-BLUEPRINT.html' },
]

const posix = (p) => p.split(sep).join('/')
const problems = []

// 从 href 值解析出仓库相对路径；不可解析（外链、锚点、空）时返回 null。
function repoPathOf(href, srcRelDir) {
  if (!href) return null
  if (href.startsWith('#') || href.startsWith('mailto:')) return null
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return null // 带 scheme，含 http/https
  if (href.startsWith('//')) return null
  const [pathPart] = href.split('#')
  if (!pathPart) return null
  const abs = resolve(ROOT, srcRelDir, pathPart)
  const rel = relative(ROOT, abs)
  if (rel.startsWith('..')) return null // 指向仓库外，不属于本脚本管辖
  return posix(rel)
}

function rewriteHref(href, srcRelDir, outRelDir) {
  const repoPath = repoPathOf(href, srcRelDir)
  if (repoPath === null) return { href, changed: false, note: 'kept' }

  // 已发布到 dist 的姊妹文档 → 站内相对路径
  const published = TARGETS.find((t) => t.src === repoPath)
  if (published) {
    // 目录形式的源路径（bp/index.html 由 bp/ 提供）也按目录解析
    const from = resolve(ROOT, outRelDir)
    const to = resolve(ROOT, published.out)
    let rel = posix(relative(from, to))
    if (!rel.startsWith('.')) rel = `./${rel}`
    const hash = href.includes('#') ? `#${href.split('#').slice(1).join('#')}` : ''
    return { href: rel + hash, changed: true, note: 'in-site' }
  }

  // 仓库其他文件 → GitHub 绝对链接
  let kind = 'blob'
  try {
    if (statSync(resolve(ROOT, repoPath)).isDirectory()) kind = 'tree'
  } catch {
    problems.push(`链接目标在仓库中不存在：${repoPath}（来自 ${srcRelDir}）`)
    return { href, changed: false, note: 'missing' }
  }
  const suffix = repoPath.endsWith('/') ? '' : ''
  return { href: `${GITHUB}/${kind}/${BRANCH}/${repoPath}${suffix}`, changed: true, note: 'github' }
}

const summary = []

for (const { src, out } of TARGETS) {
  const srcAbs = join(ROOT, src)
  let html
  try {
    html = readFileSync(srcAbs, 'utf8')
  } catch (err) {
    problems.push(`无法读取源文件 ${src}：${err.message}`)
    continue
  }

  const srcRelDir = posix(dirname(src))
  const outRelDir = posix(dirname(out))

  let kept = 0
  let inSite = 0
  let toGithub = 0

  const rewritten = html.replace(/(\shref=")([^"]*)(")/g, (whole, pre, href, post) => {
    const { href: next, changed, note } = rewriteHref(href, srcRelDir, outRelDir)
    if (note === 'kept') kept++
    else if (note === 'in-site') inSite++
    else if (note === 'github') toGithub++
    return pre + next + post
  })

  // 复制后复查：发布副本里不应残留任何「指向仓库内、但公网不可达」的相对链接。
  const leftovers = []
  for (const m of rewritten.matchAll(/\shref="([^"]*)"/g)) {
    const href = m[1]
    const repoPath = repoPathOf(href, outRelDir)
    if (repoPath === null) continue // 锚点或外链
    if (TARGETS.some((t) => t.out === repoPath)) continue // 已发布的站内文档（站内相对链接）
    leftovers.push(href)
  }
  if (leftovers.length) {
    problems.push(`${out} 残留 ${leftovers.length} 条公网不可达的相对链接：${leftovers.slice(0, 5).join(', ')}`)
  }

  mkdirSync(dirname(join(ROOT, out)), { recursive: true })
  writeFileSync(join(ROOT, out), rewritten)
  summary.push({ src, out, kept, inSite, toGithub, bytes: Buffer.byteLength(rewritten) })
}

for (const s of summary) {
  console.log(`  ${s.src} → ${s.out}`)
  console.log(`    ${s.bytes} 字节；链接：保留 ${s.kept}、站内 ${s.inSite}、GitHub ${s.toGithub}`)
}

if (problems.length) {
  console.error('\nFAIL:')
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}

console.log(`\nOK: ${summary.length} 份文档已归入 dist/ 发布包`)
console.log('注意：源文档改动后必须重跑本脚本，否则公网会继续展示旧副本；')
console.log('      dist/ 是发布产物，其内容与源文档的一致性由本脚本的重跑保证，不由人工记忆保证。')
