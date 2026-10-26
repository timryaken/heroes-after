# 《重返·馬太鞍》互動式前導原型

供內部溝通與操作測試使用的原生 HTML／CSS／JavaScript 原型。內容依〈英雄之後_前導遊戲素材整理〉表單（2026/10/24 版）：遊戲名稱 2026/10/25 改為《重返·馬太鞍》（標準字 `assets/images/logotype.webp` 由 ChatGPT 生成），主角名暫用「07_遊戲與角色命名備案」的周思遠。記者周思遠出發去了光復，林知行出發前，總編整理思遠留下的辦公桌。前導開場用「06_前導災前災後照片」的 6 張照片；玩家查看收音機（錄音）、地圖（邦查農場、彼心書店、光復糖廠的災害當下與災後照片，以及馬太鞍濕地現在的照片）、採訪筆記（1/1～9/25 七頁），完成總編 CHECK LIST 後按「出發」。

## 本機啟動

在此資料夾執行：

```bash
python3 -m http.server 4173
```

接著開啟 `http://localhost:4173/`。不要直接雙擊 `index.html`，因為瀏覽器可能限制 ES modules。

## 建議展示流程

1. 播放或跳過前導，確認災後天數會從 `2025-09-23` 自動計算。
2. 選擇三種身分之一（每次重新整理都會重問，不沿用上次的選擇），桌景上方的大標題會換成該身分的結果頁標語，電腦的祈願提問也會不同。
3. 進桌面時先看到「總編的便條」（身分標語＋說明），按「開始整理」收成左上角的小便條。桌景滿版鋪滿畫面，點發光的物件打開；畫面放不下時可以拖曳桌面（手機版用直式桌景 `interactive-desk-mobile.webp`，放大 1.2 倍，需要拖曳才看得到全部物件）。
4. 右下角的總編 CHECK LIST（手機版在畫面底部，可收合）會依下面三項自動打勾，三項都完成才解鎖「出發」：
   - 收音機：轉到正面後，按 ▶ 播放任一段錄音（載入播放器即算聽過）；◀◀ ▶▶ 或左旋鈕換台，右旋鈕切換靜音。
   - 地圖：點開任一個地點。
   - 筆記本：點封面翻開，翻到最後一頁（9/25）。
5. 「出發」視窗可留 Email（正式遊戲開放時通知）；電腦留言與桌上的照片是選看項目，完成後一樣會打勾。
6. 電腦是留言板：筆電放大後先看到「讀者版」（報紙排版的已上架留言與讚數，另有三篇標示「示意」的假文）；右下角「投稿我的留言」打開投稿視窗，依身分顯示一個題目，可附一張照片與署名。
7. 桌景、收音機、筆電外框、紙本地圖與 CHECK LIST 板夾都是 AI 生成的擬真示意圖；可以點的物件上有呼吸的小點和手寫的名稱標註，看過後小點變成勾勾；滑過物件時物件會放大變亮。板夾上的項目用紅筆打勾：點桌面時板夾會收到畫面下緣，每完成一項會再跳出來，全部完成時「出發」按鈕會跳動提醒。右上角只有「素材來源」與「聲音」兩個圖示。
8. 按「出發」後，玩家選「讚／倒讚」回答「你對本網站的體驗滿意嗎？」，並留下 Email 參加抽獎（一定要留 Email 才能投票；同一個 Email 只算一次）。後台審核頁的「滿意度與抽獎」分頁有統計報表與名單，可下載 CSV。
9. 點桌上的物件時，物件會從桌上的位置拿起來放到畫面中央（收音機邊轉邊轉到正面、地圖從牆上移到中間），按「放回桌上」或 Esc 會放回原位；照片可以點一下翻到背面。

## 留言板後台（Supabase）

