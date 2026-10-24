-- 《與光赴會》留言板後台：在 Supabase 專案的 SQL Editor 整段貼上執行一次。
-- 訪客只能「送出待審留言」「上傳待審照片」「讀已上架留言」「按讚」；審核只開放給 board_admins 裡的 Email。

-- 留言
create table if not exists public.board_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  role text not null check (role in ('volunteer', 'wanted-to-help', 'other')),
  prompt text not null check (char_length(prompt) <= 120),
  name text check (char_length(name) <= 20),
  body text not null check (char_length(body) between 1 and 500),
  photo_path text check (photo_path ~ '^[0-9a-f-]{36}\.jpg$'),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  likes integer not null default 0 check (likes >= 0),
  reviewed_at timestamptz,
  published_at timestamptz
);
alter table public.board_posts enable row level security;

-- 審核者名單（只能從 Supabase 後台或 SQL Editor 新增）
create table if not exists public.board_admins (email text primary key);
alter table public.board_admins enable row level security;

create or replace function public.is_board_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.board_admins where email = auth.jwt() ->> 'email');
$$;

-- 訪客送出：只能是待審、讚數 0
drop policy if exists "visitors submit pending posts" on public.board_posts;
create policy "visitors submit pending posts" on public.board_posts
  for insert to anon, authenticated
  with check (status = 'pending' and likes = 0 and reviewed_at is null and published_at is null);

drop policy if exists "admins read posts" on public.board_posts;
create policy "admins read posts" on public.board_posts
  for select to authenticated using (public.is_board_admin());

drop policy if exists "admins review posts" on public.board_posts;
create policy "admins review posts" on public.board_posts
  for update to authenticated using (public.is_board_admin()) with check (public.is_board_admin());

drop policy if exists "admins delete posts" on public.board_posts;
create policy "admins delete posts" on public.board_posts
  for delete to authenticated using (public.is_board_admin());

-- 審核狀態改變時自動記錄時間
create or replace function public.board_posts_review_times()
returns trigger language plpgsql as $$
begin
  if new.status is distinct from old.status then
    new.reviewed_at := now();
    if new.status = 'approved' then
      new.published_at := coalesce(old.published_at, now());
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists board_posts_review_times on public.board_posts;
create trigger board_posts_review_times before update on public.board_posts
  for each row execute function public.board_posts_review_times();

-- 讀者版只看得到已上架留言的公開欄位
create or replace view public.board_public as
  select id, role, prompt, name, body, photo_path, likes, published_at
  from public.board_posts
  where status = 'approved';
grant select on public.board_public to anon, authenticated;

-- 按讚：只能替已上架的留言加一
create or replace function public.like_board_post(post_id uuid)
returns integer language sql security definer set search_path = public as $$
  update public.board_posts set likes = likes + 1
  where id = post_id and status = 'approved'
  returning likes;
$$;
revoke all on function public.like_board_post(uuid) from public;
grant execute on function public.like_board_post(uuid) to anon, authenticated;

-- 照片：待審照片放私人空間；審核通過後由審核頁複製到公開空間
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('board-uploads', 'board-uploads', false, 3145728, array['image/jpeg']),
  ('board-public', 'board-public', true, 3145728, array['image/jpeg'])
on conflict (id) do nothing;

drop policy if exists "visitors upload pending photos" on storage.objects;
create policy "visitors upload pending photos" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'board-uploads' and name ~ '^[0-9a-f-]{36}\.jpg$');

drop policy if exists "admins read board photos" on storage.objects;
create policy "admins read board photos" on storage.objects
  for select to authenticated
  using (bucket_id in ('board-uploads', 'board-public') and public.is_board_admin());

drop policy if exists "admins publish board photos" on storage.objects;
create policy "admins publish board photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'board-public' and public.is_board_admin());

drop policy if exists "admins remove board photos" on storage.objects;
create policy "admins remove board photos" on storage.objects
  for delete to authenticated
  using (bucket_id in ('board-uploads', 'board-public') and public.is_board_admin());

-- 最後一步：把下面的 Email 換成審核者自己的 Email，再執行這一行。
-- insert into public.board_admins (email) values ('審核者的 Email') on conflict do nothing;
