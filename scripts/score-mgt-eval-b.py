#!/usr/bin/env python3
"""MGT-EVAL-B 判分：比较两次隔离运行的确定性决策项。

判分口径来自语料 frozen_rules（事前冻结，执行者不得事后调整）：
  - deterministic_subset_agreement_min      = 0.95
  - decision_ladder_agreement_exact        = 1.00
  - l2b_identification_agreement_exact     = 1.00
  - contamination_fatal_count_max          = 0

**本判分的已知局限（必须随结果一起汇报）**

输出契约字段与语料 expected_deterministic_output 的键并非一一对应：
  - expected.ladder_classification → ladder        （可精确比对）
  - expected.decision（枚举型）     → decision      （可精确比对）
  - expected.must_detect           → detected      （自由标签，只能语义比对）
  - expected.forbidden             → refused       （自由标签，只能语义比对）
  - expected.queue_actions / availability / enforcement / downshift_decision
                                   → 无结构化对应字段，只落在 decision 自由文本里

因此本脚本把「确定性子集」保守地限定为**可精确字符串比对的字段**
（ladder、escalate_to、枚举型 decision）。这会让分母小于语料声称的
确定性决策项总数——宁可少算，不可把语义判断冒充客观判分。
自由标签与结构化处置的差异另作描述性输出，不计入一致率。

用法：
  python3 scripts/score-mgt-eval-b.py <run-a.json> <run-b.json>
两个输入各形如：
  {"run_label": "A", "outputs": {"MGT-001": [ {...}, ... ], "MGT-002": [...], "MGT-003": [...]}}
"""
from __future__ import annotations

import json
import os
import re
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CORPUS = os.path.join(
    REPO_ROOT, "docs/04-organization/management/eval/management-eval-corpus.v2.json"
)

LADDER_VOCAB = ["L0", "L1-G", "L1-V", "L2", "L2b", "L3", "L4", "NA"]


def _sort_keys_deep(o):
    if isinstance(o, bool):
        return o
    if isinstance(o, dict):
        return {k: _sort_keys_deep(o[k]) for k in sorted(o)}
    if isinstance(o, list):
        return [_sort_keys_deep(v) for v in o]
    if isinstance(o, float):
        return int(o) if o.is_integer() else o
    return o


def normalize_ladder(raw):
    """把语料里带说明文字或复合的阶梯值归一化到词表。

    返回 (值, 是否复合)。语料存在 "L3→L4 呈报（…）" 这类复合期望，
    而输出契约强制单值——这是**契约与语料的错配**，责任在判分侧：
    复合期望不应被当成单值比对，故单列 composite 标记。
    """
    if raw is None:
        return None, False
    if isinstance(raw, (list, tuple)):
        return None, True
    s = str(raw).strip()
    m = re.findall(r"L(?:0|1-G|1-V|2b|2|3|4)", s)
    if not m:
        return None, False
    # 去重保序
    seen, uniq = set(), []
    for x in m:
        if x not in seen:
            seen.add(x)
            uniq.append(x)
    return uniq[0], len(uniq) > 1


