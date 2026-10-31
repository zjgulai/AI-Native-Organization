---
title: 项目记忆与知识图谱建设方案及执行票据
doc_type: architecture
module: project-memory
topic: memory-and-knowledge-graph
status: draft
created: 2026-10-31
updated: 2026-10-31
owner: self
source: human+ai
---

# 项目记忆与知识图谱建设方案及执行票据
## 1. 决策摘要与边界

> **审批状态（2026-10-31）**：D-01~D-07 全部批准，Phase 0（MKG-00..MKG-03）已授权执行。Phase 1（任何 nmem 写入）仍未授权。
### 1.1 五个核心决定
1. **建薄覆盖层与可再生派生视图，不建第二套手工图。** 现有 `organization-graph.json`、`collaboration-graph.json`、`agent-management-graph.json`、`agent-lifecycle.json`、`role-catalog.json`、`e2e-value-streams.json`、`case-record-contract.json` 已是带稳定 ID 的图。新增正式资产只有两份：约 20 条判断记录的覆盖层，以及由脚本从源 JSON 重新生成的岗位视图（81 个节点、417 条边，带源文件哈希）。不复制实体正文，不手工维护 700+ 条已存在的边，不建 250 个悬空契约节点。
2. **先证明消费价值，再建 nmem 空间。** Phase 0 在仓库侧完成覆盖层、resolver、岗位视图、岗位上下文装配器和 5 份上下文包回放。bundle 不能证明“岗位边界一次装配完成”，就停在 MKG-03，不创建 nmem Space、不写任何记忆。
3. **记忆只存判断、边界、指针。** 16 条种子全部使用确定性 `logical_key`，每条固定包含判断、边界、稳定来源锚点、摘录哈希、标签、`as_of`。50 份 Role/Soul/Playbook/Preset、视觉登记册、`dist/` 投影、BP 数字不进入记忆正文。
4. **nmem 写入必须先隔离。** 本机 nmem 是共享活库，2026-10-31 快照已有 7 个 Space，图是单库全局，自动抽取无完整回滚。Phase 1 前必须证明存在独立 server/data root 或等价的隔离副本；证明不了就停在 repo-only。这是不可跳过的前置条件，不是建议。
5. **SOP 验收不自行降级。** 8 条 checklist 逐条判定“满足 / 有意偏离 / 不适用”；任何替代标准都要在 §7.4 列明并由用户批准。检索不接受“无命中也算降级通过”；commit 在项目规则下延后，且不计入通过。

### 1.2 对三份候选方案的合成取舍
| 候选方案 | 采纳 | 不采纳 |
|---|---|---|
| decision-ledger | 决策/证据/门禁为核心；`status/boundary/source/as_of` 四要素；L1/L3 种子主体；门禁证据链 | 350-400 节点全量账本作为 Phase 1；独立 Assertion 节点体系；110-120 条记忆的首期规模 |
| role-ontology | 岗位上下文包；命名空间隔离；repo 权威图 + nmem 投影两层结构 | 983 节点/1800 边全量生成；23 个 objectTypes 起步；把精确图只押在 nmem 上 |
| reuse-index | 不重建已有 JSON 图；薄覆盖层；禁止重复建设清单；nmem 仅作派生视图 | 只做覆盖层而缺少消费方；把“索引”当成“记忆系统” |
| 共同拒绝 | 全量文档 RAG；手工实体图承诺；生成物/视觉登记册灌入记忆；新增 MKG 阶段门；把设计态写成运行态 | — |

### 1.3 明确边界
- 本方案的 nmem Space 是**项目设计知识空间**，不是 ADR-0009 / D-028 定义的 Case 运行时 Memory Store，也不是经营事实来源。记忆不能作为资产动作、权限、预算或对外承诺的授权依据。
- 当前全部运行实例为 0：`case_instances=0`、`resource_reservations=0`、`service_identities=0`、Role Release Bundle 0、50 个 Preset 均为 `design_only_not_importable`、`production_authorized=false`。这些状态字段原样保留，不得改写成“已完成/已上线”。
- 不触碰 Shopify、DSH、Amazon、企业系统、MCP 工具、GitHub Pages。不创建 Case、Bundle、Service Identity、Policy Gate、Execution Broker、Action Intent。
- 不写 `default`、`sage`、`voc-agent`、`paper2skills`、`mas-router-method`、`mkt53`、`lute-starlink` 任一既有 Space。
- Library 只收 7 份脱敏摘要，不整份收录 `FACTS.md`、`STATUS.md` 或任何含企业规模、渠道占比、店铺数、SKU、员工数的原文。
- 本方案只定义，不执行任何写入。所有仓库写入与 nmem 写入列在第 7 节，逐项待授权。

### 1.4 产品落地路径
| 阶段 | 范围 | 交付物 | 停止条件 |
|---|---|---|---|
| Phase 0 仓库侧 | MKG-00..MKG-03，MKG-01R 可选 | 20 条覆盖层、resolver、岗位视图、岗位上下文装配器、5 份上下文包回放 | 任一岗位上下文包缺 3 个以上必填字段，或 verifier 无法通过 → 停止，不建 nmem |
| Phase 1 nmem MVP | MKG-04..MKG-10 | 隔离库证明、1 个 Space、1 个身份、5 条规则、1 份 WM、7 份脱敏 Library、15+11 ontology、16 条记忆、1 个 recall 包装、1 套单测 | 隔离证明失败、3 条 probe 出现跨 Space 边/错误运行边/状态 token 被改写、检索硬阈值未达 → 停止或判失败 |
| Phase 2 全量账本 | 暂不拆票 | 77 个 D + 15 个 ADR + 门禁证据 + 开放票据，约 110-120 条记忆 | 仅在 MKG-11 给出 go 决定后启动 |

Phase 0 + Phase 1 预计 8-12 人天（推断，含评审）。记忆与图谱不直接产生 GMV；它降低方案交付、审计、岗位上下文装配和跨文档问答的成本，不得写成经营结果。

---

## 2. 产品依据与证据分级
### 2.1 当前产品是什么
| 含义 | 内容 | 不是 |
|---|---|---|
| 项目交付物 | 方案文档 + PRD + 结构化设计资产 + 静态 Site + 对外 BP/实施蓝图 | 不是 Shopify 店铺 |
| 商业化产品 | 岗位契约体系 + 模型外控制层 + 验证门禁 + 跨境电商 50 岗位行业包 | 不是已上线 SaaS；BP 金额全部是假设 |
| 价值流产品方案 | 12 条流的经营闭环名称，如“存量GMV联营舱”“新品证据工厂” | 不是已发布软件 |
| Shopify 店铺 | 客户未来经营对象与首个试点渠道 | 当前 0 连接、0 App、0 商品、0 订单 |

### 2.2 为什么这个产品需要记忆与图谱
项目的稀缺资产不是 266 份 Markdown，而是 50 个 AGT 岗位 × 5 类契约 × 12 条价值流 × 20 个候选场景 × 八阶段 × 15 类产物，加上 77 条决定、15 份 ADR 和门禁证据链。这些内容分散在 7 个岗位登记处、6 个以上门禁文档和 84 个 `docs/` JSON 中；单次查询至少要读 5 个文件。记忆层的价值是让岗位边界、契约引用、流/场景/阶段、决策依据、门禁状态可寻址、可审计、可交接；图谱层的价值是让跨文件关系一次定位。它不是文档搜索的替代品。

### 2.3 证据分级
| 标记 | 含义 | 用法 |
|---|---|---|
| [事实] | 可由文件行号、命令输出或官方资料核验 | 直接陈述，附指针 |
| [推断] | 基于事实的逻辑判断 | 明确写“推断”，不写成事实 |
| [建议] | 本方案的选择 | 需用户确认后才执行 |
| [未知] | 未验证或证据不足 | 写 `unknown`，不猜 |
| [待授权] | 需要用户逐项批准的写入 | 不执行 |

