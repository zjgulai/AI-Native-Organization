# 通过场景组织50个逻辑AI岗位

状态：流程与责任覆盖已按D-020、D-024和D-025升级。每个实际工单只有一个Case Agent、一个主价值流、一个主场景和一个主岗位；跨价值流信号拆成关联但状态独立的Case。其他岗位通过按需Skills、检查规则和产物规范贡献能力。全部流程使用[八阶段协同协议](../07-orchestration/COLLABORATION-GRAPH.md)，初始不设置真人负责人或HITL为常规节点。

D-031保留以下业务经营流，并在其外增加4条正交能力供应流；D-078新增FLOW-09品牌资产经营流。13条流的产品方案工作流、分工协作工作流、MECE边界与结构化数据见[端到端价值流设计](END-TO-END-VALUE-STREAMS.md)和[e2e-value-streams.json](e2e-value-streams.json)。能力流不改写本文件的Flow ID、场景绑定或Playbook。

| 流程 | 经营闭环 | 默认AI结果负责人 | 自治控制 | 完成条件 |
| --- | --- | --- | --- | --- |
| FLOW-01 | 存量GMV增长：投放、价格、库存联动 | AGT-021 | 场景动作策略、预算/库存校验、回执 | 在已确认范围内形成、执行和复核一份联合经营行动包 |
| FLOW-02 | 新品：需求证据到商业验证 | AGT-008 | 假设/停止条件、外部验证回执、准入策略 | 得到有证据的继续、转向或停止结论 |
| FLOW-03 | 供需：补货、采购与交付 | AGT-016 | 系统-of-record、动作策略、幂等与到货回执 | 供应计划与实际到货、可售库存对齐 |
| FLOW-04 | 新市场、新渠道与合规上架 | AGT-024 | 市场/账号范围、准入策略、上线回执 | 在适用策略和履约条件下验证市场进入 |
| FLOW-05 | 客户旅程：服务、留存与复购 | AGT-034 | 客户数据范围、服务/触达策略、结果回执 | 客户问题被解决，并验证相关复购改善 |
| FLOW-06 | 需求到数据产品与业务工具 | AGT-047 | 数据契约、工具范围、运行/安全校验 | 口径、数据质量和工具闭环 |
| FLOW-07 | 质量和账号重大事件处理 | AGT-018 | 隔离范围、质量/账号动作策略、恢复证据 | 事件范围、处置、根因和恢复证据闭合 |
| FLOW-08 | 经营复盘、资源和组织能力更新 | AGT-001 | 版本化策略、独立复核、能力回退 | 形成有依据的资源与能力版本变更建议或动作结果 |
| FLOW-09 | 品牌资产经营：洞察、定义、传播、内容、渠道、体验与品效 | AGT-029 | 场景动作策略、品牌数据口径、外发回执、双层指标归因 | 形成品牌资产与GMV双层指标的品牌经营行动包并复核 |

所有流程均由模型外Case Control依据已发布规则建单、选择主岗位、固定Bundle并装配必要Skills；AGT-002提供场景制度、分诊和异常协调能力，不运行LLM多Agent路由。具体业务对象、工具和策略尚未配置。

## FLOW-01 存量GMV增长：投放、价格、库存联动

业务场景：SCN-001、SCN-007、SCN-009、SCN-010、SCN-011、SCN-013、SCN-016、SCN-018。能力贡献岗位：AGT-002、AGT-003、AGT-016、AGT-017、AGT-021、AGT-022、AGT-023、AGT-024、AGT-025、AGT-026、AGT-027、AGT-028、AGT-030、AGT-031、AGT-032、AGT-035、AGT-040、AGT-041、AGT-045。

本条按渠道实例选择结果负责人：Amazon由AGT-021负责，独立站、其他平台和B2B实例分别由AGT-023、AGT-024、AGT-025负责。D-033/D-034确定首个Shopify DTC实例由AGT-023担任AI结果负责人，范围和交接见[Shopify试点章程](../12-rollout/BVS-01-SHOPIFY-DTC-PILOT-CHARTER.md)。手册：PB-001，见[Playbook](../06-playbooks/PLAYBOOKS.md)。

## FLOW-02 新品：需求证据到商业验证

业务场景：SCN-002、SCN-003、SCN-004、SCN-005、SCN-006、SCN-009、SCN-012、SCN-013。能力贡献岗位：AGT-001、AGT-002、AGT-006、AGT-007、AGT-008、AGT-009、AGT-010、AGT-011、AGT-012、AGT-013、AGT-014、AGT-018、AGT-021、AGT-024、AGT-028、AGT-029、AGT-030、AGT-031、AGT-033、AGT-035、AGT-038、AGT-039、AGT-041、AGT-043、AGT-044、AGT-048。

实物、临床或适用合规验证由经策略选定的受控执行主体或外部系统提供证据；Agent不能把文档当作实物回执。手册：PB-002，见[Playbook](../06-playbooks/PLAYBOOKS.md)。

## FLOW-03 供需：补货、采购与交付

业务场景：SCN-006、SCN-007、SCN-008、SCN-010、SCN-014、SCN-016、SCN-017。能力贡献岗位：AGT-002、AGT-014、AGT-015、AGT-016、AGT-017、AGT-018、AGT-019、AGT-020、AGT-021、AGT-026、AGT-040、AGT-041、AGT-042。

库存预留和采购承诺只复用业务系统权威记录与回执。手册：PB-003，见[Playbook](../06-playbooks/PLAYBOOKS.md)。

## FLOW-04 新市场、新渠道与合规上架

