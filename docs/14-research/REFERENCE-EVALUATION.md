# 五个 Agent 组织项目与 Momcozy 适配评估

建议将长期岗位身份、场景工作单、受控业务动作和结果反馈作为最少必要机制。DeepSeek Harness保留为目标执行层；五个参考项目用于验证组织与运行机制，暂不同时引入多套运行时。这个选择可减少身份、任务状态、记忆、权限和业务结果的重复维护。

v1.1调整：本研究中的人机审批/真人责任建议来自当时的候选模型。用户已决定初始采用Agent-first自主闭环，因此这些机制现在只作为未来HITL候选，不作为初始运行节点；动作策略、工具范围、回执和自治异常取代常规人工审批链。

Momcozy的特定问题是大规模多店铺经营、单品牌与吸奶器集中、OEM与内部研发并存，以及数字化和业务之间的责任与响应问题。公开项目中的个人生产力、软件开发或数字员工演示，不能直接证明这些经营问题已经解决。

## 比较结论

| 项目 | 核心对象与特点 | 最值得借鉴 | 适配限制 |
| --- | --- | --- | --- |
| CodexLoom | 长期Domain Agent、Profile、Topic、外部会话Membership | 稳定职责身份；组织关系、协作关系和实际活动分别记录 | 依赖Codex线程语义，主要面向单Owner；不是已验证企业经营总控 |
| StaffDeck | 数字员工、知识、SOP、团队任务及自己的Harness | 将专家方法编译为可运行SOP；验收/返工状态；服务端技能工具授权 | 自有运行层与DeepSeek Harness不同；SOP正确不代表外部业务交易正确 |
| AgentSpace | 人与Agent共享Workspace、资源权限、审批与多运行时 | 资源访问、运行绑定和审批/审查视图 | 通用Workspace边界需映射品牌/账号/商品业务边界；连接Harness仍需验证 |
| OpenOPC | 按任务组织角色、委派工作项、评审、角色经验 | 场景驱动分工；单一任务状态入口；恢复时保持身份与责任 | 自发招募和无限扩张不符合约50岗位约束；通用任务完成不等于经营闭环 |
| Hive | 多CLI真实PTY进程、team协议和派发记录 | 小型任务组、显式交接、派发与报告分离 | 公共源码基线与当前发行能力分开；官方明确无多用户安全边界和Agent沙箱 |

上表是基于固定源码快照的设计判断。没有安装这些平台、执行其测试、接入企业系统或进行1013店铺负载试验；代码存在、项目测试存在和实际运行通过分别计证据。[^1][^2][^3][^4][^5]

## CodexLoom

CodexLoom的关键价值在长期职责：身份保持稳定，当前任务可以变化。`AgentProfile`将Identity、Domain、Scope分别保存，协作关系独立于单次线程消息；Topic保存有边界的问题、参与者、等待条件与引用。它适合解释“AI岗位为什么长期存在、谁该接收哪类问题”，而不是给每次活动重新生成几十个角色。[^6][^7]

对外动作并非仅依赖提示词自律。`SendExternal`检查Membership是否启用、是否允许主动发送、地址是否属于当前Agent、连接是否支持动作，并要求主动发送有幂等键。可以借鉴“声明身份—授权边界—动作记录”的链条，用于企业通知、供应商交接和对外承诺。它提供的是已观察到的消息边界，不是Amazon改价、补货或支付的现成控制。[^8]

建议迁移长期岗位ID、简短职责说明、有边界的协作主题和标准产物交接。长期企业事实应由业务记录和经批准的知识维护；岗位会话提供工作连续性。Codex绑定、单Owner产品方向及ELv2许可决定了不能把它当作可直接复制进Harness的通用企业底座。[^1][^9]

## StaffDeck

StaffDeck强调从经验、判断规则、文档和SOP形成数字员工。其团队服务实现了blocked、pending、bidding、in_progress、review、done、rework、escalated等状态，并把批准、返工、升级映射为显式结果。这比只让多个角色互相聊天更接近可验收交付。[^2][^10]

两个细节对本项目尤其有用。第一，SOP工具授权上下文由服务端根据已验证、展开后的节点生成，并校验租户，不能由工具参数或请求元数据自行声明。第二，恢复逻辑处理遗弃运行、保留检查点并形成失败答复；其意义是先明确一次执行究竟发生了什么，再决定如何继续。[^11][^12]

