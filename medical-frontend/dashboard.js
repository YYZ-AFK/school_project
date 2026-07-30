const API_BASE = "/api";
const AMAP_KEY = "e0646228e1144617530919cff0430136";
const IMAGE_FALLBACK = "./assets/drug-placeholder.jpg";
const LOCAL_DRUG_IMAGES_BY_ID = {
    "12650466": "./assets/drugs/drug-12650466-ganmaoling.jpg",
    "12650467": "./assets/drugs/drug-12650467-lianhua.jpg",
    "12650468": "./assets/drugs/drug-12650468-meilin.jpg",
    "12650469": "./assets/drugs/drug-12650469-sanlitong.jpg",
    "12650470": "./assets/drugs/drug-12650470-gantanhao.jpg",
    "12650471": "./assets/drugs/drug-12650471-ankahuangmin.jpg"
};
const LOCAL_DRUG_IMAGES_BY_ORDER = Object.values(LOCAL_DRUG_IMAGES_BY_ID);

// ========== 鍏ㄥ眬鐘舵€?==========
const state = {
    token: localStorage.getItem("medical-token") || "",
    user: JSON.parse(localStorage.getItem("medical-user") || "{}"),
    pn: 1, size: 5, total: 0,
    drugPn: 1, drugSize: 5, drugTotal: 0,
    policyPn: 1, policySize: 5, policyTotal: 0,
    companyPolicyPn: 1, companyPolicySize: 5, companyPolicyTotal: 0,
    materialPn: 1, materialSize: 5, materialTotal: 0,
    salePn: 1, saleSize: 5, saleTotal: 0,
    companyPn: 1, companySize: 5, companyTotal: 0,
    cityPn: 1, citySize: 50, cityTotal: 0,
    allSales: [],
    map: null,
    markers: [],
    activeMenuId: null,
    isAddingSale: false,
    selectedLng: null,
    selectedLat: null,
    histogramChart: null,
    pieChart: null,
    activeView: null,
    homeLoadSeq: 0,
    homeChartTimer: null,
    chartResizeBound: false,
    doctorEditingId: null,
    registrationDoctorLoaded: false
};

const el = (id) => document.getElementById(id);

if (!state.token) {
    window.location.replace("./index.html");
}

function authHeaders() {
    return {
        Authorization: `Bearer ${state.token}`
    };
}

function headers() {
    return {
        "Content-Type": "application/json",
        ...authHeaders()
    };
}

async function request(path, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: {
                ...headers(),
                ...(options.headers || {})
            }
        });
        let data = {};
        try {
            data = await response.json();
        } catch (error) {
            throw new Error("鍚庣杩斿洖鍐呭涓嶆槸鏈夋晥 JSON锛岃纭鎺ュ彛鏄惁姝ｅ父");
        }
        if (!response.ok || data.code !== 20000) {
            throw new Error(data.mess || "璇锋眰澶辫触");
        }
        return data;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error("无法连接后端服务，请确认项目启动窗口没有报错。");
        }
        throw error;
    }
}

