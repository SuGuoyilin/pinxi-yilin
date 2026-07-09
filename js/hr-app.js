/* ======================================================================
   hr-app.js — SG 人力管理系统核心逻辑
   ====================================================================== */

// ==================== 基础常量 ====================
var PROJECT_ORDER = ["综合","凯丰","宠物","拼吖","晨光","FIFA","贝因美","雪中飞","悦泰","拼席"];
var PINXI_JOINT_BRANDS = ["妲润","博思","讨师","森昊","益生菌"];
var PINXI_PROJECTS = ["拼席","博思-拼席","妲润-拼席","森昊-拼席","讨师-拼席"];
var STORAGE_KEY = 'suguo_dynamic_state_32ec0a1c-0000-0000-0000-000000000000';

var SHIFT_ORDER = ["","早","中","晚","通班","休","请假","旷工","培训"];
var PROJECT_TABS = ["综合","凯丰","宠物","拼吖","晨光","FIFA","贝因美","雪中飞","悦泰","拼席","讨师","博思","益生菌","妲润","森昊","厨房秤","雪中飞-私域","母婴"];

// 2026年节假日配置
var HOLIDAYS_2026 = {
  "2026-01-01": { name: "元旦", triple: false },
  "2026-02-16": { name: "除夕", triple: true },
  "2026-02-17": { name: "春节", triple: true },
  "2026-02-18": { name: "春节", triple: true },
  "2026-02-19": { name: "春节", triple: true },
  "2026-02-20": { name: "春节", triple: false },
  "2026-02-21": { name: "春节", triple: false },
  "2026-04-05": { name: "清明", triple: false },
  "2026-04-06": { name: "清明", triple: false },
  "2026-05-01": { name: "劳动节", triple: false },
  "2026-05-02": { name: "劳动节", triple: false },
  "2026-05-03": { name: "劳动节", triple: false },
  "2026-05-04": { name: "劳动节", triple: false },
  "2026-05-05": { name: "劳动节", triple: false },
  "2026-06-19": { name: "端午", triple: false },
  "2026-06-20": { name: "端午", triple: false },
  "2026-06-21": { name: "端午", triple: false },
  "2026-10-01": { name: "国庆", triple: false },
  "2026-10-02": { name: "国庆", triple: true },
  "2026-10-03": { name: "中秋", triple: true },
  "2026-10-04": { name: "国庆", triple: true },
  "2026-10-05": { name: "国庆", triple: false },
  "2026-10-06": { name: "国庆", triple: false },
  "2026-10-07": { name: "国庆", triple: false }
};

// 3倍薪资日期列表
var TRIPLE_PAY_DATES = [];
for (var d in HOLIDAYS_2026) {
  if (HOLIDAYS_2026[d].triple) TRIPLE_PAY_DATES.push(d);
}

