# 跨项目复用 Playbook

状态：跨项目消费与复用指南；设计资产已完成，目标运行环境尚未完成适配。
适用对象：需要读取、评估或有限复用本项目方案、岗位设计、Playbook、价值流和静态展示资产的其他项目。
版本依据：以本仓库 main 分支当前提交、docs/00-project/STATUS.md 和 docs/00-project/DECISIONS.md 为准。

> 这不是某一个岗位的 Role Playbook，也不是 DeepSeek Harness 可直接导入的配置包。它说明其他项目如何发现本项目的能力、选择最小资产集、建立受控交接并验证边界。

## 1. 项目身份与能力边界

本项目是一个面向跨境电商经营的 AI 组织方案与 PRD 仓库。它交付的是可追溯的组织、场景、岗位、能力、治理和静态展示设计，不是已经连接企业系统的运行服务。

当前能力图谱可以按五层理解：

~~~text
经营目标与方案
└─ 8 条业务经营流 BVS + 4 条能力供应流 CVS
   └─ 20 个候选业务场景 + 8 份共享经营 Playbook
      └─ 50 个独立可寻址 AGT 岗位
         ├─ 每岗 Soul Contract
         ├─ 每岗 Role Playbook
         ├─ 每岗 Skills 目录描述符、标准产物、评估与 Access 边界
         └─ 每岗 Preset Blueprint（设计稿，不是导入包）
            └─ 外部 Case Control：一张 Case 一条主流、一个主场景、一个 Lead
               └─ Worker 只通过已验收 ArtifactEnvelope 交接
                  └─ 五契约、不可变 Bundle、Policy Gate、Execution Broker
                     └─ 8 阶段产物门禁与回执核验
~~~

另有一个独立的管理决策权平面：3 个管理层设计身份 MGT-001（天時）、MGT-002（地利）、MGT-003（人和）。它们不属于 50 个 AGT 运行岗位，不进入 Case 的 Lead/Worker 执行链，也不持有 Service Identity 或 Action Intent 权限。

50 个 AGT 的四平面组织责任（5/35/5/5）与 role-catalog 中的 8 个责任域是两套正交视图；选择岗位时不要用责任域计数替代组织平面归属。

视觉层是单独的展示与来源追溯层：当前公开发行包含 53 个身份（3 个管理层 + 50 个 AGT）和 318 个 WebP。天時→AGT-067、地利→AGT-090、人和→AGT-056 是 VIS-G3 的视觉来源映射，不是把这三个管理身份改成 AGT 运行岗位。视觉绑定不能推导岗位能力、运行身份、权限或生产授权。

## 2. 使用前的必读顺序

在其他项目引用本仓库前，先固定用途、范围和授权，再按以下顺序阅读：

1. [项目状态](docs/00-project/STATUS.md)：确认当前阶段、已完成内容和未授权范围。
2. [长期开发知识](docs/00-project/DEVELOPMENT.md)：确认信息归属、状态语义、验证方法和设计边界。
3. [决定记录](docs/00-project/DECISIONS.md) 与 [设计树](docs/00-project/DESIGN-TREE.md)：确认哪些选择已经决定、哪些仍是候选。
4. [企业事实](docs/01-discovery/FACTS.md) 与 [业务词汇](CONTEXT.md)：区分事实、来源、假设和术语。
5. 对应领域的入口 README，再读取机器可读目录和必要的解释文档。

如果只需要浏览，不要先复制全仓库；先从下面的使用索引定位一个权威入口，再按引用链读取最小资产集。

## 3. 能力与资产使用索引