### 2.4 SOP 来源声明
[事实] **SOP 正文已由用户在 2026-10-31 会话中以纯文本形式提供并确认**，标题为《智能体记忆系统与知识图谱构建标准化操作规程 (SOP)》v2.0，制定日期 2026-10-26。工作副本 `/tmp/sop_v2.md` 为 299 行、10,752 字符。以 15 处特征串逐条比对（"实体聚合与高频打标"、"207 家核心决策媒体人脉画像"、`traffic_tier1`、MIME 解析陷阱、`application/octet-stream`、`坑位库.markdown`、`recall_durable_memories`、`⌘ + 5`、"8 条硬标准"、"决策优先级绝对遵从"、"认知金字塔四层赋权模型"、"读写自闭环"、`test_<agent>_nmem_recall.py` 等），用户提供正文与 nmem 线程 `claude-code-806264e8-4d01-4ac5-868c-4bccb526835e`（Space `mas-router-method`）第 3 条消息的正文一致，比对命中 13/15（未命中的 2 条系措辞差异，非内容缺失）。SOP 依据由此从"待确认"升级为已确认。

[事实] 原始附件 `/Users/pray/project/Sage_hub/AI组织变革/.lody/attachments/a68ddea1-SOP_Nowledge_Mem_智能体记忆系统与知识图谱构建规范.md` 为 20,783 字节加密/压缩二进制，`file` 判定为 `data`（magic `887d1c9c`），zstd 与 UTF-16 均解码失败，SHA-256 `32793ef943df647a8118911f12fee1a42f9bbebeb8eaa3f6f7413fd1384891ed`。附件字节本身仍不可解析；本方案的 SOP 依据来自用户提供的正文，不是附件。

[事实] 因此 SOP 六步法、四层金字塔、8 条验收 checklist、`unit_type` 枚举约束、MIME 后缀规避、3 秒超时降级，均按已确认正文执行，不再作为"结构参考"。

---

## 3. 现状盘点
### 3.1 资产规模
| 类别 | 数量 | 说明 |
|---|---:|---|
| Markdown | 266 | 21,400 行；含 `.lody` 附件 1 份，剔除点目录后 264 份 / 21,149 行 |
| JSON | 91 | 164,299 行；`docs/` 84 份 / 158,090 行，`dist/data` 5 份，工具配置 2 份 |
| HTML | 6 | 7,442 行 |
| AGT 岗位 | 50 | AGT-001..050，连续无缺号；AGT-051..102 是视觉候选源人物，不是岗位 |
| MGT 决策身份 | 3 | MGT-001..003 |
| 岗位设计文件 | 200 | 50 ×（Role + Soul + Playbook + Preset）；MGT 另有 12 份 |
| Skill 描述符 | 151 | 49 岗 × 3 + AGT-002 × 4 |
| 价值流 | 12 | 8 条 BVS + 4 条 CVS |
| FLOW / SCN / STG | 8 / 20 / 8 | 场景为候选；阶段未实例化；flow-stage 绑定 64 条 |
| ART / REC | 15 / 18 | 设计契约，非可执行 schema |
| 决定 / ADR / EVD | 77 / 15 / 39 | EVD-029 重复用于两处 |
| 运行实例 | 0 | Case/Bundle/ServiceIdentity/资源预留全 0 |

### 3.2 已有“图”与知识图谱的区别
现有 9 类结构化资产是**组织、协同、生命周期与契约的设计图**，不是实体-关系知识图谱：

- `organization-graph.json`：4 个平面、8 个责任域、50 个岗位、100 条边、9 条跨平面契约；`collaboration-graph.json`：11 个组件、15 类产物、8 条流、20 个场景、338 条类型化边，`direct_role_to_role_edges=0`。
- `agent-management-graph.json`：5 类契约、8 个治理组件、50 个岗位绑定、257 条边；250 条 `required_ref` 未解析，仓库内 0 个独立契约文件；`agent-lifecycle.json`：7 个状态、11 条转换，50 个岗位全部 `not_instantiated`。
- `role-catalog.json`：50 个岗位、151 个 Skill 描述符、200 条 `collaborates_with`、140 条 flow 引用、127 条 scenario 引用；`e2e-value-streams.json`：2 个家族、12 条流，BVS 与 FLOW-01..08 1:1，CVS 不在四个核心图中。
- `case-record-contract.json`：18 种记录类型、39 条不变量，`design_not_executable_schema`；`role-playbooks/index.json`、`preset-blueprints/manifest.json` 是生成索引，不是权威源。
- 视觉登记册 G1-G6：资产元数据与发行证据，不是知识图谱。

### 3.3 nmem 实测能力
| 项 | 实测 |
|---|---|
| 版本/模式 | 0.10.111，`local`，graph store `healthy`，embedding `local-gguf` 未降级 |
| Spaces | 2026-10-31 13:14 快照 7 个：Default 383/278、Sage 197/164、VOC 60/3、paper2skills 10/0、MAS Router 15/1、mkt53 15/0、lute-starlink 27/1（活库，计数会漂移） |
| 本项目 Space | 无 |
| 本项目记忆 | 0 |
| 本项目线程 | 1 条：`claude-code-815abb54-6f15-4208-b929-27974bfbc589`，Space `default`，10 条消息 |
| 实体创建 | 无 `entity create`；实体是自动抽取产物；`entities` 只有 aliases/repair/delete/merge |
| 图作用域 | 单库全局；节点带 `metadata.space_id`；`graph expand` 无 Space 过滤 |
| Ontology | space 定义优先、global fallback，不是 additive；`ontology apply` 需 `--scope space --space-id`，patch schema 未验证 |
| 检索 | BM25+向量；跨项目噪声可排到 0.8+；`total` 随 `-n` 变化，命中数不是覆盖率 |
| 隔离能力 | `nmem serve` 只暴露 host/port；无文档化 `--data-dir`；`reconcile-roots` 证明多本地库存在，但独立数据根的具体方法 [未知] |

### 3.4 已知漂移（行号为 2026-10-31 快照，不写入记忆正文）
| # | 漂移 | 权威修正 |
|---|---|---|
| 1 | `STATUS.md:144`、`ADR-0014:3`、`management/README.md:3,52-54` 仍写 MGT-Q1/Q2/Q3 待确认；`DECISIONS.md:112` 仍描述 ADR-0014 为“1 个 CEO + 8 个二级负责人” | D-065 已关闭；`DECISIONS.md:71,116`；ADR-0014 正文为 v2 1+2，决策阶梯为六级 |
| 2 | `README.md:164`、`DEVELOPMENT.md:17` 写 ADR-0001..0012 | 实际 15 份，ADR-0001..0015 |
| 3 | `STATUS.md:142` 仍用 `df37941c` / Pages `35258440062` | D-077：`abfd1733` / `35910354396`；旧值只作第二次发布历史 |
| 4 | 实施蓝图称 PILOT“未启动”；BVS-01 称 PILOT-G0“部分通过”；实施蓝图门禁索引缺 VIS-G0..G6 | 区分“门未正式启动”与“范围合同部分确认”；`SANBAO-VISUAL-IDENTITY-ASSET-PLAN.md:219-225` |
| 5 | `MANAGEMENT-LAYER.md:52` 写 MGT-003 覆盖 19 岗 | 同文 `:79` 与 `management-catalog.json` 为 12 岗 |

7 类漂移（上表合并为 5 行）由覆盖层 8 条 `corrections` 记录；MKG-01 只登记、不改源文档。源文档正文修正另立 MKG-01R，单独授权，不阻塞 Phase 0。

### 3.5 门禁快照 as_of 2026-10-31
| 门族 | 当前状态 |
|---|---|
| SHOP-G0..G7 | 停在 SHOP-G1；SGF-10 待最终审阅；G2..G7 未开始 |
| ORG-G0..G5 / MGT-EVAL-* | 停在 ORG-G1；MGT-EVAL-B 4/6=66.7%，阈值 100%，未通过；A/C/R0/R2 未执行；G0/G2/G4/G5 无逐门定义 |
| PILOT-G0..G4 | G0 范围部分确认、门未正式通过；G1..G4 未启动 |
| VIS-G0..G6 / RP-G0..G8 / RP-M0..M7 | VIS 全部完成，G6 公开发行 `VIR-SANBAO-WEB-2026-09-24-R1`；RP-G0 静态盘点完成、RP-M2 完成、RP-M1 部分，G1..G8 与 M3..M7 未完成 |

---

