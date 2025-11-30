import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS, US_RESOURCES, KR_RESOURCES, generateMockData } from './constants';
import { analyzeStock, getMarketOverview } from './services/geminiService';
import { MarketType, StockDataPoint, AIAnalysisResult } from './types';
import StockChart from './components/StockChart';
import AnalysisPanel from './components/AnalysisPanel';
import ResourceList from './components/ResourceList';
import { StockHeatmap, ProChartWidget } from './components/MarketWidgets';
import { Search, LayoutDashboard, Globe, LineChart, Cpu, CandlestickChart } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <LineChart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                odoc financial
                </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex gap-1">
            {NAV_ITEMS.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Odoc Financial. Powered by Gemini AI.</p>
          <p className="mt-2 text-xs">Market data is simulated for demonstration purposes. AI Analysis is generated in real-time.</p>
          <div className="mt-4 flex justify-center gap-4">
             <a href="https://github.com/juitem/odoc" className="hover:text-white transition-colors">GitHub Repository</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const MarketPage: React.FC<{ market: MarketType }> = ({ market }) => {
  const [symbol, setSymbol] = useState(market === MarketType.US ? 'AAPL' : '005930');
  const [inputSymbol, setInputSymbol] = useState(symbol);
  const [chartData, setChartData] = useState<StockDataPoint[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [marketSentiment, setMarketSentiment] = useState("");

  useEffect(() => {
    // Generate initial dummy data
    setChartData(generateMockData(90, market === MarketType.US ? 150 : 70000));
    
    // Get market overview
    getMarketOverview(market === MarketType.US ? 'US' : 'Korean').then(setMarketSentiment);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSymbol) return;
    setSymbol(inputSymbol);
    
    setLoading(true);
    setAnalysis(null);
    
    // Simulate data fetch based on symbol seed
    const seed = inputSymbol.length * 10;
    setChartData(generateMockData(90, market === MarketType.US ? 100 + seed : 50000 + seed * 100));

    try {
      const result = await analyzeStock(inputSymbol, market);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze stock. Please check your API key or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Section: Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{market === MarketType.US ? 'US Market' : 'Korea Market'}</h1>
          <p className="text-slate-400 max-w-2xl text-sm">{marketSentiment || "Loading market sentiment..."}</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              value={inputSymbol}
              onChange={(e) => setInputSymbol(e.target.value.toUpperCase())}
              placeholder={market === MarketType.US ? "Ticker (e.g. NVDA)" : "Code (e.g. 005930)"}
              className="bg-slate-900 border border-slate-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Cpu className="w-4 h-4 animate-spin" /> : 'Analyze'}
          </button>
        </form>
      </div>

      {/* Middle Section: Chart & Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <StockChart data={chartData} symbol={symbol} />
            <div className="hidden lg:block">
              <div className="h-[400px]">
                 <AnalysisPanel analysis={analysis} isLoading={loading} symbol={symbol} />
              </div>
            </div>
        </div>
        <div className="space-y-6">
            <ResourceList 
              resources={market === MarketType.US ? US_RESOURCES : KR_RESOURCES} 
              title="Pro Resources" 
            />
            <div className="lg:hidden">
                 <AnalysisPanel analysis={analysis} isLoading={loading} symbol={symbol} />
            </div>
        </div>
      </div>

      {/* Bottom Section: Heatmap */}
      <div className="pt-8 border-t border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-purple-400" />
            Market Heatmap ({market === MarketType.US ? 'S&P 500' : 'KRX'})
        </h2>
        <StockHeatmap market={market === MarketType.US ? 'US' : 'KR'} />
      </div>
    </div>
  );
};

const ProChartPage = () => {
    return (
        <div className="h-[calc(100vh-10rem)] w-full flex flex-col">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <CandlestickChart className="w-6 h-6 text-emerald-400" />
                    Professional Charting Platform
                </h1>
                <p className="text-slate-400 text-sm">Advanced technical analysis with TradingView engine.</p>
            </div>
            <div className="flex-grow rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
                <ProChartWidget />
            </div>
        </div>
    );
};

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg blur opacity-25"></div>
        <div className="relative bg-slate-900 p-4 rounded-full border border-slate-800">
           <LayoutDashboard className="w-12 h-12 text-blue-400" />
        </div>
      </div>
      
      <div className="max-w-2xl">
        <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight">
          Professional Grade <br />
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Market Intelligence
          </span>
        </h1>
        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
          Odoc combines institutional-grade resource aggregation with next-generation Gemini AI analysis for both US and Korean stock markets.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/us" className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 px-8 py-4 rounded-xl flex items-center gap-3 transition-all">
            <Globe className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="block text-xs text-slate-500 uppercase tracking-wider">Market</span>
              <span className="block text-lg font-bold text-white">United States</span>
            </div>
          </Link>
          <Link to="/kr" className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 px-8 py-4 rounded-xl flex items-center gap-3 transition-all">
            <Globe className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="block text-xs text-slate-500 uppercase tracking-wider">Market</span>
              <span className="block text-lg font-bold text-white">South Korea</span>
            </div>
          </Link>
          <Link to="/pro-chart" className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 px-8 py-4 rounded-xl flex items-center gap-3 transition-all">
            <CandlestickChart className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="block text-xs text-slate-500 uppercase tracking-wider">Tool</span>
              <span className="block text-lg font-bold text-white">Pro Chart</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl text-left">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <LineChart className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Technical Analysis</h3>
          <p className="text-slate-400 text-sm">Interactive charts with Envelope indicators (20, 5%) and Moving Averages.</p>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <Cpu className="w-8 h-8 text-purple-500 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">AI Insights</h3>
          <p className="text-slate-400 text-sm">Powered by Gemini 2.5 Flash for instant summarization of bullish and bearish theses.</p>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <LayoutDashboard className="w-8 h-8 text-emerald-500 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Market Heatmaps</h3>
          <p className="text-slate-400 text-sm">Real-time visualization of market sectors and price movements for US & KR.</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/us" element={<MarketPage market={MarketType.US} />} />
          <Route path="/kr" element={<MarketPage market={MarketType.KR} />} />
          <Route path="/pro-chart" element={<ProChartPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;