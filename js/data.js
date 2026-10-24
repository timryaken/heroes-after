const SOURCES = {
  twreporterFlood: 'https://www.twreporter.org/a/mataian-creek-barrier-lake',
  setnShovelHeroes: 'https://www.setn.com/news/1727641',
  nownewsSugarFactory: 'https://www.nownews.com/news/6734849',
  tcmbShovels: 'https://tcmb.culture.tw/zh-tw/datasearch?keyword=%E9%A6%AC%E5%A4%AA%E9%9E%8D%E9%A2%A8%E7%81%BD&limit=10&offset=40&sort=relevance&order=desc&isFuzzyMode=false&query=%7B%7D',
  taiwanWetland: 'https://media.taiwan.net.tw/zh-tw/portal/media/collection/3110181_ph_20260120',
  cnaBangcha: 'https://www.cna.com.tw/news/aloc/202510060168.aspx',
  cnaBixin: 'https://www.cna.com.tw/culture/article/20260615w004',
  cteeXiaoguang: 'https://www.ctee.com.tw/news/20260313701403-431206',
  udnSugarFactory: 'https://udn.com/news/story/124616/9046532',
};

// 前導素材整理表「02_圖片檔」「06_前導災前災後照片」列出的 Facebook 照片頁（授權待確認）。
const fbPhoto = (fbid) => `https://www.facebook.com/photo/?fbid=${fbid}`;
const BANGCHA_CREDIT = '照片來源：邦查農場 Facebook（授權待確認）';
const BIXIN_CREDIT = '照片來源：彼心書店 Facebook（授權待確認）';
const XIAOGUANG_CREDIT = '照片來源：小光故事屋 Facebook（授權待確認）';

const photos = {
  flood: {
    src: 'assets/images/prologue-flood.jpg',
    alt: '空拍光復鄉：泥流漫過田地與房舍，只剩樹冠和屋頂露出水面',
    credit: '照片來源：報導者（攝影／謝佩穎，授權待確認）',
    sourceUrl: SOURCES.twreporterFlood,
  },
  shovelHeroes: {
    src: 'assets/images/prologue-shovel-heroes.jpg',
    alt: '大批鏟子超人背著背包、拿著鏟子走進滿是泥濘的光復街道',
    credit: '照片來源：三立新聞網（原圖台鐵提供，授權待確認）',
    sourceUrl: SOURCES.setnShovelHeroes,
  },
  bangchaMachine: {
    src: 'assets/images/prologue-bangcha-machine.jpg',
    alt: '邦查農場被泥流沖毀，挖土機在倒塌的棚架與雜物間整理',
    credit: BANGCHA_CREDIT,
    sourceUrl: fbPhoto('1207989684696304'),
  },
  bixinDrying: {
    src: 'assets/images/prologue-bixin-drying.jpg',
    alt: '彼心書店的書一本本攤開在屋頂的黑布上晾乾',
    credit: BIXIN_CREDIT,
    sourceUrl: fbPhoto('122224580426353355'),
  },
  bangchaReplant: {
    src: 'assets/images/prologue-bangcha-replant.jpg',
    alt: '空拍邦查農場：覆滿淤泥的田地上，排出一圈圈重新耕種的種植點',
    credit: BANGCHA_CREDIT,
    sourceUrl: fbPhoto('1250109317151007'),
  },
  bangchaGreen: {
    src: 'assets/images/prologue-bangcha-green.jpg',
    alt: '空拍邦查農場：田裡重新長出綠色作物，排成一片葉子的形狀',
    credit: BANGCHA_CREDIT,
    sourceUrl: fbPhoto('1509787551183181'),
  },
  bangchaDuring: {
    src: 'assets/images/bangcha-during.jpg',
    alt: '邦查農場被泥流淹沒，有人推著推車在淤泥裡搬泥',
    credit: BANGCHA_CREDIT,
    sourceUrl: fbPhoto('1207989528029653'),
  },
  bangchaAfter: {
    src: 'assets/images/bangcha-after.jpg',
    alt: '邦查農場田裡重新長出一片紅藜',
    credit: BANGCHA_CREDIT,
    sourceUrl: fbPhoto('1467285568766713'),
  },
  bixinDuring: {
    src: 'assets/images/bixin-during.jpg',
    alt: '彼心書店外，被泥沙掩埋的書堆成一座小山',
    credit: BIXIN_CREDIT,
    sourceUrl: fbPhoto('122224580534353355'),
  },
  bixinAfter: {
    src: 'assets/images/bixin-after.jpg',
    alt: '各地寄到彼心書店的祝福卡片，寫著「祝福人人平安康樂」「光復加油」',
    credit: BIXIN_CREDIT,
    sourceUrl: fbPhoto('122221611500353355'),
  },
  xiaoguangDuring: {
    src: 'assets/images/xiaoguang-during.jpg',
    alt: '小光故事屋教室裡，桌椅與書架被泥流沖倒、堆成一團',
    credit: XIAOGUANG_CREDIT,
    sourceUrl: fbPhoto('793048453273251'),
  },
  xiaoguangAfter: {
    src: 'assets/images/xiaoguang-after.jpg',
    alt: '小光故事屋清理乾淨的室內，地板重新露了出來',
    credit: XIAOGUANG_CREDIT,
    sourceUrl: fbPhoto('796410922937004'),
  },
  sugarFactoryDuring: {
    src: 'assets/images/sugar-factory-during.jpg',
    alt: '光復糖廠的救災資源集換站，志工一箱箱傳遞物資',
    credit: '照片來源：NOWnews 今日新聞（授權待確認）',
    sourceUrl: SOURCES.nownewsSugarFactory,
  },
  sharedShovels: {
    src: 'assets/images/shared-shovels.jpg',
    alt: '牆邊堆滿志工用過的鏟子，地上放著藍色小板凳',
    credit: '照片來源：國家文化記憶庫〈花蓮馬太鞍溪堰塞湖洪災-鏟子堆〉（授權待確認）',
    sourceUrl: SOURCES.tcmbShovels,
  },
};