## 4. 记忆分层与种子清单
### 4.1 分层规则
| 层 | importance | unit_type | 条数 | 内容 |
|---|---:|---|---:|---|
| L1 核心准则 | 1.0 | decision | 5 | 证据边界、权威源、岗位契约、无运行边、Case/门禁 |
| L2 业务口径 | 0.9 | fact | 6 | 命名空间、计数口径、五加一契约、流/场景/阶段、门禁快照、目标态 HOLD |
| L3 避坑实证 | 0.85 | learning | 3 | 文档漂移、来源注册缺口、生成物与权威源 |
| L4 沉淀纪要 | 0.70-0.85 | context / learning | 2 | 岗位上下文包、产品叙事 |

`unit_type` 只使用合法枚举：`fact/preference/decision/plan/procedure/learning/context/event`。L4 的 SOP 映射是 `context` 或 `learning`；第 15 条使用 `procedure` 是对 L4 的显式扩展，importance 降到 0.8，理由是该条是可执行装配步骤而非业务口径。稳定事实用 `--when timeless`；门禁快照用 `--when present`，正文与标签写 `as_of: 2026-10-31`，并设 `stale_after: 30d`。

### 4.2 16 条种子
| # | logical_key | type / imp | labels | 正文要点 | 来源（稳定锚点） |
|---:|---|---|---|---|---|
| 1 | `aiorg.l1.evidence-boundary` | decision / 1.0 | identity, redline, boundary | 设计、静态发布、视觉绑定、Preset 蓝图均不等于平台导入、生产授权或经营结果；建议、沉默、超时不是批准；状态 token 原样保留 | `README.md#本轮交付边界`；`AGENTS.md#任务与当前边界`；`DECISIONS.md` D-020/D-052 |
| 2 | `aiorg.l1.source-of-truth` | decision / 1.0 | identity, caliber, source | 权威源路由：岗位 role-catalog；组织 organization-graph；契约 agent-management-graph；流程 collaboration-graph；决策 DECISIONS；状态 STATUS；`dist/` 只是投影 | `DEVELOPMENT.md#信息归属`；`.github/workflows/pages.yml` |
| 3 | `aiorg.l1.role-contract-primacy` | decision / 1.0 | identity, decision, contract | 50 个独立可寻址 AI 岗位分身；五契约版本化、不可变 Bundle；单 Case Agent；模型只出 Action Intent。D-053 仅替代 D-020 的“岗位不形成运行 Agent 身份”语义；保留五契约、不可变 Bundle、Action Intent→Policy Gate→Execution Broker、产物门禁、凭据隔离 | `DECISIONS.md` D-020/D-053；ADR-0004/0010/0012 |
| 4 | `aiorg.l1.no-runtime-role-edges` | decision / 1.0 | identity, redline, boundary | 岗位间 0 运行边；`collaborates_with` 只是声明；MGT 不进 Case；视觉绑定不授予权限；组队只由模型外 Case Control 编排 | `collaboration-graph.json#coverage`；`role-catalog.json#roles`；`AI-ORGANIZATION-MAP.md` |
| 5 | `aiorg.l1.case-and-gate-namespace` | decision / 1.0 | identity, decision, gate | 一张 Case 只绑定一条主价值流和一个主场景；八阶段产物门禁；门禁必须带族名前缀，禁止裸 G1/G2 | `DECISIONS.md` D-024/D-025；ADR-0006/0007 |
| 6 | `aiorg.l2.id-namespaces` | fact / 0.9 | caliber, namespace, counting | 项目岗位仅 AGT-001..050；管理身份 MGT-001..003；Sanbao 视觉目录 AGT-001..102，其中 AGT-051..102 是源人物；3 条 MGT 视觉绑定为 AGT-067/090/056；53 视觉身份=50+3 | `role-catalog.json#role_count`；`management-catalog.json#role_count`；`dist/data/visual-identities.json#counts` |
| 7 | `aiorg.l2.counts-not-interchangeable` | fact / 0.9 | caliber, counting, status | 50 岗位类型≠运行实例；250 契约引用≠契约文件；151 Skill 描述符≠API；50 Preset≠可导入配置；Case/Bundle/ServiceIdentity/资源预留=0 | `agent-management-graph.json#required_ref`；`collaboration-graph.json#runtime_instantiation`；`manifest.json#summary` |
| 8 | `aiorg.l2.contract-five-plus-one` | fact / 0.9 | caliber, contract, decision | 五类契约 Business/Skill/Runtime/Access/Assurance；250 条 `required_ref` 未解析；D-065 已决定 MDC/GOC 为第六类，但 `contract_types` 仍只有 5 类 | `agent-management-graph.json#contract_types`；`DECISIONS.md` D-065 |
| 9 | `aiorg.l2.flow-scenario-stage` | fact / 0.9 | caliber, flow, scenario | 12 流=8 BVS+4 CVS；8 FLOW；20 候选 SCN；8 STG；15 ART；18 REC；64 flow-stage 与 51 flow-scenario 均未实例化；BVS-06/08、CVS-03/04 有别名 | `e2e-value-streams.json#streams`；`collaboration-graph.json#flows/#scenarios/#protocol` |
| 10 | `aiorg.l2.gate-snapshot` | fact / 0.9 | caliber, gate, status | as_of 2026-10-31：SHOP-G1；ORG-G1（MGT-EVAL-B 4/6 未过）；PILOT-G0 范围部分确认；VIS-G6 完成；RP-G0/M2 完成；其余未启动；超过 30 天必须回读 STATUS | `STATUS.md#当前待决定`；`SHADOW-VERIFICATION.md`；`SANBAO-VISUAL-IDENTITY-ASSET-PLAN.md`；`ROLE-PRESET-IMPLEMENTATION-TODO.md` |
| 11 | `aiorg.l2.target-state-holds` | fact / 0.9 | caliber, target-state, boundary | Shopify 空白新店目标态 `HOLD_NO_PUBLISHED_PRODUCTS`；空数组≠业务零值；DSH 50 Preset=`design_only_not_importable`；目标版本/schema/服务身份未核实 | `bvs-01-shopify-dtc-data-contract.json#target_state`；`sku-scope-manifest.json`；`manifest.json#status` |
| 12 | `aiorg.l3.known-drift` | learning / 0.85 | pitfall, drift, source | 7 类已知漂移；引用前以 DECISIONS 当前行为准；过时文本必须标 `stale`；不得用 `file:line` 作为记忆指针 | §3.4 漂移表；`DECISIONS.md#用户已经明确的方向` |
| 13 | `aiorg.l3.source-registry-gap` | learning / 0.85 | pitfall, evidence, source | `SOURCES.md` 是人工 Markdown 表；EVD-001..039 中 EVD-029 重复；入库前需 sidecar 化并拆分 | `SOURCES.md#来源索引` |
| 14 | `aiorg.l3.generated-vs-authoritative` | learning / 0.85 | pitfall, generated, source | 150 份岗位 MD + 51 份 JSON 由 `build-role-assets.mjs` 生成；`dist/data` 三份无生成器；Pages 只校验两份 HTML 副本 | `DEVELOPMENT.md#Site投影规则`；`scripts/build-role-assets.mjs`；`.github/workflows/pages.yml` |
| 15 | `aiorg.l4.role-context-bundle` | procedure / 0.8 | procedure, bundle, handoff | 岗位上下文装配顺序；缺字段返回 `INCOMPLETE` 并列出缺失项；不推断补齐；装配器 `scripts/role-context-bundle.mjs` | `role-catalog.json#roles`；`role-playbooks/index.json`；`preset-blueprints/manifest.json`；`DECISIONS.md` D-053 |
| 16 | `aiorg.l4.product-narrative` | context / 0.75 | history, narrative, product | 当前产品是设计与证据资产包 + 静态门户，不是已上线 SaaS；产品有四义；BP 金额全部是假设 | `README.md`（首节）；`DEVELOPMENT.md#项目性质`；`SOLUTION-MAP.md`；`BP-ECONOMIC-MODEL.md` |

