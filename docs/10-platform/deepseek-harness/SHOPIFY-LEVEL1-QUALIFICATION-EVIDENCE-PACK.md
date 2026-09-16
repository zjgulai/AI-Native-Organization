# Shopify Level 1资格现场证据包

状态：`D-049 Path Confirmed / D-051 Deferred To SHOP-G6`。本证据包用于未来在目标Dev Dashboard中只读核验BVS-01试点App的类型、分发/归属、同一Organization关系、Level 1资格路径和数据保护准备度。目标Shop当前无上线商品，经营激活为`HOLD_NO_PUBLISHED_PRODUCTS`；这不构成Level 1资格失败，资格观察仍是`NOT_OBSERVED`。当前没有授权登录、创建App、发布版本、安装、选择或扩大Scope、交换Token、调用API、读取Protected Customer Data或提交review。

机器可检验模板见[结构化证据包](shopify-level1-qualification-evidence-pack.json)。

## 1. 资格判定不是统一的“审批按钮”

Shopify官方当前将Level 1路径按App类型区分：public app需要review；custom app与admin-created custom app的Level 1为always available。Protected Customer Data仍要求最小必要、用途透明、目的限制、保留期、静态/传输加密、访问控制、审计与事件响应。`client_credentials`只适用于App与目标Shop属于同一Shopify Organization。

因此现场必须先读回App类型和Organization关系，再解释资格状态：

| 现场分类 | Level 1资格路径 | BVS-01处理 |
| --- | --- | --- |
| Custom app，且与目标Shop同一Organization | 按官方类型政策可用；仍须证明Scope、字段、用途和控制符合要求 | 记录`AVAILABLE_BY_APP_TYPE_POLICY_PENDING_RUNTIME_PROOF`，不得直接启用Query |
| Admin-created custom app，且与目标Shop同一Organization | Level 1按官方类型政策可用；Level 2差异与本试点无关 | 同上，不申请姓名、地址、邮箱、电话 |
| Public app | Level 1需要review与Data protection details | 与D-036/D-037目标身份不一致，进入HOLD并重新决策 |
| App类型、分发状态或Organization关系无法唯一证明 | 资格不可判定 | `HOLD_APP_DISTRIBUTION_IDENTITY_UNKNOWN` |
| App与目标Shop不属于同一Organization | 不能使用既定`client_credentials`路径 | `HOLD_ORGANIZATION_RELATION_MISMATCH` |

“Always available”只表示该App类型的政策资格路径，不证明目标App已创建、安装、持有`read_orders`、实际响应未脱敏或企业控制已通过。

## 2. 现场只读证据顺序

1. **访问主体**：记录操作者的非敏感角色类别与是否具备App development权限，不保存姓名、邮箱或账号ID。
2. **Organization与目标对象**：记录脱敏Organization、App和Shop引用及同一Organization界面证据；不保存Secret、Token、完整域名或内部人员信息。
3. **App类型与分发状态**：读回public/custom/admin-created custom/merchant-organization default及当前分发状态。无法唯一归类即HOLD。
4. **App生命周期**：确认App是否已存在、是否有Released configuration、是否已安装；若不存在只记录`ABSENT`，不得在本轮创建。
5. **声明Scope**：只读记录版本中声明Scope；目标集合必须与`SHOPIFY_BVS01_READ_V1`一致。不得点击Release、Install或scope变更控件。
6. **Level 1解释**：依据App类型套用官方资格矩阵，记录是否需要review、review状态或always-available政策依据；不得把政策资格写成实际数据访问已验证。
7. **Data protection details与企业控制**：逐项记录最小必要、用途、保留、加密、访问、审计、事件响应、DPA/隐私说明状态。缺项进入`HOLD_DATA_PROTECTION_REQUIREMENT_GAP`。
8. **封存**：生成脱敏截图/页面引用、采集时间、官方资料版本、字段Hash和结论；原始截图放企业批准的受控存储，仓库与Site只保留摘要、Hash和引用。

## 3. 现场禁止动作

- 不创建、删除或修改App；
- 不选择分发方式，不提交review或Data protection details；
- 不创建/发布Configuration version，不改变Scopes；
- 不安装App，不交换或复制Client Secret/Access Token；
- 不调用Admin API，不测试订单Query，不读取客户或订单数据；
- 不把页面中的Secret、人员、店铺域名、客户信息或内部ID写入仓库、Site、Prompt、Skill或记忆。

任一页面要求提交、保存、授权、安装、生成Secret或发送数据时停止，只记录`ACTION_REQUIRES_SEPARATE_AUTHORIZATION`。

## 4. 证据包组成

| 证据ID | 内容 | 完成条件 |
| --- | --- | --- |
| `L1Q-E01` | 操作者权限类别 | 只记录角色类别，无个人身份 |
| `L1Q-E02` | Organization、App、Shop关系 | 同一Organization可验证；引用已脱敏 |
| `L1Q-E03` | App类型与分发状态 | 唯一归类且有页面证据Hash |
| `L1Q-E04` | App生命周期状态 | `ABSENT/DRAFT/RELEASED/INSTALLED`之一；本轮只读 |
| `L1Q-E05` | 声明Scope版本 | 精确集合与多余/缺失差异可计算 |
| `L1Q-E06` | Level 1资格路径 | 区分review与always-available，不冒充运行证明 |
| `L1Q-E07` | Data protection requirements | 每项`PASS/GAP/NOT_OBSERVED`并有责任引用 |
| `L1Q-E08` | 脱敏现场证据清单 | 引用、Hash、时间和采集面完整 |
| `L1Q-E09` | 资格结论 | `QUALIFIED_FOR_NEXT_AUTHORIZATION/HOLD`之一 |

## 5. 通过与HOLD

只有以下条件同时满足，证据包才可给出`QUALIFIED_FOR_NEXT_AUTHORIZATION`：App类型与D-036一致；App与目标Shop同一Organization；资格路径与官方矩阵一致；Level 1字段未包含姓名、地址、邮箱、电话；声明Scope无多余项；Data protection requirements无GAP；证据已脱敏、封存和复核。

该结论只允许进入下一次独立访问授权，不允许创建/安装App或读取数据。以下任一条件触发HOLD：

- `HOLD_APP_DISTRIBUTION_IDENTITY_UNKNOWN`
- `HOLD_ORGANIZATION_RELATION_MISMATCH`
- `HOLD_PCD_LEVEL1_QUALIFICATION_UNPROVEN`
- `HOLD_DATA_PROTECTION_REQUIREMENT_GAP`
- `HOLD_SCOPE_MISMATCH`
- `HOLD_EVIDENCE_REDACTION_FAILURE`

## 6. 当前现场状态

2026-09-16只读打开目标Dev Dashboard入口时，页面停在Shopify连接验证界面，尚未进入登录后的Organization/App页面。因此当前只能记录`BLOCKED_BROWSER_CONNECTION_VERIFICATION`；App类型、分发状态、Organization关系、资格状态和声明Scope均仍为`NOT_OBSERVED`。这不是资格失败，也不是访问授权。

官方依据：[Protected Customer Data](https://shopify.dev/docs/apps/launch/protected-customer-data)、[Dev Dashboard App](https://shopify.dev/docs/apps/build/dev-dashboard/create-apps-using-dev-dashboard)、[Distribution method](https://shopify.dev/docs/apps/launch/distribution/select-distribution-method)、[Client credentials](https://shopify.dev/docs/apps/build/authentication-authorization/client-credentials-grant)、[Dev Dashboard user permissions](https://shopify.dev/docs/apps/build/dev-dashboard/user-permissions)。
