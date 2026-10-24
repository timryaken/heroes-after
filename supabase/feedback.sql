-- 《與光赴會》出發後的滿意度投票＋抽獎登記：在 Supabase 專案的 SQL Editor 整段貼上執行一次（需先執行過 schema.sql）。
-- 一定要留 Email 才能投票；同一個 Email 只留一筆（重複送出會更新成最新的一票），所以一個 Email 只算一次抽獎資格。
-- 訪客只能透過 submit_site_feedback() 送出，讀不到任何人的 Email；只有 board_admins 裡的審核者看得到統計與名單。

create table if not exists public.site_feedback (
  email text primary key check (char_length(email) <= 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  satisfied boolean not null,
  role text check (role in ('volunteer', 'wanted-to-help', 'other')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_feedback enable row level security;

drop policy if exists "admins read feedback" on public.site_feedback;
create policy "admins read feedback" on public.site_feedback
  for select to authenticated using (public.is_board_admin());

drop policy if exists "admins delete feedback" on public.site_feedback;
create policy "admins delete feedback" on public.site_feedback
  for delete to authenticated using (public.is_board_admin());

create or replace function public.submit_site_feedback(p_email text, p_satisfied boolean, p_role text default null)
returns void language plpgsql security definer set search_path = public as $$
declare
  normalized text := lower(trim(p_email));
begin
  if normalized is null or char_length(normalized) > 254 or normalized !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'invalid email';
  end if;
  if p_satisfied is null then
    raise exception 'vote required';
  end if;
  insert into public.site_feedback (email, satisfied, role)
  values (normalized, p_satisfied, case when p_role in ('volunteer', 'wanted-to-help', 'other') then p_role end)
  on conflict (email) do update
    set satisfied = excluded.satisfied,
        role = coalesce(excluded.role, site_feedback.role),
        updated_at = now();
end;
$$;
revoke all on function public.submit_site_feedback(text, boolean, text) from public;
grant execute on function public.submit_site_feedback(text, boolean, text) to anon, authenticated;
