#!/usr/bin/env python3
"""intake-g1-returns.py — G1 企业数据回传接收管线（机械化校验与分流）。

对应 SEND-AND-RETURN-SOP.md §4 的第 3、4 步：
  - 4.3 PII 核查：本脚本做正则级扫描，命中只输出「文件+行号+类型」，
    绝不把命中内容写进报告（报告可能被引用，原文留在 returns/ 本地）。
  - 4.4 分流回填：本脚本做文件分类识别 + 字段级覆盖度统计，
    产出回填工作清单；实际回填动作按 BACKFILL-MAP.md 执行。

设计取舍（为什么这样做）：
  - returns/ 已 gitignore，回传件与本报告永不入库。zip 一律自动解压到
    returns/extracted/<时间戳>/——解压仍在 gitignore 内、可追踪；
    提示人工解压反而容易把文件落到桌面等 git 管辖外目录，失控更大。
    extracted/ 内的嵌套 zip 不递归，列入人工分流。
  - 权威清单不写死：G1P-02 核实项 / G1P-03 规则块在运行时解析包内
    表单文件本身，表单修订后脚本自动跟随，不会出现两份清单漂移。
  - 校验一律 best-effort：企业可能回 markdown 表格、CSV、Excel 导出文本
    或任意格式。结构化解析优先，解析不出就降级为「字段关键词+行」匹配；
    仍无法确认的文件进「需人工分流」，脚本不报错退出。
  - 「已覆盖」只给结构化证据（表单回填列非空 / 规则字段实质改动 /
    行首 ID+分隔符的结构化行）；关键词命中、ID 提及、证据包行号引用
    最多给「部分覆盖」——宁可让人复核，不把顺带提及当成已答。
  - 空白模板回传不能产生覆盖信号：表单类文件走单元格级 diff；
    其余文件的关键词/ID 扫描先剔除与包内模板逐行相同的行
    （模板行中性化），再做「模板单元格内容」级剔除。

用法：
  python3 scripts/intake-g1-returns.py                      # 扫描 returns/ 并生成报告
  python3 scripts/intake-g1-returns.py --self-test          # 用 export/ 空白模板自检
  python3 scripts/intake-g1-returns.py --returns-dir <path> # 指定扫描目录（调试用）
"""
from __future__ import annotations

import hashlib
import os
import re
import sys
import zipfile
from collections import Counter
from dataclasses import dataclass, field
from datetime import datetime
from xml.etree import ElementTree as ET

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PACK_DIR = os.path.join(REPO_ROOT, "docs", "08-data", "G1-ENTERPRISE-PACK")
DEFAULT_RETURNS = os.path.join(PACK_DIR, "returns")
EXPORT_DIR = os.path.join(PACK_DIR, "export")

G1P02_FILE = "G1P-02-AVAILABILITY-FORM.md"
G1P03_FILE = "G1P-03-RULESET-FORM.md"
G1P05_FILE = "G1P-05-EVIDENCE-TEMPLATE.md"

MAX_TEXT_BYTES = 20 * 1024 * 1024   # 超过则不做文本解析，进人工分流
KEYWORD_SCAN_MAX = 2 * 1024 * 1024  # 关键词兜底只扫小文件，大文件靠结构化/PII
REPORT_PREFIX = "INTAKE-REPORT-"

# ---------------------------------------------------------------------------
# 覆盖度状态
# ---------------------------------------------------------------------------
COVERED, PARTIAL, MISSING = "covered", "partial", "missing"
STATUS_ZH = {COVERED: "已覆盖", PARTIAL: "部分覆盖", MISSING: "缺失"}
STATUS_RANK = {MISSING: 0, PARTIAL: 1, COVERED: 2}

CLS_G1P02, CLS_G1P03, CLS_G1P05 = "G1P-02 可得性表", "G1P-03 规则集", "G1P-05 证据包"
CLS_DATA, CLS_PACK, CLS_UNKNOWN, CLS_BINARY = "数据样例", "包内文件回传", "未知", "二进制需人工"
CLS_ZIP = "压缩包（已自动解压）"

# 包内说明文件的规范文件名：这些文件本身不是有效回传物，
# 被回传只是「包被原样退回」，必须归入 PACK 而不是表单类。
# 注意不含 G1P-02/03/05——它们的文件名本身就是表单身份。
KNOWN_PACK_NAMES = {
    "readme.md", "g1p-01-brief.md", "g1p-04-export-guide.md",
    "send-and-return-sop.md", "backfill-map.md",
}

# ---------------------------------------------------------------------------
# 权威清单：运行时解析包内表单（表单是唯一事实源，脚本不内嵌条目列表）
# ---------------------------------------------------------------------------


@dataclass
class CheckItem:
    """G1P-02 的一个核实项。"""

    iid: str        # "0-1" / "A1-3" / "B5-2"
    part: str       # "Part0" / "PartA" / "PartB"
    group: str      # 所属小节（如 "A1 Shopify DTC"）
    name: str       # 核实项 / 数据项原文
    tpl_cells: set = field(default_factory=set)   # 模板行中除 ID 外的单元格（剔除模板残留用）
    keywords: set = field(default_factory=set)


@dataclass
class RuleSpec:
    """G1P-03 的一个规则块及其字段模板。"""

    rid: str                     # "R1".."R10"
    title: str
    fields: list = field(default_factory=list)  # [(字段提示, 模板尾部原文)]
    keywords: set = field(default_factory=set)


ID_CELL_RE = re.compile(r"^\s*(0-\d{1,2}|A\d-\d{1,2}|B\d-\d{1,2})\s*$")
ID_INLINE_RE = re.compile(r"(?<![0-9A-Za-z])((?:0|A\d|B\d)-\d{1,2})(?![0-9])")
ID_ANY_RE = re.compile(r"^(?:0|A\d|B\d)-\d{1,2}$|^R\d{1,2}$")


def split_md_row(line: str) -> list:
    s = line.strip()
    if s.startswith("|"):
        s = s[1:]
    if s.endswith("|"):
        s = s[:-1]
    return [c.strip() for c in s.split("|")]


def is_sep_row(cells: list) -> bool:
    return bool(cells) and all(re.fullmatch(r"[-:\s]*", c) for c in cells)


def iter_md_tables(text: str):
    """产出 (tables, consumed)。

    tables 元素 = (section, header_cells, [(lineno, cells), ...], table_linenos)
    consumed = 所有表格占用的行号集合（供 ID 行扫描排除，防止空模板行误报）。
    """
    tables = []
    consumed = set()
    section = ""
    header = None
    header_lineno = 0
    rows = []
    table_lines = set()
    table_section = ""

    def flush():
        nonlocal header, rows, table_lines
        if header is not None:
            tables.append((table_section, header, rows, table_lines))
            consumed.update(table_lines)  # update 不 rebinding，闭包可读
        header, rows, table_lines = None, [], set()

    lines = text.splitlines()
    for idx, raw in enumerate(lines, 1):
        s = raw.strip()
        hm = re.match(r"^#{1,6}\s+(.*)", s)
        if hm:
            flush()
            section = hm.group(1).strip()
            continue
        if s.startswith("|"):
            cells = split_md_row(s)
            if is_sep_row(cells):
                if header is not None:
                    table_lines.add(idx)
                continue
            if header is None:
                header, header_lineno, table_section = cells, idx, section
                table_lines.add(idx)
            else:
                rows.append((idx, cells))
                table_lines.add(idx)
        else:
            flush()
    flush()
    return tables, consumed


def norm_cell(s: str) -> str:
    return " ".join(str(s).split())


# ---------------------------------------------------------------------------
# 关键词推导：自动词 + 手工别名。关键词命中最多给「部分覆盖」，
# 所以宁可多给别名让人工复核，也不漏掉真实作答。
# ---------------------------------------------------------------------------

STOP_ASCII = {
    "the", "and", "for", "with", "data", "report", "reports", "sample",
    "example", "v1", "http", "https", "www", "com", "src", "id", "no",
    "vs", "by", "per", "all", "each", "from", "into", "over", "after",
    "before", "between", "within", "without", "about", "this", "that",
    "these", "those", "are", "was", "were", "has", "have", "had", "not",
    "yes", "via", "etc", "new", "day", "week", "month", "daily", "weekly",
    "monthly", "detail", "details", "page", "performance", "behavior",
}

GENERIC_CN = re.compile(
    r"(可导出性|可得性|可得|确认|说明|样例|读数|盘点|清单|方式|建议|记录|数据|"
    r"要求|情况|是否|有无|获取|对应|实际|当前|各平台|的)+$"
)
GENERIC_TAIL = re.compile(r"(报表|数据|清单|台账|矩阵|快照|记录|明细|情况|信息|原文|标记|状态)$")


def derive_keywords(name: str) -> set:
    """从条目名自动推关键词：ASCII 术语 + 中文核心短语。"""
    kws = set()
    for tok in re.findall(r"[A-Za-z][A-Za-z0-9_+\-]{2,}", name):
        if tok.lower() not in STOP_ASCII and len(tok) >= 3:
            kws.add(tok)
    core = re.split(r"[（(，,、；;—\-—|/]", name)[0].strip().strip("*# ")
    core = re.sub(r"\s+", "", core)
    core = GENERIC_CN.sub("", core).strip(" 、·")
    if len(core) >= 3:
        kws.add(core)
        shorter = GENERIC_TAIL.sub("", core)
        if len(shorter) >= 3 and shorter != core:
            kws.add(shorter)
    return {k for k in kws if k}


