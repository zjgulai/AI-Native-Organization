# BVS-01 Shopify DTC存量GMV目标状态章程

状态：D-050后的目标状态章程，当前`PRE_PRODUCT_LAUNCH / HOLD_NO_PUBLISHED_PRODUCTS`。D-051限定当前只审阅完整方案与`SHOP-G1`店铺治理底座设计。目标Shopify无上线产品，以下FLOW-01 Shadow只有在未来另行授权并通过`SHOP-G2`至`SHOP-G7`、形成连续30个完整销售日后才可激活。D-034至D-049的GMV、App、SKU/报表、产品家族、Scope、Level 1与45天保留规则全部保留；当前没有可实例化的Product/Variant/SKU、订单、报表、App或Scope证据。本文不授权发布、App创建/安装、数据访问、Token交换、API调用、生产写入、预算或对外动作。

## 1. 试点任务

在Momcozy美国主Shopify商店中，以权威报表最近完整30天`gross_sales`原始Top 5为候选，经质量、缺货和账号风险剔除后封存3–5个可穿戴式吸奶器Variant/SKU，验证一张FLOW-01 Case能否完成：

`机会发现 → 联合诊断 → Shadow行动包 → 确定性门禁 → NoActionRecord → 基线核对`

主岗位固定为AGT-023“自航”。Case Control只运行一个Case Agent并固定一份AGT-023 Role Release Bundle；其他岗位能力通过Skills、schema、规则和Assurance进入同一Case。当前没有Bundle实例、连接器验收或生产权限。

## 2. 范围

| 维度 | 已确认范围 | 未来`PILOT-G1`前仍需实例化 |
| --- | --- | --- |
| 品牌/渠道/市场 | Momcozy / Shopify DTC / 美国 | Shop GID、永久域名与非敏感别名 |
| 商品 | 可穿戴式吸奶器；完整30天`gross_sales`原始Top 5经三类风险剔除 | 最终3–5个Variant GID与SKU白名单、Manifest版本与Hash |
| 产品家族成员 | `custom.product_family`单行文本精确等于`wearable_breast_pump`；一次性负责人确认的Product GID清单初始化 | 真实清单与目录快照、Definition ID、同名冲突检查、获批回填、GID解析率、覆盖率与快照Hash |
| 排名报表 | Shopify Admin `Total sales by product variant` CSV | 目标Shop字段、过滤器、完整导出能力和SKU→Variant GID映射 |
| 时间 | 滚动30天 | 数据截止时间、Shop时区、对照窗口 |
| 结果负责人 | AGT-023 独立站经营与转化 | AGT-023 Bundle版本与Hash |
| 连接身份 | 新建BVS-01试点专用Dev Dashboard App；同一Organization使用`client_credentials` | App/配置版本、Shop安装、Token Broker与实际Scopes |
| 订单数据 | Level 1最小必要；原始响应零持久化；规范化行45天加密保留；模型仅见SKU日聚合 | Level 1资格、字段Schema/Query Hash、访问日志、删除回执与备份TTL/crypto-erasure测试 |
| 动作 | 只读诊断、Shadow方案、NoActionRecord | 首轮无业务写入；后续动作另行审批 |
| 经营目标 | `gross_sales`作为试点原始GMV；退款、库存、费用和现金约束显式分列 | 停止线、阈值和公司100亿口径映射 |

## 3. 产品方案工作流

| 步骤 | 产品能力 | 输入 | 输出 | 完成条件 |
| --- | --- | --- | --- | --- |
| P1 机会雷达 | 汇聚Shopify销售、流量、价格、库存和退款；标记广告/ERP/WMS/QMS缺口 | 30天只读快照与范围Manifest | `Opportunity Signal` | 信号可追溯到Shop、Market与白名单Variant |
| P2 联合诊断 | 区分销售相关性、可干预因素和缺失证据 | Signal、指标契约、外部约束状态 | `Growth Diagnosis` | 每项结论有证据、反证和冻结范围 |
| P3 Shadow行动包 | 比较价格、促销、内容、投放和库存组合 | Diagnosis与候选策略 | `Joint Action Package` | 逐Variant声明目标、风险、依赖、停止条件 |
| P4 只读门禁 | Policy Gate验证无生产动作授权 | Action Package与Access Contract | `NoActionRecord` | 没有业务系统副作用；拒绝原因可审计 |
| P5 基线核对 | 重放同一窗口并核对指标分量和约束 | 数据快照、NoActionRecord、成本记录 | `Baseline & Readiness Record` | 明确可继续项、缺口、冻结项和下一Case |