权限代码还区分租户管理员、员工创建者、可见员工和可管理员工，说明管理视图与行为权限可以分别表达。此处并不证明所有工具入口都完成相同校验，也不证明外部交易可撤销。[^13]

建议重点借鉴版本化SOP、节点输入/输出、工具允许清单、验收返工和失败重入。SOP中的业务步骤要由经营知识定义；跨店铺写入另需账号、预算与动作级控制。StaffDeck文件中的Harness为该项目自有实现，不是DeepSeek Harness的配置schema。源码许可为AGPL-3.0，源码复用需按实际分发和部署方式核对条件。[^12][^14]

## AgentSpace

AgentSpace把人与Agent放在共同Workspace中，并区分员工身份、负责人、知识、运行环境、审批与外部集成。权限模型列出human、agent、daemon token、OAuth credential等主体，以及workspace、channel、document、skill、runtime等资源。对Momcozy有价值的是：岗位存在、谁拥有它、它在哪个账号范围运行和谁批准动作，应当能够分别查看。[^3][^15]

任务队列有持久化记录，领取路径在事务内把queued更新为claimed，并保留运行绑定信息。审批服务有创建、审阅、通知和执行事件记录。可以借鉴持久任务与审批关联，避免待办只留在聊天里。仅凭这些入口还不能断言多实例下所有领取、授权和副作用都具备企业要求的完整保证。[^16][^17]

建议借鉴资源权限视图、运行绑定和审查入口，复用企业已经存在的身份体系。50个岗位可以服务多个范围，但每次运行必须确定具体品牌、市场和账号。多运行时能力对未来有用，首版应以一个明确的Harness适配路径证明闭环。AgentSpace源码为Apache-2.0；本轮未验证其托管与自托管能力相等的宣传结论。[^3][^18]

## OpenOPC

OpenOPC以目标驱动角色组建、任务委派和结果学习，最接近“通过场景组织岗位”的思想。值得保留的是长期角色能力和临时场景组合的分离：某次新品验证使用一小组必要角色，任务结束后产物和经验保留，其他岗位无需参与。[^4]

实现中`transition_work_item`集中工作项phase变化，联动下游状态并记录转换理由；它还处理claim释放与依赖关系。控制器使用带generation的租约语境来识别过期运行。核心启示是一个业务工作项需要一个权威状态来源，聊天、看板和运行会话应引用该状态。[^19][^20]

角色经验模块积累工作模式、复核偏好和复用检查项。迁移时应将经验先形成候选规则，经过业务复核和回放后发布；不能让一次偶然成功自动变成所有店铺的长期策略。[^21]

建议采用已登记50岗位中的按需组队、明确委派和独立验收，限制角色扩张与递归委派。需要外部专业能力时接入经审阅技能或受控外部执行主体；新增AI岗位属于组织版本变更。OpenOPC源码为MIT，但案例覆盖电商不等于已具备Momcozy的账号、资金、产品与物理履约契约。[^4][^22]

## Hive

Hive的公共源码基线是可见的多CLI进程协作工具。角色命令表区分调度者可send/list/cancel，工作者可report/status，并校验Agent token及Workspace内身份。派发台账区分queued、submitted、reported、cancelled。因此“任务送出”和“工作结果回报”有独立记录，适合借鉴为执行控制台的基本语义。[^23][^24]

其README明确公共仓库为源码基线，当前面向用户的发行另有npm包；Auto-staff、Workflows等宣传能力不能仅凭旧源码目录的存在推定已核实。官方安全说明把Hive定位为本地开发工具，说明worker具有启动用户的shell权限，且没有多用户安全边界或Agent沙箱。team协议校验不应被当成企业账号和数据隔离。[^5][^25]

建议借鉴有限任务组、明确命令、派发回执和受控运行观察，生产执行通过Harness及受控业务工具完成。当前LICENSE说明较新版本使用BUSL-1.1，较早Apache版本及未来转换日期另列；本次评估不把它统称为无限制开源软件。[^26]

## 共性、差异与第一性原理