# 手工别名：覆盖自动推导抓不到的同义/简称。键为条目 ID。
ALIASES = {
    "0-1": ["卖家账号", "seller central", "卖家中心", "账号数量", "账号别名", "卖家账号数"],
    "0-2": ["shopify 店", "独立站", "其他店铺", "shopify店铺", "dtc 店铺"],
    "0-3": ["instagram", "tiktok", "youtube", "facebook", "linkedin", "社媒账号", "官方账号", "同名多号"],
    "0-4": ["广告账户", "amazon ads", "tiktok ads", "google ads", "meta ads", "广告投放账户"],
    "0-5": ["财务系统", "erp", "结算对账", "银行到账", "税务申报", "财务 erp"],
    "0-6": ["wms", "3pl", "货代", "仓储物流", "发货仓", "物流系统"],
    "0-7": ["客服系统", "工单系统", "买家消息", "退换货工单", "客服工单"],
    "0-8": ["klaviyo", "crm", "邮件工具", "客户分层工具", "shopify email", "营销工具"],
    "0-9": ["达人管理", "pr 管理", "寄样台账", "佣金台账", "达人建联", "达人 pr"],
    "0-10": ["合规证照", "产品证书", "fda", "cpc", "ce 认证", "证照管理", "合规登记"],
    "0-11": ["keepa", "卖家精灵", "jungle scout", "数字酋长", "竞品监控", "竞品工具"],
    "A1-1": ["流量来源", "sessions by referrer", "referrer", "landing page", "流量报表", "来源报表"],
    "A1-2": ["商品表现", "add_to_cart", "加购", "商品报表", "sales by product", "商品分析"],
    "A1-3": ["新老客户", "new vs returning", "repeat_rate", "复购率", "客户聚合", "新客老客"],
    "A1-4": ["同意率", "营销同意", "名单规模", "customer 名单", "订阅人数", "gdpr 同意"],
    "A1-5": ["站内搜索", "search terms", "搜索词报表", "online store search", "站内搜索词"],
    "A1-6": ["邮件互动", "sends", "open rate", "click rate", "邮件报表", "邮件营销报表"],
    "A1-7": ["payouts", "财务报表", "gross", "net", "退款", "finance 报表", "付款结算"],
    "A1-8": ["api 只读", "read_reports", "api 接入", "接口评估", "shopify api"],
    "A2-1": ["detail page", "sales and traffic", "业务报表", "business reports", "流量销售报表"],
    "A2-2": ["search query", "搜索词表现", "查询词表现", "search query performance"],
    "A2-3": ["market basket", "连带购买", "购物篮分析", "共同购买"],
    "A2-4": ["repeat purchase", "复购行为", "重复购买", "repeat purchase behavior"],
    "A2-5": ["bsr", "类目排名", "best seller", "排名获取", "bsr 排名"],
    "A2-6": ["fba", "fbm", "库存可见性", "仓库存", "fba fbm"],
    "A2-7": ["多账号", "账号差异", "卖家账号差异", "多账号报表"],
    "A3-1": ["账号清单", "社媒账号清单", "官方账号清单", "同名多号", "账号唯一清单"],
    "A3-2": ["平台分析", "native analytics", "insights", "分析后台", "followers", "reach", "engagement 导出"],
    "A3-3": ["帖子表现", "帖子级", "engagement", "link clicks", "帖子数据", "内容表现"],
    "A3-4": ["监听工具", "声量", "mention", "sov", "社媒监控", "舆情监控", "mention volume"],
    "A3-5": ["触达合规", "私信政策", "平台政策", "内容规范", "合规边界", "触达边界"],
    "A4-1": ["产品线系统", "dme", "保险渠道", "aeroflow", "edgepark", "产品线导出"],
    "A4-2": ["产品线报表", "聚合报表", "订单聚合", "dme 报表", "销量收入聚合"],
    "A4-3": ["保险核销", "核销", "现金购买", "保险占比", "核销口径"],
    "A4-4": ["重叠率", "客户重叠", "对账标识", "客户重叠率"],
    "A4-5": ["名单规模", "同意状态", "dme 名单", "产品线名单"],
    "A5-1": ["字段覆盖", "工具覆盖", "keepa", "卖家精灵", "jungle scout", "数字酋长", "竞品工具覆盖"],
    "A5-2": ["eufy", "安克", "anker", "型号清单", "eufy 型号"],
    "A5-3": ["监控频率", "监控方式", "更新频率", "监控导出"],
    "A5-4": ["版本化", "责任人", "竞品清单维护", "竞品集版本"],
    "A5-5": ["指标冲突", "口径冲突", "处理习惯", "工具冲突"],
    "B1-1": ["settlement", "结算报表", "结算报告", "payout", "退款准备金", "结算 vs payout"],
    "B1-2": ["shopify payouts", "付款结算", "gross", "net", "shopify 财务"],
    "B1-3": ["勾稽", "订单结算", "reconciliation", "对账表", "订单结算勾稽"],
    "B1-4": ["退款", "退货", "return", "refund", "原因码", "退货退款"],
    "B1-5": ["汇率", "exchange rate", "折算", "到账汇率", "双口径"],
    "B1-6": ["银行到账", "到账记录", "银行流水", "银行对账"],
    "B1-7": ["销售税", "vat", "税务", "税率", "申报资料", "代扣代缴"],
    "B1-8": ["tiktok shop", "tiktok 结算", "tiktok settlement", "tiktok 报表"],
    "B2-1": ["amazon ads", "sp", "sb", "sd", "广告报表", "acos", "广告数据"],
    "B2-2": ["tiktok ads", "gmv max", "商品卡广告", "tiktok 广告"],
    "B2-3": ["google ads", "meta ads", "facebook ads", "google meta 广告"],
    "B2-4": ["促销成本", "coupon", "优惠券", "秒杀", "折扣台账", "活动折扣"],
    "B3-1": ["评价", "review", "voc", "评论", "星级", "vine", "verified purchase"],
    "B3-2": ["客服工单", "buyer-seller", "买家消息", "工单", "ticket", "客服记录"],
    "B3-3": ["退货原因", "return reason", "退货原因码", "退货明细"],
    "B3-4": ["dtc 评论", "q&a", "shopify 评论", "inbox", "dtc 客服", "评论应用"],
    "B3-5": ["社媒评论", "提及原文", "评论监控", "mention", "社媒提及"],
    "B4-1": ["合规证书", "证书台账", "fda", "cpc", "ce", "gcc", "证照台账", "资质证书"],
    "B4-2": ["合规矩阵", "准入资质", "标签要求", "认证要求", "市场合规"],
    "B4-3": ["listing 自查", "宣称", "证据映射", "合规自查", "listing 合规"],
    "B5-1": ["fba 库存", "库存快照", "可售库存", "在途库存", "fba inventory"],
    "B5-2": ["入库", "签收", "赔偿", "装运", "shipment", "fba 入库"],
    "B5-3": ["在途", "头程", "物流状态", "货代", "在途库存"],
    "B5-4": ["缺货", "改派", "索赔", "丢件", "履约异常", "订单异常"],
    "B5-5": ["dtc 仓", "wms", "3pl", "仓库存", "sku 库存", "dtc 库存"],
    "B6-1": ["账号健康", "odr", "vpf", "lsr", "政策违规", "申诉", "account health"],
    "B6-2": ["体验分", "违规记录", "tiktok 店铺", "店铺体验"],
    "B6-3": ["拒付", "chargeback", "应诉", "欺诈", "拒付记录"],
    "B6-4": ["shopify 风险", "chargeback rate", "欺诈标记", "shopify 欺诈"],
    "B7-1": ["达人档案", "达人合作", "佣金", "建联", "寄样", "达人管理"],
    "B7-2": ["寄样", "回执", "达人寄样", "样品发货"],
    "B7-3": ["客户分层", "rfm", "生命周期", "会员", "订阅", "客户分层数据", "分层人数"],
    "B7-4": ["复购", "流失", "生命周期事件", "复购流失"],
    "B8-1": ["商品资料", "listing 快照", "feed", "属性映射", "类目映射", "商品快照"],
    "B8-2": ["跨平台价格", "价格快照", "促销快照", "价格监控"],
    "B8-3": ["库存分配", "超卖", "跨平台库存", "库存分配"],
}

RULE_ALIASES = {
    "R1": ["预算变动", "广告预算", "预算幅度", "预算上限", "budget"],
    "R2": ["触达批量", "批量触达", "单批人数", "发送频次", "邮件频次", "触达上限"],
    "R3": ["价格底线", "最低毛利", "价格下限", "毛利率底线", "价格底线规则"],
    "R4": ["退款权限", "补偿上限", "退款金额", "补偿权限", "退款补偿"],
    "R5": ["拒付应诉", "应诉时限", "chargeback", "金额门槛", "拒付门槛"],
    "R6": ["寄样审批", "达人合作", "寄样上限", "合作审批", "达人寄样"],
    "R7": ["活动报名", "提报", "秒杀", "确认粒度", "优惠券活动", "平台活动"],
    "R8": ["无例外", "沉默即通过", "默认勾选", "包月授权", "例外清单", "逐次确认"],
    "R9": ["策略版本", "确认时限", "外发时限", "超时处理", "策略确认"],
    "R10": ["内容评分", "kano", "评分权重", "分级判定", "内容五标准"],
}

AVAIL_RE = re.compile(r"✅|⚠️|❌|❓|可导出|部分可得|不可得|待查|不适用")


def extract_avail(value: str):
    """从可得性单元格提取枚举提示。"""
    v = value or ""
    for emoji, label in (("✅", "可导出"), ("⚠️", "部分可得"), ("❌", "不可得"), ("❓", "待查")):
        if emoji in v:
            return label
    for word in ("不可得", "部分可得", "可导出", "待查", "不适用"):
        if word in v:
            return word
    return None


# ---------------------------------------------------------------------------
# 权威清单加载
# ---------------------------------------------------------------------------


def read_text(path: str) -> str:
    with open(path, "rb") as f:
        data = f.read(MAX_TEXT_BYTES + 1)
    truncated = len(data) > MAX_TEXT_BYTES
    data = data[:MAX_TEXT_BYTES]
    for enc in ("utf-8-sig", "gb18030"):
        try:
            text = data.decode(enc)
            return text + ("\n[TRUNCATED]" if truncated else "")
        except UnicodeDecodeError:
            continue
    return data.decode("utf-8", errors="replace") + ("\n[TRUNCATED]" if truncated else "")


def load_g1p02_items() -> list:
    path = os.path.join(PACK_DIR, G1P02_FILE)
    if not os.path.isfile(path):
        return []
    text = read_text(path)
    items = []
    tables, _ = iter_md_tables(text)
    for section, _header, rows, _lns in tables:
        for _ln, row in rows:
            if not row:
                continue
            m = ID_CELL_RE.match(row[0])
            if not m:
                continue
            iid = m.group(1)
            part = "Part0" if iid.startswith("0-") else ("PartA" if iid.startswith("A") else "PartB")
            name = row[1] if len(row) > 1 else ""
            it = CheckItem(iid=iid, part=part, group=section, name=name)
            it.tpl_cells = {norm_cell(c) for c in row[1:] if str(c).strip()}
            raw_kws = derive_keywords(name) | set(ALIASES.get(iid, []))
            # 条目 ID 不进关键词子串匹配（"0-1" 会误中 "10-12"），由 ID 行扫描负责
            it.keywords = {k for k in raw_kws if not ID_ANY_RE.match(k)}
            items.append(it)
    return items


def load_g1p03_rules() -> list:
    path = os.path.join(PACK_DIR, G1P03_FILE)
    if not os.path.isfile(path):
        return []
    text = read_text(path)
    rules = []
    cur = None
    for line in text.splitlines():
        s = line.strip()
        m = re.match(r"^#{1,6}\s*R(\d{1,2})\s*[·•\-—]?\s*(.*)", s)
        if m:
            cur = RuleSpec(rid="R" + m.group(1), title=m.group(2).strip())
            rules.append(cur)
            continue
        if re.match(r"^#{1,6}\s", s):
            cur = None  # 进入「提交说明」「评审记录」等非规则节
            continue
        if cur is None:
            continue
        bm = re.match(r"^\s*[-*]\s+(.+?)\s*[：:]\s*(.*)$", line)
        if bm:
            cur.fields.append((bm.group(1).strip(), bm.group(2).strip()))
    for r in rules:
        r.keywords = derive_keywords(r.title) | set(RULE_ALIASES.get(r.rid, [])) | {r.rid}
    return rules


# ---------------------------------------------------------------------------
# G1P-05 模板指纹：用于「与空白模板 diff」判断真实填写
# ---------------------------------------------------------------------------


@dataclass
class G1P05Template:
    submit: dict = field(default_factory=dict)     # 项名 -> 模板值
    six: dict = field(default_factory=dict)        # 要件号 -> 模板「是否完成」值
    meta: dict = field(default_factory=dict)       # 字段名 -> 模板值
    dict_rows: set = field(default_factory=set)    # 字段字典模板行（规范化）
    gap_rows: set = field(default_factory=set)     # 缺口清单模板行（规范化）


def norm_row_text(cells: list) -> str:
    return "‖".join(norm_cell(c) for c in cells)


def load_g1p05_template() -> G1P05Template:
    path = os.path.join(PACK_DIR, G1P05_FILE)
    tpl = G1P05Template()
    if not os.path.isfile(path):
        return tpl
    text = read_text(path)
    tables, _ = iter_md_tables(text)
    for section, header, rows, _lns in tables:
        h = [x.lower() for x in header]
        for _ln, c in rows:
            # 六要件核对表：| # | 要件 | 内容 | 是否完成 | 附件/位置 |
            if any("要件" in x for x in h) and any("完成" in x for x in h):
                done_i = next((i for i, x in enumerate(h) if "完成" in x), None)
                if c:
                    tpl.six[c[0].strip()] = c[done_i] if done_i is not None and done_i < len(c) else ""
            # 提交信息表（| 项 | 填写 |）
            elif any("填写" in x for x in h) and len(header) <= 3:
                if len(c) >= 2:
                    tpl.submit[c[0]] = c[1] if len(c) > 1 else ""
            # 快照元数据（| 字段 | 值 |）
            elif "字段" in h and "值" in h and len(header) <= 3:
                if len(c) >= 2:
                    tpl.meta[c[0]] = c[1]
            # 字段字典
            elif "字段名" in h and "类型" in h:
                tpl.dict_rows.add(norm_row_text(c))
            # 缺口清单（表头含 G1P-02）
            elif any("g1p-02" in x for x in h):
                tpl.gap_rows.add(norm_row_text(c))
    return tpl


