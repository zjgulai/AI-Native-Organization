# ADR-0011：业务经营流与能力供应流正交建模

状态：Accepted

日期：2026-09-16

## 背景

现有八条价值流覆盖跨境电商经营结果。Magpie-Horch提供岗位Preset、Skill、连接器、桌面表面、Gate、打包、安装和回退能力，但这些能力的交付终点不是GMV、履约、客户或风险结果。

如果把平台能力步骤直接插入八条业务流，会同时产生两个问题：业务流被技术发布过程切碎；平台Gate绿色容易被误认为经营闭环成功。

## 决定

保留FLOW-01至FLOW-08作为八条业务经营流，并增加四条正交的能力供应流：

1. CVS-01岗位与场景产品化，以不可变Role Release Bundle闭环。
2. CVS-02知识与Skill供应，以经任务结果评测的Skill绑定或退役闭环。
3. CVS-03 Tool、MCP与API连接交付，以Connector Acceptance Pack闭环。
4. CVS-04 Release、运行保障与持续改进，以可重复安装和回退的Release闭环。

网站和PRD使用BVS-01至BVS-08作为FLOW-01至FLOW-08的产品视图ID，不修改原有Flow标识、Playbook绑定、Case唯一性或角色目录。

每条流同时维护产品方案工作流和分工协作工作流。两者是同一Case或能力交付的不同投影，不创建两套运行状态。

## 理由

- 八条BVS按业务结果分割，四条CVS按能力产品分割，闭环产物互不替代。
- 业务Case可以引用能力版本，能力Case可以由业务缺口触发，但各自状态、验收和回执独立。
- Magpie的编译、连接、Gate和发行优势被完整保留，同时防止“已安装”等同“业务有效”。
- 50岗位继续通过单Case Agent、主人格、Skills、Stage Artifact和Assurance贡献，不回到多Agent路由。

## 影响

- 价值流总视图为8条业务经营流加4条能力供应流；原业务Flow数量仍为8。
- 新增结构化端到端目录，Site读取其发布投影并支持双工作流切换。
- 任何业务流发现能力缺口时创建关联CVS Case；能力Release不得让运行中业务Case静默升级。
- CVS-03所有写连接必须补Action Intent、Policy Gate、Execution Broker与逐对象回执。
- CVS-04发布门禁必须分别披露角色无损、Skill任务结果、连接探针、运行验证和业务证据，不能用一个总绿灯掩盖覆盖缺口。

## 未包含

本决定不批准生产系统连接、工具写权限、岗位Bundle发布、网站托管、预算动作或组织调整。
