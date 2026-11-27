# Agent Field Guide 融合方案：mas_router_method → 站点新轨

- **状态**: v0.1 基线（2026-11-27 全部决策确认，Q1–Q10 全按推荐）；**Phase A 已上线**（站点仓 `b520454`，构建 87 页：框架页 + F1–F4 四独立页发布，F5/F6 规划中，Playbook 五节点指针块已挂）
- **日期**: 2026-11-27
- **来源仓**: `github.com/zjgulai/mas_router_method`（公开，用户自有）
- **目标站**: Native-ai-organ（`/Users/pray/project/Sage_hub/Native-ai-organ/`）
- **关联**: `AGENT-PLAYBOOK-PLAN.md`（互补轨）、内部仓 `docs/00-project/STATUS.md`

---

## 0. 已确认决策（Q1–Q10）

| # | 决策 | 结论 |
|---|---|---|
| Q1 | 目的地/受众 | 混合：方法论公开蒸馏；产品解剖结构级公开+链回仓库；事故/eval 原始数据不搬运 |
| Q2 | 形态 | 混合：新轨 `agent-field` + 框架页第二参照系入口 + N1/N3/N5/N7/N8 生产参照指针块 |
| Q3 | 覆盖 | 策展精选 ~15-20 单元；产品代码只解剖 2-3 件（run-agent 单 loop / tool 契约 / capability-graph 路由） |
| Q4 | 与 P0-P8 关系 | 互补并列：P0-P8 = Agent 内部构造序；Field = 建 Agent 项目的过程序。不合并 |
| Q5 | 公开边界 | 见 §6 清单 |
| Q6 | docs/site 32 页 | 作为蒸馏素材源；原站作「原站入口」链出；不复制其页面结构 |
| Q7 | 命名/导航 | 轨名 `agent-field`；挂「读书笔记▾」Agent书组，与 Playbook 并列 |
| Q8 | 页面粒度 | 框架页 + 4 独立页 + 聚合页 ≈ 7-9 页（方案 C） |
| Q9 | 交付批次 | Phase A（框架+4 独立页+指针块）→ Phase B（聚合页+互链收尾+内部仓记录） |
| Q10 | 内部仓 | 仅加参照记录（STATUS/DEVELOPMENT 指向公开页），不搬内容 |

## 1. 素材定性

`mas_router_method` = **产品代码 + 编码进仓库的工程方法论**双层资产（616 文件，pnpm/turbo monorepo）：

- **产品层**：Recipe Engine（爆款视频→品牌 Recipe）+ Main agent（capability-graph 顾问，20 节点/17 路由/BM25/grounded answer）+ 双 surface（飞书 gateway + Next.js workbench）
- **方法论层**：`docs/from-zero.md`（决策杠杆排序）、`native-agent-dev` 六阶段门禁流、`docs/evals/` 评估纪律、10 ADR、ANB 七阶段+七检查+failure-atlas、`.claude/skills/` 选型笔记、`docs/site/` 32 页参考站

与 agent-playbook 轨的本质差异：**playbook 是教程蒸馏（二手·模式级），field 是一手生产证据（真实代码/ADR/事故/评测）**。教程给不出「决策怎么做、坑在哪、怎么验收」。

## 2. 定位：第二参照系

```
agent-playbook 轨                          agent-field 轨
─────────────────                          ──────────────
P0-P8 构建脊柱（依赖序）                     from-zero 决策杠杆序 + 六阶段门禁流
「Agent 内部怎么装」                        「建 Agent 的项目怎么跑」
N1-N10 节点页                              af-* 主题页
教程→蒸馏                                   生产仓库→蒸馏
```

两轨在框架页互链：playbook 框架页加「第二参照系：工程过程序」节；field 框架页声明与 P0-P8 的对象差异。

## 3. 站点结构

```
src/data/agent-field.json            轨注册表（镜像 agent-playbook.json）
src/data/agent-field/*.json          各页内容数据（page-doc 体裁，非节点 schema）
dist/agent-field/index.html          框架页
dist/agent-field/af-*.html           内容页（~6 页）
```

渲染：复用 `page-doc`/`article` 版式 + `nav_html()` 注册；不发明新组件。页面体裁为**方法论长文**（论点→证据→模式→边界），区别于 playbook 节点的「定位→模型边界→选型→坑」结构。

## 4. 页面清单（7 页）

| 页 | slug | 内容 | 独立/聚合 |
|---|---|---|---|
| 框架页 | `agent-field/index.html` | 定位声明（第二参照系）、与 P0-P8 关系图、单元地图、公开边界规则、原仓链接、docs/site 原站入口 | — |
| 决策杠杆序 | `af-order.html` | from-zero 十步序 + 「每步消除一个后续决定」原理 + 本仓反例（/init 先于结构的教训） | 独立 |
| 评估纪律 | `af-eval.html` | eval set is the spec；should_fail 全拒绝；确定性60%+rubric40%；eval→data→tool→prompt 分层归因；基线重录；「eval 通过是必要非充分」（pilot 改写率<30%） | 独立 |
| 失败图鉴 | `af-failures.html` | ANB 方法：七阶段（能判断是硬门）+ 七检查 + failure-atlas 六类信号；6 个真实事故 → **失败模式类**（预算检查恒假/护栏当崩溃通过/假 fixture/误认 @ 人） | 独立 |
| 编排实证 | `af-capgraph.html` | consult capability-graph 解剖：20 节点 17 路由、grounded answer 契约五段式、BM25+可选合成的分层、150 例评测集与盲审方法 | 独立 |
| 过程序 | `af-process.html` | native-agent-dev 六阶段门禁流（clarify→spec→tickets→build→eval→release，各阶段退出条件）+ ANB 七阶段对照（技术 builder vs 非技术 builder 两套流程的同构与差异） | 聚合 |
| 工程纪律 | `af-discipline.html` | ADR 精选（0001-0010 中 ~6 条：runtime 选型/schema 独占/failures-as-values/headless 权限/budget policy/persistence）+ 架构经验清单（ports-not-clients、allow-list 静默 no-op、modelUsage vs result.usage、settingSources[]、one-file loop） | 聚合 |