### 4.3 写入与排除规则
- 每条种子必须带：`logical_key`、`unit_type`、`importance`、`labels`、正文、`source_ref`（路径 + 章节锚点或 D/ADR/EVD 编号）、`source_excerpt_sha256`、`boundary`、`as_of`、`source_status`；易变状态另带 `stale_after`。
- 正文 ≤500 字；数字必须带分母和口径；`production_authorized=false`、`NOT_OBSERVED`、`design_only_not_importable`、`HOLD_*`、`case_instances=0` 原样保留。
- 引用工作区未提交内容时标 `source_status=working_tree_uncommitted`。当前 `README.md` 有未提交修改、`playbook.md` 未跟踪；16 条种子不依赖未提交的 `README.md` 行号，涉及 README 的种子改用已提交章节或 `AGENTS.md`。
- 不入记忆：50 份 Role/Soul/Playbook/Preset 全文；视觉 G2-G6 登记册；`dist/data` 三份投影；BP 数字；`collaborates_with` 200 条声明；企业私有数据、凭据、客户/员工明细。
- 不使用裸 `file:line` 作为长期指针；`file:line` 只允许出现在本次盘点证据与漂移表中，并在下一次修订时重算。

---

## 5. 知识图谱设计
### 5.1 四层结构
本方案按 SOP 的四维治理组织：Space 隔离、认知金字塔、本体实体网、读写自闭环。落到本项目是以下四层：
1. **源层（不变）**：现有 91 个 JSON 和 266 份 Markdown。实体正文、计数、状态、全部边留在原文件。
2. **覆盖层（新增判断记录）**：`docs/09-governance/knowledge-graph/ai-org-knowledge-overlay.json`，约 15-20 KB，只含 `corrections` 8 条、`supersedes` 6 条、`forbidden_edges` 6 条，共 20 条。所有记录带 `runtime=false`、`grants_authorization=false`。
3. **岗位派生视图（可再生成）**：`ai-org-role-view.json`，由 `scripts/build-role-knowledge-view.mjs` 从 `role-catalog.json`、`organization-graph.json`、`management-catalog.json`、`e2e-value-streams.json`、`collaboration-graph.json` 生成。50 个岗位 + 3 个管理身份 + 8 条流 + 20 个场景 = 81 个节点；417 条边；带每个源文件的 SHA-256。它不是手工维护资产，每次源文件变化后重跑。
4. **nmem 视图（派生，非权威）**：16 条记忆 + space ontology + 自动抽取的实体/关系。用于检索，不用于事实判定。

运行时读取顺序：先 repo 覆盖层、岗位视图与源文件，再 nmem 记忆。两者冲突时以覆盖层和源文件为准。

### 5.2 覆盖层 schema 与记录量
| 字段 | 内容 | 数量 |
|---|---|---:|
| `corrections` | 已知漂移与权威指针，逐条带 `claim_ref`、`claim_excerpt_sha256`、`corrected_by`、`evidence`、`status` | 8 |
| `supersedes` | 决定/ADR 替代链，逐条带 `superseded_clause`、`retained_clause`、`scope` | 6 |
| `forbidden_edges` | 明确禁止生成的节点/边类型 | 6 |
| 合计 | | 20 |

`routes` 16 条、`aliases` 4 条、`source_personas` 3 条、16 条记忆指针、门禁快照、岗位上下文 recipe 不进入覆盖层正文：routes/aliases 作为 `scripts/knowledge-overlay.mjs` 的常量并由 verifier 对照 `DEVELOPMENT.md#信息归属`；source_personas 从 G1 登记册的 `source_persona_id` 派生；记忆指针由 `scripts/mkg-seed-plan.mjs` 生成；门禁快照在查询时回读 `STATUS.md`；recipe 就是装配器脚本。这样避免“第三份过时副本”。

### 5.3 类型路由
| ID 模式 | entity_type | canonical_source | join / status |
|---|---|---|---|
| `^D-\d{3}$` / `^ADR-\d{4}$` | Decision / ADR | `DECISIONS.md` / `docs/adr/*.md` | DECISIONS、STATUS；ADR 状态行可能过时 |
| `^AGT-0(0[1-9]|[1-4]\d|50)$` | ProjectRole | `role-catalog.json` | organization-graph、agent-management-graph、agent-lifecycle、collaboration-graph、index、manifest |
| `^MGT-\d{3}$` | ManagementRole | `management-catalog.json` | management 资产、SHADOW-VERIFICATION |
| `^AGT-(05[1-9]|0[6-9]\d|10[0-2])$` / `^VIB-` | SourcePersona / VisualIdentityBinding | SANBAO 方案 / G3 登记册 | G3/G6；仅展示绑定，不授权 |
| `^FLOW-\d{2}$` / `^BVS-\d{2}$` / `^CVS-\d{2}$` | BusinessValueFlow / ValueStream | `collaboration-graph.json#flows` / `e2e-value-streams.json#streams` | FLOW-CATALOG、END-TO-END；CVS 不并入 BVS |
| `^SCN-\d{3}$` / `^STG-\d{2}$` | BusinessScenario / CaseStage | `collaboration-graph.json#scenarios/#protocol` | CATALOG.md；candidate；阶段未实例化 |
| `^ART-` / `^REC-` / `^FSB-` / `^BIND-` | ArtifactType / RecordType / Binding | collaboration-graph / case-record-contract | 设计契约，非可执行 schema |
| `^R?PB-` | Playbook | `PLAYBOOKS.md` / `role-playbooks/index.json` | role-catalog；区分共享与岗位 Playbook |
| `^(SHOP|ORG|PILOT|VIS)-G\d$` / `^RP-[GM]\d$` / `^MGT-EVAL-` | Gate | DECISIONS + 各族文档 | STATUS、charter、review；无定义标 `undefined` |
| `^EVD-\d{3}$` / `^F-\d{3}$` | EvidenceSource / Fact | `SOURCES.md` / `FACTS.md` | 研究文档、访谈；EVD-029 标 duplicate |

`ContractRef` 不是 entity_type，也不是 objectType；250 条契约引用只作为 ProjectRole 节点的属性数组，避免生成悬空节点。

### 5.4 跨切面记录
- **替代链 6 条，必须记录子句级作用域**：
  - D-016→D-020：替代“50 个长期 Agent 动态编队”的运行语义，保留 50 岗位责任覆盖与窄范围只读 Delegate。
  - D-020→D-053：仅替代“岗位不形成运行 Agent 身份”的语义；保留五契约、不可变 Bundle、Action Intent→Policy Gate→Execution Broker、产物门禁、凭据隔离；组队由模型外 Case Control 编排，Lead 负责 Case 结果，Worker 通过已验收 ArtifactEnvelope 交接，不允许隐式岗位聊天或相互转授权限。
  - D-030→D-033、D-012→D-016、D-013→D-016、ADR-0002→ADR-0003：`superseded_clause` 与 `retained_clause` 由 MKG-02 从原文填入；未填前 `status=pending_clause_verification`，不参与检索答案。
- **纠错 8 条**：对应 §3.4 的 7 类漂移；MGT-Q1/Q2/Q3 类拆为 2 条（STATUS/ADR 与 management README），其余 6 类各 1 条。每条 `status=known_stale_not_authoritative`，verifier 校验 `claim_excerpt_sha256` 是否仍匹配源文本；源文已修则降级或删除该条。
- **禁止边 6 类**：Role→Role 运行/会话/委派/授权；ManagementRole→Case；ManagementRole→AGT 指令/会话（只允许 `management_covers_role`）；Role→Tool/Credential/Permission；创建 Case/RoleReleaseBundle/ServiceIdentity/ResourceReservation 节点；VisualIdentityBinding→权限或授权。

### 5.5 岗位派生视图
`ai-org-role-view.json` 的节点与边：

| 元素 | 数量 | 来源 |
|---|---:|---|
| 节点：50 ProjectRole + 3 ManagementRole + 8 Flow + 20 Scenario | 81 | `role-catalog.json`、`management-catalog.json`、`e2e-value-streams.json`、`collaboration-graph.json` |
| 边：role→plane 50 + role→domain 50 | 100 | `organization-graph.json` |
| 边：role→flow 140 + role→scenario 127 | 267 | `role-catalog.json` 的 `flows` / `scenarios` |
| 边：management→role 50（38+12 覆盖） | 50 | `management-catalog.json` |
| 合计边 | 417 | 全部由脚本生成 |

契约引用 250 条和 Playbook 引用 140 条作为节点属性保存，不建边；`collaborates_with` 200 条作为 `declared_common_collaborators` 属性保存，强制 `runtime=false`，不建 Role→Role 边。视图文件头写入 `generated_from` 的路径与 SHA-256，禁止手工编辑。

