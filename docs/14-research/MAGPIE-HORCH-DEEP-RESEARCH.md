# Magpie-Horch端到端能力闭环深度研究

状态：本地源码与运行门禁实测，结论用于架构适配。未修改Magpie-Horch仓库，未验证企业生产连接或经营效果。

## 1. 研究结论

Magpie-Horch不是一套直接经营Amazon或Shopify的业务Agent，而是一条面向DSH Desktop二次开发的能力供应与发行链。它已经把“能力来源—分类—岗位装配—工具连接—桌面表面—确定性门禁—安装与回退”连接起来，最有价值的资产是编译、治理和发行机制。

它没有闭合企业经营结果。仓库能证明某个岗位Preset被生成、某条Skill被装配、某个连接器可探测、某个安装包通过既定Gate；这些证据不能证明GMV增长、补货到仓、客户问题解决或质量事件恢复。AI组织变革应把Magpie放在四条能力供应价值流中，并让八条业务经营价值流负责业务结果。

采用结论：

| 处理 | 机制 | 原因 |
| --- | --- | --- |
| 直接采用 | 单一事实源到运行Preset的编译；Skill分层与subset；凭据隔离；确定性Gate/selftest；同源打包、原子安装与回退；LoopX目标账本 | 与五契约、不可变Bundle、产物门禁和可回退运行一致 |
| 约束后采用 | MCP/API/Tool连接器、工具UI、本地任务板、Agent Team运行历史 | 连接器需补Policy Gate与Execution Broker；任务板只作Case UI投影；Team只复用持久运行、DAG、幂等与回执模式 |
| 不采用 | LLM多Agent路由、岗位Agent自由互聊、把直接写资产的工具交给模型、用安装/路由指标代替业务验收 | 与D-020、D-029及业务结果责任冲突 |

## 2. 证据基线

| 项目 | 观察结果 |
| --- | --- |
| 证据仓库 | Magpie-Horch，origin指向zjgulai/lute-dsh-platform |
| 固定HEAD | af5f2ede6092a38fcb7d119571667771004bf416 |
| 观察时间 | 2026-09-15至2026-09-16，Asia/Shanghai |
| 工作区状态 | main分支存在与本任务无关的已修改和未跟踪文件；研究包含HEAD内容与只读运行观察，二者分别标注 |
| 仓库处理 | 全程只读；没有修改、提交、推送或打包 |
| 根快速门禁 | pnpm run gate实测61/61通过，约43秒 |
| 岗位Preset dry-run | 50岗位、350个岗位卡章节、5/35/5/5四平面；1189条skill-subset引用；运行Skill库1719项；1项实质Skill缺口 |
| Skill Contract观察 | 139份契约、348条绑定引用、143项唯一paper2skills Skill；80项已有契约、63项待补 |
| 无损校验 | verify-lossless实测50个岗位均在L10头像源一致性失败；其他断言推进到4806项 |

以上数字是该工作树在观察时点的本地结果，会随仓库变化。快速门禁绿色与无损校验失败可以同时成立，说明根Gate当前没有覆盖全部岗位产品一致性；不能把61/61提升为完整端到端验收。

## 3. 它实际设计的端到端闭环

~~~mermaid
flowchart LR
    A[外部Skill源与AI组织事实源] --> B[分类、契约与来源治理]
    B --> C[岗位Preset与Skill subset编译]
    C --> D[Profile、Bundle与运行槽装配]
    D --> E[MCP、API、Tool与凭据服务]
    E --> F[工作台、角色矩阵、Skill Center与App入口]
    F --> G[Gate、selftest与验收脚本]
    G --> H[同源打包、签名、原子安装与回退]
    H --> I[运行状态、成本与LoopX目标反馈]
    I --> A
~~~

### 3.1 能力来源与分类

- dsh-overseas-skills以“场景—平面—专业域—岗位—Skill Card”组织海外能力，区分能力分配与真实运行装配。
- dsh-paper2skills把论文与方法映射到四平面、八专业域和细分业务，保留来源、分类、代码可用性与评测。
- AI组织变革的50岗位、流程、生命周期和协同JSON已经被role-presets生成器读取，是岗位运行产品的上游事实源。

这形成了正确的两本账：候选能力库存与某岗位实际可见能力不可混用。

### 3.2 岗位编译与运行装配

role-presets生成器读取岗位卡、岗位目录、组织图、管理图、生命周期、协同图、流程、Playbook和Roster九类来源，生成每个岗位的preset.yml、manifest.json和agent.cordis.yml。它把岗位人格、平面、专业域、Skill subset、Playbook、场景和流程关系编译进运行候选。

生成物不提交到组织设计仓库，岗位事实仍由AI组织变革维护。删除Preset前还必须验证历史会话引用，因为已有会话会冻结Preset ID。这个约束与本项目“Case固定Role Release Bundle，运行中不静默升级”一致。

### 3.3 企业连接与工具表面

dsh-wanzh-hulian统一呈现MCP、API、企业App和知识库连接；credential-service把秘密留在模型上下文和仓库之外，并用文件权限与探针验证连接状态。dsh-overseas-tools提供工具层扩展。工作台、Skill Center、角色矩阵和App启动器把能力做成用户可操作的表面。

现有连接层允许出现写能力，但没有实现本项目所需的完整业务资产控制链：Action Intent、Policy Gate、Service Identity、Execution Broker、逐对象幂等回执和外部状态核对。因此连接器可复用，授权模型必须补齐。

### 3.4 验证、发行与恢复

