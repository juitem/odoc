export enum MarketType {
  US = 'US',
  KR = 'KR'
}

export interface ResourceLink {
  name: string;
  url: string;
  description: string;
  category: 'Chart' | 'News' | 'Fundamental' | 'Official';
}

export interface StockDataPoint {
  date: string;
  price: number;
  volume: number;
}

export interface AIAnalysisResult {
  summary: string;
  bullishCase: string;
  bearishCase: string;
  keyRisks: string[];
  recommendation: 'Buy' | 'Hold' | 'Sell' | 'Neutral';
}

export interface StockSymbol {
  symbol: string;
  name: string;
  market: MarketType;
}