### 5.6 岗位上下文包（RoleContextBundle）
```text
role_id, role_kind, plane, domain, mission, personality, principle, boundary, stop_signals,
status, production_authorized, artifacts{role_profile_ref,soul_ref,role_playbook_ref,preset_ref},
contract_refs[BUSINESS,SKILL,RUNTIME,ACCESS,ASSURANCE], eligible_flows, eligible_scenarios,
shared_playbooks, standalone_mode, worker_mode, eval_suite_ref, source_pointers
```

必填字段：`role_id`、`role_kind`、`plane`、`domain`、`mission`、`personality`、`principle`、`boundary`、`status`、`production_authorized`、4 个 `artifacts` 引用、5 个 `contract_refs`、`eligible_flows`、`eligible_scenarios`、`shared_playbooks`、`standalone_mode`、`worker_mode`、`source_pointers`。可选字段：`stop_signals`、`eval_suite_ref`；MGT 额外必填 `coverage_role_ids`、`decision_rights_ref`、`MDC/GOC refs`、`shadow_status`，且不含 Case 角色。

装配顺序：`role_id` → `role-catalog` → `organization-graph` 的 plane/domain → 4 份岗位资产引用 → 5 条 `contract_ref`（unresolved 原样）→ eligible flows/scenarios（以 `role-catalog.json` 为准）→ shared playbooks → preset modes → eval suite → boundary/stop signals。缺任一必填字段返回 `INCOMPLETE` 并列出 `missing[]`，不推断补齐。装配器 `scripts/role-context-bundle.mjs`，schema `role-context-bundle.schema.json`。

### 5.7 明确不建什么
1. 不建 250 个契约节点：`required_ref` 是未解析占位，建了就是 250 个悬空节点；只作为 role 属性。
2. 不手工重建 700+ 条已存在于 JSON 的边：岗位视图由脚本生成，带源哈希；不手工维护。
3. 不建 `Role → Role` 运行、会话、委派、授权边；`collaborates_with` 只作属性，任何 role→role 边都禁止。
4. 不建 `ManagementRole → Case` 或 `ManagementRole → AGT` 指令/会话边，只建 `management_covers_role`；不建 `Role → Tool/Credential/Permission` 授权边。
5. 不建 `Case`、`RoleReleaseBundle`、`ServiceIdentity`、`ResourceReservation` 节点；当前计数全 0。
6. 不把 `AGT-051..102` 建成 `ProjectRole`；只为 3 个 MGT 视觉绑定建 `SourcePersona`。不建视觉素材、Dossier、Preset 的完整图，只保留 `release_id`、`VIB-*`、`source_persona` 指针。
7. 不把 `dist/data` 三份投影建节点；不把 BP 假设、空数组、生成物计数当事实。
8. 不新增 `MKG-*` 阶段门；不声明 `ContractRef` objectType、`contract_ref_instance_of_type` 或 `declared_common_collaborator` linkType。

### 5.8 nmem 投影与本体
- Phase 1 写入 16 条记忆，Space `ai-org-change`，身份 `ai-org-memory-curator`。
- 写入前必须完成隔离证明：独立 `nmem-server` 实例或独立 data root，且写入前后对共享库做实体/边集合差集，白名单之外无新增。具体隔离方法 [未知]，MKG-04 实测；证明不了则 Phase 1 取消。
- Ontology 15 个 objectTypes：`ProjectRole`、`ManagementRole`、`SourcePersona`、`OrganizationPlane`、`DomainView`、`ContractType`、`ValueFlow`、`BusinessScenario`、`CaseStage`、`ArtifactType`、`CaseRecordType`、`Gate`、`EvidenceSource`、`Decision`、`ADR`。
- LinkTypes 11 个：`supersedes`、`superseded_by`、`alias_of`、`belongs_to_plane`、`belongs_to_domain`、`role_must_bind_contract`、`role_contributes_to_flow`、`flow_has_stage`、`flow_eligible_for_scenario`、`management_covers_role`、`visual_binding_uses_source_persona`。
- 记忆正文中凡需要被抽取为实体的标识，统一写 `AIORG-AGT-001`、`AIORG-MGT-001` 等前缀形式；仓库 ID 仍为 `AGT-001`。抽取后逐条检查实体的 `metadata.space_id` 与名称前缀。
- 不使用 `entity create`，不承诺手工实体图。先 apply 1 个 objectType + 1 个 linkType 的 probe；probe 失败则 `BLOCKED_ONTOLOGY_SCHEMA`，停止，不写任何记忆。probe 通过后 apply 15+11；全量失败可退回 memory-only（global ontology），但 graph 验收标记 degraded，且需用户批准。

---

## 6. 六步 SOP 逐项落地
### 6.1 执行顺序
Phase 1 顺序：Space & Identity → 5 条 Space Rules → Working Memory & Library → Ontology probe/apply → 16 条记忆（3 probe + 13）→ 环境固化与运行时 Recall。Ontology 先于记忆是对 SOP 第 4/5 步的有意互换：先固定实体抽取词汇，避免 16 条记忆在 global ontology 下先抽出错误实体；此偏离列在 §7.4 D-04，需用户批准。

### 6.2 六步法
| 步 | 动作 | 前置 | 验收 | 写入量 |
|---|---|---|---|---|
| 1 Space/Identity | `nmem spaces create "AI组织变革 Space" --id ai-org-change --retrieval-mode strict`；`nmem agents enroll ai-org-memory-curator --name "AI组织变革 Memory Curator" --role "knowledge_graph_curator" --default-space ai-org-change` | 隔离证明；MKG-03 通过；A1 | Space strict；Identity 默认 Space 正确；0 memories；已存在身份用 `agents set` 修正 | 2 |
| 2 Rules | 5 条 space-scoped 规则：`ai_org_core_persona` P100、`ai_org_evidence_boundary` P95、`ai_org_source_of_truth` P90、`ai_org_namespace_and_edges` P90、`ai_org_write_authorization` P85 | MKG-04；A1 | 5 条 active；文本逐字回读；`nmem context` 可见；global 未变 | 5 |
| 3 WM/Library | WM 两节：`## Focus Areas` + `## Briefing`；7 份脱敏 `.markdown` 摘要入 Library | MKG-05；A1 | WM readback 完整；Library 7/7 `indexed`；敏感词扫描 0 命中；`nmem context` 同时含 Space、5 条 rules、WM 两节 | 1 WM + 7 library |
| 4 本体 | 先 probe 1+1，再 apply 15+11 | MKG-06；schema 实测；A1 | `ontology show --space-id` 返回 15/11；global 不变；ContractRef 实体数 0；role→role 边数 0 | 1-2 patches |
| 5 蒸馏 | `scripts/mkg-seed-plan.mjs` 生成 16 条 seed plan，逐条核对后先写 3 条 probe、再写 13 条 | MKG-07；MKG-08；A1 逐条 | `memories show` 16/16 精确回读；labels/importance/unit_type 正确；token 原样；无 plan-as-fact | 16 memories + 抽取 |
| 6 运行时闭环 | `NMEM_SPACE=ai-org-change`、`NMEM_AGENT_ID=ai-org-memory-curator`；recall 3 秒超时；失败降级到 repo 文档；单测覆盖超时/离线/空结果 | MKG-09；MKG-03 | 5 条固定查询 4/5 Top-3 命中且 Top1≥0.70；5/5 ≤3s；无跨 Space 结果；单测全绿 | 1 script + 1 test + settings |

CLI 实测要点：子命令用复数（`spaces`、`agents`、`rules`、`memories`、`entities`、`ontology`）；`spaces create` 的 NAME 是位置参；`rules upsert` 的 ID 是位置参；`working-memory edit` 用 `--space`；`ontology show` 用 `--space-id`，`ontology apply --scope space` 必须配 `--space-id`；`-n` 是 limit，`-l` 是单标签；`memories add` 正文用位置参数或 `--stdin`，没有 `--content`；`--when` 只接受 `past/present/future/timeless`，日期用 `--event-start`；`--dry-run` 不存在，dry-run 由 `scripts/mkg-seed-plan.mjs` 实现。

