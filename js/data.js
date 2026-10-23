const SOURCES = {
  ptsDisaster: 'https://news.pts.org.tw/article/771944',
  cnaVolunteers: 'https://www.cna.com.tw/news/asoc/202509280229.aspx',
  cnaCleanup: 'https://www.cna.com.tw/news/aipl/202509270165.aspx',
  ptsAnniversary: 'https://news.pts.org.tw/article/828012',
  cnaMuseum: 'https://www.cna.com.tw/news/aloc/202606060104.aspx',
  ptsMemorial: 'https://news.pts.org.tw/article/805126',
  cnaBangcha: 'https://www.cna.com.tw/news/aloc/202510060168.aspx',
  cnaBixin: 'https://www.cna.com.tw/culture/article/20260615w004',
  cteeXiaoguang: 'https://www.ctee.com.tw/news/20260313701403-431206',
  udnSugarFactory: 'https://udn.com/news/story/124616/9046532',
};

// 前導素材整理表「02_圖片檔」的原始圖片網址（FB 圖片網址有時效，原貼文網址待補）。
const SHEET_IMAGE_URLS = {
  bangchaDuring: 'https://scontent.ftpe14-1.fna.fbcdn.net/v/t39.30808-6/557638440_1207991428029463_3036226397234658890_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x2048&ctp=s1536x2048&_nc_cat=108&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_ohc=t2AfxIdGQBUQ7kNvwGFiUME&_nc_oc=AdqtU1N2mhKnNOROwYbRJTDJbYfXOjHvJGQud8boeKWYuI5YmYQpyVTD_U7lgv07A3Y&_nc_zt=23&_nc_ht=scontent.ftpe14-1.fna&_nc_gid=i3WYJs3Clxt8MHazCkww6g&_nc_ss=7b2a8&oh=00_AQP9i4DPPMwH0OZeOVG4eDAymTFoYmuJAz7dqir3op7vlA&oe=6ADEF6A7',
  bangchaAfter: 'https://scontent.ftpe14-1.fna.fbcdn.net/v/t39.30808-6/584309842_1250111010484171_8241184142871493596_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1365&ctp=s2048x1365&_nc_cat=103&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_ohc=le6dwOg3ZQMQ7kNvwGZjqyh&_nc_oc=AdrmvDwkf-yxAjJmyWRya3-wuJttlsUdI_EL_12Z2YDXnTJYp31C2gguyI5ldsYMLTg&_nc_zt=23&_nc_ht=scontent.ftpe14-1.fna&_nc_gid=n4SDRkGRtnnR2tExBvWqwA&_nc_ss=7b2a8&oh=00_AQP03dTWRASyR3yVuVNYguLu0NRWMIEWzRIrVhznrOkjBg&oe=6ADEF8C5',
  bixinDuring: 'https://scontent.ftpe14-1.fna.fbcdn.net/v/t39.99422-6/857608161_3371922239674999_271998674442411391_n.png?stp=dst-jpg_tt6&cstp=mx1108x1477&ctp=s1108x1477&_nc_cat=103&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_ohc=VPbOAk4Ze94Q7kNvwEi1SK_&_nc_oc=AdqLTPBhMEQ53v6dlr1gxcRNBZEW9Am0JYzeRQUnXjFQB6TazrHhSVAzIr-poHPktE4&_nc_zt=14&_nc_ht=scontent.ftpe14-1.fna&_nc_gid=ZY9DyCwfhRwBnTCyAjeJUA&_nc_ss=7b2a8&oh=00_AQOTByvMsN2RQn5QdbnEYiiE4pbAt5q5xi-CrO3ip9UTTw&oe=6ADF0FAD',
  bixinAfter: 'https://scontent.ftpe14-1.fna.fbcdn.net/v/t39.99422-6/859478355_2828806067475664_4976383592069195371_n.png?stp=dst-jpg_tt6&cstp=mx1477x1108&ctp=s1477x1108&_nc_cat=109&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_ohc=70ACIwFwYdcQ7kNvwF4g_d1&_nc_oc=AdpXnLIZMX5ReU_vD76_anfMmF9JQZa1kutUltL4aTtl8zK9TaAaGj1dupsfcn6tpZ4&_nc_zt=14&_nc_ht=scontent.ftpe14-1.fna&_nc_gid=ZY9DyCwfhRwBnTCyAjeJUA&_nc_ss=7b2a8&oh=00_AQMjVWx7wvCy-qvHC4oy3IWTKiJ-Eh45nVG0GZ0SkZYo-g&oe=6ADF1694',
  xiaoguangDuring: 'https://scontent.ftpe14-1.fna.fbcdn.net/v/t39.30808-6/553675175_793048633273233_3049715377782294339_n.jpg?stp=dst-jpg_tt6&cstp=mx868x1156&ctp=s868x1156&_nc_cat=103&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_ohc=UjwwOruunkIQ7kNvwGYPWZv&_nc_oc=Adp9Ij1I3Alsrhr-pE_bk-LwgYw7xgmw9lsMyVIqmOJNOHo6zHIxq5KtNHmlMLFXr6w&_nc_zt=23&_nc_ht=scontent.ftpe14-1.fna&_nc_gid=C0RQC-WwJf1ytEoVn9-mHA&_nc_ss=7b2a8&oh=00_AQNMQm9P8vcAZTUyfWoKNkLWRRNyY5emF4j__KoP1JoC-Q&oe=6ADF091A',
  xiaoguangAfter: 'https://scontent.ftpe14-1.fna.fbcdn.net/v/t39.30808-6/558205697_806296781948418_3980299337800017368_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1536&ctp=s2048x1536&_nc_cat=104&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_ohc=oudMH8USaCYQ7kNvwHuQVXw&_nc_oc=AdoH7wPqLYprb8YYH6w17_I8Yot-MNFbPBOLe10UUbR6LaiMKdZphiDdz-7mBpiNZHA&_nc_zt=23&_nc_ht=scontent.ftpe14-1.fna&_nc_gid=mlbfySNwdjULAEdteP6Cxg&_nc_ss=7b2a8&oh=00_AQP89U9LJZ-Q3h4_oB_pomM-e-L-OI2v0uLAs4LJGcCidg&oe=6ADF09B6',
  sugarFactoryDuring: 'https://media.nownews.com/nn_media/thumbnail/2025/09/1758685832275-5b4f3e1aafe24f159f2513f3b3375a86-800x600.webp?unShow=false',
  sharedShovels: 'https://dcm.s3.hicloud.net.tw/new/excel/event/2025-11-26/d9293227-1e48-46e6-a8ae-6923e42358f5/collection/ac21ad80-7391-442f-925c-fd1a18eee202/4cc2f447-8773-43cb-9e06-7a0a31065bc4.jpeg',
};