async function uploadImage(file) {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${API_BASE}/base/upload`, {
            method: "POST",
            headers: authHeaders(),
            body: formData
        });
        let data = {};
        try {
            data = await response.json();
        } catch (error) {
            throw new Error("鍥剧墖涓婁紶澶辫触锛氬悗绔病鏈夎繑鍥炴纭殑 JSON 鏁版嵁");
        }
        if (!response.ok || data.code !== 20000) {
            throw new Error(data.mess || "鍥剧墖涓婁紶澶辫触");
        }
        return data.data?.url || "";
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error("图片上传失败：请确认后端服务已正常启动。");
        }
        throw error;
    }
}

function normalizeImageUrl(url) {
    const raw = String(url || "").trim();
    if (!raw || raw === IMAGE_FALLBACK) return IMAGE_FALLBACK;
    if (/^https?:\/\//i.test(raw)) {
        try {
            const parsed = new URL(raw);
            if ((parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") && parsed.pathname.startsWith("/image/")) {
                return `${parsed.pathname}${parsed.search}`;
            }
        } catch (error) {
            return raw;
        }
        return raw;
    }
    if (raw.startsWith("/")) return raw;
    if (raw.startsWith("image/")) return `/${raw}`;
    if (/^[^\\/]+?\.(jpg|jpeg|png|gif|webp)$/i.test(raw)) {
        return `/image/${encodeURIComponent(raw)}`;
    }
    return raw;
}

function getDrugImageUrl(drug) {
    const id = String(drug?.drugId || drug?.id || "");
    if (LOCAL_DRUG_IMAGES_BY_ID[id]) return LOCAL_DRUG_IMAGES_BY_ID[id];

    const numericId = Number(id);
    if (numericId >= 1 && numericId <= LOCAL_DRUG_IMAGES_BY_ORDER.length) {
        return LOCAL_DRUG_IMAGES_BY_ORDER[numericId - 1];
    }

    return normalizeImageUrl(drug?.drugImg || "");
}

function updateImagePreview(containerId, imageUrl, text) {
    const preview = el(containerId);
    if (!preview) return;
    const img = preview.querySelector("img");
    const label = preview.querySelector("span");
    if (img) img.src = normalizeImageUrl(imageUrl);
    if (label) label.textContent = text || "";
}

function resetDrugImagePreview() {
    const input = el("drugImg");
    const file = el("drugImageFile");
    if (input) input.value = "";
    if (file) file.value = "";
    updateImagePreview("drugImagePreview", IMAGE_FALLBACK, "鏈€夋嫨鍥剧墖");
}

function isImageFile(file) {
    return file && file.type && file.type.startsWith("image/");
}

function escapeAttr(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function detailCell(value, emptyText = "-") {
    const text = String(value || "").trim();
    const display = text || emptyText;
    return `<button type="button" class="detail-cell" data-detail="${escapeAttr(text)}" title="点击查看完整内容">${escapeAttr(display)}</button>`;
}

function buildDoctorChartData(doctors) {
    const docLevel = {l1: 0, l2: 0, l3: 0};
    const treatMap = {};

    (doctors || []).forEach(doctor => {
        const levelName = String(doctor.doctorLevel?.name || doctor.levelName || "").trim();
        if (levelName.includes("主任")) docLevel.l1 += 1;
        else if (levelName.includes("普通")) docLevel.l2 += 1;
        else if (levelName.includes("实习")) docLevel.l3 += 1;

        const typeName = String(doctor.treatType?.name || doctor.typeName || "").trim();
        if (typeName) treatMap[typeName] = (treatMap[typeName] || 0) + 1;
    });

    return {docLevel, treatMap};
}

function setMessage(id, text, ok = false) {
    const node = el(id);
    if (!node) return;
    node.textContent = text || "";
    node.style.color = ok ? "#237b7b" : "#b44735";
}

function getTitle(item) {
    return item.meta?.title || item.title || item.name || "未命名菜单";
}

function getMenuDisplayTitle(item) {
    const title = getTitle(item);
    if (title === "Layout") return "功能菜单";
    if (title === "404-页面不存在") return "备用页面";
    return title;
}

function isHiddenMenu(item) {
    const title = getTitle(item);
    return title === "404-页面不存在" || item.path === "/404";
}

// ========== 鑿滃崟娓叉煋 ==========
function renderMenu(items) {
    const nav = el("menuTree");
    nav.innerHTML = "";
    items.forEach((item) => {
        if (isHiddenMenu(item)) return;
        const children = Array.isArray(item.children)
            ? item.children.filter(child => !isHiddenMenu(child))
            : [];
        if (!children.length && getTitle(item) === "Layout") return;

        const group = document.createElement("div");
        group.className = "menu-group";
        const parentButton = document.createElement("button");
        parentButton.type = "button";
        parentButton.className = "menu-parent";
        parentButton.textContent = getMenuDisplayTitle(item);
        parentButton.dataset.menuId = item.id;
        if (children.length && getTitle(item) === "Layout") {
            parentButton.classList.add("menu-heading");
        } else {
            parentButton.addEventListener("click", () => showModule(item));
        }
        group.appendChild(parentButton);
        if (children.length) {
            children.forEach((child) => {
                const childButton = document.createElement("button");
                childButton.type = "button";
                childButton.className = "menu-child";
                childButton.textContent = getMenuDisplayTitle(child);
                childButton.dataset.menuId = child.id;
                childButton.addEventListener("click", () => showModule(child));
                group.appendChild(childButton);
            });
        }
        nav.appendChild(group);
    });

    const extraGroup = document.createElement("div");
    extraGroup.className = "menu-group";
    const extraParent = document.createElement("button");
    extraParent.type = "button";
    extraParent.className = "menu-parent menu-heading";
    extraParent.textContent = "衍生功能";
    extraParent.dataset.menuId = "derived";
    extraGroup.appendChild(extraParent);
    const registrationButton = document.createElement("button");
    registrationButton.type = "button";
    registrationButton.className = "menu-child";
    registrationButton.textContent = "预约挂号";
    registrationButton.dataset.menuId = "derived-registration";
    registrationButton.addEventListener("click", () => showModule({
        id: "derived-registration",
        path: "/manage/registration",
        title: "预约挂号"
    }));
    extraGroup.appendChild(registrationButton);
    nav.appendChild(extraGroup);
}

function setActiveMenu(id) {
    document.querySelectorAll(".menu-child, .menu-parent").forEach((node) => {
        node.classList.toggle("active", String(node.dataset.menuId) === String(id));
    });
}

function showOnly(viewId) {
    const ids = ["homeModule", "doctorModule", "drugModule", "policyModule",
        "companyPolicyModule", "materialModule", "saleModule",
        "companyModule", "cityModule", "registrationModule", "placeholderModule"];
    ids.forEach(id => {
        const node = el(id);
        if (node) node.hidden = id !== viewId;
    });
}

function hideAllStats() {
    ["doctorStats", "drugStats", "policyStats", "companyPolicyStats", "materialStats", "saleStats", "companyStats", "cityStats", "registrationStats"].forEach(id => {
        const node = el(id);
        if (node) node.hidden = true;
    });
}

function applyRoleView(viewId) {
    const formByView = {
        drugModule: "drugForm",
        policyModule: "policyForm",
        companyPolicyModule: "companyPolicyForm",
        materialModule: "materialForm"
    };
    Object.keys(formByView).forEach(id => {
        const view = el(id);
        const form = el(formByView[id]);
        if (view) view.classList.remove("query-only");
        if (form) form.hidden = false;
    });
    const formId = formByView[viewId];
    if (!formId || isAdmin()) return;
    const view = el(viewId);
    const form = el(formId);
    if (view) view.classList.add("query-only");
    if (form) form.hidden = true;
}

window.switchToModule = function (module) {
    const map = {
        policy: {path: "/manage/policy", title: "医保政策管理"},
        companyPolicy: {path: "/manage/company/policy", title: "医药公司政策管理"}
    };
    const target = map[module];
    if (!target) return;
    document.querySelectorAll(".menu-child").forEach(btn => {
        if (btn.textContent.trim() === target.title) btn.click();
    });
};

function showModule(item) {
    const title = getTitle(item);
    const admin = isAdmin();
    state.activeMenuId = item.id;
    setActiveMenu(item.id);

    const modules = [
        {
            match: item.path === "/home" || title === "首页",
            title: "首页",
            subtitle: "欢迎来到慧医数字医疗应用系统",
            view: "homeModule",
            stats: null,
            load: loadHomeData
        },
        {
            match: item.path === "/manage/doctor" || title === "医生信息管理",
            title: "医生信息管理",
            subtitle: "登录、权限菜单、医生分页和账号维护",
            view: "doctorModule",
            stats: "doctorStats",
            load: loadDoctors
        },
        {
            match: item.path === "/manage/drug" || title === "药品信息管理" || title === "药品信息查询",
            title: admin ? "药品信息管理" : "药品信息查询",
            subtitle: admin ? "药品信息增删改查、图片上传" : "药品信息查询和销售地点查看",
            view: "drugModule",
            stats: "drugStats",
            load: loadDrugs
        },
        {
            match: item.path === "/manage/policy" || item.path === "/manage/medical/policy" || title === "医保政策管理" || title === "医保政策查询",
            title: admin ? "医保政策管理" : "医保政策查询",
            subtitle: admin ? "医保政策增删改查" : "医保政策分页查询",
            view: "policyModule",
            stats: "policyStats",
            load: loadPolicies
        },
        {
            match: item.path === "/manage/company/policy" || title === "医药公司政策管理" || title === "医药公司政策查询",
            title: admin ? "医药公司政策管理" : "医药公司政策查询",
            subtitle: admin ? "公司政策增删改查" : "医药公司政策分页查询",
            view: "companyPolicyModule",
            stats: "companyPolicyStats",
            load: loadCompanyPolicies
        },
        {
            match: item.path === "/manage/material" || title === "必备材料管理" || title === "必备材料查询",
            title: admin ? "必备材料管理" : "必备材料查询",
            subtitle: admin ? "必备材料增删改查" : "医保报销必备材料查询",
            view: "materialModule",
            stats: "materialStats",
            load: loadMaterials
        },
        {
            match: item.path === "/manage/sale" || title === "销售地点管理",
            title: "销售地点管理",
            subtitle: "销售地点信息管理与地图展示",
            view: "saleModule",
            stats: "saleStats",
            load: loadSales
        },
        {
            match: item.path === "/base/company" || title === "医药公司管理",
            title: "医药公司管理",
            subtitle: "医药公司信息的增删改查和分页管理",
            view: "companyModule",
            stats: "companyStats",
            load: loadCompanies
        },
        {
            match: item.path === "/base/city" || title === "城市信息管理" || title === "医保城市管理",
            title: "医保城市管理",
            subtitle: "医保业务覆盖城市维护，为医保政策归属提供城市基础数据",
            view: "cityModule",
            stats: "cityStats",
            load: loadCities
        },
        {
            match: item.path === "/manage/registration" || title === "预约挂号",
            title: "预约挂号",
            subtitle: "患者挂号登记、医生选择、待就诊记录和快速查询",
            view: "registrationModule",
            stats: "registrationStats",
            load: loadRegistrations
        }
    ];

    const target = modules.find(module => module.match);
    if (target) {
        el("moduleTitle").textContent = target.title;
        el("moduleSubtitle").textContent = target.subtitle;
        hideAllStats();
        if (target.stats) el(target.stats).hidden = false;
        if (target.view === "homeModule" && state.activeView === "homeModule" && !el("homeModule").hidden) {
            resizeHomeCharts();
            return;
        }
        showOnly(target.view);
        applyRoleView(target.view);
        state.activeView = target.view;
        target.load();
        return;
    }

    el("moduleTitle").textContent = getMenuDisplayTitle(item);
    el("moduleSubtitle").textContent = "该模块已预留，可由对应组员继续接入业务接口";
    hideAllStats();
    el("placeholderTitle").textContent = getMenuDisplayTitle(item);
    el("placeholderText").textContent = `“${getMenuDisplayTitle(item)}”模块已完成菜单切换，可继续补充页面和接口。`;
    showOnly("placeholderModule");
    state.activeView = "placeholderModule";
}

// ========== 宸ュ叿鍑芥暟 ==========
function fillSelect(selectId, values) {
    const select = el(selectId);
    if (!select) return;
    select.innerHTML = "";
    (values || []).forEach(v => {
        const opt = document.createElement("option");
        opt.value = v.id;
        opt.textContent = v.name;
        select.appendChild(opt);
    });
}

// ========== 棣栭〉鏁版嵁闈㈡澘 ==========
async function loadHomeData() {
    const seq = ++state.homeLoadSeq;
    if (state.homeChartTimer) {
        clearTimeout(state.homeChartTimer);
        state.homeChartTimer = null;
    }

    const homeData = {
        doctorNumb: "...",
        drugNumb: "...",
        companyNumb: "...",
        saleNumb: "...",
        docLevel: {l1: 0, l2: 0, l3: 0},
        treatMap: {},
        materials: [],
        policys: []
    };

    updateHomeUI(homeData);

    try {
        const [doctorRes, drugRes, companyRes, saleRes, materialRes, companyPolicyRes] = await Promise.allSettled([
            request("/doctors?pn=1&size=1"),
            request("/drugs/1/1"),
            request("/companys/1/1"),
            request("/sales?pn=1&size=1"),
            request("/material?pn=1&size=4"),
            request("/company/policy?pn=1&size=4")
        ]);

        if (doctorRes.status === 'fulfilled') {
            homeData.doctorNumb = doctorRes.value.data.pageInfo?.total ?? 0;
        }
        if (drugRes.status === 'fulfilled') {
            const drugPage = drugRes.value.data?.drugPageInfo || drugRes.value.data?.pageInfo;
            homeData.drugNumb = drugPage?.total ?? 0;
        }
        if (companyRes.status === 'fulfilled') {
            homeData.companyNumb = companyRes.value.data.pageInfo?.total ?? 0;
        }
        if (saleRes.status === 'fulfilled') {
            homeData.saleNumb = saleRes.value.data.pageInfo?.total ?? 0;
        }
        if (materialRes.status === 'fulfilled') {
            homeData.materials = materialRes.value.data?.pageInfo?.list || [];
        }
        if (companyPolicyRes.status === 'fulfilled') {
            homeData.policys = companyPolicyRes.value.data?.pageInfo?.list || [];
        }

        if (seq === state.homeLoadSeq) {
            updateHomeUI(homeData);
        }

        const doctorTotal = Number(homeData.doctorNumb || 0);
        if (doctorTotal > 0) {
            try {
                const chartSize = Math.min(doctorTotal, 300);
                const allDoctorRes = await request(`/doctors?pn=1&size=${chartSize}`);
                const doctors = allDoctorRes.data?.pageInfo?.list || [];
                const chartData = buildDoctorChartData(doctors);
                homeData.docLevel = chartData.docLevel;
                homeData.treatMap = chartData.treatMap;
                if (seq === state.homeLoadSeq) {
                    updateHomeUI(homeData);
                }
            } catch (doctorChartErr) {
                console.warn("首页医生图表统计加载失败", doctorChartErr);
            }
        }
    } catch (err) {
        console.warn("首页部分数据加载失败", err);
        if (seq === state.homeLoadSeq) {
            updateHomeUI(homeData);
        }
    }
}

function updateHomeUI(d) {
    // 缁熻鍗＄墖
    el("homeDoctorCount").textContent = d.doctorNumb || 0;
    el("homeDrugCount").textContent = d.drugNumb || 0;
    el("homeCompanyCount").textContent = d.companyNumb || 0;
    el("homeSaleCount").textContent = d.saleNumb || 0;

    // 鍥捐〃鏁版嵁
    const levelData = d.docLevel || {l1: 0, l2: 0, l3: 0};
    const treatMap = d.treatMap || {};
    const pieData = Object.keys(treatMap).map(key => ({name: key, value: treatMap[key] || 0}));

    if (state.homeChartTimer) clearTimeout(state.homeChartTimer);
    state.homeChartTimer = setTimeout(() => {
        state.homeChartTimer = null;
        renderHistogram([levelData.l1 || 0, levelData.l2 || 0, levelData.l3 || 0]);
        renderPieChart(pieData);
    }, 40);

    // 鏀跨瓥鍒楄〃
    renderPolicyList("homePolicyList", d.materials || [], "鏆傛棤鍖讳繚鏀跨瓥");
    renderPolicyList("homeCompanyPolicyList", d.policys || [], "鏆傛棤鍏徃鏀跨瓥");
}

function renderHistogram(data) {
    const dom = el("histogramChart");
    if (!dom) return;
    if (typeof echarts === 'undefined') {
        dom.innerHTML = '<div style="text-align:center;color:#999;padding-top:80px;">ECharts 加载失败</div>';
        return;
    }

    try {
        if (!state.histogramChart || state.histogramChart.isDisposed?.()) {
            state.histogramChart = echarts.init(dom);
        }
        const chart = state.histogramChart;
        chart.setOption({
            tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
            grid: {left: '10%', right: '10%', bottom: '15%', top: '10%', containLabel: true},
            xAxis: {type: 'category', data: ['主任医师', '普通医师', '实习医师']},
            yAxis: {type: 'value', minInterval: 1},
            series: [{
                type: 'bar',
                data: [
                    {value: data[0] || 0, itemStyle: {color: '#2ecc71'}},
                    {value: data[1] || 0, itemStyle: {color: '#70a1ff'}},
                    {value: data[2] || 0, itemStyle: {color: '#eccc68'}}
                ],
                barWidth: '40%'
            }]
        }, true);
        requestAnimationFrame(() => chart.resize());
    } catch (e) {
        console.warn('柱状图渲染失败', e);
        dom.innerHTML = '<div style="text-align:center;color:#999;padding-top:80px;">图表渲染失败</div>';
    }
}

function renderPieChart(data) {
    const dom = el("pieChart");
    if (!dom) return;
    if (typeof echarts === 'undefined') {
        dom.innerHTML = '<div style="text-align:center;color:#999;padding-top:80px;">ECharts 加载失败</div>';
        return;
    }

    try {
        if (!state.pieChart || state.pieChart.isDisposed?.()) {
            state.pieChart = echarts.init(dom);
        }
        const chart = state.pieChart;
        const filtered = data.filter(d => d.value > 0);
        chart.setOption({
            tooltip: {trigger: 'item', formatter: '{b}: {c} ({d}%)'},
            legend: {
                orient: 'vertical',
                left: 8,
                top: 'center',
                itemWidth: 12,
                itemHeight: 12,
                textStyle: {color: '#607472'}
            },
            series: [{
                type: 'pie',
                radius: ['42%', '68%'],
                center: ['58%', '50%'],
                avoidLabelOverlap: false,
                label: {show: false},
                emphasis: {label: {show: true, fontSize: 16, fontWeight: 'bold'}},
                data: filtered.length ? filtered : [{name: '暂无数据', value: 1}]
            }]
        }, true);
        requestAnimationFrame(() => chart.resize());
    } catch (e) {
        console.warn('饼图渲染失败', e);
        dom.innerHTML = '<div style="text-align:center;color:#999;padding-top:80px;">图表渲染失败</div>';
    }
}

function renderPolicyList(containerId, list, emptyText) {
    const container = el(containerId);
    if (!container) return;
    container.innerHTML = '';
    if (!list || list.length === 0) {
        container.innerHTML = `<div class="policy-empty">${emptyText}</div>`;
        return;
    }
    list.slice(0, 4).forEach(item => {
        const div = document.createElement('div');
        div.className = 'policy-item';
        const msg = item.message || item.title || '';
        const truncated = msg.length > 30 ? msg.substring(0, 30) + '...' : msg;
        const date = item.updateTime || item.createTime || '';
        div.innerHTML = `${truncated} ${date ? `<span class="date">${date}</span>` : ''}`;
        container.appendChild(div);
    });
}

// ========== 鍖荤敓绠＄悊 ==========
async function loadBaseInfo() {
    try {
        const info = await request("/doctors/info");
        fillSelect("levelSelect", info.data.level || []);
        fillSelect("typeSelect", info.data.type || []);
    } catch (e) {
        console.warn("鍖荤敓瀛楀吀鍔犺浇澶辫触", e);
    }
}

async function loadDoctors() {
    try {
        const keyword = encodeURIComponent(el("keyword")?.value?.trim() || "");
        const query = `?pn=${state.pn}&size=${state.size}${keyword ? `&keyword=${keyword}` : ""}`;
        const data = await request(`/doctors${query}`);
        const page = data.data.pageInfo || {list: [], total: 0};
        state.total = page.total || 0;
        el("doctorTotal").textContent = state.total;
        el("pageNo").textContent = state.pn;
        renderDoctors(page.list || []);
    } catch (e) {
        console.warn("鍖荤敓鍔犺浇澶辫触", e);
    }
}

function renderDoctors(list) {
    const body = el("doctorRows");
    if (!body) return;
    body.innerHTML = "";
    if (!list.length) {
        body.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px 0;color:#88929e;">暂无医生数据</td></tr>`;
        return;
    }
    list.forEach(d => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${d.id}</td>
      <td>${detailCell(d.name)}</td>
      <td>${d.doctorLevel?.name || ''}</td>
      <td>${d.treatType?.name || ''}</td>
      <td>${d.phone || ''}</td>
      <td>
        <div class="actions">
          <button class="action-button action-text" title="修改医生" data-edit-doctor="${escapeAttr(d.id)}" data-name="${escapeAttr(d.name || '')}" data-age="${escapeAttr(d.age || '')}" data-sex="${escapeAttr(d.sex ?? '')}" data-levelid="${escapeAttr(d.levelId || '')}" data-typeid="${escapeAttr(d.typeId || '')}" data-phone="${escapeAttr(d.phone || '')}">修改</button>
          <button class="action-button action-text" title="重置密码" data-reset="${escapeAttr(d.id)}">重置</button>
          <button class="action-button action-text danger" title="删除医生" data-delete="${escapeAttr(d.id)}" data-name="${escapeAttr(d.name || '')}">删除</button>
        </div>
      </td>
    `;
        body.appendChild(row);
    });
}

function resetDoctorForm(message = "") {
    const formEl = el("doctorForm");
    if (!formEl) return;
    state.doctorEditingId = null;
    formEl.reset();
    el("doctorId").value = "";
    el("doctorFormTitle").textContent = "新增医生";
    el("doctorSubmitButton").innerHTML = `<img src="./assets/add.png" alt="">新增医生`;
    el("doctorCancelButton").hidden = true;
    formEl.elements.pwd.required = true;
    formEl.elements.pwd.placeholder = "请填写初始密码";
    if (message !== null) setMessage("doctorMessage", message, Boolean(message));
}

function fillDoctorForm(button) {
    const formEl = el("doctorForm");
    if (!formEl) return;
    const id = button.dataset.editDoctor;
    state.doctorEditingId = id;
    formEl.elements.id.value = id;
    formEl.elements.name.value = button.dataset.name || "";
    formEl.elements.age.value = button.dataset.age || "";
    formEl.elements.sex.value = button.dataset.sex || "1";
    formEl.elements.levelId.value = button.dataset.levelid || "";
    formEl.elements.typeId.value = button.dataset.typeid || "";
    formEl.elements.phoneNumber.value = button.dataset.phone || "";
    formEl.elements.pwd.value = "";
    formEl.elements.pwd.required = false;
    formEl.elements.pwd.placeholder = "修改医生时密码不用填";
    el("doctorFormTitle").textContent = `修改医生 ${id}`;
    el("doctorSubmitButton").innerHTML = "保存修改";
    el("doctorCancelButton").hidden = false;
    setMessage("doctorMessage", "已进入修改模式，改完后点击保存修改。", true);
    formEl.scrollIntoView({behavior: "smooth", block: "center"});
}

function initDoctorEvents() {
    el("doctorForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formEl = e.currentTarget;
        const form = new FormData(formEl);
        const payload = Object.fromEntries(form.entries());
        const editingId = state.doctorEditingId;
        delete payload.id;
        payload.age = Number(payload.age);
        payload.sex = Number(payload.sex);
        payload.levelId = Number(payload.levelId);
        payload.typeId = Number(payload.typeId);
        if (!editingId && !payload.pwd) {
            setMessage("doctorMessage", "请填写初始密码");
            return;
        }
        if (editingId && !payload.pwd) {
            delete payload.pwd;
        }
        try {
            if (editingId) {
                await request(`/doctors/${editingId}`, {method: "PUT", body: JSON.stringify(payload)});
                resetDoctorForm("医生修改成功");
            } else {
                await request("/doctors", {method: "POST", body: JSON.stringify(payload)});
                resetDoctorForm("新增成功");
            }
            await loadDoctors();
        } catch (err) {
            setMessage("doctorMessage", `操作失败：${err.message}`);
        }
    });

    el("doctorCancelButton")?.addEventListener("click", () => resetDoctorForm(""));

    el("doctorRows")?.addEventListener("click", async (e) => {
        const editBtn = e.target.closest("[data-edit-doctor]");
        const resetBtn = e.target.closest("[data-reset]");
        const deleteBtn = e.target.closest("[data-delete]");
        try {
            if (editBtn) {
                fillDoctorForm(editBtn);
                return;
            }
            if (resetBtn) {
                const id = resetBtn.dataset.reset;
                if (!confirm(`确定将医生 ${id} 的密码重置为默认密码吗？`)) return;
                await request(`/doctors/${id}/password`, {method: "PUT"});
                setMessage("doctorMessage", `医生 ${id} 密码已重置`, true);
            }
            if (deleteBtn && confirm(`确定删除医生“${deleteBtn.dataset.name || deleteBtn.dataset.delete}”吗？`)) {
                await request(`/doctors/${deleteBtn.dataset.delete}`, {method: "DELETE"});
                if (state.doctorEditingId === deleteBtn.dataset.delete) resetDoctorForm("");
                setMessage("doctorMessage", "医生已删除", true);
                await loadDoctors();
            }
        } catch (err) {
            setMessage("doctorMessage", `操作失败：${err.message}`);
        }
    });

    el("searchButton")?.addEventListener("click", async () => {
        state.pn = 1;
        await loadDoctors();
    });
    el("refreshButton")?.addEventListener("click", loadDoctors);
    el("prevPage")?.addEventListener("click", async () => {
        if (state.pn > 1) {
            state.pn--;
            await loadDoctors();
        }
    });
    el("nextPage")?.addEventListener("click", async () => {
        if (state.pn * state.size < state.total) {
            state.pn++;
            await loadDoctors();
        }
    });
}

// ========== 药品管理 ==========
async function loadDrugs() {
    try {
        const keyword = encodeURIComponent(el("drugKeyword")?.value?.trim() || "");
        const path = keyword
            ? `/drugs/${state.drugPn}/${state.drugSize}?name=${keyword}`
            : `/drugs/${state.drugPn}/${state.drugSize}`;
        const data = await request(path);
        const page = data.data?.drugPageInfo || data.data?.pageInfo || {list: [], total: 0};
        state.drugTotal = page.total || 0;
        state.drugPn = page.pageNum || state.drugPn;
        renderDrugs(page.list || []);
        el("drugTotal").textContent = state.drugTotal;
        el("drugPageNo").textContent = state.drugPn;
    } catch (e) {
        console.warn("药品加载失败，使用模拟数据", e);
        const mock = [
            {
                drugId: 12650466,
                drugImg: LOCAL_DRUG_IMAGES_BY_ID["12650466"],
                drugName: "复方感冒灵颗粒",
                drugSales: [{saleName: "老百姓大药房"}],
                drugPublisher: "管理员"
            },
            {
                drugId: 12650467,
                drugImg: LOCAL_DRUG_IMAGES_BY_ID["12650467"],
                drugName: "连花清瘟胶囊",
                drugSales: [{saleName: "好药师大药房"}],
                drugPublisher: "管理员"
            },
            {
                drugId: 12650468,
                drugImg: LOCAL_DRUG_IMAGES_BY_ID["12650468"],
                drugName: "布洛芬混悬液",
                drugSales: [{saleName: "仁和堂大药房"}],
                drugPublisher: "管理员"
            },
        ];
        state.drugTotal = mock.length;
        renderDrugs(mock);
        el("drugTotal").textContent = state.drugTotal;
        el("drugPageNo").textContent = 1;
    }
}

function renderDrugs(list) {
    const body = el("drugRows");
    if (!body) return;
    body.innerHTML = "";
    if (!list.length) {
        body.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px 0;color:#88929e;">暂无药品数据</td></tr>`;
        return;
    }
    list.forEach(d => {
        const rawImg = d.drugImg || "";
        const img = getDrugImageUrl(d);
        const sales = Array.isArray(d.drugSales) ? d.drugSales.map(s => s.saleName).join("、") : (d.saleName || "");
        const saleIdsStr = Array.isArray(d.drugSales) ? d.drugSales.map(s => s.saleId).join(',') : '';
        const actions = isAdmin() ? `
          <button class="action-button" title="修改" data-edit="drug" data-id="${escapeAttr(d.drugId || d.id)}" data-name="${escapeAttr(d.drugName || '')}" data-info="${escapeAttr(d.drugInfo || '')}" data-effect="${escapeAttr(d.drugEffect || '')}" data-img="${escapeAttr(rawImg)}" data-publisher="${escapeAttr(d.drugPublisher || '')}" data-saleids="${escapeAttr(saleIdsStr)}"><img src="./assets/update.png" alt=""></button>
          <button class="action-button danger" title="删除" data-delete="drug" data-id="${escapeAttr(d.drugId || d.id)}" data-name="${escapeAttr(d.drugName || '')}"><img src="./assets/delete.png" alt=""></button>
        ` : "";
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${d.drugId || d.id || '-'}</td>
      <td><img class="img-thumb drug-thumb" src="${escapeAttr(img)}" alt="${escapeAttr(d.drugName || '药品图片')}" onerror="this.onerror=null;this.src='${IMAGE_FALLBACK}'"></td>
      <td>${detailCell(d.drugName)}</td>
      <td>${detailCell(sales)}</td>
      <td>${d.drugPublisher || '-'}</td>
      <td>
        <div class="actions">
          ${actions}
        </div>
      </td>
    `;
        body.appendChild(row);
    });
}

function initDrugEvents() {
    el("drugImageFile")?.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            resetDrugImagePreview();
            return;
        }
        if (!isImageFile(file)) {
            resetDrugImagePreview();
            setMessage("drugMessage", "请选择图片文件");
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            resetDrugImagePreview();
            setMessage("drugMessage", "图片不能超过 3MB");
            return;
        }

        const localPreview = URL.createObjectURL(file);
        updateImagePreview("drugImagePreview", localPreview, "正在上传...");
        try {
            const url = await uploadImage(file);
            el("drugImg").value = url;
            updateImagePreview("drugImagePreview", url, "图片上传成功");
            setMessage("drugMessage", "图片上传成功", true);
        } catch (err) {
            el("drugImg").value = "";
            updateImagePreview("drugImagePreview", IMAGE_FALLBACK, "上传失败");
            setMessage("drugMessage", err.message || "图片上传失败");
        } finally {
            URL.revokeObjectURL(localPreview);
        }
    });

    el("drugForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formEl = e.currentTarget;
        const form = new FormData(formEl);
        const payload = Object.fromEntries(form.entries());
        if (!payload.drugImg) payload.drugImg = "";
        if (payload.saleIds && typeof payload.saleIds === 'string') {
            payload.saleIds = payload.saleIds.split(',').map(s => Number(s.trim())).filter(Boolean);
        } else {
            payload.saleIds = [];
        }
        try {
            await request("/drugs", {method: "POST", body: JSON.stringify(payload)});
            setMessage("drugMessage", "新增药品成功", true);
            formEl.reset();
            resetDrugImagePreview();
            state.drugPn = 1;
            await loadDrugs();
        } catch (err) {
            setMessage("drugMessage", `操作失败：${err.message}`);
        }
    });

    el("drugRows")?.addEventListener("click", async (e) => {
        const deleteBtn = e.target.closest("[data-delete='drug']");
        if (deleteBtn) {
            const id = deleteBtn.dataset.id, name = deleteBtn.dataset.name || id;
            if (confirm(`确定删除“${name}”吗？`)) {
                try {
                    await request(`/drugs/${id}`, {method: "DELETE"});
                    setMessage("drugMessage", "药品已删除", true);
                    await loadDrugs();
                } catch (err) {
                    setMessage("drugMessage", `操作失败：${err.message}`);
                }
            }
            return;
        }
        const editBtn = e.target.closest("[data-edit='drug']");
        if (editBtn) {
            openEditModal("drug", {
                id: editBtn.dataset.id, name: editBtn.dataset.name, info: editBtn.dataset.info,
                effect: editBtn.dataset.effect, img: editBtn.dataset.img, publisher: editBtn.dataset.publisher,
                saleIds: editBtn.dataset.saleids || ''
            });
        }
    });

    el("drugSearchButton")?.addEventListener("click", async () => {
        state.drugPn = 1;
        await loadDrugs();
    });
    el("drugRefreshButton")?.addEventListener("click", loadDrugs);
    el("drugPrevPage")?.addEventListener("click", async () => {
        if (state.drugPn > 1) {
            state.drugPn--;
            await loadDrugs();
        }
    });
    el("drugNextPage")?.addEventListener("click", async () => {
        if (state.drugPn * state.drugSize < state.drugTotal) {
            state.drugPn++;
            await loadDrugs();
        }
    });
}

// ========== 医保政策 ==========
async function loadPolicies() {
    try {
        const keyword = encodeURIComponent(el("policyKeyword")?.value?.trim() || "");
        const query = `?pn=${state.policyPn}&size=${state.policySize}${keyword ? `&keyword=${keyword}` : ""}`;
        const data = await request(`/medical/policy${query}`);
        const page = data.data?.pageInfo || {list: [], total: 0};
        state.policyTotal = page.total || 0;
        state.policyPn = page.pageNum || state.policyPn;
        renderPolicies(page.list || []);
        el("policyTotal").textContent = state.policyTotal;
        el("policyPageNo").textContent = state.policyPn;
    } catch (e) {
        console.warn("医保政策加载失败，使用模拟数据", e);
        const mock = [
            {
                id: 1,
                title: "城乡居民基本医疗保险门诊统筹制度备案",
                message: "全体参保居民均享受普通门诊待遇。",
                cityId: 1
            },
            {id: 2, title: "完善国家医保谈判药品双通道管理机制", message: "将谈判药品纳入医保乙类药品目录。", cityId: 2},
        ];
        state.policyTotal = mock.length;
        renderPolicies(mock);
        el("policyTotal").textContent = state.policyTotal;
        el("policyPageNo").textContent = 1;
    }
}

function renderPolicies(list) {
    const body = el("policyRows");
    if (!body) return;
    body.innerHTML = "";
    if (!list.length) {
        body.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px 0;color:#88929e;">暂无医保政策数据</td></tr>`;
        return;
    }
    list.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${item.id || '-'}</td>
      <td>${detailCell(item.title)}</td>
      <td>${detailCell(item.message)}</td>
      <td>${item.cityId || '-'}</td>
      <td>
        <div class="actions">
          <button class="action-button" title="修改" data-edit="policy" data-id="${item.id}" data-title="${item.title || ''}" data-message="${item.message || ''}" data-cityid="${item.cityId || ''}"><img src="./assets/update.png" alt=""></button>
          <button class="action-button danger" title="删除" data-delete="policy" data-id="${item.id}" data-name="${item.title || ''}"><img src="./assets/delete.png" alt=""></button>
        </div>
      </td>
    `;
        body.appendChild(row);
    });
}

function initPolicyEvents() {
    el("policyForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formEl = e.currentTarget;
        const form = new FormData(formEl);
        const payload = Object.fromEntries(form.entries());
        payload.cityId = Number(payload.cityId);
        if (!payload.cityId || payload.cityId <= 0 || isNaN(payload.cityId)) {
            setMessage("policyMessage", "请输入有效的城市ID（数字）");
            return;
        }
        try {
            await request("/medical/policy", {method: "POST", body: JSON.stringify(payload)});
            setMessage("policyMessage", "新增医保政策成功", true);
            formEl.reset();
            state.policyPn = 1;
            await loadPolicies();
        } catch (err) {
            setMessage("policyMessage", `操作失败：${err.message}`);
        }
    });

    el("policyRows")?.addEventListener("click", async (e) => {
        const deleteBtn = e.target.closest("[data-delete='policy']");
        if (deleteBtn) {
            const id = deleteBtn.dataset.id, name = deleteBtn.dataset.name || id;
            if (confirm(`确定删除“${name}”吗？`)) {
                try {
                    await request(`/medical/policy/${id}`, {method: "DELETE"});
                    setMessage("policyMessage", "医保政策已删除", true);
                    await loadPolicies();
                } catch (err) {
                    setMessage("policyMessage", `操作失败：${err.message}`);
                }
            }
            return;
        }
        const editBtn = e.target.closest("[data-edit='policy']");
        if (editBtn) {
            openEditModal("policy", {
                id: editBtn.dataset.id, title: editBtn.dataset.title,
                message: editBtn.dataset.message, cityId: editBtn.dataset.cityid
            });
        }
    });

    el("policySearchButton")?.addEventListener("click", async () => {
        state.policyPn = 1;
        await loadPolicies();
    });
    el("policyRefreshButton")?.addEventListener("click", loadPolicies);
    el("policyPrevPage")?.addEventListener("click", async () => {
        if (state.policyPn > 1) {
            state.policyPn--;
            await loadPolicies();
        }
    });
    el("policyNextPage")?.addEventListener("click", async () => {
        if (state.policyPn * state.policySize < state.policyTotal) {
            state.policyPn++;
            await loadPolicies();
        }
    });
}

// ========== 医药公司政策 ==========
async function loadCompanyPolicies() {
    try {
        const keyword = encodeURIComponent(el("companyPolicyKeyword")?.value?.trim() || "");
        const query = `?pn=${state.companyPolicyPn}&size=${state.companyPolicySize}${keyword ? `&keyword=${keyword}` : ""}`;
        const data = await request(`/company/policy${query}`);
        const page = data.data?.pageInfo || {list: [], total: 0};
        state.companyPolicyTotal = page.total || 0;
        state.companyPolicyPn = page.pageNum || state.companyPolicyPn;
        renderCompanyPolicies(page.list || []);
        el("companyPolicyTotal").textContent = state.companyPolicyTotal;
        el("companyPolicyPageNo").textContent = state.companyPolicyPn;
    } catch (e) {
        console.warn("医药公司政策加载失败，使用模拟数据", e);
        const mock = [
            {
                id: 1,
                title: "药品上市许可持有人制度",
                message: "上市许可持有人和生产许可持有人可以是同一主体。",
                companyId: 1
            },
            {id: 2, title: "严格生产、销售管制药品", message: "对管制药品进行严格监管。", companyId: 2},
        ];
        state.companyPolicyTotal = mock.length;
        renderCompanyPolicies(mock);
        el("companyPolicyTotal").textContent = state.companyPolicyTotal;
        el("companyPolicyPageNo").textContent = 1;
    }
}

function renderCompanyPolicies(list) {
    const body = el("companyPolicyRows");
    if (!body) return;
    body.innerHTML = "";
    if (!list.length) {
        body.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px 0;color:#88929e;">暂无医药公司政策数据</td></tr>`;
        return;
    }
    list.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${item.id || '-'}</td>
      <td>${detailCell(item.title)}</td>
      <td>${detailCell(item.message)}</td>
      <td>${item.companyId || '-'}</td>
      <td>
        <div class="actions">
          <button class="action-button" title="修改" data-edit="companyPolicy" data-id="${item.id}" data-title="${item.title || ''}" data-message="${item.message || ''}" data-companyid="${item.companyId || ''}"><img src="./assets/update.png" alt=""></button>
          <button class="action-button danger" title="删除" data-delete="companyPolicy" data-id="${item.id}" data-name="${item.title || ''}"><img src="./assets/delete.png" alt=""></button>
        </div>
      </td>
    `;
        body.appendChild(row);
    });
}

function initCompanyPolicyEvents() {
    el("companyPolicyForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formEl = e.currentTarget;
        const form = new FormData(formEl);
        const payload = Object.fromEntries(form.entries());
        payload.companyId = Number(payload.companyId);
        try {
            await request("/company/policy", {method: "POST", body: JSON.stringify(payload)});
            setMessage("companyPolicyMessage", "新增医药公司政策成功", true);
            formEl.reset();
            state.companyPolicyPn = 1;
            await loadCompanyPolicies();
        } catch (err) {
            setMessage("companyPolicyMessage", `操作失败：${err.message}`);
        }
    });

    el("companyPolicyRows")?.addEventListener("click", async (e) => {
        const deleteBtn = e.target.closest("[data-delete='companyPolicy']");
        if (deleteBtn) {
            const id = deleteBtn.dataset.id, name = deleteBtn.dataset.name || id;
            if (confirm(`确定删除“${name}”吗？`)) {
                try {
                    await request(`/company/policy/${id}`, {method: "DELETE"});
                    setMessage("companyPolicyMessage", "医药公司政策已删除", true);
                    await loadCompanyPolicies();
                } catch (err) {
                    setMessage("companyPolicyMessage", `操作失败：${err.message}`);
                }
            }
            return;
        }
        const editBtn = e.target.closest("[data-edit='companyPolicy']");
        if (editBtn) {
            openEditModal("companyPolicy", {
                id: editBtn.dataset.id, title: editBtn.dataset.title,
                message: editBtn.dataset.message, companyId: editBtn.dataset.companyid
            });
        }
    });

    el("companyPolicySearchButton")?.addEventListener("click", async () => {
        state.companyPolicyPn = 1;
        await loadCompanyPolicies();
    });
    el("companyPolicyRefreshButton")?.addEventListener("click", loadCompanyPolicies);
    el("companyPolicyPrevPage")?.addEventListener("click", async () => {
        if (state.companyPolicyPn > 1) {
            state.companyPolicyPn--;
            await loadCompanyPolicies();
        }
    });
    el("companyPolicyNextPage")?.addEventListener("click", async () => {
        if (state.companyPolicyPn * state.companyPolicySize < state.companyPolicyTotal) {
            state.companyPolicyPn++;
            await loadCompanyPolicies();
        }
    });
}

// ========== 必备材料 ==========
async function loadMaterials() {
    try {
        const keyword = encodeURIComponent(el("materialKeyword")?.value?.trim() || "");
        const query = `?pn=${state.materialPn}&size=${state.materialSize}${keyword ? `&keyword=${keyword}` : ""}`;
        const data = await request(`/material${query}`);
        const page = data.data?.pageInfo || {list: [], total: 0};
        state.materialTotal = page.total || 0;
        state.materialPn = page.pageNum || state.materialPn;
        renderMaterials(page.list || []);
        el("materialTotal").textContent = state.materialTotal;
        el("materialPageNo").textContent = state.materialPn;
    } catch (e) {
        console.warn("必备材料加载失败，使用模拟数据", e);
        const mock = [
            {id: 1, title: "门诊报销", message: "门诊报销需携带门诊发票、合作医疗证历本或病历。"},
            {id: 2, title: "住院报销", message: "住院报销需携带住院发票、费用明细清单和出院小结。"},
        ];
        state.materialTotal = mock.length;
        renderMaterials(mock);
        el("materialTotal").textContent = state.materialTotal;
        el("materialPageNo").textContent = 1;
    }
}

function renderMaterials(list) {
    const body = el("materialRows");
    if (!body) return;
    body.innerHTML = "";
    if (!list.length) {
        body.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:30px 0;color:#88929e;">暂无必备材料数据</td></tr>`;
        return;
    }
    list.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${item.id || '-'}</td>
      <td>${detailCell(item.title)}</td>
      <td>${detailCell(item.message)}</td>
      <td>
        <div class="actions">
          <button class="action-button" title="修改" data-edit="material" data-id="${item.id}" data-title="${item.title || ''}" data-message="${item.message || ''}"><img src="./assets/update.png" alt=""></button>
          <button class="action-button danger" title="删除" data-delete="material" data-id="${item.id}" data-name="${item.title || ''}"><img src="./assets/delete.png" alt=""></button>
        </div>
      </td>
    `;
        body.appendChild(row);
    });
}

function initMaterialEvents() {
    el("materialForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formEl = e.currentTarget;
        const form = new FormData(formEl);
        const payload = Object.fromEntries(form.entries());
        try {
            await request("/material", {method: "POST", body: JSON.stringify(payload)});
            setMessage("materialMessage", "新增必备材料成功", true);
            formEl.reset();
            state.materialPn = 1;
            await loadMaterials();
        } catch (err) {
            setMessage("materialMessage", `操作失败：${err.message}`);
        }
    });

    el("materialRows")?.addEventListener("click", async (e) => {
        const deleteBtn = e.target.closest("[data-delete='material']");
        if (deleteBtn) {
            const id = deleteBtn.dataset.id, name = deleteBtn.dataset.name || id;
            if (confirm(`确定删除“${name}”吗？`)) {
                try {
                    await request(`/material/${id}`, {method: "DELETE"});
                    setMessage("materialMessage", "必备材料已删除", true);
                    await loadMaterials();
                } catch (err) {
                    setMessage("materialMessage", `操作失败：${err.message}`);
                }
            }
            return;
        }
        const editBtn = e.target.closest("[data-edit='material']");
        if (editBtn) {
            openEditModal("material", {
                id: editBtn.dataset.id, title: editBtn.dataset.title, message: editBtn.dataset.message
            });
        }
    });

    el("materialSearchButton")?.addEventListener("click", async () => {
        state.materialPn = 1;
        await loadMaterials();
    });
    el("materialRefreshButton")?.addEventListener("click", loadMaterials);
    el("materialPrevPage")?.addEventListener("click", async () => {
        if (state.materialPn > 1) {
            state.materialPn--;
            await loadMaterials();
        }
    });
    el("materialNextPage")?.addEventListener("click", async () => {
        if (state.materialPn * state.materialSize < state.materialTotal) {
            state.materialPn++;
            await loadMaterials();
        }
    });
}

// ========== 鏉冮檺鍒ゆ柇 ==========
function isAdmin() {
    return state.user && state.user.utype === "ROLE_1";
}

// ========== 医药公司管理 ==========
async function loadCompanies() {
    try {
        const keyword = encodeURIComponent(el("companyKeyword")?.value?.trim() || "");
        const path = keyword
            ? `/companys/${state.companyPn}/${state.companySize}?name=${keyword}`
            : `/companys/${state.companyPn}/${state.companySize}`;
        const data = await request(path);
        const page = data.data?.pageInfo || {list: [], total: 0};
        state.companyTotal = page.total || 0;
        state.companyPn = page.pageNum || state.companyPn;
        renderCompanies(page.list || []);
        el("companyTotal").textContent = state.companyTotal;
        el("companyPageNo").textContent = state.companyPn;
        const pageInfo = el("companyPageInfo");
        if (pageInfo) pageInfo.textContent = `第 ${state.companyPn} 页`;
        toggleCompanyFormVisibility();
    } catch (e) {
        console.warn("医药公司加载失败", e);
        renderCompanies([]);
    }
}

function resizeHomeCharts() {
    requestAnimationFrame(() => {
        if (state.histogramChart) state.histogramChart.resize();
        if (state.pieChart) state.pieChart.resize();
    });
}

function renderCompanies(list) {
    const body = el("companyRows");
    if (!body) return;
    body.innerHTML = "";
    if (!list.length) {
        body.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px 0;color:#88929e;">暂无医药公司数据</td></tr>`;
        return;
    }
    const admin = isAdmin();
    list.forEach(c => {
        const row = document.createElement("tr");
        const time = c.updatetime ? new Date(c.updatetime).toLocaleString("zh-CN") : "-";
        const actionsHtml = admin ? `
      <div class="actions">
        <button class="action-button" title="修改" data-edit-company="${escapeAttr(c.companyId)}" data-name="${escapeAttr(c.companyName || '')}" data-phone="${escapeAttr(c.companyPhone || '')}">
          <img src="./assets/update.png" alt="">
        </button>
        <button class="action-button danger" title="删除" data-delete-company="${escapeAttr(c.companyId)}" data-name="${escapeAttr(c.companyName || '')}">
          <img src="./assets/delete.png" alt="">
        </button>
      </div>` : `<span style="color:#88929e;font-size:12px;">无权限</span>`;
        row.innerHTML = `
      <td>${c.companyId || "-"}</td>
      <td>${detailCell(c.companyName)}</td>
      <td>${c.companyPhone || "-"}</td>
      <td>${time}</td>
      <td>${actionsHtml}</td>
    `;
        body.appendChild(row);
    });
}

