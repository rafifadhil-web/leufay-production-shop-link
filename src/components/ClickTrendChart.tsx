'use client';

type ClickTrendChartProps = {
  data: {
    date: string;
    label: string;
    clicks: number;
  }[];
};

export function ClickTrendChart({ data }: ClickTrendChartProps) {
  const maxClicks = Math.max(...data.map((item) => item.clicks), 1);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 12,
        alignItems: 'end',
        height: 220,
        marginTop: 20,
      }}
    >
      {data.map((item) => {
        const height =
          item.clicks === 0
            ? 4
            : Math.max((item.clicks / maxClicks) * 170, 12);

        return (
          <div
            key={item.date}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              height: '100%',
              gap: 8,
            }}
          >
            <strong style={{ fontSize: 13 }}>
              {item.clicks}
            </strong>

            <div
              title={`${item.clicks} click`}
              style={{
                width: '100%',
                maxWidth: 48,
                height,
                borderRadius: '8px 8px 3px 3px',
                background:
                  'linear-gradient(180deg, #ff8a00 0%, #ff5c00 100%)',
                boxShadow: '0 0 18px rgba(255, 106, 0, 0.25)',
                transition: 'height 0.3s ease',
              }}
            />

            <span
              className="meta"
              style={{
                fontSize: 11,
                textAlign: 'center',
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}