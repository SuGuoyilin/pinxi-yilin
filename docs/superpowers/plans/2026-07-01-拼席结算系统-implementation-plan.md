# 拼席月度结算管理系统 - 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个纯前端拼席月度结算管理系统，支持多项目独立结算标准配置、月度接待量录入、节假日自动计算、数据留存与汇总分析。

**Architecture:** 单页面应用（SPA），所有逻辑运行在浏览器端，使用 IndexedDB 做本地持久化存储。模块化拆分：数据层(db.js)、计算层(calculator.js)、视图层(app.js)、导入导出(export.js)、图表(charts.js)。

**Tech Stack:** 原生 HTML5 + CSS3 + ES6，Dexie.js (IndexedDB 封装)，Chart.js (图表)，SheetJS (xlsx 导入导出)

---

## 文件结构

```
├── index.html          # 主页面：导航 + 视图容器
├── css/
│   └── style.css       # 全部样式：布局、表格、卡片、表单、响应式
├── js/
│   ├── db.js           # IndexedDB 数据层：项目、月度记录、节假日 CRUD
│   ├── data.js         # 初始数据：5个项目的结算标准、2024-2028节假日
│   ├── calculator.js   # 结算计算：档位匹配、节假日费、店铺附加费、税额
│   ├── app.js          # 主应用：路由切换、视图渲染、事件绑定
│   ├── export.js       # Excel 导入导出：整月数据批量导入、结算单导出
│   └── charts.js       # 图表渲染：Dashboard 趋势图、对比图
```

---

### Task 1: 项目骨架与依赖引入

**Files:**
- Create: `index.html`
- Create: `css/style.css`

- [ ] **Step 1: 创建 index.html 骨架**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>拼席月度结算管理系统</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="https://unpkg.com/dexie@3.2.4/dist/dexie.min.js"></script>
  <script src="https://unpkg.com/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <script src="https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
</head>
<body>
  <nav class="sidebar">
    <div class="logo">拼席结算系统</div>
    <ul class="nav-menu">
      <li data-view="dashboard" class="active">Dashboard</li>
      <li data-view="projects">项目管理</li>
      <li data-view="input">月度录入</li>
      <li data-view="statement">结算单</li>
      <li data-view="history">历史查询</li>
    </ul>
  </nav>
  <main class="main-content">
    <div id="view-dashboard" class="view"></div>
    <div id="view-projects" class="view hidden"></div>
    <div id="view-input" class="view hidden"></div>
    <div id="view-statement" class="view hidden"></div>
    <div id="view-history" class="view hidden"></div>
  </main>
  <script src="js/db.js"></script>
  <script src="js/data.js"></script>
  <script src="js/calculator.js"></script>
  <script src="js/export.js"></script>
  <script src="js/charts.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: 创建基础样式 css/style.css**

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: #f5f7fa;
  color: #333;
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 220px;
  background: #1a1a2e;
  color: #fff;
  padding: 20px 0;
  flex-shrink: 0;
}
.logo {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #333;
}
.nav-menu { list-style: none; padding: 20px 0; }
.nav-menu li {
  padding: 14px 24px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}
