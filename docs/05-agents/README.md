# AI 数字分身

状态：D-053与ADR-0012已将50个逻辑岗位升级为50个可独立寻址的数字分身设计。每个岗位均有独立Role Profile、Soul Contract、Role Playbook、Preset Blueprint、Skills、产物、评估集和Access边界；既可独立处理边界清晰的岗位任务，也可由模型外Case Control编排为Lead/Worker组队。五份版本化管理契约、不可变Bundle生命周期、八阶段协同协议和Case唯一结果责任继续有效。当前Blueprint仍未实例化为目标DSH生产配置，AGT-002不运行自由LLM多Agent路由。

每个角色使用 [分身模板](../../templates/agent.md)，明确：

- 使命、服务对象、经营贡献、负责及不负责的事项。
- 人格：表达方式、证据偏好、风险态度、冲突处理和协作习惯。
- “灵魂”：在利润与品牌、速度与不确定性、局部结果与整体结果冲突时如何判断；每一项配可检验情境。
- 岗位职责、技能、工具、Playbook、标准产物与绩效指标。
- 数据与行动权限、自治异常条件、AI结果负责人、独立复核与外部执行边界。
- 工作记忆和可长期保留的知识范围、版本和评估要求。

当前每个岗位已具备中文别名、人格、灵魂原则、独立Soul Contract、独立Role Playbook、业务技能、标准产物、协同协议和行为验收情境。技能名称与Role Playbook是设计合同，尚不是已实现API或经过业务验证的技能包；人格、独立完成能力和组合协同能力需要在目标环境分别回放。50份Soul Contract见[roles/souls](roles/souls/)，50份岗位Playbook索引见[role-playbooks](../06-playbooks/role-playbooks/index.json)，50份Preset Blueprint总表见[manifest](../10-platform/deepseek-harness/preset-blueprints/manifest.json)。既有193/46个Agent资产的归并方式见[能力资产整合](EXISTING-AGENT-CONSOLIDATION.md)。

视觉头像、主题、来源、alt text和候选人物由[D-068 Sanbao视觉身份与资产方案](../12-rollout/SANBAO-VISUAL-IDENTITY-ASSET-PLAN.md)独立管理。它们是角色展示投影，不属于五契约、Role Release Bundle、Preset身份、权限或运行状态；不得将视觉字段加入本目录的角色运行资产。

[Agent五契约管理图](AGENT-MANAGEMENT-GRAPH.md)定义每个岗位的Business、Skill、Runtime、Access和Assurance契约、治理责任与禁止自发布规则；[结构化管理图谱](agent-management-graph.json)可供后续Site读取。

[岗位Bundle与生命周期](AGENT-LIFECYCLE.md)定义五契约的不可变绑定、七个状态、隔离、Case版本固定和回退规则；[结构化生命周期](agent-lifecycle.json)不包含任何已部署Bundle。

[八阶段协同图谱](../07-orchestration/COLLABORATION-GRAPH.md)说明Lead如何持有Case结果责任、Worker如何通过ArtifactEnvelope贡献已验收产物；[Role Playbook](../06-playbooks/role-playbooks/AGT-001.md)定义单岗位独立执行和组队执行的共同合同。岗位之间不共享隐式会话或转授权限，图中的能力贡献仍须在目标环境编译为可审计的Skill Contract。
