import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types';
const select = 'id,name,slug,brand,description,image_url,affiliate_url,affiliate_platform,featured,status,created_at,category_id,category:categories(id,name,slug,description)';
export async function getPublishedProducts() { const s = await createClient(); const { data } = await s.from('products').select(select).eq('status','published').order('featured',{ascending:false}).order('created_at',{ascending:false}); return (data ?? []) as unknown as Product[]; }
export async function getPublishedProduct(slug: string) { const s = await createClient(); const { data } = await s.from('products').select(select).eq('status','published').eq('slug',slug).maybeSingle(); return data as unknown as Product | null; }
export async function getCategories() { const s = await createClient(); const { data } = await s.from('categories').select('id,name,slug,description').eq('archived',false).order('name'); return data ?? []; }
