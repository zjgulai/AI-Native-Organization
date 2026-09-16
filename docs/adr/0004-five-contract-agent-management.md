# ADR-0004：以五份版本化契约管理AI岗位

Status: accepted, 2026-09-11

## Context

50个逻辑岗位分身需要持续更新业务目标、Skills、模型、工具、记忆和评估。如果设置上级Agent直接管理下级Agent，会重新引入多Agent层级、循环授权和自我修改风险；如果把全部规则放进一个System Prompt，又无法分别版本化、缓存、评测、撤权和回退。

## Decision

1. 每个Role Profile由Business、Skill、Runtime、Access和Assurance五份版本化契约共同管理，不设置上级Agent。
2. Business Contract承载使命、主岗位人格、目标、KPI、产物和经营边界；Skill Contract承载按需能力、Playbook、知识与Memory Policy；Runtime Contract承载模型、上下文、缓存、成本、SLO和回退；Access Contract承载数据、工具、Action Intent和策略范围；Assurance Contract承载评测、独立性、发布与审计门槛。
3. AI岗位可以提出Change Proposal，但不能直接发布自己的Prompt、Skill、Model、Tool、Memory或Policy。AGT-048、AGT-049、AGT-050和AGT-005对相应契约只有候选维护、检查、否决或恢复建议权。
4. 低风险变更只有在已有公司目标、Access上限和Assurance门槛内，且确定性评测与策略门禁全部通过时，才可自动发布。改变公司目标、扩大资产权限、降低控制标准或改变独立性约束的变更保持暂存，需要新的公司级契约。
5. Service Identity、凭据、发布门禁和执行控制始终位于模型外。五份契约的存在不代表生产授权。

## Considered Options

- 上级Agent直接管理下级Agent：容易理解，但形成多Agent层级、自我批准和运行时路由，拒绝。
- 每个岗位一份大Prompt：文件少，但业务、能力、运行、权限和保障无法独立版本化或回退，拒绝。
- 五份版本化契约与确定性发布门禁：职责清晰，可单独评测、缓存、撤权和回放，因此采用。

## Consequences

- 50张岗位卡将被编译为Role Profile与五类契约引用，而不是直接成为长System Prompt。
- 任何Case Agent启动时都必须记录五类有效版本；缺项、冲突或过期时拒绝运行或进入隔离。
- Site需要按岗位展示五契约、候选变更、评测和授权状态，但不展示凭据或未经批准的敏感正文。
- DeepSeek Harness适配必须区分平台原生配置、外部契约注册表与确定性发布/权限服务，不能假设提示词或插件自动实现本ADR。