业务场景：SCN-002、SCN-005、SCN-008、SCN-009、SCN-012、SCN-014、SCN-018。能力贡献岗位：AGT-002、AGT-007、AGT-009、AGT-019、AGT-021、AGT-022、AGT-023、AGT-024、AGT-025、AGT-027、AGT-028、AGT-029、AGT-030、AGT-031、AGT-033、AGT-036、AGT-042、AGT-043、AGT-044、AGT-050。

其余20%渠道构成未明，按真实平台、账号和动作策略实例化。手册：PB-004，见[Playbook](../06-playbooks/PLAYBOOKS.md)。

## FLOW-05 客户旅程：服务、留存与复购

业务场景：SCN-002、SCN-012、SCN-013、SCN-014、SCN-015、SCN-016。能力贡献岗位：AGT-002、AGT-006、AGT-020、AGT-023、AGT-028、AGT-029、AGT-034、AGT-035、AGT-036、AGT-037、AGT-038、AGT-039、AGT-040、AGT-044。

重大质量事件转FLOW-07；退款与触达分别使用具体动作策略和外部回执。手册：PB-005，见[Playbook](../06-playbooks/PLAYBOOKS.md)。

## FLOW-06 需求到数据产品与业务工具

业务场景：SCN-001、SCN-016、SCN-020。能力贡献岗位：AGT-002、AGT-003、AGT-021、AGT-023、AGT-040、AGT-044、AGT-045、AGT-046、AGT-047、AGT-048、AGT-049、AGT-050。

AGT-047负责工具交付，AGT-045维护数据契约；验收依赖工单定义的AI结果负责人及独立复核机制。手册：PB-006，见[Playbook](../06-playbooks/PLAYBOOKS.md)。

## FLOW-07 质量和账号重大事件处理

业务场景：SCN-004、SCN-005、SCN-006、SCN-014、SCN-015、SCN-018。能力贡献岗位：AGT-002、AGT-005、AGT-011、AGT-012、AGT-013、AGT-014、AGT-017、AGT-018、AGT-020、AGT-021、AGT-027、AGT-029、AGT-036、AGT-037、AGT-038、AGT-041、AGT-043、AGT-044、AGT-050。

账号事件可指定AGT-027负责该实例。D-026允许已接收的权威信号命中一条已发布互斥规则且唯一Case绑定成立时，由模型外Emergency Guard固定场景、最小范围、保护模板、Policy、TTL、幂等和最大影响边界，并在本地原子建单后交Execution Broker执行；模型不能选参或扩围。绑定前若规则、主场景或范围不唯一，只生成Pre-Case Exception并冻结信号范围。恢复、重新开放、外部承诺、退款、召回、销毁和永久变更只走正常STG-07。具体规则尚未配置，未匹配或校验失败时按记录进入正常流程、等待或冻结。手册：PB-007，见[Playbook](../06-playbooks/PLAYBOOKS.md)。

## FLOW-08 经营复盘、资源和组织能力更新

业务场景：SCN-001、SCN-003、SCN-016、SCN-017、SCN-019、SCN-020。能力贡献岗位：AGT-001、AGT-002、AGT-003、AGT-004、AGT-005、AGT-008、AGT-021、AGT-029、AGT-035、AGT-040、AGT-041、AGT-042、AGT-043、AGT-045、AGT-048、AGT-049、AGT-050。

资源、技能和长期策略变更使用版本化动作策略；无适用策略时记录建议并冻结相关写入。手册：PB-008，见[Playbook](../06-playbooks/PLAYBOOKS.md)。

## FLOW-09 品牌资产经营：洞察、定义、传播、内容、渠道、体验与品效

业务场景：SCN-002、SCN-009、SCN-011、SCN-012、SCN-013。能力贡献岗位：AGT-002、AGT-003、AGT-005、AGT-006、AGT-007、AGT-021、AGT-022、AGT-023、AGT-024、AGT-026、AGT-027、AGT-028、AGT-029、AGT-030、AGT-031、AGT-032、AGT-033、AGT-034、AGT-035、AGT-038、AGT-039、AGT-041、AGT-045、AGT-048。

D-078新增本流：以《弱品牌，强品牌：数字时代增长知与行》的品牌增长方法论为领域内核，覆盖品牌洞察、共创定义、品牌理想、传播、内容、渠道购买场、体验、资产评估、量化投资、品效合一与数据资产管理；KPI采用品牌资产与GMV双层口径。品牌资产指标按长周期归因，不以单次GMV或点击替代。手册：PB-009，见[Playbook](../06-playbooks/PLAYBOOKS.md)；领域方法论见[品牌增长方法论文档](../06-playbooks/BRAND-GROWTH-METHODOLOGY.md)；品牌域Skill契约见[skills目录](../06-playbooks/skills/README.md)；双层指标口径见[FLOW-09 KPI指标字典](../08-data/FLOW-09-DUAL-KPI-CATALOG.md)；首个Case试点章程见[FLOW-09试点章程](../12-rollout/FLOW-09-BRAND-PILOT-CHARTER.md)。SCN-002已建立[v1场景规格](SCN-002.md)。与FLOW-01的边界：本流拥有品牌资产结果闭环，FLOW-01继续拥有GMV战术闭环；同一渠道动作若同时改变两类结果，按主结果拆为共享`correlation_id`的关联Case。

初始运行没有H-责任线。业务控制由场景范围、AI结果负责人、独立复核、受控外部执行主体、动作策略与回执共同构成；具体人员和HITL仅在未来明确决定后才加入。