def flatten_outputs(payload):
    """把 {role: [entries]} 摊平成 {case_id: entry}。"""
    flat = {}
    for _role, entries in (payload.get("outputs") or {}).items():
        for e in entries or []:
            cid = e.get("case_id")
            if cid:
                flat[cid] = e
    return flat


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2

    with open(CORPUS, encoding="utf-8") as fh:
        corpus = json.load(fh)
    lb = [c for c in corpus["cases"] if c.get("layer") == "L-B"]

    run_a = flatten_outputs(json.load(open(sys.argv[1], encoding="utf-8")))
    run_b = flatten_outputs(json.load(open(sys.argv[2], encoding="utf-8")))

    print("=" * 78)
    print("MGT-EVAL-B 判分报告 · L-B 决策一致性")
    print("=" * 78)
    print(f"语料 corpus_sha256 : {corpus.get('corpus_sha256')}")
    print(f"判定口径           : deterministic≥{corpus['frozen_rules']['thresholds']['deterministic_subset_agreement_min']}"
          f"  ladder={corpus['frozen_rules']['thresholds']['decision_ladder_agreement_exact']}"
          f"  l2b={corpus['frozen_rules']['thresholds']['l2b_identification_agreement_exact']}")
    print()

    detail, missing = [], []
    for c in lb:
        cid = c["case_id"]
        a, b = run_a.get(cid), run_b.get(cid)
        if a is None or b is None:
            missing.append((cid, a is None, b is None))
            continue
        row = {
            "case_id": cid,
            "role": c["role_id"],
            "ladder_subset": bool(c.get("ladder_subset")),
            "l2b_case": bool(c.get("l2b_case")),
            "det_subset": bool(c.get("in_deterministic_subset")),
        }
        exp = c.get("expected_deterministic_output", {})

        # --- 阶梯归属（仅 ladder_subset 用例进入指标） ---
        if row["ladder_subset"]:
            ea, comp = normalize_ladder(exp.get("ladder_classification"))
            row.update(
                ladder_a=a.get("ladder"), ladder_b=b.get("ladder"),
                ladder_exp=ea, ladder_exp_composite=comp,
                ladder_agree=(a.get("ladder") == b.get("ladder")),
                ladder_a_matches_exp=(a.get("ladder") == ea) if not comp else None,
                ladder_b_matches_exp=(b.get("ladder") == ea) if not comp else None,
            )

        # --- L2b 识别（仅 l2b_case 用例进入指标） ---
        if row["l2b_case"]:
            row.update(
                l2b_a=(a.get("ladder") == "L2b"),
                l2b_b=(b.get("ladder") == "L2b"),
                l2b_agree=(a.get("ladder") == "L2b" and b.get("ladder") == "L2b"),
            )

        # --- escalate_to（精确比对） ---
        row.update(
            esc_a=a.get("escalate_to"), esc_b=b.get("escalate_to"),
            esc_agree=(a.get("escalate_to") == b.get("escalate_to")),
        )

        # --- 枚举型 decision（仅当期望是短枚举，非自由文本） ---
        exp_dec = exp.get("decision")
        if isinstance(exp_dec, str) and len(exp_dec) <= 16:
            row.update(
                dec_enum_exp=exp_dec,
                dec_a=a.get("decision"), dec_b=b.get("decision"),
                dec_enum_agree=(a.get("decision") == b.get("decision")),
            )

        # --- 描述性：自由标签差异（不计分） ---
        for f in ("detected", "refused"):
            sa, sb = set(a.get(f) or []), set(b.get(f) or [])
            row[f"only_a_{f}"] = sorted(sa - sb)
            row[f"only_b_{f}"] = sorted(sb - sa)

        detail.append(row)

    # ---------- 指标 ----------
    lad = [r for r in detail if r.get("ladder_subset")]
    lad_ok = [r for r in lad if r.get("ladder_agree")]
    l2b = [r for r in detail if r.get("l2b_case")]
    l2b_ok = [r for r in l2b if r.get("l2b_agree")]
    enum_rows = [r for r in detail if "dec_enum_agree" in r]
    enum_ok = [r for r in enum_rows if r.get("dec_enum_agree")]
    esc_rows = [r for r in detail if "esc_agree" in r]
    esc_ok = [r for r in esc_rows if r.get("esc_agree")]

    print("【逐用例比对】")
    for r in detail:
        flags = []
        if r.get("ladder_subset"):
            flags.append(f"ladder {r['ladder_a']} / {r['ladder_b']} "
                         f"{'✓' if r['ladder_agree'] else '✗ 不一致'}"
                         f"（期望 {r['ladder_exp']}{' 复合' if r.get('ladder_exp_composite') else ''}）")
        if r.get("l2b_case"):
            flags.append(f"L2b {'✓' if r['l2b_agree'] else '✗'}")
        flags.append(f"esc {r['esc_a']}/{r['esc_b']} {'✓' if r['esc_agree'] else '✗'}")
        if "dec_enum_agree" in r:
            flags.append(f"decision枚举 {'✓' if r['dec_enum_agree'] else '✗'}")
        print(f"  {r['case_id']}  " + " | ".join(flags))

    if missing:
        print("\n【缺失输出】")
        for cid, ma, mb in missing:
            who = []
            if ma: who.append("runA")
            if mb: who.append("runB")
            print(f"  {cid}: 缺 {'+'.join(who)}")

    print()
    print("【门禁指标】")
    lad_rate = (len(lad_ok) / len(lad)) if lad else float("nan")
    l2b_rate = (len(l2b_ok) / len(l2b)) if l2b else float("nan")

    thr = corpus["frozen_rules"]["thresholds"]
    def verdict(val, need):
        if val != val:  # nan
            return "无法判定（无样本）"
        return "PASS" if val >= need else "FAIL"

    print(f"  阶梯归属一致率      : {len(lad_ok)}/{len(lad)} = {lad_rate:.1%}   "
          f"阈值 100%  → {verdict(lad_rate, thr['decision_ladder_agreement_exact'])}")
    print(f"  L2b 识别一致率      : {len(l2b_ok)}/{len(l2b)} = {l2b_rate:.1%}   "
          f"阈值 100%  → {verdict(l2b_rate, thr['l2b_identification_agreement_exact'])}")

    print(f"  确定性子集一致率    : 不可独立判定（判分能力不足，非通过）")
    print(f"    只有 ladder 与语料期望形态兼容（同为单值枚举），可精确比对，"
          f"其结果即上面的 {lad_rate:.1%}。")
    print(f"    其余确定性决策项无法客观判分：")
    print(f"      · decision：契约要求自由文本（≤50字），语料期望为枚举"
          f"（如「冻结发布」「HOLD」）——形态不兼容；")
    print(f"      · must_detect / forbidden：自由标签，只能语义比对，无法排除同义表述差异；")
    print(f"      · queue_actions / availability / enforcement / downshift_decision：")
    print(f"        语料为逐条目结构化字典，契约无对应字段，只落在 decision 自由文本中。")
    print(f"    因此本项不给出 PASS/FAIL；把阶梯一致率当成本项结论是错的。")
    print()
    print(f"  【辅助指标·不计入门禁】")
    print(f"    escalate_to 一致率 : {len(esc_ok)}/{len(esc_rows)}"
          f"（该字段为输出契约自有，语料未声明为确定性决策项，故仅作稳定性的旁证）")
    if enum_rows:
        print(f"    decision 枚举形态  : {len(enum_ok)}/{len(enum_rows)}"
              f"（期望为枚举但契约要求自由文本，此差异源于契约缺陷，不作执行者失误计）")
    over_a = sum(len(r.get('only_a_detected') or []) + len(r.get('only_b_detected') or []) for r in detail)
    over_b = sum(len(r.get('only_a_refused') or []) + len(r.get('only_b_refused') or []) for r in detail)
    print(f"    detected/refused 标签差异条数：{over_a + over_b}"
          f"（自由标签，仅描述，不判分）")

    # 门禁：只有形态兼容、口径明确的两项可作判定依据
    overall = (lad_rate >= thr["decision_ladder_agreement_exact"]) and \
              (l2b_rate >= thr["l2b_identification_agreement_exact"])
    print()
    print(f"【总判定】{'PASS' if overall else 'FAIL'} "
          f"（可客观判定的门禁项：阶梯归属=100% 且 L2b 识别=100%）")
    if overall:
        print("  注意：PASS 只说明这两项稳定。确定性子集≥95% 因判分能力不足未获独立评估，")
        print("        不得据此宣称该门禁整体通过。")

    if not overall:
        print()
        print("【不通过时的合规处置】语料 frozen_rules.on_consistency_failure 规定：")
        print("  不得通过降低阈值、挑选样本或增加重试次数来通过；")
        print("  唯一合规处置是把该决策项下沉为确定性规则（Policy Gate/MDC 字段）或上收为人类决策。")
        bad = [r["case_id"] for r in lad if not r.get("ladder_agree")]
        if bad:
            print(f"  需下沉/上收的不稳定阶梯项：{', '.join(bad)}")
        bad_esc = [r["case_id"] for r in esc_rows if not r.get("esc_agree")]
        if bad_esc:
            print(f"  决定权归属不一致项：{', '.join(bad_esc)}")

    return 0 if overall else 1


if __name__ == "__main__":
    sys.exit(main())
