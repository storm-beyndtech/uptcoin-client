import { useEffect, useRef, memo } from 'react';

const Chart = ({ symbol }: { symbol: string }) => {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear previous script if it exists (prevents duplicate widgets)
    container.current.innerHTML = '';

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "BINANCE:${symbol}USDT",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "backgroundColor": "#1a1b1c",
        "style": "1",
        "locale": "en",
        "allow_symbol_change": true,
        "hide_side_toolbar": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      }`;

    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: '100%', width: '100%', minHeight: '400px' }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: '100%', width: '100%' }}
      ></div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders if symbol remains the same
export default memo(Chart);