五者共同需要身份、任务、上下文、工具、产物和运行状态；差异在于主要负责哪一段。CodexLoom突出长期责任和边界，StaffDeck突出SOP与知识复用，AgentSpace突出人机共同治理，OpenOPC突出任务驱动组织，Hive突出进程执行与派发。没有必要为获得这五种思想同时部署五个平台。

建议首版稳定六个业务对象：**岗位、场景工单、证据产物、Agent匹配、动作策略、动作回执**。岗位定义长期责任；场景工单定义本次目标、范围、状态和唯一AI结果负责人；产物携带来源与结果；Agent匹配解释小型任务组；动作策略和回执共同决定业务系统动作是否可被信任。记忆是经审阅产物的复用，协同图是这些对象之间的关系，运行会话是承载一次工作的工具。

确定规则适合由现有系统、接口和状态机执行；AI负责信息不完整时的分析、候选方案、内容生产、异常解释与协调。GMV提升需要记录执行前后效果、对照和混杂因素；任务数、Token、聊天活跃度、生成报告数都不能独立代表增长贡献。

## 对 Momcozy 的适配

1013家店铺与2000+SKU需要按真实经营关系分组。不能把两者做笛卡尔积后逐项启动AI，也不能共享全部店铺凭据给一个会话。Amazon官方说明，API限额涉及操作、账号与应用组合、区域等因素，并建议采用事件与批量能力改善请求方式。具体权限和限额必须按实际接口核实。[^27]

候选组织以50种长期岗位覆盖全部职能，以8类跨职能流程连接约20个业务场景。日常存量增长与新品商业验证分别有AI结果负责人和评估方式；数据/工具建设围绕场景产物交付。AGT-045至050承担可用数据产品、可执行工具和运行可靠性，动作策略和数据契约承载口径、优先级和经营验收。

DeepSeek Harness的本机0.1.2-rc.1文档提供preset、skill和子Agent协作，但workflow没有检查点和重启续跑，原生工具审批也不能直接替代持久业务授权。应先盘点企业现有任务、审批、数据及工具系统，复用其中可满足要求的部分；缺口再以最小服务或插件补足。此处是候选架构，尚未选定数据库、部署方式或生产权限。[^28]

## 来源

以下公开源码均固定到本次读取的HEAD，核实日期2026-09-11。代码为静态检查，未执行项目测试；后续更新需要重新核对。

