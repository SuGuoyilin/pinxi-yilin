const db = new Dexie('SettlementDB');

db.version(2).stores({
  projects: '++id, name',
  shops: '++id, projectId, name, platform',
  monthlyRecords: '[projectId+year+month], projectId, year, month',
  holidays: '++id, year, name'
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
      if (existing) return await db.monthlyRecords.update(existing.id || existing, record);
    } catch(e) {
      // fallback
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
  async clearAll() {
    await db.projects.clear(); await db.shops.clear();
    await db.monthlyRecords.clear(); await db.holidays.clear();
  },
  async exportAll() {
    return {
      projects: await db.projects.toArray(),
      shops: await db.shops.toArray(),
      monthlyRecords: await db.monthlyRecords.toArray(),
      holidays: await db.holidays.toArray()
    };
  },
  async importAll(data) {
    await db.transaction('rw', db.projects, db.shops, db.monthlyRecords, db.holidays, async () => {
      await db.projects.clear(); await db.shops.clear();
      await db.monthlyRecords.clear(); await db.holidays.clear();
      if (data.projects?.length) await db.projects.bulkAdd(data.projects);
      if (data.shops?.length) await db.shops.bulkAdd(data.shops);
      if (data.monthlyRecords?.length) await db.monthlyRecords.bulkAdd(data.monthlyRecords);
      if (data.holidays?.length) await db.holidays.bulkAdd(data.holidays);
    });
  }
};
