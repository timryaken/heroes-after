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
    invitation: '回到曾經伸出手的地方，看看那份力量後來去了哪裡。',
  },
  {
    id: 'wanted-to-help',
    label: '我當時想參與，但沒能前往',
    shortLabel: '當時未能前往',
    wishPrompt: '如果現在能用另一種方式參與，你想做什麼？',
    invitation: '這一次，也許可以用走訪、傾聽與支持補上當時的心意。',
  },
  {
    id: 'other',
    label: '我以其他方式關心這裡',
    shortLabel: '持續關心光復',
    wishPrompt: '你想把哪一句話，留給正在重新開始的人？',
    invitation: '從理解開始，讓關心不只停在新聞離開的那一天。',
  },
];

export const NOTEBOOK_PAGES = [
  {
    eyebrow: '採訪計畫 01',
    title: '一年後的光復',
    body: '週年專題不能只整理數字。我要重新走過當時的路，問問那些被鏡頭匆匆帶過的人：現在，生活回來了嗎？',
  },
  {
    eyebrow: '採訪計畫 02',
    title: '她為什麼留下？',
    body: '去年的最後一則訊息，搭檔只說：「我再待幾天。」後來她把器材留給我，卻沒有一起上車。',
  },
  {
    eyebrow: '同行募集',
    title: '11/15，出發前往光復',
    body: '需要一位同行者：願意走路、願意聽，也願意在不知道答案時先不急著下結論。',
  },
];

export const PLACES = [
  {
    id: 'wetland',
    name: '馬太鞍濕地',
    era: '災前｜與水共處的智慧',
    summary: '從巴拉告生態捕魚到部落面對洪水的自然觀，先理解災害發生前，這片土地如何生活。',
    note: '子軒筆記：不要只問「恢復了多少」，也要問原本的生活方式是否還能延續。',
    before: photos.disaster,
    after: photos.riverNow,
  },
  {
    id: 'sugar-factory',
    name: '光復糖廠',
    era: '災中｜人們如何接住彼此',
    summary: '糖廠曾成為安置、物資與志工記憶的交會點，如今鏟子超人館保存那些工具與留言。',
    note: '子軒筆記：一把磨到只剩木柄的鏟子，也是一段沒被寫進報導的時間。',
    before: photos.volunteersStation,
    after: photos.museumNow,
  },
  {
    id: 'datong',
    name: '大同村',
    era: '災後｜把日常一點一點搬回來',
    summary: '書店、農場與街區重新開門。原型先以光復的公共紀念影像暫代，正式版再換入大同村授權今昔照片。',
    note: '子軒筆記：復原不是回到原樣，而是人們終於又能安排明天。',
    before: photos.volunteersStreet,
    after: photos.memorialNow,
  },
];

export const VOICE_CLIPS = [
  {
    id: 'voice-shopkeeper',
    speaker: '在地店家（原型旁白）',
    title: '重新把門打開',
    transcript: '泥清完以後，最難的不是整理，是每天早上還願不願意把門打開。後來第一個客人走進來，我才知道日子真的在往前。',
    prototype: true,
  },
  {
    id: 'voice-volunteer',
    speaker: '返訪志工（原型旁白）',
    title: '我想知道後來呢',
    transcript: '那時候大家只顧著鏟，名字都沒問。回去以後常想，我們離開之後，他們還好嗎？所以我想再回來看看。',
    prototype: true,
  },
  {
    id: 'voice-farmer',
    speaker: '農友（原型旁白）',
    title: '再種一次',
    transcript: '有人問我還要不要種。我說土還在，人也還在，就慢慢來。不是忘記發生過什麼，是知道下一步要做什麼。',
    prototype: true,
  },
];

export const REPORTER_PHOTO = {
  src: 'assets/images/reporters-photo.jpg',
  alt: '子軒與搭檔和居民在清理工作後的戲劇重現合照',
  credit: 'AI 生成戲劇示意圖，非真實新聞照片',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
  date: '2025.09.29',
  place: '光復｜採訪工作照',
  backNote: '子軒：她說還有一個人沒來得及好好道別……',
};

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