### 6.3 5 条固定验收查询
| # | 查询 | 期望答案 | 期望命中的 memory ID | 通过条件 |
|---:|---|---|---|---|
| 1 | D-020 现在的含义是什么？ | D-053 只替代“岗位不形成运行 Agent 身份”的运行语义；五契约、不可变 Bundle、Action Intent→Policy Gate→Execution Broker、产物门禁、凭据隔离仍保留；D-020 的 50 岗位责任覆盖仍有效 | `aiorg.l1.role-contract-primacy` | Top-3 命中且答案含 retained_clause；Top1≥0.70 |
| 2 | MGT-Q1/Q2/Q3 是否还待确认？ | 已由 D-065 关闭；STATUS/ADR-0014/management README 的待确认写法过时 | `aiorg.l3.known-drift` 或 `aiorg.l2.gate-snapshot` | Top-3 命中任一；Top1≥0.70 |
| 3 | 能否开始 SHOP-G2？ | 不能；当前 SHOP-G1，SGF-10 待最终审阅 | `aiorg.l2.gate-snapshot` | Top-3 命中；Top1≥0.70 |
| 4 | 50 个岗位是否已有运行实例？ | 0；`production_authorized=false`；Preset 均不可导入 | `aiorg.l2.counts-not-interchangeable` | Top-3 命中；Top1≥0.70 |
| 5 | PILOT-G0 是否通过？ | 范围部分确认、门未正式通过；与实施蓝图“未启动”的口径差异需解释 | `aiorg.l2.gate-snapshot` | Top-3 命中；Top1≥0.70 |

主验收：5 条中至少 4 条 Top-3 命中期望 memory ID，且这 4 条 Top1 分数 ≥0.70；5/5 在 3 秒内返回。`answer_source` 必须记录为 `memory`、`overlay` 或 `repo_fallback`。服务不可用时的 fallback 只记录为 `repo_fallback`，不计入 4/5 命中；无命中直接判失败。若 4/5 未达，MKG-11 判 NOT MET，不得写“或降级通过”。

### 6.4 SOP 8 条 checklist 对照
| # | SOP 要求 | 本项目判定 | 证据/票据 | 理由 |
|---:|---|---|---|---|
| 1 | Space strict | 满足 | MKG-04 | `spaces list` 显示 strict |
| 2 | Identity 默认 Space | 满足 | MKG-04 | `agents list` 默认 `ai-org-change` |
| 3 | Context Bundle 完整 | 满足 | MKG-06 | `nmem context --space ai-org-change` 同时含 Space、5 条 rules、WM 的 `## Focus Areas` 与 `## Briefing` |
| 4 | Library 全 indexed | 满足 | MKG-06 | 7/7 indexed，错误数 0 |
| 5 | 实体图谱可视化 | 待实测，不预先豁免 | MKG-09 | 桌面端 ⌘5 切换 `AI组织变革 Space`，记录实体/关系证据；若 Space 过滤不可用，记 `ENTITY_VIEW_SPACE_FILTER_UNAVAILABLE`，SOP #5 判 NOT MET，等待用户对替代证据的批准 |
| 6 | Top1 ≥0.70 | 满足（硬阈值） | MKG-10 | 4/5 Top-3 命中且 Top1≥0.70；无命中/fallback 不计通过 |
| 7 | 单元测试通过 | 满足（Node 替代 SOP 示例的 Python） | MKG-10 | 仓库无 `tests/`、无 `package.json`，15 个既有 verifier 全为 `.mjs`；沿用该风格用 `node --test scripts/nmem-recall.test.mjs`，覆盖真实检索、超时、离线、非零退出、空结果。本机虽有 Python 3.12.13，但无 pytest 配置，新建 Python 测试栈属于未请求的额外依赖 |
| 8 | 规范化 Git Commit | 不适用/延后 | R2 | 项目规则禁止未请求 commit；不计入 8/8 通过，待用户单独授权 |

---

## 7. 授权对象清单与闸门
### 7.1 授权分级
| 级别 | 范围 | 是否需要批准 |
|---|---|---|
| A0 | 只读检查、分析、dry-run | 不需要 |
| A1 | nmem Phase 1 写入：隔离库、Space、Identity、5 Rules、WM、7 Library、16 memories、15+11 ontology | 逐项 |
| A1-ISO | 独立 nmem 实例/data root 的创建与切换 | 单独批准，Phase 1 前置 |
| A2 | Phase 2 全量账本：77 D + 15 ADR + 门禁证据 + 开放票据 | 本方案不授权 |
| R1 | 仓库写入：覆盖层、resolver、岗位视图、bundle 装配器、recall 包装、单测、脱敏摘要、文档漂移修正 | 逐文件 |
| R2 | git commit / push / Pages 发布 | 单独授权，本方案不包含 |

### 7.2 待授权写入对象
| # | 对象 | 精确值/数量 | 副作用 | 可逆性 | 状态 |
|---:|---|---|---|---|---|
| 1 | 隔离实例 + Space + Identity | 独立 server/data root；`ai-org-change` strict；`ai-org-memory-curator` | 新数据库、命名空间与身份 | 删除副本即可；Space 归档路径未验证 | 待授权，Phase 1 前置 |
| 2 | Rules + WM | 5 条规则 + 1 份 WM（`## Focus Areas` + `## Briefing`） | 改变本 Space 检索行为与会话启动上下文 | 可 upsert/覆盖 | 待授权 |
| 3 | Library + 摘要生成器 | 7 份脱敏 `.markdown` 摘要 + `scripts/build-library-digests.mjs`；不含 FACTS/STATUS 原文 | 文档索引；新增 1 个脚本 | 移除路径未验证；脚本 git 可回滚 | 待授权 |
| 4 | Memories | 16 条，ID 见 §4.2 | 记忆库新增 16 条 | 按 ID 更新/删除路径需验证 | 待授权 |
| 5 | Ontology + 共享实体抽取 | 15 objectTypes + 11 linkTypes；先 3 条 probe，再 13 条；白名单外新增即停 | 改变实体抽取词汇；全局图新增实体/关系 | revision 可覆盖；抽取副作用不可完全回滚 | 待授权，高风险 |
| 6 | 覆盖层 + resolver + 岗位视图 | `ai-org-knowledge-overlay.json`、`ai-org-role-view.json`、`scripts/knowledge-overlay.mjs`、`scripts/build-role-knowledge-view.mjs` | 新增 4 个仓库文件 | git 可回滚 | 待授权 |
| 7 | bundle 装配器 + schema | `scripts/role-context-bundle.mjs`、`role-context-bundle.schema.json` | 新增 2 个仓库文件 | git 可回滚 | 待授权 |
| 8 | recall + 单测 + 环境 | `scripts/nmem-recall.mjs`、`scripts/nmem-recall.test.mjs`、`.claude/settings.local.json`、`.gitignore` 一行 | 新增 2 个脚本、1 个本地配置、1 行忽略规则 | git 可回滚 | 待授权 |
| 9 | 漂移登记/修正 | MKG-01 草稿；MKG-01R 源文档修正 7 类 8 处 | 修正过时状态 | git 可回滚 | 待授权，MKG-01R 单独 |
| 10 | 验收归档 | `docs/09-governance/knowledge-graph/MKG-ACCEPTANCE-20261031.md`、`STATUS.md` 复审行、可选 workflow | 新增正式验收记录与复审日期 | git 可回滚 | 待授权 |

### 7.3 明确不授权
- 不写其他 7 个 Space；不修改 global rules；不删除或合并任何实体。
- 不修改现有 JSON/Markdown（第 9 项 MKG-01R 单独授权除外）；不 commit/push/Pages。
- 不执行 Shopify、DSH、Amazon、企业 API、MCP 工具、Case/Bundle/ServiceIdentity 的任何动作。
- 不写企业私有数据、凭据、客户明细、员工资料；Library 摘要若扫描命中企业数字，停止入库。
- 不把记忆内容当作业务动作、权限、预算或对外承诺的授权依据。
- 不新增 `MKG-*` 阶段门；不把 `MKG-*` 写进 STATUS 的门禁族。

