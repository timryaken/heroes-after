// 留言板後台（Supabase）的連線設定。兩個值都是可公開的前端設定，資料權限由資料庫規則控管。
// 留空時留言板以示意模式運作：送出的留言只存在這台裝置，讀者版只顯示示意文。
export const BOARD_CONFIG = Object.freeze({
  supabaseUrl: 'https://exzdsadmighmwshamqea.supabase.co',
  publishableKey: 'sb_publishable_TCW8WBV5-pazJ3PGv4o-Uw_rPzlCJvi',
  // 讀者版是否同時顯示三篇示意文（正式上線、有真實留言後可改成 false）。
  showSamples: true,
});