- 沒填 `js/board-config.js` 時是示意模式：送出的留言只存在這台裝置，讀者版只顯示示意文，讚數只在本機加一。
- 接上後台的步驟：
  1. 在 Supabase 建一個新專案，到 SQL Editor 貼上 `supabase/schema.sql` 全文執行。
  2. 把最後一行的 Email 換成審核者的 Email 再執行，加入 `board_admins` 名單。
  3. Authentication → Users 用「Invite user」邀請同一個 Email；Authentication → URL Configuration 的 Redirect URLs 加上 `https://timryaken.github.io/heroes-after/admin.html`（本機測試再加 `http://localhost:4173/admin.html`）。建議關掉公開註冊（Allow new users to sign up）。
  4. 把 Project URL 與 Publishable key（可公開的前端金鑰）填進 `js/board-config.js`。不要放 service_role／secret key。
- 審核頁：`admin.html`（不在網站上連結、不被搜尋引擎收錄）。用 Email 登入連結登入後，可以「通過並上架」「退回」「下架」。
- 權限：訪客只能送出待審留言、上傳待審照片（私人空間）、讀已上架留言、替已上架留言按讚；照片在通過時才複製到公開空間。上傳前會在瀏覽器縮到 1600px 並移除 EXIF（含 GPS）。
- 按讚以「同一台裝置每篇一次」限制，換裝置或清除瀏覽器資料仍可再按。
- Supabase 免費專案一週沒有使用會自動暫停，需要到後台恢復。

## 外部資源

- 收音機的兩段影音是示意素材，嵌入 YouTube／Facebook 原平台播放器，需連網，不下載檔案。螢幕上的各頻率音量條是模擬的（網頁讀不到外部播放器的聲音）。收音機正面圖 `assets/images/radio-front.webp` 為 AI 生成示意。
- 地圖是一張本機的紙本地圖圖片（不再使用 Leaflet 與線上圖磚），點位為大略位置；手機上可以左右拖著看。
- 筆記本手寫字型為 Google Fonts 的霞鶩文楷 TC（LXGW WenKai TC）。

## 重設原型

從右上角「素材來源」開啟面板，按「重設這台裝置上的原型資料」。這只會清除本原型使用的 `heroes-after-prototype` localStorage 鍵，並重新開啟身分選擇，不會影響其他網站資料。

## 隱私與功能限制

- Email 與探索進度只暫存在目前瀏覽器的 localStorage，不會寄信或傳送到伺服器。
- 留言板接上 Supabase 後，送出的文字與照片會上傳到後台，經審核才公開；送出前畫面會提示這件事。
- 互動桌景、桌面紋理、標準字、收音機／筆電／板夾／圖釘與紙本地圖為 AI 生成示意；不代表真實人物或新聞紀錄。

## 照片與來源政策

前導、地圖、收音機與桌上的照片都來自素材整理表：報導者、三立新聞網、NOWnews、邦查農場／彼心書店的 Facebook、國家文化記憶庫與觀光多媒體開放資料，畫面內與「素材來源」面板保留來源連結。圖片已下載成本機檔案並移除 EXIF（含 GPS）。除馬太鞍濕地照片標示為政府資料開放授權外，其餘照片與兩段影音的授權皆待確認。現階段僅限內部原型溝通；正式對外發布前，必須逐張確認著作權授權、使用範圍與署名方式。地圖座標為大略位置，正式版需再確認。

## 更換內容與素材

