const App = {
  currentView: 'dashboard',
  historyPage: 1,
  historyPageSize: 15,

  init() {
    this.bindNav();
    initData().then(() => this.switchView('dashboard'));
  },

  bindNav() {
    document.querySelectorAll('.nav-menu li').forEach(li => {
      li.addEventListener('click', () => this.switchView(li.dataset.view));
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
      case 'shops': await this.renderShops(container); break;
      case 'input': await this.renderInput(container); break;
      case 'statement': await this.renderStatement(container); break;
      case 'history': await this.renderHistory(container); break;
    }
  },

  // ========== Dashboard ==========
  _dashboardYear: null,
  _dashboardMonth: null,

  async renderDashboard(el) {
    const now = new Date();
    const year = this._dashboardYear || now.getFullYear();
    const month = this._dashboardMonth || (now.getMonth() + 1);
    const projects = await DB.getAllProjects();
    const records = await DB.getAllMonthlyRecords();

    let totalFee = 0, totalVolume = 0, settledCount = 0;
    const projectFees = [], projectVolumes = [];

    for (const p of projects) {
      const rec = records.find(r => r.projectId === p.id && r.year === year && r.month === month);
      if (rec && rec.calculated) {
        totalFee += rec.calculated.total;
        totalVolume += rec.calculated.totalVolume;
        settledCount++;
        projectFees.push({ name: p.name, fee: rec.calculated.total });
        projectVolumes.push({ name: p.name, volume: rec.calculated.totalVolume });
      } else {
        projectFees.push({ name: p.name, fee: 0 });
        projectVolumes.push({ name: p.name, volume: 0 });
      }
    }

    const yearTotal = records.filter(r => r.year === year && r.calculated).reduce((s, r) => s + r.calculated.total, 0);

    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
        <h2 style="margin:0;">数据概览</h2>
        <div class="form-row" style="margin-bottom:0;gap:8px;">
          <label>年份</label>
          <input type="number" id="dash-year" value="${year}" style="width:90px;" onchange="App._dashboardYear=parseInt(this.value); App.renderDashboard(document.getElementById('view-dashboard'))">
          <label>月份</label>
          <select id="dash-month" onchange="App._dashboardMonth=parseInt(this.value); App.renderDashboard(document.getElementById('view-dashboard'))">
            ${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${i+1===month?'selected':''}>${i+1}月</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="grid-4">
        <div class="kpi-card">
          <div class="kpi-label">${year}年${month}月总费用</div>
          <div class="kpi-value">&yen;${totalFee.toLocaleString()}</div>
          <div style="font-size:12px;opacity:0.8;margin-top:4px;">${settledCount}/${projects.length} 项目已结算</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%)">
          <div class="kpi-label">${month}月总接待量</div>
          <div class="kpi-value">${totalVolume.toLocaleString()}</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)">
          <div class="kpi-label">管理项目数</div>
          <div class="kpi-value">${projects.length}</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)">
          <div class="kpi-label">${year}年累计费用</div>
          <div class="kpi-value">&yen;${yearTotal.toLocaleString()}</div>
        </div>
      </div>
      <div class="grid-2" style="margin-top:20px;">
        <div class="card">
          <div class="card-title">各项目${month}月费用对比</div>
          <div style="height:280px;"><canvas id="chart-fees"></canvas></div>
        </div>
        <div class="card">
          <div class="card-title">各项目${month}月接待量对比</div>
          <div style="height:280px;"><canvas id="chart-volumes"></canvas></div>
        </div>
      </div>
      <div class="card" style="margin-top:20px;">
        <div class="card-title">${year}年费用趋势</div>
        <div style="height:300px;"><canvas id="chart-trend"></canvas></div>
      </div>
    `;

    Charts.renderFeeBar('chart-fees', projectFees);
    Charts.renderVolumeBar('chart-volumes', projectVolumes);
    Charts.renderTrendLine('chart-trend', records, year);
  },

  // ========== 项目管理 ==========
  async renderProjects(el) {
    const projects = await DB.getAllProjects();
    const typeLabels = { daily_avg: '日均接待量', monthly_total: '月总接待量', hourly: '按小时计费' };
    const ruleLabels = { double_pay: '额外薪资', collab_days: '合作天数' };

    let html = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h2>项目管理</h2>
        <button class="btn btn-success" onclick="App.showAddProjectModal()">+ 新增项目</button>
      </div>
      <div class="card">
        <table>
          <thead>
            <tr>
              <th>项目名称</th>
              <th>结算方式</th>
              <th>档位数</th>
              <th>店铺限制</th>
              <th>超店附加</th>
              <th>节假日规则</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
    `;
    for (const p of projects) {
      const tierCount = p.tiers ? p.tiers.length : '-';
      const shopLimit = p.tiers && p.tiers[0] && p.tiers[0].shopLimit ? p.tiers[0].shopLimit : (p.baseShopLimit || '-');
      html += `
        <tr>
          <td><strong>${p.name}</strong></td>
          <td><span class="tag">${typeLabels[p.calculationType] || p.calculationType}</span></td>
          <td>${tierCount}</td>
          <td>${shopLimit}个</td>
          <td>&yen;${p.extraShopFee || 0}/店</td>
          <td>${ruleLabels[p.holidayRule] || p.holidayRule}</td>
          <td>
            <div class="btn-group">
              <button class="btn btn-secondary" onclick="App.viewProjectDetail(${p.id})">详情</button>
              <button class="btn btn-primary" onclick="App.showEditProjectModal(${p.id})">编辑</button>
              <button class="btn btn-danger" onclick="App.confirmDeleteProject(${p.id})">删除</button>
            </div>
          </td>
        </tr>
      `;
    }
    html += '</tbody></table></div>';
    el.innerHTML = html;
  },

  renderHolidayTableHtml(p) {
    const ht = p.holidayTable;
    if (!ht || ht.length === 0) return '';
    const isCollab = p.holidayRule === 'collab_days';
    let rows = ht.map(h => {
      const highlight = isCollab && h.collabDays !== h.standardDays
        ? 'background:#e8f5e9;font-weight:bold;'
        : '';
      return `<tr>
        <td>${h.name}</td>
        <td>${h.standardDays}天</td>
        <td style="${highlight}">${h.collabDays}天</td>
      </tr>`;
    }).join('');
    const totalStd = ht.reduce((s, h) => s + h.standardDays, 0);
    const totalCollab = ht.reduce((s, h) => s + h.collabDays, 0);
    return `
      <h4 style="margin:16px 0 8px;">法定节假日配置</h4>
      <table style="font-size:13px;margin-bottom:8px;">
        <thead><tr>
          <th>法定节假日</th>
          <th>标准天数</th>
          <th>${isCollab ? '合作天数' : '计薪天数'}</th>
        </tr></thead>
        <tbody>${rows}
          <tr style="border-top:2px solid #e8e8e8;font-weight:bold;">
            <td>合计</td>
            <td>${totalStd}天</td>
            <td>${totalCollab}天</td>
          </tr>
        </tbody>
      </table>
      ${isCollab ? '<div style="font-size:12px;color:#999;margin-bottom:8px;">绿色高亮行表示合作天数与标准天数不同</div>' : ''}
    `;
  },

  renderEditableHolidayTable(p) {
    const ht = p.holidayTable || [
      { name: '元旦', standardDays: 1, collabDays: 1 },
      { name: '春节', standardDays: 7, collabDays: 7 },
      { name: '清明节', standardDays: 3, collabDays: 3 },
      { name: '劳动节', standardDays: 5, collabDays: 5 },
      { name: '端午节', standardDays: 3, collabDays: 3 },
      { name: '中秋节', standardDays: 3, collabDays: 3 },
      { name: '国庆节', standardDays: 7, collabDays: 7 }
    ];
    const isCollab = p.holidayRule === 'collab_days';
    const colLabel = isCollab ? '合作天数' : '计薪天数';
    let rows = ht.map((h, i) => {
      const highlight = isCollab && h.collabDays !== h.standardDays
        ? 'background:#e8f5e9;' : '';
      return `<tr style="${highlight}">
        <td>${h.name}</td>
        <td><input type="number" class="ht-std" data-idx="${i}" value="${h.standardDays}" style="width:60px;text-align:center;" min="0"></td>
        <td><input type="number" class="ht-collab" data-idx="${i}" value="${h.collabDays}" style="width:60px;text-align:center;" min="0"></td>
      </tr>`;
    }).join('');
    return `
      <table style="font-size:13px;" id="edit-holiday-table">
        <thead><tr>
          <th>法定节假日</th>
          <th>标准天数</th>
          <th>${colLabel}</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="font-size:12px;color:#999;margin-top:4px;">${isCollab ? '绿色行为合作天数与标准天数不同' : '双倍薪资项目：计薪天数通常等于标准天数'}</div>
    `;
  },

  renderEditableTiers(p) {
    const tiers = p.tiers || [];
    if (tiers.length === 0) return '<p style="color:#999;font-size:13px;">暂无结算档位</p>';
    const isDaily = p.calculationType === 'daily_avg';
    const minLabel = isDaily ? '日均最小' : '区间最小';
    const maxLabel = isDaily ? '日均最大' : '区间最大';
    const priceLabel = p.calculationType === 'monthly_total' ? '月费(元)' : '月费(元)';
    let rows = tiers.map((t, i) => {
      return `<tr class="tier-row">
        <td><input type="number" class="tier-min" value="${t.min}" style="width:70px;" min="0" placeholder="0"></td>
        <td><input type="number" class="tier-max" value="${t.max === Infinity ? '' : t.max}" style="width:70px;" placeholder="∞留空"></td>
        <td><input type="number" class="tier-price" value="${t.price}" style="width:80px;" min="0"></td>
        <td><input type="number" class="tier-shoplimit" value="${t.shopLimit || ''}" style="width:50px;" placeholder="-"></td>
        <td><button class="btn btn-danger" style="font-size:11px;padding:2px 5px;" onclick="this.closest('tr').remove()">删除</button></td>
      </tr>`;
    }).join('');
    return `
      <table style="font-size:13px;">
        <thead><tr><th>${minLabel}</th><th>${maxLabel}</th><th>${priceLabel}</th><th>店铺限制</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="font-size:11px;color:#999;margin-top:2px;">最大值留空表示无限大</div>
    `;
  },

  addTierRow() {
    const container = document.getElementById('pf-tiers-container');
    const tbody = container.querySelector('tbody');
    if (!tbody) {
      container.innerHTML = `
        <table style="font-size:13px;">
          <thead><tr><th>区间最小</th><th>区间最大</th><th>月费(元)</th><th>店铺限制</th><th></th></tr></thead>
          <tbody></tbody>
        </table>`;
      return this.addTierRow();
    }
    const tr = document.createElement('tr');
    tr.className = 'tier-row';
    tr.innerHTML = `
      <td><input type="number" class="tier-min" value="0" style="width:70px;" min="0"></td>
      <td><input type="number" class="tier-max" value="" style="width:70px;" placeholder="∞留空"></td>
      <td><input type="number" class="tier-price" value="0" style="width:80px;" min="0"></td>
      <td><input type="number" class="tier-shoplimit" value="" style="width:50px;" placeholder="-"></td>
      <td><button class="btn btn-danger" style="font-size:11px;padding:2px 5px;" onclick="this.closest('tr').remove()">删除</button></td>
    `;
    tbody.appendChild(tr);
  },

  readTiersFromForm() {
    const rows = document.querySelectorAll('.tier-row');
    const tiers = [];
    rows.forEach(row => {
      const min = parseInt(row.querySelector('.tier-min')?.value) || 0;
      const maxVal = row.querySelector('.tier-max')?.value;
      const max = maxVal === '' || maxVal === undefined ? Infinity : (parseInt(maxVal) || 0);
      const price = parseInt(row.querySelector('.tier-price')?.value) || 0;
      const shopLimit = parseInt(row.querySelector('.tier-shoplimit')?.value) || 0;
      tiers.push({ min, max, price, shopLimit });
    });
    return tiers;
  },

  readHolidayTableFromForm() {
    const stdInputs = document.querySelectorAll('.ht-std');
    const collabInputs = document.querySelectorAll('.ht-collab');
    const table = [];
    stdInputs.forEach((el, i) => {
      table.push({
        name: el.closest('tr').cells[0].textContent,
        standardDays: parseInt(el.value) || 0,
        collabDays: parseInt(collabInputs[i].value) || 0
      });
    });
    return table;
  },

  async viewProjectDetail(id) {
    const p = await DB.getProject(id);
    if (!p) return;
    const typeLabels = { daily_avg: '日均接待量', monthly_total: '月总接待量', hourly: '按小时计费' };
    const ruleLabels = { double_pay: '额外薪资', collab_days: '合作天数' };

    let holidayDetailHtml = '';
    if (p.holidayRule === 'double_pay') {
      holidayDetailHtml = `<span style="font-size:12px;color:#999;">（法定节假日当天额外${p.holidayMultiplier - 1}倍薪资，基本+额外=共${p.holidayMultiplier}倍）</span>`;
    } else if (p.holidayRule === 'collab_days') {
      holidayDetailHtml = `<span style="font-size:12px;color:#999;">（每月录入时配置合作天数，默认等于当月法定假日天数）</span>`;
    }
    let tiersHtml = '';
    if (p.tiers && p.tiers.length > 0) {
      tiersHtml = `<table><thead><tr><th>区间最小</th><th>区间最大</th><th>月费(元)</th><th>店铺限制</th></tr></thead><tbody>`;
      for (const t of p.tiers) {
        tiersHtml += `<tr><td>${t.min}</td><td>${t.max === Infinity ? '无限' : t.max}</td><td>&yen;${t.price}</td><td>${t.shopLimit || '-'}</td></tr>`;
      }
      tiersHtml += '</tbody></table>';
    } else if (p.calculationType === 'hourly') {
      tiersHtml = `<p>上线值班：&yen;${p.onlineRate}/小时/人</p><p>未上线值班：&yen;${p.offlineRate}/小时/人</p>`;
    }

    const html = `
      <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
        <div class="modal">
          <div class="modal-header">
            <h3>${p.name} - 详细信息</h3>
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
          </div>
          <div class="form-row"><label>结算方式</label><span>${typeLabels[p.calculationType]}</span></div>
          <div class="form-row"><label>工作时间</label><span>${p.workTime}</span></div>
          <div class="form-row"><label>月休天数</label><span>${p.restDays}天</span></div>
          <div class="form-row"><label>节假日规则</label><span>${ruleLabels[p.holidayRule] || p.holidayRule} ${holidayDetailHtml}</span></div>
          <div class="form-row"><label>加班计薪</label><span>&yen;${p.overtimeRate}/小时</span></div>
          <div class="form-row"><label>税务说明</label><span>所有金额已含税（${(p.invoiceRate * 100).toFixed(0)}%）</span></div>
          <div class="form-row"><label>超店附加费</label><span>&yen;${p.extraShopFee}/店/月</span></div>
          <div class="form-row"><label>工作内容</label><span>${p.description || '-'}</span></div>
          <h4 style="margin:16px 0 8px;">结算档位</h4>
          ${tiersHtml}
          ${this.renderHolidayTableHtml(p)}
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  },

  showAddProjectModal() {
    this._showProjectForm(null);
  },

  async showEditProjectModal(id) {
    const p = await DB.getProject(id);
    this._showProjectForm(p);
  },

  _showProjectForm(project) {
    const isEdit = !!project;
    const p = project || {
      name: '', calculationType: 'daily_avg', tiers: [],
      extraShopFee: 100, baseShopLimit: 5,
      workTime: '', restDays: 0,
      holidayRule: 'double_pay', holidayMultiplier: 2,
      overtimeRate: 20, invoiceRate: 0.01, description: '',
      onlineRate: 30.30, offlineRate: 20.20
    };

    const html = `
      <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
        <div class="modal">
          <div class="modal-header">
            <h3>${isEdit ? '编辑' : '新增'}项目</h3>
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
          </div>
          <div class="form-row"><label>项目名称</label><input id="pf-name" value="${p.name}" placeholder="输入项目名称"></div>
          <div class="form-row"><label>结算方式</label>
            <select id="pf-type">
              <option value="daily_avg" ${p.calculationType === 'daily_avg' ? 'selected' : ''}>日均接待量</option>
              <option value="monthly_total" ${p.calculationType === 'monthly_total' ? 'selected' : ''}>月总接待量</option>
              <option value="hourly" ${p.calculationType === 'hourly' ? 'selected' : ''}>按小时计费</option>
            </select>
          </div>
          <div class="form-row"><label>工作时间</label><input id="pf-worktime" value="${p.workTime}"></div>
          <div class="form-row"><label>月休天数</label><input type="number" id="pf-rest" value="${p.restDays}"></div>
          <div class="form-row"><label>节假日规则</label>
            <select id="pf-holiday">
              <option value="double_pay" ${p.holidayRule === 'double_pay' ? 'selected' : ''}>法定假日额外薪资（可配置倍数）</option>
              <option value="collab_days" ${p.holidayRule === 'collab_days' ? 'selected' : ''}>合作天数计算（额外1倍=共2倍）</option>
            </select>
          </div>
          <div id="pf-doublepay-section" style="${p.holidayRule === 'double_pay' ? '' : 'display:none'}">
            <div class="form-row"><label>薪资倍数</label><input type="number" id="pf-multiplier" value="${p.holidayMultiplier || 2}"></div>
          </div>
          <div class="form-row"><label>加班计薪(元/h)</label><input type="number" id="pf-overtime" value="${p.overtimeRate}"></div>
          <div class="form-row"><label>发票税点(%)</label><input type="number" step="0.1" id="pf-invoice" value="${p.invoiceRate * 100}"><span style="font-size:12px;color:#999;margin-left:8px;">仅作记录，金额已含税不再累加</span></div>
          <div class="form-row"><label>基础店铺数</label><input type="number" id="pf-shoplimit" value="${p.baseShopLimit || 5}"></div>
          <div class="form-row"><label>超店附加(元/店)</label><input type="number" id="pf-shopfee" value="${p.extraShopFee}"></div>
          <div class="form-row"><label>工作内容</label><textarea id="pf-desc" rows="2">${p.description || ''}</textarea></div>
          <div id="pf-tiers-section" style="${p.calculationType === 'hourly' ? 'display:none' : ''}">
            <h4 style="margin:16px 0 8px;">结算档位</h4>
            <div id="pf-tiers-container">${this.renderEditableTiers(p)}</div>
            <button class="btn btn-secondary" style="margin-top:4px;font-size:12px;" onclick="App.addTierRow()">+ 添加档位</button>
          </div>
          <h4 style="margin:16px 0 8px;">法定节假日配置</h4>
          <div id="pf-holiday-table-container">${this.renderEditableHolidayTable(p)}</div>
          <div id="pf-hourly-section" style="${p.calculationType === 'hourly' ? '' : 'display:none'}">
            <div class="form-row"><label>上线费(元/h)</label><input type="number" step="0.01" id="pf-online" value="${p.onlineRate || 30.30}"></div>
            <div class="form-row"><label>未上线费(元/h)</label><input type="number" step="0.01" id="pf-offline" value="${p.offlineRate || 20.20}"></div>
          </div>
          <div style="margin-top:16px;text-align:right;">
            <button class="btn btn-success" onclick="App.saveProject(${isEdit ? p.id : 'null'})">保存</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    document.getElementById('pf-type').addEventListener('change', (e) => {
      document.getElementById('pf-hourly-section').style.display = e.target.value === 'hourly' ? '' : 'none';
    });
    document.getElementById('pf-holiday').addEventListener('change', (e) => {
      document.getElementById('pf-doublepay-section').style.display = e.target.value === 'double_pay' ? '' : 'none';
    });
  },

  async saveProject(editId) {
    const name = document.getElementById('pf-name').value.trim();
    if (!name) { alert('请输入项目名称'); return; }

    const data = {
      name,
      calculationType: document.getElementById('pf-type').value,
      workTime: document.getElementById('pf-worktime').value,
      restDays: parseInt(document.getElementById('pf-rest').value) || 0,
      holidayRule: document.getElementById('pf-holiday').value,
      holidayMultiplier: parseInt(document.getElementById('pf-multiplier').value) || 2,
      overtimeRate: parseInt(document.getElementById('pf-overtime').value) || 20,
      invoiceRate: (parseFloat(document.getElementById('pf-invoice').value) || 1) / 100,
      baseShopLimit: parseInt(document.getElementById('pf-shoplimit').value) || 5,
      extraShopFee: parseInt(document.getElementById('pf-shopfee').value) || 100,
      description: document.getElementById('pf-desc').value,
      tiers: this.readTiersFromForm(),
      holidayTable: this.readHolidayTableFromForm()
    };

    if (data.calculationType === 'hourly') {
      data.onlineRate = parseFloat(document.getElementById('pf-online').value) || 30.30;
      data.offlineRate = parseFloat(document.getElementById('pf-offline').value) || 20.20;
      data.tiers = [];
    } else {
      data.tiers = [];
    }

    if (editId) {
      await DB.updateProject(editId, data);
    } else {
      await DB.addProject(data);
    }

    document.querySelector('.modal-overlay').remove();
    this.renderProjects(document.getElementById('view-projects'));
    alert('保存成功');
  },

  async confirmDeleteProject(id) {
    const p = await DB.getProject(id);
    if (!confirm(`确定删除项目"${p.name}"？该项目的所有月度数据将一并删除。`)) return;
    await DB.deleteProject(id);
    this.renderProjects(document.getElementById('view-projects'));
  },

  // ========== 店铺管理 ==========
  async renderShops(el) {
    const projects = await DB.getAllProjects();
    const allShops = await DB.getAllShops();
    const filterProjectId = this._shopFilter || '';

    const filteredShops = filterProjectId
      ? allShops.filter(s => s.projectId == filterProjectId)
      : allShops;

    const getProjectName = (pid) => {
      const p = projects.find(proj => proj.id === pid);
      return p ? p.name : '未知项目';
    };

    let html = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h2>店铺管理</h2>
        <button class="btn btn-success" onclick="App.showAddShopModal()">+ 新增店铺</button>
      </div>
      <div class="card" style="margin-bottom:16px;">
        <div class="form-row">
          <label>按项目筛选</label>
          <select id="shop-filter" onchange="App._shopFilter=this.value;App.renderShops(document.getElementById('view-shops'))">
            <option value="">全部项目</option>
            ${projects.map(p => `<option value="${p.id}" ${filterProjectId == p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="card">
        <table>
          <thead><tr><th>所属项目</th><th>店铺名称</th><th>平台</th><th>操作</th></tr></thead>
          <tbody>
    `;
    for (const s of filteredShops) {
      html += `<tr>
        <td>${getProjectName(s.projectId)}</td>
        <td><strong>${s.name}</strong></td>
        <td><span class="tag">${s.platform}</span></td>
        <td>
          <div class="btn-group">
            <button class="btn btn-primary" onclick="App.showEditShopModal(${s.id})">编辑</button>
            <button class="btn btn-danger" onclick="App.confirmDeleteShop(${s.id})">删除</button>
          </div>
        </td>
      </tr>`;
    }
    html += `</tbody></table></div>`;
    el.innerHTML = html;
  },

  showAddShopModal() { this._showShopForm(null); },
  async showEditShopModal(id) {
    const shop = await db.shops.get(id);
    this._showShopForm(shop);
  },

  async _showShopForm(shop) {
    const projects = await DB.getAllProjects();
    const isEdit = !!shop;
    const s = shop || { projectId: projects[0]?.id || '', name: '', platform: '抖音' };
    const platforms = ['抖音', '淘宝', '天猫', '京东', '拼多多', '快手', '阿里巴巴', '小红书', '微信', '其他'];

    const html = `
      <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
        <div class="modal">
          <div class="modal-header">
            <h3>${isEdit ? '编辑' : '新增'}店铺</h3>
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
          </div>
          <div class="form-row"><label>所属项目</label>
            <select id="sf-project">
              ${projects.map(p => `<option value="${p.id}" ${p.id === s.projectId ? 'selected' : ''}>${p.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-row"><label>店铺名称</label><input id="sf-name" value="${s.name}" placeholder="输入店铺名称"></div>
          <div class="form-row"><label>平台</label>
            <select id="sf-platform">${platforms.map(pl => `<option ${pl === s.platform ? 'selected' : ''}>${pl}</option>`).join('')}</select>
          </div>
          <div style="margin-top:16px;text-align:right;">
            <button class="btn btn-success" onclick="App.saveShop(${isEdit ? s.id : 'null'})">保存</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  },

  async saveShop(editId) {
    const data = {
      projectId: parseInt(document.getElementById('sf-project').value),
      name: document.getElementById('sf-name').value.trim(),
      platform: document.getElementById('sf-platform').value
    };
    if (!data.name) { alert('请输入店铺名称'); return; }
    if (editId) await DB.updateShop(editId, data);
    else await DB.addShop(data);
    document.querySelector('.modal-overlay').remove();
    this.renderShops(document.getElementById('view-shops'));
  },

  async confirmDeleteShop(id) {
    if (!confirm('确定删除该店铺？')) return;
    await DB.deleteShop(id);
    this.renderShops(document.getElementById('view-shops'));
  },

  // ========== 月度录入（按店铺录入） ==========
  async renderInput(el) {
    const projects = await DB.getAllProjects();
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    el.innerHTML = `
      <h2 style="margin-bottom:20px;">月度录入</h2>
      <div class="card">
        <div class="form-row">
          <label>选择项目</label>
          <select id="input-project">
            ${projects.map(p => `<option value="${p.id}">${p.name} (${p.calculationType === 'daily_avg' ? '日均' : p.calculationType === 'monthly_total' ? '月总' : '时薪'})</option>`).join('')}
          </select>
          <label style="min-width:40px">年</label>
          <input type="number" id="input-year" value="${year}" style="width:90px;">
          <label style="min-width:40px">月</label>
          <input type="number" id="input-month" value="${month}" min="1" max="12" style="width:70px;">
          <button class="btn btn-primary" onclick="App.loadInputForm()">加载</button>
          <button class="btn btn-success" onclick="Export.importExcel()">导入Excel</button>
          <button class="btn btn-secondary" onclick="Export.exportMonthData()">导出Excel</button>
        </div>
        <div id="input-form-container"></div>
      </div>
    `;
    this.loadInputForm();
  },

  async loadInputForm() {
    const projectId = parseInt(document.getElementById('input-project').value);
    const year = parseInt(document.getElementById('input-year').value);
    const month = parseInt(document.getElementById('input-month').value);
    if (month < 1 || month > 12) { alert('月份无效'); return; }

    const project = await DB.getProject(projectId);
    if (!project) { alert('项目不存在'); return; }
    const record = await DB.getMonthlyRecord(projectId, year, month);
    const shops = await DB.getShopsByProject(projectId);
    const daysInMonth = Calculator.getDaysInMonth(year, month);

    // 统计当月法定假日天数，并根据项目holidayTable自动计算合作天数
    let monthHolidayCount = 0;
    const monthHolidayNames = [];
    const monthHolidayDetails = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const holiday = await Calculator.isHoliday(dateStr);
      if (holiday) {
        monthHolidayCount++;
        if (!monthHolidayNames.includes(holiday.name)) monthHolidayNames.push(holiday.name);
        monthHolidayDetails.push({ name: holiday.name, date: dateStr });
      }
    }

    // 从项目配置的holidayTable中，按当月节假日名称累加合作天数
    let autoCollabDays = 0;
    if (project.holidayRule === 'collab_days' && project.holidayTable) {
      // 统计每个节假日在当月的实际天数
      const holidayDayCount = {};
      for (const h of monthHolidayDetails) {
        holidayDayCount[h.name] = (holidayDayCount[h.name] || 0) + 1;
      }
      // 从配置中查找对应合作天数
      for (const [name, count] of Object.entries(holidayDayCount)) {
        const config = project.holidayTable.find(ht => ht.name === name);
        if (config) {
          autoCollabDays += config.collabDays;
        } else {
          autoCollabDays += count; // 无配置则按实际天数
        }
      }
    }

    // 优先用已保存的值，否则用自动计算的值
    const savedCollabDays = record && record.collabDays != null ? record.collabDays : autoCollabDays;
    const collabDaysInput = project.holidayRule === 'collab_days' ? `
      <div class="form-row" style="background:#fff8e1;padding:8px;border-radius:4px;">
        <label>当月合作天数</label>
        <input type="number" id="collab-days" value="${savedCollabDays}" style="width:80px;" min="0">
        <span style="font-size:12px;color:#e94560;">（系统根据项目配置自动计算为<b>${autoCollabDays}</b>天，当月法定假日共<b>${monthHolidayCount}</b>天：${monthHolidayNames.join('、')}，如需调整可手动修改）</span>
      </div>
    ` : '';

    const typeLabel = project.calculationType === 'daily_avg' ? '日均接待量' :
                      project.calculationType === 'monthly_total' ? '月总接待量' : '小时数';
    const shopCount = record ? record.shopCount : shops.length;
    const savedShopVolumes = record && record.shopVolumes ? record.shopVolumes : {};
    const savedTotalVolume = record && record.totalVolume ? record.totalVolume : '';
    const savedScreenshots = record && record.shopScreenshots ? record.shopScreenshots : {};

    // 按店铺生成表格行
    let shopRows = '';
    if (shops.length > 0) {
      shopRows = shops.map(s => {
        const volume = savedShopVolumes[s.id] || '';
        const hasImg = savedScreenshots[s.id] ? true : false;
        const imgHtml = hasImg ?
          `<div style="text-align:center;"><img src="${savedScreenshots[s.id]}" class="ss-thumb" data-ss-key="${s.id}" style="height:48px;width:64px;object-fit:cover;border-radius:4px;border:1px solid #ddd;cursor:zoom-in;" title="点击查看大图">
           <div style="margin-top:4px;display:flex;gap:2px;justify-content:center;flex-wrap:wrap;">
             <button class="btn btn-secondary" style="font-size:10px;padding:2px 5px;" onclick="App.viewScreenshot('${s.id}')">查看</button>
             <button class="btn btn-success" style="font-size:10px;padding:2px 5px;" onclick="App.recognizeScreenshot(${s.id}, 'upload')">识别</button>
             <label class="btn btn-secondary" style="cursor:pointer;font-size:10px;padding:2px 5px;">更换<input type="file" accept="image/*" data-shop-id="${s.id}" data-img-type="upload" style="display:none;" onchange="App.handleScreenshotUpload(this)"></label>
             <button class="btn btn-danger" style="font-size:10px;padding:2px 5px;" onclick="App.deleteScreenshot(${s.id}, 'upload')">删除</button>
           </div></div>` :
          `<div style="text-align:center;"><span style="color:#ccc;font-size:12px;">暂无截图</span>
           <div style="margin-top:4px;">
             <label class="btn btn-secondary" style="cursor:pointer;font-size:12px;padding:3px 8px;">选择图片<input type="file" accept="image/*" data-shop-id="${s.id}" data-img-type="upload" style="display:none;" onchange="App.handleScreenshotUpload(this)"></label>
           </div></div>`;
        const pasteKey = 'paste_' + s.id;
        const pasteImgHtml = (savedScreenshots[pasteKey]) ?
          `<div style="text-align:center;"><img src="${savedScreenshots[pasteKey]}" class="ss-thumb" data-ss-key="${pasteKey}" style="height:48px;width:64px;object-fit:cover;border-radius:4px;border:1px solid #ddd;cursor:zoom-in;" title="点击查看大图">
           <div style="margin-top:4px;display:flex;gap:2px;justify-content:center;flex-wrap:wrap;">
             <button class="btn btn-secondary" style="font-size:10px;padding:2px 5px;" onclick="App.viewScreenshot('${pasteKey}')">查看</button>
             <button class="btn btn-success" style="font-size:10px;padding:2px 5px;" onclick="App.recognizeScreenshot(${s.id}, 'paste')">识别</button>
             <div class="paste-zone" data-shop-id="${s.id}" tabindex="0" style="border:1px dashed #43e97b;border-radius:4px;padding:2px 5px;font-size:10px;color:#43e97b;cursor:pointer;background:#f0fff4;" onclick="this.focus()" onfocus="this.style.borderColor='#43e97b'" onblur="this.style.borderColor='#ccc'" onpaste="App.handleScreenshotPaste(event, ${s.id})">重粘</div>
             <button class="btn btn-danger" style="font-size:10px;padding:2px 5px;" onclick="App.deleteScreenshot(${s.id}, 'paste')">删除</button>
           </div></div>` :
          `<div style="text-align:center;"><span style="color:#ccc;font-size:12px;">暂无截图</span>
           <div style="margin-top:4px;">
             <div class="paste-zone" data-shop-id="${s.id}" tabindex="0" style="border:1px dashed #ccc;border-radius:4px;padding:6px 10px;font-size:12px;color:#999;cursor:pointer;min-width:80px;text-align:center;background:#fafafa;transition:border-color .2s;" onclick="this.focus()" onfocus="this.style.borderColor='#43e97b'" onblur="this.style.borderColor='#ccc'" onpaste="App.handleScreenshotPaste(event, ${s.id})">
               点击后 Ctrl+V 粘贴
             </div>
           </div></div>`;
        return `<tr style="border-bottom:1px solid #f0f0f0;">
          <td style="padding:12px 10px;text-align:center;vertical-align:middle;"><span class="tag">${s.platform}</span></td>
          <td style="padding:12px 10px;vertical-align:middle;font-size:14px;">${s.name}</td>
          <td style="padding:12px 10px;text-align:center;vertical-align:middle;"><input type="number" class="shop-volume-input" data-shop-id="${s.id}" value="${volume}" placeholder="月接待量" style="width:110px;padding:8px 10px;font-size:14px;border-radius:6px;" min="0" oninput="App.updateTotalVolume()"></td>
          <td style="padding:12px 10px;text-align:center;vertical-align:middle;">
            ${imgHtml}
          </td>
          <td style="padding:12px 10px;text-align:center;vertical-align:middle;">
            ${pasteImgHtml}
          </td>
        </tr>`;
      }).join('');
    } else {
      shopRows = `<tr><td colspan="5" style="color:#999;text-align:center;padding:16px;">该项目暂无店铺，请先在"店铺管理"中添加</td></tr>`;
    }

    const holidayRule = project.holidayRule === 'double_pay' ? `共${project.holidayMultiplier}倍薪资(额外${project.holidayMultiplier - 1}倍)` :
                        project.holidayRule === 'collab_days' ? `合作天数(额外1倍=共2倍)` : project.holidayRule;

    document.getElementById('input-form-container').innerHTML = `
      <div style="margin-bottom:16px;padding:14px 16px;background:linear-gradient(135deg,#f8f9fa,#fff);border-radius:8px;border:1px solid #e8e8e8;font-size:13px;color:#666;line-height:1.8;">
        <strong style="font-size:15px;color:#1a1a2e;">${project.name}</strong>
        <span style="margin-left:12px;">结算方式：${typeLabel}</span>
        <span style="margin-left:12px;">假日规则：${holidayRule}</span>
        <span style="margin-left:12px;">${project.workTime}</span>
        <div style="margin-top:4px;color:#999;font-size:12px;">公式：所有店铺月接待量之和 / ${daysInMonth}天 = 日均接待量</div>
      </div>
      <div class="form-row" style="margin-bottom:16px;">
        <label style="min-width:80px;">实际店铺数</label>
        <input type="number" id="shop-count" value="${shopCount}" style="width:80px;font-size:15px;padding:6px 10px;">
        <span style="font-size:12px;color:#999;">（项目共<b>${shops.length}</b>家店铺，超过${project.baseShopLimit || 5}个，每增1个加收&yen;${project.extraShopFee || 0}/月）</span>
        <div style="flex:1"></div>
        <button class="btn btn-primary" onclick="App.saveMonthlyData()" style="padding:8px 20px;font-size:14px;">保存并计算</button>
      </div>
      ${collabDaysInput}
      <div class="card" style="margin-top:16px;">
        <div class="card-title" style="font-size:15px;padding:14px 16px;">各店铺月接待量录入 <span style="font-weight:normal;color:#999;font-size:12px;">填写每个店铺该月的总接待量，系统自动汇总</span></div>
        <table style="width:100%;border-collapse:separate;border-spacing:0;">
          <thead><tr style="background:#f5f6fa;">
            <th style="width:100px;padding:12px 10px;text-align:center;font-size:13px;">平台</th>
            <th style="padding:12px 10px;text-align:left;font-size:13px;">店铺名称</th>
            <th style="width:110px;padding:12px 10px;text-align:center;font-size:13px;">月接待量</th>
            <th style="width:140px;padding:12px 10px;text-align:center;font-size:13px;">上传截图</th>
            <th style="width:160px;padding:12px 10px;text-align:center;font-size:13px;">粘贴截图</th>
          </tr></thead>
          <tbody>${shopRows}</tbody>
        </table>
        <div style="margin-top:16px;padding:16px 20px;background:linear-gradient(135deg,#e8f5e9,#f1f8e9);border-radius:8px;display:flex;gap:32px;align-items:center;">
          <div>
            <span style="font-size:12px;color:#666;">汇总月总接待量</span>
            <div id="auto-total-volume" style="font-size:26px;font-weight:bold;color:#2e7d32;">${savedTotalVolume || 0}</div>
          </div>
          <div style="width:1px;height:40px;background:#c8e6c9;"></div>
          <div>
            <span style="font-size:12px;color:#666;">日均接待量</span>
            <div id="auto-avg-volume" style="font-size:26px;font-weight:bold;color:#1a1a2e;">${savedTotalVolume ? Math.round(savedTotalVolume / daysInMonth) : 0}</div>
          </div>
        </div>
      </div>
      <div id="calc-result"></div>
    `;
    this.updateTotalVolume();
    // 同步已保存的截图到临时缓存，方便查看大图
    if (savedScreenshots) {
      for (const [sid, data] of Object.entries(savedScreenshots)) {
        this._shopScreenshots[sid] = data;
      }
    }
  },

  updateTotalVolume() {
    let total = 0;
    document.querySelectorAll('.shop-volume-input').forEach(input => {
      total += parseInt(input.value) || 0;
    });
    const year = parseInt(document.getElementById('input-year').value);
    const month = parseInt(document.getElementById('input-month').value);
    const daysInMonth = Calculator.getDaysInMonth(year, month);
    const avgEl = document.getElementById('auto-avg-volume');
    const totalEl = document.getElementById('auto-total-volume');
    if (totalEl) totalEl.textContent = total.toLocaleString();
    if (avgEl) avgEl.textContent = Math.round(total / daysInMonth);
  },

  _shopScreenshots: {},

  handleScreenshotUpload(input) {
    const file = input.files[0];
    if (!file) return;
    const shopId = input.dataset.shopId;
    const reader = new FileReader();
    reader.onload = (e) => {
      this._shopScreenshots[shopId] = e.target.result;
      const td = input.closest('td');
      if (td) {
        td.innerHTML = `
          <div style="text-align:center;"><img src="${e.target.result}" class="ss-thumb" data-ss-key="${shopId}" style="height:48px;width:64px;object-fit:cover;border-radius:4px;border:1px solid #ddd;cursor:zoom-in;" title="点击查看大图">
          <div style="margin-top:4px;display:flex;gap:2px;justify-content:center;flex-wrap:wrap;">
            <button class="btn btn-secondary" style="font-size:10px;padding:2px 5px;" onclick="App.viewScreenshot('${shopId}')">查看</button>
            <button class="btn btn-success" style="font-size:10px;padding:2px 5px;" onclick="App.recognizeScreenshot(${shopId}, 'upload')">识别</button>
            <label class="btn btn-secondary" style="cursor:pointer;font-size:10px;padding:2px 5px;">更换<input type="file" accept="image/*" data-shop-id="${shopId}" data-img-type="upload" style="display:none;" onchange="App.handleScreenshotUpload(this)"></label>
            <button class="btn btn-danger" style="font-size:10px;padding:2px 5px;" onclick="App.deleteScreenshot(${shopId}, 'upload')">删除</button>
          </div></div>`;
      }
    };
    reader.readAsDataURL(file);
  },

  handleScreenshotPaste(event, shopId) {
    event.preventDefault();
    event.stopPropagation();
    const items = event.clipboardData && event.clipboardData.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (e) => {
          const key = 'paste_' + shopId;
          this._shopScreenshots[key] = e.target.result;
          const td = event.target.closest('td');
          if (td) {
            td.innerHTML = `
              <div style="text-align:center;"><img src="${e.target.result}" class="ss-thumb" data-ss-key="${key}" style="height:48px;width:64px;object-fit:cover;border-radius:4px;border:1px solid #ddd;cursor:zoom-in;" title="点击查看大图">
              <div style="margin-top:4px;display:flex;gap:2px;justify-content:center;flex-wrap:wrap;">
                <button class="btn btn-secondary" style="font-size:10px;padding:2px 5px;" onclick="App.viewScreenshot('${key}')">查看</button>
                <button class="btn btn-success" style="font-size:10px;padding:2px 5px;" onclick="App.recognizeScreenshot(${shopId}, 'paste')">识别</button>
                <div class="paste-zone" data-shop-id="${shopId}" tabindex="0" style="border:1px dashed #43e97b;border-radius:4px;padding:2px 5px;font-size:10px;color:#43e97b;cursor:pointer;background:#f0fff4;" onclick="this.focus()" onfocus="this.style.borderColor='#43e97b'" onblur="this.style.borderColor='#ccc'" onpaste="App.handleScreenshotPaste(event, ${shopId})">重粘</div>
                <button class="btn btn-danger" style="font-size:10px;padding:2px 5px;" onclick="App.deleteScreenshot(${shopId}, 'paste')">删除</button>
              </div></div>`;
          }
        };
        reader.readAsDataURL(blob);
        break;
      }
    }
  },

  deleteScreenshot(shopId, type) {
    const key = type === 'paste' ? 'paste_' + shopId : String(shopId);
    delete this._shopScreenshots[key];
    const row = event.target.closest('tr');
    if (!row) return;
    const tds = row.children;
    const tdIndex = type === 'upload' ? 3 : 4;
    const td = tds[tdIndex];
    if (type === 'upload') {
      td.innerHTML = `<div style="text-align:center;"><span style="color:#ccc;font-size:12px;">暂无截图</span>
        <div style="margin-top:4px;">
          <label class="btn btn-secondary" style="cursor:pointer;font-size:12px;padding:3px 8px;">选择图片<input type="file" accept="image/*" data-shop-id="${shopId}" data-img-type="upload" style="display:none;" onchange="App.handleScreenshotUpload(this)"></label>
        </div></div>`;
    } else {
      td.innerHTML = `<div style="text-align:center;"><span style="color:#ccc;font-size:12px;">暂无截图</span>
        <div style="margin-top:4px;">
          <div class="paste-zone" data-shop-id="${shopId}" tabindex="0" style="border:1px dashed #ccc;border-radius:4px;padding:6px 10px;font-size:12px;color:#999;cursor:pointer;min-width:80px;text-align:center;background:#fafafa;transition:border-color .2s;" onclick="this.focus()" onfocus="this.style.borderColor='#43e97b'" onblur="this.style.borderColor='#ccc'" onpaste="App.handleScreenshotPaste(event, ${shopId})">
            点击后 Ctrl+V 粘贴
          </div>
        </div></div>`;
    }
  },

  async recognizeScreenshot(shopId, type) {
    const key = type === 'paste' ? 'paste_' + shopId : String(shopId);
    const imgSrc = this._shopScreenshots[key];
    if (!imgSrc) { alert('请先上传截图'); return; }

    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '分析中...';
    btn.disabled = true;

    try {
      // 检测红框
      const boxes = await this._detectRedBoxes(imgSrc);

      if (boxes.length === 0) {
        alert('未检测到红色标注框\n\n请用截图工具的「红色方框」标注需要识别的数据（如接待量数字），然后再点击识别。');
        return;
      }

      // 加载Tesseract（首次使用需下载约10MB模型）
      btn.textContent = '加载OCR引擎...';
      await this._ensureTesseract();

      btn.textContent = '识别中...';
      // 对每个框进行OCR
      const results = [];
      for (const box of boxes) {
        const text = await this._ocrRegion(imgSrc, box);
        const numbers = this._extractNumbers(text);
        results.push({ text: text.trim(), numbers, box });
      }

      this._showRecognitionResult(shopId, results);

    } catch (err) {
      console.error('OCR识别失败:', err);
      alert('识别失败: ' + (err.message || '未知错误') + '\n\n可能原因：\n1. 网络问题导致OCR引擎加载失败\n2. 截图中红色框不明显\n3. 浏览器不支持');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  },

  _tesseractLoaded: false,
  async _ensureTesseract(onProgress) {
    if (this._tesseractLoaded) return;
    if (window.Tesseract) { this._tesseractLoaded = true; return; }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.onload = () => { this._tesseractLoaded = true; resolve(); };
      script.onerror = () => reject(new Error('加载OCR引擎失败，请检查网络'));
      document.head.appendChild(script);
    });
  },

  async _detectRedBoxes(imageSrc) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const w = canvas.width, h = canvas.height;

        // 标记红色像素 (R明显高于G和B)
        const isRed = new Uint8Array(w * h);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            const r = data[i], g = data[i + 1], b = data[i + 2];
            // 放宽阈值：R>120 且 R比G和B都高至少20
            if (r > 120 && r - g > 20 && r - b > 20) {
              isRed[y * w + x] = 1;
            }
          }
        }

        // BFS找连通区域
        const visited = new Uint8Array(w * h);
        const boxes = [];
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = y * w + x;
            if (!isRed[idx] || visited[idx]) continue;
            const queue = [{ x, y }];
            visited[idx] = 1;
            let minX = x, maxX = x, minY = y, maxY = y;
            while (queue.length) {
              const { x: cx, y: cy } = queue.shift();
              minX = Math.min(minX, cx); maxX = Math.max(maxX, cx);
              minY = Math.min(minY, cy); maxY = Math.max(maxY, cy);
              const nbrs = [{ x: cx - 1, y: cy }, { x: cx + 1, y: cy }, { x: cx, y: cy - 1 }, { x: cx, y: cy + 1 }];
              for (const n of nbrs) {
                if (n.x < 0 || n.x >= w || n.y < 0 || n.y >= h) continue;
                const ni = n.y * w + n.x;
                if (!isRed[ni] || visited[ni]) continue;
                visited[ni] = 1;
                queue.push(n);
              }
            }
            const bw = maxX - minX + 1, bh = maxY - minY + 1;
            if (bw > 25 && bh > 15) {
              boxes.push({ x: minX, y: minY, width: bw, height: bh });
            }
          }
        }
        resolve(boxes);
      };
      img.onerror = reject;
      img.src = imageSrc;
    });
  },

  async _ocrRegion(imageSrc, box) {
    const img = new Image();
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = imageSrc; });

    // 裁剪出红框内区域（去掉边框本身）
    const pad = 6;
    const cropW = Math.max(1, box.width - pad * 2);
    const cropH = Math.max(1, box.height - pad * 2);
    const canvas = document.createElement('canvas');
    canvas.width = cropW * 2;
    canvas.height = cropH * 2;
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.drawImage(img, box.x + pad, box.y + pad, cropW, cropH, 0, 0, cropW, cropH);

    // Tesseract v5 API
    const worker = await Tesseract.createWorker(['chi_sim', 'eng']);
    const ret = await worker.recognize(canvas);
    await worker.terminate();
    return ret.data.text;
  },

  _extractNumbers(text) {
    // 匹配数字，支持逗号分隔和中文数字
    const matches = text.match(/[\d,，]+/g);
    if (!matches) return [];
    return matches.map(s => parseInt(s.replace(/[,，]/g, ''))).filter(n => !isNaN(n) && n >= 0);
  },

  _showRecognitionResult(shopId, results) {
    let optionsHtml = '';
    let allNumbers = [];
    results.forEach((r, i) => {
      optionsHtml += `<div style="margin-bottom:12px;padding:12px;background:#f8f9fa;border-radius:6px;">
        <div style="font-size:12px;color:#666;margin-bottom:4px;">红框 ${i + 1} 识别结果：</div>
        <div style="font-family:monospace;background:#fff;padding:6px;border-radius:4px;border:1px solid #e0e0e0;font-size:13px;white-space:pre-wrap;">${r.text || '(无文字)'}</div>`;
      if (r.numbers.length > 0) {
        r.numbers.forEach((n, j) => {
          allNumbers.push(n);
          optionsHtml += `<button class="btn btn-primary" style="margin-top:6px;margin-right:6px;font-size:13px;" onclick="App._applyRecognizedNumber(${shopId}, ${n})">使用数值：${n.toLocaleString()}</button>`;
        });
      }
      optionsHtml += `</div>`;
    });

    if (allNumbers.length === 0) {
      optionsHtml = `<div style="color:#e94560;padding:16px;">未识别到数字，请检查红色框内是否包含数值数据，或手动输入。</div>`;
    }

    const html = `
      <div class="modal-overlay" onclick="if(event.target===this)this.remove()" style="z-index:2000;">
        <div class="modal" style="max-width:520px;max-height:80vh;overflow:auto;">
          <div class="modal-header">
            <h3>OCR识别结果</h3>
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
          </div>
          <div style="font-size:12px;color:#666;margin-bottom:12px;">检测到 ${results.length} 个红色标注框，点击下方数值按钮即可填入对应店铺的月接待量：</div>
          ${optionsHtml}
          <div style="margin-top:12px;text-align:right;">
            <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">关闭</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  },

  _applyRecognizedNumber(shopId, number) {
    const input = document.querySelector(`.shop-volume-input[data-shop-id="${shopId}"]`);
    if (input) {
      input.value = number;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    // 关闭弹窗
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
  },

  viewScreenshot(shopId) {
    const imgSrc = this._shopScreenshots[shopId];
    if (!imgSrc) return;
    this._showImageModal(imgSrc);
  },

  _showImageModal(src) {
    const html = `
      <div class="modal-overlay" onclick="if(event.target===this)this.remove()" style="z-index:2000;">
        <div style="position:relative;max-width:90vw;max-height:90vh;">
          <img src="${src}" style="max-width:90vw;max-height:90vh;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
          <button onclick="this.closest('.modal-overlay').remove()" style="position:absolute;top:-40px;right:0;background:none;border:none;color:white;font-size:28px;cursor:pointer;">&times;</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  },

  async saveMonthlyData() {
    const projectId = parseInt(document.getElementById('input-project').value);
    const year = parseInt(document.getElementById('input-year').value);
    const month = parseInt(document.getElementById('input-month').value);
    const project = await DB.getProject(projectId);
    const shopCount = parseInt(document.getElementById('shop-count').value) || 5;
    const collabDaysEl = document.getElementById('collab-days');
    const collabDays = collabDaysEl ? parseInt(collabDaysEl.value) || 0 : 0;

    // 汇总各店铺月接待量
    const shopVolumes = {};
    let totalVolume = 0;
    document.querySelectorAll('.shop-volume-input').forEach(input => {
      const shopId = parseInt(input.dataset.shopId);
      const volume = parseInt(input.value) || 0;
      shopVolumes[shopId] = volume;
      totalVolume += volume;
    });

    // 收集截图数据
    const shopScreenshots = {};
    for (const [shopId, base64] of Object.entries(this._shopScreenshots)) {
      shopScreenshots[shopId] = base64;
    }

    // 构造dailyData（用于兼容计算引擎和节假日统计）
    const daysInMonth = Calculator.getDaysInMonth(year, month);
    const dailyAvg = daysInMonth > 0 ? Math.round(totalVolume / daysInMonth) : 0;
    const dailyData = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      dailyData[dateStr] = { volume: dailyAvg };
    }

    const calculated = await Calculator.calculate(project, year, month, dailyData, shopCount, collabDays);

    // 覆盖totalVolume为实际汇总值
    calculated.totalVolume = totalVolume;
    calculated.avgDaily = dailyAvg;

    await DB.saveMonthlyRecord({ projectId, year, month, shopVolumes, totalVolume, shopCount, collabDays, shopScreenshots, calculated });
    // 清空临时截图缓存
    this._shopScreenshots = {};

    const holidayHtml = calculated.holidayCalcDetail ?
      `<div style="margin-top:8px;font-size:13px;color:#e94560;">计算方式：${calculated.holidayCalcDetail}</div>` : '';

    document.getElementById('calc-result').innerHTML = `
      <div class="card" style="margin-top:16px;border-left:4px solid #43e97b;">
        <h3 style="margin-bottom:12px;color:#2e7d32;">计算结果 - ${project.name} ${year}年${month}月</h3>
        <table class="statement-table">
          <tr><td>月总接待量（汇总）</td><td>${calculated.totalVolume.toLocaleString()}</td></tr>
          <tr><td>日均接待量</td><td>${calculated.avgDaily}（${calculated.totalVolume} / ${daysInMonth}天）</td></tr>
          <tr><td>工作日天数</td><td>${calculated.workDays}天</td></tr>
          <tr><td>节假日天数</td><td>${calculated.holidayDays}天</td></tr>
          ${calculated.holidayCalcDetail ? `<tr><td colspan="2" style="font-size:12px;color:#e94560;padding:0;">${calculated.holidayCalcDetail}</td></tr>` : ''}
          <tr style="border-top:2px solid #e8e8e8;"><td><strong>基础服务费</strong></td><td><strong>&yen;${calculated.baseFee.toLocaleString()}</strong></td></tr>
          <tr><td>节假日额外费用</td><td>&yen;${calculated.holidayExtra.toLocaleString()}</td></tr>
          <tr><td>超店铺附加费</td><td>&yen;${calculated.shopExtra.toLocaleString()}</td></tr>
          <tr><td>小计</td><td>&yen;${calculated.subtotal.toLocaleString()}</td></tr>
          <tr style="color:#e94560;font-size:16px;"><td><strong>合计（含税）</strong></td><td><strong>&yen;${calculated.total.toLocaleString()}</strong></td></tr>
          <tr><td colspan="2" style="font-size:12px;color:#999;">所有金额已含税，不再额外累加税点</td></tr>
        </table>
        ${holidayHtml}
        <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-secondary" onclick="Export.exportStatement(${projectId}, ${year}, ${month})">导出 Excel</button>
          <button class="btn btn-primary" onclick="Export.exportHtmlReport(${projectId}, ${year}, ${month})">导出 HTML（含截图）</button>
          <button class="btn btn-success" onclick="Export.exportPdfReport(${projectId}, ${year}, ${month})">导出 PDF（含截图）</button>
        </div>
      </div>
    `;
  },

  // ========== 结算单 ==========
  async renderStatement(el) {
    const projects = await DB.getAllProjects();
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    el.innerHTML = `
      <h2 style="margin-bottom:20px;">结算单</h2>
      <div class="card" style="margin-bottom:20px;">
        <div class="form-row">
          <label>项目筛选</label>
          <select id="stmt-project" onchange="App.loadStatement()">
            <option value="">全部项目</option>
            ${projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
          </select>
          <label style="min-width:40px">年</label>
          <input type="number" id="stmt-year" value="${year}" style="width:90px;" onchange="App.loadStatement()">
          <label style="min-width:40px">月</label>
          <input type="number" id="stmt-month" value="${month}" min="1" max="12" style="width:70px;" onchange="App.loadStatement()">
          <button class="btn btn-primary" onclick="App.loadStatement()">生成结算单</button>
          <button class="btn btn-success" onclick="Export.exportAllStatements(parseInt(document.getElementById('stmt-year').value), parseInt(document.getElementById('stmt-month').value))">导出全部</button>
        </div>
      </div>
      <div id="statement-content"></div>
    `;
    this.loadStatement();
  },

  async loadStatement() {
    const projectIdFilter = document.getElementById('stmt-project').value;
    const year = parseInt(document.getElementById('stmt-year').value);
    const month = parseInt(document.getElementById('stmt-month').value);

    const projects = projectIdFilter
      ? [await DB.getProject(parseInt(projectIdFilter))].filter(Boolean)
      : await DB.getAllProjects();

    let html = '';
    let grandTotal = 0;

    for (const p of projects) {
      const rec = await DB.getMonthlyRecord(p.id, year, month);
      if (!rec || !rec.calculated) {
        html += `
          <div class="card">
            <h3>${p.name} - ${year}年${month}月</h3>
            <p style="color:#999;padding:12px 0;">暂无数据，请先在"月度录入"中录入数据</p>
          </div>
        `;
        continue;
      }

      const c = rec.calculated;
      grandTotal += c.total;

      const holidaySection = c.holidayDetails && c.holidayDetails.length > 0 ? `
        <tr style="background:#fff8e1;"><td colspan="2"><strong>节假日明细</strong></td></tr>
        ${c.holidayDetails.map(h => `<tr style="background:#fff8e1;"><td style="padding-left:24px;">${h.date}</td><td>${h.name} / 接待量: ${h.volume}</td></tr>`).join('')}
      ` : '';

      html += `
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 style="margin:0;">${p.name} - ${year}年${month}月结算单</h3>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-secondary" onclick="Export.exportStatement(${p.id}, ${year}, ${month})">导出 Excel</button>
              <button class="btn btn-primary" onclick="Export.exportHtmlReport(${p.id}, ${year}, ${month})">导出 HTML（含截图）</button>
              <button class="btn btn-success" onclick="Export.exportPdfReport(${p.id}, ${year}, ${month})">导出 PDF（含截图）</button>
            </div>
          </div>
          <table class="statement-table">
            <tr><td>月总接待量</td><td>${c.totalVolume.toLocaleString()}</td></tr>
            <tr><td>日均接待量</td><td>${c.avgDaily}</td></tr>
            <tr><td>工作日</td><td>${c.workDays}天</td></tr>
            <tr><td>节假日</td><td>${c.holidayDays}天${rec.collabDays ? ' (合作' + rec.collabDays + '天)' : ''}</td></tr>
            <tr><td>店铺数量</td><td>${rec.shopCount}个</td></tr>
            ${c.holidayCalcDetail ? `<tr><td colspan="2" style="font-size:12px;color:#e94560;padding:0;">${c.holidayCalcDetail}</td></tr>` : ''}
            <tr style="border-top:2px solid #e8e8e8;"><td><strong>基础服务费</strong></td><td><strong>&yen;${c.baseFee.toLocaleString()}</strong></td></tr>
            <tr><td>节假日额外费用</td><td>&yen;${c.holidayExtra.toLocaleString()}</td></tr>
            <tr><td>超店铺附加费</td><td>&yen;${c.shopExtra.toLocaleString()}</td></tr>
            <tr><td>小计</td><td>&yen;${c.subtotal.toLocaleString()}</td></tr>
            <tr style="color:#e94560;font-size:16px;border-top:2px solid #e94560;"><td><strong>合计（含税）</strong></td><td><strong>&yen;${c.total.toLocaleString()}</strong></td></tr>
            <tr><td colspan="2" style="font-size:12px;color:#999;">所有金额已含税（${(p.invoiceRate * 100).toFixed(0)}%），不再额外累加税点</td></tr>
            ${holidaySection}
          </table>
        </div>
      `;
    }

    if (grandTotal > 0) {
      html = `
        <div class="card" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;text-align:center;padding:16px;">
          <div style="font-size:14px;opacity:0.9;">${year}年${month}月 全部项目合计</div>
          <div style="font-size:32px;font-weight:bold;margin-top:4px;">&yen;${grandTotal.toLocaleString()}</div>
        </div>
      ` + html;
    }

    document.getElementById('statement-content').innerHTML = html;
  },

  // ========== 历史查询 ==========
  async renderHistory(el) {
    const projects = await DB.getAllProjects();
    const records = await DB.getAllMonthlyRecords();
    records.sort((a, b) => (b.year * 12 + b.month) - (a.year * 12 + a.month));

    const totalPages = Math.max(1, Math.ceil(records.length / this.historyPageSize));
    if (this.historyPage > totalPages) this.historyPage = totalPages;
    const start = (this.historyPage - 1) * this.historyPageSize;
    const pageRecords = records.slice(start, start + this.historyPageSize);

    let html = `
      <h2 style="margin-bottom:20px;">历史查询</h2>
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <span>共 ${records.length} 条记录</span>
          <div class="form-row" style="margin-bottom:0;">
            <select id="hist-project" style="width:160px;">
              <option value="">全部项目</option>
              ${projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
            </select>
            <input type="number" id="hist-year" placeholder="年份" style="width:90px;">
            <button class="btn btn-secondary" onclick="App.filterHistory()">筛选</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>项目</th><th>年月</th><th>总接待量</th><th>日均</th>
              <th>基础费</th><th>假日费</th><th>附加费</th><th>合计</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
    `;

    for (const r of pageRecords) {
      const p = projects.find(proj => proj.id === r.projectId);
      if (!p || !r.calculated) continue;
      const c = r.calculated;
      html += `
        <tr>
          <td>${p.name}</td>
          <td>${r.year}年${r.month}月</td>
          <td>${c.totalVolume.toLocaleString()}</td>
          <td>${c.avgDaily}</td>
          <td>&yen;${c.baseFee.toLocaleString()}</td>
          <td>&yen;${c.holidayExtra.toLocaleString()}</td>
          <td>&yen;${c.shopExtra.toLocaleString()}</td>
          <td style="font-weight:bold;color:#e94560;">&yen;${c.total.toLocaleString()}</td>
          <td>
            <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
              <button class="btn btn-secondary" style="font-size:12px;padding:4px 10px;" onclick="Export.exportStatement(${p.id}, ${r.year}, ${r.month})">Excel</button>
              <button class="btn btn-primary" style="font-size:12px;padding:4px 10px;" onclick="Export.exportHtmlReport(${p.id}, ${r.year}, ${r.month})">HTML</button>
              <button class="btn btn-success" style="font-size:12px;padding:4px 10px;" onclick="Export.exportPdfReport(${p.id}, ${r.year}, ${r.month})">PDF</button>
              <button class="btn btn-danger" style="font-size:12px;padding:4px 8px;" onclick="App.deleteMonthlyRecord(${p.id}, ${r.year}, ${r.month})">删除</button>
            </div>
          </td>
        </tr>
      `;
    }

    html += '</tbody></table>';

    if (totalPages > 1) {
      html += `<div class="pagination">`;
      for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${i === this.historyPage ? 'active' : ''}" onclick="App.goHistoryPage(${i})">${i}</button>`;
      }
      html += '</div>';
    }

    html += '</div>';
    el.innerHTML = html;
  },

  goHistoryPage(page) {
    this.historyPage = page;
    this.renderHistory(document.getElementById('view-history'));
  },

  toggleExportDropdown(btn) {
    this.closeExportDropdowns();
    const dropdown = btn.nextElementSibling;
    if (dropdown) dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  },

  closeExportDropdowns() {
    document.querySelectorAll('.export-dropdown').forEach(d => d.style.display = 'none');
  },

  async deleteMonthlyRecord(projectId, year, month) {
    const projects = await DB.getAllProjects();
    const p = projects.find(proj => proj.id === projectId);
    const pName = p ? p.name : '';
    if (!confirm(`确定要删除 ${pName} ${year}年${month}月 的结算记录吗？\n此操作不可恢复。`)) return;
    await DB.deleteMonthlyRecord(projectId, year, month);
    this.renderHistory(document.getElementById('view-history'));
  },

  // ========== 数据备份/恢复 ==========
  async exportAllData() {
    if (!confirm('将导出所有数据（项目配置 + 月度记录 + 节假日），确定继续？')) return;
    const data = await DB.exportAll();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `拼席结算数据备份_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  async importAllData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!confirm('导入将覆盖所有现有数据，确定继续？')) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await DB.importAll(data);
        alert('数据导入成功');
        this.switchView(this.currentView);
      } catch (err) {
        alert('导入失败：' + err.message);
      }
    };
    input.click();
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
document.addEventListener('click', (e) => {
  if (!e.target.closest('.export-dropdown-wrap')) {
    App.closeExportDropdowns();
  }
});