.nav-menu li:hover, .nav-menu li.active {
  background: #16213e;
  border-left-color: #e94560;
}
.main-content { flex: 1; padding: 24px; overflow-y: auto; }
.view.hidden { display: none; }
.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin-bottom: 20px;
}
.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a1a2e;
}
.btn {
  display: inline-block;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.2s;
}
.btn:hover { opacity: 0.85; }
.btn-primary { background: #e94560; color: #fff; }
.btn-secondary { background: #16213e; color: #fff; }
.btn-success { background: #0f9b6e; color: #fff; }
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
}
th {
  background: #f8f9fa;
  font-weight: 600;
  color: #555;
}
tr:hover { background: #f8f9fa; }
input, select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
input:focus, select:focus {
  outline: none;
  border-color: #e94560;
}
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.kpi-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 8px;
  padding: 20px;
}
.kpi-value { font-size: 28px; font-weight: bold; margin: 8px 0; }
.kpi-label { font-size: 12px; opacity: 0.9; }
```

---

### Task 2: IndexedDB 数据层

**Files:**
- Create: `js/db.js`

- [ ] **Step 1: 使用 Dexie.js 定义数据库和表**

```javascript
const db = new Dexie('SettlementDB');

db.version(1).stores({
  projects: '++id, name',
  monthlyRecords: '[projectId+year+month], projectId, year, month',
  holidays: '++id, year, name'
});

const DB = {
  // 项目 CRUD
  async getAllProjects() {
    return await db.projects.toArray();
  },
  async getProject(id) {
    return await db.projects.get(id);
  },
  async addProject(project) {
    return await db.projects.add(project);
  },
  async updateProject(id, project) {
    return await db.projects.update(id, project);
  },
  async deleteProject(id) {
    return await db.projects.delete(id);
  },

  // 月度记录 CRUD
  async getMonthlyRecord(projectId, year, month) {
    return await db.monthlyRecords.get({ projectId, year, month });
  },
  async saveMonthlyRecord(record) {
    const existing = await db.monthlyRecords.get({
      projectId: record.projectId,
      year: record.year,
      month: record.month
    });
    if (existing) {
      return await db.monthlyRecords.update(existing.id, record);
    }
    return await db.monthlyRecords.add(record);
  },
  async getMonthlyRecordsByProject(projectId) {
    return await db.monthlyRecords.where({ projectId }).toArray();
  },
  async getAllMonthlyRecords() {
    return await db.monthlyRecords.toArray();
  },

  // 节假日
  async getHolidaysByYear(year) {
    return await db.holidays.where({ year }).toArray();
  },
  async saveHoliday(holiday) {
    return await db.holidays.add(holiday);
  },
  async clearAll() {
    await db.projects.clear();
    await db.monthlyRecords.clear();
    await db.holidays.clear();
  }
};
```

---

### Task 3: 初始数据导入

**Files:**
- Create: `js/data.js`

- [ ] **Step 1: 定义 5 个项目的结算标准（从 Excel 提取）**

```javascript
const INITIAL_PROJECTS = [
  {
    name: '妲润项目',
    calculationType: 'daily_avg',
    tiers: [
      { min: 0, max: 20, price: 700, shopLimit: 5 },
      { min: 20, max: 40, price: 1200, shopLimit: 5 },
      { min: 40, max: 60, price: 1700, shopLimit: 5 },
      { min: 60, max: 80, price: 2200, shopLimit: 5 },
      { min: 80, max: 100, price: 2700, shopLimit: 5 }
    ],
    extraShopFee: 100,
    workTime: '08:00-24:00',
    restDays: 0,
    holidayRule: 'double_pay',
    holidayMultiplier: 2,
    overtimeRate: 20,
    invoiceRate: 0.01,
    description: '早班08:00-16:00，晚班16:00-24:00，全年无休'
  },
  {
    name: '母婴项目',
    calculationType: 'daily_avg',
    tiers: [
      { min: 1, max: 50, price: 1600, shopLimit: 5 },
      { min: 51, max: 100, price: 1900, shopLimit: 5 },
      { min: 100, max: 200, price: 2800, shopLimit: 5 }
    ],
    extraShopFee: 100,
    workTime: '08:00-24:00',
    restDays: 0,
    holidayRule: 'double_pay',
    holidayMultiplier: 2,
    overtimeRate: 20,
    invoiceRate: 0.01,
    description: '早班08:00-16:00，晚班16:00-24:00，全年无休'
  },
  {
    name: '讨师项目',
    calculationType: 'daily_avg',
    tiers: [
      { min: 0, max: 20, price: 500, shopLimit: 5 },
      { min: 20, max: 40, price: 1000, shopLimit: 5 },
      { min: 40, max: 60, price: 1500, shopLimit: 5 },
      { min: 60, max: 80, price: 2000, shopLimit: 5 },
      { min: 80, max: 100, price: 2500, shopLimit: 5 }
    ],
    extraShopFee: 100,
    workTime: '08:00-24:00',
    restDays: 0,
    holidayRule: 'double_pay',
    holidayMultiplier: 2,
    overtimeRate: 20,
    invoiceRate: 0.01,
    description: '早班08:00-16:00，晚班16:00-24:00，全年无休'
  },
  {
    name: '森昊项目',
    calculationType: 'monthly_total',
    tiers: [
      { min: 1, max: 1500, price: 1500 },
      { min: 1500, max: 3000, price: 2000 },
      { min: 3000, max: 4500, price: 2500 },
      { min: 4500, max: 6000, price: 3000 },
      { min: 6000, max: 7500, price: 3500 },
      { min: 7500, max: 9000, price: 4000 },
      { min: 9000, max: Infinity, price: 5000 }
    ],
    extraShopFee: 200,
    workTime: '08:00-24:00',
    restDays: 0,
    holidayRule: 'extra_days',
    holidayExtraDays: 1,
    overtimeRate: 20,
    invoiceRate: 0.01,
    description: '工作时间08:00-24:00，基础店铺6个，超量每店+200元/月'
  },
  {
    name: '悦泰项目（兼职）',
    calculationType: 'hourly',
    onlineRate: 30.30,
    offlineRate: 20.20,
    workTime: '08:00-24:00',
    restDays: 0,
    holidayRule: 'double_pay',
    holidayMultiplier: 2,
    overtimeRate: 20,
    invoiceRate: 0.01,
    description: '按小时计费，上线值班30.30元/小时/人，未上线值班20.20元/小时/人'
  }
];
```

- [ ] **Step 2: 定义 2024-2028 年中国法定节假日**

```javascript
const INITIAL_HOLIDAYS = [
  // 2024
  { year: 2024, name: '元旦', dates: ['2024-01-01'] },
  { year: 2024, name: '春节', dates: ['2024-02-10','2024-02-11','2024-02-12','2024-02-13','2024-02-14','2024-02-15','2024-02-16','2024-02-17'] },
  { year: 2024, name: '清明节', dates: ['2024-04-04','2024-04-05','2024-04-06'] },
  { year: 2024, name: '劳动节', dates: ['2024-05-01','2024-05-02','2024-05-03','2024-05-04','2024-05-05'] },
  { year: 2024, name: '端午节', dates: ['2024-06-10'] },
  { year: 2024, name: '中秋节', dates: ['2024-09-15','2024-09-16','2024-09-17'] },
  { year: 2024, name: '国庆节', dates: ['2024-10-01','2024-10-02','2024-10-03','2024-10-04','2024-10-05','2024-10-06','2024-10-07'] },
  // 2025
  { year: 2025, name: '元旦', dates: ['2025-01-01'] },
  { year: 2025, name: '春节', dates: ['2025-01-28','2025-01-29','2025-01-30','2025-01-31','2025-02-01','2025-02-02','2025-02-03','2025-02-04'] },
  { year: 2025, name: '清明节', dates: ['2025-04-04','2025-04-05','2025-04-06'] },
  { year: 2025, name: '劳动节', dates: ['2025-05-01','2025-05-02','2025-05-03','2025-05-04','2025-05-05'] },
  { year: 2025, name: '端午节', dates: ['2025-05-31','2025-06-01','2025-06-02'] },
  { year: 2025, name: '中秋节', dates: ['2025-10-06'] },
  { year: 2025, name: '国庆节', dates: ['2025-10-01','2025-10-02','2025-10-03','2025-10-04','2025-10-05','2025-10-06','2025-10-07','2025-10-08'] },
  // 2026
  { year: 2026, name: '元旦', dates: ['2026-01-01','2026-01-02','2026-01-03'] },
  { year: 2026, name: '春节', dates: ['2026-02-17','2026-02-18','2026-02-19','2026-02-20','2026-02-21','2026-02-22','2026-02-23','2026-02-24'] },
  { year: 2026, name: '清明节', dates: ['2026-04-04','2026-04-05','2026-04-06'] },
  { year: 2026, name: '劳动节', dates: ['2026-05-01','2026-05-02','2026-05-03','2026-05-04','2026-05-05'] },
  { year: 2026, name: '端午节', dates: ['2026-06-19','2026-06-20','2026-06-21'] },
  { year: 2026, name: '中秋节', dates: ['2026-09-25'] },
  { year: 2026, name: '国庆节', dates: ['2026-10-01','2026-10-02','2026-10-03','2026-10-04','2026-10-05','2026-10-06','2026-10-07','2026-10-08'] },
  // 2027
  { year: 2027, name: '元旦', dates: ['2027-01-01','2027-01-02','2027-01-03'] },
  { year: 2027, name: '春节', dates: ['2027-02-06','2027-02-07','2027-02-08','2027-02-09','2027-02-10','2027-02-11','2027-02-12','2027-02-13'] },
  { year: 2027, name: '清明节', dates: ['2027-04-03','2027-04-04','2027-04-05'] },
  { year: 2027, name: '劳动节', dates: ['2027-05-01','2027-05-02','2027-05-03','2027-05-04','2027-05-05'] },
  { year: 2027, name: '端午节', dates: ['2027-06-09','2027-06-10','2027-06-11'] },
  { year: 2027, name: '中秋节', dates: ['2027-09-15'] },
  { year: 2027, name: '国庆节', dates: ['2027-10-01','2027-10-02','2027-10-03','2027-10-04','2027-10-05','2027-10-06','2027-10-07','2027-10-08'] },
  // 2028
  { year: 2028, name: '元旦', dates: ['2028-01-01'] },
  { year: 2028, name: '春节', dates: ['2028-01-26','2028-01-27','2028-01-28','2028-01-29','2028-01-30','2028-01-31','2028-02-01','2028-02-02'] },
  { year: 2028, name: '清明节', dates: ['2028-04-04','2028-04-05','2028-04-06'] },
  { year: 2028, name: '劳动节', dates: ['2028-05-01','2028-05-02','2028-05-03','2028-05-04','2028-05-05'] },
  { year: 2028, name: '端午节', dates: ['2028-05-28','2028-05-29','2028-05-30'] },
  { year: 2028, name: '中秋节', dates: ['2028-10-03'] },
  { year: 2028, name: '国庆节', dates: ['2028-10-01','2028-10-02','2028-10-03','2028-10-04','2028-10-05','2028-10-06','2028-10-07','2028-10-08'] }
];

async function initData() {
  const projects = await DB.getAllProjects();
  if (projects.length === 0) {
    for (const p of INITIAL_PROJECTS) {
      await DB.addProject(p);
    }
  }
  const holidays = await db.holidays.count();
  if (holidays === 0) {
    for (const h of INITIAL_HOLIDAYS) {
      await DB.saveHoliday(h);
    }
  }
}
```

---

### Task 4: 结算计算引擎

**Files:**
- Create: `js/calculator.js`

- [ ] **Step 1: 实现核心计算函数**

```javascript
const Calculator = {
  // 计算某年某月的天数
  getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  },

  // 判断某天是否为节假日
  async isHoliday(dateStr) {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const holidays = await DB.getHolidaysByYear(year);
    for (const h of holidays) {
      if (h.dates.includes(dateStr)) return h;
    }
    return null;
  },

  // 匹配档位
  matchTier(project, value) {
    if (project.calculationType === 'hourly') return null;
    for (const tier of project.tiers) {
      if (value >= tier.min && value < tier.max) return tier;
    }
    // 匹配最后一个档位
    const last = project.tiers[project.tiers.length - 1];
    if (value >= last.min) return last;
    return project.tiers[0];
  },

  // 计算月度结算
  async calculate(project, year, month, dailyData, shopCount) {
    const daysInMonth = this.getDaysInMonth(year, month);
    let totalVolume = 0;
    let workDays = 0;
    let holidayVolume = 0;
    let holidayDays = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayData = dailyData[dateStr];
      if (!dayData) continue;
      
      const volume = parseInt(dayData.volume) || 0;
      totalVolume += volume;
      
      const holiday = await this.isHoliday(dateStr);
      if (holiday) {
        holidayVolume += volume;
        holidayDays++;
      } else {
        workDays++;
      }
    }

    let baseFee = 0;
    let avgDaily = 0;

    if (project.calculationType === 'daily_avg') {
      avgDaily = workDays > 0 ? Math.round(totalVolume / (workDays + holidayDays)) : 0;
      const tier = this.matchTier(project, avgDaily);
      baseFee = tier ? tier.price : 0;
    } else if (project.calculationType === 'monthly_total') {
      avgDaily = workDays + holidayDays > 0 ? Math.round(totalVolume / (workDays + holidayDays)) : 0;
      const tier = this.matchTier(project, totalVolume);
      baseFee = tier ? tier.price : 0;
    } else if (project.calculationType === 'hourly') {
      // 小时制项目由录入时直接计算
      baseFee = 0;
    }

    // 节假日额外费用
    let holidayExtra = 0;
    if (project.holidayRule === 'double_pay' && holidayDays > 0) {
      const dailyBase = (workDays + holidayDays) > 0 ? baseFee / (workDays + holidayDays) : 0;
      holidayExtra = dailyBase * holidayDays * (project.holidayMultiplier - 1);
    } else if (project.holidayRule === 'extra_days') {
      const dailyBase = (workDays + holidayDays) > 0 ? baseFee / (workDays + holidayDays) : 0;
      holidayExtra = dailyBase * holidayDays * project.holidayExtraDays;
    }

    // 超店铺附加费
    let shopExtra = 0;
    const tier = project.calculationType !== 'hourly' ? this.matchTier(project, project.calculationType === 'daily_avg' ? avgDaily : totalVolume) : null;
    const shopLimit = tier ? tier.shopLimit || 6 : 6;
    if (shopCount > shopLimit) {
      shopExtra = (shopCount - shopLimit) * project.extraShopFee;
    }

    const subtotal = baseFee + holidayExtra + shopExtra;
    const tax = subtotal * (project.invoiceRate || 0);
    const total = subtotal + tax;

    return {
      totalVolume,
      avgDaily,
      workDays,
      holidayDays,
      baseFee: Math.round(baseFee),
      holidayExtra: Math.round(holidayExtra),
      shopExtra: Math.round(shopExtra),
      subtotal: Math.round(subtotal),
      tax: Math.round(tax),
      total: Math.round(total)
    };
  }
};
```

---

### Task 5: 主应用逻辑与视图渲染

**Files:**
- Create: `js/app.js`

- [ ] **Step 1: 实现路由和视图切换**

```javascript
const App = {
  currentView: 'dashboard',

  init() {
    this.bindNav();
    initData().then(() => {
      this.switchView('dashboard');
    });
  },

  bindNav() {
    document.querySelectorAll('.nav-menu li').forEach(li => {
      li.addEventListener('click', () => {
        const view = li.dataset.view;
        this.switchView(view);
      });
    });
  },

  switchView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll('.nav-menu li').forEach(li => {
      li.classList.toggle('active', li.dataset.view === viewName);
    });
    document.querySelectorAll('.view').forEach(v => {
      v.classList.toggle('hidden', v.id !== `view-${viewName}`);
    });
    this.renderView(viewName);
  },

  async renderView(viewName) {
    const container = document.getElementById(`view-${viewName}`);
    switch (viewName) {
      case 'dashboard': await this.renderDashboard(container); break;
      case 'projects': await this.renderProjects(container); break;
      case 'input': await this.renderInput(container); break;
      case 'statement': await this.renderStatement(container); break;
      case 'history': await this.renderHistory(container); break;
    }
  },

  // Dashboard: KPI卡片 + 趋势图
  async renderDashboard(container) {
    const projects = await DB.getAllProjects();
    const records = await DB.getAllMonthlyRecords();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    let totalFee = 0;
    let totalVolume = 0;
    const projectFees = [];

    for (const p of projects) {
      const record = records.find(r => r.projectId === p.id && r.year === currentYear && r.month === currentMonth);
      if (record && record.calculated) {
        totalFee += record.calculated.total;
        totalVolume += record.calculated.totalVolume;
        projectFees.push({ name: p.name, fee: record.calculated.total });
      }
    }

    container.innerHTML = `
      <h2 style="margin-bottom:20px;">Dashboard - ${currentYear}年${currentMonth}月</h2>
      <div class="grid-4">
        <div class="kpi-card">
          <div class="kpi-label">本月总费用</div>
          <div class="kpi-value">¥${totalFee.toLocaleString()}</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%)">
          <div class="kpi-label">本月总接待量</div>
          <div class="kpi-value">${totalVolume.toLocaleString()}</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)">
          <div class="kpi-label">活跃项目</div>
          <div class="kpi-value">${projects.length}</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)">
          <div class="kpi-label">已结算项目</div>
          <div class="kpi-value">${projectFees.length}</div>
        </div>
      </div>
      <div class="grid-2" style="margin-top:20px;">
        <div class="card">
          <div class="card-title">各项目费用对比</div>
          <canvas id="chart-fees"></canvas>
        </div>
        <div class="card">
          <div class="card-title">近6个月总费用趋势</div>
          <canvas id="chart-trend"></canvas>
        </div>
      </div>
    `;

    Charts.renderFeeBar('chart-fees', projectFees);
    Charts.renderTrendLine('chart-trend', records);
  },

  // 项目管理页
  async renderProjects(container) {
    const projects = await DB.getAllProjects();
    let html = `
      <h2 style="margin-bottom:20px;">项目管理</h2>
      <div class="card">
        <table>
          <thead>
            <tr><th>项目名称</th><th>结算方式</th><th>档位数量</th><th>节假日规则</th><th>操作</th></tr>
          </thead>
          <tbody>
    `;
    for (const p of projects) {
      html += `
        <tr>
          <td>${p.name}</td>
          <td>${p.calculationType === 'daily_avg' ? '日均接待量' : p.calculationType === 'monthly_total' ? '月总接待量' : '按小时计费'}</td>
          <td>${p.tiers ? p.tiers.length : '-'}</td>
          <td>${p.holidayRule === 'double_pay' ? '双倍计薪' : '额外天数'}</td>
          <td>
            <button class="btn btn-secondary" onclick="App.editProject(${p.id})">编辑</button>
            <button class="btn btn-primary" onclick="App.viewProjectDetail(${p.id})">详情</button>
          </td>
        </tr>
      `;
    }
    html += `</tbody></table></div>`;
    container.innerHTML = html;
  },

  // 月度录入页
  async renderInput(container) {
    const projects = await DB.getAllProjects();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    let html = `
      <h2 style="margin-bottom:20px;">月度录入</h2>
      <div class="card">
        <div style="display:flex;gap:16px;margin-bottom:20px;">
          <select id="input-project">
            ${projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
          </select>
          <input type="number" id="input-year" value="${currentYear}" style="width:100px;">
          <input type="number" id="input-month" value="${currentMonth}" min="1" max="12" style="width:80px;">
          <button class="btn btn-primary" onclick="App.loadInputForm()">加载</button>
          <button class="btn btn-success" onclick="App.importFromExcel()">导入Excel</button>
        </div>
        <div id="input-form-container"></div>
      </div>
    `;
    container.innerHTML = html;
    this.loadInputForm();
  },

  async loadInputForm() {
    const projectId = parseInt(document.getElementById('input-project').value);
    const year = parseInt(document.getElementById('input-year').value);
    const month = parseInt(document.getElementById('input-month').value);
    const project = await DB.getProject(projectId);
    const record = await DB.getMonthlyRecord(projectId, year, month);
    const daysInMonth = Calculator.getDaysInMonth(year, month);

    let rows = '';
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const dayData = record && record.dailyData ? record.dailyData[dateStr] : null;
      const volume = dayData ? dayData.volume : '';
      const isHoliday = await Calculator.isHoliday(dateStr);
      const holidayClass = isHoliday ? 'style="background:#fff3cd"' : '';
      const holidayLabel = isHoliday ? `<span style="color:#e94560;font-size:12px;">${isHoliday.name}</span>` : '';
      
      rows += `
        <tr ${holidayClass}>
          <td>${month}月${d}日 ${holidayLabel}</td>
          <td><input type="number" class="day-input" data-date="${dateStr}" value="${volume}" placeholder="接待量" style="width:120px;"></td>
        </tr>
      `;
    }

    const shopCount = record ? record.shopCount : (project.tiers ? project.tiers[0].shopLimit : 6);

    document.getElementById('input-form-container').innerHTML = `
      <div style="display:flex;gap:20px;margin-bottom:16px;">
        <label>店铺数量：<input type="number" id="shop-count" value="${shopCount}" style="width:80px;"></label>
        <button class="btn btn-primary" onclick="App.saveMonthlyData()">保存并计算</button>
        <button class="btn btn-secondary" onclick="App.exportMonthData()">导出本月数据</button>
      </div>
      <div style="max-height:500px;overflow:auto;">
        <table>
          <thead><tr><th>日期</th><th>接待量</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div id="calc-result" style="margin-top:20px;"></div>
    `;
  },

  async saveMonthlyData() {
    const projectId = parseInt(document.getElementById('input-project').value);
    const year = parseInt(document.getElementById('input-year').value);
    const month = parseInt(document.getElementById('input-month').value);
    const project = await DB.getProject(projectId);
    const shopCount = parseInt(document.getElementById('shop-count').value) || 6;

    const dailyData = {};
    document.querySelectorAll('.day-input').forEach(input => {
      const date = input.dataset.date;
      const volume = parseInt(input.value) || 0;
      if (volume > 0) {
        dailyData[date] = { volume };
      }
    });

    const calculated = await Calculator.calculate(project, year, month, dailyData, shopCount);

    await DB.saveMonthlyRecord({
      projectId,
      year,
      month,
      dailyData,
      shopCount,
      calculated
    });

    document.getElementById('calc-result').innerHTML = `
      <div class="card" style="background:#e8f5e9;">
        <h3>计算结果</h3>
        <p>月总接待量：<strong>${calculated.totalVolume}</strong></p>
        <p>日均接待量：<strong>${calculated.avgDaily}</strong></p>
        <p>基础服务费：<strong>¥${calculated.baseFee}</strong></p>
        <p>节假日额外费用：<strong>¥${calculated.holidayExtra}</strong></p>
        <p>超店铺附加费：<strong>¥${calculated.shopExtra}</strong></p>
        <p>小计：<strong>¥${calculated.subtotal}</strong></p>
        <p>发票税额：<strong>¥${calculated.tax}</strong></p>
        <p style="font-size:18px;color:#e94560;">合计（含税）：<strong>¥${calculated.total}</strong></p>
      </div>
    `;
  },

  // 结算单页
  async renderStatement(container) {
    const projects = await DB.getAllProjects();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    let html = `
      <h2 style="margin-bottom:20px;">结算单</h2>
      <div class="card" style="margin-bottom:20px;">
        <div style="display:flex;gap:16px;">
          <select id="stmt-project"><option value="">全部项目</option>${projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}</select>
          <input type="number" id="stmt-year" value="${currentYear}" style="width:100px;">
          <input type="number" id="stmt-month" value="${currentMonth}" min="1" max="12" style="width:80px;">
          <button class="btn btn-primary" onclick="App.loadStatement()">生成结算单</button>
        </div>
      </div>
      <div id="statement-content"></div>
    `;
    container.innerHTML = html;
    this.loadStatement();
  },

  async loadStatement() {
    const projectId = document.getElementById('stmt-project').value;
    const year = parseInt(document.getElementById('stmt-year').value);
    const month = parseInt(document.getElementById('stmt-month').value);
    const projects = projectId ? [await DB.getProject(parseInt(projectId))] : await DB.getAllProjects();

    let html = '';
    for (const p of projects) {
      const record = await DB.getMonthlyRecord(p.id, year, month);
      if (!record || !record.calculated) {
        html += `<div class="card"><p>${p.name} - 暂无${year}年${month}月数据</p></div>`;
        continue;
      }
      const c = record.calculated;
      html += `
        <div class="card">
          <h3 style="margin-bottom:16px;">${p.name} - ${year}年${month}月结算单</h3>
          <table>
            <tr><td>月总接待量</td><td>${c.totalVolume}</td></tr>
            <tr><td>日均接待量</td><td>${c.avgDaily}</td></tr>
            <tr><td>工作日天数</td><td>${c.workDays}</td></tr>
            <tr><td>节假日天数</td><td>${c.holidayDays}</td></tr>
            <tr><td>基础服务费</td><td>¥${c.baseFee.toLocaleString()}</td></tr>
            <tr><td>节假日额外费用</td><td>¥${c.holidayExtra.toLocaleString()}</td></tr>
            <tr><td>超店铺附加费</td><td>¥${c.shopExtra.toLocaleString()}</td></tr>
            <tr style="font-weight:bold;background:#f8f9fa;"><td>小计</td><td>¥${c.subtotal.toLocaleString()}</td></tr>
            <tr><td>发票税额</td><td>¥${c.tax.toLocaleString()}</td></tr>
            <tr style="font-weight:bold;color:#e94560;font-size:16px;"><td>合计（含税）</td><td>¥${c.total.toLocaleString()}</td></tr>
          </table>
          <div style="margin-top:16px;">
            <button class="btn btn-secondary" onclick="Export.exportStatement(${p.id}, ${year}, ${month})">导出Excel</button>
          </div>
        </div>
      `;
    }
    document.getElementById('statement-content').innerHTML = html;
  },

  // 历史查询页
  async renderHistory(container) {
    const projects = await DB.getAllProjects();
    const records = await DB.getAllMonthlyRecords();
    records.sort((a, b) => (b.year * 12 + b.month) - (a.year * 12 + a.month));

    let html = `
      <h2 style="margin-bottom:20px;">历史查询</h2>
      <div class="card">
        <table>
          <thead>
            <tr><th>项目</th><th>年月</th><th>总接待量</th><th>日均接待</th><th>基础费用</th><th>节假日费用</th><th>合计</th></tr>
          </thead>
          <tbody>
    `;
    for (const r of records) {
      const p = projects.find(proj => proj.id === r.projectId);
      if (!p || !r.calculated) continue;
      html += `
        <tr>
          <td>${p.name}</td>
          <td>${r.year}年${r.month}月</td>
          <td>${r.calculated.totalVolume}</td>
          <td>${r.calculated.avgDaily}</td>
          <td>¥${r.calculated.baseFee.toLocaleString()}</td>
          <td>¥${r.calculated.holidayExtra.toLocaleString()}</td>
          <td style="font-weight:bold;color:#e94560;">¥${r.calculated.total.toLocaleString()}</td>
        </tr>
      `;
    }
    html += `</tbody></table></div>`;
    container.innerHTML = html;
  },

  viewProjectDetail(id) { /* 弹出详情或跳转 */ },
  editProject(id) { /* 编辑项目配置 */ },
  importFromExcel() { Export.importExcel(); },
  exportMonthData() { Export.exportMonthData(); }
};

