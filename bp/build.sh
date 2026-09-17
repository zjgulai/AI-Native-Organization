#!/usr/bin/env bash
# 把 _body.html 装回模板，生成可发布的 index.html。
#
# 约定：index.html = 模板头（<main class="page"> 之前的全部内容，含两段 <style>）
#                  + _body.html
#                  + </body></html>
#
# 改文案只需编辑 _body.html；改样式编辑 index.html 的两段 <style>，然后跑本脚本。
# 首尾各 chmod 一次：本机的写入路径会把新文件权限置为 000。
set -euo pipefail
cd "$(dirname "$0")"

chmod 644 index.html _body.html 2>/dev/null || true

awk '/^<main class="page">/{exit} {print}' index.html > .head.tmp

if [ ! -s .head.tmp ] || ! grep -q '</style>' .head.tmp; then
  echo "ERROR: 未能从 index.html 提取模板头，构建中止（index.html 未被修改）" >&2
  rm -f .head.tmp
  exit 1
fi

cat .head.tmp _body.html > .index.tmp
printf '</body>\n</html>\n' >> .index.tmp
mv .index.tmp index.html
rm -f .head.tmp

chmod 644 index.html _body.html 2>/dev/null || true
echo "built index.html: $(wc -c < index.html | tr -d ' ') bytes"