function toggleCompanyFormVisibility() {
    const form = el("companyForm");
    if (!form) return;
    form.style.display = isAdmin() ? "" : "none";
    const grid = document.querySelector(".company-module .content-grid");
    if (grid) grid.style.gridTemplateColumns = isAdmin() ? "280px 1fr" : "1fr";
}

function resetCompanyForm() {
    const form = el("companyForm");
    if (form) form.reset();
    const editCompanyIdEl = el("editCompanyId");
    if (editCompanyIdEl) editCompanyIdEl.value = "";
    const companyFormTitleEl = el("companyFormTitle");
    if (companyFormTitleEl) companyFormTitleEl.textContent = "新增医药公司";
    const submitBtn = el("companySubmitBtn");
    if (submitBtn) submitBtn.querySelector("span").textContent = "新增公司";
    const cancelBtn = el("companyCancelBtn");
    if (cancelBtn) cancelBtn.style.display = "none";
    setMessage("companyMessage", "");
}

function initCompanyEvents() {
    el("companyForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!isAdmin()) {
            setMessage("companyMessage", "非管理员角色，不能新增或修改医药公司");
            return;
        }
        const editId = el("editCompanyId").value;
        const name = el("companyNameInput").value.trim();
        const phone = el("companyPhoneInput").value.trim();
        if (!name || !phone) {
            setMessage("companyMessage", "请填写完整的公司信息");
            return;
        }
        const payload = {companyName: name, companyPhone: phone};
        try {
            if (editId) {
                await request(`/companys/${editId}`, {method: "PUT", body: JSON.stringify(payload)});
                setMessage("companyMessage", "公司修改成功", true);
            } else {
                await request("/companys", {method: "POST", body: JSON.stringify(payload)});
                setMessage("companyMessage", "公司添加成功", true);
            }
            resetCompanyForm();
            state.companyPn = editId ? state.companyPn : 1;
            await loadCompanies();
        } catch (err) {
            setMessage("companyMessage", `操作失败：${err.message}`);
        }
    });

    el("companyCancelBtn")?.addEventListener("click", resetCompanyForm);

    el("companyRows")?.addEventListener("click", async (e) => {
        if (!isAdmin()) {
            alert("非管理员角色，无权操作医药公司");
            return;
        }
        const editBtn = e.target.closest("[data-edit-company]");
        const deleteBtn = e.target.closest("[data-delete-company]");

        if (editBtn) {
            const id = editBtn.dataset.editCompany;
            el("editCompanyId").value = id;
            el("companyNameInput").value = editBtn.dataset.name || "";
            el("companyPhoneInput").value = editBtn.dataset.phone || "";
            el("companyFormTitle").textContent = `编辑医药公司 (ID: ${id})`;
            const submitBtn = el("companySubmitBtn");
            if (submitBtn) submitBtn.querySelector("span").textContent = "保存修改";
            const cancelBtn = el("companyCancelBtn");
            if (cancelBtn) cancelBtn.style.display = "inline-flex";
            setMessage("companyMessage", "");
            window.scrollTo({top: 0, behavior: "smooth"});
        }

        if (deleteBtn) {
            const id = deleteBtn.dataset.deleteCompany;
            const name = deleteBtn.dataset.name || id;
            if (confirm(`确定删除医药公司“${name}”吗？此操作不可恢复。`)) {
                try {
                    await request(`/companys/${id}`, {method: "DELETE"});
                    setMessage("companyMessage", "公司已删除", true);
                    resetCompanyForm();
                    await loadCompanies();
                } catch (err) {
                    setMessage("companyMessage", `操作失败：${err.message}`);
                }
            }
        }
    });

    el("companySearchButton")?.addEventListener("click", async () => {
        state.companyPn = 1;
        await loadCompanies();
    });
    el("companyRefreshButton")?.addEventListener("click", async () => {
        const kw = el("companyKeyword");
        if (kw) kw.value = "";
        state.companyPn = 1;
        await loadCompanies();
    });
    el("companyPrevPage")?.addEventListener("click", async () => {
        if (state.companyPn > 1) {
            state.companyPn--;
            await loadCompanies();
        }
    });
    el("companyNextPage")?.addEventListener("click", async () => {
        if (state.companyPn * state.companySize < state.companyTotal) {
            state.companyPn++;
            await loadCompanies();
        }
    });
}