## 5. 蒸馏单元 → 页面映射（~18 单元）

| 单元 | 来源 | 落点 |
|---|---|---|
| from-zero 十步序 | `docs/from-zero.md` | af-order |
| 决策杠杆原理 | 同上 §「pattern behind the order」 | af-order |
| 六阶段门禁流 | `.claude/skills/native-agent-dev/SKILL.md` | af-process |
| 阶段退出条件表 | 同上 stages 表 | af-process |
| eval set is spec | `README.md`/`CLAUDE.md`/evals docs | af-eval |
| recipe-quality 门槛 | `docs/evals/recipe-quality.md` + PLAYBOOK §6 | af-eval |
| eval-triage 分层 | `.claude/skills/eval-triage` + SKILL-MAP §部署层 | af-eval |
| 基线与模型升级 | PLAYBOOK §6 基线条款 | af-eval |
| ANB 七阶段 | `ANB-README.md` | af-process（对照节）+ af-failures |
| ANB 七检查 | `ANB-README.md` checks 列表 | af-failures |
| failure-atlas | `docs/site/failure-atlas.html` + ANB 六事故 | af-failures |
| 机制可信≠产出可用 | ANB-README 证据节 | af-failures |
| capability-graph 结构 | `docs/product/main-agent-capability-graph.md` + `packages/consult/src/capability-graph.ts` | af-capgraph |
| grounded answer 契约 | README Main agent 节 | af-capgraph |
| 150 例评测+盲审 | `docs/evals/main-agent-*.md` | af-capgraph |
| ADR ×10 | `docs/adr/0001-0010` | af-discipline（精选 ~6） |
| 架构经验清单 | `CLAUDE.md` Architecture/SKD-configuration 节 | af-discipline |
| 双测试纪律 | `CLAUDE.md`「Two different kinds of test」 | af-eval + af-discipline 互见 |
| SKILL-MAP 选型笔记 | `SKILL-MAP.md` | af-discipline（「选型自觉」一节，含「网站列出但仓库不存在」等元教训） |

## 6. 公开边界规则（Q5 清单固化）

- **可公开**：方法论、ADR 决策与理由、架构模式、eval 方法论、失败模式类、capability-graph 结构
- **结构级+链回**：run-agent 单 loop、tool 契约、路由图——讲模式+指源码，不贴大段实现
- **不搬运**：eval 原始数据/分数、飞书租户细节、seed 品牌数据、deploy 配置、事故业务上下文（只提炼模式类）
- **引用规范**：所有一手事实标注 `mas_router_method@<commit>` + 文件路径；站点文风为原创中文蒸馏（沿用 playbook 惯例）

## 7. 站点集成

1. **注册表**：`src/data/agent-field.json` + `src/site_data.py` 加载器（镜像 playbook）
2. **导航**：`nav_html()` 读书笔记▾ → Agent书组，「Playbook」后加「Field Guide」→ `agent-field/index.html`；7 页 current 键注册
3. **互链**:
   - playbook `agent-playbook/index.html` 框架页加「第二参照系」节 → field 框架页
   - playbook 节点 **N1/N3/N5/N7/N8** 各加「生产参照」指针块（1-2 行+链接，不改节点 schema，加在 map 块后）
   - field 各页回链对应 playbook 节点（pager 或文末「对照」行）
   - `sitemap.html` 板块矩阵 + `site.js` 搜索索引同步
4. **内部仓**:Phase B 时 `STATUS.md`/`DEVELOPMENT.md` 加一条参照记录

## 8. 版本跟踪

仓为 git 公开仓，演进活跃（Main agent 2026-10-29 新增）。轻量方案：

- 方案文档与 field 数据文件头部记录蒸馏基线 commit sha
- 例行检查：`git ls-remote https://github.com/zjgulai/mas_router_method.git HEAD` 比对 sha；漂移时按 §5 单元映射增量更新
- 不建 fetch/parse 管线（内容是方法论文档非结构化章节，人工蒸馏质量优先）

## 9. 交付批次

**Phase A**：轨基建（注册表+加载器+导航+sitemap）→ 框架页 → af-order / af-eval / af-failures / af-capgraph 四独立页 → playbook 5 节点指针块 → 构建+线上验证

**Phase B**:af-process + af-discipline 两聚合页 → 框架页第二参照系完善 → field↔playbook 全量互链 → 内部仓参照记录 → 提交推送

## 10. 风险

| 风险 | 缓解 |
|---|---|
| 单源仓演进快，蒸馏内容漂移 | §8 commit-sha 例行检查 |
| 仓库转私有/改许可导致链接失效 | 蒸馏内容为原创中文，不依赖链接存活；链接失效时降级为纯文本引用 |
| ANB「75% 重合 Session_Agent」等自报数据 | 标注「作者自报+原仓链接」，不当独立验证事实 |
| 方法论与 playbook 轨读者预期冲突（教程 vs 生产） | 框架页显式声明互补关系与适用读者 |
| 蒸馏量≈playbook 全量，工期长 | Phase A 先行交付核心 5 页，Phase B 收尾 |

## 11. 待办（方案批准后）

1. 升 v0.1 基线 + DECISIONS.md 录 D-083
2. Phase A 实施
