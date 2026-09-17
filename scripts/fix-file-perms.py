#!/usr/bin/env python3
"""fix-file-perms.py — 修复 DSH write/edit 工具落盘产生的异常权限。

背景（实测，DSH Desktop / macOS）：
  - write 工具新建文件 → 0600（仓库惯例是 0644）
  - edit 工具修改已有文件 → 0000（owner 自己都读不了，后续 read/edit/grep 全部 EACCES）
  实测重启进程只把 write 从 0000 改善到 0600；edit 仍稳定产出 0000。

  git 只记录 executable bit，所以 0600/0000 不影响提交内容与 GitHub Pages，
  但会在本地阻塞后续 read/edit，并让以非 owner 身份运行的 web 服务器 403。

用法：
  python3 scripts/fix-file-perms.py            # 修复
  python3 scripts/fix-file-perms.py --check    # 只检查，有异常 exit 1（可入 CI）
  python3 scripts/fix-file-perms.py --quiet    # 仅输出结论
"""
from __future__ import annotations

import os
import stat
import subprocess
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 仓库惯例：普通文件 0644，可执行脚本 0755
OK_PLAIN = 0o644
OK_EXEC = 0o755

# 仅在 git 不可用时的兜底遍历中使用
IGNORED_DIRS = {".git", ".loopx", ".codex", "node_modules"}


def iter_files(root: str):
    """产出本仓库管辖的文件（git 跟踪 + 未忽略的未跟踪文件）。

    刻意用 git 界定范围，而不是自己维护排除列表：
      - `.loopx/`、`.codex/` 等被 gitignore 的工具状态目录不在管辖内；
      - `*.lock` 这类锁文件用 0600 本来就更合理，不该被"修复"；
      - 手维护排除列表会随工具演进失效，git 的 ignore 规则是唯一事实源。

    git 不可用时退回全目录遍历（此时用 _is_ignored_dir 兜底）。
    """
    try:
        out = subprocess.run(
            ["git", "ls-files", "-z", "--cached", "--others", "--exclude-standard"],
            cwd=root, capture_output=True, check=True,
        ).stdout
        for raw in out.split(b"\0"):
            if not raw:
                continue
            p = os.path.join(root, raw.decode("utf-8", "surrogateescape"))
            if os.path.isfile(p) and not os.path.islink(p):
                yield p
        return
    except (OSError, subprocess.CalledProcessError):
        pass

    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in IGNORED_DIRS]
        for name in filenames:
            p = os.path.join(dirpath, name)
            if os.path.islink(p):
                continue
            yield p


def scan(root: str):
    """返回 [(path, current_mode, want_mode)]，只含权限异常的文件。

    判定规则刻意保守——本脚本的职责是*修复损坏*，不是*统一风格*：
      - 已带可执行位的文件 → 0755（保住可执行性）
      - 其余文件 → 0644

    因此一个原本就是 0644、但恰好带 shebang 的脚本不会被"升级"成 0755。
    那是仓库风格问题，不属于本脚本范围；擅自改动会制造与修复无关的 diff。
    """
    bad = []
    for path in iter_files(root):
        try:
            st = os.stat(path)
        except OSError:
            continue
        cur = stat.S_IMODE(st.st_mode)
        want = OK_EXEC if (cur & 0o111) else OK_PLAIN
        if cur != want:
            bad.append((path, cur, want))
    return bad


def main() -> int:
    check_only = "--check" in sys.argv
    quiet = "--quiet" in sys.argv

    bad = scan(REPO_ROOT)
    rel = lambda p: os.path.relpath(p, REPO_ROOT)

    if not bad:
        if not quiet:
            print("OK: 全部文件权限为 0644/0755")
        return 0

    print(f"发现 {len(bad)} 个权限异常文件：")
    for path, cur, want in bad:
        print(f"  {cur:04o} → {want:04o}  {rel(path)}")

    if check_only:
        print("\nFAIL: 存在权限异常文件（--check 模式不修复）")
        return 1

    print("\n修复中...")
    fixed = 0
    for path, _cur, want in bad:
        try:
            os.chmod(path, want)
            fixed += 1
        except OSError as exc:
            print(f"  修复失败 {rel(path)}: {exc}", file=sys.stderr)

    print(f"已修复 {fixed} 个文件")

    leftover = scan(REPO_ROOT)
    if leftover:
        print(f"复查失败：仍有 {len(leftover)} 个异常", file=sys.stderr)
        return 1
    print("复查通过：无残留异常权限")
    return 0


if __name__ == "__main__":
    sys.exit(main())