# ---------------------------------------------------------------------------
# 模板行中性化：与包内模板逐行相同的行不产生任何覆盖信号
# ---------------------------------------------------------------------------

_TEMPLATE_LINES = None


def load_template_lines() -> set:
    """包内全部 .md 的规范化行集合。返回文件中命中即视为模板脚手架。"""
    global _TEMPLATE_LINES
    if _TEMPLATE_LINES is not None:
        return _TEMPLATE_LINES
    lines = set()
    if os.path.isdir(PACK_DIR):
        for fn in os.listdir(PACK_DIR):
            if fn.endswith(".md") and os.path.isfile(os.path.join(PACK_DIR, fn)):
                try:
                    for ln in read_text(os.path.join(PACK_DIR, fn)).splitlines():
                        n = re.sub(r"[\s*]+", "", ln).strip(">#-")
                        if len(n) >= 4:
                            lines.add(n)
                except OSError:
                    continue
    _TEMPLATE_LINES = lines
    return lines


def neutralized_lines(text: str):
    """返回 [(lineno, line)]，剔除与模板逐行相同的行。行号保持原文件编号。"""
    tpl = load_template_lines()
    out = []
    for ln, line in enumerate(text.splitlines(), 1):
        n = re.sub(r"[\s*]+", "", line).strip(">#-")
        if n in tpl:
            continue
        out.append((ln, line))
    return out


# ---------------------------------------------------------------------------
# 文本抽取：xlsx / docx 用 zipfile+ElementTree 做最小解析（标准库）
# ---------------------------------------------------------------------------

XLSX_NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
DOCX_NS = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


def extract_xlsx_text(path: str, max_lines: int = 200000) -> str:
    out = []
    with zipfile.ZipFile(path) as z:
        names = set(z.namelist())
        shared = []
        if "xl/sharedStrings.xml" in names:
            root = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in root.iter(f"{XLSX_NS}si"):
                shared.append("".join(t.text or "" for t in si.iter(f"{XLSX_NS}t")))
        sheets = sorted(n for n in names if re.fullmatch(r"xl/worksheets/sheet\d+\.xml", n))
        for sh in sheets:
            root = ET.fromstring(z.read(sh))
            for row in root.iter(f"{XLSX_NS}row"):
                vals = []
                for c in row.findall(f"{XLSX_NS}c"):
                    t = c.get("t", "")
                    v = c.find(f"{XLSX_NS}v")
                    is_el = c.find(f"{XLSX_NS}is")
                    if t == "s" and v is not None and v.text:
                        try:
                            vals.append(shared[int(v.text)])
                        except (ValueError, IndexError):
                            vals.append("")
                    elif t == "inlineStr" and is_el is not None:
                        vals.append("".join(x.text or "" for x in is_el.iter(f"{XLSX_NS}t")))
                    elif v is not None and v.text is not None:
                        vals.append(v.text)
                    else:
                        vals.append("")
                line = "\t".join(vals).rstrip("\t")
                if line.strip():
                    out.append(line)
                    if len(out) >= max_lines:
                        return "\n".join(out) + "\n[TRUNCATED]"
    return "\n".join(out)


def extract_docx_text(path: str) -> str:
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml")
    root = ET.fromstring(xml)
    paras = []
    for p in root.iter(f"{DOCX_NS}p"):
        txt = "".join(t.text or "" for t in p.iter(f"{DOCX_NS}t"))
        if txt.strip():
            paras.append(txt)
    return "\n".join(paras)


# ---------------------------------------------------------------------------
# 文件分类
# ---------------------------------------------------------------------------

TEXT_EXTS = {".md", ".txt", ".csv", ".tsv", ".json", ".xml", ".html", ".htm", ".log", ".yaml", ".yml"}
OFFICE_EXTS = {".xlsx": "xlsx", ".docx": "docx"}
DATA_EXTS = {".csv", ".tsv", ".xlsx", ".xls", ".json", ".xml", ".parquet", ".feather"}
BINARY_EXTS = {".pdf", ".xls", ".numbers", ".png", ".jpg", ".jpeg", ".gif", ".zip", ".7z", ".rar", ".pptx", ".key", ".doc"}


def count_g1p02_id_rows(text: str, items_by_id: dict) -> int:
    """统计「行首即条目 ID」的行数（CSV/TSV/markdown 通用）。"""
    n = 0
    for line in text.splitlines():
        s = line.strip().lstrip("|").strip()
        m = re.match(r"^((?:0|A\d|B\d)-\d{1,2})\s*[,，;；\t|]", s)
        if m and m.group(1) in items_by_id:
            n += 1
    return n


def classify_file(rel_path: str, text: str, ext: str, items_by_id: dict):
    """返回 (分类, 命中信号说明 list)。文件名+内容双通道打分。"""
    name = os.path.basename(rel_path).lower()
    score = {}
    why = []

    def add(cls, pts, reason):
        score[cls] = score.get(cls, 0.0) + pts
        why.append(f"{cls}:{reason}")

    # ---- 文件名信号 ----
    if re.search(r"g1p-02|availab|可得性", name):
        add(CLS_G1P02, 3, "文件名")
    if re.search(r"g1p-03|ruleset|规则集", name):
        add(CLS_G1P03, 3, "文件名")
    if re.search(r"g1p-05|evidence|证据", name):
        add(CLS_G1P05, 3, "文件名")
    if re.search(r"g1p-01|brief|g1p-04|export.?guide|send-and-return|readme", name):
        add(CLS_PACK, 3, "文件名")
    if os.path.basename(rel_path).lower() in KNOWN_PACK_NAMES:
        add(CLS_PACK, 10, "包内规范文件名")
    if re.match(r"g1_[a-z0-9_]+?_\d{6}_\d+", name):
        add(CLS_DATA, 2, "文件名符合 G1_<源>_YYYYMM_<序号>")

    # ---- 内容信号 ----
    if text:
        head = "\n".join(text.splitlines()[:15])
        id_rows = count_g1p02_id_rows(text, items_by_id)
        if re.search(r"^#{1,6}\s*G1P-02", head, re.M) or "数据可得性确认表" in head:
            add(CLS_G1P02, 3, "标题/表名")
        elif "数据可得性确认表" in text and id_rows >= 3:
            add(CLS_G1P02, 2, "表名+条目行")
        if id_rows >= 5:
            add(CLS_G1P02, 2, f"{id_rows} 行条目编号")
        if re.search(r"^#{1,6}\s*G1P-03", head, re.M) or "客户规则集采集表" in head:
            add(CLS_G1P03, 3, "标题/表名")
        r_heads = len(re.findall(r"(?m)^#{1,6}\s*R\d{1,2}\b", text))
        if r_heads >= 6:
            add(CLS_G1P03, 3, f"{r_heads} 个 R 编号节")
        if re.search(r"^#{1,6}\s*G1P-05", head, re.M):
            add(CLS_G1P05, 3, "标题")
        six_hits = sum(1 for k in ("六要件", "字段字典", "快照元数据", "snapshot_hash", "PII 排除声明", "缺口清单") if k in text)
        if six_hits >= 3:
            add(CLS_G1P05, 3, f"证据包要件词 {six_hits} 个")
        if "G1-ENTERPRISE-PACK" in head or "SEND-AND-RETURN-SOP" in head:
            add(CLS_PACK, 2, "包说明文件")

    # ---- 结构信号 ----
    if ext in DATA_EXTS and text:
        add(CLS_DATA, 1, f"扩展名 {ext}")

    if not score:
        return CLS_UNKNOWN, why
    priority = {CLS_G1P02: 5, CLS_G1P03: 4, CLS_G1P05: 3, CLS_DATA: 2, CLS_PACK: 1}
    best = max(score.items(), key=lambda kv: (kv[1], priority.get(kv[0], 0)))
    if best[1] < 2:
        return CLS_UNKNOWN, why
    return best[0], why


# ---------------------------------------------------------------------------
# 字段级校验
# ---------------------------------------------------------------------------

ANSWER_HEADER_KW = ("回填", "可得性", "现有系统", "导出方式", "历史深度", "负责人")
MEANINGLESS_CELL = re.compile(r"^[\s\-—–_/\\.·☐□]*$")
NEGATIVE_ANSWER = {"待补", "待填", "未填", "missing", "tbd", "todo", "暂无", "不详"}
PLACEHOLDER_RE = re.compile(r"【数|TBD|TODO|待填写|待回填|<[填写]|例：")
INVALID_DATE_RE = re.compile(r"(?<!\d)(\d{4})\s*[-/年.]\s*(\d{1,2})\s*[-/月.]\s*(\d{1,2})(?!\d)")
COMPACT_DATE_RE = re.compile(r"(?<!\d)((?:19|20)\d{2})(\d{2})(\d{2})(?!\d)")
SEP_FIELD_RE = re.compile(r"[,，;；\t|]+")


def is_meaningful_cell(v: str) -> bool:
    return bool(v) and not MEANINGLESS_CELL.match(v.strip())


def is_negative_answer(v: str) -> bool:
    return v.strip().lower() in NEGATIVE_ANSWER


POINTER_ANSWER = {"见", "参见", "详见", "附件", "见附件", "详见附件", "附件见", "na", "n/a", "无", "-", "—", "同上"}


def is_pointer_answer(v: str) -> bool:
    return v.strip().lower().strip(".。") in POINTER_ANSWER


# 模板残留（【数】/TBD 等）不算真实作答
TEMPLATE_RESIDUE_RE = re.compile(r"【数|TBD|TODO|待填写|待回填")


def is_filled_cell(v: str) -> bool:
    return (is_meaningful_cell(v) and not is_negative_answer(v)
            and not TEMPLATE_RESIDUE_RE.search(v))


def g1p02_answer_cols(header: list) -> list:
    idx = [i for i, h in enumerate(header) if any(k in h for k in ANSWER_HEADER_KW)]
    if not idx:
        idx = [len(header) - 1]  # 兜底：最后一列通常是回填列
    return idx


def cell_status_from_counts(filled: int, total: int) -> str:
    if total <= 1:
        return COVERED if filled >= 1 else MISSING
    if filled == 0:
        return MISSING
    if filled >= total:
        return COVERED
    return PARTIAL


def parse_g1p02_form(text: str, items_by_id: dict):
    """解析 G1P-02 markdown 表单：返回 ({iid: 结果}, item_table_linenos)。"""
    out = {}
    item_table_lines = set()
    tables, _ = iter_md_tables(text)
    for _section, header, rows, table_linenos in tables:
        ans = g1p02_answer_cols(header)
        avail_i = next((i for i, h in enumerate(header) if "可得性" in h), None)
        avail_i = avail_i if avail_i in ans else None
        hit_in_table = False
        for ln, row in rows:
            if not row:
                continue
            m = ID_CELL_RE.match(row[0])
            if not m:
                continue
            iid = m.group(1)
            if iid not in items_by_id:
                continue
            hit_in_table = True
            vals = [(row[i] if i < len(row) else "") for i in ans]
            filled = sum(1 for v in vals if is_filled_cell(v))
            avail = extract_avail(row[avail_i]) if avail_i is not None and avail_i < len(row) else None
            out[iid] = {
                "status": cell_status_from_counts(filled, len(ans)),
                "avail": avail,
                "filled": filled,
                "total": len(ans),
                "via": f"表格行 L{ln}",
            }
        if hit_in_table:
            item_table_lines |= table_linenos
    return out, item_table_lines


