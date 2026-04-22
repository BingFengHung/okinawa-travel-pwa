// ==============================
// 沖繩 7 天 6 夜行程資料
// ==============================

const APP_DATA = {
  center: [26.3344, 127.7731],
  defaultZoom: 11,

  // ---------- 7 天行程 ----------
  itinerary: [
    {
      day: 1,
      date: '2026-04-22',
      title: 'Day 1 — 那霸市區漫步',
      weather: { icon: '☀️', temp: '26°C', desc: '晴天', humidity: '65%', wind: '東南風 3m/s' },
      spots: [
        {
          id: 'd1s1', name: '那霸機場', lat: 26.2058, lng: 127.6460,
          time: '10:00', duration: 30,
          description: '抵達沖繩！領取行李、換日幣、購買 OKA 單軌一日券',
          transportToNext: { mode: 'monorail', duration: 15, note: '搭單軌到縣廳前站', color: '#e74c3c' },
          tips: '建議在機場先買好單軌電車一日券 (800 JPY)',
          nearby: []
        },
        {
          id: 'd1s2', name: '國際通', lat: 26.2154, lng: 127.6847,
          time: '11:00', duration: 120,
          description: '沖繩最熱鬧的商店街，約 1.6 公里長，伴手禮、美食一次買齊',
          transportToNext: { mode: 'walk', duration: 5, note: '步行前往', color: '#f39c12' },
          tips: '週日下午有步行者天國（交通管制）',
          nearby: [
            { name: '暖暮拉麵 國際通店', lat: 26.2148, lng: 127.6855, type: 'restaurant', cuisine: '🍜 拉麵', price: '¥900' },
            { name: "Jack's Steak House", lat: 26.2133, lng: 127.6788, type: 'restaurant', cuisine: '🥩 牛排', price: '¥1500' },
            { name: '花笠食堂', lat: 26.2143, lng: 127.6862, type: 'restaurant', cuisine: '🍱 沖繩料理', price: '¥800' },
            { name: 'FamilyMart 國際通', lat: 26.2158, lng: 127.6840, type: 'convenience' }
          ]
        },
        {
          id: 'd1s3', name: '第一牧志公設市場', lat: 26.2142, lng: 127.6868,
          time: '13:30', duration: 90,
          description: '沖繩的廚房！一樓買海鮮，二樓代料理，新鮮又實惠',
          transportToNext: { mode: 'monorail', duration: 20, note: '步行至旭橋站，搭單軌到波上宮', color: '#e74c3c' },
          tips: '二樓代料理費約 ¥500/人',
          nearby: [
            { name: '牧志天婦羅店', lat: 26.2140, lng: 127.6872, type: 'restaurant', cuisine: '🍤 天婦羅', price: '¥100/個' }
          ]
        },
        {
          id: 'd1s4', name: '波上宮', lat: 26.2178, lng: 127.6668,
          time: '16:00', duration: 60,
          description: '建在懸崖上的琉球八社之首，可順遊波之上海灘',
          transportToNext: null,
          tips: '傍晚時分拍照最美，旁邊有波之上海灘',
          nearby: [
            { name: 'Lawson 若狹', lat: 26.2175, lng: 127.6680, type: 'convenience' }
          ]
        }
      ]
    },
    {
      day: 2,
      date: '2026-04-23',
      title: 'Day 2 — 中部美國風情',
      weather: { icon: '⛅', temp: '25°C', desc: '多雲時晴', humidity: '70%', wind: '東風 4m/s' },
      spots: [
        {
          id: 'd2s1', name: '美國村', lat: 26.3275, lng: 127.7656,
          time: '09:30', duration: 180,
          description: '充滿美式風情的複合商圈，摩天輪、海灘、購物一次滿足',
          transportToNext: { mode: 'car', duration: 30, note: '開車走 58 號國道北上', color: '#3498db' },
          tips: '日落海灘看夕陽非常美，建議傍晚再來一次',
          nearby: [
            { name: 'Benson\'s 漢堡', lat: 26.3269, lng: 127.7649, type: 'restaurant', cuisine: '🍔 漢堡', price: '¥1200' },
            { name: 'グルメ回転寿司', lat: 26.3282, lng: 127.7661, type: 'restaurant', cuisine: '🍣 迴轉壽司', price: '¥1500' },
            { name: 'Lawson 美國村', lat: 26.3270, lng: 127.7645, type: 'convenience' }
          ]
        },
        {
          id: 'd2s2', name: '殘波岬', lat: 26.4425, lng: 127.7131,
          time: '13:30', duration: 60,
          description: '高 30m 的斷崖絕壁與白色燈塔，壯觀的海岸線',
          transportToNext: { mode: 'car', duration: 15, note: '開車前往', color: '#3498db' },
          tips: '燈塔入場 ¥300，可登頂遠眺',
          nearby: [
            { name: '殘波岬皇家飯店餐廳', lat: 26.4420, lng: 127.7140, type: 'restaurant', cuisine: '🍽️ 自助餐', price: '¥2000' }
          ]
        },
        {
          id: 'd2s3', name: '座喜味城跡', lat: 26.4103, lng: 127.7439,
          time: '15:30', duration: 60,
          description: '世界遺產！保存良好的琉球城堡遺跡，免費入場',
          transportToNext: null,
          tips: '免費參觀，城牆上可遠眺東西海岸',
          nearby: [
            { name: '鶴龜堂拉麵', lat: 26.4098, lng: 127.7445, type: 'restaurant', cuisine: '🍜 拉麵', price: '¥850' }
          ]
        }
      ]
    },
    {
      day: 3,
      date: '2026-04-24',
      title: 'Day 3 — 北部自然之旅',
      weather: { icon: '🌤️', temp: '24°C', desc: '晴時多雲', humidity: '72%', wind: '北東風 3m/s' },
      spots: [
        {
          id: 'd3s1', name: '美麗海水族館', lat: 26.6943, lng: 127.8779,
          time: '09:00', duration: 180,
          description: '世界級水族館！黑潮之海大水槽有鯨鯊和鬼蝠魟',
          transportToNext: { mode: 'car', duration: 10, note: '園區內開車', color: '#3498db' },
          tips: '16:00 後入場有折扣。鯨鯊餵食秀 15:00 & 17:00',
          nearby: [
            { name: '海洋博公園餐廳', lat: 26.6940, lng: 127.8785, type: 'restaurant', cuisine: '🍱 定食', price: '¥1000' },
            { name: 'FamilyMart 本部', lat: 26.6583, lng: 127.8843, type: 'convenience' }
          ]
        },
        {
          id: 'd3s2', name: '備瀨福木林道', lat: 26.7069, lng: 127.8756,
          time: '12:30', duration: 60,
          description: '被福木樹圍繞的寧靜小路，充滿沖繩原始風情',
          transportToNext: { mode: 'car', duration: 40, note: '開車經屋我地大橋前往', color: '#3498db' },
          tips: '可租腳踏車漫遊 (¥300/次)',
          nearby: [
            { name: '備瀨茶屋', lat: 26.7065, lng: 127.8760, type: 'restaurant', cuisine: '🍵 茶屋', price: '¥600' }
          ]
        },
        {
          id: 'd3s3', name: '古宇利島', lat: 26.7133, lng: 128.0250,
          time: '14:30', duration: 120,
          description: '「戀之島」！古宇利大橋的絕景，心型岩必訪',
          transportToNext: null,
          tips: '心型岩在 Tinu 海灘，從停車場步行 5 分鐘',
          nearby: [
            { name: '蝦蝦飯 Shrimp Wagon', lat: 26.7130, lng: 128.0245, type: 'restaurant', cuisine: '🦐 蝦飯', price: '¥1000' },
            { name: '花人逢', lat: 26.6298, lng: 127.8627, type: 'restaurant', cuisine: '🍕 披薩', price: '¥1200' }
          ]
        }
      ]
    },
    {
      day: 4,
      date: '2026-04-25',
      title: 'Day 4 — 中部海岸探索',
      weather: { icon: '🌧️', temp: '23°C', desc: '陣雨', humidity: '80%', wind: '南風 5m/s' },
      spots: [
        {
          id: 'd4s1', name: '萬座毛', lat: 26.5044, lng: 127.8528,
          time: '09:30', duration: 60,
          description: '象鼻岩！沖繩代表性的斷崖絕景，可容萬人座的草原',
          transportToNext: { mode: 'car', duration: 20, note: '開車南下', color: '#3498db' },
          tips: '入場 ¥100。雨天路滑注意安全',
          nearby: [
            { name: 'ANA萬座海灘度假村餐廳', lat: 26.5040, lng: 127.8540, type: 'restaurant', cuisine: '🍽️ 西式', price: '¥2500' }
          ]
        },
        {
          id: 'd4s2', name: '琉球村', lat: 26.4564, lng: 127.7678,
          time: '11:30', duration: 120,
          description: '體驗琉球傳統文化！三線琴體驗、傳統服裝、EISA太鼓',
          transportToNext: { mode: 'car', duration: 10, note: '開車前往', color: '#3498db' },
          tips: '入場 ¥2000。三線琴體驗 ¥500。雨天室內活動多',
          nearby: [
            { name: '琉球村園內食堂', lat: 26.4560, lng: 127.7680, type: 'restaurant', cuisine: '🍱 沖繩料理', price: '¥900' }
          ]
        },
        {
          id: 'd4s3', name: '真榮田岬（青之洞窟）', lat: 26.4389, lng: 127.7672,
          time: '14:30', duration: 120,
          description: '著名的浮潛/潛水聖地，洞窟內藍光夢幻',
          transportToNext: null,
          tips: '浮潛體驗約 ¥3000-5000。需預約。雨天可能取消',
          nearby: [
            { name: 'FamilyMart 恩納', lat: 26.4395, lng: 127.7680, type: 'convenience' }
          ]
        }
      ]
    },
    {
      day: 5,
      date: '2026-04-26',
      title: 'Day 5 — 南部文化巡禮',
      weather: { icon: '⛅', temp: '25°C', desc: '多雲', humidity: '68%', wind: '東風 3m/s' },
      spots: [
        {
          id: 'd5s1', name: '齋場御嶽', lat: 26.1772, lng: 127.8278,
          time: '09:00', duration: 60,
          description: '琉球王國最高聖地，世界遺產，三角岩隙間可望久高島',
          transportToNext: { mode: 'car', duration: 5, note: '開車前往', color: '#3498db' },
          tips: '入場 ¥300。需脫帽，保持肅靜',
          nearby: []
        },
        {
          id: 'd5s2', name: '知念岬公園', lat: 26.1744, lng: 127.8331,
          time: '10:30', duration: 45,
          description: '太平洋全景觀景台，可遠望久高島與 Komaka 島',
          transportToNext: { mode: 'car', duration: 15, note: '沿海岸線開車', color: '#3498db' },
          tips: '免費。拍照的好地方',
          nearby: [
            { name: 'Cafe くるくま', lat: 26.1533, lng: 127.8131, type: 'restaurant', cuisine: '🍛 南洋料理', price: '¥1200' }
          ]
        },
        {
          id: 'd5s3', name: 'NIRAIKANAI橋', lat: 26.1547, lng: 127.7928,
          time: '12:00', duration: 30,
          description: '壯觀的U字型大橋，從山上直通海邊，沖繩最美公路',
          transportToNext: { mode: 'car', duration: 15, note: '開車前往', color: '#3498db' },
          tips: '橋上不能停車！建議從上方展望台拍照',
          nearby: []
        },
        {
          id: 'd5s4', name: '沖繩世界（玉泉洞）', lat: 26.1411, lng: 127.7472,
          time: '13:00', duration: 150,
          description: '30 萬年鐘乳石洞 + 琉球王國城下町，體驗傳統工藝',
          transportToNext: null,
          tips: '入場 ¥2000。洞窟內涼爽，帶件薄外套',
          nearby: [
            { name: '沖繩世界園內餐廳', lat: 26.1415, lng: 127.7478, type: 'restaurant', cuisine: '🍱 沖繩麵', price: '¥850' },
            { name: '浜辺の茶屋', lat: 26.1556, lng: 127.7900, type: 'restaurant', cuisine: '☕ 海景咖啡', price: '¥800' }
          ]
        }
      ]
    },
    {
      day: 6,
      date: '2026-04-27',
      title: 'Day 6 — 那霸歷史與海景',
      weather: { icon: '☀️', temp: '27°C', desc: '晴天', humidity: '60%', wind: '南風 2m/s' },
      spots: [
        {
          id: 'd6s1', name: '首里城', lat: 26.2170, lng: 127.7195,
          time: '09:00', duration: 120,
          description: '琉球王國的象徵！世界遺產，正在重建中的朱紅宮殿',
          transportToNext: { mode: 'walk', duration: 10, note: '步行下坡', color: '#f39c12' },
          tips: '入場 ¥400。有免費導覽（需預約）',
          nearby: [
            { name: '首里そば', lat: 26.2175, lng: 127.7190, type: 'restaurant', cuisine: '🍜 沖繩麵', price: '¥700' }
          ]
        },
        {
          id: 'd6s2', name: '金城町石疊道', lat: 26.2131, lng: 127.7178,
          time: '11:30', duration: 45,
          description: '琉球王國時代的古石板路，保存良好的歷史散步道',
          transportToNext: { mode: 'car', duration: 25, note: '開車經國道 331 號南下', color: '#3498db' },
          tips: '免費散步。石板路可能濕滑，穿好走的鞋',
          nearby: []
        },
        {
          id: 'd6s3', name: '瀨長島 Umikaji Terrace', lat: 26.1642, lng: 127.6414,
          time: '13:00', duration: 180,
          description: '白色地中海風格的商業設施，面海的絕美夕陽景點',
          transportToNext: null,
          tips: '傍晚看飛機起降+夕陽是最佳時機',
          nearby: [
            { name: '幸せのパンケーキ', lat: 26.1640, lng: 127.6418, type: 'restaurant', cuisine: '🥞 鬆餅', price: '¥1200' },
            { name: 'HAMMOCK CAFE', lat: 26.1644, lng: 127.6410, type: 'restaurant', cuisine: '☕ 咖啡', price: '¥800' },
            { name: 'FamilyMart 瀨長', lat: 26.1650, lng: 127.6420, type: 'convenience' }
          ]
        }
      ]
    },
    {
      day: 7,
      date: '2026-04-28',
      title: 'Day 7 — 購物與歸程',
      weather: { icon: '🌤️', temp: '26°C', desc: '晴時多雲', humidity: '65%', wind: '東風 3m/s' },
      spots: [
        {
          id: 'd7s1', name: '永旺夢樂城沖繩來客夢', lat: 26.3344, lng: 127.7731,
          time: '09:00', duration: 180,
          description: '沖繩最大購物中心！250+ 店鋪，最後的購物衝刺',
          transportToNext: { mode: 'car', duration: 40, note: '開車走高速公路回機場', color: '#3498db' },
          tips: '退稅櫃檯在 1F。免稅金額 ¥5000 以上',
          nearby: [
            { name: 'フードコート', lat: 26.3340, lng: 127.7735, type: 'restaurant', cuisine: '🍽️ 美食街', price: '¥800' },
            { name: 'A&W 漢堡', lat: 26.3348, lng: 127.7728, type: 'restaurant', cuisine: '🍔 美式速食', price: '¥700' }
          ]
        },
        {
          id: 'd7s2', name: '那霸機場', lat: 26.2058, lng: 127.6460,
          time: '14:00', duration: 120,
          description: '回程！記得提早 2 小時到機場，最後在國內線吃沖繩麵',
          transportToNext: null,
          tips: '國內線航廈有不錯的沖繩麵店和伴手禮店',
          nearby: [
            { name: '空港食堂', lat: 26.2060, lng: 127.6465, type: 'restaurant', cuisine: '🍜 沖繩麵', price: '¥750' }
          ]
        }
      ]
    }
  ],

  // ---------- 行前清單 ----------
  checklist: [
    { id: 'ck01', category: '證件', name: '護照（效期 6 個月以上）', checked: false },
    { id: 'ck02', category: '證件', name: '機票（電子機票截圖）', checked: false },
    { id: 'ck03', category: '證件', name: '飯店預訂確認單', checked: false },
    { id: 'ck04', category: '證件', name: '國際駕照（租車用）', checked: false },
    { id: 'ck05', category: '證件', name: '租車預約確認單', checked: false },
    { id: 'ck06', category: '金錢', name: '日幣現金', checked: false },
    { id: 'ck07', category: '金錢', name: '信用卡 (Visa/Master)', checked: false },
    { id: 'ck08', category: '3C', name: '手機充電器 & 傳輸線', checked: false },
    { id: 'ck09', category: '3C', name: '行動電源', checked: false },
    { id: 'ck10', category: '3C', name: 'WiFi 機 / SIM 卡', checked: false },
    { id: 'ck11', category: '3C', name: '相機 & 記憶卡', checked: false },
    { id: 'ck12', category: '3C', name: '萬用轉接頭', checked: false },
    { id: 'ck13', category: '衣物', name: '換洗衣物 (7 天份)', checked: false },
    { id: 'ck14', category: '衣物', name: '泳衣 / 泳褲', checked: false },
    { id: 'ck15', category: '衣物', name: '拖鞋 / 涼鞋', checked: false },
    { id: 'ck16', category: '衣物', name: '薄外套（冷氣房用）', checked: false },
    { id: 'ck17', category: '衣物', name: '帽子 / 墨鏡', checked: false },
    { id: 'ck18', category: '日用品', name: '防曬乳 SPF50+', checked: false },
    { id: 'ck19', category: '日用品', name: '雨具（折疊傘）', checked: false },
    { id: 'ck20', category: '日用品', name: '個人藥品（暈車藥等）', checked: false },
    { id: 'ck21', category: '日用品', name: '盥洗用品', checked: false },
    { id: 'ck22', category: '日用品', name: '密封袋（裝濕衣物）', checked: false },
    { id: 'ck23', category: '其他', name: '旅遊書 / 離線地圖', checked: false },
    { id: 'ck24', category: '其他', name: '零食 / 飲水', checked: false }
  ],

  // ---------- 交通圖示 ----------
  transportIcons: {
    car: '🚗',
    monorail: '🚝',
    bus: '🚌',
    walk: '🚶',
    taxi: '🚕'
  },

  // ---------- 費用類別 ----------
  expenseCategories: {
    food: '🍜 餐飲',
    transport: '🚗 交通',
    ticket: '🎫 門票',
    shopping: '🛍️ 購物',
    hotel: '🏨 住宿',
    other: '📦 其他'
  }
};
