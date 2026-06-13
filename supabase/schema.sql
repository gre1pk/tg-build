-- Run in Supabase SQL Editor (Dashboard → SQL → New query)
-- Then: node scripts/seed-supabase.mjs  (with SUPABASE_* in .env)

-- Fabrics catalog
create table if not exists public.fabrics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  material text not null,
  color text not null,
  price_per_meter integer not null check (price_per_meter >= 0),
  image_url text not null,
  description text,
  pet_friendly boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Portfolio before/after
create table if not exists public.portfolio (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  fabric_name text,
  image_before_url text not null,
  image_after_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fabrics_sort_order_idx on public.fabrics (sort_order, name);
create index if not exists portfolio_sort_order_idx on public.portfolio (sort_order, title);

-- Public read (writes go through Vercel API with service role)
alter table public.fabrics enable row level security;
alter table public.portfolio enable row level security;

drop policy if exists "fabrics_public_read" on public.fabrics;
create policy "fabrics_public_read"
  on public.fabrics for select
  using (true);

drop policy if exists "portfolio_public_read" on public.portfolio;
create policy "portfolio_public_read"
  on public.portfolio for select
  using (true);

-- Storage buckets
insert into storage.buckets (id, name, public)
values
  ('fabric-images', 'fabric-images', true),
  ('portfolio-images', 'portfolio-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "fabric_images_public_read" on storage.objects;
create policy "fabric_images_public_read"
  on storage.objects for select
  using (bucket_id = 'fabric-images');

drop policy if exists "portfolio_images_public_read" on storage.objects;
create policy "portfolio_images_public_read"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists fabrics_updated_at on public.fabrics;
create trigger fabrics_updated_at
  before update on public.fabrics
  for each row execute function public.set_updated_at();

drop trigger if exists portfolio_updated_at on public.portfolio;
create trigger portfolio_updated_at
  before update on public.portfolio
  for each row execute function public.set_updated_at();

-- Client orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  telegram_id bigint not null,
  user_first_name text not null,
  user_username text,
  comment text,
  fabric_id uuid references public.fabrics(id) on delete set null,
  fabric_snapshot text,
  photo_url text,
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'done', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status, created_at desc);

alter table public.orders enable row level security;

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('order-images', 'order-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "order_images_public_read" on storage.objects;
create policy "order_images_public_read"
  on storage.objects for select
  using (bucket_id = 'order-images');