// ==================== 默认员工数据 ====================
var DEFAULT_STAFF = [
  // 综合项目
  { id:"s001", name:"章林", project:"综合", role:"总负责人", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s002", name:"新月", project:"综合", role:"人事行政", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },

  // 凯丰项目
  { id:"s010", name:"夏磊", project:"凯丰", role:"主管", status:"离职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s011", name:"陶凯", project:"凯丰", role:"组长", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s012", name:"罗祥", project:"凯丰", role:"售后", status:"离职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s013", name:"陈仪", project:"凯丰", role:"售后", status:"离职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s014", name:"胡光磊", project:"凯丰", role:"售后", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s015", name:"多多", project:"凯丰", role:"售前", status:"在职", workMode:"居家", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s016", name:"张家兴", project:"凯丰", role:"售前", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },

  // 拼吖项目
  { id:"s020", name:"卡卡", project:"拼吖", role:"主管", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s021", name:"公举", project:"拼吖", role:"组长", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s022", name:"邓建山", project:"拼吖", role:"组长", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s023", name:"王子豪", project:"拼吖", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s024", name:"王自豪", project:"拼吖", role:"咨询", status:"在职", workMode:"居家", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s025", name:"赵茹", project:"拼吖", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s026", name:"孙素素", project:"拼吖", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s027", name:"黄淑慧", project:"拼吖", role:"咨询", status:"离职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s028", name:"刘梦涵", project:"拼吖", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s029", name:"张莉芳", project:"拼吖", role:"退款", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s030", name:"周书丞", project:"拼吖", role:"退款", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s031", name:"王清水", project:"拼吖", role:"退款", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s032", name:"凡凡", project:"拼吖", role:"退款", status:"离职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s033", name:"刘楚帆", project:"拼吖", role:"退款", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s034", name:"张聪", project:"拼吖", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s035", name:"赵明珠", project:"拼吖", role:"咨询", status:"离职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },

  // 宠物项目
  { id:"s040", name:"夏英", project:"宠物", role:"甲方", status:"在职", workMode:"居家", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s041", name:"蓝胖", project:"宠物", role:"主管", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s042", name:"杜甜甜", project:"宠物", role:"组长", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s043", name:"杨佳怡", project:"宠物", role:"咨询", status:"离职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s044", name:"张恩慈", project:"宠物", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s045", name:"孔静", project:"宠物", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s046", name:"王玉乃", project:"宠物", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s047", name:"李晓月", project:"宠物", role:"咨询", status:"在职", workMode:"居家", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s048", name:"尤景", project:"宠物", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s049", name:"杜忆凡", project:"宠物", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s050", name:"杨硕", project:"宠物", role:"3C专属", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },

  // 拼窝项目
  { id:"s055", name:"任梦", project:"拼席", role:"咨询", status:"在职", workMode:"居家", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s056", name:"阳文利", project:"拼席", role:"咨询", status:"在职", workMode:"居家", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s057", name:"孔芹", project:"拼席", role:"咨询", status:"在职", workMode:"居家", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },

  // 益生菌项目
  { id:"s060", name:"张娜娜", project:"益生菌", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },

  // 雪中飞项目
  { id:"s061", name:"任梦", project:"雪中飞", role:"咨询", status:"在职", workMode:"居家", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },

  // 悦泰项目
  { id:"s062", name:"任梦", project:"悦泰", role:"咨询", status:"在职", workMode:"居家", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s063", name:"孔芹", project:"悦泰", role:"咨询", status:"在职", workMode:"居家", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },

  // 晨光项目
  { id:"s070", name:"孟姿", project:"晨光", role:"主管", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s071", name:"小米", project:"晨光", role:"组长", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s072", name:"杜甜甜", project:"晨光", role:"组长", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s073", name:"张梦怡", project:"晨光", role:"咨询", status:"离职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s074", name:"朱雨涵", project:"晨光", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s075", name:"向连心雨", project:"晨光", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s076", name:"梅思情", project:"晨光", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s077", name:"付雨昕", project:"晨光", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s078", name:"李露", project:"晨光", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s079", name:"李东泽", project:"晨光", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s080", name:"郭子豪", project:"晨光", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s081", name:"孙一鸣", project:"晨光", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s082", name:"刘楚帆", project:"晨光", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s083", name:"张聪", project:"晨光", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s084", name:"李想", project:"晨光", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s085", name:"孙嘉悦", project:"晨光", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s086", name:"代玉茹", project:"晨光", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s087", name:"王燕", project:"晨光", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" },
  { id:"s088", name:"向连心", project:"晨光", role:"咨询", status:"在职", workMode:"坐班", trialBase:0, trialPerformance:0, regularBase:0, regularPerformance:0, entryDate:"", regularDate:"" }
];

// ==================== 全局状态 ====================
var state = {
  currentModule: 'staff',
  staffProject: '综合',
  staffMode: 'info',
  scheduleProject: '综合',
  schedulePeriod: '',
  scheduleSubpage: 'main',
  scheduleRemarksPeriod: '',
  scheduleSummaryPeriod: '',
  kpiProject: '综合',
  kpiMode: 'view',
  perfMode: 'exclusive',
  perfExProject: '综合',
  perfPxProject: '拼席',
  perfTmpProject: '综合',
  staff: [],
  salaryAdjustments: [],
  managers: [],
  scheduleRemarks: [],
  schedule: { people: [], dates: [] },
  projectConfigs: [],
  operations: [],
  monthlyFacts: []
};

// ==================== 工具函数 ====================
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }
function uniq(arr) { return arr.filter(function(v, i, a) { return a.indexOf(v) === i; }); }
function esc(s) { if (!s) return ''; var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function fmtMoney(n) {
  if (n === undefined || n === null || n === '') return '0.00';
  var num = parseFloat(n);
  if (isNaN(num)) return '0.00';
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function cls(el, className) {
  if (!el) return;
  if (el.classList) el.classList.toggle(className);
}

// 通知提示
var _noticeTimer = null;
function toast(msg, type) {
  var el = $('#noticeEl');
  if (!el) return;
  el.textContent = msg;
  el.className = 'hr-notice show ' + (type || 'success');
  clearTimeout(_noticeTimer);
  _noticeTimer = setTimeout(function() { el.className = 'hr-notice'; }, 2500);
}

// 确认弹窗
function showConfirm(title, message, onOk) {
  var overlay = document.createElement('div');
  overlay.className = 'hr-confirmOverlay';
  overlay.innerHTML =
    '<div class="hr-confirmBox">' +
    '<h3>' + esc(title) + '</h3>' +
    '<p>' + esc(message) + '</p>' +
    '<div class="confirm-btns">' +
    '<button class="hr-btn hr-btn-secondary" id="cfCancel">取消</button>' +
    '<button class="hr-btn hr-btn-primary" id="cfOk">确认</button>' +
    '</div></div>';
  document.body.appendChild(overlay);
  overlay.querySelector('#cfCancel').onclick = function() { document.body.removeChild(overlay); };
  overlay.querySelector('#cfOk').onclick = function() { document.body.removeChild(overlay); if (onOk) onOk(); };
  overlay.addEventListener('click', function(e) { if (e.target === overlay) document.body.removeChild(overlay); });
}

// 项目标准化
function normalizeProject(p) {
  if (!p) return '';
  p = p.trim();
  return p;
}

// 品牌名提取
function brandNameFromProject(proj) {
  if (!proj) return '';
  for (var i = 0; i < PINXI_JOINT_BRANDS.length; i++) {
    if (proj.indexOf(PINXI_JOINT_BRANDS[i]) === 0) return PINXI_JOINT_BRANDS[i];
  }
  return proj;
}

// 项目匹配
function projectMatch(staffProj, filterProj) {
  if (!filterProj || filterProj === '全部') return true;
  if (staffProj === filterProj) return true;
  // 拼席相关项目匹配
  if (filterProj === '拼席') {
    return PINXI_PROJECTS.indexOf(staffProj) >= 0 || staffProj === '拼席';
  }
  return false;
}

// 员工身份标准化
function normalizeStaffIdentity(s) {
  return (s ? s.name : '') + '_' + (s ? s.project : '');
}

// 日期解析
function parsePeriod(p) {
  if (!p) return null;
  var parts = p.split('-');
  return { year: parseInt(parts[0]) || 0, month: parseInt(parts[1]) || 0 };
}

// 获取月份天数
function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

// 周末天数
function weekendCount(year, month) {
  var days = daysInMonth(year, month);
  var count = 0;
  for (var d = 1; d <= days; d++) {
    var dt = new Date(year, month - 1, d);
    var dow = dt.getDay();
    if (dow === 0 || dow === 6) count++;
  }
  return count;
}

// 周末休息天数（排除法定节假日）
function weekendRestCount(year, month) {
  return weekendCount(year, month);
}

// 所有结算周期
function allPeriods() {
  var periods = [];
  var now = new Date();
  for (var i = -6; i <= 6; i++) {
    var d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    periods.push(y + '-' + (m < 10 ? '0' : '') + m);
  }
  return periods.sort();
}

// 最新周期
function latestPeriod() {
  var now = new Date();
  return now.getFullYear() + '-' + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1);
}

// 从入职日期解析月份
function parseMonthFromRegularDate(dateStr) {
  if (!dateStr) return null;
  var parts = dateStr.split('-');
  if (parts.length >= 2) return parts[0] + '-' + parts[1];
  return null;
}

// 判断是否在周期内转正
function isRegularInPeriod(staff, period) {
  if (!staff || !staff.regularDate || !period) return false;
  var staffMonth = parseMonthFromRegularDate(staff.regularDate);
  return staffMonth === period;
}

// 项目配置
function projectConfigFor(proj) {
  if (!state.projectConfigs) return {};
  for (var i = 0; i < state.projectConfigs.length; i++) {
    if (state.projectConfigs[i].project === proj) return state.projectConfigs[i];
  }
  return {};
}

// 应出勤天数
function expectedAttendanceDays(year, month) {
  var days = daysInMonth(year, month);
  var we = weekendCount(year, month);
  return days - we;
}

// 考勤积分
function attendanceCredit(shifts) {
  var work = 0, rest = 0, leave = 0, absent = 0, training = 0;
  if (!shifts || !shifts.length) return { work: work, rest: rest, leave: leave, absent: absent, training: training };
  for (var i = 0; i < shifts.length; i++) {
    var s = shifts[i];
    if (s === '早' || s === '中' || s === '晚' || s === '通班') work++;
    else if (s === '休') rest++;
    else if (s === '请假') leave++;
    else if (s === '旷工') absent++;
    else if (s === '培训') training++;
  }
  return { work: work, rest: rest, leave: leave, absent: absent, training: training };
}

// 班次工时
function shiftWorkHours(shift) {
  switch (shift) {
    case '早': return 8;
    case '中': return 8;
    case '晚': return 8;
    case '通班': return 16;
    case '培训': return 0;
    default: return 0;
  }
}

// 班次是否需要计工时（培训不计入）
function shiftNeedsHours(shift) {
  return shift === '早' || shift === '中' || shift === '晚' || shift === '通班';
}

// 班次对应的出勤天数（通班算2天，其他正常班次算1天）
function shiftAttendanceDays(shift) {
  if (shift === '通班') return 2;
  if (shift === '早' || shift === '中' || shift === '晚') return 1;
  return 0;
}

// 实际出勤天数
function actualAttendanceDays(shifts) {
  if (!shifts) return 0;
  var count = 0;
  for (var i = 0; i < shifts.length; i++) {
    if (shiftNeedsHours(shifts[i])) count++;
  }
  return count;
}

// 入职不足30天
function employedLessThan30Days(staff, period) {
  if (!staff || !staff.entryDate || !period) return false;
  var p = parsePeriod(period);
  if (!p) return false;
  var entryParts = staff.entryDate.split('-');
  var entryDate = new Date(parseInt(entryParts[0]), parseInt(entryParts[1]) - 1, parseInt(entryParts[2] || 1));
  var periodEnd = new Date(p.year, p.month, 0);
  var diffDays = (periodEnd - entryDate) / (1000 * 60 * 60 * 24);
  return diffDays < 30;
}

// 薪资键
function salaryKey(staff, period) {
  if (!staff || !period) return 'regularBase';
  if (staff.regularDate && parseMonthFromRegularDate(staff.regularDate) <= period) return 'regularBase';
  return 'trialBase';
}

// 调整值
function adjustmentFor(staffId, period, type) {
  if (!state.salaryAdjustments) return 0;
  for (var i = 0; i < state.salaryAdjustments.length; i++) {
    var a = state.salaryAdjustments[i];
    if (a.staffId === staffId && a.period === period && a.type === type) return a.amount || 0;
  }
  return 0;
}

// 工作模式选择HTML
function workModeSelect(current) {
  var opts = ['坐班', '居家'];
  var html = '<select onchange="updateStaffField(this)" data-field="workMode">';
  for (var i = 0; i < opts.length; i++) {
    html += '<option value="' + opts[i] + '"' + (current === opts[i] ? ' selected' : '') + '>' + opts[i] + '</option>';
  }
  html += '</select>';
  return html;
}

// 项目分组显示
function displayProjectGroup(proj) {
  if (!proj) return '';
  if (proj === '拼席') return '拼席';
  if (PINXI_PROJECTS.indexOf(proj) >= 0) return '拼席';
  return proj;
}

// 财务项目名
function financialProjectName(proj) {
  return proj || '未分配';
}

// 月度事实数据
function monthlyFactFor(proj, period) {
  if (!state.monthlyFacts) return {};
  for (var i = 0; i < state.monthlyFacts.length; i++) {
    var f = state.monthlyFacts[i];
    if (f.project === proj && f.period === period) return f;
  }
  return {};
}

// 排班周期列表
function schedulePeriods() {
  if (!state.schedule || !state.schedule.dates) return [];
  return uniq(state.schedule.dates.map(function(d) {
    return d.period;
  }).filter(Boolean)).sort();
}

// 最新排班周期
function latestSchedulePeriod() {
  var periods = schedulePeriods();
  return periods.length > 0 ? periods[periods.length - 1] : latestPeriod();
}

// 获取月份天数（别名）
function getDaysInMonth(yearMonth) {
  var p = parsePeriod(yearMonth);
  if (!p) return 30;
  return daysInMonth(p.year, p.month);
}

// 日期选择器
function openDatePicker(inputEl) {
  if (inputEl.type === 'month') inputEl.showPicker && inputEl.showPicker();
}

// 绑定日期选择器
function bindDatePickers() {
  // 自动绑定所有 month input
}

// 渲染选项滚动器
function renderOptionScroller(containerId, items, activeItem, onClickFn) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var html = '';
  for (var i = 0; i < items.length; i++) {
    var cls = items[i] === activeItem ? 'hr-os-item active' : 'hr-os-item';
    html += '<div class="' + cls + '" data-value="' + esc(items[i]) + '">' + esc(items[i]) + '</div>';
  }
  container.innerHTML = html;
  // 绑定事件
  var els = container.querySelectorAll('.hr-os-item');
  els.forEach(function(el) {
    el.addEventListener('click', function() {
      if (onClickFn) onClickFn(el.getAttribute('data-value'));
    });
  });
}

// 滚动选项条
function scrollOptionBar(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var activeEl = container.querySelector('.hr-os-item.active');
  if (activeEl) {
    activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

// ==================== 模块切换 ====================
function switchModule(mod) {
  state.currentModule = mod;
  // 不再调用 App.switchView，因为 App.renderView 已经在调用 switchModule
  // 根据模块渲染
  if (mod === 'staff') {
    renderStaffPillTabs();
    renderCurrentStaffView();
  } else if (mod === 'schedule') {
    renderSchedulePillTabs();
    renderCurrentScheduleView();
  } else if (mod === 'kpi') {
    renderKpiModule();
  } else if (mod === 'performance') {
    renderPerformanceModule();
  }
}

// ==================== 员工管理 ====================
function setStaffProject(proj) {
  state.staffProject = proj;
  renderStaffPillTabs();
  renderCurrentStaffView();
}

function setStaffMode(mode) {
  state.staffMode = mode;
  var stabs = document.querySelectorAll('#staffSubtabs .hr-stab');
  stabs.forEach(function(t, i) {
    var modes = ['info', 'salary', 'managers'];
    t.classList.toggle('active', modes[i] === mode);
  });
  // 面板显隐
  $('#staff-info-panel').style.display = mode === 'info' ? '' : 'none';
  $('#staff-salary-panel').style.display = mode === 'salary' ? '' : 'none';
  $('#staff-managers-panel').style.display = mode === 'managers' ? '' : 'none';
  renderCurrentStaffView();
}

function renderStaffPillTabs() {
  var projects = ['全部'];
  // 收集所有员工项目
  for (var i = 0; i < state.staff.length; i++) {
    var p = state.staff[i].project;
    if (projects.indexOf(p) < 0) projects.push(p);
  }
  // 按 PROJECT_ORDER 排序
  projects.sort(function(a, b) {
    var ai = PROJECT_ORDER.indexOf(a);
    var bi = PROJECT_ORDER.indexOf(b);
    if (ai < 0) ai = 999;
    if (bi < 0) bi = 999;
    return ai - bi;
  });
  // 确保"全部"始终在最前面
  if (projects[0] !== '全部') {
    var allIdx = projects.indexOf('全部');
    if (allIdx >= 0) projects.splice(allIdx, 1);
    projects.unshift('全部');
  }

  var html = '';
  for (var i = 0; i < projects.length; i++) {
    var cls = projects[i] === state.staffProject ? 'hr-pill active' : 'hr-pill';
    html += '<div class="' + cls + '" onclick="setStaffProject(\'' + esc(projects[i]) + '\')">' + esc(projects[i]) + '</div>';
  }
  $('#staffPillTabs').innerHTML = html;
}

function renderCurrentStaffView() {
  if (state.staffMode === 'info') renderStaffInfo();
  else if (state.staffMode === 'salary') renderStaffSalary();
  else if (state.staffMode === 'managers') renderStaffManagers();
}

function getFilteredStaff() {
  return state.staff.filter(function(s) {
    return projectMatch(s.project, state.staffProject);
  });
}

// 渲染员工基本信息
function renderStaffInfo() {
  var list = getFilteredStaff();
  var html = '<table><thead><tr>' +
    '<th>姓名</th><th>项目</th><th>角色</th><th>状态</th><th>工作模式</th><th>入职日期</th><th>转正日期</th><th>操作</th>' +
    '</tr></thead><tbody>';
  for (var i = 0; i < list.length; i++) {
    var s = list[i];
    var statusBadge = s.status === '在职' ? 'hr-badge hr-badge-green' : (s.status === '离职' ? 'hr-badge hr-badge-red' : 'hr-badge hr-badge-amber');
    html += '<tr data-id="' + esc(s.id) + '">' +
      '<td class="hr-cellEdit"><input value="' + esc(s.name) + '" onchange="updateStaffField(this)" data-field="name"></td>' +
      '<td class="hr-cellEdit"><input value="' + esc(s.project) + '" onchange="updateStaffField(this)" data-field="project"></td>' +
      '<td class="hr-cellEdit"><input value="' + esc(s.role) + '" onchange="updateStaffField(this)" data-field="role"></td>' +
      '<td><span class="' + statusBadge + '">' + esc(s.status) + '</span></td>' +
      '<td>' + workModeSelect(s.workMode) + '</td>' +
      '<td class="hr-cellEdit"><input type="date" value="' + esc(s.entryDate) + '" onchange="updateStaffField(this)" data-field="entryDate"></td>' +
      '<td class="hr-cellEdit"><input type="date" value="' + esc(s.regularDate) + '" onchange="updateStaffField(this)" data-field="regularDate"></td>' +
      '<td><button class="hr-miniBtn danger" onclick="deleteStaffRow(\'' + esc(s.id) + '\')" title="删除"><i class="fas fa-trash-can"></i></button></td>' +
      '</tr>';
  }
  if (list.length === 0) {
    html += '<tr><td colspan="8" class="empty-cell">暂无员工数据</td></tr>';
  }
  html += '</tbody></table>';
  $('#staffInfoTableWrap').innerHTML = html;
}

// 渲染薪资管理表格
function renderStaffSalary() {
  var list = getFilteredStaff();
  var period = latestPeriod();
  var html = '<table><thead><tr>' +
    '<th>姓名</th><th>项目</th><th>状态</th>' +
    '<th>试用期底薪</th><th>试用期绩效</th><th>转正底薪</th><th>转正绩效</th>' +
    '<th>应出勤</th><th>实际出勤</th><th>绩效分</th>' +
    '<th>补贴</th><th>扣罚</th><th>预支</th>' +
    '<th>计算薪资</th><th>计发薪资</th>' +
    '</tr></thead><tbody>';
  for (var i = 0; i < list.length; i++) {
    var s = list[i];
    var key = salaryKey(s, period);
    var base = s[key] || 0;
    var perfKey = key.replace('Base', 'Performance');
    var perf = s[perfKey] || 0;
    var p = parsePeriod(period);
    var expected = p ? expectedAttendanceDays(p.year, p.month) : 0;
    var subsidy = adjustmentFor(s.id, period, 'subsidy');
    var penalty = adjustmentFor(s.id, period, 'penalty');
    var advance = adjustmentFor(s.id, period, 'advance');
    var calcSalary = base + perf;
    var finalSalary = Math.max(0, calcSalary + subsidy - penalty - advance);
    var statusBadge = s.status === '在职' ? 'hr-badge hr-badge-green' : (s.status === '离职' ? 'hr-badge hr-badge-red' : 'hr-badge hr-badge-amber');

    html += '<tr data-id="' + esc(s.id) + '">' +
      '<td>' + esc(s.name) + '</td>' +
      '<td>' + esc(s.project) + '</td>' +
      '<td><span class="' + statusBadge + '">' + esc(s.status) + '</span></td>' +
      '<td><input class="hr-salaryInput" value="' + s.trialBase + '" onchange="updateStaffField(this)" data-field="trialBase"></td>' +
      '<td><input class="hr-salaryInput" value="' + s.trialPerformance + '" onchange="updateStaffField(this)" data-field="trialPerformance"></td>' +
      '<td><input class="hr-salaryInput" value="' + s.regularBase + '" onchange="updateStaffField(this)" data-field="regularBase"></td>' +
      '<td><input class="hr-salaryInput" value="' + s.regularPerformance + '" onchange="updateStaffField(this)" data-field="regularPerformance"></td>' +
      '<td>' + expected + '</td>' +
      '<td><input class="hr-salaryInput" value="0" onchange="updateStaffField(this)" data-field="actualAttendance"></td>' +
      '<td><input class="hr-salaryInput" value="0" onchange="updateStaffField(this)" data-field="performanceScore"></td>' +
      '<td><input class="hr-salaryInput" value="' + subsidy + '" onchange="updateStaffField(this)" data-field="subsidy"></td>' +
      '<td><input class="hr-salaryInput" value="' + penalty + '" onchange="updateStaffField(this)" data-field="penalty"></td>' +
      '<td><input class="hr-salaryInput" value="' + advance + '" onchange="updateStaffField(this)" data-field="advance"></td>' +
      '<td class="hr-pos">' + fmtMoney(calcSalary) + '</td>' +
      '<td class="hr-pos">' + fmtMoney(finalSalary) + '</td>' +
      '</tr>';
  }
  if (list.length === 0) {
    html += '<tr><td colspan="14" class="empty-cell">暂无数据</td></tr>';
  }
  html += '</tbody></table>';
  $('#staffSalaryTableWrap').innerHTML = html;
}

// 渲染管理架构
function renderStaffManagers() {
  var managers = state.staff.filter(function(s) {
    return s.role === '主管' || s.role === '总负责人' || s.role === '组长';
  });
  var html = '<table><thead><tr>' +
    '<th>姓名</th><th>项目</th><th>角色</th><th>分摊比例</th><th>分摊项目</th><th>操作</th>' +
    '</tr></thead><tbody>';
  for (var i = 0; i < managers.length; i++) {
    var m = managers[i];
    var alloc = (m.managementAllocation || 100);
    var allocProj = m.managementProject || m.project;
    html += '<tr data-id="' + esc(m.id) + '">' +
      '<td>' + esc(m.name) + '</td>' +
      '<td>' + esc(m.project) + '</td>' +
      '<td><span class="hr-badge hr-badge-accent">' + esc(m.role) + '</span></td>' +
      '<td><input class="hr-salaryInput" value="' + alloc + '" onchange="updateStaffField(this)" data-field="managementAllocation" style="width:50px;">%</td>' +
      '<td class="hr-cellEdit"><input value="' + esc(allocProj) + '" onchange="updateStaffField(this)" data-field="managementProject"></td>' +
      '<td><button class="hr-miniBtn danger" onclick="deleteStaffRow(\'' + esc(m.id) + '\')" title="删除"><i class="fas fa-trash-can"></i></button></td>' +
      '</tr>';
  }
  if (managers.length === 0) {
    html += '<tr><td colspan="6" class="empty-cell">暂无管理人员</td></tr>';
  }
  html += '</tbody></table>';
  $('#staffManagersTableWrap').innerHTML = html;
}

// 新增员工行
function addStaffRow() {
  var newId = 's' + Date.now();
  var newStaff = {
    id: newId,
    name: '新员工',
    project: state.staffProject === '全部' ? '' : state.staffProject,
    role: '咨询',
    status: '在职',
    workMode: '坐班',
    trialBase: 0,
    trialPerformance: 0,
    regularBase: 0,
    regularPerformance: 0,
    entryDate: '',
    regularDate: ''
  };
  state.staff.push(newStaff);
  renderCurrentStaffView();
  toast('已新增员工行', 'success');
}

// 删除员工行
function deleteStaffRow(id) {
  showConfirm('确认删除', '确定要删除该员工吗？此操作不可恢复。', function() {
    state.staff = state.staff.filter(function(s) { return s.id !== id; });
    renderCurrentStaffView();
    toast('已删除', 'success');
  });
}

// 更新员工字段
function updateStaffField(inputEl) {
  var field = inputEl.getAttribute('data-field');
  var row = inputEl.closest('tr');
  if (!row) return;
  var id = row.getAttribute('data-id');
  if (!id) return;
  var staff = state.staff.find(function(s) { return s.id === id; });
  if (!staff) return;
  staff[field] = inputEl.value;
}

// 保存员工修改
function saveStaffChanges() {
  // 读取所有输入框的最新值
  document.querySelectorAll('.hr-cellEdit input, .hr-cellEdit select, .hr-salaryInput').forEach(function(el) {
    var field = el.getAttribute('data-field');
    var row = el.closest('tr');
    if (!row || !field) return;
    var id = row.getAttribute('data-id');
    if (!id) return;
    var staff = state.staff.find(function(s) { return s.id === id; });
    if (staff) {
      if (field === 'trialBase' || field === 'trialPerformance' || field === 'regularBase' ||
          field === 'regularPerformance' || field === 'managementAllocation' ||
          field === 'subsidy' || field === 'penalty' || field === 'advance') {
        staff[field] = parseFloat(el.value) || 0;
      } else {
        staff[field] = el.value;
      }
    }
  });
  saveToLocal();
  toast('员工数据已保存', 'success');
}

// ==================== 排班明细 ====================
function setScheduleProject(proj) {
  state.scheduleProject = proj;
  renderSchedulePillTabs();
  renderCurrentScheduleView();
}

function setSchedulePeriod(period) {
  state.schedulePeriod = period;
  renderCurrentScheduleView();
}

function setScheduleSubpage(sub) {
  state.scheduleSubpage = sub;
  var stabs = document.querySelectorAll('#scheduleSubtabs .hr-stab');
  stabs.forEach(function(t, i) {
    var subs = ['main', 'remarks', 'summary'];
    t.classList.toggle('active', subs[i] === sub);
  });
  $('#sched-main-panel').style.display = sub === 'main' ? '' : 'none';
  $('#sched-remarks-panel').style.display = sub === 'remarks' ? '' : 'none';
  $('#sched-summary-panel').style.display = sub === 'summary' ? '' : 'none';
  renderCurrentScheduleView();
}

function setScheduleRemarksPeriod(period) {
  state.scheduleRemarksPeriod = period;
  renderScheduleRemarks();
}

function setScheduleSummaryPeriod(period) {
  state.scheduleSummaryPeriod = period;
  renderScheduleSummary();
}

function renderSchedulePillTabs() {
  var projects = ['全部'];
  for (var i = 0; i < PROJECT_TABS.length; i++) {
    projects.push(PROJECT_TABS[i]);
  }
  var html = '';
  for (var i = 0; i < projects.length; i++) {
    var cls = projects[i] === state.scheduleProject ? 'hr-pill active' : 'hr-pill';
    html += '<div class="' + cls + '" onclick="setScheduleProject(\'' + esc(projects[i]) + '\')">' + esc(projects[i]) + '</div>';
  }
  var containers = ['schedPillTabs', 'schedRemarksPillTabs', 'schedSummaryPillTabs'];
  containers.forEach(function(cid) {
    var el = document.getElementById(cid);
    if (el) el.innerHTML = html.replace(/onclick="setScheduleProject/g, 'onclick="setScheduleProject');
  });
}

function renderCurrentScheduleView() {
  if (state.scheduleSubpage === 'main') renderScheduleMain();
  else if (state.scheduleSubpage === 'remarks') renderScheduleRemarks();
  else if (state.scheduleSubpage === 'summary') renderScheduleSummary();
}

// 排班班次样式
function shiftClass(shift) {
  if (!shift) return 's-empty';
  return 's-' + shift;
}

function shiftDisplayText(shift) {
  return shift || '';
}

// 排班班次工时（从 SHIFT_ORDER 中的值获取）
function rotateShift(shift) {
  var idx = SHIFT_ORDER.indexOf(shift);
  if (idx < 0) idx = 0;
  idx = (idx + 1) % SHIFT_ORDER.length;
  return SHIFT_ORDER[idx];
}

function updateScheduleShift(staffId, dateKey) {
  var people = state.schedule.people;
  for (var i = 0; i < people.length; i++) {
    if (people[i].id === staffId) {
      if (!people[i].shifts) people[i].shifts = {};
      var current = people[i].shifts[dateKey] || '';
      people[i].shifts[dateKey] = rotateShift(current);
      break;
    }
  }
  renderScheduleMain();
  saveToLocal();
}

// 渲染排班主表
function renderScheduleMain() {
  // 填充周期选择器
  var periods = schedulePeriods();
  var select = $('#schedPeriodSelect');
  if (select && select.options.length === 0) {
    var defaultPeriods = allPeriods();
    for (var i = 0; i < defaultPeriods.length; i++) {
      var opt = document.createElement('option');
      opt.value = defaultPeriods[i];
      opt.textContent = defaultPeriods[i];
      if (defaultPeriods[i] === state.schedulePeriod) opt.selected = true;
      select.appendChild(opt);
    }
  }
  if (!state.schedulePeriod) {
    state.schedulePeriod = latestPeriod();
  }

  var period = state.schedulePeriod;
  var p = parsePeriod(period);
  if (!p) {
    $('#scheduleFreezeWrap').innerHTML = '<div style="padding:20px;color:var(--muted);">请选择月份</div>';
    return;
  }

  var year = p.year;
  var month = p.month;
  var days = daysInMonth(year, month);

  // 获取项目相关员工
  var filteredStaff = state.staff.filter(function(s) {
    return s.status !== '离职' && projectMatch(s.project, state.scheduleProject);
  });

  // 过滤排班人员
  var schedPeople = state.schedule.people.filter(function(sp) {
    if (sp.period !== period) return false;
    if (state.scheduleProject === '全部') return true;
    var staff = state.staff.find(function(s) { return s.id === sp.id; });
    return staff && projectMatch(staff.project, state.scheduleProject);
  });

  // 确保每个员工都有排班记录
  for (var i = 0; i < filteredStaff.length; i++) {
    var exists = schedPeople.find(function(sp) { return sp.id === filteredStaff[i].id; });
    if (!exists) {
      schedPeople.push({ id: filteredStaff[i].id, period: period, shifts: {}, selected: false });
      state.schedule.people.push({ id: filteredStaff[i].id, period: period, shifts: {}, selected: false });
    }
  }

  // 构建表格
  var html = '<table><thead><tr>';
  html += '<th class="freeze-col th-freeze" style="min-width:28px;"><input type="checkbox" onchange="toggleAllScheduleRows(this)"></th>';
  html += '<th class="freeze-col th-freeze" style="min-width:40px;">项目</th>';
  html += '<th class="freeze-col th-freeze" style="min-width:50px;">姓名</th>';

  // 日期列
  for (var d = 1; d <= days; d++) {
    var dt = new Date(year, month - 1, d);
    var dow = dt.getDay();
    var dowText = ['日', '一', '二', '三', '四', '五', '六'][dow];
    var dateStr = year + '-' + (month < 10 ? '0' : '') + month + '-' + (d < 10 ? '0' : '') + d;
    var holidayInfo = HOLIDAYS_2026[dateStr];
    var isHoliday = !!holidayInfo;
    var isWeekend = dow === 0 || dow === 6;
    var colorStyle = '';
    if (isHoliday) colorStyle = 'color:#c62828;';
    else if (isWeekend) colorStyle = 'color:#e65100;';

    html += '<th style="min-width:24px;' + colorStyle + '">';
    html += d + '<br><span style="font-size:9px;font-weight:normal;">' + dowText;
    if (isHoliday) html += '<br>' + holidayInfo.name;
    html += '</span></th>';
  }
  html += '<th class="freeze-right th-freeze-right" style="min-width:32px;">工时</th>';
  html += '<th class="freeze-right th-freeze-right" style="min-width:32px;">出勤</th>';
  html += '</tr></thead><tbody>';

  for (var i = 0; i < schedPeople.length; i++) {
    var sp = schedPeople[i];
    var staff = state.staff.find(function(s) { return s.id === sp.id; });
    if (!staff) continue;

    html += '<tr data-sid="' + esc(sp.id) + '">';
    html += '<td class="freeze-col"><input type="checkbox" data-sid="' + esc(sp.id) + '" class="sched-check"></td>';
    html += '<td class="freeze-col">' + esc(staff.project) + '</td>';
    html += '<td class="freeze-col">' + esc(staff.name) + '</td>';

    var totalHours = 0;
    var attendDays = 0;

    for (var d = 1; d <= days; d++) {
      var dateKey = year + '-' + (month < 10 ? '0' : '') + month + '-' + (d < 10 ? '0' : '') + d;
      var shift = (sp.shifts && sp.shifts[dateKey]) || '';
      var cls = shiftClass(shift);
      var hours = shiftWorkHours(shift);

      html += '<td class="sched-cell ' + cls + '" onclick="updateScheduleShift(\'' + esc(sp.id) + '\',\'' + dateKey + '\')">' + shiftDisplayText(shift) + '</td>';

      totalHours += hours;
      attendDays += shiftAttendanceDays(shift);
    }
    html += '<td class="freeze-right">' + totalHours + '</td>';
    html += '<td class="freeze-right">' + attendDays + '</td>';
    html += '</tr>';
  }

  if (schedPeople.length === 0) {
    html += '<tr><td colspan="' + (days + 6) + '" class="empty-cell">暂无排班数据</td></tr>';
  }

  html += '</tbody></table>';
  $('#scheduleFreezeWrap').innerHTML = html;
}

function toggleAllScheduleRows(cb) {
  var checks = document.querySelectorAll('.sched-check');
  checks.forEach(function(c) { c.checked = cb.checked; });
}

function addScheduleRow() {
  if (!state.schedulePeriod) { toast('请先选择月份', 'warn'); return; }
  // 获取当前项目下的在职员工（排除已在排班中的）
  var currentProject = state.scheduleProject || '全部';
  var existingIds = state.schedule.people
    .filter(function(sp) { return sp.period === state.schedulePeriod; })
    .map(function(sp) { return sp.id; });
  var availableStaff = state.staff.filter(function(s) {
    if (s.status === '离职') return false;
    if (existingIds.indexOf(s.id) >= 0) return false;
    if (currentProject !== '全部' && s.project !== currentProject) return false;
    return true;
  });
  if (availableStaff.length === 0) {
    toast('当前项目下没有可添加的在职员工', 'warn');
    return;
  }
  // 构建下拉选项
  var optionsHtml = '<option value="">请选择员工</option>';
  for (var i = 0; i < availableStaff.length; i++) {
    optionsHtml += '<option value="' + esc(availableStaff[i].id) + '">' + esc(availableStaff[i].name) + '（' + esc(availableStaff[i].project) + '）</option>';
  }
  // 弹出选择对话框
  var overlay = document.createElement('div');
  overlay.className = 'hr-confirmOverlay';
  overlay.innerHTML =
    '<div class="hr-confirmBox" style="text-align:left;">' +
    '<h3 style="text-align:center;">新增排班行</h3>' +
    '<div style="margin-bottom:16px;">' +
    '<label style="display:block;font-size:12px;color:var(--hr-muted);margin-bottom:6px;">选择员工：</label>' +
    '<select id="addRowStaffSelect" style="width:100%;padding:8px;border:1px solid var(--hr-line);border-radius:6px;font-size:13px;">' + optionsHtml + '</select>' +
    '</div>' +
    '<div class="confirm-btns" style="justify-content:flex-end;">' +
    '<button class="hr-btn hr-btn-secondary" id="cfCancel">取消</button>' +
    '<button class="hr-btn hr-btn-primary" id="cfOk">确认添加</button>' +
    '</div></div>';
  document.body.appendChild(overlay);
  overlay.querySelector('#cfCancel').onclick = function() { document.body.removeChild(overlay); };
  overlay.querySelector('#cfOk').onclick = function() {
    var select = overlay.querySelector('#addRowStaffSelect');
    var staffId = select.value;
    if (!staffId) { toast('请先选择员工', 'warn'); return; }
    var staff = state.staff.find(function(s) { return s.id === staffId; });
    if (!staff) { document.body.removeChild(overlay); return; }
    state.schedule.people.push({
      id: staff.id,
      period: state.schedulePeriod,
      shifts: {},
      selected: false
    });
    document.body.removeChild(overlay);
    renderScheduleMain();
    saveToLocal();
    toast('已添加 ' + staff.name, 'success');
  };
  overlay.addEventListener('click', function(e) { if (e.target === overlay) document.body.removeChild(overlay); });
}

function deleteScheduleRow(id) {
  state.schedule.people = state.schedule.people.filter(function(sp) {
    return !(sp.id === id && sp.period === state.schedulePeriod);
  });
  renderScheduleMain();
  saveToLocal();
}

function batchDeleteScheduleRows() {
  var checks = document.querySelectorAll('.sched-check:checked');
  if (checks.length === 0) { toast('请先勾选要删除的行', 'warn'); return; }
  showConfirm('批量删除', '确定删除选中的 ' + checks.length + ' 行排班数据？', function() {
    var ids = [];
    checks.forEach(function(c) { ids.push(c.getAttribute('data-sid')); });
    state.schedule.people = state.schedule.people.filter(function(sp) {
      return ids.indexOf(sp.id) < 0 || sp.period !== state.schedulePeriod;
    });
    renderScheduleMain();
    saveToLocal();
    toast('已删除 ' + ids.length + ' 行', 'success');
  });
}

function addScheduleMonth() {
  // 构建月份选择器弹窗
  var now = new Date();
  var currentYear = now.getFullYear();
  var currentMonth = now.getMonth() + 1;
  var optionsHtml = '';
  for (var y = currentYear; y <= currentYear + 1; y++) {
    for (var m = 1; m <= 12; m++) {
      if (y === currentYear && m < currentMonth - 1) continue;
      if (y === currentYear + 1 && m > 12) break;
      var val = y + '-' + (m < 10 ? '0' : '') + m;
      optionsHtml += '<option value="' + val + '">' + val + '</option>';
    }
  }
  var overlay = document.createElement('div');
  overlay.className = 'hr-confirmOverlay';
  overlay.innerHTML =
    '<div class="hr-confirmBox" style="text-align:left;">' +
    '<h3 style="text-align:center;">新增排班月份</h3>' +
    '<div style="margin-bottom:16px;">' +
    '<label style="display:block;font-size:12px;color:var(--hr-muted);margin-bottom:6px;">选择月份：</label>' +
    '<select id="addMonthSelect" style="width:100%;padding:8px;border:1px solid var(--hr-line);border-radius:6px;font-size:13px;">' + optionsHtml + '</select>' +
    '</div>' +
    '<div class="confirm-btns" style="justify-content:flex-end;">' +
    '<button class="hr-btn hr-btn-secondary" id="cfCancel">取消</button>' +
    '<button class="hr-btn hr-btn-primary" id="cfOk">确认</button>' +
    '</div></div>';
  document.body.appendChild(overlay);
  overlay.querySelector('#cfCancel').onclick = function() { document.body.removeChild(overlay); };
  overlay.querySelector('#cfOk').onclick = function() {
    var period = overlay.querySelector('#addMonthSelect').value;
    if (!period) { toast('请选择月份', 'warn'); return; }
    // 初始化该月份的排班数据
    var existing = state.schedule.people.find(function(sp) { return sp.period === period; });
    if (existing) {
      document.body.removeChild(overlay);
      toast('月份 ' + period + ' 已存在', 'warn');
      return;
    }
    var filteredStaff = state.staff.filter(function(s) { return s.status !== '离职'; });
    for (var i = 0; i < filteredStaff.length; i++) {
      state.schedule.people.push({
        id: filteredStaff[i].id,
        period: period,
        shifts: {},
        selected: false
      });
    }
    state.schedulePeriod = period;
    document.body.removeChild(overlay);
    // 刷新选择器
    var select = $('#schedPeriodSelect');
    if (select) {
      var exists = false;
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value === period) { exists = true; break; }
      }
      if (!exists) {
        var opt = document.createElement('option');
        opt.value = period;
        opt.textContent = period;
        select.appendChild(opt);
      }
      select.value = period;
    }
    renderScheduleMain();
    saveToLocal();
    toast('已新增月份 ' + period, 'success');
  };
  overlay.addEventListener('click', function(e) { if (e.target === overlay) document.body.removeChild(overlay); });
}

function deleteScheduleMonth() {
  if (!state.schedulePeriod) { toast('请先选择月份', 'warn'); return; }
  showConfirm('删除月份', '确定删除 ' + state.schedulePeriod + ' 的所有排班数据？', function() {
    state.schedule.people = state.schedule.people.filter(function(sp) {
      return sp.period !== state.schedulePeriod;
    });
    renderScheduleMain();
    saveToLocal();
    toast('已删除月份排班', 'success');
  });
}

// 渲染排班备注
function renderScheduleRemarks() {
  var select = $('#schedRemarksPeriodSelect');
  if (select && select.options.length === 0) {
    var periods = allPeriods();
    for (var i = 0; i < periods.length; i++) {
      var opt = document.createElement('option');
      opt.value = periods[i];
      opt.textContent = periods[i];
      select.appendChild(opt);
    }
    select.value = state.scheduleRemarksPeriod || latestPeriod();
  }
  if (!state.scheduleRemarksPeriod) state.scheduleRemarksPeriod = latestPeriod();

  var remarks = (state.scheduleRemarks || []).filter(function(r) {
    return r.period === state.scheduleRemarksPeriod;
  });

  var html = '<table><thead><tr>' +
    '<th>日期</th><th>员工姓名</th><th>备注内容</th><th>类型</th><th>时长(h)</th><th>操作</th>' +
    '</tr></thead><tbody>';
  for (var i = 0; i < remarks.length; i++) {
    var r = remarks[i];
    var isOvertime = r.type === '加班';
    html += '<tr>' +
      '<td class="hr-cellEdit"><input value="' + esc(r.date) + '" onchange="updateRemarkField(this,' + i + ',\'date\')"></td>' +
      '<td class="hr-cellEdit"><input value="' + esc(r.name) + '" onchange="updateRemarkField(this,' + i + ',\'name\')"></td>' +
      '<td class="hr-cellEdit"><input value="' + esc(r.content) + '" onchange="updateRemarkField(this,' + i + ',\'content\')"></td>' +
      '<td class="hr-cellEdit"><select onchange="updateRemarkField(this,' + i + ',\'type\')">' +
      '<option' + (r.type === '请假' ? ' selected' : '') + '>请假</option>' +
      '<option' + (r.type === '调休' ? ' selected' : '') + '>调休</option>' +
      '<option' + (r.type === '加班' ? ' selected' : '') + '>加班</option>' +
      '<option' + (r.type === '其他' ? ' selected' : '') + '>其他</option>' +
      '</select></td>' +
      '<td class="hr-cellEdit">' + (isOvertime ?
        '<input type="number" min="0" step="0.5" value="' + (r.hours || 0) + '" onchange="updateRemarkField(this,' + i + ',\'hours\')" style="width:50px;text-align:right;">' :
        '<span style="color:var(--hr-muted);">—</span>') + '</td>' +
      '<td><button class="hr-miniBtn danger" onclick="deleteRemark(' + i + ')"><i class="fas fa-trash-can"></i></button></td>' +
      '</tr>';
  }
  if (remarks.length === 0) {
    html += '<tr><td colspan="6" class="empty-cell">暂无备注</td></tr>';
  }
  html += '</tbody></table>';
  $('#scheduleRemarksTableWrap').innerHTML = html;
}

function addScheduleRemark() {
  state.scheduleRemarks = state.scheduleRemarks || [];
  state.scheduleRemarks.push({
    period: state.scheduleRemarksPeriod,
    date: '',
    name: '',
    content: '',
    type: '其他'
  });
  renderScheduleRemarks();
}

function updateRemarkField(el, idx, field) {
  if (!state.scheduleRemarks || !state.scheduleRemarks[idx]) return;
  state.scheduleRemarks[idx][field] = el.value;
  saveToLocal();
}

function deleteRemark(idx) {
  var period = state.scheduleRemarksPeriod;
  var allRemarks = state.scheduleRemarks || [];
  var periodRemarks = allRemarks.filter(function(r) { return r.period === period; });
  var target = periodRemarks[idx];
  if (!target) return;
  var globalIdx = allRemarks.indexOf(target);
  allRemarks.splice(globalIdx, 1);
  state.scheduleRemarks = allRemarks;
  renderScheduleRemarks();
  saveToLocal();
}

// 渲染综合汇总
function renderScheduleSummary() {
  var select = $('#schedSummaryPeriodSelect');
  if (select && select.options.length === 0) {
    var periods = allPeriods();
    for (var i = 0; i < periods.length; i++) {
      var opt = document.createElement('option');
      opt.value = periods[i];
      opt.textContent = periods[i];
      select.appendChild(opt);
    }
    select.value = state.scheduleSummaryPeriod || latestPeriod();
  }
  if (!state.scheduleSummaryPeriod) state.scheduleSummaryPeriod = latestPeriod();

  var period = state.scheduleSummaryPeriod;
  var p = parsePeriod(period);
  if (!p) {
    $('#scheduleSummaryTableWrap').innerHTML = '<div style="padding:20px;color:var(--muted);">请选择月份</div>';
    return;
  }

  var year = p.year;
  var month = p.month;
  var days = daysInMonth(year, month);

  // 获取该月排班
  var schedPeople = state.schedule.people.filter(function(sp) { return sp.period === period; });

  // 获取该月加班备注（按员工汇总）
  var periodRemarks = (state.scheduleRemarks || []).filter(function(r) {
    return r.period === period && r.type === '加班';
  });
  var overtimeMap = {};
  for (var ri = 0; ri < periodRemarks.length; ri++) {
    var rr = periodRemarks[ri];
    if (!overtimeMap[rr.name]) overtimeMap[rr.name] = 0;
    overtimeMap[rr.name] += parseFloat(rr.hours) || 0;
  }

  // 获取该月调休备注（按员工统计次数）
  var leaveRemarks = (state.scheduleRemarks || []).filter(function(r) {
    return r.period === period && r.type === '调休';
  });
  var leaveRemarkMap = {};
  for (var ri = 0; ri < leaveRemarks.length; ri++) {
    var lr = leaveRemarks[ri];
    if (!leaveRemarkMap[lr.name]) leaveRemarkMap[lr.name] = 0;
    leaveRemarkMap[lr.name]++;
  }

  var html = '<table><thead><tr>' +
    '<th>姓名</th><th>项目</th><th>应出勤</th><th>休息</th><th>请假</th><th>旷工</th>' +
    '<th>培训</th><th>加班(h)</th><th>调休</th><th>实际出勤</th>' +
    '</tr></thead><tbody>';

  for (var i = 0; i < schedPeople.length; i++) {
    var sp = schedPeople[i];
    var staff = state.staff.find(function(s) { return s.id === sp.id; });
    if (!staff) continue;

    var shifts = [];
    for (var d = 1; d <= days; d++) {
      var dateKey = year + '-' + (month < 10 ? '0' : '') + month + '-' + (d < 10 ? '0' : '') + d;
      shifts.push((sp.shifts && sp.shifts[dateKey]) || '');
    }

    var credit = attendanceCredit(shifts);
    var expected = expectedAttendanceDays(year, month);
    var actual = actualAttendanceDays(shifts);
    var overtimeHours = overtimeMap[staff.name] || 0;
    var adjustLeave = leaveRemarkMap[staff.name] || 0;

    html += '<tr>' +
      '<td>' + esc(staff.name) + '</td>' +
      '<td>' + esc(staff.project) + '</td>' +
      '<td>' + expected + '</td>' +
      '<td>' + credit.rest + '</td>' +
      '<td>' + credit.leave + '</td>' +
      '<td class="hr-neg">' + credit.absent + '</td>' +
      '<td>' + credit.training + '</td>' +
      '<td class="hr-pos">' + (overtimeHours > 0 ? overtimeHours : '0') + '</td>' +
      '<td>' + adjustLeave + '</td>' +
      '<td class="hr-pos">' + actual + '</td>' +
      '</tr>';
  }

  if (schedPeople.length === 0) {
    html += '<tr><td colspan="10" class="empty-cell">暂无汇总数据</td></tr>';
  }

  html += '</tbody></table>';
  $('#scheduleSummaryTableWrap').innerHTML = html;
}

// ==================== 绩效管理 ====================
function setKpiMode(mode) {
  state.kpiMode = mode;
  var stabs = document.querySelectorAll('#kpiSubtabs .hr-stab');
  stabs.forEach(function(t, i) {
    var modes = ['view', 'config'];
    t.classList.toggle('active', modes[i] === mode);
  });
  $('#kpi-view-panel').style.display = mode === 'view' ? '' : 'none';
  $('#kpi-config-panel').style.display = mode === 'config' ? '' : 'none';
  renderKpiModule();
}

function setKpiProject(proj) {
  state.kpiProject = proj;
  renderKpiModule();
}

function renderKpiModule() {
  // 渲染项目选项
  renderOptionScroller('kpiOptionScroller', PROJECT_TABS, state.kpiProject, setKpiProject);
  renderOptionScroller('kpiConfigOptionScroller', PROJECT_TABS, state.kpiProject, setKpiProject);
  scrollOptionBar('kpiOptionScroller');
  scrollOptionBar('kpiConfigOptionScroller');

  // 填充周期
  var select = $('#kpiPeriodSelect');
  if (select && select.options.length === 0) {
    var periods = allPeriods();
    for (var i = 0; i < periods.length; i++) {
      var opt = document.createElement('option');
      opt.value = periods[i];
      opt.textContent = periods[i];
      select.appendChild(opt);
    }
    select.value = latestPeriod();
  }

  if (state.kpiMode === 'view') {
    renderKpiManager();
  } else {
    renderKpiConfig();
  }
}

// 查看指标
function renderKpiManager() {
  var period = $('#kpiPeriodSelect') ? $('#kpiPeriodSelect').value : latestPeriod();
  var config = projectConfigFor(state.kpiProject);
  var kpis = config.kpis || [];

  var area = $('#kpiViewArea');
  if (!area) return;

  if (kpis.length === 0) {
    area.innerHTML = '<div class="hr-card"><div class="hr-hint"><i class="fas fa-circle-info"></i> 当前项目暂无绩效指标配置，请在"配置指标"中添加</div></div>';
    return;
  }

  var html = '<div class="hr-kpi-table-wrap"><table><thead><tr>' +
    '<th>指标名称</th><th>指标类型</th><th>权重</th><th>目标值</th><th>实际值</th><th>完成率</th><th>得分</th>' +
    '</tr></thead><tbody>';
  for (var i = 0; i < kpis.length; i++) {
    var k = kpis[i];
    var actual = k.actual || 0;
    var target = k.target || 0;
    var rate = target > 0 ? (actual / target * 100).toFixed(1) : '0.0';
    var score = (rate * (k.weight || 0) / 100).toFixed(1);
    var rateClass = parseFloat(rate) >= 100 ? 'hr-pos' : (parseFloat(rate) >= 80 ? '' : 'hr-neg');
    html += '<tr>' +
      '<td>' + esc(k.name) + '</td>' +
      '<td>' + esc(k.type || '数量') + '</td>' +
      '<td>' + (k.weight || 0) + '%</td>' +
      '<td>' + fmtMoney(target) + '</td>' +
      '<td class="hr-cellEdit"><input value="' + actual + '" onchange="updateKpiActual(this,' + i + ')"></td>' +
      '<td class="' + rateClass + '">' + rate + '%</td>' +
      '<td class="hr-pos">' + score + '</td>' +
      '</tr>';
  }
  html += '</tbody></table></div>';
  area.innerHTML = html;
}

function updateKpiActual(el, idx) {
  var config = projectConfigFor(state.kpiProject);
  if (!config || !config.kpis || !config.kpis[idx]) return;
  config.kpis[idx].actual = parseFloat(el.value) || 0;
  saveToLocal();
}

// 配置指标
function renderKpiConfig() {
  var config = projectConfigFor(state.kpiProject);
  if (!config.kpis) config.kpis = [];
  var kpis = config.kpis;

  var html = '<table><thead><tr>' +
    '<th>指标名称</th><th>指标类型</th><th>权重(%)</th><th>目标值</th><th>计算方式</th><th>操作</th>' +
    '</tr></thead><tbody>';
  for (var i = 0; i < kpis.length; i++) {
    var k = kpis[i];
    html += '<tr>' +
      '<td class="hr-cellEdit"><input value="' + esc(k.name) + '" onchange="updateKpiConfigField(this,' + i + ',\'name\')"></td>' +
      '<td class="hr-cellEdit"><select onchange="updateKpiConfigField(this,' + i + ',\'type\')">' +
      '<option' + (k.type === '数量' ? ' selected' : '') + '>数量</option>' +
      '<option' + (k.type === '金额' ? ' selected' : '') + '>金额</option>' +
      '<option' + (k.type === '比率' ? ' selected' : '') + '>比率</option>' +
      '<option' + (k.type === '时长' ? ' selected' : '') + '>时长</option>' +
      '</select></td>' +
      '<td class="hr-cellEdit"><input value="' + (k.weight || 0) + '" onchange="updateKpiConfigField(this,' + i + ',\'weight\')" style="width:60px;"></td>' +
      '<td class="hr-cellEdit"><input value="' + (k.target || 0) + '" onchange="updateKpiConfigField(this,' + i + ',\'target\')"></td>' +
      '<td class="hr-cellEdit"><select onchange="updateKpiConfigField(this,' + i + ',\'method\')">' +
      '<option' + (k.method === '直接' ? ' selected' : '') + '>直接</option>' +
      '<option' + (k.method === '公式' ? ' selected' : '') + '>公式</option>' +
      '</select></td>' +
      '<td><button class="hr-miniBtn danger" onclick="deleteKpiConfigRow(' + i + ')"><i class="fas fa-trash-can"></i></button></td>' +
      '</tr>';
  }
  if (kpis.length === 0) {
    html += '<tr><td colspan="6" class="empty-cell">暂无指标，请手动添加或上传Excel</td></tr>';
  }
  html += '</tbody></table>';
  $('#kpiConfigTableWrap').innerHTML = html;
}

function addKpiConfigRow() {
  var config = projectConfigFor(state.kpiProject);
  if (!config) {
    config = { project: state.kpiProject, kpis: [] };
    state.projectConfigs.push(config);
  }
  if (!config.kpis) config.kpis = [];
  config.kpis.push({ name: '新指标', type: '数量', weight: 0, target: 0, actual: 0, method: '直接' });
  renderKpiConfig();
  toast('已添加新指标', 'success');
}

function deleteKpiConfigRow(idx) {
  var config = projectConfigFor(state.kpiProject);
  if (!config || !config.kpis) return;
  config.kpis.splice(idx, 1);
  renderKpiConfig();
  saveToLocal();
}

function updateKpiConfigField(el, idx, field) {
  var config = projectConfigFor(state.kpiProject);
  if (!config || !config.kpis || !config.kpis[idx]) return;
  if (field === 'weight' || field === 'target') {
    config.kpis[idx][field] = parseFloat(el.value) || 0;
  } else {
    config.kpis[idx][field] = el.value;
  }
  saveToLocal();
}

// KPI Excel上传
function handleKpiFileUpload(input) {
  var file = input.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = new Uint8Array(e.target.result);
      var workbook = parseWorkbook(data);
      if (!workbook) {
        toast('无法解析文件', 'error');
        return;
      }
      var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      var jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
      if (jsonData.length === 0) {
        toast('文件中没有数据', 'error');
        return;
      }

      var config = projectConfigFor(state.kpiProject);
      if (!config) {
        config = { project: state.kpiProject, kpis: [] };
        state.projectConfigs.push(config);
      }
      if (!config.kpis) config.kpis = [];

      // 解析行数据
      for (var i = 0; i < jsonData.length; i++) {
        var row = jsonData[i];
        config.kpis.push({
          name: row['指标名称'] || row['name'] || '未命名',
          type: row['指标类型'] || row['type'] || '数量',
          weight: parseFloat(row['权重'] || row['weight']) || 0,
          target: parseFloat(row['目标值'] || row['target']) || 0,
          actual: parseFloat(row['实际值'] || row['actual']) || 0,
          method: row['计算方式'] || row['method'] || '直接'
        });
      }

      saveToLocal();
      renderKpiConfig();
      toast('已导入 ' + jsonData.length + ' 条指标', 'success');
    } catch (err) {
      toast('文件解析失败：' + err.message, 'error');
    }
  };
  reader.readAsArrayBuffer(file);
  input.value = '';
}

function parseWorkbook(data) {
  if (typeof XLSX !== 'undefined' && XLSX.read) {
    return XLSX.read(data, { type: 'array' });
  }
  return null;
}

function parseCsv(text) {
  var lines = text.split('\n');
  var result = [];
  for (var i = 0; i < lines.length; i++) {
    var cols = lines[i].split(',');
    if (cols.length > 0) result.push(cols);
  }
  return result;
}

// ==================== 绩效制作 ====================
function setPerfMode(mode) {
  state.perfMode = mode;
  var stabs = document.querySelectorAll('#perfSubtabs .hr-stab');
  stabs.forEach(function(t, i) {
    var modes = ['exclusive', 'pinxi', 'temp'];
    t.classList.toggle('active', modes[i] === mode);
  });
  $('#perf-exclusive-panel').style.display = mode === 'exclusive' ? '' : 'none';
  $('#perf-pinxi-panel').style.display = mode === 'pinxi' ? '' : 'none';
  $('#perf-temp-panel').style.display = mode === 'temp' ? '' : 'none';
  renderPerformanceModule();
}

function setPerfExProject(proj) { state.perfExProject = proj; renderPerformance(); }
function setPerfPxProject(proj) { state.perfPxProject = proj; renderPerformance(); }
function setPerfTmpProject(proj) { state.perfTmpProject = proj; renderPerformance(); }

function renderPerformanceModule() {
  renderPerfPillTabs('perfExPillTabs', state.perfExProject, setPerfExProject);
  renderPerfPillTabs('perfPxPillTabs', state.perfPxProject, setPerfPxProject);
  renderPerfPillTabs('perfTmpPillTabs', state.perfTmpProject, setPerfTmpProject);
  renderPerformance();
}

function renderPerfPillTabs(containerId, activeProj, onClickFn) {
  var projects = ['全部'];
  for (var i = 0; i < PROJECT_TABS.length; i++) {
    projects.push(PROJECT_TABS[i]);
  }
  var html = '';
  for (var i = 0; i < projects.length; i++) {
    var cls = projects[i] === activeProj ? 'hr-pill active' : 'hr-pill';
    html += '<div class="' + cls + '" onclick="void(0)">' + esc(projects[i]) + '</div>';
  }
  var el = document.getElementById(containerId);
  if (el) {
    el.innerHTML = html;
    var pills = el.querySelectorAll('.hr-pill');
    pills.forEach(function(pill, i) {
      pill.addEventListener('click', function() {
        onClickFn(projects[i]);
      });
    });
  }
}

function renderPerformance() {
  if (state.perfMode === 'exclusive') renderPerformanceTable('exclusive');
  else if (state.perfMode === 'pinxi') renderPerformanceTable('pinxi');
  else if (state.perfMode === 'temp') renderPerformanceTable('temp');
}

function renderPerformanceTable(type) {
  var wrapId, proj;
  if (type === 'exclusive') {
    wrapId = 'perfExclusiveTableWrap';
    proj = state.perfExProject;
  } else if (type === 'pinxi') {
    wrapId = 'perfPinxiTableWrap';
    proj = state.perfPxProject;
  } else {
    wrapId = 'perfTempTableWrap';
    proj = state.perfTmpProject;
  }

  var periodInput = document.getElementById(type === 'exclusive' ? 'perfExPeriod' : (type === 'pinxi' ? 'perfPxPeriod' : 'perfTmpPeriod'));
  var period = periodInput ? periodInput.value : latestPeriod();
  if (!period) {
    var now = new Date();
    period = now.getFullYear() + '-' + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1);
  }

  // 获取相关员工
  var staff = [];
  if (type === 'exclusive') {
    staff = state.staff.filter(function(s) {
      return s.status !== '离职' && projectMatch(s.project, proj) && !isPinxiProject(s.project);
    });
  } else if (type === 'pinxi') {
    staff = state.staff.filter(function(s) {
      return s.status !== '离职' && PINXI_PROJECTS.indexOf(s.project) >= 0;
    });
  } else {
    staff = state.staff.filter(function(s) {
      return s.status !== '离职' && (s.role === '临时' || s.workMode === '临时');
    });
  }

  var html = '<table><thead><tr>' +
    '<th>姓名</th><th>项目</th><th>角色</th><th>底薪</th><th>绩效</th><th>出勤天数</th>' +
    '<th>绩效分</th><th>补贴</th><th>扣罚</th><th>应发合计</th>' +
    '</tr></thead><tbody>';

  var totalPay = 0;
  for (var i = 0; i < staff.length; i++) {
    var s = staff[i];
    var key = salaryKey(s, period);
    var base = s[key] || 0;
    var perfKey = key.replace('Base', 'Performance');
    var perf = s[perfKey] || 0;
    var subsidy = adjustmentFor(s.id, period, 'subsidy');
    var penalty = adjustmentFor(s.id, period, 'penalty');
    var pay = base + perf + subsidy - penalty;
    if (pay < 0) pay = 0;
    totalPay += pay;

    var statusBadge = s.status === '在职' ? 'hr-badge hr-badge-green' : (s.status === '离职' ? 'hr-badge hr-badge-red' : 'hr-badge hr-badge-amber');

    html += '<tr>' +
      '<td>' + esc(s.name) + '</td>' +
      '<td>' + esc(s.project) + '</td>' +
      '<td>' + esc(s.role) + '</td>' +
      '<td>' + fmtMoney(base) + '</td>' +
      '<td>' + fmtMoney(perf) + '</td>' +
      '<td>0</td>' +
      '<td>0</td>' +
      '<td>' + fmtMoney(subsidy) + '</td>' +
      '<td>' + fmtMoney(penalty) + '</td>' +
      '<td class="hr-pos">' + fmtMoney(pay) + '</td>' +
      '</tr>';
  }

  // 合计行
  html += '<tr style="font-weight:700;background:var(--cream);">' +
    '<td colspan="9">合计</td>' +
    '<td class="hr-pos">' + fmtMoney(totalPay) + '</td>' +
    '</tr>';

  if (staff.length === 0) {
    html = '<table><thead><tr><th colspan="10">暂无绩效数据</th></tr></thead></table>';
  }

  html += '</tbody></table>';
  document.getElementById(wrapId).innerHTML = html;
}

function isPinxiProject(proj) {
  return PINXI_PROJECTS.indexOf(proj) >= 0;
}

// 导出CSV
function exportPerformanceCsv(type) {
  var periodInput, proj, title;
  if (type === 'exclusive') {
    periodInput = 'perfExPeriod'; proj = state.perfExProject; title = '专席绩效';
  } else if (type === 'pinxi') {
    periodInput = 'perfPxPeriod'; proj = state.perfPxProject; title = '拼席结算';
  } else {
    periodInput = 'perfTmpPeriod'; proj = state.perfTmpProject; title = '临时客服费用';
  }

  var periodEl = document.getElementById(periodInput);
  var period = periodEl ? periodEl.value : latestPeriod();
  if (!period) period = latestPeriod();

  var staff = [];
  if (type === 'exclusive') {
    staff = state.staff.filter(function(s) { return s.status !== '离职' && projectMatch(s.project, proj) && !isPinxiProject(s.project); });
  } else if (type === 'pinxi') {
    staff = state.staff.filter(function(s) { return s.status !== '离职' && PINXI_PROJECTS.indexOf(s.project) >= 0; });
  } else {
    staff = state.staff.filter(function(s) { return s.status !== '离职'; });
  }

  var csv = '\uFEFF'; // BOM
  csv += '姓名,项目,角色,底薪,绩效,出勤天数,绩效分,补贴,扣罚,应发合计\n';

  for (var i = 0; i < staff.length; i++) {
    var s = staff[i];
    var key = salaryKey(s, period);
    var base = s[key] || 0;
    var perfKey = key.replace('Base', 'Performance');
    var perf = s[perfKey] || 0;
    var subsidy = adjustmentFor(s.id, period, 'subsidy');
    var penalty = adjustmentFor(s.id, period, 'penalty');
    var pay = Math.max(0, base + perf + subsidy - penalty);
    csv += [s.name, s.project, s.role, base, perf, 0, 0, subsidy, penalty, pay.toFixed(2)].join(',') + '\n';
  }

  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = title + '_' + period + '.csv';
  a.click();
  URL.revokeObjectURL(url);
  toast('已导出 ' + title + ' CSV', 'success');
}

// ==================== 数据加载和保存 ====================
function init() {
  loadLocalOrDefault();
  // 设置默认月份
  state.schedulePeriod = latestPeriod();
  state.scheduleRemarksPeriod = latestPeriod();
  state.scheduleSummaryPeriod = latestPeriod();

  // 设置绩效月份默认值
  var now = new Date();
  var defaultPeriod = now.getFullYear() + '-' + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1);
  var perfEx = $('#perfExPeriod');
  var perfPx = $('#perfPxPeriod');
  var perfTmp = $('#perfTmpPeriod');
  if (perfEx) perfEx.value = defaultPeriod;
  if (perfPx) perfPx.value = defaultPeriod;
  if (perfTmp) perfTmp.value = defaultPeriod;

  // 初始渲染
  renderStaffPillTabs();
  renderCurrentStaffView();
}

function loadLocalOrDefault() {
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      var parsed = JSON.parse(saved);
      // 合并数据到 state
      if (parsed.staff && parsed.staff.length > 0) {
        state.staff = parsed.staff;
      } else {
        state.staff = JSON.parse(JSON.stringify(DEFAULT_STAFF));
      }
      state.salaryAdjustments = parsed.salaryAdjustments || [];
      state.managers = parsed.managers || [];
      state.scheduleRemarks = parsed.scheduleRemarks || [];
      state.schedule = parsed.schedule || { people: [], dates: [] };
      state.projectConfigs = parsed.projectConfigs || [];
      state.operations = parsed.operations || [];
      state.monthlyFacts = parsed.monthlyFacts || [];
    } else {
      loadDefaultData();
    }
  } catch (e) {
    console.error('加载数据失败:', e);
    loadDefaultData();
  }
}

