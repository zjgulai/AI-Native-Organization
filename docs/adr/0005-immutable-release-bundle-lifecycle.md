# ADR-0005：不可变Role Release Bundle与七状态生命周期

Status: accepted, 2026-09-11

## Context

五份Agent管理契约可以独立演进。如果运行时总是读取“最新版本”，同一Case可能在处理中途改变人格、Skills、模型、权限或验收标准，无法复现结果；如果只记录单份契约版本，又无法证明实际运行的完整组合。

## Decision

1. 每个可运行岗位版本使用不可变Role Release Bundle，固定Business、Skill、Runtime、Access和Assurance五份契约版本及完整性Hash。
2. 任一契约变化都生成新Bundle；已启动Case固定引用原Bundle，不允许热改或静默漂移。
3. Bundle采用Draft、Evaluated、Shadow、Limited、Production、Quarantined和Retired七个状态。状态转换由确定性发布门禁执行，Agent只能提出变更或证据。
4. Bundle进入Quarantined后禁止新Case和新资产动作；受影响在途Case在下一个动作边界冻结，并先核对已发出动作的真实状态。
5. Rollback是选择上一已知正常Bundle的受控操作，不是生命周期状态。回退后必须从Shadow重新验证，不能直接恢复Production。
6. 当前50个岗位没有任何已实例化Bundle或生命周期状态；设计确认不构成部署、影子运行或生产授权。

## Considered Options

- 各契约独立读取最新版本：更新方便，但Case不可复现且可能中途扩权，拒绝。
- 允许运行中热改Bundle：响应快，但无法可靠定位行为变化和外部动作责任，拒绝。
- 不可变Bundle、Case固定引用与确定性状态机：增加版本对象，但提供可复现、隔离和回退能力，因此采用。

## Consequences

- Case工单必须保存`role_release_bundle_ref`，所有工具调用、Action Intent、回执和评测可追溯到同一Bundle。
- Site和Harness适配必须区分“岗位存在”“Bundle已创建”“处于某生命周期状态”和“具体业务范围已授权”。
- 版本回退不会撤销已发生的业务动作；补偿、冻结和恢复仍由业务控制层处理。
