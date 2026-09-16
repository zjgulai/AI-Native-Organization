# Shopify绿地方案与未来实施路线

状态：D-050确定绿地顺序，D-051将当前范围限定为完整方案审阅与店铺治理方案设计。用户已明确Shopify是空白新店，尚无上线产品。本轮不进入Shopify实施；D-033至D-049保留为产品上线后的目标状态合同。

## 已知事实与直接影响

| 当前事实 | 直接影响 |
| --- | --- |
| Shopify是全新店铺 | 尚无可证明的目标Shop运行配置、交易链路或历史经营基线 |
| 尚无上线产品 | 尚无可用于试点的Product GID、Variant GID、SKU、产品家族字段覆盖和库存对象 |
| 尚无销售数据 | `Total sales by product variant`报告、Top 5、30天`gross_sales`和订单Level 1数据均不存在 |
| 完整组织与运行方案先做进Site | 当前交付物是公开可审阅的全景方案与店铺治理设计，不是API连接或经营结果 |

因此，现场登录和Level 1证据包不是当前阻塞项。它们在未来`SHOP-G6`访问门重新启用；未取证状态记为**延期**，不能记为失败或已通过。

## 当前交付与未来双轨

### 当前：完整方案审阅与店铺治理方案

本轮完成[店铺治理底座方案](SHOPIFY-STORE-GOVERNANCE-FOUNDATION.md)，定义六个治理域、十项方案产物、岗位责任、HOLD、未来变更通路和验收条件。本轮不登录Shopify、不实例化Case、不填写真实配置、不创建商品/App、不调用API、不测试订单，也不执行店铺或产品发布。

### 未来轨道A：取得独立授权后实施绿地建店与首批产品上市

未来以FLOW-04“新市场与渠道进入”为主Case，由AGT-024担任主人格。两个关联Case通过同一`correlation_id`协作，但保持独立状态、Bundle、资源和验收：

- FLOW-02“新品洞察与验证”：由AGT-008负责首批产品价值主张、合规证据、上市资料和继续/停止结论。
- FLOW-06“数据与工具交付”：由AGT-047负责商品主数据、事件、指标、连接器和Tool UI的可验证能力。

三个Case只引用已验收Stage Artifact，不能合并成一个跨价值流Case，也不能共享资产授权。当前这些只是Case设计，不是运行实例。

### 未来轨道B：条件满足后运行存量GMV经营

首批产品正式上线并形成连续30个完整销售日后，启动D-033至D-049定义的FLOW-01 Case，由AGT-023负责Shopify DTC存量GMV Shadow。此时才允许实例化产品家族清单、Variant/SKU范围、销售报表、只读App和订单数据契约。

## 八个Shopify阶段门

| 阶段 | 目标与关键产物 | 主责岗位 | 通过门 |
| --- | --- | --- | --- |
| SHOP-G0 方案基线 | 完整方案Site、D-050至D-052、价值流、岗位、平台、数据、权限和验证边界 | AGT-001、AGT-002、AGT-050 | 文档和Site一致；无上线或经营成效误述 |
| SHOP-G1 店铺治理方案 | 六个治理域、十项SGF产物、责任、HOLD、变更通路与验收模板 | AGT-024、AGT-044、AGT-050、AGT-047 | 方案可在无登录、无真实配置和无API条件下完整审阅 |
| SHOP-G2 商品主数据 | 首批Product/Variant/SKU模型、`custom.product_family`定义计划、媒体、规格、合规、价格与库存字段 | AGT-008、AGT-009、AGT-018、AGT-047 | 未来授权后验证SKU唯一、字段完整和无标题模糊归类 |
| SHOP-G3 交易底座 | Markets、税、支付、运费、库存位置、结账、通知、退换与隐私政策 | AGT-024、AGT-027、AGT-037、AGT-044 | 未来测试环境可重放；资产动作仍由受控身份完成 |
| SHOP-G4 首批上市准备 | 主题、导航、Collection、PDP、内容、SEO、分析事件和客服知识 | AGT-028、AGT-029、AGT-030、AGT-031、AGT-035 | 未来关键旅程、内容证据、事件和性能达到发布标准 |
| SHOP-G5 测试与受控发布 | Test order、库存扣减、运费、税、通知、退款路径和回执；发布检查单 | AGT-045、AGT-050、AGT-027、AGT-036 | 未来端到端测试通过；发布仍需独立授权 |
| SHOP-G6 数据基线与Agent连接 | 商品上线后创建只读App方案、Scope/PCD证据、工具契约、日聚合和质量监控 | AGT-046、AGT-047、AGT-048、AGT-049 | 产品对象真实存在；访问获批；Query/Schema/TTL有证据 |
| SHOP-G7 30天基线与FLOW-01 Shadow | 连续30个完整销售日、`gross_sales`、Top 5和三类风险门；NO_ACTION Shadow | AGT-023、AGT-017、AGT-018、AGT-027 | 报表可重算；最终3–5个SKU；约束来源和异常完整 |

阶段名称不等同于日历承诺。每个阶段可以HOLD、返工或回到上一门；`SHOP-G2`至`SHOP-G7`当前均未开始，`SHOP-G5`发布、`SHOP-G6`访问和任何写入分别需要对应授权。

## Shopify官方检查基线

绿地店铺至少核对Shopify官方新店清单中的店铺信息、币种、单位、邮箱认证、Markets、税、支付、运费、政策、账号、结账、域名和应用；商品至少具有标题和价格，并根据业务补齐媒体、库存、变体、标签和metafield；发布前通过test order验证结账、订单处理、库存、运费、通知与税费。

官方资料：

- [Shopify新店通用清单](https://help.shopify.com/en/manual/intro-to-shopify/initial-setup/new-to-shopify-checklists/general-checklist)
- [Shopify商品管理](https://help.shopify.com/en/manual/products)
- [商品变体](https://help.shopify.com/en/manual/products/variants/add-variants)
- [库存设置](https://help.shopify.com/en/manual/products/inventory/setup)
- [测试订单](https://help.shopify.com/en/manual/checkout-settings/test-orders)
- [Dev Dashboard应用](https://shopify.dev/docs/apps/build/dev-dashboard/create-apps-using-dev-dashboard)

这些官方资料定义平台操作基线，不证明目标商店已经完成任何设置。

## D-033至D-049如何处理

- 保留Momcozy美国市场、可穿戴式吸奶器、`gross_sales`、30天窗口、AGT-023、专用Dev Dashboard App、`client_credentials`、五项只读Scope、Level 1、45天规范化订单行保留、`custom.product_family`和官方Variant报告等目标合同。
- 将“3–10个高GMV SKU”改读为上线后范围生成规则；在`SHOP-G7`前不存在真实SKU清单或Top 5。
- 将目标Dev Dashboard现场证据、实际Scope、Query Hash、Definition实例和报告能力从“当前下一步”移动到`SHOP-G6/SHOP-G7`。
- `ORDER_LINE_WINDOW_V1`、API查询、业务Mutation和全部生产动作继续关闭。

## 当前完成标准

本阶段只要求：完整方案源文档与中文Site一致；店铺治理方案的六个治理域和十项产物可审阅；明确绿地路线、责任岗位、阶段产物、门禁、目标状态和未发生事项；站点在桌面与移动视口可阅读并可公开发布。它不验收或授权Shopify登录、配置、产品上线、API连接、GMV、组织缩编或生产自治。
