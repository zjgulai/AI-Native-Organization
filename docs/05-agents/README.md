# AI 数字分身

状态：50岗位业务责任基线保留；D-020至D-026已将[结构化目录](role-catalog.json)升级为逻辑Role Profiles，并采用单Case Agent、五份版本化管理契约、不可变Bundle生命周期、八阶段协同协议及Case唯一主价值流/主场景规则。D-026的Emergency Guard属于模型外控制，不新增第51个岗位或第二个Agent。五契约和Bundle尚未实例化；实际实例与并发依据负荷决定，AGT-002不运行LLM多Agent路由。

每个角色使用 [分身模板](../../templates/agent.md)，明确：

- 使命、服务对象、经营贡献、负责及不负责的事项。
- 人格：表达方式、证据偏好、风险态度、冲突处理和协作习惯。
- “灵魂”：在利润与品牌、速度与不确定性、局部结果与整体结果冲突时如何判断；每一项配可检验情境。
- 岗位职责、技能、工具、Playbook、标准产物与绩效指标。
- 数据与行动权限、自治异常条件、AI结果负责人、独立复核与外部执行边界。
- 工作记忆和可长期保留的知识范围、版本和评估要求。

当前每个岗位已具备中文别名、人格、判断原则、业务技能、标准产物与行为验收情境。技能名称是能力要求，尚不是已实现API或经过业务验证的技能包；人格需要与业务契约、动作策略及评价一起检验。既有193/46个Agent资产的归并方式见[能力资产整合](EXISTING-AGENT-CONSOLIDATION.md)。

[Agent五契约管理图](AGENT-MANAGEMENT-GRAPH.md)定义每个岗位的Business、Skill、Runtime、Access和Assurance契约、治理责任与禁止自发布规则；[结构化管理图谱](agent-management-graph.json)可供后续Site读取。

[岗位Bundle与生命周期](AGENT-LIFECYCLE.md)定义五契约的不可变绑定、七个状态、隔离、Case版本固定和回退规则；[结构化生命周期](agent-lifecycle.json)不包含任何已部署Bundle。

[八阶段协同图谱](../07-orchestration/COLLABORATION-GRAPH.md)说明一个主岗位人格如何在同一Case Agent中调用其他岗位Skills、产物和保障规则；图中的历史岗位-流程覆盖尚未编译为Skill Contract。
