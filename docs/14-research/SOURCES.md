# 来源索引

核实日期：2026-09-11至2026-09-17。使用公开第一方资料和源码、本机应用元数据及包内文档、本机 `dsh` CLI 只读探测，以及用户指定的飞书组织材料。私有材料只在本地保留部门和聚合摘要，没有将人员名册写入本项目或提交给外部研究服务；未读取凭据或私有会话记录。

## 公开第一方资料

| ID | 来源 | 支持结论 | 适用限制 |
| --- | --- | --- | --- |
| EVD-001 | [DeepSeek Harness 上游仓库](https://github.com/deepseek-ai/deepseek-harness) | 产品归属、插件化架构及 developer preview 状态 | 当前网页可变化，不替代本机版本证据 |
| EVD-002 | [DSH Desktop 发行方仓库](https://github.com/anywhere-labs/dsh-desktop) | Desktop 为独立社区项目，基于上游 Harness | 不代表 DeepSeek 背书或本机定制版本全部行为 |
| EVD-003 | [Desktop 用户指南](https://github.com/anywhere-labs/dsh-desktop/blob/master/docs/user-guide.md) | Profile 组合、启动失败回退、插件变更后的重启要求 | 发行方当前说明；本机定制构建未做功能验收 |
| EVD-021 | [Anthropic：A guide to the anatomy of effective commerce agents](https://claude.com/blog/the-anatomy-of-effective-commerce-agents)，2026-09-02 | 单上下文所有者、Skills分层、UI工具、模型评估、缓存、资产控制和异步记忆方法 | Commerce场景方法，不证明本企业流程、DeepSeek Harness或业务系统已实现 |
| EVD-022 | [Anthropic官方commerce-agents参考实现](https://github.com/anthropics/commerce-agents)，读取2026-09-11 | Commerce架构、UI Tool契约、只读Delegate、安全与Backend边界示例 | 开放参考代码，不是受支持产品，无SLA；示例认证、权限和数据不能直接用于生产 |
| EVD-023 | [Anthropic：Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)，2025-10-16 | Skill名称/描述预加载与正文按需读取的渐进披露 | Anthropic产品方法；目标Harness须单独验证等价能力 |
| EVD-024 | [Claude Platform：Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)，读取2026-09-11 | `tools → system → messages`缓存前缀、静态内容前置及组织/workspace隔离 | Claude API实现细节；不直接证明DeepSeek Harness缓存行为 |

## 本机安装包证据

核实位置为 `/Applications/DSH Desktop.app`。以下路径相对该应用包，作为此次证据位置；换环境或升级后应重新发现安装位置及版本，不能写死为部署依赖。

读取 `Contents/Info.plist` 与包元数据得到：应用名 LUTE Agentic System，Desktop 2.0.5，构建 2.0.5-lute.2.0.0，Bundle ID `ai.deepseek.dsh.desktop`。`dsh-plugin-desktop` 包版本为 2.0.5，包内 `@deepseek-ai/dsh` 及下列七个插件版本均为 0.1.2-rc.1。

文档根位置为 `Contents/Resources/app.asar.unpacked/node_modules/@deepseek-ai/`；下表路径相对此位置。

| ID | 来源与位置 | 支持结论 | 核实边界 |
| --- | --- | --- | --- |
| EVD-004 | 应用 `Contents/Info.plist`；`Contents/Resources/app.asar.unpacked/package.json`；`dsh/package.json` 及下列插件 package.json | 本机安装包及依赖的身份、声明版本 | 未验证当前 profile 是否实际启用相关包 |
| EVD-005 | `dsh-agent-presets/README.zh.md`，第 12、32、173–177 行 | 会话 preset 组装、继承与切换/发现限制 | 只核实文档，没有创建角色或运行会话 |
| EVD-006 | `dsh-skill-filesystem/README.zh.md`，第 12、36–54 行 | 技能文件格式、发现方式、加载与根目录规则 | 未核实用户当前技能配置 |
| EVD-007 | `dsh-agent-instructions/README.zh.md`，第 12、28–36 行 | AGENTS.md 等工作区指令加载、预算与刷新机制 | 指令加载不证明业务权限隔离 |
| EVD-008 | `dsh-workflow/README.zh.md`，第 12、32、127–131 行 | 脚本编排能力及前台等待、无检查点/恢复等限制 | 未运行 workflow；未检查其他定制组件是否补足 |
| EVD-009 | `dsh-subagent/README.zh.md`，第 165–172 行 | 父子消息、持久化和跨进程协作限制 | 不外推至其他消息组件 |
| EVD-010 | `dsh-user-approval/README.zh.md`，第 52、154–157 行 | 工具审批和审计接口，一次性/轮次内限制、无应答者拒绝 | 不证明企业业务授权系统已存在 |
| EVD-011 | `dsh-session-persistence/README.zh.md`，第 46–54 行 | 会话持久化、加载和崩溃恢复语义 | 不证明外部业务动作或 workflow 可以恢复 |
| EVD-020 | `dsh-tools/README.zh.md`，第 81、85、89、130 行；`dsh-mcp-client/README.zh.md`，第 28、57、70、83、91、105、123–133 行 | 本机文档说明工具scope限制、单调guard、工具展示意图，以及MCP的stdio/Streamable HTTP桥接、稳定命名、超时、重连和环境清洗 | 仅为本机安装包文档；目标企业环境的插件、Host展示、认证、schema和服务端策略未验证 |
| EVD-029 | 本机 `/opt/homebrew/bin/dsh --version` 与 `dsh --help`，只读探测2026-09-17 | CLI 版本为 `0.1.5-rc.1`；启动器以 profile、patch、plugin 和 web 命令组织配置；帮助中没有独立 `preset` 子命令 | CLI 版本与应用包内声明的 `@deepseek-ai/dsh` `0.1.2-rc.1` 不同；未启动新profile、未导入配置、未连接业务系统；不能据此推断目标企业环境schema |

能力综合判断见 [平台矩阵](../10-platform/deepseek-harness/CAPABILITY-MATRIX.md)。本机安装包不是企业目标环境的已确认样本；是否用于最终落地留待平台阶段确认。

企业陈述及未知项单独见 [事实表](../01-discovery/FACTS.md)。后续证据继续使用 `EVD-xxx`，记录来源、时间、版本、方法、结论与限制，区分资料、配置、测试、试点及生产验收。

## 企业材料与五项目研究

| ID | 来源与版本 | 已检查的内容 | 限制 |
| --- | --- | --- | --- |
| EVD-012 | [公司组织架构（2026-09快照）](https://momcozy-in.feishu.cn/docx/VbazdHJSfowsnVx1ybrcM9gmn0g)，统计2026-09-10，读取2026-09-11 | 已登录Chrome中读取总览、部门结构和统计限制；[本地评估](../01-discovery/ORGANIZATION-ASSESSMENT.md) | 虚拟滚动逐段读取；部分层级未知/受限；总览与明细存在差异，不是员工去重审计 |
| EVD-013 | [CodexLoom](https://github.com/yan5xu/codexloom/tree/332d4a853719285aa5cfd8120c35fa804add4254)，commit `332d4a853719285aa5cfd8120c35fa804add4254` | Profile、Topic、Membership、Outbox及ELv2许可 | 静态源码检查，未安装或执行测试 |
| EVD-014 | [StaffDeck](https://github.com/OpenBMB/StaffDeck/tree/c6b7cfc2bf7207e40a8432b853d68e3934b1845d)，commit `c6b7cfc2bf7207e40a8432b853d68e3934b1845d` | 团队任务状态、SOP工具授权、租户权限、运行恢复及AGPL-3.0许可 | 该项目自有Harness；未证明与DeepSeek配置兼容 |
| EVD-015 | [AgentSpace](https://github.com/HKUDS/AgentSpace/tree/0f9da1b125def4d5a0d05b34bf7c5cec0686bbf2)，commit `0f9da1b125def4d5a0d05b34bf7c5cec0686bbf2` | 权限主体/资源、任务领取、审批服务及Apache-2.0许可 | 入口代码存在不证明所有访问路径均已有效防护 |
| EVD-016 | [OpenOPC](https://github.com/HKUDS/OpenOPC/tree/14ab6d7a525f623596459f31d339d7064b0806df)，commit `14ab6d7a525f623596459f31d339d7064b0806df` | 工作项状态转换、控制器租约、角色经验及MIT许可 | 通用组织流程未在本企业电商业务中验证 |
| EVD-017 | [Hive](https://github.com/tt-a1i/hive/tree/1096789b17cc8215869616d21aa6e76cd139eb19)，commit `1096789b17cc8215869616d21aa6e76cd139eb19` | team身份、派发台账、公共源码基线声明、安全说明与BUSL-1.1许可 | 固定公共源码基线，不能当成当前npm发行能力；不是企业多租户安全边界 |
| EVD-018 | [Amazon SP-API使用计划与限流](https://developer-docs.amazon/sp-api/docs/usage-plans-and-rate-limits)，读取2026-09-11 | 操作、账号/应用等限流因素与事件/批量建议 | 未取得本企业授权、接口配置或实际额度 |
| EVD-019 | [公司平台和系统全景图（2026-09快照）](https://momcozy-in.feishu.cn/docx/Bvy2dzO2aokqRgxZEYEcahDCnye)，读取2026-09-11 | 已登录Chrome中读取六类约70+系统/平台、RootData、PLM/ERP/QMS/WMS/TMS、Amazon/Shopify/CRM、品牌AI平台和既有Agent规划；[接入盘点](../10-platform/deepseek-harness/SYSTEM-INTEGRATION-INVENTORY.md) | 材料混合上线、在建、规划和调研；不保存人员或凭据，且不证明接口、读写权限、数据质量或运行效果 |
| EVD-025 | Magpie-Horch本地仓库，HEAD af5f2ede6092a38fcb7d119571667771004bf416，读取与只读验证2026-09-15至2026-09-16；[深度研究](MAGPIE-HORCH-DEEP-RESEARCH.md) | 五类26个受管包、岗位Preset编译、Skill供应、企业连接、桌面表面、确定性Gate、同源发行与回退；根Gate实测61/61，岗位无损校验另有50项L10头像源失败 | 工作区含非本任务WIP；HEAD内容与当前工作树实测分别记录；本地门禁不证明企业生产连接、写入授权或经营效果 |
| EVD-035 | Magpie-Horch当前工作树固定参照，`vendor/dsh-desktop.pin`与嵌套Harness源码，读取与只读验证2026-09-17；[RP-M1 schema与适配证据](../10-platform/deepseek-harness/MAGPIE-RP-M1-SCHEMA-EVIDENCE.md) | vendor pin的Desktop/Harness运行时版本；官方preset元数据、mount/composeFrom/select会话语义；`dsh-skill-subset`白名单/遮蔽/source边界；team-gui的Agent/Squad schema与成员上限；当前generator九类旧材料范围 | 这是源码与固定参照证据，不代表企业目标Host版本、导入schema、服务端权限或外部Case Control已经实现；Magpie工作树原有dirty changes未接管，本轮未修改代码或派生preset |
| EVD-026 | Shopify官方[Dev Dashboard App](https://shopify.dev/docs/apps/build/dev-dashboard/create-apps-using-dev-dashboard)、[Client credentials](https://shopify.dev/docs/apps/build/authentication-authorization/client-credentials-grant)与[旧式Admin custom app](https://shopify.dev/docs/apps/build/authentication-authorization/legacy/admin-custom-apps)，读取2026-09-16 | 新App创建/版本/Scopes、自有组织商店服务端认证及旧式入口停止新建 | 官方产品规则不证明Momcozy商店与App属于同一Shopify Organization，也不证明已有App、权限或凭据可用 |
| EVD-027 | Shopify官方[Sales reports](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/sales-report)、[Exporting reports](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/custom-reports/export-reports)、[Reports](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types)与[Analytics fields](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/analytics-fields)，读取2026-09-16 | `Total sales by product variant`的Variant SKU、Net quantity与gross sales语义；Admin报告可导出；页面1,000行上限与字段维度/指标定义 | 不证明目标Shop套餐、具体报告配置、字段、过滤器或完整导出已可用；也不证明已读取或导出Momcozy数据 |
| EVD-028 | Shopify官方[Product details](https://help.shopify.com/en/manual/products/details/product-details-page)、[Tags](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/using-tags)、[Metafield definitions](https://help.shopify.com/en/manual/custom-data/metafields/metafield-definitions)、[Product对象](https://shopify.dev/docs/api/admin-graphql/latest/objects/product)与[Products查询](https://shopify.dev/docs/api/admin-graphql/latest/queries/products)，读取2026-09-16 | Product type是商家定义的单一自定义类型；tags是产品级可搜索多值关键词；metafield定义可约束类型与校验；Product对象可读取productType、tags、metafields及variants，Products查询支持相关筛选 | 不证明目标Shop已按任一字段完整维护可穿戴式吸奶器分类，也不证明字段值、覆盖率、冲突优先级、读取权限或API调用已验证 |
| EVD-029 | Shopify官方[Metafield definitions](https://help.shopify.com/en/manual/custom-data/metafields/metafield-definitions)、[定义组成](https://help.shopify.com/en/manual/custom-data/metafields/metafield-definitions/metafield-definition-parts)、[Metafield类型](https://help.shopify.com/en/manual/custom-data/metafields/metafield-definitions/metafield-types)与[MetafieldDefinition对象](https://shopify.dev/docs/api/admin-graphql/latest/objects/MetafieldDefinition)，读取2026-09-16 | Definition绑定owner type、namespace/key、数据类型、校验与访问设置；Product owner可使用单行文本，且可配置预设选项 | 不证明目标Shop已有可复用定义、定义或值已创建/写入、字段覆盖完整、访问设置获批或API读取已发生 |
| EVD-030 | Shopify官方[Access scopes](https://shopify.dev/docs/api/usage/access-scopes)、[Manage access scopes](https://shopify.dev/docs/apps/build/authentication-authorization/manage-access-scopes)、[Protected Customer Data](https://shopify.dev/docs/apps/launch/protected-customer-data)与[API versioning](https://shopify.dev/docs/api/usage/versioning)，读取2026-09-16 | 订单默认读取窗口为最近60天，扩大历史范围需`read_all_orders`；实际授权可由`currentAppInstallation.accessScopes`读取；订单属于Protected Customer Data，直接身份字段需要更高等级；稳定API按季度发布且调用应固定版本并核对响应版本头 | 不证明目标App已获任何Scope或Protected Customer Data批准，也不证明App/Shop已创建、安装、交换Token或执行API调用；企业仍须按最小必要原则决定字段、存储、保留和审计 |
| EVD-031 | Shopify官方[Protected Customer Data](https://shopify.dev/docs/apps/launch/protected-customer-data)、[Order](https://shopify.dev/docs/api/admin-graphql/latest/objects/Order)、[LineItem](https://shopify.dev/docs/api/admin-graphql/latest/objects/LineItem)、[orders query](https://shopify.dev/docs/api/admin-graphql/latest/queries/orders)与[Security best practices](https://shopify.dev/docs/apps/build/security/following-security-best-practices)，读取2026-09-16 | Level 1排除姓名、地址、电话和邮箱等直接身份数据；Order/LineItem提供SKU、数量、时间、状态和MoneyBag字段；Query应限制用途和窗口；受保护数据须最小化、限制访问、记录读取者、设定保留并验证删除 | 不证明目标App的分发方式、Level 1资格或字段访问已获批准；45天是企业D-048决定而非Shopify规定期限，正式Query字段、Hash与保留控制仍须按固定API版本和目标环境验证 |
| EVD-032 | Shopify官方[Protected Customer Data](https://shopify.dev/docs/apps/launch/protected-customer-data)、[Dev Dashboard App](https://shopify.dev/docs/apps/build/dev-dashboard/create-apps-using-dev-dashboard)、[Distribution methods](https://shopify.dev/docs/apps/launch/distribution/select-distribution-method)、[Client credentials](https://shopify.dev/docs/apps/build/authentication-authorization/client-credentials-grant)与[Dev Dashboard user permissions](https://shopify.dev/docs/apps/build/dev-dashboard/user-permissions)，读取2026-09-16 | Level 1对public app需要review，对custom app和admin-created custom app可用；分发方式影响适用路径且选择后不可更改；`client_credentials`要求App与Shop属于同一Shopify Organization；Dev Dashboard观察还受用户App权限约束 | 官方矩阵不能证明目标App类型、Organization关系、分发状态、PCD面板状态、Data protection要求、Scope或用户权限；目标页面当前停在Shopify连接验证，`L1Q-E01`至`L1Q-E09`均未观察，未创建/修改App、未交换Token且未调用API |
| EVD-033 | Shopify官方[新店通用清单](https://help.shopify.com/en/manual/intro-to-shopify/initial-setup/new-to-shopify-checklists/general-checklist)、[商品管理](https://help.shopify.com/en/manual/products)、[商品变体](https://help.shopify.com/en/manual/products/variants/add-variants)、[库存设置](https://help.shopify.com/en/manual/products/inventory/setup)、[测试订单](https://help.shopify.com/en/manual/checkout-settings/test-orders)与[Dev Dashboard App](https://shopify.dev/docs/apps/build/dev-dashboard/create-apps-using-dev-dashboard)，读取2026-09-16 | 绿地店铺需依次完成店铺/市场/税/支付/运费/政策/结账等基础配置；商品以标题和价格为最低输入并补齐媒体、库存、变体和metafield；test order用于验证结账、订单处理、库存、运费、通知和税 | 仅定义官方操作基线，不证明目标Shop已完成设置、存在草稿或上线商品、具备付费计划、已创建App或可以执行测试订单；目标店空白状态来自F-039用户陈述 |
| EVD-034 | GitHub官方[配置Pages发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[使用自定义GitHub Actions工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)与[官方static.yml模板](https://github.com/actions/starter-workflows/blob/main/pages/static.yml)，读取2026-09-16 | GitHub Pages可由自定义Actions workflow上传静态artifact并使用`deploy-pages`发布；workflow需声明Pages与OIDC权限 | 只支持本项目文档Site的公开发布，不证明企业系统、Shopify、Agent Runtime或经营流程已上线 |
| EVD-036 | 管理层外部证据调研：[AI原生组织架构与多智能体协作](AI-NATIVE-ORG-MANAGEMENT-LAYER.md)，调研日期2026-09-18 | 主流多智能体框架（Anthropic orchestrator-workers、OpenAI Agents SDK的manager与handoffs、Microsoft AutoGen与Agent Framework的Magentic、LangGraph supervisor、CrewAI hierarchical、Google ADK coordinator）对管理者节点的官方职责定义；各框架关于何时不该使用管理层的官方口径；AI用于削减中层的公开数据；多智能体token成本量级 | 逐条标注证据强度（官方文档／一手材料／二手报道），并单列反面证据与证据缺口；调研中途遭遇检索配额限流，受限项已在文档内标注。该记录不证明本项目管理层已运行、已获授权或已验证效果 |
| EVD-037 | 多智能体系统的控制与治理官方一手资料汇编：[MULTI-AGENT-GOVERNANCE-SOURCES.md](MULTI-AGENT-GOVERNANCE-SOURCES.md)，汇编日期2026-09-18 | NIST AI RMF与生成式AI Profile、OWASP、云厂商与标准机构关于agent身份、委派链、最小权限、预算配额、审计与人在环升级的官方文本 | 证据强度分强/中/弱三档并逐条标注；仅汇编文件内容，不含设计建议。抓取受限页面已在文末单列，未取得一手原文的按弱标注 |
| EVD-038 | 管理幅度与「管理层是否创造价值」证据汇编：[SPAN-OF-CONTROL-AND-METRICS.md](SPAN-OF-CONTROL-AND-METRICS.md)，汇编日期2026-09-18 | 传统管理幅度经典出处与2020–2026实务数据；各框架的并发/扇出上限；agent数量与性能的规模化规律；MIT NANDA、Gartner等关于AI试点ROI与组织变革失败的统计；厂商自述解决率与独立审计的差距 | 每个数字标注口径+时间+来源；被Cloudflare拦截的页面正文取自索引内容并标注「建议人工复核」。该汇编不证明本项目管理层编制正确或已创造价值 |
| EVD-039 | AI原生公司公开案例逐案详版：[AI-NATIVE-ORG-PUBLIC-CASES.md](AI-NATIVE-ORG-PUBLIC-CASES.md)，2026-09-18 | Coinbase（SEC 8-K）、Amazon、Shopify、Klarna 等公开组织调整的一手口径与常被误引数字的更正：「Block 2025年砍约40%」查无来源（可核实的近半裁员为2026-02-26）；Salesforce的4,000是客服支持岗口径非全公司；Klarna播客「7,000→3,000」与年报FTE口径冲突，应只用年报 | 逐条标注一手／二手与未核实项（含13条未核实清单）；本记录只核实公开口径，不证明本项目管理层设计正确 |

逐项源码路径、固定行号及适配判断见[五项目深度评估](REFERENCE-EVALUATION.md)。本轮没有安装这些参考平台、运行其测试或接入1013家店铺；源码许可仅记录文件标识和边界，未选择具体复用或分发方式。