# ---------------------------------------------------------------------------
# 分隔表格解析：CSV/TSV 导出或 markdown 表格的「表头答案列 + ID 行」结构。
# 企业常把 G1P-02 表单导成 CSV 回传；表头关键词决定答案列，
# 避免把「证据要求/备注」等非答案列误当作答（否则空行也会假 covered）。
# ---------------------------------------------------------------------------

DELIM_RE = re.compile(r"[,，;；\t|]+")
ID_ROW_START_RE = re.compile(r"(?m)^\s*\|?\s*(?:0|A\d|B\d)-\d{1,2}\s*[,，;；\t|]")
TABLE_HEADER_HINT_RE = re.compile(
    r"编号|数据项|核实项|项目|名称|系统/账号|盘点|可得性|回填|现有系统|导出方式|"
    r"历史深度|负责人|优先级|备注|粒度|证据|要求|说明"
)
ID_HEADER_CELL_RE = re.compile(r"^(#|编号|id|item|行号|数据项编号|no\.?)$", re.I)
GAP_HEADER_GUARD_RE = re.compile(r"g1p-02|缺口", re.I)


def split_delimited(line: str) -> list:
    cells = [c.strip() for c in DELIM_RE.split(line.strip())]
    while cells and cells[0] == "":
        cells.pop(0)
    while cells and cells[-1] == "":
        cells.pop()
    return cells


def parse_g1p02_delimited(text: str, items_by_id: dict):
    """按「表头行定列、ID 首列定行」解析分隔表格。返回 {iid: 结果}。"""
    out = {}
    header_cells = None
    ans_idx = []
    id_col = 0
    avail_i = None
    for ln, line in enumerate(text.splitlines(), 1):
        s = line.strip()
        if not s:
            continue
        cells = split_delimited(s)
        # 表头判定：≥3 列且 ≥2 个表头提示词；G1P-05 缺口清单表头除外
        if cells and GAP_HEADER_GUARD_RE.search(" ".join(cells)):
            header_cells = None  # 离开数据表上下文
            continue
        if len(cells) >= 3:
            hits = sum(1 for c in cells if TABLE_HEADER_HINT_RE.search(c))
            is_id_first = bool(cells) and ID_CELL_RE.match(cells[0] or "")
            if hits >= 2 and not is_id_first:
                header_cells = cells
                id_col = next(
                    (i for i, c in enumerate(cells) if ID_HEADER_CELL_RE.match(c)), 0)
                ans_idx = [i for i, h in enumerate(cells)
                           if any(k in h for k in ANSWER_HEADER_KW)]
                if not ans_idx:
                    ans_idx = [len(cells) - 1]
                ai = next((i for i, h in enumerate(cells) if "可得性" in h), None)
                avail_i = ai if ai in ans_idx else None
                continue
        if header_cells is None:
            continue
        # 数据行：ID 在 id_col 或首列
        iid = None
        for cand in dict.fromkeys((id_col, 0)):
            if cand < len(cells):
                m = ID_CELL_RE.match(cells[cand])
                if m:
                    iid = m.group(1)
                    break
        if not iid or iid not in items_by_id:
            continue
        vals = [(cells[i] if i < len(cells) else "") for i in ans_idx]
        filled = sum(1 for v in vals if is_filled_cell(v))
        avail = (extract_avail(cells[avail_i])
                 if avail_i is not None and avail_i < len(cells) else None)
        out[iid] = {
            "status": cell_status_from_counts(filled, len(ans_idx)),
            "avail": avail, "filled": filled, "total": len(ans_idx),
            "lineno": ln, "via": f"分隔表格 L{ln}",
        }
    return out


def scan_g1p02_id_lines(line_pairs, items_by_id: dict, consumed: set):
    """条目 ID 行级扫描：区分 row(结构化→可覆盖) / mention(实质内容→部分覆盖) / echo(模板回声→无)。

    line_pairs = [(lineno, line)]（已过模板行中性化）。
    返回 {iid: {"kind","lineno","avail","via"}}
    """
    hits = {}
    for ln, line in line_pairs:
        if ln in consumed:
            continue
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        for m in ID_INLINE_RE.finditer(line):
            iid = m.group(1)
            if iid not in items_by_id:
                continue
            item = items_by_id[iid]
            # 结构化行：去掉前导 | 后，ID 在行首且后跟分隔符（CSV/TSV/简表/汇总行）
            s2 = s.lstrip("|").strip()
            row_m = re.match(r"^" + re.escape(iid) + r"\s*[,，;；\t|]\s*(.*)$", s2)
            kind = None
            if row_m:
                rest = row_m.group(1)
                fields = [f.strip() for f in SEP_FIELD_RE.split(rest) if f.strip()]
                tpl_norm = {norm_cell(c) for c in item.tpl_cells}
                answer_fields = [
                    f for f in fields
                    if norm_cell(f) != norm_cell(item.name)
                    and norm_cell(f) not in tpl_norm
                    and is_meaningful_cell(f)
                    and not is_negative_answer(f)
                ]
                # 全部字段都是「见附件/参见」类指针 → 只是指路，不算作答
                if answer_fields and all(is_pointer_answer(f) for f in answer_fields):
                    kind = "mention"
                else:
                    kind = "row" if answer_fields else "echo"
            else:
                # 行内提及：扣除 ID、条目名、模板单元格文本后看剩余实质内容
                rest = line[: m.start()] + " " + line[m.end():]
                rest = rest.replace(item.name, " ")
                for tc in item.tpl_cells:
                    if len(tc) >= 6:
                        rest = rest.replace(tc, " ")
                meaningful = len(re.sub(r"[\s|,，;；:：、.。\-—–_()（）#*`~]+", "", rest))
                has_enum = bool(AVAIL_RE.search(line))
                kind = "mention" if (meaningful >= 3 or has_enum) else "echo"
            avail = extract_avail(line)
            prev = hits.get(iid)
            # row > mention > echo；同行内先到先得
            rank = {"row": 2, "mention": 1, "echo": 0}
            if prev is None or rank[kind] > rank[prev["kind"]]:
                hits[iid] = {"kind": kind, "lineno": ln, "avail": avail, "via": None}
            elif prev is not None and avail and not prev.get("avail"):
                prev["avail"] = avail
    # echo 不产出信号，从结果中剔除
    return {k: v for k, v in hits.items() if v["kind"] != "echo"}


def expand_id_refs(s: str) -> set:
    """展开「A1-1~A1-8」「B1-1~B1-8」等行号引用；跳过「例：」示例上下文。"""
    ids = set()
    RANGE_RE = re.compile(r"([AB]\d|0)-(\d{1,2})\s*[~～\-—至到]+\s*(?:([AB]\d|0)-)?(\d{1,2})")
    spans = []
    for m in RANGE_RE.finditer(s):
        pre1, n1, pre2, n2 = m.groups()
        # 前文 8 字符内出现「例」视为模板示例，不展开
        ctx = s[max(0, m.start() - 8): m.start()]
        if "例" in ctx:
            continue
        spans.append(m.span())
        if pre2 and pre2 != pre1:
            ids.add(f"{pre1}-{n1}")
            ids.add(f"{pre2}-{n2}")
            continue
        pre = pre2 or pre1
        try:
            a, b = int(n1), int(n2)
            if a <= b <= a + 30:
                for n in range(a, b + 1):
                    ids.add(f"{pre}-{n}")
        except ValueError:
            pass
    # 去掉范围段再扫单点 ID
    chars = list(s)
    for a, b in spans:
        for i in range(a, b):
            chars[i] = " "
    s_rest = "".join(chars)
    for m in ID_INLINE_RE.finditer(s_rest):
        ctx = s_rest[max(0, m.start() - 8): m.start()]
        if "例" in ctx:
            continue
        ids.add(m.group(1))
    return ids


def parse_g1p03_form(text: str, rules_by_rid: dict):
    """解析 G1P-03 规则集：返回 {rid: {"filled","total","pending","via"}}"""
    out = {}
    heads = list(re.finditer(r"(?m)^#{1,6}\s*R(\d{1,2})\b[^\n]*", text))
    for i, hm in enumerate(heads):
        rid = "R" + hm.group(1)
        if rid not in rules_by_rid:
            continue
        start = hm.end()
        end = heads[i + 1].start() if i + 1 < len(heads) else len(text)
        seg = text[start:end]
        nm = re.search(r"(?m)^#{1,6}\s", seg)
        if nm:
            seg = seg[: nm.start()]
        fields_found = []
        for bl in seg.splitlines():
            bm = re.match(r"^\s*[-*]\s+(.+?)\s*[：:]\s*(.*)$", bl)
            if bm:
                fields_found.append((bm.group(1).strip(), bm.group(2).strip()))
        spec = rules_by_rid[rid]
        total = max(len(spec.fields), len(fields_found), 1)
        filled = 0
        pending = 0
        for idx, (_prompt, ans) in enumerate(fields_found):
            template_tail = spec.fields[idx][1] if idx < len(spec.fields) else ""
            a = ans.strip()
            if a and a != template_tail and not MEANINGLESS_CELL.match(a):
                filled += 1
                if "待定" in a or "待确认" in a:
                    pending += 1
        if not fields_found:
            # 无 bullet 结构：节内有「：」且冒号后有内容的行 → 保守记 1 个已填字段
            probe = any(
                re.search(r"[：:]\s*\S", l) and "控制什么" not in l
                for l in seg.splitlines()
            )
            if probe:
                filled = 1
        out[rid] = {"filled": filled, "total": total, "pending": pending,
                    "via": f"R 节（约 L{text[:hm.start()].count(chr(10)) + 1}）"}
    # 兜底：表格行首是 R 编号（非 ## 结构）
    tables, _ = iter_md_tables(text)
    for _sec, _header, rows, _lns in tables:
        for ln, row in rows:
            if not row:
                continue
            m = re.match(r"^R(\d{1,2})$", row[0].strip())
            if not m:
                continue
            rid = "R" + m.group(1)
            if rid in rules_by_rid and rid not in out:
                meaningful = sum(1 for c in row[1:] if is_meaningful_cell(c))
                if meaningful:
                    out[rid] = {"filled": 1, "total": 4, "pending": 0, "via": f"表格行 L{ln}"}
    return out


# ---------------------------------------------------------------------------
# G1P-05 证据包解析
# ---------------------------------------------------------------------------

REQ_LABELS = {
    "1": "脱敏样例+字段字典", "2": "时间窗与粒度", "3": "字段映射+PII声明",
    "4": "snapshot_hash", "5": "缺口清单", "6": "品类边界(五源)", "6'": "口径说明(新源)",
}


def tpl_differs(value: str, template_value: str) -> bool:
    """值是否相对模板有实质改动（非空 且 不等于模板原文）。"""
    v = (value or "").strip()
    if not v or MEANINGLESS_CELL.match(v):
        return False
    return norm_cell(v) != norm_cell(template_value or "")