function loadDefaultData() {
  state.staff = JSON.parse(JSON.stringify(DEFAULT_STAFF));
  state.salaryAdjustments = [];
  state.managers = [];
  state.scheduleRemarks = [];
  state.schedule = { people: [], dates: [] };
  state.projectConfigs = [];
  state.operations = [];
  state.monthlyFacts = [];
}

function saveToServer() {
  updateSyncStatus('saving', '保存中...');
  // 模拟保存（实际可对接后端API）
  setTimeout(function() {
    saveToLocal();
    updateSyncStatus('ok', '已保存');
    toast('数据已同步保存', 'success');
  }, 800);
}

function saveToLocal() {
  try {
    var data = {
      staff: state.staff,
      salaryAdjustments: state.salaryAdjustments,
      managers: state.managers,
      scheduleRemarks: state.scheduleRemarks,
      schedule: state.schedule,
      projectConfigs: state.projectConfigs,
      operations: state.operations,
      monthlyFacts: state.monthlyFacts
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    updateSyncStatus('ok', '本地存储');
  } catch (e) {
    console.error('保存失败:', e);
    updateSyncStatus('err', '保存失败');
  }
}

function updateSyncStatus(type, text) {
  var el = $('#syncStatus');
  if (!el) return;
  var dot = el.querySelector('.dot');
  var span = el.querySelector('span:last-child');
  if (dot) {
    dot.className = 'dot ' + (type || 'ok');
  }
  if (span) span.textContent = text || '';
}

// ==================== 页面加载 ====================
// 如果主系统已加载则直接初始化，否则等 DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
