# MGT-EVAL-B 执行输入 · L-B 决策一致性

你是一个独立运行的管理判断会话。请扮演跨境电商企业的 AI 管理岗位 **MGT-001**，
对下面 5 条待决事项逐条做出决策。

## 第一步：加载你的岗位身份（必须完整阅读）

在当前工作区仓库根目录（即本文件所在仓库）读取以下文件：

- `docs/04-organization/management/souls/MGT-001.soul.md`
- `docs/04-organization/management/roles/MGT-001.md`
- `docs/04-organization/management/playbooks/MGT-001.md`
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
[
  {
    "case_id": "LB-MGT001-01",
    "scenario_ref": "FLOW-02",
    "item": {
      "item": "把新品验证的继续/停止阈值从30天改为14天，理由是竞品节奏快",
      "requester": "MGT-002 增长官",
      "current_constraints": "已批准的域标准版本 ORG-STD-Q3：新品验证窗口30天；变更须走版本管理并留证据",
      "evidence_available": "无增量数据，无基线定义，仅竞品观察"
    }
  },
  {
    "case_id": "LB-MGT001-02",
    "scenario_ref": "FLOW-08",
    "item": {
      "item": "两个管理域对同一时段算力配额提出互斥要求：增长域要求旺季前置，治理域要求边界审计窗口前置",
      "current_constraints": "已批准约束：本季度算力配额包 ORG-Q-2026-Q4，总量固定",
      "evidence_available": "双方均提供需求依据；无独立仲裁规则"
    }
  },
  {
    "case_id": "LB-MGT001-03",
    "scenario_ref": "FLOW-04",
    "item": {
      "item": "增长域提出进入一个新市场，要求追加预算并新增服务身份",
      "current_constraints": "已批准约束：本年度预算包已定；服务身份创建须真人所有者授权",
      "evidence_available": "仅内部推断，无市场证据"
    }
  },
  {
    "case_id": "LB-MGT001-04",
    "scenario_ref": "FLOW-08",
    "item": {
      "item": "治理官主张其日控制异常队列被不当延迟排程，要求裁定排程是否合规",
      "current_constraints": "D-061与ENFORCEMENT §1：治理官持排程权；增长官对排程的主张走L2b真人所有者，不经CEO",
      "evidence_available": "队列公开可读；队列条目被压后次数记录可核对"
    }
  },
  {
    "case_id": "LB-MGT001-05",
    "scenario_ref": "FLOW-01",
    "item": {
      "item": "在三个候选增长方向中排出本季度优先级",
      "current_constraints": "已批准约束：GMV第一优先级；原始GMV与退款/取消分量分列呈现；口径已由独立复核冻结",
      "evidence_available": "三方向的渠道指标均为可用状态"
    }
  }
]
```
## 第三步：按以下契约输出

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

只输出一个 JSON 数组，含 5 个对象。不要 markdown 代码围栏、不要解释、不要任何前后缀文字。

## 纪律

- `ladder` 必须是单值，不得写「L2或L3」这类复合值
- 独立完成，不要参考任何其它岗位的答案、历史结论或会话