| 目标 | 首个入口 | 下一跳 | 当前状态与边界 |
| --- | --- | --- | --- |
| 了解整体方案 | [方案地图](docs/02-strategy/SOLUTION-MAP.md) | [项目状态](docs/00-project/STATUS.md) | 方案/设计交付，不等于生产运行 |
| 选择业务流或场景 | [12 条端到端价值流](docs/03-scenarios/e2e-value-streams.json) | [流程目录](docs/03-scenarios/FLOW-CATALOG.md)、[场景目录](docs/03-scenarios/CATALOG.md) | 20 个场景仍需业务验证；每个 Case 只能选一条主流和一个主场景 |
| 选择岗位 | [岗位机器目录](docs/05-agents/role-catalog.json) | [岗位总表](docs/05-agents/ROSTER.md)、docs/05-agents/roles/AGT-xxx.md | 50 个岗位设计完成；岗位技能名不代表已有 API |
| 查看管理层决策权平面 | [管理层目录](docs/04-organization/management/management-catalog.json) | [管理层设计](docs/04-organization/MANAGEMENT-LAYER.md)、管理层 roles/souls/playbooks/preset-blueprints | MGT-001/002/003 是决策权设计身份，不进入 AGT Case 执行链 |
| 读取岗位人格与判断原则 | docs/05-agents/roles/souls/AGT-xxx.soul.md | 对应 Role Profile 和评估情境 | Soul 不扩大数据或动作权限 |
| 复用岗位任务合同 | [Role Playbook 索引](docs/06-playbooks/role-playbooks/index.json) | docs/06-playbooks/role-playbooks/AGT-xxx.md | 50 份设计完成；尚未实例化运行 |
| 复用共享经营流程 | [8 份共享 Playbook](docs/06-playbooks/PLAYBOOKS.md) | [流程目录](docs/03-scenarios/FLOW-CATALOG.md) | 具体系统、额度、服务身份和阈值待部署确认 |
| 理解岗位协作 | [协同图谱](docs/07-orchestration/COLLABORATION-GRAPH.md) | [结构化图谱](docs/07-orchestration/collaboration-graph.json)、[Case 契约](docs/07-orchestration/case-record-contract.json) | 由模型外 Case Control 组织，禁止隐式岗位互聊 |
| 查看契约和生命周期 | [Agent 管理图](docs/05-agents/AGENT-MANAGEMENT-GRAPH.md) | [岗位生命周期](docs/05-agents/AGENT-LIFECYCLE.md)、[治理入口](docs/09-governance/README.md) | 五契约、七状态；当前没有生产 Bundle 实例 |
| 查看数据和连接边界 | [数据入口](docs/08-data/README.md) | [系统接入盘点](docs/10-platform/deepseek-harness/SYSTEM-INTEGRATION-INVENTORY.md) | 无凭据、客户明细或员工明细入仓；真实连接未验证 |
| 评估 DSH/Harness 适配 | [平台入口](docs/10-platform/deepseek-harness/README.md) | [能力矩阵](docs/10-platform/deepseek-harness/CAPABILITY-MATRIX.md)、[Preset manifest](docs/10-platform/deepseek-harness/preset-blueprints/manifest.json) | design_only_not_importable；目标版本/schema 未确认 |
| 规划验证与推广 | [岗位实施 TODO](docs/12-rollout/ROLE-PRESET-IMPLEMENTATION-TODO.md) | [验证入口](docs/11-validation/README.md)、[实施章程](docs/12-rollout/IMPLEMENTATION-CHARTER.md) | RP-G0 至 RP-G8 是门禁，不是已完成运行证明 |
| 查看视觉身份 | [视觉方案](docs/12-rollout/SANBAO-VISUAL-IDENTITY-ASSET-PLAN.md) | [G0-G6 证据](docs/12-rollout/visual-assets/)、[公开数据](dist/data/visual-identities.json) | 仅展示/来源追溯层；公开包为 318 WebP |
| 查看公开静态结果 | [本地 Site](dist/index.html) | [GitHub Pages](https://zjgulai.github.io/AI-Native-Organization/) | dist/ 是只读设计投影，不是业务运行入口 |

### 3.1 岗位最小读取链

当调用方需要复用一个岗位时，使用稳定的 role_id，不要只依赖中文别名：

~~~text
docs/05-agents/role-catalog.json
  → docs/05-agents/roles/AGT-xxx.md
  → docs/05-agents/roles/souls/AGT-xxx.soul.md
  → docs/06-playbooks/role-playbooks/index.json
  → docs/06-playbooks/role-playbooks/AGT-xxx.md
  → docs/10-platform/deepseek-harness/preset-blueprints/manifest.json
  → docs/10-platform/deepseek-harness/preset-blueprints/AGT-xxx.json
  → 该岗位被引用的 flow/scenario 与验证情境
~~~

role-catalog.json 是岗位语义的机器事实源；Role Profile、Soul、Role Playbook 和 Preset Blueprint 是相互引用的设计资产。修改岗位目录后，必须按 [开发记录](docs/00-project/DEVELOPMENT.md) 的生成和校验方法重建相关派生文件，不能只修改其中一份。

### 3.2 价值流最小读取链

~~~text
e2e-value-streams.json
  → FLOW-CATALOG.md / CATALOG.md
  → 对应 PB-001 至 PB-008
  → COLLABORATION-GRAPH 与 Case Record 契约
  → 目标项目自己的输入、验收和授权记录
~~~

12 条端到端流由 8 条业务经营流（BVS-01 至 BVS-08）和 4 条能力供应流（CVS-01 至 CVS-04）组成。dist/data/e2e-workflows.json 是公开投影，不能替代 docs/03-scenarios/e2e-value-streams.json。

## 4. 跨项目复用流程

### 4.1 发现

先写一条复用目标：要解决什么业务问题、对象是什么、时间窗口是什么、希望得到什么产物、是否只读。然后从方案地图选择一个领域和一个主价值流/场景；不要把全仓库或全部 50 个岗位一次性复制到调用方。

### 4.2 装配

只允许两种设计模式：

- standalone_role_preset：一个岗位处理边界清晰的单项任务，按需读取该岗位的 Soul、Role Playbook、Skills 和产物契约。
- bounded_case_composition：由模型外 Case Control 选择一个 Lead 和必要 Worker。每张 Case 必须固定一条主价值流、一个主场景、一个结果责任 Lead、一个版本化 Bundle；Worker 只能消费已验收的 ArtifactEnvelope。

不得以岗位之间的自由聊天、隐式路由、再委派或“最新配置”替代显式装配记录。

### 4.3 接入

在任何目标平台接入前，调用方必须另行核实：产品和部署形态、版本、插件、Preset/Skill/Tool schema、Host 生命周期、Service Identity 托管、审计字段、Policy Gate 和 Execution Broker。当前仓库的 Blueprint 只表达目标岗位装配合同，不是目标 DSH 的导入 JSON。

模型只能提出 Action Intent。读取、写入、预算、账号、商品、库存、退款、外部承诺和人员相关动作，必须由模型外的 Policy Gate 与 Execution Broker 按已登记范围、TTL、幂等键和回执策略控制。

### 4.4 验证

验证按层推进，不能用上一层证据代替下一层：

1. 结构：JSON 可解析、ID 唯一、链接可达、角色/流/阶段数量一致。
2. 静态：Playbook、Soul、Preset、契约引用和产物结构完整。
3. 离线回放：正常、缺失、冲突、越权、重复、部分成功、工具失败和重启回放。
4. Shadow：隔离目标环境、只读或 NO_ACTION，记录质量、SLA、冻结率和成本。
5. Limited/Production：只有外部执行、权限、回执、异常和经营结果证据齐全并获得单独授权后才可进入。

推荐的只读检查：

~~~bash
node scripts/verify-docs-links.mjs
git diff --check
~~~

只有在已获准修改岗位源目录时，才运行 node scripts/build-role-assets.mjs；Pages 文档源发生变化时，先运行 node scripts/build-pages-docs.mjs，再按 .github/workflows/pages.yml 的发布门禁验证。视觉 G2-G6 必须沿各自登记册和审查文档的命令逐门执行，不能跨门宣称通过。

### 4.5 交付与追溯

调用方应保存：源仓库 URL、源 commit、使用的 JSON/文档版本、输入快照 Hash、输出路径、验证命令、时间和结果。源事实变化时建立新版本或新 Bundle，不静默覆写旧结果。公开 Pages 成功只证明静态文件发布，不证明目标项目已经运行或取得经营结果。

## 5. 最小输入与标准产物

### 5.1 最小输入合同

至少记录以下字段；缺失或矛盾时进入 HOLD/Waiting，不要猜测补齐：

- case_id、role_id、主 flow_id、主 scenario_id 和目标环境版本。
- 业务目标、对象范围、统计窗口、输入来源、版本、新鲜度和质量状态。
- 选用的 Soul、Role Playbook、Skill、Preset/Bundle 版本和来源 Hash。
- 允许的读取范围、禁止动作、策略版本、TTL、独立复核者和验收条件。
- 预期产物、接收者、停止条件、异常升级对象和外部回执来源。

### 5.2 ArtifactEnvelope

跨项目实现必须以 [Case Record 契约](docs/07-orchestration/case-record-contract.json) 中的 REC-CASE-ARTIFACT-ENVELOPE 为唯一字段依据。当前契约的必填字段包括 artifact_id、artifact_version、artifact_type_ref、schema_ref、schema_version、case_id、stage_attempt_ref、business_scope_ref、producer_component_ref、source_refs、created_at、status、content_hash 和 classification；从 STG-03 起还需要 role_release_bundle_ref。这里列出的字段是项目契约的摘要，不是另一个可自行发明的导入 schema。

Stage Acceptance 是独立记录，使用 REC-STAGE-ACCEPTANCE 的字段和 gate 决定是否接收；不能用 ArtifactEnvelope 自己的 status 代替验收。冲突、过期、范围不符或来源不可追溯时返回 HOLD/Rework Required，不得在交接时偷偷扩大权限或补造事实。

### 5.3 动作与回执

模型输出的是建议和 Action Intent，而不是外部副作用。Policy Gate 的 ALLOW/HOLD/DENY/NO_ACTION 决策、Execution Broker 的执行记录和权威系统回执必须分开保存。回执不明先查询实际状态；未确认成功前不得盲目重试，已成功动作也不得随整张 Case 重放。

## 6. 失败、冻结与恢复

| 情况 | 处理 | 禁止做法 |
| --- | --- | --- |
| 输入缺失、过期或冲突 | HOLD、补齐来源或退回上阶段 | 把缺失值当作零或用模型猜测 |
| 选择器多匹配或不唯一 | Waiting/Pre-Case Exception，冻结范围 | 先建残缺 Case 或先执行动作 |
| Policy DENY/HOLD | NO_ACTION，保留决策原因 | 通过 Prompt、UI 或重试绕过 |
| 工具限流、版本不明或 schema 不符 | 冻结受影响对象，记录影响范围 | 临时编造配置键或换未审计工具 |
| 外部执行回执不明 | 查询权威状态后再决定补偿/恢复 | 盲目重试或把会话结束当成恢复 |
| 规则、契约或岗位身份变化 | 新版本、新 Bundle、重新评估 | 静默修改已使用的 Bundle |
| 视觉素材异常 | 只按视觉门禁处理 | 用头像相似度改角色、权限或运行身份 |

紧急保护路径也不能绕开模型外控制；恢复、扩大范围、退款、召回、销毁、永久变更和对外承诺只走正常阶段和受控执行主体。

## 7. 复用示例

### 示例 A：复用新品验证能力

1. 从 BVS-02 读取流程目标和边界。
2. 绑定 AGT-008 为主岗位，读取其 Profile、Soul、Role Playbook 和 Preset manifest 引用。
3. 按需要加载研究、工程、供应、合规和验证 Skills，不把所有岗位人格拼进一个总提示词。
4. 用八阶段产物门禁形成机会证据、产品定义、风险矩阵和验证结论。
5. 结果只形成经过验收的决策包或 Action Intent；是否执行由调用方的 Policy Gate、Broker 和授权决定。

### 示例 B：只使用视觉身份

只读取 [visual-identities.json](dist/data/visual-identities.json) 和 dist/assets/visual-identities/ 中的公开交付件，并保留 release_id 和相对路径。Sanbao_Web 的全量 1,848 个图像、102 个 persona family 仍由 VIS-G0/G1/G2 登记册追踪，没有全部物化到 dist；当前公开包只有 53 个身份的 318 个 WebP。不要将 source_persona_id、头像文件或 alt text 当作岗位身份、权限、Case 成员或生产资格。完整来源与门禁须回看 [VIS-G6 证据](docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G6-PUBLIC-DEPLOYMENT-EVIDENCE-2026-09-24.json)。

## 8. 版本、来源与反馈

- 机器事实优先：角色用 role-catalog.json，流用 e2e-value-streams.json，Playbook 用索引文件，Preset 用 manifest，视觉发行用 G6 登记册。
- 状态与取舍优先看 STATUS.md、DECISIONS.md；Markdown 解释不能覆盖机器事实或已确认边界。
- dist/ 是生成的展示投影；源文档变化后必须重建并校验，不能直接手改发布副本。
- 外部仓库只作为来源、方法或静态比较依据，不能由链接推导已安装、已连接或已通过企业验收。
- 反馈应指出 role_id/flow_id/artifact_id、来源版本、复现输入、预期与实际结果；不要提交凭据、客户明细、员工资料或未经批准的业务数据。

## 9. 使用完成清单

- [ ] 已记录调用目标、范围、授权和源 commit。
- [ ] 已读状态、决定、事实/词汇及对应领域入口。
- [ ] 已选择一个主流、一个主场景和一个唯一 Lead。
- [ ] 已读取最小岗位资产集，并核对 Soul、Playbook、Preset 和 Skills 版本。
- [ ] 已声明输入来源、新鲜度、权限、产物 schema、验收和停止条件。
- [ ] 已为每次交接生成并验收 ArtifactEnvelope。
- [ ] 已把 Action Intent、Policy Decision、执行记录和外部回执分开记录。
- [ ] 已完成相应结构、离线、Shadow 或生产门禁，并没有把静态发布当作运行证据。
- [ ] 已保留 provenance、Hash、验证时间、失败记录和回退路径。

## 10. 当前非目标

在另行取得明确授权和目标环境证据前，本 Playbook 不授权：登录或连接 Shopify/企业系统、创建或修改 App/Scope、读取真实客户或员工明细、执行商品/库存/价格/广告/退款/预算动作、发送外部承诺、创建真实 Case、发布生产 Bundle、调整人员编制，或把设计 Blueprint 转成未经核实的导入配置。