// 前導開場：依「06_前導災前災後照片」，先是災害與行動的 3 張，再是重新開始的 3 張。
export const PROLOGUE_SLIDES = [
  { id: 'flood', phase: 'disaster', ...photos.flood },
  { id: 'shovel-heroes', phase: 'volunteers', ...photos.shovelHeroes },
  { id: 'bangcha-machine', phase: 'volunteers', ...photos.bangchaMachine },
  { id: 'bixin-drying', phase: 'now', ...photos.bixinDrying },
  { id: 'bangcha-replant', phase: 'now', ...photos.bangchaReplant },
  { id: 'bangcha-green', phase: 'now', ...photos.bangchaGreen },
];

// 問卷只區分玩家在事件中的既有參與位置，不限制可看到的內容；headline 是結果頁標語（暫定）。
export const ROLES = [
  {
    id: 'volunteer',
    label: '我曾是鏟子超人',
    byline: '曾是鏟子超人',
    relation: '曾實際前往光復參與災後協助，對現場已有直接經驗。',
    wishPrompt: '如果再次回到光復，你最想確認什麼？',
    headline: '你曾經走進這裡，也曾親手成為改變的一部分。',
  },
  {
    id: 'wanted-to-help',
    label: '我當時想參與，但沒能前往',
    byline: '當時沒能前往',
    relation: '當時有參與意願，但受時間、距離或其他條件限制，未能到現場。',
    wishPrompt: '如果現在能用另一種方式參與，你想做什麼？',
    headline: '你人沒到，這裡卻一直留在心的某個地方。',
  },
  {
    id: 'other',
    label: '我以其他方式關心這裡',
    byline: '在遠方關心',
    relation: '未必到過現場，但曾透過新聞、捐款、社群、轉發或其他方式持續關注。',
    wishPrompt: '你想把哪一句話，留給正在重新開始的人？',
    headline: '英雄，不只出現在現場。',
  },
];