// ========== 医保城市管理 ==========
const CHINA_PROVINCES = [
    {id: 110000, name: "北京市"}, {id: 120000, name: "天津市"}, {id: 130000, name: "河北省"},
    {id: 140000, name: "山西省"}, {id: 150000, name: "内蒙古自治区"}, {id: 210000, name: "辽宁省"},
    {id: 220000, name: "吉林省"}, {id: 230000, name: "黑龙江省"}, {id: 310000, name: "上海市"},
    {id: 320000, name: "江苏省"}, {id: 330000, name: "浙江省"}, {id: 340000, name: "安徽省"},
    {id: 350000, name: "福建省"}, {id: 360000, name: "江西省"}, {id: 370000, name: "山东省"},
    {id: 410000, name: "河南省"}, {id: 420000, name: "湖北省"}, {id: 430000, name: "湖南省"},
    {id: 440000, name: "广东省"}, {id: 450000, name: "广西壮族自治区"}, {id: 460000, name: "海南省"},
    {id: 500000, name: "重庆市"}, {id: 510000, name: "四川省"}, {id: 520000, name: "贵州省"},
    {id: 530000, name: "云南省"}, {id: 540000, name: "西藏自治区"}, {id: 610000, name: "陕西省"},
    {id: 620000, name: "甘肃省"}, {id: 630000, name: "青海省"}, {id: 640000, name: "宁夏回族自治区"},
    {id: 650000, name: "新疆维吾尔自治区"}
];

