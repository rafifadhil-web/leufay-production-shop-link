-- Run after schema.sql. It is safe to run again.
insert into public.categories (name,slug,description) values
 ('Fashion','fashion','Curated fashion and streetwear'),('Collection','collection','Collectibles and limited finds'),('Merchandise','merchandise','Official merchandise'),('Accessories','accessories','Accessories and essentials'),('Parfum','parfum','Fragrance picks')
on conflict (slug) do update set name=excluded.name,description=excluded.description;

insert into public.products (name,slug,brand,category_id,description,affiliate_url,affiliate_platform,featured,status)
select p.name,p.slug,'KREMLIN',c.id,p.description,p.url,'shopee',true,'published'::public.product_status
from (values
 ('KREMLIN Boxy OS Fit','kremlin-boxy-os-fit','Oversized streetwear T-shirt','https://s.shopee.co.id/BTfsp9nA1?exp_info=tt_6ZMazV7M'),
 ('KREMLIN Xpremental – Fracture','kremlin-xpremental-fracture','Graphic streetwear T-shirt','https://s.shopee.co.id/9AOUbAskd7'),
 ('KREMLIN Xpremental – Mayday','kremlin-xpremental-mayday','Graphic streetwear T-shirt','https://s.shopee.co.id/60RSpQCXXj')
) as p(name,slug,description,url) cross join public.categories c where c.slug='fashion'
on conflict (slug) do update set name=excluded.name,description=excluded.description,affiliate_url=excluded.affiliate_url,featured=true,status='published';

-- Admin setup (do NOT put a password in SQL):
-- 1. Create a user in Supabase Dashboard > Authentication > Users (email/password).
-- 2. Run: insert into public.admins (user_id,email) values ('AUTH_USER_UUID','admin@example.com');