// 周思遠的採訪筆記，時間線停在他出發前往光復。
// lines 裡的空字串是段落間的空行；允許 <mark>（螢光筆）與 <s>（劃掉）兩種手寫效果。
// doodle 是頁邊的手繪裝飾：crown（皇冠與輸贏記號）、ticket（夾在角落的機票）；sparse 會讓版面留更多空白。
export const NOTEBOOK_PAGES = [
  {
    date: '1/1',
    lines: [
      '年度數據出來了。',
      '年度報導流量第一跟第二又是知行和我。',
      '編輯今天還特別把我們兩個叫上台。',
      '',
      '知行說這代表我們很會寫新聞。',
      '我覺得不完全對。',
      '應該是我們比較知道大家想看什麼。',
      '',
      '希望明年能再破一次紀錄。',
    ],
  },
  {
    date: '1/17',
    lines: [
      '今天跟知行一起跑採訪。',
      '',
      '初想的標題：<s>「地方老店重新開幕」</s>',
      '知行看了一眼說：「這個沒人會點。」我也同意。',
      '',
      '改完：<mark>「消失十年的味道回來了！老闆透露重新開店原因」</mark>',
      '',
      '點閱高很多，我有時候沒有很喜歡自己對流量那麼敏感。',
      '但沒辦法，這時代就是追求這個。',
    ],
  },
  {
    date: '3/02',
    doodle: 'crown',
    lines: [
      '這個月流量：',
      '知行 1,284,302',
      '思遠 1,241,870',
      '輸了 42,432。',
      '',
      '他今天故意把排行榜截圖傳給我。',
      '還附一句：「流量之王。」',
      '',
      '很幼稚。',
    ],
  },
  {
    date: '4/21',
    doodle: 'ticket',
    lines: [
      '知行收到總編的任務，要出國採訪一段時間。',
      '我第一個問題是：「那你的新聞怎麼辦？」',
      '他說：「趁我不在，好好享受一下第一名。」',
      '',
      '誰需要他讓。等他回來再比。',
    ],
  },
  {
    date: '6/18',
    sparse: true,
    lines: [
      '知行出國一個多月。',
      '',
      '這個月又是我流量、點擊、轉發第一。',
      '開始有點有點無聊了。',
      '',
      '今天又有人問他什麼時候回來。不知道。',
      '',
      '本來以為旁邊少一個人一直講話，',
      '工作應該會快很多。',
      '',
      '好像也沒有。',
    ],
  },
  {
    date: '9/24',
    lines: [
      '<mark>花蓮・光復 明天就出發</mark>',
      '',
      '可追：',
      '□ 災情範圍',
      '□ 居民撤離',
      '□ 救援',
      '□ 志工',
      '□ 交通中斷',
      '□ 災後復原',
      '',
      '編輯問誰可以去。',
      '我說我去。',
      '',
      '現場的故事很多。',
      '',
      '這一篇應該會有流量。',
    ],
  },
  {
    date: '9/25',
    lines: [
      '相機',
      '錄音筆',
      '行動電源',
      '記憶卡 × 3',
      '筆記本',
      '換洗衣物',
      '',
      '預計：',
      '1.　災情／救援',
      '2.　志工／居民',
      '3.　復原進度',
      '',
      '拍完、整理、交稿。應該最多一周就能回來了。',
      '',
      '如果做得好，這篇應該可以撐一陣子的流量。',
      '',
      '知行也差不多快回來了。',
      '等他回來再給他看。先去光復。',
    ],
  },
];