### 7.4 SOP 偏离与豁免审批项
| ID | 偏离/豁免 | 理由 | 批准状态 |
|---|---|---|---|
| D-01 | SOP #5 实体图可见性以实测为准；若 nmem 桌面端无法按 Space 过滤，可用 repo 岗位视图作为替代证据 | nmem 图为单库全局，CLI 无 Space 过滤；未实测 ⌘5 | **已批准 2026-10-31**；#5 仍以实测为准，未实测不得预先记 MET |
| D-02 | SOP #6 用 4/5 Top-3 + Top1≥0.70 判定，不接受无命中降级 | 防止 0 命中通过验收 | 不偏离，硬阈值 |
| D-03 | SOP #8 commit 延后，不计入通过 | 项目规则禁止未请求 commit；R2 单独授权 | **已批准 2026-10-31**（延后至 R2） |
| D-04 | SOP 第 4/5 步互换：ontology 先于记忆 | 先固定抽取词汇，避免 250 个悬空契约实体 | **已批准 2026-10-31** |
| D-05 | Library 用 7 份脱敏摘要，不用 FACTS/STATUS 全文 | 企业私有数据边界 | **已批准 2026-10-31**（摘要集合以 MKG-06 生成清单为准，另行逐份确认） |
| D-06 | 单测用 `node --test`，不用 SOP 示例的 Python `test_<agent>_nmem_recall.py` | [事实] 本机有 Python 3.12.13、`scripts/` 内 4 个 `.py`，但无 `tests/`、无 `package.json`、无 pytest 配置；15 个既有 verifier 全为 `.mjs`，Node v22.22.0 自带 `node --test`。选 Node 是为匹配仓库既有验证风格，不是「无 Python」——原稿该理由不成立 | **已批准 2026-10-31** |
| D-07 | 不实现 SOP「写侧持续蒸馏／监听真源变更」的自动 watcher，改为 §10 手工复审触发器 + 可选 CI | nmem 是共享活库，自动监听会在其他项目并行运行时触发不可控写入与实体抽取；项目当前无后台进程管理机制，且 SOP 自身未定义监听器实现 | **已批准 2026-10-31**；SOP 第 4 维写侧记 PARTIAL，验收不得记为 DONE |

---

## 8. 执行票据表
| Ticket | 目标 / 完成判据 | 依赖 | 写集 | 不做范围 | 授权 |
|---|---|---|---|---|---|
| MKG-00 | 目标：记录基线、dirty 文件处置与隔离可行性。判据：预检含 HEAD、`git status`、nmem 版本/7 Spaces/agents、Node 版本、隔离测试结果；隔离方法明确为“独立实例/独立 data root/不可行”之一 | 无 | `tmp/outputs/mkg-00-preflight-20261031.md` | 不 commit、不改源码、不写 nmem | A0 |
| MKG-01 | 目标：形成 8 条 drift corrections 草稿。判据：每条含 `claim_ref`、`claim_excerpt_sha256`、`corrected_by`、`evidence`、`status`；不改源文档 | MKG-00 | `drafts/analysis/mkg-01-drift-register-draft-20261031.json` | 不改正文、不写 overlay、不写 nmem | R1 |
| MKG-02 | 目标：建覆盖层、resolver、岗位视图、verifier。判据：20 条记录校验通过；resolver 可解析 D/AGT/MGT/gate；岗位视图 81 节点/417 边且带源哈希；verifier exit 0；ContractRef 节点 0 | MKG-00、MKG-01 | `docs/09-governance/knowledge-graph/ai-org-knowledge-overlay.json`、`ai-org-role-view.json`、`scripts/knowledge-overlay.mjs`、`scripts/build-role-knowledge-view.mjs` | 不改源 JSON/MD；不物化 nmem 实体 | R1 |
| MKG-03 | 目标：装配器 + schema + 5 份上下文包回放（AGT-001/023/005/048 + MGT-003）。判据：schema 通过；每份为完整或 `INCOMPLETE`+`missing[]`；无推断补齐 | MKG-02 | `scripts/role-context-bundle.mjs`、`role-context-bundle.schema.json`、`tmp/outputs/mkg-03-bundles/*.json` | 不运行 DSH、不实例化 Case、不授权 | R1 |
| MKG-04 | 目标：隔离证明 + strict Space + Identity。判据：独立实例/data root 证明；共享库写入前后图 diff 白名单；Space strict；Identity 默认正确；0 memories；已存在身份用 `agents set` | MKG-03、A1-ISO | 隔离 nmem 实例；Space `ai-org-change`；Identity `ai-org-memory-curator` | 不写共享库；不复用其他 7 个 Space | A1 |
| MKG-05 | 目标：注入 5 条 space rules。判据：5 条 active；逐字回读；`nmem context` 可见；global 未变；优先级 100/95/90/90/85 | MKG-04 | nmem rules ×5 | 不设 global；不改其他 Space | A1 |
| MKG-06 | 目标：WM + 7 份脱敏 Library + Context Bundle 校验。判据：WM 两节完整；Library 7/7 indexed；敏感词扫描 0 命中；`nmem context` 含 Space、5 rules、WM 两节 | MKG-05 | nmem WM；`scripts/build-library-digests.mjs`；`tmp/library/*.markdown`；nmem library ×7 | 不整份收 FACTS/STATUS；不把 Library 当权威源 | A1 |
| MKG-07 | 目标：ontology probe 1+1，再 apply 15+11。判据：probe 通过；`ontology show --space-id` 15/11；global 不变；ContractRef 实体 0；role→role 边 0；抽取副作用记录 | MKG-06、schema 实测 | nmem ontology；`drafts/analysis/ontology-ai-org-v1-draft-20261031.json` | 不手改图数据库；不承诺实体实例 | A1 |
| MKG-08 | 目标：16 条 seed plan dry-run。判据：16/16 ID 唯一；labels/importance/unit_type 正确；来源锚点可解析；摘录哈希可算；状态 token 原样；无 plan-as-fact；seed 10 带 `stale_after` | MKG-02 | `scripts/mkg-seed-plan.mjs`、`tmp/outputs/mkg-08-seed-plan.json` | 不写 nmem | R1 |
| MKG-09 | 目标：先 3 条 probe 再 13 条写入；验证抽取。判据：16/16 `memories show` 精确回读；probe 无跨 Space/错误运行边/token 改写；实体 `space_id` 与 `AIORG-` 前缀正确；共享库图 diff 白名单；⌘5 证据记录 | MKG-07、MKG-08、A1 | nmem memories ×16；共享抽取副作用 | 不写其他 Space；不删除/合并实体；抽取结果不作审计 | A1 逐条 |
| MKG-10 | 目标：recall 包装、环境固化、单测、5 条固定查询。判据：`node --test` 全绿；`NMEM_SPACE`/`NMEM_AGENT_ID` 生效；5 条查询 4/5 Top-3 且 Top1≥0.70、5/5 ≤3s；fallback 记录不通过 | MKG-09、MKG-03 | `scripts/nmem-recall.mjs`、`scripts/nmem-recall.test.mjs`、`.claude/settings.local.json`、`.gitignore` 一行、可选 `DEVELOPMENT.md` 一行 | 不接生产、不改 DSH、不写记忆 | R1 |
| MKG-11 | 目标：SOP 8 条 + 项目 6 条验收；正式归档。判据：逐项 pass/fail/waived；止损条件评估；go/no-go 明确；验收写入正式文档；STATUS 增加复审日期与 owner；可选 workflow | MKG-02..MKG-10 | `docs/09-governance/knowledge-graph/MKG-ACCEPTANCE-20261031.md`、`STATUS.md` 一行、可选 `.github/workflows/verify-knowledge.yml` | 不自动扩容、不自动写 P2 账本 | R1；commit R2 单独 |
| MKG-01R | 目标：可选修正 7 类 8 处源文档漂移。判据：每处有权威指针；若改 HTML 同步 `dist/` 或明确排除；`verify-docs-links.mjs` 通过；`git diff --check` 干净 | MKG-01、单独授权 | `STATUS.md`、`ADR-0014`、`DECISIONS.md`、`README.md`、`DEVELOPMENT.md`、`MANAGEMENT-LAYER.md`、`management/README.md`、`IMPLEMENTATION-BLUEPRINT.html` + `dist/` 副本 | 不重构、不改无关内容、不 commit | R1 单独 |

项目 6 条验收：5 份岗位上下文包完整或 `INCOMPLETE`；16/16 记忆精确读回；0 禁止边；0 跨 Space 污染（集合差集，不是计数）；状态 token 原样；5 条固定查询达到 §6.3 硬阈值。MKG-01R 不阻塞 Phase 0；MKG-08 可与 MKG-04..07 并行，其余 nmem 票在隔离库内串行。