const cityCache = {};

async function loadProvinceCities(provinceId) {
    if (cityCache[provinceId]) return cityCache[provinceId];
    try {
        const data = await request(`/citys/1/500`);
        const allCities = data.data?.cityPageInfo?.list || [];
        const provincePrefix = Math.floor(provinceId / 10000);
        const cities = allCities
            .filter(c => c.province && c.cityNumber && Math.floor(c.cityNumber / 10000) === provincePrefix)
            .map(c => ({id: c.cityNumber, name: c.city, province: c.province}))
            .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        cityCache[provinceId] = cities;
        return cities;
    } catch (e) {
        console.warn("加载城市列表失败", e);
        return [];
    }
}

function initProvinceSelect() {
    const select = el("provinceSelect");
    if (!select) return;
    select.innerHTML = '<option value="">-- 请选择省份 --</option>';
    CHINA_PROVINCES.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.name;
        select.appendChild(opt);
    });
    select.addEventListener("change", async () => {
        const provinceId = parseInt(select.value, 10);
        const citySelect = el("citySelect");
        if (!citySelect) return;
        citySelect.innerHTML = '<option value="">-- 加载中 --</option>';
        if (!provinceId) {
            citySelect.innerHTML = '<option value="">-- 请先选择省份 --</option>';
            return;
        }
        const cities = await loadProvinceCities(provinceId);
        citySelect.innerHTML = '<option value="">-- 请选择城市 --</option>';
        cities.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.name;
            citySelect.appendChild(opt);
        });
    });
}

