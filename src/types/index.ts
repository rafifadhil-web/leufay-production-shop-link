export type ProductStatus = 'draft' | 'published' | 'archived';
export type AffiliatePlatform = 'shopee' | 'tokopedia' | 'lazada' | 'website';
export interface Category { id: string; name: string; slug: string; description: string | null; }
export interface Product { id: string; name: string; slug: string; brand: string; description: string | null; image_url: string | null; affiliate_url: string; affiliate_platform: AffiliatePlatform; featured: boolean; status: ProductStatus; created_at: string; category: Category | null; category_id?: string; }
