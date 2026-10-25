-- 《重返·馬太鞍》讀者版置頂：在 Supabase 的 SQL Editor 整段貼上執行一次（需先執行過 schema.sql）。
-- pin_order 有值的留言會依數字由小到大排在最前面；沒有值的依上架時間排序。只有審核者能設定。

alter table public.board_posts add column if not exists pin_order integer;

-- 訪客送出的留言不能自己設定置頂
drop policy if exists "visitors submit pending posts" on public.board_posts;
create policy "visitors submit pending posts" on public.board_posts
  for insert to anon, authenticated
  with check (status = 'pending' and likes = 0 and reviewed_at is null and published_at is null and pin_order is null);

-- 讀者版多帶出置頂順序（新增欄位要放在最後）
create or replace view public.board_public as
  select id, role, prompt, name, body, photo_path, likes, published_at, pin_order
  from public.board_posts
  where status = 'approved';
grant select on public.board_public to anon, authenticated;