async function loadCities() {
    try {
        const keyword = encodeURIComponent(el("cityKeyword")?.value?.trim() || "");
        const path = keyword
            ? `/citys/${state.cityPn}/${state.citySize}?name=${keyword}`
            : `/citys/${state.cityPn}/${state.citySize}`;
        const data = await request(path);
        const page = data.data?.cityPageInfo || {list: [], total: 0};
        state.cityTotal = page.total || 0;
        state.cityPn = page.pageNum || state.cityPn;
        renderCities(page.list || []);
        el("cityTotal").textContent = state.cityTotal;
        el("cityPageNo").textContent = state.cityPn;
        const pageInfo = el("cityPageInfo");
        if (pageInfo) pageInfo.textContent = `第 ${state.cityPn} 页`;
    } catch (e) {
        console.warn("城市列表加载失败", e);
        renderCities([]);
    }
}

function renderCities(list) {
    const body = el("cityRows");
    if (!body) return;
    body.innerHTML = "";
    if (!list.length) {
        body.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px 0;color:#88929e;">暂无城市数据</td></tr>`;
        return;
    }
    list.forEach(c => {
        const row = document.createElement("tr");
        const time = c.updatetime ? new Date(c.updatetime).toLocaleString("zh-CN") : "-";
        row.innerHTML = `
      <td>${c.cityId || "-"}</td>
      <td>${detailCell(c.province)}</td>
      <td>${detailCell(c.city)}</td>
      <td>${c.cityNumber || "-"}</td>
      <td>${time}</td>
      <td>
        <div class="actions">
          <button class="action-button danger" title="删除" data-delete-city="${escapeAttr(c.cityId)}" data-name="${escapeAttr(c.city || '')}">
            <img src="./assets/delete.png" alt="">
          </button>
        </div>
      </td>
    `;
        body.appendChild(row);
    });
}

function initCityEvents() {
    el("cityForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const provinceSelect = el("provinceSelect");
        const citySelect = el("citySelect");
        const provinceId = provinceSelect?.value;
        const cityNumber = citySelect?.value;
        const cityName = citySelect?.selectedOptions[0]?.textContent || "";

        if (!provinceId || !cityNumber) {
            setMessage("cityMessage", "请选择省份和城市");
            return;
        }

        try {
            await request(`/citys?cityNumber=${cityNumber}`, {method: "POST"});
            setMessage("cityMessage", `新增城市“${cityName}”成功`, true);
            const cityFormEl = el("cityForm");
            if (cityFormEl) cityFormEl.reset();
            const citySelectEl = el("citySelect");
            if (citySelectEl) citySelectEl.innerHTML = '<option value="">-- 请先选择省份 --</option>';
            state.cityPn = 1;
            await loadCities();
        } catch (err) {
            setMessage("cityMessage", `操作失败：${err.message}`);
        }
    });

    el("cityRows")?.addEventListener("click", async (e) => {
        const deleteBtn = e.target.closest("[data-delete-city]");
        if (!deleteBtn) return;
        const id = deleteBtn.dataset.deleteCity;
        const name = deleteBtn.dataset.name || id;
        if (confirm(`确定删除城市“${name}”吗？`)) {
            try {
                await request(`/citys/${id}`, {method: "DELETE"});
                setMessage("cityMessage", `城市“${name}”已删除`, true);
                await loadCities();
            } catch (err) {
                alert(`删除失败：${err.message}`);
            }
        }
    });

    el("citySearchButton")?.addEventListener("click", async () => {
        state.cityPn = 1;
        await loadCities();
    });
    el("cityRefreshButton")?.addEventListener("click", async () => {
        const kw = el("cityKeyword");
        if (kw) kw.value = "";
        state.cityPn = 1;
        await loadCities();
    });
    el("cityPrevPage")?.addEventListener("click", async () => {
        if (state.cityPn > 1) {
            state.cityPn--;
            await loadCities();
        }
    });
    el("cityNextPage")?.addEventListener("click", async () => {
        if (state.cityPn * state.citySize < state.cityTotal) {
            state.cityPn++;
            await loadCities();
        }
    });
}

// ========== 统一修改弹窗 ==========
const editFieldConfig = {
    drug: {
        title: "修改药品信息",
        fields: [
            {key: "name", label: "药品名称", type: "text"},
            {key: "info", label: "药品信息", type: "textarea"},
            {key: "effect", label: "药品功效", type: "textarea"},
            {key: "img", label: "药品图片", type: "image"},
            {key: "publisher", label: "发布者", type: "text"},
            {key: "saleIds", label: "销售地点ID（逗号分隔）", type: "text"},
        ],
        getPayload: (d) => {
            const saleIds = d.saleIds && d.saleIds.trim()
                ? d.saleIds.split(',').map(s => Number(s.trim())).filter(Boolean)
                : [];
            return {
                drugName: d.name,
                drugInfo: d.info,
                drugEffect: d.effect,
                drugImg: d.img || "",
                drugPublisher: d.publisher || "管理员",
                saleIds: saleIds
            };
        },
        getEditData: (r) => ({
            name: r.name || '',
            info: r.info || '',
            effect: r.effect || '',
            img: r.img || '',
            publisher: r.publisher || '',
            saleIds: r.saleIds || ''
        }),
        getUpdateUrl: (id) => `/drugs/${id}`
    },
    policy: {
        title: "修改医保政策",
        fields: [
            {key: "title", label: "政策标题", type: "text"},
            {key: "message", label: "政策内容", type: "textarea"},
            {key: "cityId", label: "城市ID", type: "text"},
        ],
        getPayload: (d) => ({title: d.title, message: d.message, cityId: Number(d.cityId)}),
        getEditData: (r) => ({title: r.title || '', message: r.message || '', cityId: r.cityId || ''}),
        getUpdateUrl: (id) => `/medical/policy/${id}`
    },
    companyPolicy: {
        title: "修改医药公司政策",
        fields: [
            {key: "title", label: "政策标题", type: "text"},
            {key: "message", label: "政策内容", type: "textarea"},
            {key: "companyId", label: "公司ID", type: "text"},
        ],
        getPayload: (d) => ({title: d.title, message: d.message, companyId: Number(d.companyId)}),
        getEditData: (r) => ({title: r.title || '', message: r.message || '', companyId: r.companyId || ''}),
        getUpdateUrl: (id) => `/company/policy/${id}`
    },
    material: {
        title: "修改必备材料",
        fields: [
            {key: "title", label: "材料标题", type: "text"},
            {key: "message", label: "材料内容", type: "textarea"},
        ],
        getPayload: (d) => ({title: d.title, message: d.message}),
        getEditData: (r) => ({title: r.title || '', message: r.message || ''}),
        getUpdateUrl: (id) => `/material/${id}`
    },
    company: {
        title: "修改医药公司信息",
        fields: [
            {key: "name", label: "公司名称", type: "text"},
            {key: "phone", label: "公司电话", type: "text"},
        ],
        getPayload: (d) => ({companyName: d.name, companyPhone: d.phone}),
        getEditData: (r) => ({name: r.name || '', phone: r.phone || ''}),
        getUpdateUrl: (id) => `/companys/${id}`
    }
};

function openEditModal(module, rowData) {
    const config = editFieldConfig[module];
    if (!config) return;
    el("editModalTitle").textContent = config.title;
    el("editId").value = rowData.id || '';
    el("editModule").value = module;
    const container = el("editFields");
    container.innerHTML = '';
    const editData = config.getEditData(rowData);
    config.fields.forEach(f => {
        const wrapper = document.createElement('div');
        if (f.type === 'image') {
            wrapper.className = "edit-image-field";
            wrapper.innerHTML = `
        <input id="edit_${f.key}" type="text" placeholder="图片地址" value="${escapeAttr(editData[f.key] || '')}">
        <label class="image-upload-field" for="edit_${f.key}_file">
          <span>${f.label}</span>
          <input id="edit_${f.key}_file" type="file" accept="image/*">
        </label>
        <div class="image-preview compact" id="edit_${f.key}_preview">
          <img src="${escapeAttr(normalizeImageUrl(editData[f.key] || ''))}" alt="药品图片预览">
          <span>${editData[f.key] ? '当前图片' : '未选择图片'}</span>
        </div>
      `;
            container.appendChild(wrapper);
        } else if (f.type === 'textarea') {
            wrapper.innerHTML = `<textarea id="edit_${f.key}" placeholder="${f.label}" rows="2">${editData[f.key] || ''}</textarea>`;
            container.appendChild(wrapper.firstElementChild);
        } else {
            wrapper.innerHTML = `<input id="edit_${f.key}" type="text" placeholder="${f.label}" value="${editData[f.key] || ''}">`;
            container.appendChild(wrapper.firstElementChild);
        }
    });
    config.fields
        .filter(f => f.type === 'image')
        .forEach(f => bindEditImageUpload(f.key));
    el("editMessage").textContent = '';
    document.getElementById("editOverlay").classList.add("active");
}