// 座標是大略位置，正式版需再確認：邦查農場依地址「佛祖街 47 巷」取佛祖街、彼心書店依縣府舊消防隊取光復分隊、小光故事屋取大馬村。
export const PLACES = [
  {
    id: 'bangcha',
    name: '邦查農場',
    lat: 23.6672,
    lng: 121.4336,
    era: '清淤，然後重新種出紅藜',
    summary: '馬太鞍部落最早的有機農場，靠著馬太鞍溪的水源耕作。洪災時土砂淹進農地與溫室，之後一點一點清淤、重新耕種，田裡又長出了紅藜。',
    reading: SOURCES.cnaBangcha,
    before: photos.bangchaDuring,
    after: photos.bangchaAfter,
  },
  {
    id: 'bixin',
    name: '彼心書店',
    lat: 23.6656,
    lng: 121.4248,
    era: '書被掩埋，祝福從各地寄來',
    summary: '光復鄉唯一的獨立書店，原本開在縣府舊消防隊辦公室的一樓。洪水淹進一樓，來不及搬的書被泥沙埋住；清淤後，書被一本本攤開晾乾，各地寄來的祝福卡片也陸續送到書店。',
    reading: SOURCES.cnaBixin,
    before: photos.bixinDuring,
    after: photos.bixinAfter,
  },
  {
    id: 'xiaoguang',
    name: '小光故事屋',
    lat: 23.6729,
    lng: 121.4241,
    labelSide: 'left',
    era: '桌椅被沖倒，空間又回來了',
    summary: '光復孩子們課後學習與陪伴的地方。教室曾被泥沙沖毀、桌椅全倒，後來在志工協助與修繕下重新鋪上地板，恢復運作。',
    reading: SOURCES.cteeXiaoguang,
    before: photos.xiaoguangDuring,
    after: photos.xiaoguangAfter,
  },
  {
    id: 'sugar-factory',
    name: '光復糖廠',
    lat: 23.6574,
    lng: 121.4210,
    labelSide: 'left',
    era: '救災資源集換站',
    summary: '災後，各地捐來的物資集中送到光復糖廠，再由志工整理、分送出去。（災後照片待補。）',
    reading: SOURCES.udnSugarFactory,
    before: photos.sugarFactoryDuring,
    after: { placeholder: true, label: '災後照片待補' },
  },
];

