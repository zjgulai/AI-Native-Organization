# R04：Agent-first自主运行的七项决定

状态：进行中。R03已把运行主体从“真人负责人+AI辅助”改为“50个Agent自主闭环”。以下七项是该模型进入实际配置前必须由经营方决定的完整前置条件，已逐项推进。

## R03回答记录

| R03问题 | 用户回答 | 已记录影响 |
| --- | --- | --- |
| Q1 首个样本 | 确认建议（选项1） | 首个样本：Momcozy可穿戴式吸奶器；Amazon单市场（先用美国站）；1个Amazon账号/店群；3–10个高GMV SKU；排除近期质量、缺货、账号风险SKU；观察窗口先用30天滚动 |
| Q2 责任与仲裁 | 50个分身自行匹配 | 形成D-016，取消初始真人负责人作为常规节点 |
| Q3 GMV契约 | 同意建议 | 保留原始GMV、取消退款和经营约束分开呈现；权威系统、口径和阈值仍待指定 |
| Q4 运行权限 | MCP/tools/API/hooks，可用工具UI/UX替代看板 | 形成D-017；未授予具体系统的生产写入权限 |
| Q5 系统 | 提供《公司平台和系统全景图》 | 形成D-018与连接资产盘点；接口/权限尚未核实 |
| Q6 新品/HITL | 初始不启动真人负责人，HITL后补 | 形成D-016、D-019；首个新品机会仍待确定 |
| Q7 真人团队 | 暂不考虑 | 真人组织设计后置 |

---

❓ **R04-Q1 — 首个自主经营样本的精确范围**：请指定首个样本的“品牌 × 市场 × Amazon账号/店群 × SKU集合 × 观察窗口”。如果暂时只给代号，也请给SKU数量级和是否存在质量、缺货、账号事件。

✅ 历史选择：Momcozy可穿戴式吸奶器、Amazon US、一个账号/店群、3–10个高GMV SKU、30天窗口。

✅ 2026-09-16确认：D-033将渠道切换为Shopify DTC；D-034确认沿用Momcozy、美国市场、可穿戴式吸奶器、3–10个高GMV SKU和滚动30天窗口，由AGT-023负责。具体Shop GID/别名与Variant/SKU白名单留到连接实例化，不把公开域名或商品标题当作权威ID。

---

❓ **R04-Q2 — GMV与经营约束的权威来源**：100亿对应哪个年度和哪一种口径？首个样本的原始GMV、取消、退款、广告、价格、库存、结算/现金和质量事件，分别以RootData、ERP、Amazon、数智星图或其他哪个来源为权威？哪些约束先可见，哪些要设为停止线？

➡️ Shopify试点建议先决定“原始GMV”采用Shopify `gross_sales`、`net_sales`还是`total_sales`；折扣、销售冲销、退款、支付状态和结算现金始终分开。Shopify作为渠道事实入口，ERP/WMS/QMS和实际广告平台作为约束与成本来源，阈值只写首个样本且带有效期。

✅ 2026-09-16部分确认：用户选择选项1，以Shopify `gross_sales`作为试点原始GMV，形成D-035。其定义为商品售价×数量，折扣、销售冲销、退款、税费、运费、支付状态和结算现金继续单列。100亿公司口径、跨系统权威源和约束阈值仍按后续单题确认。

---

❓ **R04-Q3 — 自治异常策略**：无动作策略、跨范围、工具失败、回执不明或数据冲突时，是否接受“只冻结受影响范围、写自治异常账、先查询外部状态再重试/补偿”的默认规则？

➡️ 建议：接受。它让Agent保持常规链路的自主性，又避免用换会话、重跑整单或静默成功处理异常。

---

❓ **R04-Q4 — 既有193/46个Agent的处置**：是否采用“归并为50个岗位可调用的能力包，并暂停新增并列人格”的方式？

➡️ 建议：采用。把现有任务型Agent、技能、知识、工具和评估资产接入能力登记册；50个岗位是唯一长期责任身份。

---

❓ **R04-Q5 — 首批系统连接与服务身份**：是否同意先按“RootData/Amazon读取 → ERP/PLM/QMS/WMS/TMS权威记录与回执 → Shopify/CRM/增长系统”的顺序盘点和接入？首批可提供哪些正式接口、MCP server或受控服务身份的名称/负责人？

➡️ 建议：同意该顺序，并先只提供只读或回执查询身份；等动作策略和回放通过后再逐类开启写入。请勿在本对话或仓库发送密钥。

✅ 2026-09-16确认：当前Amazon SP-API、RootData和数智星图均没有可用入口；Shopify承担首个DTC真实闭环入口。Amazon US样本转为后续渠道验证，Shopify数据不得冒充Amazon渠道事实。

