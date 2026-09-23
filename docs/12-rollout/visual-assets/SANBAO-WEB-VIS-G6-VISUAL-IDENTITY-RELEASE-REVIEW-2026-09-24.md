# Sanbao_Web VIS-G6 视觉身份发行审查

状态：`COMPLETE_PUBLIC_VISUAL_IDENTITY_RELEASE`（本地发行登记册保留其部署前的历史状态；公网结果以本审查第7节及独立部署证据为准）

日期：2026-09-24<br>
发行：`VIR-SANBAO-WEB-2026-09-24-R1`

## 1. 结论

D-077 已授权并完成 VIS-G6 的本地视觉发行。静态站点现已接入 3 位管理层数字分身「天時」「地利」「人和」和 50 位执行岗位的展示性视觉身份；53 条绑定均使用经 VIS-G5 验收的深浅主题 WebP，页面可切换主题并提供中性 alt text。

本地发行包包含 318 个 WebP：每一角色分别提供浅色/深色的 64px 列表图、128px同主题后备图及 256px详情图。发行登记册记录的 WebP 可复算摘要为 `1b3b42808e165093ad9f5bc07dc53475bc141f0640fa982c0d3e450e138134ab`。

这不是运行时、DSH、Case、Access 或生产发行。GitHub Pages 的 Action、部署和公网实际字节已在独立证据中通过；这只证明静态展示已公开发布，不证明任何运行时或生产能力。

## 2. 本次接入范围

| 范围 | 已交付内容 | 不包含内容 |
| --- | --- | --- |
| 管理层展示 | MGT-001 天時、MGT-002 地利、MGT-003 人和；三者在「视觉身份」区各有主题匹配详情画像和展示使命 | 来源人物或原始参考资料的页面披露 |
| 执行岗位展示 | AGT-001 至 AGT-050 的64px列表头像；展开岗位详情时显示256px主题匹配画像 | 角色合同、权限、运行身份或组织关系改写 |
| 静态资源 | `dist/assets/visual-identities/vir-sanbao-web-2026-09-24-r1/` 下318个 WebP | 原生PNG、来源图、参考图、设计输入、总览图、提示词、身份参考资料 |
| 站点数据 | `dist/data/visual-identities.json`：仅角色展示字段、相对交付路径、中性alt text与批准的画像展示字段 | 上游路径、raw URL、Git blob、来源人物、候选池或任何受限资料 |
| 候选素材池 | 仍由固定远端来源及 VIS-G1/G2 登记册治理 | 不物化、不写入 `dist/`、不公开、不自动变成岗位 |

## 3. 输入与门禁

发行只接受以下已完成的输入状态：

1. VIS-G2：`VIS-G2-CANONICALIZATION-1` 是 D-073 接受的可复算目录锚点；VIS-G0 旧指纹仅保留历史追溯。
2. VIS-G3：53 条独立结构性视觉绑定，50 条 AGT 同 ID，三条 MGT 使用用户已决定的来源绑定。
3. VIS-G4：53 条 Digital Persona Dossier 的公开展示字段投影，不改写角色权威资产。
4. VIS-G5：424 个临时读取的实际二进制已通过哈希、字节、MIME、解码、尺寸和主题质量核验；本门仅复制所需的318个 WebP。
5. D-076：`VIB-AGT-029` 与 `VIB-AGT-041` 的64px跨角色近似风险已由所有者接受，风险信号和后续变更时复核义务随发行保留。

固定来源锚点为 Sanbao_Web 提交 `2e676da87999c88fbc70baae9eb5dbf72c2b757e`、tree `4948f180d4e5a0bc8c599022227c384d525729c5`；发行记录不依赖可漂移分支。

## 4. 本地验证结果

| 检查 | 结果 |
| --- | --- |
| VIS-G6 构建 | 通过；仅接入 53 条批准绑定和 318 个 WebP，临时目录原子切换为正式发行目录 |
| VIS-G6 独立校验 | 通过；角色覆盖、名称、主题、尺寸、二进制、哈希、公开范围、D-076风险和站点接线均一致 |
| 上游门禁复验 | VIS-G2、VIS-G3、VIS-G4、VIS-G5 校验器均作为发行前置条件复验 |
| 页面浏览器复验 | 通过；桌面及390px移动视口均加载管理层与执行岗位视觉资产，浅色/深色切换使用同一角色的匹配主题资源 |
| 移动布局 | 通过；文档宽度等于390px，页面无横向布局溢出。既有主导航继续采用内部横向滚动，以保留11个导航入口而不扩大页面宽度 |
| 受限资料扫描 | 通过；公开数据和`dist/`未发现候选池、PNG、来源、参考、设计、提示词或身份参考资料 |

## 5. 发布前后的责任边界

- 本地发行只表明受控静态交付包可重建、可验证、可浏览；它不证明 GitHub Pages、外部缓存或公网页面已更新。
- 后续 GitHub Pages 发布前必须继续运行站点现有的页面构建、文档链接和差异检查；发布后应重新记录 Actions 成功、Pages部署和公网页面对当时 `dist/` 的实际一致性。
- 若任何视觉资产、绑定、alt text、公开范围或主题尺寸发生变化，必须重新运行 VIS-G6 构建与校验；若涉及两条 D-076 风险角色，必须重新审阅保留的近似风险。
- 候选素材池的私有物化、将候选人物绑定为未来数字员工、角色合同变更、DSH接入或生产动作都不在本发行授权内。

## 6. 关联资产

- [VIS-G6机器可读发行登记册](SANBAO-WEB-VIS-G6-VISUAL-IDENTITY-RELEASE-2026-09-24.json)
- [VIS-G6公网部署证据](SANBAO-WEB-VIS-G6-PUBLIC-DEPLOYMENT-EVIDENCE-2026-09-24.json)
- [Sanbao视觉身份与资产方案](../SANBAO-VISUAL-IDENTITY-ASSET-PLAN.md)
- [VIS-G5静态质量审查](SANBAO-WEB-VIS-G5-STATIC-QUALITY-REVIEW-2026-09-24.md)
- [VIS-G4 Digital Persona Dossier 审查](SANBAO-WEB-VIS-G4-DOSSIER-REVIEW-2026-09-24.md)

## 7. GitHub Pages 公网部署证据

发行提交 `abfd1733e884adfe7b576e7fa028c8a9e23b67c4` 已由 [Deploy solution site to Pages #35910354396](https://github.com/zjgulai/AI-Native-Organization/actions/runs/35910354396) 成功部署。公开站点为 [zjgulai.github.io/AI-Native-Organization](https://zjgulai.github.io/AI-Native-Organization/)。

部署后以只读 HTTPS 方式逐字节复核：`index.html`、`styles.css`、`app.js` 和 `data/visual-identities.json` 均与当前 `dist/` 匹配；318个 WebP 逐项与发行登记册记录的 SHA-256 匹配。一次并发读取遇到单个 CDN 瞬时503，单项重试已返回 `200 image/webp` 和期望哈希，随后完整复核零重试、零不匹配。公开浏览器在1440×900视口加载三张管理层详情图、滚入列表后的执行岗位头像，并实际验证浅/深主题资源切换，未观察到错误界面。
