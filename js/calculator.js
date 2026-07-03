const Calculator = {
  _holidayCache: {},

  getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  },

  async loadHolidayMap(year) {
    if (this._holidayCache[year]) return this._holidayCache[year];
    const holidays = await DB.getHolidaysByYear(year);
    const map = {};
    for (const h of holidays) {
      for (const d of h.dates) {
        map[d] = h;
      }
    }
    this._holidayCache[year] = map;
    return map;
  },

  async isHoliday(dateStr) {
    const year = parseInt(dateStr.substring(0, 4));
    const map = await this.loadHolidayMap(year);
    return map[dateStr] || null;
  },

  matchTier(project, value) {
    if (!project.tiers || project.tiers.length === 0) return null;
    for (const tier of project.tiers) {
      if (value >= tier.min && value < tier.max) return tier;
    }
    const last = project.tiers[project.tiers.length - 1];
    if (value >= last.min) return last;
    return project.tiers[0];
  },

  async calculate(project, year, month, dailyData, shopCount, collabDays) {
    const daysInMonth = this.getDaysInMonth(year, month);
    let totalVolume = 0;
    let workDays = 0;
    let holidayDays = 0;
    let holidayVolume = 0;
    const holidayDetails = [];

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
        holidayDetails.push({ date: dateStr, name: holiday.name, volume });
      } else {
        workDays++;
      }
    }

    const totalDays = workDays + holidayDays;

    let baseFee = 0;
    let avgDaily = totalDays > 0 ? Math.round(totalVolume / totalDays) : 0;
    let matchedTier = null;

    if (project.calculationType === 'daily_avg') {
      matchedTier = this.matchTier(project, avgDaily);
      baseFee = matchedTier ? matchedTier.price : 0;
    } else if (project.calculationType === 'monthly_total') {
      matchedTier = this.matchTier(project, totalVolume);
      baseFee = matchedTier ? matchedTier.price : 0;
    } else if (project.calculationType === 'hourly') {
      baseFee = 0;
    }

    let holidayExtra = 0;
    let holidayCalcDetail = '';
    if (baseFee > 0 && holidayDays > 0) {
      const dailyBase = totalDays > 0 ? baseFee / totalDays : 0;
      const holidayTable = project.holidayTable || [];
      const isStandard = project.holidayPayMethod === 'standard';
      const methodLabel = isStandard ? '标准计薪' : '合作计薪';

      let totalPayDays = 0;
      let totalExtra = 0;
      const detailParts = [];

      for (const d of holidayDetails) {
        const config = holidayTable.find(ht => ht.name === d.name);
        const payDays = isStandard
          ? (config?.standardPayDays ?? d.standardPayDays ?? 0)
          : (config?.coopPayDays ?? d.coopPayDays ?? 0);
        const multiplier = isStandard
          ? (config?.standardPayMultiplier ?? d.standardPayMultiplier ?? 1)
          : (config?.coopPayMultiplier ?? d.coopPayMultiplier ?? 1);

        if (payDays > 0 && multiplier > 1) {
          totalPayDays += payDays;
          const extra = dailyBase * payDays * (multiplier - 1);
          totalExtra += extra;
          detailParts.push(`${d.name}${payDays}天×${multiplier}倍(额外${multiplier-1}倍)`);
        }
      }

      holidayExtra = Math.round(totalExtra);
      if (detailParts.length > 0) {
        holidayCalcDetail = `${methodLabel}：日薪¥${dailyBase.toFixed(2)} × 计薪${totalPayDays}天 × 平均额外${totalPayDays > 0 ? (totalExtra / (dailyBase * totalPayDays)).toFixed(1) : 0}倍 = 额外¥${holidayExtra.toLocaleString()}（${detailParts.join('、')}）`;
      }
    }

    let shopExtra = 0;
    const effectiveShopLimit = matchedTier ? (matchedTier.shopLimit || project.baseShopLimit || 5) : (project.baseShopLimit || 5);
    if (shopCount > effectiveShopLimit) {
      shopExtra = (shopCount - effectiveShopLimit) * (project.extraShopFee || 100);
    }

    const subtotal = baseFee + holidayExtra + shopExtra;
    // 注：项目金额已含税，不再额外累加税点
    const tax = 0;
    const total = subtotal;

    return {
      totalVolume,
      avgDaily,
      workDays,
      holidayDays,
      holidayDetails,
      holidayCalcDetail,
      baseFee: Math.round(baseFee),
      holidayExtra: Math.round(holidayExtra),
      shopExtra: Math.round(shopExtra),
      subtotal: Math.round(subtotal),
      tax,
      total: Math.round(total)
    };
  }
};
