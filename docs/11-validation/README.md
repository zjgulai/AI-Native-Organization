# 验证与验收

状态：评估框架草稿；指标、样本和阈值需在业务基线明确后决定。

[PRD](../13-prd/PRD.md)列出33项需求验收条件及首个场景的正常/失败情境；[容量和成本模型](../02-strategy/CAPACITY-AND-COST.md)定义自治负荷、成本与经营效果的独立核算方式。当前通过的文档检查记录在[项目状态](../00-project/STATUS.md)。

| 层次 | 要证明什么 | 不能推导什么 |
| --- | --- | --- |
| 文档与走查 | 职责、数据、权限和异常路径可解释 | 真实执行有效 |
| 离线回放 | 已知输入下的产物和判断符合规则 | 当前真实业务已改善 |
| 影子运行 | 真实信号下的八阶段产物、门禁、延迟和自治异常可测量 | AI 已获执行授权 |
| 有限实操 | 在明确策略范围内闭环且可冻结/恢复 | 全渠道、旺季或全公司都适用 |
| 扩展与持续经营 | 峰值、长期效果、全成本和组织负荷满足门槛 | 可以自动推广至不同业务边界 |

每次评估记录：场景及版本、业务范围、对照基线、数据窗口、样本选择、核心指标、主岗位与Bundle、Stage Attempt及产物、工具/回执、自治异常、实际成本、限制与验收机制。

自治异常、外部执行和未来HITL分别计入成本；准确率、完成率、等待、冻结恢复和未来可减少编制分别计算。经营效果同时检验收入、利润/贡献、现金占用、客户结果和已确认的约束。

D-050确认目标Shopify是无上线产品的空白新店，D-051把当前验收限制为[店铺治理底座方案](../12-rollout/SHOPIFY-STORE-GOVERNANCE-FOUNDATION.md)和全景Site的静态完整性：六个治理域、十项方案产物、责任、HOLD、未来授权条件和页面边界必须一致。当前不验证真实店铺、商品、交易、客户旅程或test order证据。未来取得实施授权并完成`SHOP-G2`至`SHOP-G5`后，才在`SHOP-G6`核验[只读连接器](../10-platform/deepseek-harness/SHOPIFY-READONLY-CONNECTOR-REGISTRATION.md)和[Level 1资格证据包](../10-platform/deepseek-harness/SHOPIFY-LEVEL1-QUALIFICATION-EVIDENCE-PACK.md)，连续30个完整销售日后在`SHOP-G7`按[SKU范围清单](../08-data/BVS-01-SHOPIFY-SKU-SCOPE-MANIFEST.md)和[Shopify数据契约](../08-data/BVS-01-SHOPIFY-DTC-DATA-CONTRACT.md)生成范围并运行FLOW-01 Shadow。D-033至D-049的全部门禁继续适用；Amazon US数据契约保留为后续渠道模板。

GitHub Pages发布单独验证：本地静态检查、显式提交清单、远端commit、Actions workflow成功、Pages控制面URL/状态、公网页面与关键CSS/JavaScript/JSON字节、桌面和移动浏览器布局。Pages成功只证明文档站发布，不证明任何经营或系统能力。
