# 设计决策树

当前已明确：约50个逻辑AI岗位分身覆盖全链路、人民币规模、GMV优先；每个岗位都拥有独立Soul Contract、Role Playbook、Preset Blueprint、Skills、产物、评估集和Access边界，既可独立处理边界清晰的岗位任务，也可由模型外Case Control编排为Lead/Worker组队完成复杂Case。D-053替代D-020关于岗位没有运行身份的语义，但保留单一Case结果责任、ArtifactEnvelope交接、五契约、Bundle生命周期、Policy Gate和Execution Broker。工具UI、资产动作与记忆分别由Presentation Tool、模型外执行控制和异步任务承担。

```text
经营目标与组织范围【战略框架v1.1已确认】
├─ GMV框架：原始GMV、取消退款与经营约束分开呈现【D-011】
│  ├─ Shopify试点原始GMV=`gross_sales`【D-035】
│  ├─ 当前Shopify为空白新店；本轮只审阅店铺治理方案，不进入真实配置【D-050、D-051】
│  │  └─ 未来独立授权后按SHOP-G2至SHOP-G7推进；30个完整销售日后再启用存量GMV Shadow
│  ├─ Shopify连接身份=试点专用Dev Dashboard App【D-036】
│  ├─ 同一Shopify Organization；认证=client_credentials【D-037】
│  ├─ 首批SKU=权威报表完整30天gross_sales原始Top 5，经三类风险剔除【D-038】
│  │  └─ 权威来源=目标Shop的Shopify Admin Analytics CSV导出【D-039】
│  │     └─ 首份报告=Total sales by product variant CSV；能力不匹配则HOLD【D-040】
│  │        └─ 产品族成员来源=Shopify商品字段【D-041】
│  │           └─ 唯一主选择器=Product metafield【D-042】
│  │              └─ Definition=`custom.product_family`；值=`wearable_breast_pump`【D-043】；首次种子=负责人确认的Product GID清单【D-044】；只读预检先行、写入另案【D-045】；首批声明Scope=5项完整BVS只读集合【D-046】；订单=Level 1最小必要字段【D-047】；规范化行=45天加密保留【D-048】；Level 1=目标Dev Dashboard现场证据【D-049】
│  └─ 100亿口径、跨系统权威来源、样本基线与数值阈值【R04-Q2】
├─ 存量经营与新品验证并行【D-013】
│  └─ 首个新品机会、停止条件与受保护资源【R04-Q7】
├─ 50岗位、8责任域与8流程基线【D-014】
│  ├─ 首个执行渠道：Shopify DTC先行【D-033、D-050】
│  │  ├─ 当前轨道：完整方案与店铺治理方案静态审阅；不实例化Case【D-051】
│  │  ├─ 未来轨道：FLOW-04绿地建店与首批产品上市；FLOW-02/FLOW-06为独立关联Case【D-050】
│  │  ├─ 后续轨道：Momcozy美国主站、可穿戴式吸奶器、3–10个高GMV SKU、滚动30天FLOW-01 Shadow【D-034】
│  │  ├─ Shop GID、Product/Variant/SKU、报表和30天基线当前不存在，待`SHOP-G6/SHOP-G7`实例化
│  │  └─ Amazon US历史范围保留为后续模板【D-030、D-032】
│  └─ 既有193/46个Agent资产如何归并为技能与工具【R04-Q4】
└─ 独立岗位分身与受控组队【D-053、ADR-0012】
   ├─ 50个独立岗位Preset：责任、人格、Role Playbook、Skills、产物、指标和边界
   │  ├─ 四平面：经营管理5、业务运营35、独立控制5、数据与Agent平台5【D-021】
   │  ├─ 五契约管理：Business、Skill、Runtime、Access、Assurance【D-022】
   │  └─ 不可变Release Bundle与七状态岗位生命周期【D-023】
   ├─ 视觉身份与候选素材池【D-068、ADR-0015】
   │  ├─ 3个管理层分身与50个执行岗位各有展示性视觉画像；不是第五组织平面、运行时Agent身份或权限系统
   │  ├─ AGT-001至AGT-050按同ID映射；天時→AGT-067、地利→AGT-090、人和→AGT-056已选定源人物【D-069】；D-071 已完成用户对冻结全量素材的完整授权，VIS-G1 已通过：1,729 个 APPROVED_DELIVERY、119 个 POOL_ONLY、0 个 HOLD；D-072 已完成 VIS-G2 结构性语义登记（1,848素材、102人物族、主题/尺寸矩阵、精确Git blob去重）；D-073 已接受 `VIS-G2-CANONICALIZATION-1` 为后续视觉门可复算锚点，G0 三类旧目录指纹仅保留为历史记录；D-074 已完成 53 条可独立寻址的 Digital Persona Dossier 投影，4条MGT Blueprint来源例外已隔离；D-075 已核验53条绑定的424个实际交付二进制并完成深浅主题/64px审阅；D-076 已接纳`VIB-AGT-029`与`VIB-AGT-041`的近似风险【D-075、D-076】
   │  ├─ D-077 已完成公开发行`VIR-SANBAO-WEB-2026-09-24-R1`：53条视觉身份、318个深浅主题WebP、页面接入、alt text、来源摘要和风险追溯均可复核；GitHub Pages Action `35910354396`成功且公网哈希逐项匹配，候选池与受限来源资料不公开【D-077】
   │  └─ 未选人物、主题与尺寸变体作为未来角色候选资产；角色发布前不得自动启用
   ├─ 独立模式：每个岗位Preset接收任务合同，独立产出并独立验收
   ├─ 组队模式：Case Control选择一个Lead和若干Worker，以ArtifactEnvelope交接
   ├─ Worker边界：只消费已验收产物，不共享隐式会话、不自由互聊、不再委派
   ├─ 一张Case仍只有一个结果负责人和一个固定Bundle；Lead/Worker运行实例按Case记录
   ├─ 无策略/无回执/工具失败时的冻结与恢复规则【R04-Q3】
   ├─ Presentation Tools、MCP、native tools、API及hooks【D-017】
   │  └─ 首批系统连接、真实接口与服务身份范围【R04-Q5、R04-Q6】
   │     └─ 当前无Amazon/RootData/数智星图入口；Shopify DTC先行【D-032、D-033】
   ├─ Action Intent → Policy Gate → Execution Broker【D-029】
   ├─ Prompt/Skill/Tool/Memory/Model/Eval分层管理【D-022】
   ├─ 八阶段产物门禁协同：8条价值流与20个场景统一采用，Lead/Worker交接仍受门禁约束【D-024、D-053】
   │  ├─ 一张Case绑定一条主价值流和一个主场景；跨价值流信号拆为关联独立Case【D-025】
   │  └─ FLOW-07命中已发布规则时允许模型外确定性紧急保护，且不跳过八阶段【D-026】
   ├─ 端到端价值流：8条业务经营流 + 4条能力供应流；每条流有产品方案与分工协作双投影【D-031、ADR-0011】
   ├─ 上下文与缓存：静态、Case稳定、回合易变信息的排列边界【D-027】
   ├─ 模型评估与异步记忆：以业务闭环成功率为中心的Runtime评估门禁【D-028】
   ├─ Harness执行与业务控制分离【D-015、ADR-0001】
   └─ HITL与真人组织后置【D-019】
      └─ 仅在运行证据和明确策略具备后启用
```

v1.1业务责任基线保留在Git历史；自主运行模型、协同图JSON和PRD先依据D-020至D-031升级，现由D-053与ADR-0012补充为独立岗位Preset与受控组队运行模型。Magpie-Horch能力供应闭环已映射为4条正交能力流，Site提供12条流的产品方案与分工协作双视图。D-033至D-049保留Shopify产品上线后的存量GMV目标合同；D-050补充当前Shopify为空白新店、无上线产品并定义未来绿地顺序；D-051将现实前沿收敛为完整方案与店铺治理方案静态审阅，不实例化FLOW-04、FLOW-02或FLOW-06 Case。只有未来取得实施授权、商品上线并形成连续30个完整销售日后，才实例化SKU、报表、App、Level 1和FLOW-01 Shadow；当前不再以登录作为阻塞门。D-052授权公开发布方案文档，不扩大业务权限。

平台资料可见、配置成功、离线验证、业务试点和生产验收属于不同证据层级。当前没有生产配置、接口连接或业务写入已经生效。
