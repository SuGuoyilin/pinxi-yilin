const INITIAL_PROJECTS = [
  {
    name: '妲润项目',
    calculationType: 'daily_avg',
    tiers: [
      { min: 0, max: 21, price: 700, shopLimit: 5 },
      { min: 21, max: 41, price: 1200, shopLimit: 5 },
      { min: 41, max: 61, price: 1700, shopLimit: 5 },
      { min: 61, max: 81, price: 2200, shopLimit: 5 },
      { min: 81, max: 101, price: 2700, shopLimit: 5 },
      { min: 101, max: 121, price: 3200, shopLimit: 5 },
      { min: 121, max: 141, price: 3700, shopLimit: 5 },
      { min: 141, max: 161, price: 4200, shopLimit: 5 }
    ],
    extraShopFee: 100,
    baseShopLimit: 5,
    workTime: '早班08:00-16:00 / 晚班16:00-24:00',
    contractStartDate: '2026-03-01',
    restDays: 0,
    holidayRule: 'standard',
    holidayPayMethod: 'standard',
    holidayTable: [
      { name: '元旦', daysOff: 1, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
      { name: '春节', daysOff: 8, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 3, coopPayMultiplier: 3 },
      { name: '清明节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
      { name: '劳动节', daysOff: 5, standardPayDays: 2, standardPayMultiplier: 3, coopPayDays: 2, coopPayMultiplier: 3 },
      { name: '端午节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
      { name: '中秋节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
      { name: '国庆节', daysOff: 7, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 3, coopPayMultiplier: 3 }
    ],
    overtimeRate: 20,
    invoiceRate: 0.01,
    description: '售前售后接待、后台处理、评价回复、工单'
  },
  {
    name: '博思项目',
    calculationType: 'daily_avg',
    tiers: [
      { min: 1, max: 50, price: 1600, shopLimit: 5 },
      { min: 51, max: 100, price: 1900, shopLimit: 5 },
      { min: 100, max: 200, price: 2800, shopLimit: 5 }
    ],
    extraShopFee: 100,
    baseShopLimit: 5,
    workTime: '早班08:00-16:00 / 晚班16:00-24:00',
    contractStartDate: '2026-01-01',
    restDays: 0,
    holidayRule: 'cooperative',
    holidayPayMethod: 'cooperative',
    holidayTable: [
      { name: '元旦', daysOff: 1, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 2 },
      { name: '春节', daysOff: 8, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 7, coopPayMultiplier: 2 },
      { name: '清明节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 2 },
      { name: '劳动节', daysOff: 5, standardPayDays: 2, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 2 },
      { name: '端午节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 2 },
      { name: '中秋节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 2 },
      { name: '国庆节', daysOff: 7, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 2 }
    ],
    overtimeRate: 20,
    invoiceRate: 0.01,
    description: '售前售后接待。节假日按合作天数计算'
  },
  {
    name: '讨师项目',
    calculationType: 'daily_avg',
    tiers: [
      { min: 0, max: 21, price: 500, shopLimit: 5 },
      { min: 21, max: 41, price: 1000, shopLimit: 5 },
      { min: 41, max: 61, price: 1500, shopLimit: 5 },
      { min: 61, max: 81, price: 2000, shopLimit: 5 },
      { min: 81, max: 101, price: 2500, shopLimit: 5 }
    ],
    extraShopFee: 100,
    baseShopLimit: 5,
    workTime: '早班08:00-16:00 / 晚班16:00-24:00',
    contractStartDate: '2026-04-01',
    restDays: 0,
    holidayRule: 'standard',
    holidayPayMethod: 'standard',
    holidayTable: [
      { name: '元旦', daysOff: 1, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
      { name: '春节', daysOff: 8, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 3, coopPayMultiplier: 3 },
      { name: '清明节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
      { name: '劳动节', daysOff: 5, standardPayDays: 2, standardPayMultiplier: 3, coopPayDays: 2, coopPayMultiplier: 3 },
      { name: '端午节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
      { name: '中秋节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
      { name: '国庆节', daysOff: 7, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 3, coopPayMultiplier: 3 }
    ],
    overtimeRate: 20,
    invoiceRate: 0.01,
    description: '售前售后接待'
  },
  {
    name: '森昊项目',
    calculationType: 'monthly_total',
    tiers: [
      { min: 0, max: 1501, price: 1500 },
      { min: 1501, max: 3001, price: 2000 },
      { min: 3001, max: 4501, price: 2500 },
      { min: 4501, max: 6001, price: 3000 },
      { min: 6001, max: 7501, price: 3500 },
      { min: 7501, max: 9001, price: 4000 },
      { min: 9001, max: Infinity, price: 5000 }
    ],
    extraShopFee: 200,
    baseShopLimit: 6,
    workTime: '08:00-24:00',
    contractStartDate: '2026-05-15',
    restDays: 0,
    holidayRule: 'cooperative',
    holidayPayMethod: 'cooperative',
    holidayTable: [
      { name: '元旦', daysOff: 1, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
      { name: '春节', daysOff: 8, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 7, coopPayMultiplier: 3 },
      { name: '清明节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
      { name: '劳动节', daysOff: 5, standardPayDays: 2, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
      { name: '端午节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
      { name: '中秋节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
      { name: '国庆节', daysOff: 7, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 }
    ],
    overtimeRate: 20,
    invoiceRate: 0.01,
    description: '售前接待&售后基本处理，平台：抖音/阿里/拼多多，共计6个基础店铺。节假日按合作天数计算'
  },
  {
    name: '悦泰项目（兼职）',
    calculationType: 'hourly',
    tiers: [],
    onlineRate: 30.30,
    offlineRate: 20.20,
    baseShopLimit: 0,
    extraShopFee: 0,
    workTime: '早班08:00-16:00 / 晚班16:00-24:00',
    contractStartDate: '2024-02-01',
    restDays: 0,
    holidayRule: 'standard',
    holidayPayMethod: 'standard',
    holidayTable: [
      { name: '元旦', daysOff: 1, standardPayDays: 1, standardPayMultiplier: 2, coopPayDays: 1, coopPayMultiplier: 2 },
      { name: '春节', daysOff: 8, standardPayDays: 3, standardPayMultiplier: 2, coopPayDays: 3, coopPayMultiplier: 2 },
      { name: '清明节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 2, coopPayDays: 1, coopPayMultiplier: 2 },
      { name: '劳动节', daysOff: 5, standardPayDays: 2, standardPayMultiplier: 2, coopPayDays: 2, coopPayMultiplier: 2 },
      { name: '端午节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 2, coopPayDays: 1, coopPayMultiplier: 2 },
      { name: '中秋节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 2, coopPayDays: 1, coopPayMultiplier: 2 },
      { name: '国庆节', daysOff: 7, standardPayDays: 3, standardPayMultiplier: 2, coopPayDays: 3, coopPayMultiplier: 2 }
    ],
    overtimeRate: 20,
    invoiceRate: 0.01,
    description: '按小时计费，上线值班30.30元/小时/人，未上线值班20.20元/小时/人'
  },
  {
    name: '益生菌项目',
    calculationType: 'daily_avg',
    tiers: [
      { min: 0, max: 21, price: 700, shopLimit: 5 },
      { min: 21, max: 41, price: 1200, shopLimit: 5 },
      { min: 41, max: 61, price: 1700, shopLimit: 5 },
      { min: 61, max: 81, price: 2200, shopLimit: 5 },
      { min: 81, max: 101, price: 2700, shopLimit: 5 }
    ],
    extraShopFee: 100,
    baseShopLimit: 5,
    workTime: '早班08:00-16:00 / 晚班16:00-24:00',
    contractStartDate: '2026-03-28',
    restDays: 0,
    holidayRule: 'standard',
    holidayPayMethod: 'standard',
    holidayTable: [
      { name: '元旦', daysOff: 1, standardPayDays: 1, standardPayMultiplier: 2, coopPayDays: 1, coopPayMultiplier: 2 },
      { name: '春节', daysOff: 8, standardPayDays: 3, standardPayMultiplier: 2, coopPayDays: 3, coopPayMultiplier: 2 },
      { name: '清明节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 2, coopPayDays: 1, coopPayMultiplier: 2 },
      { name: '劳动节', daysOff: 5, standardPayDays: 2, standardPayMultiplier: 2, coopPayDays: 2, coopPayMultiplier: 2 },
      { name: '端午节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 2, coopPayDays: 1, coopPayMultiplier: 2 },
      { name: '中秋节', daysOff: 3, standardPayDays: 1, standardPayMultiplier: 2, coopPayDays: 1, coopPayMultiplier: 2 },
      { name: '国庆节', daysOff: 7, standardPayDays: 3, standardPayMultiplier: 2, coopPayDays: 3, coopPayMultiplier: 2 }
    ],
    overtimeRate: 20,
    invoiceRate: 0.01,
    description: '专席项目，拼席员工代为承接。具体结算标准待配置'
  }
];

const INITIAL_SHOPS = [
  // 妲润项目店铺
  { projectId: 1, name: 'DahRuem妲润企业店', platform: '抖音' },
  { projectId: 1, name: 'DahRuem妲润旗舰店', platform: '天猫' },
  { projectId: 1, name: '妲润旗舰店', platform: '拼多多' },
  { projectId: 1, name: '妲润旗舰店', platform: '小红书' },
  { projectId: 1, name: '妲润及洲专卖店', platform: '快手' },
  { projectId: 1, name: '妲润及洲护肤店', platform: '微信小店' },
  // 博思项目店铺
  { projectId: 2, name: '小布点童品2号店', platform: '抖音' },
  { projectId: 2, name: '天使儿童布衣童装店', platform: '抖音' },
  { projectId: 2, name: '博思服装服饰店', platform: '抖音' },
  { projectId: 2, name: '待定', platform: '抖音' },
  // 讨师项目店铺
  { projectId: 3, name: '讨师的小店', platform: '抖音' },
  { projectId: 3, name: '讨师的小店', platform: '天猫' },
  { projectId: 3, name: '讨师的小店', platform: '小红书' },
  // 森昊项目店铺
  { projectId: 4, name: '安吉小鸭童装', platform: '1688' },
  { projectId: 4, name: '米恬恬母婴', platform: '1688' },
  { projectId: 4, name: '安小丫童装', platform: '1688' },
  { projectId: 4, name: '安吉小鸭母婴', platform: '抖音' },
  { projectId: 4, name: '安吉小鸭母婴旗舰店', platform: '拼多多' },
  { projectId: 4, name: '卓森母婴童装', platform: '拼多多' },
  // 益生菌项目店铺
  { projectId: 6, name: 'biomagic旗舰店', platform: '天猫' },
  { projectId: 6, name: 'BIOMAGIC官方旗舰店', platform: '京东' },
  { projectId: 6, name: 'BIOMAGIC旗舰店', platform: '拼多多' },
  { projectId: 6, name: 'BioMagic益生菌', platform: '有赞' },
  { projectId: 6, name: '味匠调味品企业店', platform: '抖音' },
  { projectId: 6, name: 'BIOMAGIC官方旗舰店', platform: '抖音' },
  { projectId: 6, name: 'BIOMAGIC益生菌旗舰店', platform: '小红书' },
  { projectId: 6, name: '味匠食品科技的店', platform: '小红书' },
  { projectId: 6, name: '味匠调味品企业店', platform: '微店' },
  { projectId: 6, name: 'BioMagic', platform: '微店' },
  { projectId: 6, name: 'BIOMAGIC企业店', platform: '微信小店' },
  { projectId: 6, name: '味匠调味品企业店', platform: '微信小店' }
];

const INITIAL_HOLIDAYS = [
  { year: 2024, name: '元旦', dates: ['2024-01-01'], daysOff: 1, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2024, name: '春节', dates: ['2024-02-10','2024-02-11','2024-02-12','2024-02-13','2024-02-14','2024-02-15','2024-02-16','2024-02-17'], daysOff: 8, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 3, coopPayMultiplier: 3 },
  { year: 2024, name: '清明节', dates: ['2024-04-04','2024-04-05','2024-04-06'], daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2024, name: '劳动节', dates: ['2024-05-01','2024-05-02','2024-05-03','2024-05-04','2024-05-05'], daysOff: 5, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2024, name: '端午节', dates: ['2024-06-10'], daysOff: 1, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2024, name: '中秋节', dates: ['2024-09-15','2024-09-16','2024-09-17'], daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2024, name: '国庆节', dates: ['2024-10-01','2024-10-02','2024-10-03','2024-10-04','2024-10-05','2024-10-06','2024-10-07'], daysOff: 7, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 3, coopPayMultiplier: 3 },

  { year: 2025, name: '元旦', dates: ['2025-01-01'], daysOff: 1, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2025, name: '春节', dates: ['2025-01-28','2025-01-29','2025-01-30','2025-01-31','2025-02-01','2025-02-02','2025-02-03','2025-02-04'], daysOff: 8, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 3, coopPayMultiplier: 3 },
  { year: 2025, name: '清明节', dates: ['2025-04-04','2025-04-05','2025-04-06'], daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2025, name: '劳动节', dates: ['2025-05-01','2025-05-02','2025-05-03','2025-05-04','2025-05-05'], daysOff: 5, standardPayDays: 2, standardPayMultiplier: 3, coopPayDays: 2, coopPayMultiplier: 3 },
  { year: 2025, name: '端午节', dates: ['2025-05-31','2025-06-01','2025-06-02'], daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2025, name: '中秋节', dates: ['2025-10-06'], daysOff: 1, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2025, name: '国庆节', dates: ['2025-10-01','2025-10-02','2025-10-03','2025-10-04','2025-10-05','2025-10-06','2025-10-07','2025-10-08'], daysOff: 8, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 3, coopPayMultiplier: 3 },

  { year: 2026, name: '元旦', dates: ['2026-01-01','2026-01-02','2026-01-03'], daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2026, name: '春节', dates: ['2026-02-17','2026-02-18','2026-02-19','2026-02-20','2026-02-21','2026-02-22','2026-02-23','2026-02-24'], daysOff: 8, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 3, coopPayMultiplier: 3 },
  { year: 2026, name: '清明节', dates: ['2026-04-04','2026-04-05','2026-04-06'], daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2026, name: '劳动节', dates: ['2026-05-01','2026-05-02','2026-05-03','2026-05-04','2026-05-05'], daysOff: 5, standardPayDays: 2, standardPayMultiplier: 3, coopPayDays: 2, coopPayMultiplier: 3 },
  { year: 2026, name: '端午节', dates: ['2026-06-19','2026-06-20','2026-06-21'], daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2026, name: '中秋节', dates: ['2026-09-25'], daysOff: 1, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2026, name: '国庆节', dates: ['2026-10-01','2026-10-02','2026-10-03','2026-10-04','2026-10-05','2026-10-06','2026-10-07','2026-10-08'], daysOff: 8, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 3, coopPayMultiplier: 3 },

  { year: 2027, name: '元旦', dates: ['2027-01-01','2027-01-02','2027-01-03'], daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2027, name: '春节', dates: ['2027-02-06','2027-02-07','2027-02-08','2027-02-09','2027-02-10','2027-02-11','2027-02-12','2027-02-13'], daysOff: 8, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 3, coopPayMultiplier: 3 },
  { year: 2027, name: '清明节', dates: ['2027-04-03','2027-04-04','2027-04-05'], daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2027, name: '劳动节', dates: ['2027-05-01','2027-05-02','2027-05-03','2027-05-04','2027-05-05'], daysOff: 5, standardPayDays: 2, standardPayMultiplier: 3, coopPayDays: 2, coopPayMultiplier: 3 },
  { year: 2027, name: '端午节', dates: ['2027-06-09','2027-06-10','2027-06-11'], daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2027, name: '中秋节', dates: ['2027-09-15'], daysOff: 1, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2027, name: '国庆节', dates: ['2027-10-01','2027-10-02','2027-10-03','2027-10-04','2027-10-05','2027-10-06','2027-10-07','2027-10-08'], daysOff: 8, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 3, coopPayMultiplier: 3 },

  { year: 2028, name: '元旦', dates: ['2028-01-01'], daysOff: 1, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2028, name: '春节', dates: ['2028-01-26','2028-01-27','2028-01-28','2028-01-29','2028-01-30','2028-01-31','2028-02-01','2028-02-02'], daysOff: 8, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 3, coopPayMultiplier: 3 },
  { year: 2028, name: '清明节', dates: ['2028-04-04','2028-04-05','2028-04-06'], daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2028, name: '劳动节', dates: ['2028-05-01','2028-05-02','2028-05-03','2028-05-04','2028-05-05'], daysOff: 5, standardPayDays: 2, standardPayMultiplier: 3, coopPayDays: 2, coopPayMultiplier: 3 },
  { year: 2028, name: '端午节', dates: ['2028-05-28','2028-05-29','2028-05-30'], daysOff: 3, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2028, name: '中秋节', dates: ['2028-10-03'], daysOff: 1, standardPayDays: 1, standardPayMultiplier: 3, coopPayDays: 1, coopPayMultiplier: 3 },
  { year: 2028, name: '国庆节', dates: ['2028-10-01','2028-10-02','2028-10-03','2028-10-04','2028-10-05','2028-10-06','2028-10-07','2028-10-08'], daysOff: 8, standardPayDays: 3, standardPayMultiplier: 3, coopPayDays: 3, coopPayMultiplier: 3 }
];

const INITIAL_INVOICES = [
  // ===== 专席项目（9个） =====
  {
    projectName: '定制商品项目',
    companyName: '上海亿和网络科技有限公司',
    taxId: '91310000MA1FL5C51K',
    bankName: '三菱日联银行（中国）有限公司上海分行',
    bankAccount: '2058773',
    address: '上海市金山区山阳镇亭卫公路1500号五层A区',
    phone: '13761196549',
    invoiceContent: '现代服务*服务费',
    invoiceType: '1%代专票',
    taxTreatment: '含税',
    paymentDay: 15,
    specialNote: '',
    _group: '专席',
    _category: '专席'
  },
  {
    projectName: '消防项目（王飞）',
    companyName: '杭州创远工程管理咨询服务有限公司',
    taxId: '91330106MA27Y0A64C',
    bankName: '杭州银行股份有限公司',
    bankAccount: '313301000073',
    address: '浙江省杭州市上城区清泰街569号富春大厦501室',
    phone: '15605720714',
    invoiceContent: '服务费',
    invoiceType: '1%代专票',
    taxTreatment: '含税',
    paymentDay: 15,
    specialNote: '',
    _group: '专席',
    _category: '专席'
  },
  {
    projectName: '晨光信息-信展科技',
    companyName: '上海晨光信息科技有限公司',
    taxId: '91310115607342699',
    bankName: '中国工商银行股份有限公司上海奉贤支行',
    bankAccount: '102290024907',
    address: '上海市奉贤区南桥镇环城东路383号2幢14楼',
    phone: '021-57474488',
    invoiceContent: '服务费',
    invoiceType: '1%代专票',
    taxTreatment: '含税',
    paymentDay: 15,
    specialNote: '',
    _group: '专席',
    _category: '专席'
  },
  {
    projectName: '晨光-办公用品',
    companyName: '上海晨光办公用品有限公司',
    taxId: '91310117662441087K',
    bankName: '招商银行股份有限公司上海分行',
    bankAccount: '1219125726210016',
    address: '上海市奉贤区南桥镇环城东路383号2幢14楼',
    phone: '021-57474488',
    invoiceContent: '服务费',
    invoiceType: '1%代专票',
    taxTreatment: '含税',
    paymentDay: 15,
    specialNote: '',
    _group: '专席',
    _category: '专席'
  },
  {
    projectName: '福斯特项目',
    companyName: '永康市福达日用品有限公司',
    taxId: '91330784680710556P',
    bankName: '中国农业银行股份有限公司永康市支行',
    bankAccount: '19627500140080726',
    address: '浙江省金华市永康市芝英镇雅庄村',
    phone: '13588650841',
    invoiceContent: '服务费',
    invoiceType: '1%代专票',
    taxTreatment: '不含税',
    paymentDay: 15,
    specialNote: '',
    _group: '专席',
    _category: '专席'
  },
  {
    projectName: 'FDA注册项目',
    companyName: '待补充',
    taxId: '',
    bankName: '待补充',
    bankAccount: '',
    address: '待补充',
    phone: '待补充',
    invoiceContent: '服务费',
    invoiceType: '1%代专票',
    taxTreatment: '含税',
    paymentDay: 15,
    specialNote: '公司信息待补充',
    _group: '专席',
    _category: '专席'
  },
  {
    projectName: '检测项目',
    companyName: '上海天伟质量检测技术服务有限公司',
    taxId: '91310105786709171T',
    bankName: '兴业银行上海五角场支行',
    bankAccount: '216400100100293586',
    address: '上海市杨浦区淞沪路303号11幢B1层',
    phone: '',
    invoiceContent: '服务费',
    invoiceType: '1%代专票',
    taxTreatment: '含税',
    paymentDay: 15,
    specialNote: '',
    _group: '专席',
    _category: '专席'
  },
  {
    projectName: '模具项目',
    companyName: '杭州安费诺嘉力讯连接技术有限公司',
    taxId: '91330100788274888',
    bankName: '招商银行杭州分行滨江支行',
    bankAccount: '571906400310606',
    address: '浙江省杭州市萧山区萧山经济技术开发区桥南区块鸿兴路389号',
    phone: '15221535485',
    invoiceContent: '服务费',
    invoiceType: '1%代专票',
    taxTreatment: '含税',
    paymentDay: 15,
    specialNote: '',
    _group: '专席',
    _category: '专席'
  },
  {
    projectName: '咨询项目（鲁阳）',
    companyName: '待补充',
    taxId: '',
    bankName: '待补充',
    bankAccount: '',
    address: '待补充',
    phone: '待补充',
    invoiceContent: '服务费',
    invoiceType: '1%代专票',
    taxTreatment: '含税',
    paymentDay: 15,
    specialNote: '公司信息待补充',
    _group: '专席',
    _category: '专席'
  },
  // ===== 拼席项目（5个） =====
  {
    projectName: '妲润项目',
    companyName: '公司信息待补充',
    taxId: '',
    bankName: '待补充',
    bankAccount: '待补充',
    address: '待补充',
    phone: '待补充',
    invoiceContent: '服务费',
    invoiceType: '1%代专票',
    taxTreatment: '含税',
    paymentDay: 15,
    specialNote: '公司信息待补充',
    _group: '拼席',
    _category: '拼席'
  },
  {
    projectName: '博思项目',
    companyName: '公司信息待补充',
    taxId: '',
    bankName: '待补充',
    bankAccount: '待补充',
    address: '待补充',
    phone: '待补充',
    invoiceContent: '服务费',
    invoiceType: '1%代专票',
    taxTreatment: '含税',
    paymentDay: 15,
    specialNote: '公司信息待补充',
    _group: '拼席',
    _category: '拼席'
  },
  {
    projectName: '讨师项目',
    companyName: '公司信息待补充',
    taxId: '',
    bankName: '待补充',
    bankAccount: '待补充',
    address: '待补充',
    phone: '待补充',
    invoiceContent: '服务费',
    invoiceType: '1%代专票',
    taxTreatment: '含税',
    paymentDay: 15,
    specialNote: '公司信息待补充',
    _group: '拼席',
    _category: '拼席'
  },
  {
    projectName: '森昊项目',
    companyName: '公司信息待补充',
    taxId: '',
    bankName: '待补充',
    bankAccount: '待补充',
    address: '待补充',
    phone: '待补充',
    invoiceContent: '服务费',
    invoiceType: '1%代专票',
    taxTreatment: '含税',
    paymentDay: 15,
    specialNote: '公司信息待补充',
    _group: '拼席',
    _category: '拼席'
  },
  {
    projectName: '悦泰项目（兼职）',
    companyName: '公司信息待补充',
    taxId: '',
    bankName: '待补充',
    bankAccount: '待补充',
    address: '待补充',
    phone: '待补充',
    invoiceContent: '服务费',
    invoiceType: '1%代专票',
    taxTreatment: '含税',
    paymentDay: 15,
    specialNote: '公司信息待补充',
    _group: '拼席',
    _category: '拼席'
  }
];

async function initData() {
  const projects = await DB.getAllProjects();
  if (projects.length === 0) {
    for (const p of INITIAL_PROJECTS) {
      const id = await DB.addProject(p);
    }
    // 添加店铺数据（用实际插入的ID）
    const savedProjects = await DB.getAllProjects();
    for (const shop of INITIAL_SHOPS) {
      const pIdx = shop.projectId - 1;
      if (pIdx < savedProjects.length) {
        await DB.addShop({ ...shop, projectId: savedProjects[pIdx].id });
      }
    }
  } else {
    // 同步更新旧数据
    for (const existing of projects) {
      const match = INITIAL_PROJECTS.find(ip => ip.name === existing.name || (existing.name === '母婴项目' && ip.name === '博思项目'));
      if (match) {
        const updates = {};
        if (existing.name === '母婴项目') updates.name = '博思项目';
        // 同步假日规则：仅做迁移转换（旧值→新值），不覆盖用户自定义
        if (existing.holidayRule === 'double_pay_or_rest') updates.holidayRule = 'cooperative';
        if (existing.holidayRule === 'double_pay') updates.holidayRule = 'standard';
        if (existing.holidayRule === 'collab_days') updates.holidayRule = 'cooperative';
        // 注意：holidayRule、holidayPayMethod、holidayTable不在同步列表中，用户编辑后不会被覆盖
        // 同步结算档位：确保与最新配置一致
        if (match.tiers && (!existing.tiers || existing.tiers.length === 0 || JSON.stringify(existing.tiers) !== JSON.stringify(match.tiers))) {
          updates.tiers = match.tiers;
        }
        // 同步核心结构字段（仅calculationType不可由用户随意修改）
        for (const field of ['calculationType']) {
          if (match[field] !== undefined && existing[field] !== match[field]) {
            updates[field] = match[field];
          }
        }
        // 注意：contractStartDate、extraShopFee、baseShopLimit、onlineRate、offlineRate不在同步列表中
        if (Object.keys(updates).length > 0) await DB.updateProject(existing.id, updates);
      }
    }
    // 检测并新增缺失的项目（如益生菌）
    const allSaved = await DB.getAllProjects();
    for (const ip of INITIAL_PROJECTS) {
      if (!allSaved.find(p => p.name === ip.name)) {
        await DB.addProject(ip);
      }
    }
    // 同步店铺数据：按名称匹配，仅新增/删除差异店铺，保留已有店铺ID
    const refreshedProjects = await DB.getAllProjects();
    const projectMap = {};
    for (const p of refreshedProjects) projectMap[p.name] = p.id;
    const nameToInitial = { '妲润项目': 1, '博思项目': 2, '讨师项目': 3, '森昊项目': 4, '悦泰项目（兼职）': 5, '益生菌项目': 6 };
    const existingShops = await DB.getAllShops();
    const existingKey = (s) => `${s.projectId}_${s.name}_${s.platform}`;

    // 找出需要删除的（存在于数据库但不在初始清单中）
    const initialKeys = new Set();
    for (const shop of INITIAL_SHOPS) {
      const targetName = Object.keys(nameToInitial).find(n => nameToInitial[n] === shop.projectId);
      if (targetName && projectMap[targetName]) {
        initialKeys.add(`${projectMap[targetName]}_${shop.name}_${shop.platform}`);
      }
    }
    for (const es of existingShops) {
      if (!initialKeys.has(existingKey(es))) {
        await DB.deleteShop(es.id);
      }
    }

    // 找出需要新增的（存在于初始清单但不在数据库中）
    const existingKeys = new Set(existingShops.map(existingKey));
    for (const shop of INITIAL_SHOPS) {
      const targetName = Object.keys(nameToInitial).find(n => nameToInitial[n] === shop.projectId);
      if (targetName && projectMap[targetName]) {
        const key = `${projectMap[targetName]}_${shop.name}_${shop.platform}`;
        if (!existingKeys.has(key)) {
          await DB.addShop({ ...shop, projectId: projectMap[targetName] });
        }
      }
    }
  }
  const holidayCount = await db.holidays.count();
  if (holidayCount === 0) {
    await DB.saveHolidaysBatch(INITIAL_HOLIDAYS);
  }

  // 初始化/同步发票数据
  const allInvoices = await DB.getAllInvoices();
  const existingInvoiceNames = new Set(allInvoices.map(inv => inv.projectName));
  const initialInvoiceNames = new Set(INITIAL_INVOICES.map(inv => inv.projectName));

  // 先将所有不在新列表中的旧发票项目标记为已停用
  for (const dbInv of allInvoices) {
    if (!initialInvoiceNames.has(dbInv.projectName)) {
      if (!dbInv._deprecated) {
        await DB.saveInvoice({ ...dbInv, _deprecated: true, _group: '已停用' });
      }
    }
  }

  // 对于新增的项目（不在数据库中），自动创建
  for (const inv of INITIAL_INVOICES) {
    if (!existingInvoiceNames.has(inv.projectName)) {
      await DB.saveInvoice(inv);
    }
  }

  // 对于已有项目，仅同步结构性字段，保留用户已填写的业务数据不覆盖
  for (const dbInv of allInvoices) {
    const template = INITIAL_INVOICES.find(i => i.projectName === dbInv.projectName);
    if (template) {
      const updates = {};
      // 仅同步开票类型（确保与最新配置一致，如 '1%专票' -> '1%代专票'）
      if (template.invoiceType !== undefined && dbInv.invoiceType !== template.invoiceType) {
        updates.invoiceType = template.invoiceType;
      }
      // 同步分类字段
      if (template._category && dbInv._category !== template._category) {
        updates._category = template._category;
      }
      if (template._group && dbInv._group !== template._group) {
        updates._group = template._group;
      }
      // 如果项目之前被标记停用，恢复它
      if (dbInv._deprecated) {
        updates._deprecated = false;
      }
      // 对于"待补充"字段的模板：如果用户已手动填写了有效值，不覆盖
      // 对于有明确值的模板字段：如果数据库中还是"待补充"或空值，则用模板填充
      for (const field of ['companyName', 'taxId', 'bankName', 'bankAccount', 'address', 'phone']) {
        const dbVal = dbInv[field] || '';
        const tplVal = template[field] || '';
        // 仅当模板有有效值且数据库中为空/待补充时才填充
        if (tplVal && tplVal !== '待补充' && (!dbVal || dbVal === '待补充' || dbVal === '公司信息待补充')) {
          updates[field] = tplVal;
        }
      }
      if (Object.keys(updates).length > 0) {
        await DB.saveInvoice({ ...dbInv, ...updates });
      }
    }
  }
}