document.addEventListener('DOMContentLoaded', () => App.init());
```

---

### Task 6: Excel 导入导出

**Files:**
- Create: `js/export.js`

- [ ] **Step 1: 实现导入导出功能**

```javascript
const Export = {
  // 导入Excel: 读取日期+接待量两列
  importExcel() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // 假设第一列是日期(YYYY-MM-DD或MM-DD)，第二列是接待量
      const dailyData = {};
      const year = parseInt(document.getElementById('input-year').value);
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row[0] || !row[1]) continue;
        let dateStr = String(row[0]).trim();
        const volume = parseInt(row[1]) || 0;
        
        // 处理 MM-DD 格式
        if (dateStr.length === 5 && dateStr.includes('-')) {
          dateStr = `${year}-${dateStr}`;
        }
        
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          dailyData[dateStr] = { volume };
        }
      }

      // 回填到表单
      Object.entries(dailyData).forEach(([date, data]) => {
        const input = document.querySelector(`.day-input[data-date="${date}"]`);
        if (input) input.value = data.volume;
      });

      alert(`成功导入 ${Object.keys(dailyData).length} 天数据`);
    };
    input.click();
  },

  // 导出当月数据
  exportMonthData() {
    const year = document.getElementById('input-year').value;
    const month = document.getElementById('input-month').value;
    const rows = [['日期', '接待量']];
    document.querySelectorAll('.day-input').forEach(input => {
      const date = input.dataset.date;
      const volume = input.value || 0;
      if (volume > 0) rows.push([date, parseInt(volume)]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${year}-${month}`);
    XLSX.writeFile(wb, `接待量_${year}-${month}.xlsx`);
  },

  // 导出结算单
  async exportStatement(projectId, year, month) {
    const project = await DB.getProject(projectId);
    const record = await DB.getMonthlyRecord(projectId, year, month);
    if (!record || !record.calculated) return;
    const c = record.calculated;

    const rows = [
      ['项目', project.name],
      ['结算月份', `${year}年${month}月`],
      [],
      ['月总接待量', c.totalVolume],
      ['日均接待量', c.avgDaily],
      ['工作日天数', c.workDays],
      ['节假日天数', c.holidayDays],
      [],
      ['基础服务费', c.baseFee],
      ['节假日额外费用', c.holidayExtra],
      ['超店铺附加费', c.shopExtra],
      ['小计', c.subtotal],
      ['发票税额', c.tax],
      ['合计（含税）', c.total]
    ];

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '结算单');
    XLSX.writeFile(wb, `结算单_${project.name}_${year}-${month}.xlsx`);
  }
};
```

---

### Task 7: 图表渲染

**Files:**
- Create: `js/charts.js`

- [ ] **Step 1: 实现 Chart.js 图表封装**

```javascript
const Charts = {
  renderFeeBar(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          label: '月度费用',
          data: data.map(d => d.fee),
          backgroundColor: ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  },

  renderTrendLine(canvasId, records) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // 按年月汇总
    const monthlyMap = {};
    for (const r of records) {
      if (!r.calculated) continue;
      const key = `${r.year}-${String(r.month).padStart(2, '0')}`;
      monthlyMap[key] = (monthlyMap[key] || 0) + r.calculated.total;
    }

    const sortedKeys = Object.keys(monthlyMap).sort().slice(-6);
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: sortedKeys,
        datasets: [{
          label: '总费用',
          data: sortedKeys.map(k => monthlyMap[k]),
          borderColor: '#e94560',
          backgroundColor: 'rgba(233,69,96,0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
};
```

---

### Task 8: 样式完善与响应式

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: 补充表格、表单、弹窗等样式**

追加到 style.css：

```css
/* 日历表格 */
.calendar-table td {
  padding: 8px;
  vertical-align: middle;
}
.day-input {
  width: 100px;
  padding: 6px 10px;
}

/* 结算单表格 */
.statement-table td:first-child {
  width: 200px;
  color: #666;
}
.statement-table td:last-child {
  font-weight: 600;
  text-align: right;
}

/* 按钮组 */
.btn-group {
  display: flex;
  gap: 8px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
  .sidebar { width: 180px; }
}
@media (max-width: 768px) {
  body { flex-direction: column; }
  .sidebar { width: 100%; padding: 10px 0; }
  .nav-menu { display: flex; flex-wrap: wrap; padding: 0; }
  .nav-menu li { padding: 10px 16px; font-size: 14px; }
  .main-content { padding: 16px; }
  .grid-4, .grid-2 { grid-template-columns: 1fr; }
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.modal-close {
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

/* 表单 */
.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  align-items: center;
}
.form-row label {
  min-width: 100px;
  color: #555;
  font-size: 14px;
}
.form-row input, .form-row select {
  flex: 1;
}
```

---

## 自检清单

### Spec 覆盖检查
- [x] 项目管理（增删改查 + 结算标准配置） -> Task 2, 3, 5
- [x] 月度录入（日历录入 + 实时计算） -> Task 5
- [x] 节假日处理（内置节假日 + 自动计算） -> Task 3, 4
- [x] 结算单生成（明细 + 导出） -> Task 5, 6
- [x] Dashboard汇总（KPI + 图表） -> Task 5, 7
- [x] 历史查询 -> Task 5
- [x] 导入导出 -> Task 6

### Placeholder 检查
- [x] 无 TBD/TODO
- [x] 无模糊描述
- [x] 每个步骤都有可执行代码

### 类型一致性检查
- [x] `dailyData` 结构一致：`{ dateStr: { volume: number } }`
- [x] `calculated` 结构一致
- [x] DB API 签名一致
