# R05：组织操作系统、单Agent与四层图谱

状态：进行中。用户要求暂停首个经营样本问题，先整理清楚管理与运营组织、岗位分身、协同方式、边界和每个Agent的管理方法，并最终用Codex构建为Site。

## 已确认回答

### R05-Q1：50个岗位与运行Agent的关系

用户回答：同意建议。

记录为D-020与ADR-0003：50表示50个逻辑AI岗位分身与责任契约；每张紧耦合场景工单只有一个Case Agent和一个主岗位人格，按需加载其他岗位Skills；取消LLM多Agent路由与岗位Agent互聊；只读窄任务可封装为Delegate；资产动作必须经过模型外Policy Gate与Execution Broker。

### R05-Q2：50岗位的顶层组织视图

用户回答：确认。

记录为D-021：采用四平面组织视图，分别为5个经营管理岗位、35个业务运营岗位、5个独立控制岗位和5个数据与Agent平台岗位；原8个责任域保留为第二业务视角。四平面不表达行政汇报、运行实例或权限。

### R05-Q3：每个岗位如何被管理

用户回答：确认。

记录为D-022与ADR-0004：全部50个岗位不设置上级Agent，由Business、Skill、Runtime、Access和Assurance五份独立版本化契约管理。AI岗位可以提出自身或相关能力的改进，但不能发布自己的Prompt、Skill、Model、Tool、Memory或Policy；确定性评测与策略门禁决定低风险自动发布，目标、资产权限或控制标准变化需要新的公司级契约。

### R05-Q4：Release Bundle与岗位生命周期

用户回答：确认。

记录为D-023与ADR-0005：五份契约绑定为不可变Role Release Bundle；任一契约变化生成新Bundle，Case启动后固定引用原Bundle。采用Draft、Evaluated、Shadow、Limited、Production、Quarantined和Retired七个状态；Rollback是选择上一已知正常Bundle的受控操作。隔离会阻止新动作，并在下一个动作边界冻结受影响在途Case。

### R05-Q5：单Case Agent的场景协同方式

用户回答：确认。

记录为D-024与ADR-0006：全部8条价值流和当前20个候选场景统一采用八阶段、产物驱动、门禁推进的协同协议；这不改变候选场景仍待企业验证的证据状态。同一Case始终只有一个Case Agent和一个主岗位人格；岗位能力通过按需Skills、阶段产物与保障规则贡献，不发生岗位Agent互聊。窄范围Delegate只接收最小不可变输入并返回类型化只读结果；模型外Acceptance Gate、Policy Gate和Execution Broker分别控制阶段推进、资产许可与实际执行。

### R05-Q6：Case与价值流/场景的基数

用户回答：确认。

记录为D-025与ADR-0007：每张Case只绑定一条主价值流、一个主场景、一个主岗位和一个固定Bundle；其他场景只作相关引用。同一信号确需触发多条价值流时，为每条价值流创建共享`correlation_id`、状态独立的Case；Case之间只引用已被来源阶段接收的Stage Artifact，不共享可变上下文或互相改变状态。51条flow-scenario关系仍保持候选状态。

### R05-Q7：FLOW-07重大事件紧急保护

用户回答：确认。

记录为D-026与ADR-0008：正常业务继续完整运行八阶段。只有FLOW-07的权威信号命中一条已发布、互斥且未过期的确定性规则，并满足D-025唯一Case绑定时，模型外Emergency Guard才能形成固定保护Intent；模型不能选择或扩大动作、参数和范围。STG-01先完成接收，本地事务再提交Case、STG-02 Charter/Acceptance、Guard Decision、Policy Decision及ALLOW时的Outbox；Execution Broker在事务后幂等执行并核对权威状态。绑定前若规则、主场景或范围不唯一，只记录Pre-Case Exception并冻结信号范围，不创建残缺Case或动作记录。TTL只限制首次派发，不自动恢复；恢复、扩大范围、外部承诺、退款、召回、销毁和永久变更只走正常STG-07。当前没有规则、阈值、模板、身份或生产权限被配置。

