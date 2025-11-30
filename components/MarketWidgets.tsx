import React, { useEffect, useRef } from 'react';

interface HeatmapProps {
  market: 'US' | 'KR';
}

export const StockHeatmap: React.FC<HeatmapProps> = ({ market }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    
    // Clear previous script
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "exchanges": [],
      "dataSource": market === 'US' ? "SPX500" : "KOSPI", // US: S&P500, KR: KOSPI
      "grouping": "sector",
      "blockSize": "market_cap_basic",
      "blockColor": "change",
      "locale": "en",
      "symbolUrl": "",
      "colorTheme": "dark",
      "hasTopBar": false,
      "isDataSetEnabled": false,
      "isZoomEnabled": true,
      "hasSymbolTooltip": true,
      "width": "100%",
      "height": "100%"
    });

    container.current.appendChild(script);
  }, [market]);

  return (
    <div className="w-full h-[600px] bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      <div className="h-full w-full" ref={container}></div>
    </div>
  );
};

export const ProChartWidget: React.FC = () => {
    const container = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      if (!container.current) return;
      container.current.innerHTML = '';
  
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": "NASDAQ:AAPL",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      });
  
      container.current.appendChild(script);
    }, []);
  
    return (
      <div className="w-full h-full bg-slate-950" ref={container}></div>
    );
  };