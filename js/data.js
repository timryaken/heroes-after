const SOURCES = {
  twreporterFlood: 'https://www.twreporter.org/a/mataian-creek-barrier-lake',
  setnShovelHeroes: 'https://www.setn.com/news/1727641',
  nownewsSugarFactory: 'https://www.nownews.com/news/6734849',
  tcmbShovels: 'https://tcmb.culture.tw/zh-tw/datasearch?keyword=%E9%A6%AC%E5%A4%AA%E9%9E%8D%E9%A2%A8%E7%81%BD&limit=10&offset=40&sort=relevance&order=desc&isFuzzyMode=false&query=%7B%7D',
  taiwanWetland: 'https://media.taiwan.net.tw/zh-tw/portal/media/collection/3110181_ph_20260120',
  cnaBangcha: 'https://www.cna.com.tw/news/aloc/202510060168.aspx',
  cnaBixin: 'https://www.cna.com.tw/culture/article/20260615w004',
  udnSugarFactory: 'https://udn.com/news/story/124616/9046532',
};

// 前導素材整理表「02_圖片檔」「06_前導災前災後照片」列出的 Facebook 照片頁（授權待確認）。
const fbPhoto = (fbid) => `https://www.facebook.com/photo/?fbid=${fbid}`;
const BANGCHA_CREDIT = '照片來源：邦查農場 Facebook（授權待確認）';
const BIXIN_CREDIT = '照片來源：彼心書店 Facebook（授權待確認）';
const BIXIN_PHOTOGRAPHER_CREDIT = '照片來源：彼心書店 Facebook（攝影：林彥劭，授權待確認）';

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
    credit: BIXIN_PHOTOGRAPHER_CREDIT,
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
  // 素材表備註「待確認使用：赫恪老師家」，確認前先保留。
  bixinDuring: {
    src: 'assets/images/bixin-during.jpg',
    alt: '彼心書店外，被泥沙掩埋的書堆成一座小山',
    credit: BIXIN_CREDIT,
    sourceUrl: fbPhoto('122224580534353355'),
  },
  bixinAfter: {
    src: 'assets/images/bixin-after.jpg',
    alt: '各地寄到彼心書店的祝福卡片，寫著「祝福人人平安康樂」「光復加油」',
    credit: BIXIN_PHOTOGRAPHER_CREDIT,
    sourceUrl: fbPhoto('122221611500353355'),
  },
  // 「02_圖片檔」的馬太鞍濕地，依政府資料開放授權條款標示來源。
  wetlandFireflies: {
    src: 'assets/images/wetland-fireflies.jpg',
    alt: '馬太鞍濕地的「螢饗」夜間餐會，木造棚架下掛著一串串燈泡',
    credit: '照片來源：觀光多媒體開放資料〈2026光復馬太鞍濕地-螢饗〉（拍攝者：花蓮縣馬太鞍休閒農業發展協會；製作單位：農業部；政府資料開放授權條款）',
    sourceUrl: SOURCES.taiwanWetland,
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

// 周思遠光復採訪紀錄（依素材表「03_思遠採訪筆記」）：以記者／編輯部整理事件的角度記錄，不寫成私人日記；人物設定改由記者證交代。
// date 是頁首的時間點；lines 裡的空字串是段落間的空行；允許 <mark>（螢光筆）與 <s>（劃掉）兩種手寫效果。
// doodle 是頁邊的手繪裝飾：crown（皇冠與輸贏記號）、ticket（夾在角落的機票）；sparse 會讓版面留更多空白。
export const NOTEBOOK_PAGES = [
  {
    date: '2025／風災發生後',
    lines: [
      '2025 年 9 月，花蓮馬太鞍。',
      '',
      '風災發生後，大量消息快速湧入編輯部。',
      '災情、撤離、救援、交通、志工……',
      '幾乎每隔一段時間，就有新的消息。',
      '',
      '編輯部需要記者前往現場。',
      '周思遠接下了這次採訪。',
      '',
      '採訪方向：',
      '災情／居民／救援／志工／災後復原',
      '',
      '預計採訪：5–7 天',
    ],
  },
  {
    date: '2025／光復採訪期間',
    lines: [
      '思遠按照原本的採訪計畫，',
      '完成訪問、拍攝與資料整理。',
      '',
      '幾天後，相關報導陸續刊出。',
      '',
      '災情、救援、志工、居民……',
      '原本安排的題目，都完成了。',
      '',
      '✓ 採訪完成',
      '✓ 稿件交付',
      '✓ 報導刊出',
      '✓ 素材歸檔',
      '',
      '照理來說，',
      '這次採訪到這裡就結束了。',
    ],
  },
  {
    date: '2025／採訪結束後',
    lines: [
      '採訪結束後，',
      '思遠回到報社，完成資料整理。',
      '',
      '不久後，他提出離職。',
      '',
      '當年的報導已經完成，',
      '但他的採訪資料裡，',
      '還留下了一些沒有被寫進新聞的',
      '照片、錄音與筆記。',
      '',
      '沒有人很確定，',
      '那趟光復採訪和他的離職，',
      '究竟有多少關係。',
    ],
  },
  {
    date: '2026／風災周年前',
    lines: [
      '一年後，風災周年。',
      '',
      '編輯部決定再次回到光復，',
      '進行周年後續報導。',
      '',
      '這次接下任務的人，是林知行。',
      '',
      '一年前的新聞已經寫完了。',
      '但光復後來發生了什麼？',
      '思遠當時又看見了什麼？',
      '',
      '這一次，',
      '需要重新回到現場看看。',
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
    labelSide: 'left',
    era: '書被掩埋，祝福從各地寄來',
    summary: '光復鄉唯一的獨立書店，原本開在縣府舊消防隊辦公室的一樓。洪水淹進一樓，來不及搬的書被泥沙埋住；清淤後，書被一本本攤開晾乾，各地寄來的祝福卡片也陸續送到書店。',
    reading: SOURCES.cnaBixin,
    before: photos.bixinDuring,
    after: photos.bixinAfter,
  },
  {
    id: 'sugar-factory',
    name: '光復糖廠',
    lat: 23.6574,
    lng: 121.4210,
    era: '救災資源集換站',
    summary: '災後，各地捐來的物資集中送到光復糖廠，再由志工整理、分送出去。（災後照片待補。）',
    reading: SOURCES.udnSugarFactory,
    before: photos.sugarFactoryDuring,
    after: { placeholder: true, label: '災後照片待補' },
  },
  // 只有一張「現在」的照片，沒有災害當下的對照；說明文字為草稿，待確認。
  {
    id: 'wetland',
    name: '馬太鞍濕地',
    lat: 23.6589,
    lng: 121.41,
    labelSide: 'left',
    era: '夜裡，螢火蟲回來了',
    summary: '馬太鞍部落旁的濕地，水源與生態是部落生活的一部分。2026 年的「螢饗」把人們帶回濕地，在燈串下一起吃飯、等螢火蟲出來。（說明文字待確認。）',
    after: photos.wetlandFireflies,
    afterLabel: '現在',
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

// 總編 CHECK LIST：三項都確認後才能按「出發」；id 對應桌上的物件。
export const CHECKLIST = [
  { id: 'speaker', label: '確認思遠留下的錄音', hint: '至少聽一段錄音' },
  { id: 'map', label: '確認光復相關照片', hint: '在地圖上打開一個地點' },
  { id: 'notebook', label: '翻閱思遠的採訪筆記', hint: '讀到最後一頁' },
];

// 桌上的照片可疊放切換；placeholder 為待補照片的灰色佔位圖，note 可留空。
export const PHOTO_STACK = [
  {
    ...photos.sharedShovels,
    date: '光復',
    place: '共享鏟子堆',
    note: '',
  },
  // 以下是「02_圖片檔」裡其他地方沒用到的照片；背面的字是暫定文字，待確認。
  ...[
    ['stack-bixin-mudflow', '122186920862353355', BIXIN_PHOTOGRAPHER_CREDIT, '9/23', '光復街上', '泥流沖進街上，車子停在泥裡。', '9 月 23 日 16:07，郵局前的街道被泥流淹過，車子陷在泥裡'],
    ['stack-bixin-inside', '122186921954353355', BIXIN_PHOTOGRAPHER_CREDIT, '9/23', '彼心書店', '書店裡面，什麼都倒了。', '9 月 23 日 18:43，彼心書店內部被泥水淹過，桌椅物品倒成一片'],
    ['stack-bixin-escape', '122186922080353355', BIXIN_PHOTOGRAPHER_CREDIT, '9/23', '彼心書店', '22:35，自行脫困。', '9 月 23 日 22:35，彼心書店門口的鐵門與堆在地上的雜物'],
    ['stack-bixin-buried', '122192962238353355', BIXIN_PHOTOGRAPHER_CREDIT, '災後', '光復', '整片都被泥沙蓋住。', '被泥沙淹沒的田地，只露出一截鐵架'],
    ['stack-bixin-temple', '122192961908353355', BIXIN_PHOTOGRAPHER_CREDIT, '災後', '光復', '寺廟前也是一片泥。', '遠方的寺廟前是一整片乾掉的泥地'],
    ['stack-bixin-excavators', '122192964206353355', BIXIN_PHOTOGRAPHER_CREDIT, '災後', '溪邊', '怪手一台一台在整理。', '陰天的溪邊，幾台怪手在泥沙地上整理河道'],
    ['stack-bixin-shovel', '122189161466353355', BIXIN_PHOTOGRAPHER_CREDIT, '災後', '清泥', '一鏟一鏟清。', '穿雨鞋的人拿著鏟子在泥地上清泥，旁邊是推車'],
    ['stack-bangcha-circles', '1250109090484363', BANGCHA_CREDIT, '重新開始', '邦查農場', '在泥地上，圍出一圈一圈的田。', '邦查農場的人在泥地上整理一圈圈的台灣藜田圈'],
    ['stack-bangcha-aerial', '1250109183817687', BANGCHA_CREDIT, '重新開始', '邦查農場', '從上面看，田圈一個一個排好了。', '空拍邦查農場的台灣藜田圈，一圈圈排列在泥地上'],
    ['stack-bangcha-rebuild', '1506242204871049', BANGCHA_CREDIT, '重建', '邦查農場', '溫室的屋頂重新搭起來。', '幾個人站在梯子上，替邦查農場的溫室重新鋪上屋頂'],
    ['stack-bangcha-drying', '1467285722100031', BANGCHA_CREDIT, '收成', '邦查農場', '紅藜收成，攤開來曬。', '收成的紅藜攤在帆布上曬乾，一整片紅色'],
  ].map(([file, fbid, credit, date, place, note, alt]) => ({
    src: `assets/images/${file}.jpg`, alt, credit, sourceUrl: fbPhoto(fbid), date, place, note,
  })),
];

// 收音機拿起來之後的正面（AI 生成示意，外觀參考桌景裡的那台收音機）。
export const RADIO_FRONT = {
  src: 'assets/images/radio-front.webp',
  alt: '老舊黑色手提收音機的正面：左邊是喇叭網，右邊是螢幕、四個按鍵與兩個旋鈕',
  credit: 'AI 生成示意圖（收音機正面）',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};

// 筆電正面與 CHECK LIST 板夾（AI 生成示意），介面疊在螢幕與紙張的位置上。
export const LAPTOP_FRONT = {
  src: 'assets/images/laptop-front.webp',
  alt: '銀色筆電的正面',
  credit: 'AI 生成示意圖（筆電外框）',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};

export const CLIPBOARD = {
  src: 'assets/images/clipboard.webp',
  alt: '夾著一張米色紙的舊木板夾',
  credit: 'AI 生成示意圖（CHECK LIST 板夾）',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};

// 紙本地圖底圖：依 OpenStreetMap 光復鄉一帶的地圖由 AI 重新繪製；bounds 是參考圖的經緯度範圍，用來換算點位。
export const GUANGFU_MAP = {
  src: 'assets/images/guangfu-map.webp',
  alt: '光復鄉一帶的紙本地圖示意：馬太鞍溪從上方流過，光復市區在中央，左側是山',
  credit: 'AI 生成示意圖，依 OpenStreetMap 貢獻者的地圖資料重新繪製（ODbL）',
  sourceUrl: 'https://www.openstreetmap.org/copyright',
  bounds: { north: 23.69028, south: 23.63996, west: 121.38614, east: 121.46853 },
};

// 標準字與圖釘（AI 生成）。
export const LOGOTYPE = {
  src: 'assets/images/logotype.webp',
  alt: '《重返·馬太鞍》標準字',
  credit: 'AI 生成標準字（ChatGPT），暫定',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};

export const PUSHPIN = {
  src: 'assets/images/pushpin.webp',
  alt: '紅色圖釘',
  credit: 'AI 生成示意圖（圖釘）',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};

// 記者證（照片為 AI 生成的虛構人物）：內容依素材表「08_記者證」，只寫故事開始前玩家合理知道的事，不寫他在光復後的轉變或離職原因。
// 桌上可以點的小東西：點了會跳出一小段手寫文字（文字為暫定）。
export const PRESS_BADGE = {
  src: 'assets/images/press-portrait.jpg',
  alt: '周思遠的記者證照片（AI 生成的虛構人物）',
  credit: 'AI 生成示意圖（周思遠的證件照，虛構人物）',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
  name: '周思遠',
  role: '採訪記者',
  number: 'No. 0917',
  note: '周思遠｜採訪記者\n擅長：議題整理、資料分析、新聞企劃\n總編：「交給他的案子通常不用催。知道什麼值得追，也知道怎麼把題目做出成績。」\n目前狀態：去年進行花蓮光復採訪後，已提出離職。',
};

export const DESK_PROPS = [
  { id: 'lamp', label: '檯燈', note: '這盞黃銅檯燈是思遠從舊家搬來的。他說日光燈太亮，想不出標題。' },
  { id: 'window', label: '窗外', note: '凌晨兩點，城市還醒著。思遠常常對著窗外改稿到天亮。' },
  { id: 'mug', label: '咖啡杯', note: '杯底還留著一圈乾掉的咖啡漬。他離職那天，連杯子都沒帶走。' },
  { id: 'shelf', label: '書架', note: '一整排舊報紙和剪報，邊上貼滿便利貼，最上面那張寫著「光復」。' },
];

export const DESK_TEXTURE = {
  src: 'assets/images/desk-texture.jpg',
  alt: '深色木質桌面紋理',
  credit: 'AI 生成原型背景',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};

export const INTERACTIVE_DESK_MOBILE = {
  src: 'assets/images/interactive-desk-mobile.webp',
  alt: '手機版直式桌景：周思遠的辦公桌，牆上有地圖，桌上有收音機、筆電、採訪筆記、照片與記者識別證',
  credit: 'AI 生成互動桌景原型（手機版），非真實新聞現場',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};

export const INTERACTIVE_DESK = {
  src: 'assets/images/interactive-desk.webp',
  alt: '深夜裡周思遠的辦公桌：牆上的地圖、筆電、收音機、採訪筆記、一疊照片，還有他的記者識別證',
  credit: 'AI 生成互動桌景原型，非真實新聞現場',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};