function openDetailModal(text) {
    const value = String(text || "").trim();
    if (!value || value === "-") return;
    let overlay = document.getElementById("detailOverlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "edit-overlay";
        overlay.id = "detailOverlay";
        overlay.innerHTML = `
      <div class="edit-modal detail-modal">
        <h3>完整内容</h3>
        <div class="detail-content" id="detailContent"></div>
        <div class="edit-actions">
          <button type="button" class="btn-cancel" id="detailCloseBtn">关闭</button>
        </div>
      </div>
    `;
        document.body.appendChild(overlay);
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay || e.target.id === "detailCloseBtn") {
                overlay.classList.remove("active");
            }
        });
    }
    el("detailContent").textContent = value;
    overlay.classList.add("active");
}

function initDetailEvents() {
    document.addEventListener("click", (e) => {
        const target = e.target.closest("[data-detail]");
        if (!target) return;
        e.preventDefault();
        openDetailModal(target.dataset.detail || target.textContent);
    });
}

function bindEditImageUpload(key) {
    const fileInput = document.getElementById(`edit_${key}_file`);
    const valueInput = document.getElementById(`edit_${key}`);
    const previewId = `edit_${key}_preview`;
    fileInput?.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!isImageFile(file)) {
            el("editMessage").textContent = "请选择图片文件";
            el("editMessage").style.color = "#b44735";
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            el("editMessage").textContent = "图片不能超过 3MB";
            el("editMessage").style.color = "#b44735";
            return;
        }

        const localPreview = URL.createObjectURL(file);
        updateImagePreview(previewId, localPreview, "正在上传...");
        try {
            const url = await uploadImage(file);
            valueInput.value = url;
            updateImagePreview(previewId, url, "图片上传成功");
            el("editMessage").textContent = "图片上传成功";
            el("editMessage").style.color = "#237b7b";
        } catch (err) {
            updateImagePreview(previewId, valueInput.value || IMAGE_FALLBACK, "上传失败");
            el("editMessage").textContent = err.message || "图片上传失败";
            el("editMessage").style.color = "#b44735";
        } finally {
            URL.revokeObjectURL(localPreview);
        }
    });
}

function getEditFieldValue(key) {
    const node = document.getElementById(`edit_${key}`);
    return node ? node.value : '';
}

function initEditEvents() {
    el("editCancelBtn")?.addEventListener("click", () => {
        document.getElementById("editOverlay").classList.remove("active");
        el("editMessage").textContent = '';
    });
    document.getElementById("editOverlay")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
            document.getElementById("editOverlay").classList.remove("active");
            el("editMessage").textContent = '';
        }
    });
    el("editForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = el("editId").value;
        const module = el("editModule").value;
        const config = editFieldConfig[module];
        if (!config) return;
        const fieldData = {};
        config.fields.forEach(f => {
            fieldData[f.key] = getEditFieldValue(f.key);
        });
        const payload = config.getPayload(fieldData);
        try {
            await request(config.getUpdateUrl(id), {method: "PUT", body: JSON.stringify(payload)});
            el("editMessage").textContent = "修改成功";
            el("editMessage").style.color = "#237b7b";
            setTimeout(() => {
                document.getElementById("editOverlay").classList.remove("active");
                el("editMessage").textContent = "";
            }, 800);
            const refreshMap = {
                drug: loadDrugs,
                policy: loadPolicies,
                companyPolicy: loadCompanyPolicies,
                material: loadMaterials,
                company: loadCompanies
            };
            if (refreshMap[module]) await refreshMap[module]();
        } catch (err) {
            el("editMessage").textContent = `操作失败：${err.message}`;
            el("editMessage").style.color = "#b44735";
        }
    });
}

// ========== 销售地点管理 + 地图 ==========
async function loadSales() {
    try {
        const keyword = encodeURIComponent(el("saleKeyword")?.value?.trim() || "");
        const query = `?pn=${state.salePn}&size=${state.saleSize}${keyword ? `&keyword=${keyword}` : ""}`;
        const data = await request(`/sales${query}`);
        const page = data.data?.pageInfo || {list: [], total: 0};
        state.saleTotal = page.total || 0;
        state.salePn = page.pageNum || state.salePn;
        renderSaleList(page.list || []);
        el("saleTotal").textContent = state.saleTotal;
        const allData = await request("/sales");
        state.allSales = allData.data?.pageInfo?.list || [];
        initSaleMap(state.allSales);
    } catch (e) {
        console.warn("销售地点加载失败，使用模拟数据", e);
        const mock = [
            {
                saleId: 1,
                saleName: "老百姓大药房",
                salePhone: "028-83510000",
                address: "成都市成华区建设路",
                lng: 104.101,
                lat: 30.673
            },
            {
                saleId: 2,
                saleName: "好药师大药房",
                salePhone: "028-84858000",
                address: "成都市龙泉驿区龙泉街道",
                lng: 104.274,
                lat: 30.556
            },
            {
                saleId: 3,
                saleName: "仁和堂大药房",
                salePhone: "028-86630000",
                address: "成都市青羊区人民东路",
                lng: 104.066,
                lat: 30.659
            },
            {
                saleId: 4,
                saleName: "天士力大药房",
                salePhone: "028-86270000",
                address: "成都市青羊区宽窄巷子",
                lng: 104.048,
                lat: 30.664
            },
            {
                saleId: 5,
                saleName: "益丰大药房",
                salePhone: "028-85560000",
                address: "成都市武侯区武侯祠大街",
                lng: 104.055,
                lat: 30.644
            },
        ];
        state.saleTotal = mock.length;
        state.allSales = mock;
        renderSaleList(mock);
        el("saleTotal").textContent = state.saleTotal;
        initSaleMap(mock);
    }
}

