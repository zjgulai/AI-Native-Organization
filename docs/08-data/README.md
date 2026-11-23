# 数据、知识与系统集成

状态：企业系统资产已盘点，接口、服务身份、读写权限和数据质量仍未知。

候选数据责任与最小输入契约已写入[PB-006](../06-playbooks/PLAYBOOKS.md)及[PRD](../13-prd/PRD.md)。先由数据契约确定口径，再围绕首个经营场景确定数据产品；系统资产与优先级见[系统接入盘点](../10-platform/deepseek-harness/SYSTEM-INTEGRATION-INVENTORY.md)。D-050确认目标Shopify无上线产品；D-051要求当前只定义FLOW-04/FLOW-02未来所需的Shop、Product、Variant、SKU、价格、库存、合规与交易数据边界，不实例化数据或Case。订单、销售报表和GMV缺失不得写成零。D-033至D-049形成的[Shopify经营数据契约](BVS-01-SHOPIFY-DTC-DATA-CONTRACT.md)、[SKU范围清单](BVS-01-SHOPIFY-SKU-SCOPE-MANIFEST.md)、[只读连接器](../10-platform/deepseek-harness/SHOPIFY-READONLY-CONNECTOR-REGISTRATION.md)与[Level 1资格证据包](../10-platform/deepseek-harness/SHOPIFY-LEVEL1-QUALIFICATION-EVIDENCE-PACK.md)保留为`SHOP-G6/SHOP-G7`目标合同；实际Scopes、Query、TTL、Definition、种子、报表和范围均未实例化。[Amazon US数据契约](BVS-01-AMAZON-US-DATA-CONTRACT.md)及[结构化模板](bvs-01-amazon-us-data-contract.json)保留为后续渠道模板。

后续先盘点真实系统，再形成以下内容：

- 品牌、产品、SKU、渠道账号、站点、店铺、订单、库存和财务口径的主数据关系。
- 每项场景输入的所有者、来源、更新频率、可接受延迟与质量检查。
- RootData、ERP、PLM、QMS、WMS、TMS、Amazon、Shopify、CRM及其他候选系统的实际接口、主数据与使用情况；不由系统清单推定接口可用。
- 集成的读取/写入能力、接口约束、账号隔离和动作回执。
- 岗位知识、业务规则与经营证据的来源、有效期、审阅及更新责任。
- 客户、员工、商业机密及跨区域数据访问的适用要求，按实际数据和市场查核。

脱敏后的数据字典和集成契约可以进入本目录。原始明细与凭据不进入仓库。

FLOW-09 品牌资产经营的双层指标口径见[FLOW-09 双层 KPI 指标字典](FLOW-09-DUAL-KPI-CATALOG.md)（设计基线，阈值待首批 Case 校准）。
