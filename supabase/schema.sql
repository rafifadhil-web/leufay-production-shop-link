-- Run this file in Supabase SQL Editor before deploying the app.
create extension if not exists pgcrypto;

create type public.product_status as enum ('draft','published','archived');
create type public.affiliate_platform as enum ('shopee','tokopedia','lazada','website');

create table public.admins (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique, created_at timestamptz not null default now()
);
create table public.categories (
  id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique,
  description text, archived boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.products (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, brand text not null,
  category_id uuid not null references public.categories(id), description text, image_url text,
  affiliate_url text not null check (affiliate_url ~* '^https?://'), affiliate_platform public.affiliate_platform not null default 'website',
  featured boolean not null default false, status public.product_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index products_public_index on public.products(status, featured desc, created_at desc);
create index products_category_index on public.products(category_id);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;
create trigger categories_updated_at before update on public.categories for each row execute procedure public.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute procedure public.set_updated_at();

-- SECURITY DEFINER avoids a recursive RLS lookup against the admins table.
-- An empty search_path prevents object-shadowing through search_path (including pg_temp).
-- The table is therefore always referenced with its schema-qualified name below.
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.admins where user_id=auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
create policy "admins can see their own admin row" on public.admins for select to authenticated using (user_id=auth.uid());
create policy "public reads active categories" on public.categories for select to anon, authenticated using (archived=false);
create policy "admins read all categories" on public.categories for select to authenticated using (public.is_admin());
create policy "admins manage categories" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads published products" on public.products for select to anon, authenticated using (status='published');
create policy "admins read all products" on public.products for select to authenticated using (public.is_admin());
create policy "admins manage products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Storage bucket and policies. Keep this bucket public only for image delivery; writes stay admin-only.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
create policy "public reads product images" on storage.objects for select using (bucket_id='product-images');
create policy "admins upload product images" on storage.objects for insert to authenticated with check (bucket_id='product-images' and public.is_admin());
create policy "admins update product images" on storage.objects for update to authenticated using (bucket_id='product-images' and public.is_admin()) with check (bucket_id='product-images' and public.is_admin());
create policy "admins delete product images" on storage.objects for delete to authenticated using (bucket_id='product-images' and public.is_admin());
