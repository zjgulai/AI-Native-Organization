# ADR-0012：独立岗位 Preset 与受控组队运行

状态：已确认设计方向；尚未生成目标 DSH 环境的可导入配置。日期：2026-09-17。

## 背景

早期 v2 架构把 50 个岗位定义为逻辑 Role Profile，并让一张紧耦合 Case 只运行一个 Case Agent，其他岗位只能以 Skill 或产物规范贡献能力。这保证了上下文和结果责任清晰，但没有充分表达管理者提出的目标：每个岗位都能像一个独立 Skill 一样接收任务、独立产出和独立验收，同时可以组合完成复杂业务。

## 决策

采用“双层运行模型”：

1. **独立岗位分身**：每个岗位拥有唯一的 Role Profile、Role Playbook、Skill refs、产物合同、评估集、Access Contract 和 DSH Preset Blueprint。它可以在明确目标、范围、输入、策略和验收者后独立完成一项边界清晰的工作。
2. **受控组队**：复杂 Case 由模型外 Case Control 根据价值流、阶段、依赖和已发布装配规则选择一个 Lead 与若干 bounded Role Worker。Lead 对 Case 结果负责，Worker 只消费已验收的 Stage Artifact，返回带来源、版本、Hash 和验收状态的增量产物。
3. **协同协议**：岗位之间不共享隐式会话，不通过自由聊天分配权限或决定资产动作；交接统一使用 ArtifactEnvelope，冲突由 Case Control、Assurance Contract 和确定性策略处理。
4. **执行边界**：所有岗位都只能产生 Action Intent；Policy Gate 和 Execution Broker 在模型外持有服务身份、执行资产动作并核验回执。
5. **配置边界**：仓库先交付 50 份 Role Playbook、50 份 DSH Preset Blueprint 和总清单。由于目标 DSH 版本、preset schema、插件、Host 行为和服务身份尚未被核实，这些文件是设计合同，不是可直接导入的运行配置。

## 选择理由

- 让“50 个岗位”具备可独立验收、可单独迭代和可独立停用的清晰边界。
- 保留复杂经营任务的单一结果责任和产物门禁，避免多个 Agent 共享可变上下文造成责任漂移。
- 让同一岗位既能承担独立任务，也能在产品、供应、渠道、服务和平台场景中作为可组合能力复用。
- 将 DSH Preset 当作运行资产的装配入口，而不是权限边界；权限仍由模型外 Access、Policy 和 Broker 决定。

## 弃选方案

- **50 个岗位全部互聊**：无法稳定确定上下文、版本和结果责任，且 DSH 当前父子消息能力不能替代持久业务协同。
- **只保留一个全能 Case Agent**：运行责任清晰，但无法满足岗位独立启动、单独验收和单独停用的要求。
- **直接生成 DSH 可导入 YAML/JSON**：当前真实 schema 与目标环境未核实，容易把候选字段误当作平台能力。

## 影响与后续

- 原 D-020 的“岗位没有运行身份”语义由本决定替代；五契约、七状态生命周期、八阶段产物门禁和模型外资产执行边界继续有效。
- 需要维护 50 个独立 Role Playbook 和 50 个 Preset Blueprint 的版本、评估和回退记录。
- Case Control 需要新增 Lead/Worker 装配记录、ArtifactEnvelope 校验、超时/重试/取消和 Worker 隔离策略。
- 在进入 DSH 配置导入前，必须核实目标产品版本、preset schema、插件版本、Host tool 行为、凭据托管和审计位置，并用独立模式与组队模式回放验证。
- 该决定不授权 Shopify、企业系统、账号、资金、商品、库存或其他资产的连接、写入或生产自治。

