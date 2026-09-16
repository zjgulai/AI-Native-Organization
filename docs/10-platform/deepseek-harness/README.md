# DeepSeek Harness 落地

状态：用户指定目标平台；2026-09-11至2026-09-17 已核实本机安装元数据、包内文档和 `dsh` CLI 只读信息，企业目标部署尚未确认。2026-09-17 已补齐50份独立Role Playbook与50份Preset Blueprint设计资产，仍未生成可直接导入目标环境的配置。

本机应用名为 LUTE Agentic System，Desktop 版本 2.0.5、构建 2.0.5-lute.2.0.0，应用包内 `@deepseek-ai/dsh` 声明版本为 0.1.2-rc.1；本机 `/opt/homebrew/bin/dsh` CLI 自报版本为 0.1.5-rc.1。CLI 帮助显示当前入口是 profile/patch/plugin/web 组合，没有独立 `preset` 子命令，因此本项目的 Preset Blueprint 先作为岗位装配契约，待目标 profile/schema 核实后再投影。上游 Harness、社区 Desktop 和本机定制构建分别记录，依据见 [来源索引](../../14-research/SOURCES.md)。

当前文档支持角色预设、技能和子 Agent 协作；本机 `dsh-workflow` 文档明确列出工作流没有检查点与重启恢复。会话持久化有单独的恢复能力，不能据此推导采购、预算等业务流程可以可靠恢复。需要进一步核实目标环境是否有其他组件补足这些需求。Preset在本项目中被建模为独立岗位的装配入口：独立模式可处理一项边界清晰的任务，组队模式由模型外Case Control选择Lead/Worker并以ArtifactEnvelope交接。

## 落地顺序

[完整落实方案](IMPLEMENTATION-PLAN.md)已将岗位、技能、场景、权限和恢复需求映射到本机已核实能力及待补缺口。该方案用于决定复用和实施边界。

1. 确定产品、部署形态、版本、插件、官方文档和可用导出方式。
2. 维护 [能力矩阵](CAPABILITY-MATRIX.md)，区分证实、未核实、需要补足和无法满足的要求。
3. 将已经确认的场景、50份Role Playbook、50份Preset Blueprint、协作关系与权限映射到实际支持的对象；设计资产入口见[preset-blueprints/manifest.json](preset-blueprints/manifest.json)。
   对应的50份Soul Contract见[roles/souls](../../05-agents/roles/souls/)，岗位独立执行与组队门禁见[实施TODO](../../12-rollout/ROLE-PRESET-IMPLEMENTATION-TODO.md)。
4. 说明原生配置、插件/外部集成和需要开发的边界，给出可评审的配置方案。
5. 在批准的验证环境中测试正常执行、拒绝越权、失败恢复和审计，再依授权实施。

## 配置交付边界

当前 [configs](configs/README.md) 仅说明交付约束，不包含猜测的 schema 或可导入配置；[preset-blueprints](preset-blueprints)保存的是50个岗位的设计蓝图与映射，不可直接导入。用户本机产品证据不等于企业环境支持同样能力，也不等于已经授权配置该环境。