## 下一项决定

### R05-Q8：上下文顺序与Prompt Cache边界

用户回答：同意。

记录为D-027：采用四层、前缀稳定、按引用装配的上下文架构。部署静态层只放工具schema、不可变底线和Skill元数据；Bundle/Case稳定层放主岗位人格、固定Bundle、主价值流/场景、业务范围和策略引用；Stage稳定层放当前阶段目标、已接收产物引用与本阶段加载的Skill正文；回合易变层放会话级最新事件、时间和工具结果。Global Cache仅在同一企业租户/workspace与版本隔离域内复用；客户、员工和业务明细不得进入共享静态层。权威事实长期保存在system-of-record与Case/Event Ledger；溢出时仅保留规则、异常、动作和回执引用。

后续依次讨论模型评估与选择、异步记忆、资产权限图、Site信息架构与实施路线。每次只提一个需要经营方决定的问题，已能由文件或官方资料核实的事实不再询问。

### R05-Q9：模型评估与模型选择、Prompt Cache参数、异步记忆边界

用户回答：1（推荐）。

记录为D-028：模型评估采用“业务任务闭环成功率优先”的治理指标，补充SLA、异常冻结率和全生命周期成本约束；模型与策略采用双层：一个主模型承载常规场景，一个复核模型仅在标记为复杂/异常时发起；不得为了首token快慢优先选型。Prompt Cache使用静态前缀：System/Business/Runtime/Stage/Bundle/主岗位人格与稳定技能描述；会话易变层、工具响应和客户级明细不入长期缓存。异步记忆由闭环后独立异步作业提取为结构化候选，默认异步失败不阻塞Case关闭；记忆只用于下一轮上下文辅助和经验沉淀，不能作为资产动作授权依据。

下一步待决问题：Action Intent、Policy Gate、Execution Broker与资产边界。

### R05-Q10：Action Intent、Policy Gate、Execution Broker与资产边界

用户回答：1（推荐）。

记录为D-029：采用“模型产出意图，模型外统一裁决与执行，执行器独享身份”的边界约束。

1. **Action Intent（Case Agent产出）**：模型在STG-07只输出`Action Intent`，包含目标、对象、参数摘要、风险等级、预算/额度约束、策略引用、幂等键建议。Intent不携带执行凭据，不直接调用写操作，不扩展范围，不持有Service Identity。
2. **Policy Gate（模型外统一网关）**：执行前先由Policy Gate按已发布策略、Access Contract、对象范围、资源预留、参数边界、并发规则进行确定性裁决，输出`ALLOW / DENY / HOLD / NO_ACTION`。
   - `ALLOW`：产生`REC-POLICY-DECISION`，触发Execution Broker尝试；
   - `DENY/HOLD`：返回`Stage Exception`并进入`Rework`或`Frozen`，不能绕过；
   - 未命中或过期模板、额度不足、对象/范围不匹配直接拒绝。
3. **Execution Broker（模型外执行器）**：只持有Service Identity并执行外部动作；执行记录绑定`action_intent_id + policy_decision_id + attempt_key`。
   - 仅支持模型与策略允许的动作模板。
   - 幂等与去重要求内置于Broker；同对象同时间窗冲突由Broker写入资源锁，不允许并发覆盖。
   - 回执未知时先查权威状态，不重复执行；失败/部分成功写入异常账与恢复条件后再允许重试或补偿。

资产边界：未在Access Contract中显式声明的动作、对象、金额、频率、窗口、账号/店群、SKU群组一律拒绝；对外承诺、退款、召回、销毁、账号变更和永久性动作默认禁止，需另行R04策略或后置治理补充。模型与broker均不能擅自修改策略、预算或资产边界。

下一步待决问题：R04-Q2（GMV口径与首个样本数据契约/约束阈值）。
