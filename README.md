# 《與光赴會》互動式前導原型

供內部溝通與操作測試使用的原生 HTML／CSS／JavaScript 原型。內容依〈英雄之後_前導遊戲素材整理〉表單（2026/10/24 版）：遊戲名與主角名先採「07_遊戲與角色命名備案」的第一順位（《與光赴會》、周思遠），尚未定案。記者周思遠出發去了光復，林知行出發前，總編整理思遠留下的辦公桌。前導開場用「06_前導災前災後照片」的 6 張照片；玩家查看收音機（錄音與馬太鞍濕地照片）、地圖（光復四個地方的災害當下與災後照片）、採訪筆記（1/1～9/25 七頁），完成總編 CHECK LIST 後按「出發」。

## 本機啟動

在此資料夾執行：

```bash
python3 -m http.server 4173
```

接著開啟 `http://localhost:4173/`。不要直接雙擊 `index.html`，因為瀏覽器可能限制 ES modules。

## 建議展示流程

1. 播放或跳過前導，確認災後天數會從 `2025-09-23` 自動計算。
2. 選擇三種身分之一，桌景上方的大標題會換成該身分的結果頁標語，電腦的祈願提問也會不同。
3. 進桌面時先看到「總編的便條」（身分標語＋說明），按「開始整理」收成左上角的小便條。桌景滿版鋪滿畫面，點發光點打開物件；畫面放不下時可以拖曳桌面（手機版用直式桌景 `interactive-desk-mobile.jpg`，放大 1.2 倍，需要拖曳才看得到全部物件）。
4. 右下角的總編 CHECK LIST（手機版在畫面底部，可收合）會依下面三項自動打勾，三項都完成才解鎖「出發」：
   - 收音機：按下任一段錄音（載入播放器即算聽過）。
   - 地圖：點開任一個地點。
   - 筆記本：翻到最後一頁（9/25）。
5. 「出發」視窗可留 Email（正式遊戲開放時通知）；電腦留言與桌上的照片是選看項目，完成後一樣會打勾。
6. 電腦是留言板：「寫留言」依身分顯示一個題目，可附一張照片與署名；「讀者版」用報紙排版顯示已上架的留言與讚數，另有三篇標示「示意」的假文。

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

- 收音機的兩段影音嵌入 YouTube／Facebook 原平台播放器，需連網，不下載檔案。
- 地圖使用 Leaflet 1.9.4（cdnjs）與 OpenStreetMap 圖磚，需連網；離線時會改顯示地點按鈕。
- 筆記本手寫字型為 Google Fonts 的霞鶩文楷 TC（LXGW WenKai TC）。

## 重設原型

從右上角「素材來源」開啟面板，按「重設這台裝置上的原型資料」。這只會清除本原型使用的 `heroes-after-prototype` localStorage 鍵，並重新開啟身分選擇，不會影響其他網站資料。

## 隱私與功能限制

- Email 與探索進度只暫存在目前瀏覽器的 localStorage，不會寄信或傳送到伺服器。
- 留言板接上 Supabase 後，送出的文字與照片會上傳到後台，經審核才公開；送出前畫面會提示這件事。
- 周思遠與林知行的合照、互動桌景及桌面紋理為 AI 生成示意；不代表真實人物或新聞紀錄。

## 照片與來源政策

前導、地圖、收音機與桌上的照片都來自素材整理表：報導者、三立新聞網、NOWnews、邦查農場／彼心書店／小光故事屋的 Facebook、國家文化記憶庫與觀光多媒體開放資料，畫面內與「素材來源」面板保留來源連結。圖片已下載成本機檔案並移除 EXIF（含 GPS）。除馬太鞍濕地照片標示為政府資料開放授權外，其餘照片與兩段影音的授權皆待確認。現階段僅限內部原型溝通；正式對外發布前，必須逐張確認著作權授權、使用範圍與署名方式。地圖座標為大略位置，正式版需再確認。

## 更換內容與素材

- 留言板：連線設定在 `js/board-config.js`，資料存取在 `js/board-api.js`，畫面在 `js/board.js`；示意文是 `js/data.js` 的 `BOARD_SAMPLE_POSTS`；後台結構在 `supabase/schema.sql`；審核頁是 `admin.html` 與 `js/admin.js`。
- 桌面：滿版與拖曳在 `js/desk-view.js`；物件熱區位置在 `styles/desk.css`（直式畫面另有一組位置）。
- 遊戲名與主角名：`index.html`（標題、wordmark、桌面說明）、`js/prologue.js`（前導最後一句）、`js/data.js`（筆記、CHECK LIST、替代文字）。
- 文案、角色標題、地點座標、來源、旁白：編輯 `js/data.js`。
- 圖片：把新檔案放進 `assets/images/`，並同步修改 `js/data.js` 的 `src`、`alt`、`credit`、`sourceUrl`。
- 筆記本：編輯 `js/data.js` 的 `NOTEBOOK_PAGES`（空字串是空行，`doodle`／`sparse` 是頁面裝飾）。
- CHECK LIST 項目：編輯 `js/data.js` 的 `CHECKLIST`；行為在 `js/checklist.js`。
- 收音機旁的照片：編輯 `js/data.js` 的 `SPEAKER_PHOTO`。
- 桌上的照片疊放：編輯 `js/data.js` 的 `PHOTO_STACK`；`placeholder: true` 是灰色佔位圖，補照片時改成 `src` 與 `alt` 即可。
- 光復糖廠的災後照片目前是灰色佔位圖（`placeholder: true`），補照片時改成 `src`、`alt`、`credit`、`sourceUrl`。
- 視覺：共用樣式在 `styles/base.css`，前導在 `styles/prologue.css`，桌景、筆記本、地圖與物件對話框在 `styles/desk.css`。
- 地圖行為：`js/map.js`；打勾條件串接在 `js/app.js`。
- 災害起算日：在 `js/core.js` 的 `daysSinceDisaster` 預設值修改。

修改後執行：

```bash
node --test tests/*.test.mjs
node scripts/check-static.mjs
```

靜態檢查會確認入口檔、五個物件、本機圖片、替代文字、署名與 HTTPS 來源網址。