根Gate把包身份、上游Pin、Profile同步、Live Preset、插件入口、Release、文档、Skill Line和selftest收敛到一次确定性检查。packaging链路进一步完成同源profile/payload装配、签名或Hash、DMG、安装验证、用户数据保留和回退。

这一段是Magpie最完整的闭环：它交付“可重复安装且可回退的能力版本”。它仍需要业务任务评测作为上层门禁，原因已有内部反证：paper2skills的历史holdout中，路由表现较好，但使用Skill后的业务交付分数曾下降0.95。这证明检索命中、Skill安装和任务结果必须分开测量。

## 4. 与AI组织变革架构的逐层映射

| Magpie机制 | AI组织变革目标位置 | 采用方式 | 缺口 |
| --- | --- | --- | --- |
| role-presets生成器 | CVS-01岗位与场景产品化 | 从50岗位事实源编译五契约引用和Preset | 补不可变Bundle Hash、生命周期状态、Access/Assurance实质门禁 |
| overseas-skills、paper2skills | CVS-02知识与Skill供应 | 建候选库、来源链、subset和按需加载 | 以业务闭环增益取代“有Skill/路由命中”作为发布标准 |
| wanzh-hulian、overseas-tools | CVS-03连接器工厂 | 复用凭据隔离、连接元数据、探针和Tool UI | 写动作统一经过模型外Policy Gate与Execution Broker |
| quick/full gate、packaging | CVS-04 Release与可靠性 | 复用确定性检查、同源打包、原子安装和回退 | 扩大Gate覆盖到岗位无损、真实连接、业务任务和外部回执 |
| worktable、task-board | 12条价值流的Case UI | 作为工单和证据的只读/受控投影 | 业务事实仍由system-of-record与Case/Event Ledger维护 |
| agent-team-gui | 运行观察和持久执行模式 | 只复用DAG、历史、幂等和回执结构 | 不运行岗位Agent小队、不建立Agent间自由对话 |
| LoopX插件 | BVS-08与项目控制 | 维护Goal、Todo、状态和证据 | 不承担业务资产授权或生产执行 |
| cost-guard | BVS-08运行经济性 | 提供只读成本归因与护栏建议 | 不代替预算授权或经营效果 |

## 5. 端到端断点

### 5.1 经营对象与权威数据未绑定

Magpie管理的是能力包、Profile、Plugin、Skill和桌面运行状态。订单、广告、价格、库存、客户、商品、结算、质量和账号事件的权威对象、主键、口径与时间性并未在该仓库形成企业契约。没有这一层，Agent只能完成能力动作，不能证明业务闭环。

### 5.2 写能力和资产权限之间缺少硬边界

凭据不可见能降低泄露风险，但不能回答“谁可在什么对象、金额、频率和时间内执行什么动作”。所有生产写连接都要经过Access Contract、Policy Gate和Execution Broker，工具描述不能充当授权系统。

### 5.3 运行形态需要从Agent Team收敛为单Case

Magpie的Agent Team能力适合并行研究或工程任务。企业经营场景采用一个Case Agent，其他岗位只贡献Skills、类型化产物和Assurance规则。这样才能保持一个上下文所有者、一个业务状态和一条可核对的动作链。

### 5.4 绿色门禁存在覆盖缺口

61/61根Gate通过时，50个岗位的头像源一致性仍全部失败。这不是要放松无损校验，而是说明发布证据必须明确列出覆盖面。CVS-04需要把角色无损、Skill业务增益、连接器真实探针、Policy/Broker和业务回执分别作为门禁。

### 5.5 本地任务状态不是企业事实账本

本地原子JSON适合桌面交互和开发编排，不能替代企业订单、库存、结算、质量或客户系统。Site和工具卡只显示引用与状态，权威字段由业务系统或Case/Event Ledger提供。

## 6. 适配后的完整闭环

完整体系由两类正交价值流构成：

1. 八条业务经营流BVS-01至BVS-08，从经营信号出发，以业务结果、外部回执和约束核对闭环。
2. 四条能力供应流CVS-01至CVS-04，从能力缺口或变更出发，分别以岗位Bundle、Skill绑定、连接器验收和可回退Release闭环。

业务流在运行中发现能力缺口时，生成关联但状态独立的能力供应Case；能力流交付新版本后，只允许新建业务Case显式固定该版本。两类流不共享隐式状态，也不把平台发布成功当成经营成功。

详细的12条流、两种工作流和50岗位分工见[端到端价值流设计](../03-scenarios/END-TO-END-VALUE-STREAMS.md)及[结构化目录](../03-scenarios/e2e-value-streams.json)。

## 7. 历史研究建议与当前路线

以下Amazon US建议是D-030时期的历史研究结论，现作为后续渠道模板，不是当前下一步：

1. Amazon订单、广告、价格、库存与退款的system-of-record和主键。
2. GMV、取消退款、广告成本、库存风险及观察窗口的数据契约。
3. 只读连接的真实探针与数据质量基线。
4. 写动作模板、对象范围、Policy决议、Service Identity、幂等和逐对象回执。
5. 无Skill基线与使用Skill的任务闭环对照。
6. Role Bundle、连接器与Release的联合回退演练。

当前路线由D-050和D-051替代：先完成全景方案与Shopify店铺治理底座方案静态审阅，不实例化Case或连接业务系统。未来若独立授权Shopify实施，再按`SHOP-G2`至`SHOP-G7`逐门取证；Shopify闭环以后才以独立渠道Case重新启用本节Amazon模板。

在这些证据完成前，Magpie提供的是可复用平台能力和本地验证证据，不是百亿规模经营自治的生产验收。