➡️ 候选方案：新建试点专用Dev Dashboard App、复用既有企业集成，或先使用合规脱敏导出回放。官方已停止新建Shopify Admin内直接创建的旧式custom app，因此不把它列为新连接候选。连接模式确认后，再记录非敏感App/服务身份名称、Shop别名、Variant/SKU白名单与实际读回Scopes；不在仓库或对话中提供Token。

✅ 2026-09-16确认：用户选择选项1，新建BVS-01试点专用Dev Dashboard App，形成D-036。模型只接触受限`shopify_channel_read`工具，Client Secret与Access Token由模型外Token Broker/Secret Manager处理；App尚未创建或安装。下一单题确认拟创建App与美国主站是否属于同一Shopify Organization，据此选择client credentials或另行确认custom distribution安装认证。

✅ 2026-09-16确认：用户选择选项1，确认Momcozy美国主站与试点专用App归属于同一Shopify Organization，形成D-037；服务端认证路径固定为`client_credentials`。App仍未创建、发布版本或安装，也未取得Token或调用API。下一单题只决定首批3–10个Variant/SKU白名单的生成方式。

✅ 2026-09-16确认：用户选择选项1，形成D-038。首批白名单从现有权威报表中取最近完整30天`gross_sales`原始Top 5，再剔除质量、缺货或账号风险项；不从第6名以后回填，最终少于3个时HOLD。已形成[Variant/SKU范围清单契约](../../08-data/BVS-01-SHOPIFY-SKU-SCOPE-MANIFEST.md)，具体成员仍为空。下一单题确认权威报表来源。

✅ 2026-09-16确认：用户选择选项1，形成D-039。首批排名的权威来源采用目标Shop的Shopify Admin Analytics导出；原始CSV留在企业批准的受控对象存储，项目仓库与Site只保留来源引用、配置摘要、Hash、行数和脱敏清单。官方`Total sales by product variant`报告是首选候选，但目标Shop的实际报告、字段和导出选项尚未验证。下一单题决定具体报告路径。

✅ 2026-09-16确认：用户选择选项1，形成D-040。首份快照固定使用官方`Total sales by product variant`报告CSV；必需维度为Product title、Variant title、Variant SKU，必需指标为Gross sales与Net quantity。目标Shop缺字段、无法证明完整导出或SKU/GID映射不唯一时进入`HOLD_REPORT_CAPABILITY_MISMATCH`，不得自动改用自定义Analytics或ShopifyQL。下一单题确认可穿戴式吸奶器候选集合的权威成员来源。

✅ 2026-09-16确认：用户选择选项2，形成D-041。“可穿戴式吸奶器”候选集合由目标Shopify商店的Product type、product tag或product metafield判定；成员先在Product层确定，再由所属Variants继承并与Variant销售报告求交集。该决定当时尚未指定唯一主选择器，标题模糊匹配不允许；该单题随后由D-042完成。

✅ 2026-09-16确认：用户选择选项1，形成D-042。唯一主选择器采用具有定义与校验规则的Shopify Product metafield；Product type与tag不再作为成员判定回退。具体是新建专用定义还是复用现有定义，以及namespace/key、字段类型、允许值、精确匹配值、规范化、访问设置和目标Shop覆盖仍待下一单题确认；未确认前保持严格HOLD。

✅ 2026-09-16确认：用户选择选项1，形成D-043。Definition契约固定为新建专用`custom.product_family`、`ownerType=PRODUCT`、`single_line_text_field`，初始受控值与成员精确匹配值为`wearable_breast_pump`；Storefront/Customer Account暴露默认关闭。该选择不授权创建Definition或批量写入Product。下一单题确认首次填充与覆盖验收的权威种子来源。

✅ 2026-09-16确认：用户选择选项1，形成D-044。首次填充种子固定为一次性、负责人确认的Shopify Product GID清单。清单须绑定同Shop全量Product目录快照、版本与Hash；仅当Definition无冲突、GID全部解析、负责人确认完整、获批回填后读回100%一致时，`custom.product_family`才接管持续权威。该选择不授权访问或写入目标Shop。下一单题确认目标Shop接入的实施顺序。

✅ 2026-09-16确认：用户选择选项1，形成D-045。目标Shop实施顺序固定为只读预检先行：身份/Scopes、Definition冲突、全量Product目录、种子清单和报告能力形成不可变预检证据包，之后才提交独立写入方案。Definition缺失、兼容和不兼容分别进入创建计划、复用/回填计划和HOLD。该选择不授权创建App、访问Shop、调用API、导出报告或执行写入。下一单题确认首批App Scope集合。