[^1]: yan5xu，CodexLoom，commit `332d4a853719285aa5cfd8120c35fa804add4254`。[README](https://github.com/yan5xu/codexloom/blob/332d4a853719285aa5cfd8120c35fa804add4254/README.zh-CN.md)。
[^2]: OpenBMB，StaffDeck，commit `c6b7cfc2bf7207e40a8432b853d68e3934b1845d`。[README](https://github.com/OpenBMB/StaffDeck/blob/c6b7cfc2bf7207e40a8432b853d68e3934b1845d/README.md)。
[^3]: HKUDS，AgentSpace，commit `0f9da1b125def4d5a0d05b34bf7c5cec0686bbf2`。[README](https://github.com/HKUDS/AgentSpace/blob/0f9da1b125def4d5a0d05b34bf7c5cec0686bbf2/README.md)。
[^4]: HKUDS，OpenOPC，commit `14ab6d7a525f623596459f31d339d7064b0806df`。[README](https://github.com/HKUDS/OpenOPC/blob/14ab6d7a525f623596459f31d339d7064b0806df/README.md)。
[^5]: tt-a1i，Hive，commit `1096789b17cc8215869616d21aa6e76cd139eb19`。[README](https://github.com/tt-a1i/hive/blob/1096789b17cc8215869616d21aa6e76cd139eb19/README.md)。
[^6]: [CodexLoom Profile实现](https://github.com/yan5xu/codexloom/blob/332d4a853719285aa5cfd8120c35fa804add4254/internal/hub/profile.go#L18)。
[^7]: [CodexLoom Topic实现](https://github.com/yan5xu/codexloom/blob/332d4a853719285aa5cfd8120c35fa804add4254/internal/hub/topic.go#L22)。
[^8]: [CodexLoom发送边界与幂等键](https://github.com/yan5xu/codexloom/blob/332d4a853719285aa5cfd8120c35fa804add4254/internal/hub/outbox.go#L46)。
[^9]: [CodexLoom ELv2](https://github.com/yan5xu/codexloom/blob/332d4a853719285aa5cfd8120c35fa804add4254/LICENSE)。
[^10]: [StaffDeck团队任务状态机](https://github.com/OpenBMB/StaffDeck/blob/c6b7cfc2bf7207e40a8432b853d68e3934b1845d/backend/app/teams/service.py#L31)。
[^11]: [StaffDeck SOP工具授权](https://github.com/OpenBMB/StaffDeck/blob/c6b7cfc2bf7207e40a8432b853d68e3934b1845d/backend/app/skills/tool_authorization.py#L8)。
[^12]: [StaffDeck运行恢复](https://github.com/OpenBMB/StaffDeck/blob/c6b7cfc2bf7207e40a8432b853d68e3934b1845d/backend/app/core/harness_recovery.py#L1)。
[^13]: [StaffDeck租户与员工访问](https://github.com/OpenBMB/StaffDeck/blob/c6b7cfc2bf7207e40a8432b853d68e3934b1845d/backend/app/security/permissions.py#L19)。
[^14]: [StaffDeck许可](https://github.com/OpenBMB/StaffDeck/blob/c6b7cfc2bf7207e40a8432b853d68e3934b1845d/LICENSE)。
[^15]: [AgentSpace权限主体与资源](https://github.com/HKUDS/AgentSpace/blob/0f9da1b125def4d5a0d05b34bf7c5cec0686bbf2/packages/services/src/permissions/permissions.ts#L44)。
[^16]: [AgentSpace任务领取](https://github.com/HKUDS/AgentSpace/blob/0f9da1b125def4d5a0d05b34bf7c5cec0686bbf2/packages/db/src/task-queue.ts#L245)。
[^17]: [AgentSpace审批服务](https://github.com/HKUDS/AgentSpace/blob/0f9da1b125def4d5a0d05b34bf7c5cec0686bbf2/packages/services/src/approvals/approvals.ts#L72)。
[^18]: [AgentSpace许可](https://github.com/HKUDS/AgentSpace/blob/0f9da1b125def4d5a0d05b34bf7c5cec0686bbf2/LICENSE)。
[^19]: [OpenOPC状态转换与责任释放](https://github.com/HKUDS/OpenOPC/blob/14ab6d7a525f623596459f31d339d7064b0806df/opc/layer2_organization/work_item_transition.py#L48)。
[^20]: [OpenOPC控制器租约语境](https://github.com/HKUDS/OpenOPC/blob/14ab6d7a525f623596459f31d339d7064b0806df/opc/core/company_controller.py#L11)。
[^21]: [OpenOPC角色经验沉淀](https://github.com/HKUDS/OpenOPC/blob/14ab6d7a525f623596459f31d339d7064b0806df/opc/layer5_memory/employee_evolution.py#L515)。
[^22]: [OpenOPC许可](https://github.com/HKUDS/OpenOPC/blob/14ab6d7a525f623596459f31d339d7064b0806df/LICENSE)。
[^23]: [Hive team身份与角色命令](https://github.com/tt-a1i/hive/blob/1096789b17cc8215869616d21aa6e76cd139eb19/src/server/team-authz.ts#L4)。
[^24]: [Hive派发台账](https://github.com/tt-a1i/hive/blob/1096789b17cc8215869616d21aa6e76cd139eb19/src/server/dispatch-ledger-store.ts#L5)。
[^25]: [Hive安全说明](https://github.com/tt-a1i/hive/blob/1096789b17cc8215869616d21aa6e76cd139eb19/SECURITY.md#L38)。
[^26]: [Hive当前许可及额外使用条件](https://github.com/tt-a1i/hive/blob/1096789b17cc8215869616d21aa6e76cd139eb19/LICENSE.BSL)。
[^27]: Amazon，[SP-API使用计划与限流](https://developer-docs.amazon/sp-api/docs/usage-plans-and-rate-limits)，核实2026-09-11；包含按账号/应用/操作等因素以及事件和批量建议。
[^28]: [DeepSeek Harness本机能力矩阵](../10-platform/deepseek-harness/CAPABILITY-MATRIX.md)及[包内文档证据](SOURCES.md)，0.1.2-rc.1；不代表企业目标部署已启用或通过运行验收。
