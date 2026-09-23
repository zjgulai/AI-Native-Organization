# Sanbao_Web VIS-G0 来源冻结记录

状态：**完成（2026-09-23，metadata-only）**<br>
下一门：`VIS-G1`（来源、许可、隐私、参考资料与公开范围核验）<br>
素材状态：`HOLD_VIS_G1`

本记录是 D-068/D-069 的可复核来源快照。它固定的是上游 Git 元数据和清单事实，**不是**对任何图片二进制的本地复制、视觉验收、许可结论、公开发布授权或运行时接入。

## 1. 冻结锚点

| 项目 | 固定值 |
| --- | --- |
| 上游仓库 | [zjgulai/Sanbao_Web](https://github.com/zjgulai/Sanbao_Web) |
| 核验时 `main` 指向 | `2e676da87999c88fbc70baae9eb5dbf72c2b757e`（记录时刻的可移动分支解析结果；后续一律引用下方提交） |
| 固定提交 | [`2e676da87999c88fbc70baae9eb5dbf72c2b757e`](https://github.com/zjgulai/Sanbao_Web/commit/2e676da87999c88fbc70baae9eb5dbf72c2b757e) |
| 提交时间 / GitHub 验证 | `2026-09-18T05:18:39Z` / `unsigned`；这不是许可证或作者权利的结论 |
| Git tree | `4948f180d4e5a0bc8c599022227c384d525729c5` |
| 全量递归 tree | [GitHub API tree](https://api.github.com/repos/zjgulai/Sanbao_Web/git/trees/4948f180d4e5a0bc8c599022227c384d525729c5?recursive=1)；2,122个条目，响应 `truncated=false` |
| 头像清单 | [`digital-employees/avatar-manifest.json`](https://raw.githubusercontent.com/zjgulai/Sanbao_Web/2e676da87999c88fbc70baae9eb5dbf72c2b757e/digital-employees/avatar-manifest.json)；Git blob `5fe37b375d415593c19c3712f225b5e21e7f02f8`，1,003,587 bytes |
| 人员清单 | [`digital-employees/workforce.json`](https://raw.githubusercontent.com/zjgulai/Sanbao_Web/2e676da87999c88fbc70baae9eb5dbf72c2b757e/digital-employees/workforce.json)；Git blob `9cfb61bb43b2dd2b36216cb2c8402bcc564fc9e5`，24,026 bytes |
| 头像索引 | [`digital-employees/avatar-index.csv`](https://raw.githubusercontent.com/zjgulai/Sanbao_Web/2e676da87999c88fbc70baae9eb5dbf72c2b757e/digital-employees/avatar-index.csv)；Git blob `45a6c0409b0320cb04801c25a8a6c724d5e94c1d`，17,363 bytes |

所有 URL 都锚定到上述提交，而非可漂移的 `main` 分支。

## 2. 全量只读盘点

| 范围 | Blob 数 | 字节数 | 图像数 | 图像字节数 |
| --- | ---: | ---: | ---: | ---: |
| 整个上游仓库 | 2,084 | 417,143,325 | 1,848 | 397,188,626 |
| `digital-employees/` | 1,971 | 408,005,031 | 1,751 | 393,408,484 |

整个仓库的图像类型分布为：1,428 个 WebP（8,895,308 bytes）、396 个 PNG（383,471,795 bytes）、5 个 JPG（4,682,173 bytes）、18 个 SVG（113,043 bytes）和1个 ICO（26,307 bytes）。`digital-employees/` 内含1,428个 WebP、319个 PNG与4个 JPG。

头像清单包含102个唯一人物；每位人物包含深色与浅色两个主题，各有32、48、64、80、128、256、512 px 七档 WebP，因此固定提交中有 `102 × 2 × 7 = 1,428` 个头像交付 WebP。该计数不把未选人物解释为已启用岗位。

| 素材域 | 图像数 | 字节数 | VIS-G0 分类用途 |
| --- | ---: | ---: | --- |
| `digital-employees/assets/` | 1,632 | 187,346,332 | 102人深浅主题的204张原生 PNG 与1,428张 WebP 交付件 |
| `digital-employees/sources/` | 102 | 188,000,778 | 2:1 来源图；受限追溯资料 |
| `digital-employees/references/` | 12 | 11,598,971 | 受限参考资料 |
| `digital-employees/design/` 的图像 | 1 | 1,878,338 | 受限设计输入 |
| 数字员工总览 JPG | 4 | 4,584,065 | 质量审阅与总览，不是默认头像交付 |
| `brand/logo/` | 94 | 1,047,648 | 品牌素材，不能绑定为人物头像 |
| `website/assets/` | 3 | 2,732,494 | 站点图形，不能绑定为人物头像 |

完整的结构化盘点、文件锚点和三位已选CXO的交付候选位于[机器可读来源快照](SANBAO-WEB-SOURCE-SNAPSHOT-2026-09-23.json)。

## 3. 三位已选 CXO 的来源证据

| 本项目角色 | 源人物 | 上游名称 | 来源图（1774×887） | 固定交付候选 |
| --- | --- | --- | --- | --- |
| MGT-001 天時 | `AGT-067` | 星阑 | `digital-employees/sources/AGT-067.png` | dark/light 64px、256px WebP |
| MGT-002 地利 | `AGT-090` | 语桐 | `digital-employees/sources/AGT-090.png` | dark/light 64px、256px WebP |
| MGT-003 人和 | `AGT-056` | 昭禾 | `digital-employees/sources/AGT-056.png` | dark/light 64px、256px WebP |

三组路径的 Git blob ID、字节数、上游清单声明的来源图 SHA-256 与固定 raw URL 均已写入 JSON 快照。它们都处于 `SOURCE_LOCKED_AWAITING_VIS_G1`：这意味着可追溯的来源版本已经确定，但尚未得到权利、公开范围或展示交付批准。

三位上游记录在固定清单中仍标为“待分配岗位”。天時、地利、人和是本项目的展示绑定，不会回写、覆盖或重新命名上游人物身份。

## 4. 完整性语义与边界

1. Git blob ID 是固定 tree 中的 Git 对象标识；它不是本项目重新计算的图片 SHA-256。
2. 本记录的“目录元数据指纹”使用 `SHA-256` 计算：对按路径排序的每一项 `path + TAB + git_blob_sha + TAB + bytes + LF` 串联后取散列。它验证的是这次全量目录元数据的复算一致性，**不验证**图片像素或二进制内容。
3. `sourceSha256` 与原生 PNG 的 SHA-256 来自上游 `avatar-manifest.json` 的声明。本门未下载任何图片，因此没有对这些声明进行本地重新计算。
4. 本门没有把任何图片、来源图、参考图、设计输入、提示词或文件二进制写入本项目、`dist/`、GitHub Pages 或 DSH。
5. `VIS-G0` 不判断许可证、肖像/参考资料风险、生成服务条款、隐私适用性或公开范围。所有这些项目均交给 `VIS-G1`，在其通过前统一保持 `HOLD_VIS_G1`。

## 5. 本门验收与后续

已通过的 VIS-G0 条件：上游提交与 tree 已固定；全量目录响应已确认未截断；图像计数、字节数、类型分布、关键清单文件和三位CXO关键交付候选均已登记；所有引用均可回到唯一上游版本。

尚未完成：`VIS-G1` 的权利/公开范围核验；素材二进制复制；完整视觉资产注册表；53份画像卡；图片派生、无障碍审阅、页面接入、构建、发布与运行时接入。任何后续门均须另行授权，且不得借由视觉资料改变角色职责、权限、Role Release Bundle 或生产状态。
