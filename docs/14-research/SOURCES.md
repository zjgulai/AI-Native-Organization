# 来源索引

核实日期：2026-09-11。使用公开第一方资料和源码、本机应用元数据及包内文档，以及用户指定的飞书组织材料。私有材料只在本地保留部门和聚合摘要，没有将人员名册写入本项目或提交给外部研究服务；未读取凭据或私有会话记录。

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

逐项源码路径、固定行号及适配判断见[五项目深度评估](REFERENCE-EVALUATION.md)。本轮没有安装这些参考平台、运行其测试或接入1013家店铺；源码许可仅记录文件标识和边界，未选择具体复用或分发方式。
