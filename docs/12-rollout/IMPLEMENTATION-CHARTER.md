# AI组织变革实施章程

状态：战略框架与D-020至D-026的v2组织运行架构已确认；尚未授权真实账号写入、对外发送、采购/退款/预算操作、Emergency Guard规则、人员调整或生产发布。

## 已确认的实施方向

1. 以50种逻辑AI岗位、8个责任域和8条跨职能流程组织工作；每张Case只绑定一条主价值流、一个主场景和一个主岗位人格，其他能力以Skills、产物和保障规则装配。
2. GMV为第一优先级，原始GMV、取消退款和经营约束分开呈现，避免用单一增长数字掩盖质量、现金或产品风险。
3. 全部价值流和场景采用八阶段产物门禁协议，由模型外Case Control装配单Case Agent；初始不设置真人负责人或HITL为常规节点。
4. Agent可通过MCP、native tools、API和hooks连接系统，工具UI/UX可成为主要工作入口。
5. DeepSeek Harness负责AI执行；业务控制层或受控业务系统负责工单、动作策略、幂等、回执、自治异常与恢复。
6. 存量GMV经营和新品验证并行；真实的首个新品机会和验证资源后续确认。
7. FLOW-07可在确定性规则完整命中且唯一Case绑定成立时使用模型外Emergency Guard先行降低暴露；绑定前歧义只产生Pre-Case Exception，本地Case/Outbox原子提交与外部Broker执行分离，Case仍完整运行八阶段。

这些方向对应[决策D-011至D-026](../00-project/DECISIONS.md)和[总体方案](../02-strategy/BLUEPRINT.md)。这不是自动裁撤、立即改变部门汇报关系或允许生产写入的决定。

## 首个经营样本的目的

首个样本的目的是证明一个真实经营闭环能由单Case Agent在明确范围、可信数据、八阶段产物、模型外门禁、受控工具、外部回执和自治异常机制下运行。D-050确认Shopify是空白新店且无上线产品；D-051进一步明确当前只形成完整方案和店铺治理底座设计，不创建任何Case。未来另行取得实施授权后，FLOW-04绿地建店、FLOW-02产品准备与FLOW-06数据工具应拆成三张共享`correlation_id`但状态、Bundle、资源和关闭结果独立的Case，分别由AGT-024、AGT-008与AGT-047承担主人格。商品上线并形成连续30个完整销售日后，才可能启用D-033至D-049的FLOW-01存量GMV Shadow，由AGT-023负责。Amazon US保留为后续独立渠道Case。

D-034至D-049固定了产品上线后的Momcozy美国Shopify存量GMV目标合同，包括范围、GMV、身份/认证、SKU/报表、产品家族、只读Scope、Level 1和45天保留。D-050增加绿地前置门；D-051进一步把当前工作限定为[店铺治理底座方案](SHOPIFY-STORE-GOVERNANCE-FOUNDATION.md)，不实例化Case或执行Shopify动作。登录和资格取证延期到[绿地路线](SHOPIFY-GREENFIELD-ROADMAP.md)`SHOP-G6`，报表、Product GID和SKU范围延期到`SHOP-G7`。具体目标态仍见[Shopify试点章程](BVS-01-SHOPIFY-DTC-PILOT-CHARTER.md)、[SKU范围清单契约](../08-data/BVS-01-SHOPIFY-SKU-SCOPE-MANIFEST.md)、[只读连接器登记契约](../10-platform/deepseek-harness/SHOPIFY-READONLY-CONNECTOR-REGISTRATION.md)与[Level 1资格证据包](../10-platform/deepseek-harness/SHOPIFY-LEVEL1-QUALIFICATION-EVIDENCE-PACK.md)。

## 阶段门

| 阶段门 | 必须形成的实物 | 不允许跳过的判断 |
| --- | --- | --- |
| PILOT-G0：样本与环境 | 业务范围、AI结果负责人、GMV口径、约束、数据源、目标Harness事实、工具能力登记册 | 样本是否小到可控、又足以代表真实经营协同 |
| PILOT-G1：受控读取 | 数据契约、服务身份范围、工单/产物记录、跨范围拒绝验证 | 指标、账号与商品映射是否可信，读取是否越权 |
| PILOT-G2：影子闭环 | 同一真实信号下的八阶段产物、旧方法对照、Bundle/门禁/工具/异常记录 | AI是否能发现广告、价格、库存与约束冲突，而不产生副作用 |
| PILOT-G3：有限自主动作 | 经明确策略允许的动作类型、幂等、回执、补偿和冻结安排 | 写入是否可核对、可停止、可恢复，且不突破经营约束 |
| PILOT-G4：扩展决定 | 经营结果、自治异常负荷、全成本、峰值和恢复证据 | 能否扩大商品、账号、市场或动作范围 |

每一阶段都可停止或回到上一阶段。`PILOT-G3`不是由文档批准自动触发，必须有具体业务范围、工具和动作策略。

## 五条实施工作线

| 工作线 | 最小交付 | 责任边界 |
| --- | --- | --- |
| 场景自治 | 样本目标、范围、主岗位、Bundle、八阶段产物、验收和异常流程 | 主岗位对Case结果负责；Case Control依据门禁推进状态；AGT-002维护场景和异常规则 |
| 数据与度量 | 指标定义、对象映射、数据质量、基线和对照记录 | 数据契约定义语义，工具只读取允许范围 |
| 业务控制 | 工单状态、动作策略、预算占用、幂等、回执和异常账 | 真实动作必须在服务端或目标系统规则内校验 |
| Harness资产 | 版本化岗位、技能、Playbook、工具适配、tool UI和运行记录 | 仅在目标版本/schema已核实后生成配置 |
| 能力整合 | 193/46能力盘点、映射、评估与重复治理 | 50岗位是唯一长期责任身份，不直接删除既有能力 |

## 自主运行的成功证据

首个样本至少留下：同口径基线、Case Charter、Context Manifest、证据与方案产物、Stage Acceptance、Assurance、策略允许/拒绝、执行尝试与核验回执、GMV与约束结果、自治异常/恢复、模型与工具成本、外部执行成本和Bundle版本。

管理层据此决定是否扩大，不以聊天量、Token数、Agent数量或UI截图代替经营证据。未来如启用HITL，再单独记录真人介入原因、时长、结果和是否可由策略/工具消除。

观察窗口已确认为滚动30天，试点原始GMV已确认为`gross_sales`，连接身份模式已确认为试点专用Dev Dashboard App，认证固定为同一Shopify Organization下的`client_credentials`；公司100亿口径、数值目标、具体工具实例和对象身份仍在[R04](../01-discovery/interviews/R04-autonomous-runtime.md)逐项确认。本章程不虚构预算、期限或省人比例。