---

## 9. 风险与反证
### 9.1 最可能失败的方式
1. **做成第三份过时副本，或没有消费方。** 覆盖层只保留 20 条“源文件没有的判断”，岗位视图由脚本重生成并带源哈希；但若岗位上下文装配器与 resolver 不进入真实任务，记忆系统仍会变成一次性交付物。MKG-03 不能证明装配价值就停。
2. **抽取污染状态 token 或合并同名实体。** 共享库里 Sage 已有 `AGT-001..050` 数字员工实体；若在共享库直接写入，`production_authorized=false` 可能被抽成 `production`。防线是隔离库、`AIORG-` 前缀、删除 `ContractRef`、图 diff 白名单；仍不能保证抽取器行为，残余风险高。
3. **私有数据进入共享库。** `FACTS.md` 含企业规模、渠道占比、店铺数、SKU、员工数；Library 只收脱敏摘要，并用敏感词扫描作为硬门。
4. **隔离无法证明或授权摩擦。** 没有独立 data root 就写入共享库，会影响其他并行任务；5 条规则 + 16 条记忆 + ontology + 7 份 Library 逐项确认也可能让流程停摆。前者是一票否决，后者按票批准、先 3 条 probe 缓解。

### 9.2 反面论证
最强的反对意见是：**现有 `rg` + 直接读文件已经够用，nmem 又不能建实体图，这套东西投入产出不成立。**

这个反对意见对单文件事实查询成立。查一条 D 编号、一条门禁状态，`rg` 确实更快。但本项目的真实成本在跨文件判断：D-020 是否还是现行语义、MGT-Q1/Q2/Q3 是否已关闭、50 个岗位的 5 条契约引用是否已解析、哪些“完成”只是静态发布、哪些边禁止生成。这些问题每次要读 5 个以上文件，且正确答案依赖“哪个源更权威”。20 条覆盖层 + 81 节点岗位视图 + 装配器正是为这些问题设计的；即使 nmem 完全不可用，repo 侧仍可被任何脚本或 Agent 使用。

因此 nmem 放在 Phase 1：先用 MKG-03 证明装配价值，再决定是否写 Space。如果 5 份上下文包不能比手工拼边界更快，就不进入 nmem。

### 9.3 止损条件
- 隔离证明失败或共享库图 diff 出现白名单外新增 → 停止，Phase 1 取消，保留 repo-only。
- MKG-03 任一岗位上下文包缺 3 个以上必填字段 → 停止，先修数据源，不建 Space。
- 3 条 probe 出现跨 Space 边、错误运行边、`production_authorized` 被改写、实体前缀错误 → 停止写入，记录污染实体，评估 delete/merge。
- 16 条种子有 2 条以上来源锚点或摘录哈希无法解析，或 Library 敏感词扫描命中 → 停止，不写记忆、不入库。
- 5 条固定查询未达 4/5 Top-3 或 Top1<0.70 → MKG-11 判 NOT MET，不写“通过”。
- 30 天后复验：16 条中超过 2 条 `as_of` 过期，或 5 条查询中 2 条无法在 3 秒内返回正确指针 → 冻结 Space，保留覆盖层与岗位视图；没有明确消费方时同样只保留 repo 资产。

---

## 10. 复审触发器
| 触发器 | 动作 | Owner |
|---|---|---|
| 新增 D-xxx 或 ADR | 更新覆盖层 `supersedes` / routes；评估是否新增记忆 | 记忆维护者 |
| STATUS 门位变化 | 不写记忆正文；seed 10 的 `as_of` 更新或降级；查询回读 STATUS | 记忆维护者 |
| 任一漂移修复 | 删除或降级对应 `corrections`；重跑 verifier | 记忆维护者 |
| nmem 版本或 ontology revision 变化 | 重跑 MKG-07 probe；检查抽取行为是否变化 | 平台维护者 |
| 30 天未复审 | 重跑 MKG-02 verify + MKG-10 5 条查询；更新 `as_of` | 记忆维护者 |
| 发现跨 Space 实体污染 | 立即停止写入；记录污染实体；评估 delete/merge | 记忆维护者 + 用户 |
| `production_authorized` 或运行计数变化 | 更新 seed 11；不得沿用旧 `HOLD_*` | 记忆维护者 |
| SOP 偏离批准状态变化 | 更新 §7.4 与 MKG-11 判定 | 用户 |

验收结论写入 `docs/09-governance/knowledge-graph/MKG-ACCEPTANCE-20261031.md`，不是 `tmp/`；`STATUS.md` 增加一行“MKG 复审到期 2026-11-30 / owner / 状态”。若本轮不碰 CI，则把手工复审日期与 owner 写入 `DECISIONS.md`，并明确“无自动化复审”。可选新增 `verify-knowledge.yml`，在覆盖层、岗位视图、resolver、recall 脚本变更时运行 verifier。

---

## 11. 评审处置记录
**SOP 评审的致命问题**

1. checklist #5/#6 被替换未审批 → 已改：§6.4 逐条判定；#5 先实测不预先豁免；#6 用硬阈值；任何替代证据走 §7.4 审批。
2. “5/5 返回预期 ID 或降级”使 0 命中通过 → 已改：4/5 Top-3 + Top1≥0.70；fallback 不计通过；无命中判失败。

**图谱评审的致命问题**

3. D-020 替代被简化为“D-020 仅历史” → 已改：supersedes 记录子句级 `superseded_clause` / `retained_clause` / `scope`；seed 3 与 Q1 同步保留五契约、Bundle、Action Intent→Policy Gate→Execution Broker、产物门禁、凭据隔离。
4. 覆盖层无消费接口、bundle 装配器不在写集 → 已改：新增 `scripts/knowledge-overlay.mjs resolve` 与 `scripts/role-context-bundle.mjs`，列入 MKG-02/03 写集。
5. 全局图、同名 AGT、禁止边不可验证 → 已改：隔离库前置、`AIORG-` 前缀、删除 `ContractRef` 与 `declared_common_collaborator`、实体 space_id/前缀检查、⌘5 实测。

**工程评审的致命问题**

6. 共享活库 + 全局抽取 + probe 太晚 → 已改：隔离证明为 Phase 1 前置；probe 在 Space 创建后、记忆写入前；每次写入做图 diff。
7. Library 含 FACTS/STATUS 私有事实 → 已改：7 份脱敏摘要 + `build-library-digests.mjs` + 敏感词扫描硬门。
8. 无 bundle 装配器/required schema → 已改：MKG-03 写集与 schema 明确；verifier 验收改为“5 份 bundle schema 通过”。
9. SOP 8 条被砍 2 条、无测试载体 → 已改：§6.4 逐条判定；Node 单测；commit 延后不计通过。

其余高/中高问题已在对应章节修正：L4 映射与 seed 6 命名空间、persona 规则与 settings.local.json、蒸馏脚本与第 4/5 步顺序、MKG-01 与 corrections 冲突、CLI 参数与 dry-run、`file:line` 腐烂、票据依赖与 `dist/` 同步、30 天复审机制；不再逐条重复。未采纳的建议只有两类：保留 20 条覆盖层而不是完全删除 routes（routes 作为脚本常量并受 verifier 约束），以及在实测 ⌘5 前不预先宣布 SOP #5 豁免。

---

## 12. 未核查与风险
未核查：未执行任何 nmem 写路径；未验证 `ontology apply` 的 JSON schema、Library 解析行为和实体抽取触发条件；未验证独立 nmem 实例/data root 的具体创建方法；未实测桌面端 ⌘5 对 Space 的过滤；未逐条核对 D-030→D-033、D-012→D-016、D-013→D-016、ADR-0002→ADR-0003 的子句保留范围；原始二进制附件仍不可解析（用户已以纯文本提供同一正文，SOP 依据已确认）。

风险：nmem 是活库，所有计数以执行时快照为准；共享库即使有隔离证明，自动抽取仍可能产生白名单外实体；5 条中文固定查询可能达不到 Top1≥0.70，若未达到，本方案必须判 NOT MET，不能降级通过；7 份脱敏摘要是人工规则生成，敏感词扫描不能保证覆盖所有企业信息；30 天无复审时，覆盖层与记忆会比源文档更旧，届时按 §9.3 冻结 Space、保留 repo 资产。