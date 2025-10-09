create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  instagram_access_token text,
  instagram_user_id text,
  google_access_token text,
  google_refresh_token text,
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

-- Allow users to read their own profile
create policy if not exists "Read own profile" on public.profiles
for select using (auth.uid() = id);

-- Allow users to upsert their own profile via edge functions (using service role)
-- Service role bypasses RLS, so no extra policy required for writes.