首轮不会产生实际Incrementality Record，因为没有执行动作。只有后续在明确动作策略和生产授权下取得逐对象回执，才能评价增量GMV。

## 4. 分工协作工作流

| 交接 | 主责 | 按需贡献 | 独立保障 | 标准产物与接收条件 |
| --- | --- | --- | --- | --- |
| C1 范围与口径 | AGT-023 | AGT-003、AGT-045 | AGT-050检查Shop与SKU边界 | `Case Charter` + `Scope Manifest`；对象唯一、`gross_sales`口径显式 |
| C2 数据与证据 | AGT-046 | AGT-047、AGT-049、AGT-040 | AGT-044检查PII最小化 | `Context Manifest` + `Data Quality Report`；来源覆盖与缺口逐域标记 |
| C3 增长与供需诊断 | AGT-023 | AGT-016、017、026、027、030、032、035 | AGT-041检查资金/库存约束 | `Growth Diagnosis`；每项建议有库存、费用和反证状态 |
| C4 方案与门禁 | AGT-023 | AGT-026、030、032、035 | Policy Gate + AGT-041 | `Joint Action Package` + `Assurance Decision`；首轮只能进入NO_ACTION |
| C5 核对与关闭 | AGT-003 | AGT-040、046、049 | AGT-041复核经营约束 | `Baseline & Readiness Record`；区分已证实、未证实和下一Case |

这些交接通过Stage Artifact和Acceptance Record发生，不创建岗位Agent聊天链。

## 5. 八阶段运行映射

| 阶段 | Case中的责任 | 必须留下的记录 |
| --- | --- | --- |
| STG-01 信号接收 | 接收Shopify经营信号并保留来源 | `Signal Envelope` |
| STG-02 范围与建单 | 固定BVS-01、FLOW-01、Shop、Market、Variant白名单与AGT-023 | `Case Charter`、去重键与Acceptance |
| STG-03 上下文装配 | 固定AGT-023 Bundle、所需Skills和只读Tools | `Context Manifest`；缺少Bundle则Waiting |
| STG-04 证据与诊断 | 执行只读数据质量和跨源覆盖检查 | `Evidence Pack`、`Growth Diagnosis` |
| STG-05 决策方案 | 形成逐Variant Shadow行动包 | `Joint Action Package` |
| STG-06 Assurance | 检查GMV口径、隐私、库存、资金与范围 | `Assurance Decision` |
| STG-07 受控动作 | 当前无生产策略，Policy Gate输出NO_ACTION | `NoActionRecord`，不得生成伪回执 |
| STG-08 回执与学习 | 重放基线，核对成本、冻结与能力缺口 | `Baseline & Readiness Record`、关闭Acceptance |

## 6. 50岗位在本试点中的MECE分区

50岗位仍是全企业责任目录，本试点按“运行主人格、业务Skills、能力/保障、未装配”分区。一个岗位在本Case只能落入一个分区：

1. **运行主人格（1）**：AGT-023。
2. **业务Skill贡献（11）**：AGT-003、016、017、026、027、030、032、035、040、041、045。
3. **能力与独立保障（6）**：AGT-044、046、047、048、049、050。它们通过CVS能力产物、工具和门禁参与，不成为第二人格。
4. **本Case未装配（32）**：其余岗位。AGT-021/022的Amazon能力、AGT-024其他平台和AGT-025 B2B在本Shopify Case中明确不装配。