- 預覽密碼：`js/gate.js`（只存密碼的 SHA-256；同一個分頁輸入過就不再問）。這只是預覽門檻，不是真正的保護。
- 桌上的小東西（檯燈、窗外、咖啡杯、書架）與記者證：文字在 `js/data.js` 的 `DESK_PROPS`、`PRESS_BADGE`，位置在 `styles/desk.css` 的 `.desk-prop--*`；每個小東西有一顆錯開節奏的小光點，點過就熄掉。記者證畫在桌景裡（掛在軟木板右下角），證件照 `assets/images/press-portrait.jpg` 為 AI 生成的虛構人物，桌景以它為參考重新生成。
- 讀者版置頂：要先在 Supabase 執行 `supabase/pin.sql`，之後在審核頁「已上架」設定置頂與 ↑ ↓ 順序。
- 滿意度與抽獎：前台在 `js/feedback.js`，資料表與送出函式在 `supabase/feedback.sql`（要在 Supabase 的 SQL Editor 執行一次），報表在 `admin.html` 的「滿意度與抽獎」分頁。
- 留言板：連線設定在 `js/board-config.js`，資料存取在 `js/board-api.js`，畫面在 `js/board.js`；示意文是 `js/data.js` 的 `BOARD_SAMPLE_POSTS`；後台結構在 `supabase/schema.sql`；審核頁是 `admin.html` 與 `js/admin.js`。
- 桌面：滿版與拖曳在 `js/desk-view.js`；物件熱區位置在 `styles/desk.css`（直式畫面另有一組位置）。
- 地圖：底圖 `assets/images/guangfu-map.webp` 由 AI 依 OpenStreetMap 光復鄉一帶的地圖重繪，點位用 `js/data.js` 的 `GUANGFU_MAP.bounds` 由經緯度換算；換底圖時要一起更新 bounds。
- 筆電外框 `assets/images/laptop-front.webp` 用 border-image 九宮格切（螢幕區域 98–1413 × 42–781 px）；板夾 `assets/images/clipboard.webp` 的紙張位置寫在 `styles/objects.css`。
- 物件拿起來的動畫：`js/lift.js`（起點角度寫在各物件的 `data-lift-from`）；收音機、筆電、地圖、筆記本、照片與 CHECK LIST 板夾的外觀在 `styles/objects.css`。
- 收音機：按鍵與選台在 `js/audio.js`，音量條在 `js/scope.js`；按鍵與螢幕疊在正面圖上的位置（百分比）在 `styles/objects.css`，換圖時要一起對齊。
- 遊戲名與主角名：`index.html`（標題、wordmark、桌面說明）、`js/prologue.js`（前導最後一句）、`js/data.js`（筆記、CHECK LIST、替代文字）。
- 文案、角色標題、地點座標、來源、旁白：編輯 `js/data.js`。
- 圖片：把新檔案放進 `assets/images/`，並同步修改 `js/data.js` 的 `src`、`alt`、`credit`、`sourceUrl`。
- 筆記本：編輯 `js/data.js` 的 `NOTEBOOK_PAGES`（空字串是空行，`doodle`／`sparse` 是頁面裝飾）。
- CHECK LIST 項目：編輯 `js/data.js` 的 `CHECKLIST`；行為在 `js/checklist.js`。
- 桌上那疊照片：編輯 `js/data.js` 的 `PHOTO_STACK`（含「02_圖片檔」裡其他地方沒用到的 11 張，背面文字為暫定）。
- 開場的總編便條貼在桌景左上角的留白處；手機版貼在畫面下方。板夾在第一次看完物件後才出現。
- 桌上的照片疊放：編輯 `js/data.js` 的 `PHOTO_STACK`；`placeholder: true` 是灰色佔位圖，補照片時改成 `src` 與 `alt` 即可。
- 光復糖廠的災後照片目前是灰色佔位圖（`placeholder: true`），補照片時改成 `src`、`alt`、`credit`、`sourceUrl`。
- 視覺：共用樣式在 `styles/base.css`，前導在 `styles/prologue.css`，桌景、便條、表單與讀者版在 `styles/desk.css`，拿起來的物件在 `styles/objects.css`。
- 地圖行為：`js/map.js`；打勾條件串接在 `js/app.js`。
- 災害起算日：在 `js/core.js` 的 `daysSinceDisaster` 預設值修改。

修改後執行：

```bash
node --test tests/*.test.mjs
node scripts/check-static.mjs
```

靜態檢查會確認入口檔、五個物件、本機圖片、替代文字、署名與 HTTPS 來源網址。