// 收音機裡的兩段影音：嵌入原平台的播放器，不下載檔案；授權仍待確認。
export const VOICE_CLIPS = [
  {
    id: 'voice-stay',
    title: '洪災過後，他們仍想留在光復',
    speaker: '公視《獨立特派員》Facebook 影片',
    vertical: true,
    embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent('https://www.facebook.com/watch/?v=1146783404691110')}&show_text=false&autoplay=true&width=360`,
    sourceUrl: 'https://www.facebook.com/watch/?v=1146783404691110',
  },
  {
    id: 'voice-bangcha',
    title: '邦查農場為什麼去做',
    speaker: 'FATS 食農旅永續青年行動團隊（東華大學）｜19:06–20:07',
    embedUrl: 'https://www.youtube-nocookie.com/embed/VP-T4T-hYlE?start=1146&end=1207&autoplay=1&rel=0',
    sourceUrl: 'https://www.youtube.com/watch?v=VP-T4T-hYlE&t=1146s',
  },
];

// 讀者版的三篇示意留言（假文，照片為 AI 生成示意），正式上線後可由 BOARD_CONFIG.showSamples 關閉。
export const BOARD_SAMPLE_POSTS = [
  {
    id: 'sample-volunteer',
    sample: true,
    role: 'volunteer',
    prompt: '如果再次回到光復，你最想確認什麼？',
    name: '阿哲',
    body: '我最想確認那位阿嬤家門口的花，是不是又擺回去了。那天下火車，整條街都是泥，她一直塞麵包給我們，說吃飽才有力氣。清完她家的騎樓，我們連名字都沒問就走了。',
    photo: { src: 'assets/images/board-sample-boots.jpg', alt: '騎樓牆邊靠著一雙沾滿乾泥的雨鞋和一把舊鐵鏟（AI 生成示意）' },
    likes: 128,
    publishedAt: '2026-10-12',
  },
  {
    id: 'sample-wanted',
    sample: true,
    role: 'wanted-to-help',
    prompt: '如果現在能用另一種方式參與，你想做什麼？',
    name: '小米',
    body: '明年春天，我想帶家人去光復住兩晚。那時候我在台北加班，只能一直轉發物資需求，看著大家出發。這次想自己去走走，買一點在地的東西，吃一碗麵，跟店家說聲辛苦了。',
    likes: 64,
    publishedAt: '2026-10-15',
  },
  {
    id: 'sample-other',
    sample: true,
    role: 'other',
    prompt: '你想把哪一句話，留給正在重新開始的人？',
    name: 'Yuki',
    body: '慢慢來也沒關係，我們都還在看著。我畫了一張光復的明信片，等書店重新開門那天，想寄過去給你們。',
    photo: { src: 'assets/images/board-sample-card.jpg', alt: '木桌上一張手繪的山與稻田明信片，旁邊放著彩色鉛筆和熱茶（AI 生成示意）' },
    likes: 37,
    publishedAt: '2026-10-20',
  },
];

// 收音機旁放的照片（「02_圖片檔」的馬太鞍濕地），依政府資料開放授權條款標示來源。
export const SPEAKER_PHOTO = {
  src: 'assets/images/wetland-fireflies.jpg',
  alt: '馬太鞍濕地的「螢饗」夜間餐會，木造棚架下掛著一串串燈泡',
  credit: '照片來源：觀光多媒體開放資料〈2026光復馬太鞍濕地-螢饗〉（拍攝者：花蓮縣馬太鞍休閒農業發展協會；製作單位：農業部；政府資料開放授權條款）',
  sourceUrl: SOURCES.taiwanWetland,
};

// 總編 CHECK LIST：三項都確認後才能按「出發」；id 對應桌上的物件。
export const CHECKLIST = [
  { id: 'speaker', label: '確認思遠留下的錄音', hint: '至少聽一段錄音' },
  { id: 'map', label: '確認光復相關照片', hint: '在地圖上打開一個地點' },
  { id: 'notebook', label: '翻閱思遠的採訪筆記', hint: '讀到出發前的最後一頁' },
];

export const REPORTER_PHOTO = {
  src: 'assets/images/reporters-photo.jpg',
  alt: '周思遠與林知行跑地方採訪時，和居民的戲劇重現合照',
  credit: 'AI 生成戲劇示意圖，非真實新聞照片',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};

// 桌上的照片可疊放切換；placeholder 為待補照片的灰色佔位圖，note 可留空。
export const PHOTO_STACK = [
  {
    ...REPORTER_PHOTO,
    date: '1/17',
    place: '跟知行一起跑採訪',
    note: '「這個沒人會點。」',
  },
  {
    ...photos.sharedShovels,
    date: '光復',
    place: '共享鏟子堆',
    note: '',
  },
];

// 收音機拿起來之後的正面（AI 生成示意，外觀參考桌景裡的那台收音機）。
export const RADIO_FRONT = {
  src: 'assets/images/radio-front.webp',
  alt: '老舊黑色手提收音機的正面：左邊是喇叭網，右邊是螢幕、四個按鍵與兩個旋鈕',
  credit: 'AI 生成示意圖（收音機正面）',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};

export const DESK_TEXTURE = {
  src: 'assets/images/desk-texture.jpg',
  alt: '深色木質桌面紋理',
  credit: 'AI 生成原型背景',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};

export const INTERACTIVE_DESK_MOBILE = {
  src: 'assets/images/interactive-desk-mobile.jpg',
  alt: '手機版直式桌景：周思遠的辦公桌，牆上有地圖，桌上有收音機、筆電、採訪筆記與照片',
  credit: 'AI 生成互動桌景原型（手機版），非真實新聞現場',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};

export const INTERACTIVE_DESK = {
  src: 'assets/images/interactive-desk.png',
  alt: '深夜新聞編輯部裡周思遠的辦公桌，桌上有電腦、採訪筆記、地圖、收音機與照片',
  credit: 'AI 生成互動桌景原型，非真實新聞現場',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};
