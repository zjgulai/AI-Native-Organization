# Sanbao_Web VIS-G5 静态质量审查

状态：**COMPLETE_STATIC_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK_PENDING_VIS_G6**。D-075 已完成实际素材质量验收；D-076 已接受 `VIB-AGT-029` 与 `VIB-AGT-041` 的近似视觉风险。53 条绑定均可进入未来 `Visual Identity Release` 审查，`VIS-G6` 未启动。

审查日期：2026-09-24<br>
关联决定：D-068、D-069、D-071、D-072、D-073、D-075、D-076、ADR-0015<br>
机器可读事实源：[VIS-G5 静态质量登记册](SANBAO-WEB-VIS-G5-STATIC-QUALITY-REGISTER-2026-09-24.json)

## 1. 结论

`VIS-G5` 从 D-073 已接受的固定来源锚点临时读取 53 条 VIS-G3 绑定引用的 424 个实际交付二进制。所有二进制均通过固定 Git blob、字节数、文件签名 MIME、解码格式、像素尺寸与精确 SHA-256 核验；全部 53 条均通过同人物深浅主题、原生 PNG 至 WebP 一致性、裁切安全性和 64px 辅助视觉审阅。

这不等于 53 个角色都已发行。`AGT-029` 与 `AGT-041` 在 64px 下具有较高的跨角色视觉近似，容易在组织列表中被误认；用户已通过 D-076 明确接受该风险并保留现有绑定。因此二者可以与其余角色一起进入未来 `Visual Identity Release` 审查，但近似信号、风险说明和 D-076 必须保留；没有自动重绑、替换、发行或页面接入。

| 结论层 | 数量 | 状态 |
| --- | ---: | --- |
| 固定提交实际交付二进制 | 424 | `VERIFIED` |
| 单角色的主题、尺寸、裁切、解码与可读性 | 53 | 通过 |
| 可进入未来视觉发行审查的绑定 | 53 | 51 条 `PASS_FOR_VIS_G5_ASSET_QUALITY`；2 条带 D-076 已接受风险 |
| 已接受近似视觉风险的绑定 | 2 | `PASS_FOR_VIS_G5_ASSET_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK` |
| 已创建的 Visual Identity Release、页面投影、发布或运行时接入 | 0 | 未创建 / 未启动 |

## 2. 固定输入与不变量

| 项目 | 结果 |
| --- | --- |
| 上游仓库 | `zjgulai/Sanbao_Web` |
| 固定提交 | `2e676da87999c88fbc70baae9eb5dbf72c2b757e` |
| 固定 tree | `4948f180d4e5a0bc8c599022227c384d525729c5` |
| 可复算目录锚点 | D-073 已接受的 `VIS-G2-CANONICALIZATION-1`；VIS-G0 旧指纹仍只作历史记录 |
| 输入登记册 | `VIS-G2-SANBAO-WEB-2026-09-24`、`VIS-G3-SANBAO-WEB-2026-09-24`，其内容 SHA-256 已记录 |
| 实际读取范围 | 53 个源人物、106 个原生 PNG、318 个 WebP，共 94,737,531 bytes |
| 二进制复算摘要 | `VIS-G5-BINARY-CANONICALIZATION-1`，SHA-256 `785b54f2be55c047b4aa502d7e216dc897585c38c31f40ca72a704cb41402837` |

本门仅在内存中读取固定提交的已批准交付件。辅助审阅联系表只建在项目外临时目录，完成 53 条复核后已经删除。登记册不保存来源路径、raw URL、图像、base64、提示词、风格参考或身份参考；项目、`dist/`、Pages 和 DSH 中均未写入图片二进制。

## 3. 已验证的质量证据

### 3.1 二进制、格式与尺寸

- 424/424 个实际内容与 VIS-G2 的固定 Git blob、字节数和声明尺寸一致。
- 106 个原生 PNG 与 318 个 WebP 的文件签名、解码格式和实际像素尺寸均符合绑定规格。
- 424 个实际内容 SHA-256 均唯一；没有精确二进制重复组。
- 每条绑定保留同一源人物的深色和浅色 `64/128/256/native` 链；`primary_asset_id` 与 `detail_asset_id` 继续指向同一 256px 交付件。

### 3.2 原生、主题与小尺寸一致性

- 原生 PNG 经 LANCZOS 缩放后与 WebP 对应尺寸的 PSNR 为 35.0305–41.6627 dB，dHash 距离为 0–4，均高于本门 30 dB / 不超过 12 的阈值。
- 53 个深浅主题对的中心亮度相关系数为 0.4006–0.8384，中心 dHash 距离为 1–24，均符合本门同人物主题一致性阈值。
- 53 条均以 256px 深浅主题主图和上采样 64px 深浅主题列表图完成辅助视觉审阅：未发现损坏、主题换人、明显截断、头发/头肩裁切失稳或小尺寸不可辨的问题。
- 三位管理层展示名和来源人物保持不变：天時→AGT-067、地利→AGT-090、人和→AGT-056；alt text 只使用管理层显示名，不泄露 AGT 来源编号。

### 3.3 中性 alt text