总数为`1 + 11 + 6 + 32 = 50`。未装配不代表岗位被删除，只表示本Case没有职责或上下文需要。

## 7. 数据入口与硬缺口

[Shopify数据契约](../08-data/BVS-01-SHOPIFY-DTC-DATA-CONTRACT.md)定义8个数据集与12个Shadow用例。未来`PILOT-G1`分为两个可独立验收的层次：

- **PILOT-G1A Shopify渠道事实**：Shop、Scopes、订单/销售调整、退款、商品价格、Shopify库存、流量候选和结算候选；
- **PILOT-G1B 联合经营约束**：实际广告平台花费与回执、ERP/WMS可承诺库存与成本、QMS质量准入。

`PILOT-G1A`通过不等于`PILOT-G1B`通过。缺少`PILOT-G1B`时可以形成Shopify渠道诊断，不能宣称投放、库存和利润约束已经闭环。

## 8. 阶段门与退出条件

| 门 | 通过条件 | 失败/等待 |
| --- | --- | --- |
| PILOT-G0 范围 | 范围类别、主人格、30天窗口、`gross_sales`、SKU生成方法、`custom.product_family`成员契约、`Total sales by product variant` CSV路径、专用App模式、认证、声明Scope、Level 1字段边界、45天保留政策和目标Dashboard现场资格取证路径已确认 | 当前部分通过；`L1Q-E01`至`L1Q-E09`仍未观察，删除/访问/备份TTL控制、目标Shop Definition/成员覆盖、字段/完整导出能力、对象/App ID和风险阈值待补 |
| PILOT-G1 只读连接 | 连接器15项证据与12个Shadow用例逐项有结果 | 任一域失败只冻结依赖域；Shop身份不唯一则全停 |
| PILOT-G2 影子闭环 | 八阶段产物可回放；所有动作均为NO_ACTION | 越权、PII、口径冲突或静默成功则不通过 |
| PILOT-G3 有限动作 | 另有已批准动作策略、Service Identity、幂等和补偿 | 当前不在范围内 |
| PILOT-G4 扩展 | 经营结果、异常负荷和全成本有真实证据 | 当前不在范围内 |

试点在以下任一条件出现时进入Waiting或Frozen：Shop身份不唯一、SKU映射冲突、GMV不能重算、客户身份字段进入下游、Scope被撤回、外部状态不明、必需跨源约束缺失且方案依赖该约束。

## 9. 未来实施顺序（不在D-051当前范围）

1. 完成Shopify连接验证并登录目标Dev Dashboard；按[Level 1资格证据包](../10-platform/deepseek-harness/SHOPIFY-LEVEL1-QUALIFICATION-EVIDENCE-PACK.md)只读采集`L1Q-E01`至`L1Q-E09`，先识别App类型和Organization关系，再按对应官方规则判断资格；任一关键项缺失即HOLD；
2. 在资格、字段Schema/Query Hash、45天删除/访问/备份TTL控制齐备前不发布订单Query；待另行取得API访问授权后才可创建/安装所需App并用`currentAppInstallation.accessScopes`读回实际集合；必须与D-046五项声明Scope完全一致，否则`HOLD_SCOPE_MISMATCH`；
3. 按D-044形成一次性负责人确认、绑定同Shop全量Product目录快照的Product GID级不可变种子清单；
4. 在目标Shop生成可重放的Product级成员快照，验证覆盖率及Product→Variant→SKU唯一映射；歧义时HOLD；
5. 核验`Total sales by product variant`字段、过滤器、完整导出能力；任一能力不匹配即HOLD且不自动切换报表；
6. 冻结不含客户PII的CSV快照，按D-038生成原始Top 5、完成三类风险门并封存最终3–5个Variant/SKU；
7. 固定非敏感Shop/App别名与对象ID，不提供Secret或Token；
8. AGT-047按CVS-03发布受限Query模板和字段白名单；
9. 依次运行SHP-DC-01至12，失败或条件未运行保持可见；
10. `PILOT-G1A`通过后实例化AGT-023 Shadow Bundle和首张Case。
