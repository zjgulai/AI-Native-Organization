#!/usr/bin/env node
// 为 bp/index.html 生成分段预览图，输出到 bp/preview/。
//
// 用法：node bp/preview.mjs
// 依赖：本机 Google Chrome（无网络需求；字体 CDN 不可达时按回退链渲染）。
//
// 为什么需要脚本：预览图是逐段的 PNG，手工截图无法复现，文案一改就会静默过期。
// 本脚本按「先量高、再截图」两遍渲染，任何一次改完文案重跑即可对齐。
//
// 边界：预览图只是版面记录，不是 BP 的事实源，也不构成任何证据。
//       正文改动后必须重跑，否则预览图与 bp/index.html 不一致。

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const HERE = dirname(fileURLToPath(import.meta.url))
const SRC = join(HERE, 'index.html')
const OUT = join(HERE, 'preview')
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const WIDTH = 992

if (!existsSync(CHROME)) {
  console.error(`ERROR: 找不到 Chrome：${CHROME}`)
  process.exit(1)
}
if (!existsSync(SRC)) {
  console.error(`ERROR: 找不到 ${SRC}，先跑 bp/build.sh`)
  process.exit(1)
}

const html = readFileSync(SRC, 'utf8')
const styleEnd = html.lastIndexOf('</style>')
const head = html.slice(0, styleEnd + '</style>'.length)
const bodyStart = html.indexOf('<body')
const bodyEnd = html.indexOf('</body>')
if (styleEnd < 0 || bodyStart < 0 || bodyEnd < 0) {
  console.error('ERROR: bp/index.html 结构不符合预期（缺 <style> / <body>）')
  process.exit(1)
}

// 按文档顺序取出需要出图的片段：hero、各 section、footer。
// section 多数不带 class，因此不能要求 class 属性存在。
const body = html.slice(bodyStart, bodyEnd)
const segments = []
const re = /<(header|section|footer)\b([^>]*)>/g
let m
while ((m = re.exec(body)) !== null) {
  const tag = m[1]
  const attrs = m[2]
  const cls = (attrs.match(/class="([^"]*)"/) || [, ''])[1]
  if (tag === 'header' && !cls.includes('hero')) continue
  if (tag === 'footer' && !cls.includes('foot')) continue
  // 用标签配对找出片段结束位置（片段内部不再嵌套同名标签）。
  const start = m.index
  const closeTag = `</${tag}>`
  const end = body.indexOf(closeTag, start)
  if (end < 0) continue
  segments.push({ html: body.slice(start, end + closeTag.length) })
}

if (segments.length === 0) {
  console.error('ERROR: 未从 bp/index.html 中解析出任何片段')
  process.exit(1)
}

const names = segments.map((_, i) => (i === 0 ? 'hero' : i === segments.length - 1 ? 'footer' : `sec${String(i - 1).padStart(2, '0')}`))

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const tmp = join(tmpdir(), `bp-preview-${process.pid}`)
mkdirSync(tmp, { recursive: true })

const runChrome = (args) =>
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', ...args], {
    stdio: ['ignore', 'pipe', 'ignore'],
    maxBuffer: 64 * 1024 * 1024,
  }).toString()

let total = 0
for (let i = 0; i < segments.length; i++) {
  const page = `${head}</head><body><main class="page" style="padding-top:24px;padding-bottom:24px">${segments[i].html}</main></body></html>`
  const probe = join(tmp, `${names[i]}.html`)

  // 第一遍：量实际高度。Chrome 只给 DOM，因此把量到的值写进 <title> 再读回来。
  const withProbe = page.replace(
    '</main>',
    '</main><script>document.title="H:"+Math.ceil(document.querySelector("main").getBoundingClientRect().height)</script>'
  )
  writeFileSync(probe, withProbe)
  const dom = runChrome(['--window-size=' + WIDTH + ',600', '--virtual-time-budget=3000', '--dump-dom', `file://${probe}`])
  const t = dom.match(/<title>H:(\d+)<\/title>/)
  const height = t ? parseInt(t[1], 10) : 0
  if (!height || height < 40) {
    console.error(`WARN: ${names[i]} 量高失败，跳过`)
    continue
  }

  // 第二遍：按量到的高度截图。
  const out = join(OUT, `${names[i]}.png`)
  runChrome(['--window-size=' + WIDTH + ',' + height, '--virtual-time-budget=3000', `--screenshot=${out}`, `file://${probe}`])
  total++
  console.log(`  ${names[i]}.png  ${WIDTH}x${height}`)
}

rmSync(tmp, { recursive: true, force: true })
console.log(`生成 ${total} 张预览图到 bp/preview/`)
console.log('注意：预览图只记录版面，不是 BP 的事实源；文案改动后必须重跑本脚本。')
