const db = new Dexie('SettlementDB');

db.version(4).stores({
  projects: '++id, name',
  shops: '++id, projectId, name, platform',
  monthlyRecords: '[projectId+year+month], projectId, year, month',
  holidays: '++id, year, name',
  accounts: '++id, projectName, platform, shopName, account, status',
  invoices: '++id, projectName, year, month',
  invoiceRecords: '++id, invoiceId, year, month, projectName'
});

const DB = {
  async getAllProjects() { return await db.projects.toArray(); },
  async getProject(id) { return await db.projects.get(id); },
  async addProject(project) { return await db.projects.add(project); },
  async updateProject(id, changes) { return await db.projects.update(id, changes); },
  async deleteProject(id) {
    await db.monthlyRecords.where({ projectId: id }).delete();
    await db.shops.where({ projectId: id }).delete();
    return await db.projects.delete(id);
  },

  async getShopsByProject(projectId) { return await db.shops.where({ projectId }).toArray(); },
  async getAllShops() { return await db.shops.toArray(); },
  async addShop(shop) { return await db.shops.add(shop); },
  async updateShop(id, changes) { return await db.shops.update(id, changes); },
  async deleteShop(id) { return await db.shops.delete(id); },

  async getMonthlyRecord(projectId, year, month) {
    try {
      return await db.monthlyRecords.get([projectId, year, month]);
    } catch(e) {
      const all = await db.monthlyRecords.toArray();
      return all.find(r => r.projectId === projectId && r.year === year && r.month === month) || null;
    }
  },
  async saveMonthlyRecord(record) {
    try {
      const existing = await db.monthlyRecords.get([record.projectId, record.year, record.month]);
      if (existing) return await db.monthlyRecords.update([record.projectId, record.year, record.month], record);
    } catch(e) {
      console.error('saveMonthlyRecord error:', e);
    }
    return await db.monthlyRecords.add(record);
  },
  async getMonthlyRecordsByProject(projectId) { return await db.monthlyRecords.where({ projectId }).toArray(); },
  async getAllMonthlyRecords() { return await db.monthlyRecords.toArray(); },
  async deleteMonthlyRecord(projectId, year, month) {
    try {
      return await db.monthlyRecords.delete([projectId, year, month]);
    } catch(e) {
      console.error('deleteMonthlyRecord error:', e);
      // fallback: 遍历查找
      const all = await db.monthlyRecords.toArray();
      const found = all.find(r => r.projectId === projectId && r.year === year && r.month === month);
      if (found) return await db.monthlyRecords.delete(found.id || found[db.monthlyRecords.schema.primKey.keyPath]);
    }
  },

  async getHolidaysByYear(year) { return await db.holidays.where({ year }).toArray(); },
  async getAllHolidays() { return await db.holidays.toArray(); },
  async saveHoliday(holiday) { return await db.holidays.add(holiday); },
  async saveHolidaysBatch(holidays) { return await db.holidays.bulkAdd(holidays); },

  async getAllAccounts() { return await db.accounts.toArray(); },
  async addAccount(account) { return await db.accounts.add(account); },
  async updateAccount(id, changes) { return await db.accounts.update(id, changes); },
  async deleteAccount(id) { return await db.accounts.delete(id); },

  // ========== 发票管理 ==========
  async saveInvoice(record) {
    const existing = await db.invoices.where({ projectName: record.projectName }).first();
    if (existing) {
      return await db.invoices.update(existing.id, record);
    }
    return await db.invoices.add(record);
  },
  async getInvoiceByProject(projectName) {
    return await db.invoices.where({ projectName }).first();
  },
  async getAllInvoices() {
    return await db.invoices.toArray();
  },
  async deleteInvoice(id) {
    await db.invoiceRecords.where({ invoiceId: id }).delete();
    return await db.invoices.delete(id);
  },

  // 发票开票记录（每月的开票状态）
  async saveInvoiceRecord(record) {
    const existing = await db.invoiceRecords
      .where({ invoiceId: record.invoiceId, year: record.year, month: record.month })
      .first();
    if (existing) {
      return await db.invoiceRecords.update(existing.id, record);
    }
    return await db.invoiceRecords.add(record);
  },
  async getInvoiceRecordsByMonth(year, month) {
    return await db.invoiceRecords.where({ year, month }).toArray();
  },
  async getInvoiceRecord(invoiceId, year, month) {
    return await db.invoiceRecords
      .where({ invoiceId, year, month })
      .first();
  },
  async deleteInvoiceRecord(id) {
    return await db.invoiceRecords.delete(id);
  },

  async clearAll() {
    await db.projects.clear(); await db.shops.clear();
    await db.monthlyRecords.clear(); await db.holidays.clear();
    await db.accounts.clear(); await db.invoices.clear();
    await db.invoiceRecords.clear();
  },
  async exportAll() {
    return {
      projects: await db.projects.toArray(),
      shops: await db.shops.toArray(),
      monthlyRecords: await db.monthlyRecords.toArray(),
      holidays: await db.holidays.toArray(),
      accounts: await db.accounts.toArray(),
      invoices: await db.invoices.toArray(),
      invoiceRecords: await db.invoiceRecords.toArray()
    };
  },
  async importAll(data) {
    await db.transaction('rw', db.projects, db.shops, db.monthlyRecords, db.holidays, db.accounts, db.invoices, db.invoiceRecords, async () => {
      await db.projects.clear(); await db.shops.clear();
      await db.monthlyRecords.clear(); await db.holidays.clear();
      await db.accounts.clear(); await db.invoices.clear();
      await db.invoiceRecords.clear();
      if (data.projects?.length) await db.projects.bulkAdd(data.projects);
      if (data.shops?.length) await db.shops.bulkAdd(data.shops);
      if (data.monthlyRecords?.length) await db.monthlyRecords.bulkAdd(data.monthlyRecords);
      if (data.holidays?.length) await db.holidays.bulkAdd(data.holidays);
      if (data.accounts?.length) await db.accounts.bulkAdd(data.accounts);
      if (data.invoices?.length) await db.invoices.bulkAdd(data.invoices);
      if (data.invoiceRecords?.length) await db.invoiceRecords.bulkAdd(data.invoiceRecords);
    });
  }
};
