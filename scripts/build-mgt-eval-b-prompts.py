#!/usr/bin/env python3
"""生成 MGT-EVAL-B 的执行输入 prompt 文件。

为什么把 prompt 固化成文件，而不是直接把文本传给 subagent：
  语料 frozen_rules.repeat_protocol 要求两次运行共享同一份输入
  （isolation: 独立会话、不共享上下文、不接受对方中间结论）。
  手工复制长 prompt 无法保证逐字一致——本轮实测已出现过标点差异。
  一旦两次输入不同，产出的差异就无法归因到模型随机性。
  因此：把 prompt 写进文件，两次运行只接收「读取并严格执行该文件」，
  并记录文件 SHA-256，使「输入相同」成为可核验事实而非承诺。

用法：
  python3 scripts/build-mgt-eval-b-prompts.py [输出目录]

默认输出到 docs/04-organization/management/eval/runs/<YYYY-MM-DD>-MGT-EVAL-B/
"""
from __future__ import annotations

import hashlib
import json
import os
import sys
from collections import defaultdict
from datetime import date

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CORPUS = os.path.join(
    REPO_ROOT, "docs/04-organization/management/eval/management-eval-corpus.v2.json"
)


def _sort_keys_deep(o):
    """递归键排序 + 整数归一化。

    整数归一化不是洁癖：JS 的 JSON.stringify 把 1.0 序列化成 "1"，
    而 Python json.dumps 输出 "1.0"。语料 corpus_sha256_scope 明确要求
    「整数值不得以浮点序列化」，不归一化就会让两套实现算出不同 Hash。
    """
    if isinstance(o, bool):  # bool 是 int 子类，必须先判断
        return o
    if isinstance(o, dict):
        return {k: _sort_keys_deep(o[k]) for k in sorted(o)}
    if isinstance(o, list):
        return [_sort_keys_deep(v) for v in o]
    if isinstance(o, float):
        return int(o) if o.is_integer() else o
    return o


def canonical_corpus_sha256(corpus: dict) -> str:
    """按语料 corpus_sha256_scope 声明的范围与规则复算 Hash。

    范围是 {frozen_rules, cases} 的规范化 JSON——**不是整个文件**。
    用整文件哈希比对自报值必然失败，那是校验者自己的假设错误。
    """
    canonical = json.dumps(
        _sort_keys_deep({"frozen_rules": corpus["frozen_rules"], "cases": corpus["cases"]}),
        ensure_ascii=False,
        separators=(",", ":"),
    )
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()

# 中性输出契约：字段对所有岗位、所有用例一致。
# 刻意不使用语料 expected_deterministic_output 的键名——那些键名本身泄露答案方向
# （例如 not_L1V_reason、wrong_queue_type、l2b_case），照搬就等于把答案提示给执行者。
OUTPUT_CONTRACT = """## 第三步：按以下契约输出

对每条事项输出一个 JSON 对象，字段如下：

- `case_id`：原样回填事项的 case_id
- `ladder`：该事项在决策阶梯上的归属层级。取**单值**，必须是以下之一：
  `L0` / `L1-G` / `L1-V` / `L2` / `L2b` / `L3` / `L4` / `NA`
  （`NA` 表示该事项不属于阶梯管辖的决策）
- `decision`：你的最终处置。一句话，不超过 50 字，须写明动作
  （批准／拒绝／呈报／退回／HOLD／接受并观察 等）
- `detected`：字符串数组。你在输入中识别出的问题或风险，用简短标签
  （如「证据不足」「缺基线定义」）。无则 []
- `refused`：字符串数组。你明确拒绝执行的动作，用简短标签。无则 []
- `escalate_to`：该事项最终决定权的归属。自决填 `self`；上级管理岗位填其 id
  （如 `MGT-002`）；属真人所有者填 `human_owner`

## 输出格式（严格）

只输出一个 JSON 数组，含 {n} 个对象。不要 markdown 代码围栏、不要解释、不要任何前后缀文字。

## 纪律

- `ladder` 必须是单值，不得写「L2或L3」这类复合值
- 独立完成，不要参考任何其它岗位的答案、历史结论或会话
"""