function renderSaleList(list) {
    const body = el("saleRows");
    if (!body) return;
    body.innerHTML = "";
    if (!list.length) {
        body.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px 0;color:#88929e;">暂无销售地点</td></tr>`;
        return;
    }
    list.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${item.saleId || "-"}</td>
      <td>${detailCell(item.saleName)}</td>
      <td>${item.salePhone || "-"}</td>
      <td>${detailCell(item.address)}</td>
      <td>
        <div class="actions">
          <button class="action-button" title="修改" data-edit-sale="${escapeAttr(item.saleId)}" data-name="${escapeAttr(item.saleName || '')}" data-phone="${escapeAttr(item.salePhone || '')}" data-address="${escapeAttr(item.address || '')}" data-lng="${escapeAttr(item.lng || '')}" data-lat="${escapeAttr(item.lat || '')}"><img src="./assets/update.png" alt=""></button>
          <button class="action-button danger" title="删除" data-delete-sale="${escapeAttr(item.saleId)}" data-name="${escapeAttr(item.saleName || '')}"><img src="./assets/delete.png" alt=""></button>
        </div>
      </td>
    `;
        body.appendChild(row);
    });
}

function initSaleMap(list) {
    const container = el("saleMapContainer");
    if (!container) return;
    if (typeof AMap === "undefined") {
        container.innerHTML = `<div style="text-align:center;padding-top:200px;color:#999;">高德地图加载失败，请检查 Key</div>`;
        return;
    }
    let center = [104.066, 30.659];
    const valid = list.filter(item => item.lng && item.lat);
    if (valid.length > 0) {
        const sumLng = valid.reduce((s, i) => s + Number(i.lng), 0);
        const sumLat = valid.reduce((s, i) => s + Number(i.lat), 0);
        center = [sumLng / valid.length, sumLat / valid.length];
    }
    if (state.map) {
        state.map.destroy();
        state.map = null;
        state.markers = [];
    }
    try {
        state.map = new AMap.Map(container, {
            zoom: 12,
            center,
            mapStyle: "amap://styles/whitesmoke"
        });
        const markers = [];
        valid.forEach(item => {
            const marker = new AMap.Marker({
                position: [Number(item.lng), Number(item.lat)],
                title: item.saleName || "销售地点",
                label: {
                    content: `<div style="background:#237b7b;color:#fff;padding:4px 12px;border-radius:4px;font-size:12px;white-space:nowrap;max-width:120px;overflow:hidden;text-overflow:ellipsis;">${item.saleName || ""}</div>`,
                    direction: "top"
                }
            });
            marker.setMap(state.map);
            markers.push(marker);
            marker.on("click", () => {
                const info = `
          <div style="padding:12px;">
            <h4 style="margin:0 0 8px 0;">${item.saleName || ""}</h4>
            <p style="margin:4px 0;color:#666;font-size:13px;">${item.address || ""}</p>
            <p style="margin:4px 0;color:#999;font-size:12px;">电话：${item.salePhone || "-"}</p>
          </div>
        `;
                const infoWindow = new AMap.InfoWindow({content: info});
                infoWindow.open(state.map, [Number(item.lng), Number(item.lat)]);
            });
        });
        state.markers = markers;
        if (markers.length > 1) state.map.setFitView(markers);
        state.map.on("click", function (e) {
            if (state.isAddingSale) {
                const lng = e.lnglat.getLng();
                const lat = e.lnglat.getLat();
                state.selectedLng = lng;
                state.selectedLat = lat;
                const geocoder = new AMap.Geocoder({city: "成都"});
                geocoder.getAddress(new AMap.LngLat(lng, lat), (status, result) => {
                    if (status === "complete") {
                        el("addSaleAddress").value = result.regeocode.formattedAddress || "";
                    }
                });
                el("addSaleLng").value = lng;
                el("addSaleLat").value = lat;
                el("addSaleTip").style.display = "none";
                state.isAddingSale = false;
                document.getElementById("addSaleOverlay").classList.add("active");
                el("addSaleMessage").textContent = "";
            }
        });
    } catch (e) {
        console.warn("地图初始化失败", e);
        container.innerHTML = `<div style="text-align:center;padding-top:200px;color:#999;">地图加载失败</div>`;
    }
}

window.toggleSaleView = function () {
    const isMap = document.getElementById("saleMapSwitch").checked;
    el("saleListView").style.display = isMap ? "none" : "block";
    el("saleMapView").style.display = isMap ? "block" : "none";
    if (isMap) {
        setTimeout(() => {
            if (state.map) {
                state.map.setFitView(state.markers);
                state.map.resize();
            } else {
                initSaleMap(state.allSales);
            }
        }, 300);
    }
};

window.startAddSale = function () {
    state.isAddingSale = true;
    const tip = el("addSaleTip");
    if (tip) {
        tip.style.display = "inline";
        tip.textContent = "请点击地图上的位置选择坐标";
    }
    const msg = el("addSaleMessage");
    if (msg) msg.textContent = "";
    ["addSaleName", "addSalePhone", "addSaleAddress", "addSaleLng", "addSaleLat"].forEach(id => {
        const node = el(id);
        if (node) node.value = "";
    });
    const overlay = document.getElementById("addSaleOverlay");
    if (overlay) overlay.classList.add("active");
};

function initSaleEvents() {
    el("saleSearchButton")?.addEventListener("click", async () => {
        state.salePn = 1;
        await loadSales();
    });
    el("saleRefreshButton")?.addEventListener("click", loadSales);
    el("salePrevPage")?.addEventListener("click", async () => {
        if (state.salePn > 1) {
            state.salePn--;
            await loadSales();
        }
    });
    el("saleNextPage")?.addEventListener("click", async () => {
        if (state.salePn * state.saleSize < state.saleTotal) {
            state.salePn++;
            await loadSales();
        }
    });

    el("addSaleForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            saleName: el("addSaleName")?.value || "",
            salePhone: el("addSalePhone")?.value || "",
            address: el("addSaleAddress")?.value || "",
            lng: parseFloat(el("addSaleLng")?.value) || null,
            lat: parseFloat(el("addSaleLat")?.value) || null
        };
        try {
            await request("/sales", {method: "POST", body: JSON.stringify(payload)});
            const msgEl = el("addSaleMessage");
            if (msgEl) {
                msgEl.textContent = "新增成功";
                msgEl.style.color = "#237b7b";
            }
            setTimeout(() => {
                const ov = document.getElementById("addSaleOverlay");
                if (ov) ov.classList.remove("active");
                if (msgEl) msgEl.textContent = "";
                const form = el("addSaleForm");
                if (form) form.reset();
            }, 800);
            await loadSales();
        } catch (err) {
            const msgEl = el("addSaleMessage");
            if (msgEl) {
                msgEl.textContent = `操作失败：${err.message}`;
                msgEl.style.color = "#b44735";
            }
        }
    });

    el("addSaleCancelBtn")?.addEventListener("click", () => {
        const ov = document.getElementById("addSaleOverlay");
        if (ov) ov.classList.remove("active");
        const msgEl = el("addSaleMessage");
        if (msgEl) msgEl.textContent = "";
        state.isAddingSale = false;
        const tip = el("addSaleTip");
        if (tip) tip.style.display = "none";
    });
    document.getElementById("addSaleOverlay")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
            document.getElementById("addSaleOverlay")?.classList.remove("active");
            const msg = el("addSaleMessage");
            if (msg) msg.textContent = "";
            state.isAddingSale = false;
            const tip = el("addSaleTip");
            if (tip) tip.style.display = "none";
        }
    });

    el("saleRows")?.addEventListener("click", async (e) => {
        const deleteBtn = e.target.closest("[data-delete-sale]");
        if (deleteBtn) {
            const id = deleteBtn.dataset.deleteSale;
            const name = deleteBtn.dataset.name || id;
            if (confirm(`确定删除“${name}”吗？`)) {
                try {
                    await request(`/sales/${id}`, {method: "DELETE"});
                    await loadSales();
                } catch (err) {
                    alert(`删除失败：${err.message}`);
                }
            }
            return;
        }
        const editBtn = e.target.closest("[data-edit-sale]");
        if (editBtn) {
            openSaleEditModal({
                id: editBtn.dataset.editSale,
                name: editBtn.dataset.name,
                phone: editBtn.dataset.phone,
                address: editBtn.dataset.address,
                lng: editBtn.dataset.lng,
                lat: editBtn.dataset.lat
            });
        }
    });
}

function openSaleEditModal(data) {
    el("editModalTitle").textContent = "修改销售地点";
    el("editId").value = data.id || "";
    el("editModule").value = "sale";
    const container = el("editFields");
    container.innerHTML = `
    <input id="edit_saleName" type="text" placeholder="销售地点名称" value="${escapeAttr(data.name || '')}">
    <input id="edit_salePhone" type="text" placeholder="联系电话" value="${escapeAttr(data.phone || '')}">
    <input id="edit_saleAddress" type="text" placeholder="详细地址" value="${escapeAttr(data.address || '')}">
    <input id="edit_saleLng" type="text" placeholder="经度" value="${escapeAttr(data.lng || '')}">
    <input id="edit_saleLat" type="text" placeholder="纬度" value="${escapeAttr(data.lat || '')}">
  `;
    el("editMessage").textContent = "";
    document.getElementById("editOverlay").classList.add("active");

    const form = el("editForm");
    const originalSubmit = form._submitHandler;
    form._submitHandler = async (e) => {
        e.preventDefault();
        const id = el("editId").value;
        const payload = {
            saleName: el("edit_saleName").value,
            salePhone: el("edit_salePhone").value || "",
            address: el("edit_saleAddress").value || "",
            lng: parseFloat(el("edit_saleLng").value) || null,
            lat: parseFloat(el("edit_saleLat").value) || null
        };
        try {
            await request(`/sales/${id}`, {method: "PUT", body: JSON.stringify(payload)});
            el("editMessage").textContent = "修改成功";
            el("editMessage").style.color = "#237b7b";
            setTimeout(() => {
                document.getElementById("editOverlay").classList.remove("active");
                el("editMessage").textContent = "";
                form._submitHandler = originalSubmit;
            }, 800);
            await loadSales();
        } catch (err) {
            el("editMessage").textContent = `操作失败：${err.message}`;
            el("editMessage").style.color = "#b44735";
        }
    };
    form.onsubmit = form._submitHandler;
}

// ========== 预约挂号 ==========
const REGISTRATION_STORAGE_KEY = "medical-registrations";

function getRegistrationStore() {
    try {
        const data = JSON.parse(localStorage.getItem(REGISTRATION_STORAGE_KEY) || "[]");
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

function saveRegistrationStore(list) {
    localStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(list));
}

function formatVisitTime(value) {
    if (!value) return "";
    return String(value).replace("T", " ");
}

async function loadRegistrationDoctors() {
    const select = el("registrationDoctorSelect");
    if (!select || state.registrationDoctorLoaded) return;
    try {
        const data = await request("/doctors?pn=1&size=200");
        const doctors = data.data?.pageInfo?.list || [];
        select.innerHTML = `<option value="">请选择医生</option>`;
        doctors.forEach((doctor) => {
            const option = document.createElement("option");
            option.value = doctor.id;
            const level = doctor.doctorLevel?.name ? ` - ${doctor.doctorLevel.name}` : "";
            option.textContent = `${doctor.name || `医生${doctor.id}`}${level}`;
            select.appendChild(option);
        });
        state.registrationDoctorLoaded = true;
    } catch (error) {
        console.warn("挂号医生列表加载失败", error);
        select.innerHTML = `<option value="">医生列表加载失败</option>`;
    }
}

async function loadRegistrations() {
    await loadRegistrationDoctors();
    const keyword = (el("registrationKeyword")?.value || "").trim().toLowerCase();
    const rows = getRegistrationStore();
    const filtered = rows.filter((item) => {
        const text = `${item.patientName} ${item.patientPhone} ${item.doctorName} ${item.symptom} ${item.status}`.toLowerCase();
        return !keyword || text.includes(keyword);
    });
    const pending = rows.filter(item => item.status === "待就诊").length;
    el("registrationTotal").textContent = rows.length;
    el("registrationPending").textContent = pending;
    renderRegistrations(filtered);
}

function renderRegistrations(list) {
    const body = el("registrationRows");
    if (!body) return;
    body.innerHTML = "";
    if (!list.length) {
        body.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:30px 0;color:#88929e;">暂无挂号记录</td></tr>`;
        return;
    }
    list
        .slice()
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
        .forEach((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${escapeAttr(item.id)}</td>
        <td>${detailCell(item.patientName)}</td>
        <td>${escapeAttr(item.patientPhone)}</td>
        <td>${detailCell(item.doctorName)}</td>
        <td>${escapeAttr(formatVisitTime(item.visitTime))}</td>
        <td>${detailCell(item.symptom)}</td>
        <td><span class="status-pill ${item.status === "已就诊" ? "done" : ""}">${escapeAttr(item.status)}</span></td>
        <td>
          <div class="actions">
            <button class="action-button action-text" data-finish-registration="${escapeAttr(item.id)}">${item.status === "已就诊" ? "恢复" : "完成"}</button>
            <button class="action-button action-text danger" data-delete-registration="${escapeAttr(item.id)}" data-name="${escapeAttr(item.patientName)}">删除</button>
          </div>
        </td>
      `;
            body.appendChild(row);
        });
}

function initRegistrationEvents() {
    el("registrationForm")?.addEventListener("submit", async (event) => {
        event.preventDefault();
        await loadRegistrationDoctors();
        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries());
        const doctorSelect = el("registrationDoctorSelect");
        const doctorName = doctorSelect.options[doctorSelect.selectedIndex]?.textContent || "未选择医生";
        const list = getRegistrationStore();
        list.push({
            id: `GH${Date.now().toString().slice(-8)}`,
            patientName: data.patientName.trim(),
            patientPhone: data.patientPhone.trim(),
            doctorId: data.doctorId,
            doctorName,
            visitTime: data.visitTime,
            symptom: data.symptom.trim(),
            status: "待就诊",
            createdAt: new Date().toISOString()
        });
        saveRegistrationStore(list);
        form.reset();
        setMessage("registrationMessage", "挂号提交成功", true);
        await loadRegistrations();
    });

    el("registrationRows")?.addEventListener("click", async (event) => {
        const finishBtn = event.target.closest("[data-finish-registration]");
        const deleteBtn = event.target.closest("[data-delete-registration]");
        let list = getRegistrationStore();
        if (finishBtn) {
            const id = finishBtn.dataset.finishRegistration;
            list = list.map(item => item.id === id
                ? {...item, status: item.status === "已就诊" ? "待就诊" : "已就诊"}
                : item);
            saveRegistrationStore(list);
            setMessage("registrationMessage", "挂号状态已更新", true);
            await loadRegistrations();
            return;
        }
        if (deleteBtn && confirm(`确定删除“${deleteBtn.dataset.name || deleteBtn.dataset.deleteRegistration}”的挂号记录吗？`)) {
            list = list.filter(item => item.id !== deleteBtn.dataset.deleteRegistration);
            saveRegistrationStore(list);
            setMessage("registrationMessage", "挂号记录已删除", true);
            await loadRegistrations();
        }
    });

    el("registrationSearchButton")?.addEventListener("click", loadRegistrations);
    el("registrationRefreshButton")?.addEventListener("click", async () => {
        if (el("registrationKeyword")) el("registrationKeyword").value = "";
        await loadRegistrations();
    });
}

// ========== 启动引导 ==========
async function boot() {
    const userNode = el("currentUser");
    if (userNode) {
        userNode.textContent = `${state.user.realname || state.user.username || "管理员"} · ${state.user.utype || "ROLE_1"}`;
    }
    if (!state.chartResizeBound) {
        window.addEventListener("resize", resizeHomeCharts);
        state.chartResizeBound = true;
    }
    showModule({path: "/home", title: "首页"});

    try {
        const menus = await request("/permissions");
        const roots = menus.data.permissions || [];
        if (roots.length > 0) {
            renderMenu(roots);
            const homeMenu = roots.find(item => item.path === "/home");
            if (homeMenu) showModule(homeMenu);
        }
    } catch (e) {
        console.warn("菜单加载失败，但页面可以继续显示", e);
    }

    initDoctorEvents();
    initDrugEvents();
    initPolicyEvents();
    initCompanyPolicyEvents();
    initMaterialEvents();
    initEditEvents();
    initDetailEvents();
    initSaleEvents();
    initCompanyEvents();
    initCityEvents();
    initRegistrationEvents();
    initProvinceSelect();

    await loadBaseInfo();
}

el("logoutButton")?.addEventListener("click", () => {
    localStorage.removeItem("medical-token");
    localStorage.removeItem("medical-user");
    window.location.href = "./index.html";
});

boot().catch((error) => {
    console.error("启动失败", error);
});