def parse_g1p05_form(text: str, tpl: G1P05Template):
    """解析 G1P-05 证据包：要件完成度、提交信息、元数据、字典/缺口行数。"""
    info = {
        "submit_filled": 0, "submit_total": 0, "src_name": "", "g1p02_refs": set(),
        "file_naming": "", "six_done": [], "six_total": 0,
        "meta_filled": 0, "meta_total": 0, "dict_rows": 0, "gap_rows": 0,
        "has_pii_decl": "PII 排除声明" in text or "已排除以下字段" in text,
        "has_field_dict": "字段字典" in text,
        "has_snapshot_meta": "快照元数据" in text or "snapshot_id" in text,
        "has_gap_section": "缺口清单" in text,
    }
    tables, _ = iter_md_tables(text)
    for section, header, rows, _lns in tables:
        h = [x.lower() for x in header]
        # 六要件核对表
        if any("要件" in x for x in h) and any("完成" in x for x in h):
            done_i = next((i for i, x in enumerate(h) if "完成" in x), None)
            att_i = next((i for i, x in enumerate(h) if "附件" in x or "位置" in x), None)
            for _ln, c in rows:
                if not c:
                    continue
                req = c[0].strip()
                done_cell = c[done_i] if done_i is not None and done_i < len(c) else ""
                att_cell = c[att_i] if att_i is not None and att_i < len(c) else ""
                tpl_done = tpl.six.get(req, "")
                done = False
                dc = done_cell.strip()
                if dc != tpl_done.strip() and (
                    re.search(r"[☑✅☒✓✔]", dc)
                    or dc in ("是", "完成", "已完成", "已", "yes", "YES", "Yes")
                ):
                    done = True
                if att_i is not None and tpl_differs(att_cell, ""):
                    done = True
                info["six_total"] += 1
                if done:
                    info["six_done"].append(req)
        # 提交信息表（| 项 | 填写 |）
        elif any("填写" in x for x in h) and len(header) <= 3:
            for _ln, c in rows:
                if len(c) < 2:
                    continue
                key, val = c[0], c[1] if len(c) > 1 else ""
                info["submit_total"] += 1
                if tpl_differs(val, tpl.submit.get(key, "")):
                    info["submit_filled"] += 1
                    if "源名称" in key:
                        info["src_name"] = val.strip()[:60]
                    if "行号" in key or "G1P-02" in key:
                        info["g1p02_refs"] |= expand_id_refs(val)
                    if "命名" in key:
                        info["file_naming"] = val.strip()[:60]
        # 快照元数据（| 字段 | 值 |）
        elif "字段" in h and "值" in h and len(header) <= 3:
            for _ln, c in rows:
                if len(c) < 2:
                    continue
                info["meta_total"] += 1
                if tpl_differs(c[1], tpl.meta.get(c[0], "")):
                    info["meta_filled"] += 1
        # 字段字典
        elif "字段名" in h and "类型" in h:
            for _ln, c in rows:
                if norm_row_text(c) not in tpl.dict_rows and any(is_meaningful_cell(x) for x in c):
                    info["dict_rows"] += 1
        # 缺口清单（表头含 G1P-02）
        elif any("g1p-02" in x for x in h):
            for _ln, c in rows:
                if norm_row_text(c) not in tpl.gap_rows and c and is_meaningful_cell(c[0]):
                    info["gap_rows"] += 1
    return info


# ---------------------------------------------------------------------------
# PII 扫描（SOP 4.3）：只输出 文件+行号+类型，绝不输出命中内容
# ---------------------------------------------------------------------------