PROMPT_TEMPLATE = """# MGT-EVAL-B 执行输入 · L-B 决策一致性

你是一个独立运行的管理判断会话。请扮演跨境电商企业的 AI 管理岗位 **{role}**，
对下面 {n} 条待决事项逐条做出决策。

## 第一步：加载你的岗位身份（必须完整阅读）

在当前工作区仓库根目录（即本文件所在仓库）读取以下文件：

- `docs/04-organization/management/souls/{role}.soul.md`
- `docs/04-organization/management/roles/{role}.md`
- `docs/04-organization/management/playbooks/{role}.md`
- `docs/04-organization/management/DECISION-RIGHTS.md`

这些文件定义你的职责、决策权限、决策阶梯与禁止行为。
严格依据它们判断，不要引入外部假设。

## 隔离要求（硬边界，违反将使本次运行作废）

本次运行**只允许读取**上面列出的 4 份文件。具体地：

- **禁止**读取 `docs/04-organization/management/eval/` 目录下的任何内容；
- **禁止**读取其它管理岗位（MGT-001／MGT-002／MGT-003）除 `DECISION-RIGHTS.md`
  以外的角色资产；
- **禁止**为了寻找参考而浏览、列举或检索工作区中的其它文件。

理由：本次运行测量的是「仅凭岗位资产能否稳定复现同一判断」。
任何来自上述范围之外的信息都会污染这次测量，使结果不可解释。

如果你已经接触过禁止范围内的内容，必须在输出中声明，且不得使用其中的信息。

## 第二步：对待决事项逐条决策

以下 JSON 数组是本轮全部待决事项，`item` 字段是该事项的完整输入：

```json
{cases_json}
```
"""


def main() -> int:
    run_dir = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
        REPO_ROOT,
        "docs/04-organization/management/eval/runs",
        f"{date.today().isoformat()}-MGT-EVAL-B",
    )
    os.makedirs(run_dir, exist_ok=True)

    with open(CORPUS, encoding="utf-8") as fh:
        corpus = json.load(fh)
    corpus_sha = canonical_corpus_sha256(corpus)

    declared = corpus.get("corpus_sha256")
    if declared != corpus_sha:
        print(
            f"FAIL: 语料自报 corpus_sha256={declared} 与按 corpus_sha256_scope 复算的 {corpus_sha} 不一致；"
            "拒绝基于未核验语料生成执行输入",
            file=sys.stderr,
        )
        return 1

    lb = [c for c in corpus["cases"] if c.get("layer") == "L-B"]
    by_role: dict[str, list] = defaultdict(list)
    for c in lb:
        by_role[c["role_id"]].append(c)

    manifest = {
        "artifact_kind": "mgt_eval_b_run_inputs",
        "generated_on": date.today().isoformat(),
        "corpus_file": os.path.relpath(CORPUS, REPO_ROOT),
        "corpus_sha256": corpus_sha,
        "repeat_protocol": corpus["frozen_rules"]["repeat_protocol"],
        "prompts": {},
    }

    for role in sorted(by_role):
        cases = by_role[role]
        payload = [
            {"case_id": c["case_id"], "scenario_ref": c.get("scenario_ref"), "item": c["input"]}
            for c in cases
        ]
        body = PROMPT_TEMPLATE.format(
            role=role,
            n=len(cases),
            cases_json=json.dumps(payload, ensure_ascii=False, indent=2),
        ) + OUTPUT_CONTRACT.format(n=len(cases))

        fname = f"prompt-{role}.md"
        fpath = os.path.join(run_dir, fname)
        with open(fpath, "w", encoding="utf-8") as fh:
            fh.write(body)

        manifest["prompts"][role] = {
            "file": fname,
            "case_count": len(cases),
            "case_ids": [c["case_id"] for c in cases],
            "sha256": hashlib.sha256(body.encode("utf-8")).hexdigest(),
        }
        print(f"生成 {os.path.relpath(fpath, REPO_ROOT)}  ({len(cases)} 条, sha256={manifest['prompts'][role]['sha256'][:16]}…)")

    mpath = os.path.join(run_dir, "inputs-manifest.json")
    with open(mpath, "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    print(f"生成 {os.path.relpath(mpath, REPO_ROOT)}")
    print(f"语料 corpus_sha256={corpus_sha}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
