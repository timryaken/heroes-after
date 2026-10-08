const SOURCES = {
  ptsDisaster: 'https://news.pts.org.tw/article/771944',
  cnaVolunteers: 'https://www.cna.com.tw/news/asoc/202509280229.aspx',
  cnaCleanup: 'https://www.cna.com.tw/news/aipl/202509270165.aspx',
  ptsAnniversary: 'https://news.pts.org.tw/article/828012',
  cnaMuseum: 'https://www.cna.com.tw/news/aloc/202606060104.aspx',
  ptsMemorial: 'https://news.pts.org.tw/article/805126',
};

const photos = {
  disaster: {
    src: 'assets/images/disaster-guangfu.jpg',
    alt: '泥流淹入光復鄉街區，車輛受困在混濁水流中',
    credit: '畫面來源：公視新聞網',
    sourceUrl: SOURCES.ptsDisaster,
  },
  volunteersStation: {
    src: 'assets/images/volunteers-shoveling.jpg',
    alt: '大批志工攜帶裝備抵達光復車站月台',
    credit: '照片來源：中央社',
    sourceUrl: SOURCES.cnaVolunteers,
  },
  volunteersStreet: {
    src: 'assets/images/volunteers-arriving.jpg',
    alt: '穿著雨鞋、手持清潔工具的志工走進光復受災街區',
    credit: '照片來源：中央社',
    sourceUrl: SOURCES.cnaCleanup,
  },
  riverNow: {
    src: 'assets/images/wetland-now.jpg',
    alt: '災後週年時仍在整治中的馬太鞍溪河道',
    credit: '畫面來源：公視新聞網（週年追蹤）',
    sourceUrl: SOURCES.ptsAnniversary,
  },
  museumNow: {
    src: 'assets/images/sugar-factory-now.jpg',
    alt: '光復糖廠鏟子超人館內保存的救災物件與照片',
    credit: '照片來源：中央社記者張祈攝',
    sourceUrl: SOURCES.cnaMuseum,
  },
  memorialNow: {
    src: 'assets/images/datong-now.jpg',
    alt: '光復車站前紀念鏟子超人的公仔',
    credit: '畫面來源：公視新聞網（大同村段落原型暫代影像）',
    sourceUrl: SOURCES.ptsMemorial,
  },
};

export const PROLOGUE_SLIDES = [
  { id: 'disaster-street', phase: 'disaster', ...photos.disaster },
  { id: 'disaster-aftermath', phase: 'disaster', ...photos.disaster },
  { id: 'volunteers-station', phase: 'volunteers', ...photos.volunteersStation },
  { id: 'volunteers-street', phase: 'volunteers', ...photos.volunteersStreet },
  { id: 'river-now', phase: 'now', ...photos.riverNow },
  { id: 'memory-now', phase: 'now', ...photos.museumNow },
  { id: 'memorial-now', phase: 'now', ...photos.memorialNow },
];

export const ROLES = [
  {
    id: 'volunteer',
    label: '我曾是鏟子超人',
    shortLabel: '曾經到過現場',
    wishPrompt: '如果再次回到光復，你最想確認什麼？',
    headline: '你鏟過的那條街，又熱鬧起來了。',
    invitation: '一年前你帶著鏟子來到光復。因為有你，這裡一點一點恢復、重建起來了，要不要回來看看？',
  },
  {
    id: 'wanted-to-help',
    label: '我當時想參與，但沒能前往',
    shortLabel: '當時未能前往',
    wishPrompt: '如果現在能用另一種方式參與，你想做什麼？',
    headline: '當時沒能來，現在剛剛好。',
    invitation: '謝謝那群鏟子超人，光復已經重新站起來。你錯過的那一趟，現在可以用一次回訪補上。',
  },
  {
    id: 'other',
    label: '我以其他方式關心這裡',
    shortLabel: '持續關心光復',
    wishPrompt: '你想把哪一句話，留給正在重新開始的人？',
    headline: '光復，已經不一樣了。',
    invitation: '因為鏟子超人的幫忙，街道、田地和店家都回來了。要不要親自回來看看？',
  },
];

// 筆記內文為內部撰寫的固定文案，允許 <mark>（螢光筆）與 <s>（劃掉）兩種手寫效果。
export const NOTEBOOK_PAGES = [
  {
    date: '2025.09.28（日）',
    title: '鏟子超人到了',
    lines: [
      '早上第一班車進站，月台上全是雨鞋跟鏟子。',
      '沒有人點名，大家看到哪裡有泥就往哪裡走。',
      '糖廠前排出長長的物資隊伍，阿嬤一直塞水給我們。',
    ],
    margin: '記：<mark>沒問到名字的人太多了</mark>',
  },
  {
    date: '2026.09.20 電話',
    title: '「叫他們回來看看啦」',
    lines: [
      '打給糖廠旁的冰店阿姨，她說<mark>店已經重新開了</mark>。',
      '濕地步道修好了，大同村的街上<s>還有很多空屋</s> 一間一間亮起來。',
      '掛電話前她說：「那些來幫忙的孩子，叫他們回來看看啦，不用帶鏟子。」',
    ],
    margin: '→ 這次不寫災難，寫大家怎麼回來的。',
  },
  {
    date: '2026.11.15（日）',
    title: '11/15，回光復',
    lines: [
      '路線：光復車站 → 馬太鞍濕地 → 佛祖街 → 大同村（順路去糖廠吃冰！）',
      '想找幾個當時來過、或當時沒能來的人一起去。',
      '不用帶鏟子，帶著好奇心就好。',
    ],
    margin: '想一起去的人，把 Email 寫在這裡 ↓',
  },
];

