const Export = {
  importExcel() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const year = parseInt(document.getElementById('input-year').value);
        let importCount = 0;
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || !row[0]) continue;
          let dateStr = String(row[0]).trim();
          const volume = parseInt(row[1]) || 0;
          if (volume === 0) continue;
          if (/^\d{1,2}-\d{1,2}$/.test(dateStr)) dateStr = `${year}-${dateStr.padStart(5, '0')}`;
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const el = document.querySelector(`.day-input[data-date="${dateStr}"]`);
            if (el) { el.value = volume; importCount++; }
          }
        }
        alert(`成功导入 ${importCount} 天数据`);
      } catch (err) { alert('导入失败：' + err.message); }
    };
    input.click();
  },

  exportMonthData() {
    const year = document.getElementById('input-year').value;
    const month = document.getElementById('input-month').value;
    const rows = [['日期', '接待量', '是否节假日']];
    document.querySelectorAll('.day-input').forEach(input => {
      const date = input.dataset.date;
      const volume = parseInt(input.value) || 0;
      const holidayTag = input.closest('tr').style.background ? '是' : '否';
      rows.push([date, volume, holidayTag]);
    });
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ width: 15 }, { width: 12 }, { width: 12 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${year}-${month}`);
    XLSX.writeFile(wb, `接待量_${year}-${month}.xlsx`);
  },

  async exportStatement(projectId, year, month) {
    const project = await DB.getProject(projectId);
    const record = await DB.getMonthlyRecord(projectId, year, month);
    if (!record || !record.calculated) { alert('暂无该月结算数据'); return; }
    const c = record.calculated;
    const shops = await DB.getShopsByProject(projectId);
    const screenshots = record.shopScreenshots || {};

    const rows = [
      ['拼席月度结算单'],
      ['项目名称', project.name],
      ['结算月份', `${year}年${month}月`],
      ['店铺数量', record.shopCount || '-'],
      [],
      ['--- 店铺接待量明细 ---'],
      ['序号', '店铺名称', '平台', '月接待量', '上传截图', '粘贴截图']
    ];

    if (record.shopVolumes && shops.length > 0) {
      shops.forEach((s, i) => {
        const hasUpload = screenshots[s.id] ? '有' : '无';
        const hasPaste = screenshots['paste_' + s.id] ? '有' : '无';
        rows.push([i + 1, s.name, s.platform, record.shopVolumes[s.id] || 0, hasUpload, hasPaste]);
      });
    }
    rows.push(['', '合计', '', c.totalVolume, '', '']);

    rows.push(
      [],
      ['--- 数据汇总 ---'],
      ['月总接待量', c.totalVolume],
      ['日均接待量', c.avgDaily],
      ['工作日天数', `${c.workDays}天`],
      ['节假日天数', `${c.holidayDays}天`],
      ['节假日计薪方式', record.calculated?.holidayCalcDetail?.includes('标准计薪') ? '标准计薪' : '合作计薪'],
      [],
      ['--- 费用明细 ---'],
      ['基础服务费', c.baseFee],
      ['节假日额外费用', c.holidayExtra],
      ['超店铺附加费', c.shopExtra],
      ['小计', c.subtotal],
      ['合计（含税）', c.total],
      [],
      ['所有金额已含税']
    );

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [
      { width: 6 },
      { width: 28 },
      { width: 12 },
      { width: 14 },
      { width: 10 },
      { width: 10 }
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '结算单');
    XLSX.writeFile(wb, `结算单_${project.name}_${year}年${month}月.xlsx`);
  },

  async exportHtmlReport(projectId, year, month) {
    const project = await DB.getProject(projectId);
    const record = await DB.getMonthlyRecord(projectId, year, month);
    if (!record || !record.calculated) { alert('暂无该月结算数据'); return; }
    const c = record.calculated;
    const shops = await DB.getShopsByProject(projectId);
    const screenshots = record.shopScreenshots || {};

    let shopRows = '';
    for (const s of shops) {
      const volume = record.shopVolumes && record.shopVolumes[s.id] ? record.shopVolumes[s.id] : 0;
      const uploadImg = screenshots[s.id]
        ? `<div style="margin-top:4px;"><img src="${screenshots[s.id]}" style="max-width:280px;max-height:180px;border:1px solid #ddd;border-radius:4px;"></div>`
        : '<span style="color:#999;font-size:12px;">-</span>';
      const pasteImg = screenshots['paste_' + s.id]
        ? `<div style="margin-top:4px;"><img src="${screenshots['paste_' + s.id]}" style="max-width:280px;max-height:180px;border:1px solid #ddd;border-radius:4px;"></div>`
        : '<span style="color:#999;font-size:12px;">-</span>';
      shopRows += `
        <tr>
          <td>${s.platform}</td>
          <td>${s.name}</td>
          <td style="text-align:right;font-weight:bold;">${volume.toLocaleString()}</td>
          <td>${uploadImg}</td>
          <td>${pasteImg}</td>
        </tr>`;
    }

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${project.name} ${year}年${month}月结算单</title>
<style>
*{box-sizing:border-box;}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;max-width:960px;margin:24px auto;padding:24px;background:#fff;color:#333;line-height:1.6;}
h1{text-align:center;border-bottom:3px solid #1a1a2e;padding-bottom:12px;margin-bottom:20px;font-size:22px;}
table{width:100%;border-collapse:collapse;margin:12px 0;font-size:14px;}
th,td{border:1px solid #e0e0e0;padding:10px 12px;text-align:left;}
th{background:#f5f5f5;font-weight:600;font-size:13px;}
.summary{background:#f8f9fa;padding:16px 20px;border-radius:8px;margin:16px 0;display:flex;gap:32px;flex-wrap:wrap;}
.summary-item{min-width:120px;}
.summary-label{font-size:12px;color:#999;}
.summary-value{font-size:18px;font-weight:bold;color:#1a1a2e;}
.total-row{font-size:18px;color:#e94560;font-weight:bold;}
.footer{margin-top:32px;text-align:center;color:#999;font-size:12px;border-top:1px solid #eee;padding-top:16px;}
img{max-width:100%;}
</style></head><body>
<h1>${project.name} - ${year}年${month}月结算单</h1>
<div class="summary">
  <div class="summary-item"><div class="summary-label">结算方式</div><div class="summary-value">${project.calculationType === 'daily_avg' ? '日均接待量' : project.calculationType === 'monthly_total' ? '月总接待量' : '按小时计费'}</div></div>
  <div class="summary-item"><div class="summary-label">店铺数量</div><div class="summary-value">${record.shopCount || '-'}</div></div>
  <div class="summary-item"><div class="summary-label">月总接待量</div><div class="summary-value">${c.totalVolume.toLocaleString()}</div></div>
  <div class="summary-item"><div class="summary-label">日均接待量</div><div class="summary-value">${c.avgDaily}</div></div>
</div>
<h3>店铺接待量明细（含截图凭证）</h3>
<table>
  <thead><tr><th>平台</th><th>店铺名称</th><th style="text-align:right;">月接待量</th><th>上传截图</th><th>粘贴截图</th></tr></thead>
  <tbody>${shopRows}</tbody>
</table>
<h3>费用明细</h3>
<table>
  <tr><td style="width:200px;">基础服务费</td><td style="text-align:right;">&yen;${c.baseFee.toLocaleString()}</td></tr>
  <tr><td>节假日额外费用</td><td style="text-align:right;">&yen;${c.holidayExtra.toLocaleString()}</td></tr>
  <tr><td>超店铺附加费</td><td style="text-align:right;">&yen;${c.shopExtra.toLocaleString()}</td></tr>
  <tr><td>小计</td><td style="text-align:right;">&yen;${c.subtotal.toLocaleString()}</td></tr>
  <tr class="total-row"><td>合计（含税）</td><td style="text-align:right;">&yen;${c.total.toLocaleString()}</td></tr>
  <tr><td colspan="2" style="font-size:12px;color:#999;">所有金额已含税，不再额外累加税点</td></tr>
</table>
${c.holidayCalcDetail ? `<p style="color:#e94560;font-size:13px;margin-top:8px;">节假日计算：${c.holidayCalcDetail}</p>` : ''}
<div class="footer">拼席月度结算管理系统 | 生成时间：${new Date().toLocaleString('zh-CN')}</div>
</body></html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `结算单_${project.name}_${year}年${month}月.html`;
    a.click();
    URL.revokeObjectURL(url);
  },

  async exportPdfReport(projectId, year, month) {
    try {
      const project = await DB.getProject(projectId);
      if (!project) { alert('未找到项目信息'); return; }
      const record = await DB.getMonthlyRecord(projectId, year, month);
      if (!record || !record.calculated) { alert('暂无该月结算数据，请先保存并计算'); return; }
      const c = record.calculated;
      const shops = await DB.getShopsByProject(projectId);
      const screenshots = record.shopScreenshots || {};

    let shopRows = '';
    for (const s of shops) {
      const volume = record.shopVolumes && record.shopVolumes[s.id] ? record.shopVolumes[s.id] : 0;
      const uploadImg = screenshots[s.id]
        ? `<img src="${screenshots[s.id]}" style="max-width:200px;max-height:140px;border:1px solid #ddd;border-radius:3px;">`
        : '<span style="color:#ccc;">-</span>';
      const pasteImg = screenshots['paste_' + s.id]
        ? `<img src="${screenshots['paste_' + s.id]}" style="max-width:200px;max-height:140px;border:1px solid #ddd;border-radius:3px;">`
        : '<span style="color:#ccc;">-</span>';
      shopRows += `
        <tr>
          <td style="border:1px solid #e0e0e0;padding:8px;font-size:13px;">${s.platform}</td>
          <td style="border:1px solid #e0e0e0;padding:8px;font-size:13px;">${s.name}</td>
          <td style="border:1px solid #e0e0e0;padding:8px;text-align:right;font-weight:bold;font-size:13px;">${volume.toLocaleString()}</td>
          <td style="border:1px solid #e0e0e0;padding:8px;text-align:center;vertical-align:middle;">${uploadImg}</td>
          <td style="border:1px solid #e0e0e0;padding:8px;text-align:center;vertical-align:middle;">${pasteImg}</td>
        </tr>`;
    }

    const printHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${project.name} ${year}年${month}月结算单</title>
<style>
@page { size: A4; margin: 15mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif; color: #333; font-size: 13px; line-height: 1.6; }
h1 { text-align: center; font-size: 20px; border-bottom: 2px solid #1a1a2e; padding-bottom: 10px; margin-bottom: 16px; }
.summary { display: flex; gap: 24px; padding: 12px 16px; background: #f8f9fa; border-radius: 6px; margin-bottom: 16px; }
.summary .label { font-size: 11px; color: #999; }
.summary .val { font-size: 15px; font-weight: bold; }
h2 { font-size: 15px; margin: 16px 0 8px; border-left: 3px solid #e94560; padding-left: 8px; }
table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
th { background: #f0f0f0; border: 1px solid #e0e0e0; padding: 8px; font-size: 12px; text-align: center; }
td { font-size: 13px; }
.fee-row td { border: 1px solid #e0e0e0; padding: 8px 12px; }
.total-row { color: #e94560; font-weight: bold; font-size: 15px; }
img { max-width: 100%; }
.footer { text-align: center; color: #999; font-size: 10px; border-top: 1px solid #eee; padding-top: 8px; margin-top: 20px; }
.note { font-size: 11px; color: #999; margin-top: 8px; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body>
<h1>${project.name} - ${year}年${month}月结算单</h1>
<div class="summary">
  <div><div class="label">结算方式</div><div class="val">${project.calculationType === 'daily_avg' ? '日均接待量' : '月总接待量'}</div></div>
  <div><div class="label">店铺数量</div><div class="val">${record.shopCount || '-'}</div></div>
  <div><div class="label">月总接待量</div><div class="val">${c.totalVolume.toLocaleString()}</div></div>
  <div><div class="label">日均接待量</div><div class="val">${c.avgDaily}</div></div>
  <div><div class="label">工作日</div><div class="val">${c.workDays}天</div></div>
  <div><div class="label">节假日</div><div class="val">${c.holidayDays}天</div></div>
</div>
<h2>店铺接待量明细</h2>
<table>
  <thead><tr><th style="width:60px;">平台</th><th>店铺名称</th><th style="width:80px;text-align:right;">月接待量</th><th style="width:120px;">上传截图</th><th style="width:120px;">粘贴截图</th></tr></thead>
  <tbody>
    ${shopRows}
    <tr style="background:#f5f5f5;font-weight:bold;"><td colspan="2" style="border:1px solid #e0e0e0;padding:8px;text-align:right;">合计</td><td style="border:1px solid #e0e0e0;padding:8px;text-align:right;">${c.totalVolume.toLocaleString()}</td><td colspan="2" style="border:1px solid #e0e0e0;"></td></tr>
  </tbody>
</table>
<h2>费用明细</h2>
<table>
  <tr class="fee-row"><td>基础服务费</td><td style="text-align:right;">&yen;${c.baseFee.toLocaleString()}</td></tr>
  <tr class="fee-row"><td>节假日额外费用</td><td style="text-align:right;">&yen;${c.holidayExtra.toLocaleString()}</td></tr>
  <tr class="fee-row"><td>超店铺附加费</td><td style="text-align:right;">&yen;${c.shopExtra.toLocaleString()}</td></tr>
  <tr class="fee-row"><td>小计</td><td style="text-align:right;">&yen;${c.subtotal.toLocaleString()}</td></tr>
  <tr class="fee-row total-row"><td>合计（含税）</td><td style="text-align:right;">&yen;${c.total.toLocaleString()}</td></tr>
</table>
${c.holidayCalcDetail ? `<div class="note">节假日计算：${c.holidayCalcDetail}</div>` : ''}
<div class="note">所有金额已含税，不再额外累加税点</div>
<div class="footer">拼席月度结算管理系统 | 生成时间：${new Date().toLocaleString('zh-CN')}</div>
<p style="text-align:center;margin-top:16px;font-size:14px;color:#666;">按 <strong>Ctrl+P</strong>（或 Cmd+P）可打印/保存为 PDF</p>
</body></html>`;

    // 直接下载为HTML文件（用户打开后按Ctrl+P打印为PDF）
    const blob = new Blob([printHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `结算单_${project.name}_${year}年${month}月_打印版.html`;
    a.click();
    URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF导出失败:', err);
      alert('PDF导出失败: ' + err.message);
    }
  },

  async exportAllStatements(year, month) {
    const projects = await DB.getAllProjects();
    const wb = XLSX.utils.book_new();
    for (const p of projects) {
      const record = await DB.getMonthlyRecord(p.id, year, month);
      if (!record || !record.calculated) continue;
      const c = record.calculated;
      const rows = [
        ['项目', p.name],
        ['月份', `${year}年${month}月`],
        ['月总接待量', c.totalVolume],
        ['日均接待量', c.avgDaily],
        ['基础服务费', c.baseFee],
        ['节假日额外费用', c.holidayExtra],
        ['超店铺附加费', c.shopExtra],
        ['小计', c.subtotal],
        ['合计（含税）', c.total]
      ];
      const ws = XLSX.utils.aoa_to_sheet(rows);
      const sheetName = p.name.substring(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }
    XLSX.writeFile(wb, `全部结算单_${year}年${month}月.xlsx`);
  }
};