全部 53 条已将 VIS-G3 草案固定为中性描述：

- 深色：`{展示角色名}数字分身形象，深色主题`
- 浅色：`{展示角色名}数字分身形象，浅色主题`

它不包含外貌、能力、性格、来源人物、提示词或参考资料。未来 `VIS-G6` 若已在同一可访问名称中呈现角色名和职务、头像仅为装饰，可按页面语义改用空 `alt`，但不能重复播报或泄露来源上下文。

## 4. 跨角色近似与 D-076 处置

### 4.1 强制 HOLD：AGT-029 与 AGT-041

| 项目 | 结果 |
| --- | --- |
| 绑定 | `VIB-AGT-029`、`VIB-AGT-041` |
| 问题 | 64px 组织列表尺寸下，人物轮廓、正面构图与服装色调的组合过于接近，存在跨角色误认风险 |
| 可复算候选信号 | 深色原生中心 dHash 距离 `4`、中心亮度相关 `0.9539` |
| D-075 初始状态 | 两条均为 `PENDING_OWNER_VISUAL_DECISION` |
| D-076 处置 | 用户选择“接受近似风险”，两条均为 `PASS_FOR_VIS_G5_ASSET_QUALITY_WITH_ACCEPTED_OWNER_VISUAL_RISK` |
| 当前禁止动作 | 自动重绑、自动替换、自动创建 Visual Identity Release、自动页面接入、自动公开发布 |

这是一项跨角色可区分性问题，不是文件损坏、裁切失败、主题不一致或角色合同问题。两条各自的深浅主题、尺寸和个体质量均合格。D-076 接受的是“在组织列表中可能被误认”的展示风险，不是对近似信号的删除或否认，也不扩大角色权限或改变源人物关系。

若未来需要撤回 D-076、重绑其中一条或要求新变体，必须建立新的决定，并重跑受影响的 VIS-G3 与 VIS-G5 验证；不能静默修改既有风险处置。

### 4.2 监测但不阻断的近似对

以下三对完成辅助审阅后仅记录为未来图像变更时的监测项，不改变当前绑定：

| 人物对 | 当前处置 |
| --- | --- |
| AGT-027 / AGT-030 | `MONITOR_ONLY_AFTER_ASSISTED_VISUAL_REVIEW` |
| AGT-011 / AGT-032 | `MONITOR_ONLY_AFTER_ASSISTED_VISUAL_REVIEW` |
| AGT-016 / AGT-046 | `MONITOR_ONLY_AFTER_ASSISTED_VISUAL_REVIEW` |

感知候选只是复核线索，不是身份结论，也不能创建角色或重映射任何岗位。

## 5. 候选素材池与展示边界

本门实际读取的是 53 条当前绑定所需的 424 个 `APPROVED_DELIVERY` 交付件。冻结范围内其余素材，包括未绑定人物、尺寸变体、来源、参考、设计和总览图，继续由 VIS-G1/VIS-G2 的 1,848 项固定远端登记册治理：它们是未来数字员工的候选素材池，不是已启用的数字员工，也没有被复制进当前公开仓库。

若后续要将全部素材物化为长期档案，必须先决定私有存储位置、访问控制、保留周期和公开隔离方式；不能因 D-071 的使用授权而直接把 `POOL_ONLY` 或未绑定素材放入当前项目、`dist/` 或公开 Pages。

## 6. 复算与验证

在项目根目录运行：

```sh
python3 scripts/build-sanbao-vis-g5.py \
  --output docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G5-STATIC-QUALITY-REGISTER-2026-09-24.json \
  --reviewer "Codex assisted visual review, full 53-binding contact-sheet coverage" \
  --accepted-risk-binding VIB-AGT-029 \
  --accepted-risk-binding VIB-AGT-041 \
  --owner-risk-decision-id D-076 \
  --monitor-persona-pair AGT-027,AGT-030 \
  --monitor-persona-pair AGT-011,AGT-032 \
  --monitor-persona-pair AGT-016,AGT-046

node scripts/verify-sanbao-vis-g5.mjs \
  --quality-register docs/12-rollout/visual-assets/SANBAO-WEB-VIS-G5-STATIC-QUALITY-REGISTER-2026-09-24.json
```

构建器会重新临时读取固定提交的 424 个交付件；任一读取、二进制或解码不匹配都会失败，而不会沿用旧元数据。校验器不联网，不读取图像，复算登记册的输入指纹、424 条结果、53 条绑定、D-076 两条已接受风险、alt text、候选池边界和 VIS-G6 未启动状态。

## 7. 未发生的改变

本门没有修改角色目录、管理层目录、Soul Contract、Role Playbook、Preset Blueprint、Role Release Bundle、Access、Policy Gate、Case、Service Identity 或生产权限；没有创建 Visual Identity Release，没有接入页面、发布、GitHub Pages、DSH 或运行时。

`VIS-G6` 现处于 `NOT_STARTED_REQUIRES_SEPARATE_AUTHORIZATION`。D-076 已解决 `VIB-AGT-029` / `VIB-AGT-041` 的所有者处置，但仍须取得独立页面/发布授权，且在发行时保留已接受风险记录。