export const PLACES = [
  {
    id: 'wetland',
    name: '馬太鞍濕地',
    lat: 23.6584,
    lng: 121.4093,
    labelSide: 'left',
    era: '水退了，生活回到水邊',
    summary: '洪水退去後，河道與水圳一段段整理好。巴拉告捕魚、濕地步道，部落的日常正慢慢回到水邊。',
    note: '子軒筆記：部落的朋友說，水來過，也會走；人留下來，就能重新開始。',
    before: photos.disaster,
    after: photos.riverNow,
  },
  {
    id: 'fozu-street',
    name: '佛祖街',
    lat: 23.6672,
    lng: 121.4336,
    era: '泥退了，街坊又坐回門口',
    summary: '佛祖街是當時泥流灌進最深的街道之一，鏟子超人一戶一戶幫忙把家門清出來。現在店家重新開門，傍晚又有人坐在騎樓聊天。（原型暫用車站志工與鏟子超人館照片，正式版再換入佛祖街今昔照片。）',
    note: '子軒筆記：阿伯指著牆上的泥痕說：「那條線以下，都是你們幫忙挖出來的。」',
    before: photos.volunteersStation,
    after: photos.museumNow,
  },
  {
    id: 'datong',
    name: '大同村',
    lat: 23.6666,
    lng: 121.4324,
    labelSide: 'left',
    era: '店一間一間開了',
    summary: '大同村是當時泥流最深的地方之一。現在書店、早餐店重新開門，田裡又種下新一季的作物。（原型先以光復的公共紀念影像暫代，正式版再換入大同村授權今昔照片。）',
    note: '子軒筆記：復原不是回到原樣，而是大家又能開始安排明天。',
    before: photos.volunteersStreet,
    after: photos.memorialNow,
  },
];

export const VOICE_CLIPS = [
  {
    id: 'voice-shopkeeper',
    speaker: '冰店阿姨（原型旁白）',
    title: '店又開了',
    transcript: '那時候整間店都是泥，是一群不認識的年輕人幫我一桶一桶挖出來。現在冰櫃又插上電了。我常常在想，他們什麼時候回來吃一碗冰。',
    prototype: true,
  },
  {
    id: 'voice-farmer',
    speaker: '大同村農友（原型旁白）',
    title: '田又綠了',
    transcript: '土被泥蓋住的時候，我以為不能種了。後來大家幫忙把水路清出來，今年第一批秧苗插下去，看到它長起來，心就定了。',
    prototype: true,
  },
  {
    id: 'voice-volunteer',
    speaker: '返訪志工（原型旁白）',
    title: '我想回去看看',
    transcript: '去年我在光復鏟了三天泥，連一句好好的再見都沒說。聽說街上的店都開了，這次我想回去，不帶鏟子，就當一個普通的遊客。',
    prototype: true,
  },
];

export const REPORTER_PHOTO = {
  src: 'assets/images/reporters-photo.jpg',
  alt: '子軒與搭檔和居民在清理工作後的戲劇重現合照',
  credit: 'AI 生成戲劇示意圖，非真實新聞照片',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
  date: '2025.09.29',
  place: '光復｜清完最後一條水溝',
  backNote: '阿姨說：「下次回來，不用帶鏟子，帶胃口就好。」',
};

// 合照可疊放切換；placeholder 為待補照片的灰色佔位圖。
export const PHOTO_STACK = [
  {
    src: REPORTER_PHOTO.src,
    alt: REPORTER_PHOTO.alt,
    credit: REPORTER_PHOTO.credit,
    date: REPORTER_PHOTO.date,
    place: '清完最後一條水溝',
    note: REPORTER_PHOTO.backNote,
  },
  {
    placeholder: true,
    label: '照片 2（待補）',
    date: '2025.09.28',
    place: '光復車站',
    note: '早上第一班車，月台上全是雨鞋。',
  },
  {
    placeholder: true,
    label: '照片 3（待補）',
    date: '2026.09',
    place: '佛祖街',
    note: '阿伯的店重新開門那天，騎樓又坐滿了人。',
  },
  {
    placeholder: true,
    label: '照片 4（待補）',
    date: '2026.11.15',
    place: '回光復',
    note: '這一張，等你回來一起拍。',
  },
];

export const DESK_TEXTURE = {
  src: 'assets/images/desk-texture.jpg',
  alt: '深色木質桌面紋理',
  credit: 'AI 生成原型背景',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};

export const INTERACTIVE_DESK = {
  src: 'assets/images/interactive-desk.png',
  alt: '深夜新聞編輯部裡的擬真記者工作桌，桌上有電腦、採訪筆記、回訪地圖、收音機與合照',
  credit: 'AI 生成互動桌景原型，非真實新聞現場',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};
