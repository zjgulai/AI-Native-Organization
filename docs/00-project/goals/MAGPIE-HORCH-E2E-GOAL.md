# Magpie-Horch端到端价值流整合目标

状态：Active，文档与Site交付阶段。LoopX仅管理本项目目标；Magpie-Horch仓库保持只读。

## 目标

深度剖析Magpie-Horch的能力定义、Skill供应、工具连接、岗位编译、运行表面、验证门禁和发行安装闭环，将可复用机制适配到AI组织变革v2架构，并形成由50个逻辑AI岗位覆盖的MECE端到端价值流体系。

最终交付同时提供两种视图：

1. 产品方案工作流：用户或经营问题如何经过产品能力、数据、工具和外部系统形成可验收结果。
2. 分工协作工作流：同一Case Agent如何装配主岗位人格、岗位Skills、独立保障规则和模型外执行能力完成交接。

## 事实与权限边界

- 本项目是组织与产品方案的权威来源；Magpie-Horch是运行平台和能力供应链的证据来源。
- Magpie-Horch当前工作区存在未提交变更，本任务不修改、不格式化、不提交该仓库。
- 50表示逻辑岗位与责任契约。每张业务Case仍只有一个运行中的Case Agent和一个主岗位人格。
- 多岗位协作通过Skills、阶段产物、Acceptance Record和Assurance规则表达，不建立岗位Agent互聊或LLM路由。
- Magpie已有工具连接与凭据隔离机制不等于生产资产动作授权；写动作仍须经过模型外Policy Gate与Execution Broker。
- 本目标不授权生产系统连接、对外发送、预算调用、组织裁撤、LoopX心跳或网站发布。

## 交付物

- Magpie-Horch深度研究与采用/改造/拒绝清单。
- 8条业务经营流与4条能力供应流组成的12条MECE价值流。
- 每条价值流的产品方案工作流、分工协作工作流、完成条件、结果负责人、指标和边界。
- 结构化价值流目录及其Site只读投影。
- 中文Site中的双工作流切换、价值流筛选、角色责任与交接展示。
- PRD、ADR、项目状态和长期开发知识同步。

## 完成定义

1. 价值流ID唯一，业务经营流为8条、能力供应流为4条；两组以闭环结果区分，职责不重叠。
2. 8条业务经营流完整映射既有FLOW-01至FLOW-08，角色范围并集为AGT-001至AGT-050且无缺失。
3. 每条价值流都包含完整的产品方案步骤和分工协作步骤；主责、贡献、独立保障与交接条件可机器校验。
4. 所有角色引用都存在于50岗位目录；协作步骤覆盖该价值流声明的全部岗位范围。
5. Site投影与文档侧结构化目录字节语义一致，页面可在桌面和移动视口读取、切换和筛选。
6. LoopX连接、只读映射、目标状态和待办记录可查询；所有本地验证结果与生产验收分开陈述。

## 下一项经营验证

按D-033至D-049保留BVS-01存量GMV增长中的Momcozy美国Shopify DTC目标合同，以`gross_sales`作为试点原始GMV，采用试点专用Dev Dashboard App和`client_credentials`认证；产品族Definition契约固定为`custom.product_family=wearable_breast_pump`，首次填充采用一次性负责人确认的Product GID清单，首批SKU按官方`Total sales by product variant` CSV的完整30天原始Top 5经三类风险剔除后封存，成员歧义或报告能力不匹配则HOLD。目标Shop未来先完成只读预检证据包，再另行提交写入方案；首批声明Scope固定为五项读取，订单固定为Level 1最小必要字段、原始响应零持久化、规范化行45天加密保留、模型仅见SKU日聚合。Level 1资格路径已固定为目标Dev Dashboard现场9项只读证据，不以development store替代；D-050确认目标Shopify无上线产品，全部目标观察仍为`NOT_OBSERVED`。D-051把当前工作限定为完整方案审阅和`SHOP-G1`店铺治理底座设计，不创建Case、不登录Shopify、不配置店铺或商品；只有另行取得实施授权后，才推进`SHOP-G2`至`SHOP-G7`。到`SHOP-G6`后再读取App类型、Organization关系、分发/PCD状态、Data protection要求、Scope与用户权限；现场证据通过后仍需独立API访问授权，才能核验实际Scopes、字段Schema/Query Hash、删除/访问/备份TTL控制、Definition三态、目录、真实种子清单与报告能力并实例化Shop/SKU/App标识。Amazon US样本保留为后续渠道模板。在真实连接前，12条价值流仍停留在设计与产品方案状态。
