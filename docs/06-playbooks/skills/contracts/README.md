# Skill Contract 机器可读契约

状态：v1 设计投影。目录内 `*.contract.json` 是同名 Markdown 契约（`../SKL-BRAND-0X.md`）的结构化机器可读版本；Markdown 正文仍是人读权威，两者语义必须一致，冲突时以 Markdown 为准并回改 JSON。

## 文件

| 文件 | 对应契约 | 产物 artifact_kind |
| --- | --- | --- |
| `skill-contract.schema.json` | —（包络 schema，draft 2020-12） | — |
| `SKL-BRAND-01.contract.json` | 品牌覆盖审计 | `coverage_audit_report` |
| `SKL-BRAND-02.contract.json` | 品效归因实验设计 | `attribution_design` |
| `SKL-BRAND-03.contract.json` | 出海市场进入检查 | `market_entry_check` |
| `SKL-BRAND-04.contract.json` | VOC 细分假设验证 | `segmentation_hypothesis_pack` |

## 与 Markdown 契约的分工

- **Markdown**：职责、质量门禁的完整论证、评估案例的回放要点、边界叙述——供人评审与 AGT-048 治理。
- **JSON**：输入/输出字段、工具依赖状态、挂载岗位与场景、证据分级规则——供未来 Context Manifest 装配器与 Stage Artifact schema 校验消费。

## 校验

```bash
python3 -c "import json,sys; [json.load(open(f)) for f in sys.argv[1:]]" docs/06-playbooks/skills/contracts/*.contract.json docs/06-playbooks/skills/contracts/skill-contract.schema.json
```

完整 schema 校验需 `jsonschema` 库；当前仓库校验脚本 `verify-docs-links.mjs` 只保证 JSON 可解析与链接可达，不做 schema 语义校验。

## 边界

全部 `status: DESIGN_BASELINE`、`runtime_integration: NOT_RUNTIME_BOUND`：这些文件是设计投影，不是 DeepSeek Harness 可导入的 Skill 配置，不携带业务授权，不产生资产动作。Skill 发布仍走 AGT-048 候选维护 → 五契约评审 → Release Bundle 流程，岗位不能发布自己的 Skill（ADR-0004）。
