# ADR-0003：单Case Agent、岗位Skills与模型外资产执行

Status: accepted, 2026-09-11

## Context

v1.1把50个AI岗位同时建模为长期责任身份和可被AGT-002动态编队的运行Agent。这使组织责任、运行实例、上下文所有权和权限主体混在一起，也会让紧耦合经营场景在多个Agent之间重复路由、丢失上下文或形成无法验收的互聊。

用户在审阅Anthropic企业级Commerce Agent公开方法后，要求优先厘清组织、角色分身、协同、边界和每个Agent的管理方式，并确认采用单Agent加Skills、工具UI、分层上下文、模型外资产控制和异步外部记忆。

## Decision

1. 50表示50个逻辑AI岗位分身与责任契约，不表示50个常驻模型进程、会话或路由目标。每个岗位保留稳定ID、使命、主岗位人格、判断原则、Skills、产物、经营指标和边界。
2. 每张紧耦合场景工单只有一个Case Agent拥有完整上下文，并绑定一个主岗位人格。其他岗位贡献按需加载的Skills、检查规则和产物规范，不以第二个Agent身份进入会话。
3. 取消LLM intent router和岗位Agent之间的自由互聊。AGT-002的运行职责改为模型外Case Control：创建工单、装配稳定上下文、限制可见Skills和Tools、推进状态并记录异常。
4. 允许把窄范围、自包含、可独立验收的只读分析任务封装为Delegate工具。Delegate不接收完整会话，不写资产，不展示UI，不继续委派；是否扩展范围须另行决定。
5. UI组件建模为类型化Presentation Tools。模型选择对象、顺序和解释；服务端验证参数并补齐权威事实；Site按schema渲染。展示工具不承担授权或资产写入。
6. 模型只能生成Action Intent或暂存变更。Policy Gate在模型外校验身份、业务范围、策略、参数、预算、有效期和风险；Execution Broker持有Service Identity，执行允许的动作并保存幂等、回执、补偿和冻结状态。普通LLM不能给自身或其他LLM最终授权。
7. System Prompt只保存稳定通用规则和低频但不可遗漏的安全/法律硬约束；工具参数规则进入工具描述与schema；少数场景程序进入按需Skills。权限、预算和资产边界始终由确定性代码执行。
8. 长期记忆进入企业Memory Store，并在主响应完成后由独立进程异步提取。经营事实留在system-of-record，策略、审批和执行结果进入Decision/Event Ledger，不能只依赖概率性记忆。
9. 模型选择以完整任务成功率为质量门槛，同时比较端到端延迟、感知延迟和单次成功任务成本；不以首Token速度或单次调用价格独立决定。

## Considered Options

- 继续由AGT-002动态路由50个自治Agent：保留v1.1结构，但增加上下文切割、路由误差、跨Agent状态和成本，且与新的单Agent原则冲突。
- 将50个岗位缩减为8个领域Agent：运行简单，但过早丢失用户要求的50个持续责任身份，也会把过多职责重新集中为宽泛角色。
- 50个逻辑岗位分身加单Case Agent与按需Skills：同时保留清晰责任和单一上下文所有权，且能把权限、工具、缓存、记忆和评估分别管理，因此采用。

## Consequences

- 现有50张岗位卡中的业务使命、人格原则、Skills、产物和指标继续保留；“自主匹配、协作对象和Harness映射”部分须按v2语义重构。
- `role-catalog.json`将从运行Agent目录升级为Role Profile与Agent Management清单；`collaboration-graph.json`将升级为组织责任、场景协同、Agent管理和资产边界四层typed graph。
- v1.1中的`autonomous_dispatch`、`capability_participation`和大量`declared_collaboration`不能继续解释为Agent通信或权限。新图谱必须显示阶段、Skill、产物、接收规则、Policy Gate、Execution Broker和真实回执。
- 无HITL的首版只能让独立Policy Gate自动允许低风险、可逆、范围和上限明确的动作。资金支付、账号控制、重大定价、法律承诺等在没有相应策略时保持禁用或只暂存。
- 本决定不构成任何Harness配置、企业系统连接、Service Identity、生产写入、组织调整或经营效果验收。

## Evidence

- [Anthropic：A guide to the anatomy of effective commerce agents](https://claude.com/blog/the-anatomy-of-effective-commerce-agents)，2026-09-02。
- [Anthropic官方commerce-agents参考实现](https://github.com/anthropics/commerce-agents)。
- [Anthropic：Agent Skills渐进披露](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)。
- [Claude Platform：Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)。

公开参考实现不是受支持的生产产品；其中示例数据、认证、权限和业务规则不构成本企业实施证据。
