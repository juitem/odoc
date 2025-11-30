import { MarketType, ResourceLink, StockDataPoint } from './types';

export const US_RESOURCES: ResourceLink[] = [
  { name: 'Finviz', url: 'https://finviz.com/', description: 'Stock screener and market visualization', category: 'Chart' },
  { name: 'TradingView', url: 'https://www.tradingview.com/', description: 'Advanced charting software', category: 'Chart' },
  { name: 'SEC EDGAR', url: 'https://www.sec.gov/edgar/searchedgar/companysearch', description: 'Official company filings', category: 'Official' },
  { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/', description: 'Market news and data', category: 'News' },
  { name: 'MacroTrends', url: 'https://www.macrotrends.net/', description: 'Long-term historical data', category: 'Fundamental' },
  { name: 'FRED', url: 'https://fred.stlouisfed.org/', description: 'Federal Reserve Economic Data (Macro)', category: 'Fundamental' },
  { name: 'Seeking Alpha', url: 'https://seekingalpha.com/', description: 'Crowdsourced equity research & transcripts', category: 'News' },
];

export const KR_RESOURCES: ResourceLink[] = [
  { name: 'Naver Finance', url: 'https://finance.naver.com/', description: 'Comprehensive Korean market data', category: 'News' },
  { name: 'DART', url: 'https://dart.fss.or.kr/', description: 'Data Analysis, Retrieval and Transfer System', category: 'Official' },
  { name: 'KRX Information', url: 'http://data.krx.co.kr/', description: 'Korea Exchange official data', category: 'Official' },
  { name: 'Hankyung Consensus', url: 'http://consensus.hankyung.com/', description: 'Analyst reports and consensus', category: 'Fundamental' },
  { name: 'AlphaSquare', url: 'https://alphasquare.co.kr/', description: 'Real-time charting for KR stocks', category: 'Chart' },
  { name: 'Seibro', url: 'https://seibro.or.kr/', description: 'Korea Securities Depository Portal', category: 'Official' },
  { name: '38 Communication', url: 'http://www.38.co.kr/', description: 'IPO and unlisted stock market news', category: 'News' },
];

export const NAV_ITEMS = [
  { label: 'Overview', path: '/' },
  { label: 'US Market', path: '/us' },
  { label: 'KR Market', path: '/kr' },
  { label: 'Pro Chart', path: '/pro-chart' },
];

// Mock data generator with Envelopes and MA
export const generateMockData = (days: number, startPrice: number): StockDataPoint[] => {
  const data: StockDataPoint[] = [];
  let price = startPrice;
  const now = new Date();
  
  // History buffer for MA calculation
  const history: number[] = [];
  for(let i=0; i<20; i++) history.push(startPrice);

  for (let i = days; i > 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random walk with trend
    const volatility = startPrice * 0.03;
    const change = (Math.random() - 0.5) * volatility;
    price += change;
    
    // Keep history for MA
    history.push(price);
    if(history.length > 20) history.shift();

    // Calculate MA20
    const ma20 = history.reduce((a, b) => a + b, 0) / history.length;
    
    // Calculate Envelope (Bollinger Band style: MA20 +/- 2 std dev sim)
    // Simplified envelope: MA +/- 5%
    const upperBand = ma20 * 1.05;
    const lowerBand = ma20 * 0.95;

    data.push({
      date: date.toISOString().split('T')[0],
      price: Number(price.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 500000,
      ma20: Number(ma20.toFixed(2)),
      upperBand: Number(upperBand.toFixed(2)),
      lowerBand: Number(lowerBand.toFixed(2))
    });
  }
  return data;
};