const FB_CREDIT = '照片來源：Facebook 公開貼文（原貼文待補、授權待確認）';

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
    credit: '畫面來源：公視新聞網',
    sourceUrl: SOURCES.ptsMemorial,
  },
  bangchaDuring: {
    src: 'assets/images/bangcha-during.jpg',
    alt: '邦查農場被泥流淹沒，有人推著推車在淤泥裡清淤',
    credit: FB_CREDIT,
    sourceUrl: SHEET_IMAGE_URLS.bangchaDuring,
  },
  bangchaAfter: {
    src: 'assets/images/bangcha-after.jpg',
    alt: '空拍邦查農場：覆滿淤泥的田地上，排出一圈圈重新復苗的種植點',
    credit: FB_CREDIT,
    sourceUrl: SHEET_IMAGE_URLS.bangchaAfter,
  },
  bixinDuring: {
    src: 'assets/images/bixin-during.jpg',
    alt: '彼心書店外，被泥沙掩埋的書堆成一座小山',
    credit: FB_CREDIT,
    sourceUrl: SHEET_IMAGE_URLS.bixinDuring,
  },
  bixinAfter: {
    src: 'assets/images/bixin-after.jpg',
    alt: '彼心書店的書一本本攤開在屋頂的黑布上晾乾',
    credit: FB_CREDIT,
    sourceUrl: SHEET_IMAGE_URLS.bixinAfter,
  },
  xiaoguangDuring: {
    src: 'assets/images/xiaoguang-during.jpg',
    alt: '小光故事屋教室裡，桌椅與書架被泥流沖倒、堆成一團',
    credit: FB_CREDIT,
    sourceUrl: SHEET_IMAGE_URLS.xiaoguangDuring,
  },
  xiaoguangAfter: {
    src: 'assets/images/xiaoguang-after.jpg',
    alt: '小光故事屋恢復運作，孩子和大人們在教室裡比著手勢合照',
    credit: FB_CREDIT,
    sourceUrl: SHEET_IMAGE_URLS.xiaoguangAfter,
  },
  sugarFactoryDuring: {
    src: 'assets/images/sugar-factory-during.jpg',
    alt: '光復糖廠的救災資源集換站，志工一箱箱傳遞物資',
    credit: '照片來源：NOWnews 今日新聞（原報導待補、授權待確認）',
    sourceUrl: SHEET_IMAGE_URLS.sugarFactoryDuring,
  },
  sharedShovels: {
    src: 'assets/images/shared-shovels.jpg',
    alt: '牆邊堆滿志工用過的鏟子，地上放著藍色小板凳',
    credit: '照片來源待補（授權待確認）',
    sourceUrl: SHEET_IMAGE_URLS.sharedShovels,
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

// 問卷只區分玩家在事件中的既有參與位置，不限制可看到的內容；headline 是結果頁標語（暫定）。
export const ROLES = [
  {
    id: 'volunteer',
    label: '我曾是鏟子超人',
    relation: '曾實際前往光復參與災後協助，對現場已有直接經驗。',
    wishPrompt: '如果再次回到光復，你最想確認什麼？',
    headline: '你曾經走進這裡，也曾親手成為改變的一部分。',
  },
  {
    id: 'wanted-to-help',
    label: '我當時想參與，但沒能前往',
    relation: '當時有參與意願，但受時間、距離或其他條件限制，未能到現場。',
    wishPrompt: '如果現在能用另一種方式參與，你想做什麼？',
    headline: '你人沒到，這裡卻一直留在心的某個地方。',
  },
  {
    id: 'other',
    label: '我以其他方式關心這裡',
    relation: '未必到過現場，但曾透過新聞、捐款、社群、轉發或其他方式持續關注。',
    wishPrompt: '你想把哪一句話，留給正在重新開始的人？',
    headline: '英雄，不只出現在現場。',
  },
];

// 谷英雄的採訪筆記，時間線停在他出發前往光復。
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
      '英雄 1,241,870',
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
    era: '清淤，然後重新復苗',
    summary: '馬太鞍部落最早的有機農場，靠著馬太鞍溪的水源耕作。洪災時土砂淹進農地與溫室，之後一點一點清淤，再重新排出一圈圈的種植點。',
    reading: SOURCES.cnaBangcha,
    before: photos.bangchaDuring,
    after: photos.bangchaAfter,
  },
  {
    id: 'bixin',
    name: '彼心書店',
    lat: 23.6656,
    lng: 121.4248,
    era: '書被掩埋，再一本本晾乾',
    summary: '光復鄉唯一的獨立書店，原本開在縣府舊消防隊辦公室的一樓。洪水淹進一樓，來不及搬的書被泥沙埋住；清淤後，書被一本本攤開晾乾。',
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

// 總編 CHECK LIST：三項都確認後才能按「出發」；id 對應桌上的物件。
export const CHECKLIST = [
  { id: 'speaker', label: '確認英雄留下的錄音', hint: '至少聽一段錄音' },
  { id: 'map', label: '確認光復相關照片', hint: '在地圖上打開一個地點' },
  { id: 'notebook', label: '翻閱英雄的採訪筆記', hint: '讀到出發前的最後一頁' },
];

export const REPORTER_PHOTO = {
  src: 'assets/images/reporters-photo.jpg',
  alt: '谷英雄與林知行跑地方採訪時，和居民的戲劇重現合照',
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

export const DESK_TEXTURE = {
  src: 'assets/images/desk-texture.jpg',
  alt: '深色木質桌面紋理',
  credit: 'AI 生成原型背景',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};

export const INTERACTIVE_DESK = {
  src: 'assets/images/interactive-desk.png',
  alt: '深夜新聞編輯部裡谷英雄的辦公桌，桌上有電腦、採訪筆記、地圖、收音機與照片',
  credit: 'AI 生成互動桌景原型，非真實新聞現場',
  sourceUrl: 'https://openai.com/index/introducing-4o-image-generation/',
};