PII_REGEXES = [
    ("邮箱地址", re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")),
    # 手机号：兼容 +86/86 前缀与分隔符写法；只报位置不报内容
    ("手机号码", re.compile(r"(?<![\d.])(?:\+?86[\s-]*)?1[3-9]\d[\d\s-]{7,11}\d(?!\d)")),
    ("身份证号", re.compile(r"(?<![\dA-Za-z])\d{17}[\dXx](?![\dA-Za-z])")),
    # 中文地址：先试「省市区县+门牌号」强模式，再兜「路名+门牌号」
    ("疑似地址(中文)", re.compile(
        r"[一-鿿]{2,}(?:省|市|自治区|特别行政区|区|县|州)[一-鿿]{0,12}\d+\s*(?:号|室|栋|单元|楼|层|座)"
        r"|[一-鿿]{2,}?(?:路|街|巷|大道|公路|胡同)\s*\d{1,5}\s*号")),
    ("疑似地址(英文)", re.compile(r"\b\d{1,6}\s+[A-Za-z0-9 .'#-]{2,40}\b(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Place|Pl)\b", re.I)),
    ("疑似地址(单元号)", re.compile(r"\b(?:room|apt|apartment|suite|unit|flat)\s*#?\s*\d+[a-zA-Z]?\b", re.I)),
]

CUSTOMER_COL_RE = re.compile(
    # 拉丁字段名：customer_email / buyer_phone / recipient_address 等组合
    r"(customer|buyer|recipient|client|purchaser|user|member|sold[_\-\s]?to|ship[_\-\s]?to)"
    r"[_\-\s.]*(name|email|phone|mobile|tel|address|addr|id|first|last)\b"
    # 常见独立字段名
    r"|\b(?:first|last|full)[_\-\s]*name\b"
    r"|\b(?:e-?mail|email)\b"
    r"|\b(?:phone|mobile|telephone|tel)\b"
    r"|\b(?:address\w*|addr|street)\b"
    r"|\b(?:order_?id|order_?number|tracking_?no|tracking_?number|id_?card|passport)\b"
    r"|\b(?:screen_?name|user_?name|nick_?name|handle)\b"
    # 中文字段名：带属主的组合 + 常见裸字段名
    r"|(客户|买家|收货人|收件人|联系人|用户)[^,，;；\t|]{0,6}(姓名|名称|邮箱|电话|手机|地址|单号)"
    r"|(收货地址|详细地址|客户邮箱|买家邮箱|联系电话|手机号码|客户姓名|买家姓名|收货人姓名|"
    r"订单号|订单编号|物流单号|运单号|身份证|证件号|护照号|邮箱|电子邮箱|邮件地址|姓名|名字|电话|手机|地址)",
    re.I,
)


def _is_header_line(lines: list, i: int) -> bool:
    """判断第 i 行（0 基）是否像表头：md 表头（下一行是分隔行）/ CSV 首行 / 多列字段名行。"""
    s = lines[i].strip()
    if not s:
        return False
    if s.startswith("|"):
        if i + 1 < len(lines):
            nxt = lines[i + 1].strip()
            if nxt.startswith("|") and is_sep_row(split_md_row(nxt)):
                return True
        return False
    # CSV/TSV 首行
    if i == 0 and (s.count(",") >= 2 or s.count("\t") >= 2 or s.count(";") >= 2):
        return True
    # 任意行：≥3 个分隔字段且 ≥2 个字段命中客户字段模式 → 自证是表头
    cells = [c for c in re.split(r"[,，;；\t]+", s) if c.strip()]
    if len(cells) >= 3:
        hits = sum(1 for c in cells if CUSTOMER_COL_RE.search(c))
        if hits >= 2:
            return True
    return False


def scan_pii(rel_path: str, text: str):
    """返回 [(lineno, type, count)]；文件名也扫一遍。"""
    hits = []
    base = os.path.basename(rel_path)
    for label, rx in PII_REGEXES:
        if rx.search(base):
            hits.append(("文件名", label, 1))
    if text:
        lines = text.splitlines()
        for i, line in enumerate(lines):
            counts = {}
            for label, rx in PII_REGEXES:
                n = len(rx.findall(line))
                if n:
                    counts[label] = n
            if _is_header_line(lines, i):
                cells = [c for c in re.split(r"[|,，;；\t]+", line.strip().strip("|")) if c.strip()]
                col_hits = sum(1 for c in cells if CUSTOMER_COL_RE.search(c))
                if col_hits:
                    counts["疑似客户级字段列"] = col_hits
            for label, n in counts.items():
                hits.append((i + 1, label, n))
    return hits


# ---------------------------------------------------------------------------
# 格式异常：日期/占位符级。只报位置与类型，不含内容。
# ---------------------------------------------------------------------------


def scan_format_anomalies(text: str):
    out = []
    for ln, line in enumerate(text.splitlines(), 1):
        for m in INVALID_DATE_RE.finditer(line):
            mo, d = int(m.group(2)), int(m.group(3))
            if not (1 <= mo <= 12 and 1 <= d <= 31):
                out.append((ln, "日期格式可疑"))
                break
        else:
            for m in COMPACT_DATE_RE.finditer(line):
                mo, d = int(m.group(2)), int(m.group(3))
                if not (1 <= mo <= 12 and 1 <= d <= 31):
                    out.append((ln, "8位日期格式可疑"))
                    break
    return out


def scan_answer_anomalies_g1p02(tables) -> list:
    """G1P-02 回填单元格里的占位符残留。"""
    out = []
    for _sec, header, rows, _lns in tables:
        ans = g1p02_answer_cols(header)
        for ln, row in rows:
            for i in ans:
                if i < len(row) and PLACEHOLDER_RE.search(row[i]):
                    out.append((ln, "回填列含占位符/模板残留"))
                    break
    return out


# ---------------------------------------------------------------------------
# 关键词扫描（非结构化文件的兜底覆盖信号）
# ---------------------------------------------------------------------------

ASCII_KW_RE = re.compile(r"[A-Za-z0-9_+\-./ ]+")
_KW_RX_CACHE = {}
DF_DEMOTE = 3  # 出现在 ≥3 个条目关键词集里的词视为泛词，单发命中不晋级


def is_strong_kw(kw: str) -> bool:
    if len(kw) >= 4:
        return True
    if re.search(r"[A-Z0-9]", kw) and len(kw) >= 3:
        return True
    return False


def _kw_searcher(kw: str):
    """返回 (searcher(low_text)->bool, is_id)；searcher 统一作用于已 lower 的文本。

    纯 ASCII 词用词边界正则（防 'Shop'⊂'Shopify'、'sp'⊂'spend'、'ads'⊂'loads'
    这类子串误中），含中文的词用子串；条目/规则编号走独立边界正则。
    """
    if ID_ANY_RE.match(kw):
        k = kw.lower()
        if k not in _KW_RX_CACHE:
            _KW_RX_CACHE[k] = re.compile(
                r"(?<![0-9a-z])" + re.escape(k) + r"(?![0-9a-z])")
        rx = _KW_RX_CACHE[k]
        return lambda low, r=rx: bool(r.search(low)), True
    if ASCII_KW_RE.fullmatch(kw):
        k = kw.lower()
        if k not in _KW_RX_CACHE:
            # 多词关键词按 \s+ 连接，容忍换行/连续空格
            body = r"\s+".join(re.escape(p) for p in k.split(" ") if p)
            _KW_RX_CACHE[k] = re.compile(
                r"(?<![a-z0-9_])" + body + r"(?![a-z0-9_])")
        rx = _KW_RX_CACHE[k]
        return lambda low, r=rx: bool(r.search(low)), False
    k = kw.lower()
    return lambda low, kk=k: kk in low, False


def build_tpl_snippets(items: list, rules: list, tpl05) -> list:
    """收集模板原文片段（≥6 字符、单行），供关键词扫描前清洗。

    CSV/表格回传常把「核实项/证据要求」等模板提示列原样带回，
    不清洗会让模板回声被误计为关键词命中（假部分覆盖）。
    """
    snips = set()
    for it in items:
        snips.update(c for c in it.tpl_cells if len(c) >= 6 and "\n" not in c)
    for r in rules:
        if len(r.title) >= 6:
            snips.add(r.title)
        for prompt, tail in r.fields:
            for t in (prompt, tail):
                if isinstance(t, str) and len(t) >= 6 and "\n" not in t:
                    snips.add(t)
    for grp in (tpl05.submit, tpl05.meta):
        for v in grp.values():
            if isinstance(v, str) and len(v) >= 6 and "\n" not in v:
                snips.add(v)
    # 长片段优先替换，避免短片段先吃掉长片段的一部分
    return sorted(snips, key=len, reverse=True)


def scrub_tpl_snippets(text: str, snippets: list) -> str:
    for s in snippets:
        text = text.replace(s, " ")
    return text


def keyword_scan_file(text: str, item_keywords: dict, rule_keywords: dict):
    """全文关键词匹配（已中性化）。返回 {key: {"hits","strong","n"}}，只保留晋级项。

    晋级规则：任一强关键词命中，或 ≥2 个不同关键词命中。
    泛词降级：同一关键词出现在 ≥DF_DEMOTE 个条目关键词集里时不再算「强」
    （如 "Amazon"/"Shopify" 几乎每个源都提，单发命中没有区分度）。
    """
    low = text.lower()
    all_kws = list(item_keywords.values()) + list(rule_keywords.values())
    df = Counter(kw for kws in all_kws for kw in kws)
    out = {}
    for key, kws in {**item_keywords, **rule_keywords}.items():
        hits = set()
        strong = False
        for kw in kws:
            searcher, is_id = _kw_searcher(kw)
            if searcher(low):
                hits.add(kw)
                if is_id or (is_strong_kw(kw) and df[kw] < DF_DEMOTE):
                    strong = True
        if hits and (strong or len(hits) >= 2):
            out[key] = {"hits": hits, "strong": strong, "n": len(hits)}
    return out


# ---------------------------------------------------------------------------
# 目录扫描与 zip 处理
# ---------------------------------------------------------------------------


@dataclass
class FoundFile:
    abspath: str
    rel_path: str          # 相对 returns_dir
    size: int
    sha256: str
    extracted_from: str = ""


def sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def safe_extract_zip(zip_path: str, dest_dir: str):
    """解压 zip 到 dest_dir，返回 (成功文件数, 跳过项 list)。防 zip-slip。"""
    extracted, skipped = 0, []
    os.makedirs(dest_dir, exist_ok=True)
    with zipfile.ZipFile(zip_path) as z:
        for info in z.infolist():
            name = info.filename
            norm = name.replace("\\", "/")
            parts = [p for p in norm.split("/") if p not in ("", ".")]
            if (
                norm.startswith("/")
                or re.match(r"^[A-Za-z]:", norm)
                or ".." in parts
                or info.is_dir()
            ):
                skipped.append(name)
                continue
            target = os.path.join(dest_dir, *parts)
            os.makedirs(os.path.dirname(target), exist_ok=True)
            with z.open(info) as src, open(target, "wb") as dst:
                dst.write(src.read())
            extracted += 1
    return extracted, skipped


def inventory_returns(returns_dir: str):
    """盘点 returns/：先处理 zip（不含 extracted/ 内的嵌套 zip），再全量走文件。"""
    files = []
    zip_notes = []
    warnings = []

    zips = []
    for dirpath, _dirnames, filenames in os.walk(returns_dir):
        rel_dir = os.path.relpath(dirpath, returns_dir)
        if rel_dir.split(os.sep)[0] == "extracted":
            continue  # extracted/ 内的 zip 是嵌套包，不递归解压
        for fn in filenames:
            if fn.lower().endswith(".zip") and not fn.startswith("."):
                zips.append(os.path.join(dirpath, fn))
    for zp in sorted(zips):
        rel = os.path.relpath(zp, returns_dir)
        stem = os.path.splitext(os.path.basename(zp))[0][:40]
        # 目标目录带 zip 内容 sha：同一 zip 重复运行不重复解压，
        # extracted/ 不会随每次 intake 累积副本；zip 变更则 sha 变 → 新目录。
        dest = os.path.join(returns_dir, "extracted", f"{sha256_file(zp)[:12]}__{stem}")
        if os.path.isdir(dest):
            zip_notes.append((rel, os.path.relpath(dest, returns_dir), -1, []))
            warnings.append(f"{rel}: 已解压过（{os.path.relpath(dest, returns_dir)}/），跳过重复解压")
            continue
        try:
            n, skipped = safe_extract_zip(zp, dest)
            zip_notes.append((rel, os.path.relpath(dest, returns_dir), n, skipped))
            if skipped:
                warnings.append(f"{rel}: 跳过可疑条目 {len(skipped)} 个（路径穿越/绝对路径）")
        except zipfile.BadZipFile:
            warnings.append(f"{rel}: 不是有效 zip，需人工处理")
        except OSError as exc:
            warnings.append(f"{rel}: 解压失败 {exc}")

    for dirpath, dirnames, filenames in os.walk(returns_dir):
        dirnames[:] = [d for d in dirnames if not d.startswith(".")]
        for fn in sorted(filenames):
            if fn.startswith(".") or fn.startswith(REPORT_PREFIX):
                continue
            ap = os.path.join(dirpath, fn)
            if not os.path.isfile(ap) or os.path.islink(ap):
                continue
            rel = os.path.relpath(ap, returns_dir)
            try:
                size = os.path.getsize(ap)
            except OSError:
                continue
            files.append(FoundFile(abspath=ap, rel_path=rel, size=size, sha256=sha256_file(ap)))
    return files, zip_notes, warnings


# ---------------------------------------------------------------------------
# 单文件处理
# ---------------------------------------------------------------------------


@dataclass
class FileReport:
    rel_path: str
    size: int
    sha256: str
    cls: str
    why: list
    note: str = ""
    text: str = ""
    has_text: bool = False
    g1p02: dict = field(default_factory=dict)
    g1p02_idlines: dict = field(default_factory=dict)
    g1p03: dict = field(default_factory=dict)
    g1p05: dict = field(default_factory=dict)
    pii: list = field(default_factory=list)
    anomalies: list = field(default_factory=list)
    kw_hits: dict = field(default_factory=dict)


def process_file(ff: FoundFile, items_by_id: dict, rules_by_rid: dict, tpl05: G1P05Template,
                 item_keywords: dict, rule_keywords: dict, tpl_snippets: list = None):
    fr = FileReport(rel_path=ff.rel_path, size=ff.size, sha256=ff.sha256, cls="", why=[])
    ext = os.path.splitext(ff.rel_path)[1].lower()
    text = ""
    has_text = False

    if ext in BINARY_EXTS and ext not in OFFICE_EXTS:
        fr.cls = CLS_BINARY
        fr.note = "二进制/压缩格式，需人工查看或转换后重跑"
        if ext == ".zip":
            fr.note += "（嵌套压缩包未自动解压）"
    elif ext in OFFICE_EXTS:
        try:
            text = extract_xlsx_text(ff.abspath) if ext == ".xlsx" else extract_docx_text(ff.abspath)
            has_text = True
            fr.note = f"从 {ext} 抽取文本"
        except Exception as exc:  # noqa: BLE001 - 解析失败降级人工分流
            fr.cls = CLS_BINARY
            fr.note = f"{ext} 解析失败（{type(exc).__name__}），需人工处理"
    else:
        try:
            if ff.size > MAX_TEXT_BYTES:
                fr.note = f"文件 {ff.size >> 20}MB 超过 {MAX_TEXT_BYTES >> 20}MB 上限，未做文本解析"
            else:
                text = read_text(ff.abspath)
                has_text = True
        except OSError as exc:
            fr.cls = CLS_BINARY
            fr.note = f"读取失败：{exc}"

    if not fr.cls:
        fr.cls, fr.why = classify_file(ff.rel_path, text if has_text else "", ext, items_by_id)
        if not has_text and fr.cls == CLS_UNKNOWN:
            fr.cls = CLS_BINARY
            if not fr.note:
                fr.note = "无可解析文本"

    # ---- 按分类做字段级解析 ----
    parsed_g1p02 = parsed_g1p03 = False
    consumed = set()
    line_pairs = neutralized_lines(text) if has_text else []
    if fr.cls == CLS_G1P02 and has_text:
        fr.g1p02, consumed = parse_g1p02_form(text, items_by_id)
        parsed_g1p02 = len(fr.g1p02) >= 3
        if parsed_g1p02:
            fr.g1p02_idlines = scan_g1p02_id_lines(line_pairs, items_by_id, consumed)
            tables, _ = iter_md_tables(text)
            fr.anomalies += scan_answer_anomalies_g1p02(tables)
        else:
            fr.note = (fr.note + "；" if fr.note else "") + "识别为 G1P-02 但未解析出表单结构，降级行级/关键词匹配"
    elif fr.cls == CLS_G1P03 and has_text:
        fr.g1p03 = parse_g1p03_form(text, rules_by_rid)
        parsed_g1p03 = len(fr.g1p03) >= 3
        if not parsed_g1p03:
            fr.note = (fr.note + "；" if fr.note else "") + "识别为 G1P-03 但未解析出规则节，降级关键词匹配"
    elif fr.cls == CLS_G1P05 and has_text:
        fr.g1p05 = parse_g1p05_form(text, tpl05)
        # 证据包内「对应 G1P-02 行号」→ 部分覆盖信号
        if fr.g1p05.get("g1p02_refs"):
            fr.g1p02_idlines = {
                iid: {"kind": "mention", "lineno": 0, "avail": None, "via": "证据包行号引用"}
                for iid in fr.g1p05["g1p02_refs"] if iid in items_by_id
            }

    # ---- 分隔表格解析：CSV/TSV/markdown 表格的「表头答案列 + ID 行」----
    # 已解析的 G1P-02 markdown 表单走单元格路径，不重复；
    # 其余文件（含表单降级、证据包、数据样例、未知文本）都尝试。
    if (has_text and fr.cls != CLS_BINARY
            and not (fr.cls == CLS_G1P02 and parsed_g1p02)
            and ID_ROW_START_RE.search(text)):
        for iid, res in parse_g1p02_delimited(text, items_by_id).items():
            fr.g1p02.setdefault(iid, res)
            # 已被分隔表格结构化判定的行不再交给 ID 行扫描，
            # 防止「表头答案列之外的提示列」被误判为整行已答（假 covered）
            consumed.add(res["lineno"])

    # ---- ID 行扫描 + 范围展开：所有有文本的文件 ----
    # PACK 类也参与：中性化已剔除包内模板行，企业自写的 README/说明
    # 里的真实 ID 引用仍能产出部分覆盖；我方文档回传则零命中。
    if has_text and fr.cls != CLS_BINARY:
        id_hits = scan_g1p02_id_lines(line_pairs, items_by_id, consumed)
        # 与结构化结果合并：row 优先于 mention，已有 row 不被 mention 降级
        for iid, d in id_hits.items():
            prev = fr.g1p02_idlines.get(iid)
            if prev is None or (prev["kind"] != "row" and d["kind"] == "row"):
                fr.g1p02_idlines[iid] = d
        # 行号范围引用（A1-1~A1-8）补齐中间项
        neut_text = "\n".join(l for _ln, l in line_pairs)
        for iid in expand_id_refs(neut_text):
            if iid in items_by_id and iid not in fr.g1p02_idlines:
                fr.g1p02_idlines[iid] = {"kind": "mention", "lineno": 0,
                                        "avail": None, "via": "行号范围引用"}

    # ---- 关键词兜底：表单解析成功的文件不再做关键词（模板噪声）；
    # 其余所有有文本文件都做（含解析失败的表单、证据包、数据样例、未知文本）。----
    do_kw = (
        has_text
        and fr.cls != CLS_BINARY
        and not (fr.cls == CLS_G1P02 and parsed_g1p02)
        and not (fr.cls == CLS_G1P03 and parsed_g1p03)
        and ff.size <= KEYWORD_SCAN_MAX
    )
    if do_kw:
        neut_text = "\n".join(l for _ln, l in line_pairs)
        if tpl_snippets:
            neut_text = scrub_tpl_snippets(neut_text, tpl_snippets)
        fr.kw_hits = keyword_scan_file(neut_text, item_keywords, rule_keywords)

    # ---- PII 与格式异常：所有可解析文本都扫（含模板行，成本可忽略）----
    if has_text:
        fr.pii = scan_pii(ff.rel_path, text)
        fr.anomalies += scan_format_anomalies(text)

    fr.text = text if has_text else ""
    return fr


# ---------------------------------------------------------------------------
# 覆盖度聚合
# ---------------------------------------------------------------------------


def aggregate_coverage(files_reports: list, items: list, rules: list):
    item_ev = {it.iid: [] for it in items}
    rule_ev = {r.rid: [] for r in rules}

    for fr in files_reports:
        for iid, d in fr.g1p02.items():
            if iid in item_ev:
                item_ev[iid].append((d["status"], fr.rel_path, d.get("avail"), d.get("via", "")))
        for iid, d in fr.g1p02_idlines.items():
            if iid in item_ev:
                st = COVERED if d["kind"] == "row" else PARTIAL
                via = d.get("via") or f"ID行 L{d['lineno']}"
                item_ev[iid].append((st, fr.rel_path, d.get("avail"), via))
        for rid, d in fr.g1p03.items():
            if rid in rule_ev:
                st = cell_status_from_counts(d["filled"], d["total"])
                rule_ev[rid].append((st, fr.rel_path, f"{d['filled']}/{d['total']} 字段", d.get("via", "")))
        for key, hit in fr.kw_hits.items():
            if key in item_ev:
                item_ev[key].append((PARTIAL, fr.rel_path, None, f"关键词×{hit['n']}{'(强)' if hit['strong'] else ''}"))
            elif key in rule_ev:
                rule_ev[key].append((PARTIAL, fr.rel_path, None, f"关键词×{hit['n']}{'(强)' if hit['strong'] else ''}"))

    def finalize(ev_map):
        result = {}
        for key, evs in ev_map.items():
            best = MISSING
            for st, _p, _a, _v in evs:
                if STATUS_RANK[st] > STATUS_RANK[best]:
                    best = st
            srcs, avails, vias = [], None, []
            for st, path, avail, via in evs:
                if st != best:
                    continue
                if path not in srcs:
                    srcs.append(path)
                if avail and not avails:
                    avails = avail
                if via and via not in vias:
                    vias.append(via)
            result[key] = {"status": best, "sources": srcs, "avail": avails, "via": vias[:3]}
        return result

    return finalize(item_ev), finalize(rule_ev)


# ---------------------------------------------------------------------------
# 报告生成
# ---------------------------------------------------------------------------


def fmt_size(n: int) -> str:
    if n >= 1 << 20:
        return f"{n / (1 << 20):.1f}MB"
    if n >= 1 << 10:
        return f"{n / (1 << 10):.1f}KB"
    return f"{n}B"


def g_incomplete(g: dict) -> bool:
    return bool(g) and (g.get("six_total", 0) == 0 or len(g.get("six_done", [])) < g.get("six_total", 0))


def build_report(files_reports: list, zip_notes: list, warnings: list,
                 items: list, rules: list, item_cov: dict, rule_cov: dict,
                 generated_at: str) -> str:
    L = []
    ap = L.append
    n_files = len(files_reports)
    ap("# G1 回传接收报告（INTAKE-REPORT）")
    ap("")
    ap(f"- 生成时间：{generated_at}")
    ap("- 扫描目录：`returns/`（`docs/08-data/G1-ENTERPRISE-PACK/` 下，gitignore 私有区）")
    ap(f"- 文件总数：{n_files}；本报告属回传衍生物，不入库。")
    ap("")

    # ---- 1. 文件清单 ----
    ap("## 1. 文件清单")
    ap("")
    if files_reports:
        ap("| 文件 | 大小 | SHA-256(前12) | 分类 | 备注 |")
        ap("|---|---|---|---|---|")
        for fr in sorted(files_reports, key=lambda x: x.rel_path):
            note = (fr.note or "—").replace("|", "\\|")
            ap(f"| `{fr.rel_path}` | {fmt_size(fr.size)} | `{fr.sha256[:12]}` | {fr.cls} | {note} |")
    else:
        ap("（无文件）")
    ap("")

    if zip_notes:
        ap("### 压缩包处理")
        ap("")
        ap("| zip | 解压到 | 文件数 | 跳过可疑条目 |")
        ap("|---|---|---|---|")
        for rel, dest, n, skipped in zip_notes:
            n_disp = "已解压过" if n < 0 else str(n)
            ap(f"| `{rel}` | `{dest}/` | {n_disp} | {len(skipped)} |")
        ap("")
        ap("> zip 一律自动解压到 `returns/extracted/`（gitignore 内），不解压到仓库其他位置；"
           "extracted/ 内的嵌套 zip 不递归，列入人工分流。")
        ap("")
    if warnings:
        ap("### 扫描警告")
        ap("")
        for w in warnings:
            ap(f"- {w}")
        ap("")

    # ---- 2. 分类汇总 ----
    ap("## 2. 分类结果汇总")
    ap("")
    counts = {}
    for fr in files_reports:
        counts[fr.cls] = counts.get(fr.cls, 0) + 1
    if counts:
        ap("| 分类 | 数量 |")
        ap("|---|---|")
        known = [CLS_G1P02, CLS_G1P03, CLS_G1P05, CLS_DATA, CLS_PACK, CLS_ZIP, CLS_UNKNOWN, CLS_BINARY]
        for cls in known:
            if counts.get(cls):
                ap(f"| {cls} | {counts[cls]} |")
        for cls, n in counts.items():
            if cls not in known:
                ap(f"| {cls} | {n} |")
    else:
        ap("无文件。")
    ap("")

    # ---- 3. G1P-02 覆盖度 ----
    ap("## 3. G1P-02 数据可得性覆盖度")
    ap("")
    if items:
        sts = [item_cov[it.iid]["status"] for it in items]
        ap(f"**合计：已覆盖 {sts.count(COVERED)} / 部分覆盖 {sts.count(PARTIAL)} / 缺失 {sts.count(MISSING)}（共 {len(items)} 项）**")
        ap("")
        sections = []
        for it in items:
            key = re.split(r"[—\-]", it.group)[0].strip()[:16] or it.part
            if not sections or sections[-1][0] != key:
                sections.append((key, []))
            sections[-1][1].append(it)
        ap("| 小节 | 已覆盖 | 部分覆盖 | 缺失 |")
        ap("|---|---|---|---|")
        for key, its in sections:
            ss = [item_cov[i.iid]["status"] for i in its]
            ap(f"| {key} | {ss.count(COVERED)} | {ss.count(PARTIAL)} | {ss.count(MISSING)} |")
        ap("")
        ap("<details><summary>逐项明细（仅列已覆盖/部分覆盖项；缺失项见上表计数）</summary>")
        ap("")
        ap("| 编号 | 核实项 | 状态 | 可得性 | 来源 |")
        ap("|---|---|---|---|---|")
        for it in items:
            c = item_cov[it.iid]
            if c["status"] == MISSING:
                continue
            name = it.name.replace("|", "\\|")[:42]
            src = "; ".join(c["sources"][:2]).replace("|", "\\|")
            ap(f"| {it.iid} | {name} | {STATUS_ZH[c['status']]} | {c['avail'] or '—'} | {src} |")
        miss_ids = [it.iid for it in items if item_cov[it.iid]["status"] == MISSING]
        if miss_ids:
            ap("")
            ap(f"缺失项（{len(miss_ids)}）：`{'` `'.join(miss_ids)}`")
        ap("")
        ap("</details>")
        ap("")
    else:
        ap("⚠️ 未能解析 G1P-02 权威清单（表单文件缺失或结构变化），覆盖度统计不可用。")
        ap("")

    # ---- 4. G1P-03 覆盖度 ----
    ap("## 4. G1P-03 客户规则集覆盖度（G1C）")
    ap("")
    if rules:
        sts = [rule_cov[r.rid]["status"] for r in rules]
        ap(f"**合计：已覆盖 {sts.count(COVERED)} / 部分覆盖 {sts.count(PARTIAL)} / 缺失 {sts.count(MISSING)}（共 {len(rules)} 项）**")
        ap("")
        ap("| 规则 | 名称 | 状态 | 已填字段 | 来源 |")
        ap("|---|---|---|---|---|")
        for r in rules:
            c = rule_cov[r.rid]
            src = "; ".join(c["sources"][:2]).replace("|", "\\|")
            ap(f"| {r.rid} | {r.title[:20]} | {STATUS_ZH[c['status']]} | {c['avail'] or '—'} | {src} |")
        ap("")
        done_rules = [r.rid for r in rules if rule_cov[r.rid]["status"] == COVERED]
        ap(f"已确认规则：{', '.join(done_rules) if done_rules else '无'}")
        ap("")
    else:
        ap("⚠️ 未能解析 G1P-03 权威清单，覆盖度统计不可用。")
        ap("")

    # ---- 5. G1P-05 证据包完整度 ----
    ap("## 5. G1P-05 证据包完整度")
    ap("")
    ev_reports = [fr for fr in files_reports if fr.cls == CLS_G1P05 and fr.g1p05]
    if ev_reports:
        ap("| 文件 | 源名称 | 提交信息 | 六要件 | 字段字典行 | 缺口行 | 元数据 |")
        ap("|---|---|---|---|---|---|---|")
        for fr in ev_reports:
            g = fr.g1p05
            sub = f"{g['submit_filled']}/{g['submit_total']}" if g["submit_total"] else "—"
            six = f"{len(g['six_done'])}/{g['six_total']}（{','.join(REQ_LABELS.get(x, x) for x in g['six_done']) or '无'}）" if g["six_total"] else "—"
            meta = f"{g['meta_filled']}/{g['meta_total']}" if g["meta_total"] else "—"
            src = (g.get("src_name") or "—").replace("|", "\\|")[:30]
            ap(f"| `{fr.rel_path}` | {src} | {sub} | {six} | {g['dict_rows']} | {g['gap_rows']} | {meta} |")
        ap("")
    else:
        ap("无 G1P-05 结构证据包文件。数据样例文件见第 8 节。")
        ap("")

    # ---- 6. PII 核查 ----
    ap("## 6. PII 核查（SOP 4.3）")
    ap("")
    all_pii = [(fr.rel_path, ln, t, n) for fr in files_reports for ln, t, n in fr.pii]
    if all_pii:
        ap(f"**命中 {len(all_pii)} 处（按 文件+行号+类型 列出，不含原文）**")
        ap("")
        ap("| 文件 | 行号 | 类型 | 命中数 |")
        ap("|---|---|---|---|")
        for path, ln, t, n in all_pii:
            ap(f"| `{path}` | {ln} | {t} | {n} |")
        ap("")
        ap("> ⚠️ 命中项**不进入任何处理**：按 SOP 4.3 退回企业侧重导脱敏版本。")
        ap("> 本表只含位置与类型；原文请在 `returns/` 本地文件中人工核对。")
    else:
        ap("未检测到常见 PII 模式（邮箱/手机号/身份证号/疑似地址/客户级字段列）。")
        ap("> 注意：正则扫描是第一道筛查，不替代人工核查；xlsx/docx 为抽取文本扫描，行号对应抽取文本而非原文件。")
    ap("")

    # ---- 7. 格式异常 ----
    ap("## 7. 格式异常（日期/占位符/元数据）")
    ap("")
    anoms = [(fr.rel_path, ln, k) for fr in files_reports for ln, k in fr.anomalies]
    if anoms:
        ap("| 文件 | 行号 | 类型 |")
        ap("|---|---|---|")
        for path, ln, k in anoms[:200]:
            ap(f"| `{path}` | {ln} | {k} |")
        if len(anoms) > 200:
            ap(f"| … | … | 其余 {len(anoms) - 200} 条略 |")
        ap("")
    else:
        ap("未发现格式异常。")
        ap("")

    # ---- 8. 数据样例登记 ----
    ap("## 8. 数据样例登记（EVIDENCE-DATA）")
    ap("")
    data_reports = [fr for fr in files_reports if fr.cls == CLS_DATA]
    if data_reports:
        ap("以下文件判定为数据样例/报表导出，需并入对应 G1P-05 证据包并登记 snapshot 元数据：")
        ap("")
        ap("| 文件 | 大小 | SHA-256 | 命名规范 |")
        ap("|---|---|---|---|")
        for fr in data_reports:
            base = os.path.basename(fr.rel_path)
            naming = "符合" if re.match(r"(?i)^g1_[a-z0-9_]+?_\d{6}_\d+", base) else "不符 G1_<源>_YYYYMM_<序号>"
            ap(f"| `{fr.rel_path}` | {fmt_size(fr.size)} | `{fr.sha256}` | {naming} |")
        ap("")
        ap("> snapshot_hash 已给出（SHA-256 全值）；extracted_at/时间窗/字段字典需在 G1P-05 模板中补齐。")
    else:
        ap("无独立数据样例文件。")
        ap("")

    # ---- 9. 需人工分流 ----
    ap("## 9. 需人工分流清单")
    ap("")
    manual = [fr for fr in files_reports if fr.cls in (CLS_UNKNOWN, CLS_BINARY)]
    unparsed = [fr for fr in files_reports if fr.note and any(
        k in fr.note for k in ("未解析出", "超过", "读取失败", "解析失败", "不是有效 zip", "解压失败")
    )]
    manual_map = {fr.rel_path: fr for fr in manual}
    for fr in unparsed:
        manual_map.setdefault(fr.rel_path, fr)
    if manual_map:
        ap("| 文件 | 分类 | 原因 |")
        ap("|---|---|---|")
        for path in sorted(manual_map):
            fr = manual_map[path]
            reason = fr.note or ("无法识别的格式/内容" if fr.cls == CLS_UNKNOWN else "")
            if fr.cls == CLS_UNKNOWN and fr.why:
                reason = (reason + "；" if reason else "") + "；".join(fr.why[:3])
            ap(f"| `{path}` | {fr.cls} | {reason.replace('|', chr(92) + '|')} |")
        ap("")
    else:
        ap("无。")
        ap("")

    # ---- 10. 建议下一步动作 ----
    ap("## 10. 建议下一步动作")
    ap("")
    actions = []
    if n_files == 0:
        actions.append("`returns/` 为空或不存在——**等待企业回传**（SOP 4.1 收讫登记后再跑本脚本）。")
    else:
        if items:
            miss = sum(1 for it in items if item_cov[it.iid]["status"] == MISSING)
            part = sum(1 for it in items if item_cov[it.iid]["status"] == PARTIAL)
            cov = sum(1 for it in items if item_cov[it.iid]["status"] == COVERED)
            actions.append(f"G1P-02 可得性：已覆盖 {cov}/部分 {part}/缺失 {miss} → "
                           "按 BACKFILL-MAP.md 回填 `G1-DATA-REQUIREMENTS.md`；缺失项记入缺口台账并按 SOP 4.4③ 反馈补件。")
        if rules:
            rdone = [r.rid for r in rules if rule_cov[r.rid]["status"] == COVERED]
            if len(rdone) == len(rules):
                actions.append(f"G1C 规则集 {len(rdone)}/{len(rules)} 全部确认 → 可回填权限层【数】位"
                               "（SEMANTIC-PERMISSION-V01 PV-* 与场景契约阈值），并在 STATUS/契约评审记录标注。")
            else:
                actions.append(f"G1C 规则集已覆盖 {len(rdone)}/{len(rules)} → 未覆盖项按保守默认"
                               "（相关动作一律人工确认）继续推进，不阻塞其他层。")
        if all_pii_count(files_reports):
            actions.append(f"⚠️ PII 命中 → 按 SOP 4.3 退回企业侧重导脱敏版本，命中文件不进入任何处理流程。")
        if manual_map:
            actions.append(f"需人工分流 {len(manual_map)} 个文件 → 人工判定类型后归档或退回。")
        if data_reports:
            actions.append(f"数据样例 {len(data_reports)} 个 → 核对命名、登记 snapshot 元数据，"
                           "并入对应 G1P-05 证据包走六要件验收。")
        ev_incomplete = [fr for fr in ev_reports if g_incomplete(fr.g1p05)]
        if ev_incomplete:
            actions.append(f"证据包六要件未齐 {len(ev_incomplete)} 份 → 按第 5 节列出的缺项向企业补件。")
        actions.append("全部就绪后：按 BACKFILL-MAP.md 执行回填 → STATUS.md 记一行验收结论"
                       "（公开仓只写状态与计数，不写字段字典/报表原文）。")
    ap("")
    for i, a in enumerate(actions, 1):
        ap(f"{i}. {a}")
    ap("")
    ap("---")
    ap("*本报告含企业回传内容的定位信息（文件名/行号/分类），属私有衍生物；"
       "公开仓只允许引用结论与计数（SOP 4.5/§6 警告）。*")
    return "\n".join(L) + "\n"


def all_pii_count(files_reports: list) -> int:
    return sum(len(fr.pii) for fr in files_reports)


# ---------------------------------------------------------------------------
# 主流程
# ---------------------------------------------------------------------------


def run_intake(returns_dir: str):
    """执行完整管线。返回 (report_text|None, summary_dict)。"""
    generated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    summary = {"files": 0, "zips": 0, "warnings": []}

    items = load_g1p02_items()
    rules = load_g1p03_rules()
    tpl05 = load_g1p05_template()
    items_by_id = {it.iid: it for it in items}
    rules_by_rid = {r.rid: r for r in rules}
    item_keywords = {it.iid: it.keywords for it in items}
    rule_keywords = {r.rid: r.keywords for r in rules}
    tpl_snippets = build_tpl_snippets(items, rules, tpl05)

    if not os.path.isdir(returns_dir):
        return None, {**summary, "empty": True, "reason": f"目录不存在：{returns_dir}"}

    files, zip_notes, warnings = inventory_returns(returns_dir)
    summary["files"] = len(files)
    summary["zips"] = len(zip_notes)
    summary["warnings"] = warnings

    zip_dest = {rel: dest for rel, dest, _n, _s in zip_notes}
    file_reports = []
    for ff in files:
        fr = process_file(ff, items_by_id, rules_by_rid, tpl05, item_keywords,
                          rule_keywords, tpl_snippets)
        if ff.rel_path in zip_dest:
            fr.cls = CLS_ZIP
            fr.note = f"zip 已自动解压至 `{zip_dest[ff.rel_path]}/`，原始包不重复处理"
        file_reports.append(fr)

    item_cov, rule_cov = aggregate_coverage(file_reports, items, rules)

    if not files:
        return None, {**summary, "empty": True, "reason": "returns/ 为空"}

    report = build_report(file_reports, zip_notes, warnings, items, rules,
                          item_cov, rule_cov, generated_at)
    return report, summary


def write_report(returns_dir: str, report: str) -> str:
    os.makedirs(returns_dir, exist_ok=True)
    path = os.path.join(returns_dir, f"{REPORT_PREFIX}{datetime.now().strftime('%Y%m%d')}.md")
    with open(path, "w", encoding="utf-8") as f:
        f.write(report)
    return path


# ---------------------------------------------------------------------------
# --self-test：用 export/ 空白模板验证全流程不崩 + 覆盖度语义正确
# ---------------------------------------------------------------------------


def self_test() -> int:
    import shutil
    import tempfile

    print("== G1 intake self-test ==")
    ok = True

    # 用例 1：空目录 → 优雅退出
    with tempfile.TemporaryDirectory() as td:
        report, summary = run_intake(td)
        if report is None and summary.get("empty"):
            print(f"[PASS] 空目录优雅退出：{summary.get('reason')}")
        else:
            print(f"[FAIL] 空目录未按预期处理：{summary}")
            ok = False

    # 用例 2：export zip 放入 returns → 自动解压 → 空表单全缺失
    zips = [f for f in os.listdir(EXPORT_DIR) if f.endswith(".zip")] if os.path.isdir(EXPORT_DIR) else []
    if not zips:
        print(f"[FAIL] export/ 下无 zip 可用：{EXPORT_DIR}")
        return 1
    with tempfile.TemporaryDirectory() as td:
        ret = os.path.join(td, "returns")
        os.makedirs(ret)
        shutil.copy(os.path.join(EXPORT_DIR, zips[0]), os.path.join(ret, zips[0]))
        report, summary = run_intake(ret)
        if report is None:
            print(f"[FAIL] 自检运行未产出报告：{summary}")
            return 1

        checks = []
        checks.append(("zip 自动解压", "extracted/" in report or "解压到" in report))
        checks.append(("G1P-02 表单识别", "G1P-02 可得性表" in report))
        checks.append(("G1P-03 表单识别", "G1P-03 规则集" in report))
        checks.append(("G1P-05 表单识别", "G1P-05 证据包" in report))
        checks.append(("PII 无命中", "未检测到常见 PII 模式" in report))

        # 直接断言覆盖度对象（不依赖报告文本）
        items = load_g1p02_items()
        rules = load_g1p03_rules()
        files, _zn, _w = inventory_returns(ret)
        tpl05 = load_g1p05_template()
        items_by_id = {it.iid: it for it in items}
        rules_by_rid = {r.rid: r for r in rules}
        ikw = {it.iid: it.keywords for it in items}
        rkw = {r.rid: r.keywords for r in rules}
        snips = build_tpl_snippets(items, rules, tpl05)
        zip_dest = {rel: dest for rel, dest, _n, _s in _zn}
        frs = []
        for ff in files:
            fr = process_file(ff, items_by_id, rules_by_rid, tpl05, ikw, rkw, snips)
            if ff.rel_path in zip_dest:
                fr.cls = CLS_ZIP
            frs.append(fr)
        ic, rc = aggregate_coverage(frs, items, rules)
        n_cov = sum(1 for v in ic.values() if v["status"] == COVERED)
        n_part = sum(1 for v in ic.values() if v["status"] == PARTIAL)
        n_miss = sum(1 for v in ic.values() if v["status"] == MISSING)
        checks.append((f"G1P-02 覆盖度={n_cov}/{n_part}/{n_miss}（期望 0/0/{len(items)}）",
                       n_cov == 0 and n_part == 0 and n_miss == len(items)))
        rn_cov = sum(1 for v in rc.values() if v["status"] == COVERED)
        rn_part = sum(1 for v in rc.values() if v["status"] == PARTIAL)
        rn_miss = sum(1 for v in rc.values() if v["status"] == MISSING)
        checks.append((f"G1P-03 覆盖度={rn_cov}/{rn_part}/{rn_miss}（期望 0/?/{len(rules)}）",
                       rn_cov == 0 and rn_miss == len(rules)))
        total_pii = sum(len(fr.pii) for fr in frs)
        checks.append((f"PII 命中总数={total_pii}（期望 0）", total_pii == 0))

        for name, passed in checks:
            print(f"[{'PASS' if passed else 'FAIL'}] {name}")
            ok = ok and passed

        print("\n----- 生成的报告 -----")
        print(report)
        print("----- 报告结束 -----")

    print(f"\nSELF-TEST {'PASS' if ok else 'FAIL'}")
    return 0 if ok else 1


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------


def main() -> int:
    args = sys.argv[1:]
    if "--self-test" in args:
        return self_test()

    returns_dir = DEFAULT_RETURNS
    if "--returns-dir" in args:
        i = args.index("--returns-dir")
        if i + 1 >= len(args):
            print("错误：--returns-dir 需要路径参数", file=sys.stderr)
            return 2
        returns_dir = os.path.abspath(args[i + 1])

    report, summary = run_intake(returns_dir)
    if report is None:
        reason = summary.get("reason", "无可处理文件")
        print(f"G1 回传接收：{reason}")
        print(f"扫描目录：{returns_dir}")
        print("等待企业按 SEND-AND-RETURN-SOP §4 回传；收到文件后重跑本脚本。")
        return 0

    path = write_report(returns_dir, report)
    print(f"已生成报告：{path}")
    print(f"扫描文件 {summary.get('files', 0)} 个，zip {summary.get('zips', 0)} 个")
    for w in summary.get("warnings", []):
        print(f"  警告：{w}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
