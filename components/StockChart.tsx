import React from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StockDataPoint } from '../types';

interface StockChartProps {
  data: StockDataPoint[];
  symbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, symbol }) => {
  const isPositive = data.length > 1 && data[data.length - 1].price >= data[0].price;
  const strokeColor = isPositive ? '#10b981' : '#ef4444'; // Green or Red
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';

  return (
    <div className="w-full h-[500px] bg-slate-900 rounded-xl border border-slate-700 p-4 shadow-lg flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-100">{symbol} Technical Analysis</h3>
        <div className="flex gap-2">
            <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400 border border-slate-700">Envelope (20, 5%)</span>
            <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400 border border-slate-700">MA 20</span>
        </div>
      </div>
      <div className="flex-grow w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              tick={{fill: '#94a3b8', fontSize: 10}} 
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              stroke="#94a3b8" 
              tick={{fill: '#94a3b8', fontSize: 11}} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              width={50}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
              itemStyle={{ fontSize: '12px' }}
              labelStyle={{ color: '#cbd5e1', marginBottom: '0.5rem' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`]}
            />
            <Legend verticalAlign="top" height={36} iconType="plainline" wrapperStyle={{ fontSize: '12px' }} />
            
            {/* Envelope Upper Band */}
            <Line 
              type="monotone" 
              dataKey="upperBand" 
              stroke="#93c5fd" 
              strokeWidth={1} 
              dot={false} 
              strokeDasharray="5 5"
              name="Upper Envelope"
            />
            
            {/* Envelope Lower Band */}
            <Line 
              type="monotone" 
              dataKey="lowerBand" 
              stroke="#93c5fd" 
              strokeWidth={1} 
              dot={false} 
              strokeDasharray="5 5"
              name="Lower Envelope"
            />

            {/* Moving Average */}
            <Line 
              type="monotone" 
              dataKey="ma20" 
              stroke="#f59e0b" 
              strokeWidth={1.5} 
              dot={false} 
              name="MA (20)"
            />

            {/* Price Area */}
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={strokeColor} 
              fill="url(#colorPrice)" 
              strokeWidth={2}
              name="Price"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;