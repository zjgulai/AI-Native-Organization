(function () {
  "use strict";

  var state = {
    roles: [],
    roleAssets: {},
    visualIdentities: {},
    visualIdentityRelease: null,
    visualTheme: "light",
    flows: [],
    e2e: [],
    plane: "全部",
    group: "全部",
    query: "",
    e2eFamily: "全部",
    workflowView: "product",
    selectedStreamId: "BVS-04"
  };

  var managementIds = new Set(["AGT-001", "AGT-002", "AGT-003", "AGT-004", "AGT-041"]);
  var controlIds = new Set(["AGT-005", "AGT-042", "AGT-043", "AGT-044", "AGT-050"]);
  var platformIds = new Set(["AGT-045", "AGT-046", "AGT-047", "AGT-048", "AGT-049"]);
  var groupOrder = [
    "经营与组织",
    "产品与创新",
    "供应与履约",
    "渠道经营",
    "品牌与增长",
    "服务与体验",
    "财务与合规",
    "数据与AI运行"
  ];

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getPlane(roleId) {
    if (managementIds.has(roleId)) return "经营管理";
    if (controlIds.has(roleId)) return "独立控制";
    if (platformIds.has(roleId)) return "数据与Agent平台";
    return "业务运营";
  }

  function loadJson(path) {
    return fetch(path).then(function (response) {
      if (!response.ok) throw new Error("数据读取失败");
      return response.json();
    });
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function filterRoles() {
    var query = normalize(state.query);
    return state.roles.filter(function (role) {
      if (state.plane !== "全部" && role.plane !== state.plane) return false;
      if (state.group !== "全部" && role.group !== state.group) return false;
      if (!query) return true;

      var searchText = [
        role.id,
        role.alias,
        role.title,
        role.group,
        role.personality,
        role.principle,
        role.boundary,
        role.plane,
        (role.flows || []).join(" "),
        (role.scenarios || []).join(" ")
      ].join(" ");
      return normalize(searchText).indexOf(query) !== -1;
    });
  }

  function visualForRole(roleId) {
    return state.visualIdentities[roleId] || null;
  }

  function renderPortrait(visualIdentity, rendition, className) {
    var visual = visualIdentity && visualIdentity.visual;
    var themeAssets = visual && visual.assets && visual.assets[state.visualTheme];
    var source = themeAssets && themeAssets[rendition];
    var fallback = themeAssets && themeAssets.fallback;
    var altText = visual && visual.alt_text && visual.alt_text[state.visualTheme];
    var size = rendition === "detail" ? 256 : 64;
    var classes = "portrait-frame " + (className || "");

    if (!source) {
      return '<span class="' + escapeHtml(classes + " portrait-unavailable") + '" aria-hidden="true"><span>形</span></span>';
    }

    return (
      '<span class="' + escapeHtml(classes) + '">' +
        '<img src="' + escapeHtml(source) + '" alt="' + escapeHtml(altText || "数字分身形象") + '" ' +
          'width="' + size + '" height="' + size + '" loading="lazy" decoding="async" ' +
          'data-portrait-fallback="' + escapeHtml(fallback || "") + '" />' +
      "</span>"
    );
  }

  function renderVisualIdentities() {
    var section = document.getElementById("visual-identities");
    var grid = document.getElementById("management-identity-grid");
    var count = document.getElementById("visual-release-count");
    var release = state.visualIdentityRelease;

    section.dataset.theme = state.visualTheme;
    document.querySelectorAll(".visual-theme-toggle button").forEach(function (button) {
      var selected = button.dataset.visualTheme === state.visualTheme;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    if (!release) {
      count.textContent = "视觉身份数据暂时不可用";
      grid.innerHTML = '<div class="empty-state"><strong>暂时无法读取三位管理层画像</strong><p>请刷新页面后重试。</p></div>';
      return;
    }

    var counts = release.counts || {};
    count.textContent =
      (counts.management || 3) + " 位管理层 + " + (counts.agents || 50) +
      " 个岗位 · " + (counts.webp_delivery_assets || 318) + " 个 WebP 交付件";

    grid.innerHTML = (release.management || []).map(function (identity) {
      var presentation = identity.presentation || {};
      return (
        '<article class="management-identity-card" data-role-id="' + escapeHtml(identity.role_id) + '">' +
          '<div class="management-identity-heading">' +
            renderPortrait(identity, "detail", "management-portrait") +
            '<div><span>' + escapeHtml(identity.role_id) + " · 管理层数字分身</span>" +
              "<h3>" + escapeHtml(identity.display_name) + "</h3>" +
              '<p class="management-role-title">' + escapeHtml(identity.title) + "</p>" +
            "</div>" +
          "</div>" +
          '<dl class="management-identity-copy">' +
            "<div><dt>经营使命</dt><dd>" + escapeHtml(presentation.mission || "按已发布角色合同") + "</dd></div>" +
            "<div><dt>标准产物</dt><dd>" + escapeHtml(presentation.standard_artifact || "按角色合同验收") + "</dd></div>" +
          "</dl>" +
        "</article>"
      );
    }).join("");
  }

  function renderRoleCard(role) {
    var detailId = "detail-" + role.id.toLowerCase();
    var asset = state.roleAssets[role.id] || {};
    var visual = visualForRole(role.id);
    var tags = (role.flows || [])
      .concat(role.scenarios || [])
      .map(function (tag) {
        return "<span>" + escapeHtml(tag) + "</span>";
      })
      .join("");

    return (
      '<article class="role-card" data-role-id="' + escapeHtml(role.id) + '">' +
        '<button class="role-toggle" type="button" aria-expanded="false" aria-controls="' + detailId + '">' +
          '<div class="role-heading">' +
            '<div class="role-heading-copy">' +
              '<div class="role-topline">' +
                "<span>" + escapeHtml(role.id) + " · " + escapeHtml(role.group) + "</span>" +
                '<span class="plane-badge">' + escapeHtml(role.plane) + "</span>" +
              "</div>" +
              "<h3>" + escapeHtml(role.title) + "</h3>" +
              '<div class="role-alias">分身 · ' + escapeHtml(role.alias) + "</div>" +
            "</div>" +
            renderPortrait(visual, "list", "role-portrait") +
          "</div>" +
          '<p class="role-principle">“' + escapeHtml(role.principle) + '”</p>' +
          '<div class="role-more"><span>' + escapeHtml(role.personality) + '</span><span class="expand-label">展开资产与边界 ＋</span></div>' +
        "</button>" +
        '<div class="role-detail" id="' + detailId + '" hidden>' +
          '<div class="detail-block role-visual-detail"><span>VISUAL IDENTITY</span><div class="role-visual-content">' +
            renderPortrait(visual, "detail", "role-detail-portrait") +
            '<p>已纳入视觉发行；当前展示为' + escapeHtml(state.visualTheme === "dark" ? "深色主题" : "浅色主题") + '同主题交付件。</p>' +
          "</div></div>" +
          '<div class="detail-block"><span>动作边界</span><p>' + escapeHtml(role.boundary) + "</p></div>" +
          '<div class="detail-block role-asset-meta"><span>独立分身资产</span><p>' + escapeHtml(asset.playbook_id || "RPB-" + role.id) + ' · ' + escapeHtml(asset.preset_id || "dsh.role." + role.id.toLowerCase() + ".v1") + ' · ' + escapeHtml(asset.status || "设计资产") + '</p><p>模式：' + escapeHtml(asset.standalone_mode || "standalone_role_preset") + ' + ' + escapeHtml(asset.composition_mode || "bounded_role_worker") + ' · 技能 ' + escapeHtml(asset.skill_count == null ? "待载入" : asset.skill_count) + '项</p></div>' +
          '<div class="detail-block"><span>协同方法</span><p>共享Playbook：' + escapeHtml((asset.shared_playbooks || role.playbooks || []).join("、") || "按Case Control装配") + '；常用协作：' + escapeHtml((asset.collaborators || role.collaborates_with || []).join("、") || "由Case Control按产物契约选择") + '</p></div>' +
          '<div class="role-tags" aria-label="参与的价值流和场景">' + tags + "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function renderRoles() {
    var grid = document.getElementById("role-grid");
    var count = document.getElementById("role-count");
    var roles = filterRoles();

    count.textContent = "显示 " + roles.length + " / " + state.roles.length + " 个岗位";
    if (!roles.length) {
      grid.innerHTML = '<div class="empty-state"><strong>没有匹配的岗位</strong><p>请调整关键词、责任平面或专业域。</p></div>';
      return;
    }
    grid.innerHTML = roles.map(renderRoleCard).join("");
  }

  function populateGroups() {
    var select = document.getElementById("group-filter");
    var groups = Array.from(
      new Set(
        state.roles.map(function (role) {
          return role.group;
        })
      )
    ).sort(function (a, b) {
      return groupOrder.indexOf(a) - groupOrder.indexOf(b);
    });

    select.innerHTML = '<option value="全部">全部专业域</option>' +
      groups.map(function (group) {
        return '<option value="' + escapeHtml(group) + '">' + escapeHtml(group) + "</option>";
      }).join("");
  }

  function renderFlows() {
    var grid = document.getElementById("flow-grid");
    var roleById = new Map(
      state.roles.map(function (role) {
        return [role.id, role];
      })
    );

    grid.innerHTML = state.flows.map(function (flow, index) {
      var owner = roleById.get(flow.resultOwner);
      var ownerText = owner
        ? flow.resultOwner + " " + owner.alias + " · " + owner.title
        : flow.resultOwner;

      return (
        '<article class="flow-card">' +
          '<div class="flow-index">' + String(index + 1).padStart(2, "0") + "</div>" +
          '<div class="flow-body">' +
            "<h3>" + escapeHtml(flow.name) + "</h3>" +
            "<p>" + escapeHtml(flow.completion) + "</p>" +
            '<dl class="flow-meta">' +
              "<dt>结果负责人</dt><dd>" + escapeHtml(ownerText) + "</dd>" +
              "<dt>治理要点</dt><dd>" + escapeHtml(flow.governance) + "</dd>" +
            "</dl>" +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  function roleLabel(roleId, compact) {
    var role = state.roles.find(function (item) {
      return item.id === roleId;
    });
    if (!role) return roleId;
    return compact
      ? roleId + " · " + role.alias
      : roleId + " " + role.alias + " · " + role.title;
  }

  function renderRolePills(ids, className) {
    if (!ids || !ids.length) {
      return '<span class="role-pill muted">按该阶段契约</span>';
    }
    return ids.map(function (roleId) {
      return '<span class="role-pill ' + escapeHtml(className || "") + '" title="' +
        escapeHtml(roleLabel(roleId, false)) + '">' + escapeHtml(roleLabel(roleId, true)) + "</span>";
    }).join("");
  }

  function visibleStreams() {
    return state.e2e.filter(function (stream) {
      return state.e2eFamily === "全部" || stream.family === state.e2eFamily;
    });
  }

  function renderStreamList() {
    var target = document.getElementById("e2e-stream-list");
    var streams = visibleStreams();
    if (!streams.length) {
      target.innerHTML = '<div class="empty-state"><strong>没有匹配的价值流</strong></div>';
      return;
    }
    if (!streams.some(function (stream) { return stream.id === state.selectedStreamId; })) {
      state.selectedStreamId = streams[0].id;
    }

    target.innerHTML = streams.map(function (stream) {
      var selected = stream.id === state.selectedStreamId;
      return (
        '<button class="stream-selector' + (selected ? " active" : "") + '" type="button" ' +
          'data-stream-id="' + escapeHtml(stream.id) + '" aria-pressed="' + String(selected) + '">' +
          '<span class="stream-selector-top"><b>' + escapeHtml(stream.id) + "</b><small>" +
            escapeHtml(stream.family === "业务经营流" ? stream.canonical_flow : "CAPABILITY") +
          "</small></span>" +
          "<strong>" + escapeHtml(stream.name) + "</strong>" +
          "<span>" + escapeHtml(stream.product_name) + "</span>" +
          '<small class="stream-role-count">' + stream.role_scope.length + "个岗位责任</small>" +
        "</button>"
      );
    }).join("");
  }

  function renderProductWorkflow(stream) {
    return (
      '<div class="workflow-heading"><span>PRODUCT SOLUTION</span><h4>产品方案工作流</h4>' +
        "<p>从用户或经营问题到产品能力、产物和可验收结果。</p></div>" +
      '<ol class="workflow-track">' +
        stream.product_workflow.map(function (step) {
          return (
            '<li class="workflow-step">' +
              '<div class="step-marker">' + escapeHtml(step.step) + "</div>" +
              '<div class="step-content"><h5>' + escapeHtml(step.name) + "</h5>" +
                "<p>" + escapeHtml(step.description) + "</p>" +
                '<span class="artifact-label">交付 · ' + escapeHtml(step.artifact) + "</span>" +
              "</div>" +
            "</li>"
          );
        }).join("") +
      "</ol>"
    );
  }

  function renderCollaborationWorkflow(stream) {
    return (
      '<div class="workflow-heading"><span>RESPONSIBILITY & HANDOFF</span><h4>分工协作工作流</h4>' +
        "<p>Lead结果责任、Worker能力贡献、独立保障与ArtifactEnvelope接收条件；不会启动隐式岗位Agent互聊。</p></div>" +
      '<ol class="workflow-track collaboration-track">' +
        stream.collaboration_workflow.map(function (step) {
          return (
            '<li class="workflow-step">' +
              '<div class="step-marker">' + escapeHtml(step.step) + "</div>" +
              '<div class="step-content"><h5>' + escapeHtml(step.name) + "</h5>" +
                '<div class="responsibility-row"><b>主责</b><div>' + renderRolePills(step.lead, "lead") + "</div></div>" +
                '<div class="responsibility-row"><b>贡献</b><div>' + renderRolePills(step.contributors, "") + "</div></div>" +
                '<div class="responsibility-row"><b>保障</b><div>' + renderRolePills(step.assurance, "assurance") + "</div></div>" +
                '<p class="handoff"><b>交接</b> ' + escapeHtml(step.handoff) + "</p>" +
              "</div>" +
            "</li>"
          );
        }).join("") +
      "</ol>"
    );
  }

  function renderStreamDetail() {
    var target = document.getElementById("e2e-stream-detail");
    var stream = state.e2e.find(function (item) {
      return item.id === state.selectedStreamId;
    });
    if (!stream) {
      target.innerHTML = '<div class="empty-state"><strong>请选择一条价值流</strong></div>';
      return;
    }

    var workflow = state.workflowView === "product"
      ? renderProductWorkflow(stream)
      : renderCollaborationWorkflow(stream);
    var roleRoster = stream.role_scope.map(function (roleId) {
      return "<li>" + escapeHtml(roleLabel(roleId, false)) + "</li>";
    }).join("");
    var metrics = stream.metrics.map(function (metric) {
      return "<span>" + escapeHtml(metric) + "</span>";
    }).join("");
    var capabilities = stream.magpie_capabilities.map(function (capability) {
      return "<span>" + escapeHtml(capability) + "</span>";
    }).join("");

    target.innerHTML =
      '<article class="stream-detail-card">' +
        '<header class="stream-detail-header">' +
          '<div><p class="eyebrow">' + escapeHtml(stream.id + " · " + stream.family) + "</p>" +
          "<h3>" + escapeHtml(stream.product_name) + "</h3>" +
          '<p class="stream-subtitle">' + escapeHtml(stream.name) + "</p></div>" +
          '<div class="owner-stamp"><span>结果负责人</span><strong>' +
            escapeHtml(roleLabel(stream.result_owner, true)) + "</strong></div>" +
        "</header>" +
        '<dl class="closure-grid">' +
          "<div><dt>起点</dt><dd>" + escapeHtml(stream.start) + "</dd></div>" +
          "<div><dt>闭环</dt><dd>" + escapeHtml(stream.finish) + "</dd></div>" +
          '<div class="wide"><dt>价值</dt><dd>' + escapeHtml(stream.value) + "</dd></div>" +
        "</dl>" +
        '<div class="workflow-panel">' + workflow + "</div>" +
        '<div class="stream-evidence-grid">' +
          '<section><h4>经营与产品指标</h4><div class="tag-cloud metric-tags">' + metrics + "</div></section>" +
          '<section><h4>Magpie能力复用</h4><div class="tag-cloud capability-tags">' + capabilities + "</div></section>" +
        "</div>" +
        '<details class="role-roster"><summary>查看本流全部 ' + stream.role_scope.length +
          " 个岗位责任</summary><ol>" + roleRoster + "</ol></details>" +
        '<div class="boundary-callout"><b>硬边界</b><p>' + escapeHtml(stream.boundary) + "</p></div>" +
      "</article>";
  }

  function renderE2E() {
    renderStreamList();
    renderStreamDetail();
  }

  function showDataError(targetId, message) {
    var target = document.getElementById(targetId);
    target.innerHTML = '<div class="loading-card"><strong>' + escapeHtml(message) + "</strong><p>请刷新页面后重试。</p></div>";
  }

  function bindInteractions() {
    document.querySelectorAll(".visual-theme-toggle button").forEach(function (button) {
      button.addEventListener("click", function () {
        state.visualTheme = button.dataset.visualTheme;
        renderVisualIdentities();
        renderRoles();
      });
    });

    document.addEventListener("error", function (event) {
      var image = event.target;
      if (!image || image.tagName !== "IMG" || !image.hasAttribute("data-portrait-fallback")) return;
      var fallback = image.dataset.portraitFallback;
      if (fallback && image.dataset.fallbackApplied !== "true") {
        image.dataset.fallbackApplied = "true";
        image.src = fallback;
        return;
      }
      var frame = image.closest(".portrait-frame");
      if (frame) frame.classList.add("portrait-unavailable");
    }, true);

    document.querySelectorAll(".plane-chip").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.classList.contains("active")));
      button.addEventListener("click", function () {
        document.querySelectorAll(".plane-chip").forEach(function (item) {
          item.classList.remove("active");
          item.setAttribute("aria-pressed", "false");
        });
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");
        state.plane = button.dataset.plane;
        renderRoles();
      });
    });

    document.getElementById("role-search").addEventListener("input", function (event) {
      state.query = event.target.value;
      renderRoles();
    });

    document.getElementById("group-filter").addEventListener("change", function (event) {
      state.group = event.target.value;
      renderRoles();
    });

    document.getElementById("role-grid").addEventListener("click", function (event) {
      var button = event.target.closest(".role-toggle");
      if (!button) return;
      var expanded = button.getAttribute("aria-expanded") === "true";
      var detail = document.getElementById(button.getAttribute("aria-controls"));
      button.setAttribute("aria-expanded", String(!expanded));
      detail.hidden = expanded;
      var label = button.querySelector(".expand-label");
      label.textContent = expanded ? "展开资产与边界 ＋" : "收起资产与边界 －";
    });

    document.querySelectorAll(".family-toggle").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.classList.contains("active")));
      button.addEventListener("click", function () {
        document.querySelectorAll(".family-toggle").forEach(function (item) {
          item.classList.remove("active");
          item.setAttribute("aria-pressed", "false");
        });
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");
        state.e2eFamily = button.dataset.family;
        renderE2E();
      });
    });

    document.querySelectorAll(".workflow-toggle").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.classList.contains("active")));
      button.addEventListener("click", function () {
        document.querySelectorAll(".workflow-toggle").forEach(function (item) {
          item.classList.remove("active");
          item.setAttribute("aria-pressed", "false");
        });
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");
        state.workflowView = button.dataset.workflow;
        renderStreamDetail();
      });
    });

    document.getElementById("e2e-stream-list").addEventListener("click", function (event) {
      var button = event.target.closest(".stream-selector");
      if (!button) return;
      state.selectedStreamId = button.dataset.streamId;
      renderE2E();
    });
  }

  bindInteractions();

  Promise.allSettled([
    loadJson("./data/roles.json"),
    loadJson("./data/flows.json"),
    loadJson("./data/e2e-workflows.json"),
    loadJson("./data/role-assets.json"),
    loadJson("./data/visual-identities.json")
  ]).then(function (results) {
    if (results[0].status === "fulfilled") {
      state.roles = results[0].value.map(function (role) {
        role.plane = getPlane(role.id);
        return role;
      });
      populateGroups();
      renderRoles();
    } else {
      showDataError("role-grid", "岗位目录暂时无法读取");
      document.getElementById("role-count").textContent = "岗位目录不可用";
    }

    if (results[1].status === "fulfilled") {
      state.flows = results[1].value;
      renderFlows();
    } else {
      showDataError("flow-grid", "价值流目录暂时无法读取");
    }

    if (results[2].status === "fulfilled") {
      state.e2e = results[2].value.streams;
      renderE2E();
    } else {
      showDataError("e2e-stream-list", "端到端价值流目录暂时无法读取");
      showDataError("e2e-stream-detail", "双工作流暂时无法装配");
    }

    if (results[3].status === "fulfilled") {
      state.roleAssets = results[3].value.assets.reduce(function (map, asset) {
        map[asset.role_id] = asset;
        return map;
      }, {});
      renderRoles();
    }

    if (results[4].status === "fulfilled") {
      state.visualIdentityRelease = results[4].value;
      state.visualIdentities = (results[4].value.visuals || []).reduce(function (map, visual) {
        map[visual.role_id] = visual;
        return map;
      }, {});
      renderVisualIdentities();
      renderRoles();
    } else {
      renderVisualIdentities();
    }
  });
})();
