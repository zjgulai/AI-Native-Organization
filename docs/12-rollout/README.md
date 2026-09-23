# 组织迁移与推广

状态：Agent-first自主运行框架已确认；[实施章程](IMPLEMENTATION-CHARTER.md)定义从经营样本到扩展的阶段门，[平台落实方案](../10-platform/deepseek-harness/IMPLEMENTATION-PLAN.md)给出实施依赖。具体日期、系统连接与试点阈值尚未决定。

数字分身的视觉身份与素材治理由[D-068 至 D-077 Sanbao视觉身份与资产方案](SANBAO-VISUAL-IDENTITY-ASSET-PLAN.md)单独定义：Sanbao_Web 已在[VIS-G0来源冻结记录](visual-assets/SANBAO-WEB-SOURCE-SNAPSHOT-2026-09-23.md)中固定到具体提交与tree，现有50岗按稳定AGT ID映射，三位管理层分身的关键交付候选也已登记；视觉素材不改变Role Release Bundle、Access、Case编排或生产权限。按 D-071 全量授权，VIS-G1 已在[权利、来源与公开范围审查](visual-assets/SANBAO-WEB-VIS-G1-RIGHTS-AND-VISIBILITY-REVIEW-2026-09-23.md)中通过，结果为 COMPLETE_AUTHORIZED：1,729 个图像为 APPROVED_DELIVERY，119 个为 POOL_ONLY。D-072 已完成 [VIS-G2结构性语义审查](visual-assets/SANBAO-WEB-VIS-G2-SEMANTIC-REVIEW-2026-09-24.md)：1,848 个素材和102个人物族可检索；G0 历史目录指纹不可复算异常已显式登记。D-073 已接受 `VIS-G2-CANONICALIZATION-1` 为后续视觉门的可复算目录锚点，并在[VIS-G3视觉绑定审查](visual-assets/SANBAO-WEB-VIS-G3-BINDING-REVIEW-2026-09-24.md)中完成 53 条独立、同人物深浅主题的结构性绑定。D-075 实际核验424个绑定交付二进制；D-076 已接受`VIB-AGT-029`与`VIB-AGT-041`的64px视觉近似风险，因此53条可进入视觉发行且风险记录保留。D-077 已完成本地发行`VIR-SANBAO-WEB-2026-09-24-R1`：将53条已验收身份的318个 WebP 交付件接入静态 Site，并以中性alt text、深浅主题和公开范围校验交付；候选池、原生PNG、来源/参考/设计输入、提示词和身份参考资料仍未公开。GitHub Pages 的实际部署仍须作为独立发布证据验收，不能以本地页面接入替代。

D-074 已启动并完成 [VIS-G4 Digital Persona Dossier 审查](visual-assets/SANBAO-WEB-VIS-G4-DOSSIER-REVIEW-2026-09-24.md)：一个可复算的登记册包含 53 条独立可寻址画像，组合既有角色合同引用、协同与治理边界、VIS-G3 结构性视觉绑定及来源版本，而不复制角色合同或图片。D-075 已完成实际图片质量验收，但不改变 Dossier 的设计态、Role Release Bundle、权限或运行状态；MGT-002/MGT-003 的4条既有 Blueprint 字段不一致继续作为来源例外隔离，未修改 Blueprint、权限或运行状态。

Magpie-Horch 的 50 个角色 preset 注入采用单一事实源、角色级权限和模型外 Case Control；方案、冲突审计与 RP-M0 至 RP-M7 TODO 见[注入方案](MAGPIE-HORCH-ROLE-PRESET-INJECTION-PLAN.md)，RP-M1 的源码证据与候选 schema 见[DSH 预设与适配契约证据](../10-platform/deepseek-harness/MAGPIE-RP-M1-SCHEMA-EVIDENCE.md)，RP-M2 实施前输入与 compiler 规格见[compiler 注入规格](MAGPIE-RP-M2-COMPILER-INJECTION-SPEC.md)。本文件只在 AI 组织变革项目中定义目标和门禁，不代表 Magpie-Horch 已被修改或任何业务系统已连接。

需要形成：试点范围、AI结果负责人、所需数据与工具、能力资产迁移、并行运行安排、推广条件、停止条件、冻结与恢复方案、未来组织复核以及沟通计划。

人员精简、转岗、外包或职责调整均需有明确经营理由、实际工作量和独立决定。将能力验证、流程切换和编制调整分别记录，避免用试点演示直接支撑大范围组织变更。

每一阶段必须能回答：哪个Agent/系统承担结果，什么证据足以扩展，哪里失效就冻结，原有业务如何继续运转。
