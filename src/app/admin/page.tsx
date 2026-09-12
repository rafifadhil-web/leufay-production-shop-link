import { requireAdmin } from '@/lib/auth';
import { AdminProtected } from '@/components/AdminProtected';
import { ClickTrendChart } from '@/components/ClickTrendChart';

export default async function Dashboard() {
  const { supabase } = await requireAdmin();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const results = await Promise.all([
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true }),

    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published'),

    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft'),

    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'archived'),

    supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('archived', false),

    supabase
      .from('clicks')
      .select('*', { count: 'exact', head: true }),

    supabase
      .from('clicks')
      .select('*', { count: 'exact', head: true })
      .gte('clicked_at', today.toISOString()),

    supabase
      .from('clicks')
      .select('product_id'),

    supabase
      .from('products')
      .select('id, name, brand'),
  ]);

  const stats = [
    ['TOTAL PRODUCTS', results[0].count],
    ['PUBLISHED', results[1].count],
    ['DRAFT', results[2].count],
    ['ARCHIVED', results[3].count],
    ['CATEGORIES', results[4].count],
  ] as const;

  const totalClicks = results[5].count ?? 0;
  const todayClicks = results[6].count ?? 0;

  const clicks = results[7].data ?? [];
  const products = results[8].data ?? [];
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
sevenDaysAgo.setHours(0, 0, 0, 0);

const trendResult = await supabase
  .from('clicks')
  .select('clicked_at')
  .gte('clicked_at', sevenDaysAgo.toISOString());

const trendClicks = trendResult.data ?? [];

const trendData = Array.from({ length: 7 }, (_, index) => {
  const date = new Date(sevenDaysAgo);
  date.setDate(sevenDaysAgo.getDate() + index);

  const dateKey = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
  }).format(date);

  const clicksForDay = trendClicks.filter((click) => {
    const clickDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
    }).format(new Date(click.clicked_at));

    return clickDate === dateKey;
  }).length;

  return {
    date: dateKey,
    label: new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: '2-digit',
      month: 'short',
    }).format(date),
    clicks: clicksForDay,
  };
});
  const clickCounts = new Map<string, number>();

  for (const click of clicks) {
    if (!click.product_id) continue;

    clickCounts.set(
      click.product_id,
      (clickCounts.get(click.product_id) ?? 0) + 1
    );
  }

  const topProducts = products
    .map((product) => ({
      ...product,
      clicks: clickCounts.get(product.id) ?? 0,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  const productsClicked = clickCounts.size;

  return (
    <AdminProtected>
      <>
        <p className="eyebrow">OVERVIEW</p>
        <h1 className="section-title">DASHBOARD</h1>

        <div className="stat-grid">
          {stats.map(([label, value]) => (
            <div className="card stat" key={label}>
              <span className="meta">{label}</span>
              <strong>{value ?? 0}</strong>
            </div>
          ))}
        </div>

        <p className="eyebrow" style={{ marginTop: 32 }}>
          ANALYTICS
        </p>

        <div className="stat-grid">
          <div className="card stat">
            <span className="meta">TOTAL CLICKS</span>
            <strong>{totalClicks}</strong>
          </div>

          <div className="card stat">
            <span className="meta">TODAY CLICKS</span>
            <strong>{todayClicks}</strong>
          </div>

          <div className="card stat">
            <span className="meta">PRODUCTS CLICKED</span>
            <strong>{productsClicked}</strong>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: 22,
            marginTop: 22,
          }}
        >
            <div
  className="card"
  style={{
    padding: 22,
    marginTop: 22,
  }}
>
  <p className="eyebrow">CLICK TREND — LAST 7 DAYS</p>

  <ClickTrendChart data={trendData} />
</div>
          <p className="eyebrow">TOP PRODUCTS</p>

          {topProducts.length === 0 ? (
            <p style={{ color: '#c5d0e5', lineHeight: 1.55 }}>
              No clicks recorded yet.
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gap: 12,
                marginTop: 14,
              }}
            >
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    padding: '12px 0',
                    borderBottom:
                      index === topProducts.length - 1
                        ? 'none'
                        : '1px solid rgba(255,255,255,.08)',
                  }}
                >
                  <div>
                    <strong>
                      {index + 1}. {product.name}
                    </strong>

                    <div
                      className="meta"
                      style={{ marginTop: 4 }}
                    >
                      {product.brand}
                    </div>
                  </div>

                  <strong>
                    {product.clicks}{' '}
                    {product.clicks === 1 ? 'CLICK' : 'CLICKS'}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="card"
          style={{
            padding: 22,
            marginTop: 22,
          }}
        >
          <p className="eyebrow">QUICK START</p>

          <p style={{ color: '#c5d0e5', lineHeight: 1.55 }}>
            Add a product, publish it, and it will appear on the public shop
            automatically.
          </p>

          <a className="button" href="/admin/products/new">
            ADD PRODUCT
          </a>
        </div>
      </>
    </AdminProtected>
  );
}