✅ 2026-09-16确认：用户选择选项2，形成D-046。首批声明Scope固定为`read_products`、`read_orders`、`read_inventory`、`read_locations`和`read_markets`；`read_all_orders`、`read_customers`、`read_reports`及全部`write_*`排除，Admin Analytics CSV导出继续与App API Scope分离。实际Scopes须经`currentAppInstallation`读回并完全匹配。该选择不授权App创建/安装、Protected Customer Data访问、Token交换或API调用。下一单题只决定`read_orders`的Protected Customer Data等级与字段边界。

✅ 2026-09-16确认：用户选择选项1，形成D-047。`read_orders`采用Level 1最小必要政策；只允许30天SKU经营指标所需的订单/行项目GID、时间、状态、Product/Variant/SKU、数量及金额/币种。姓名、地址、邮箱、电话、客户主档、客户旅程、营销同意、IP、Token、备注、自定义属性、Metafield、Tag、员工、支付和其他自由文本字段全部拒绝；原始API响应不持久化，模型只接收SKU日聚合。资格、Query Hash和实际调用仍未批准或验证。

✅ 2026-09-16确认：用户选择选项1，形成D-048。Level 1规范化订单行加密保存45天，覆盖30天经营窗口并保留15天晚到/重放缓冲；从Shop时区源业务日结束时起算，期满后24小时内硬删除。原始API响应仍零持久化，模型仍只接收SKU日聚合。保留政策确认不等于Level 1资格或连接授权，订单Query继续禁用。

➡️ 下一单题选择Level 1资格证据路径：建议1为在目标Dev Dashboard现场核验App类型/分发方式、Level 1选择与资格、用途与Data protection details，并封存脱敏读回/拒绝证据；选项2为先在development store核验、再重复生产核验；选项3为暂不申请或核验并继续禁用订单Query。任何路径都不因本轮选择自动取得目标Shop访问或API调用授权。

✅ 2026-09-16确认：用户同意建议路径，形成D-049。Level 1资格证据直接在目标Dev Dashboard现场只读核验，不以development store替代目标环境事实。现场先分类App类型、分发/归属和同一Organization关系：public app需review；custom app与admin-created custom app的Level 1按官方类型政策为always available，但仍必须证明最小必要、用途、保留、加密、访问、审计和事件响应控制，且不得把政策资格当成运行访问通过。当前入口停在Shopify连接验证页，尚未观察任何App事实。

✅ 2026-09-16补充确认：用户明确Shopify是空白新店且没有上线产品，并要求先把完整方案做到Site，形成F-039和D-050。当前不存在可用于D-034范围的Product/Variant/SKU、30天报表、Top 5或订单证据；缺失数据不得解释为零。D-033至D-049全部保留为商品上线后的目标状态合同。

✅ 2026-09-16进一步确认：用户要求继续以完整方案审阅为主，店铺治理底座只写方案，形成D-051。当前不实例化FLOW-04、FLOW-02或FLOW-06 Case，不登录或配置Shopify。未来取得独立授权后才按`SHOP-G2`至`SHOP-G5`实施；目标Dev Dashboard登录和D-049资格观察延期到`SHOP-G6`，连续30个完整销售日后才在`SHOP-G7`生成范围和进入FLOW-01 Shadow。

✅ 2026-09-16发布授权：用户要求方案完成后上传对应GitHub并部署GitHub Pages，形成D-052。该授权只覆盖方案仓库与静态Site公开发布，不包含任何Shopify或企业业务动作。

---

❓ **R04-Q6 — 工具优先UI/UX的产品边界**：是否将工具调用卡、工单、策略、回执与自治异常作为默认工作入口，而不另建一套独立经营看板？

➡️ 建议：采用工具优先UI；保留按业务范围汇总的轻量经营视图，但不让它成为权限、动作或数据事实的来源。

---

❓ **R04-Q7 — 新品验证的首个机会**：第一条新品增长线要验证哪个用户问题、品类/产品方向或市场机会？请给出可观察的继续与停止信号，以及可用的受保护资源（资料、样品、调研、试验容量或小规模市场）。

➡️ 建议：选择一个可被否定的“母婴高频痛点 × 可穿戴吸奶器相邻场景”假设，而不是笼统寻找第二个爆品。

## 回答后的产物

R04确认后，项目将生成首个样本章程、三源数据契约、工具能力登记册、动作策略骨架、Agent匹配规则、自治异常验收集和目标Harness配置材料清单。实际连接、生产写入和对外动作仍需在对应系统与范围获得明确授权。
