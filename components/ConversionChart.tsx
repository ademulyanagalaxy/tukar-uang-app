import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendDataPoint } from '../types';

interface ConversionChartProps {
  data: TrendDataPoint[];
  from: string;
  to: string;
}

export const ConversionChart: React.FC<ConversionChartProps> = ({ data, from, to }) => {
  // State to ensure chart only renders on client after mount to establish dimensions
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Small timeout ensures the DOM layout is fully computed before Recharts measures it
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!data || data.length === 0) return null;

  return (
    <div className="w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h3 className="text-lg font-bold text-slate-800">Tren Pasar Mingguan</h3>
           <p className="text-xs text-slate-400 font-medium">Histori {from} ke {to} (7 Hari Terakhir)</p>
        </div>
        <div className="flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-xs font-bold text-emerald-600">Live</span>
        </div>
      </div>
      
      {/* 
        Explicit style height (280px) prevents "height(-1)" calculation errors 
      */}
      <div style={{ width: '100%', height: 280, minHeight: 280 }}>
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 20,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                {/* Add a subtle drop shadow filter to the line */}
                <filter id="shadow" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10b981" floodOpacity="0.3"/>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
                dy={15}
                interval="preserveStartEnd"
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                hide={true} // Cleaner look, hide Y axis numbers, focus on trend
              />
              <Tooltip 
                contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '8px 12px'
                }}
                itemStyle={{ color: '#0f766e', fontWeight: 600, fontSize: '13px' }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                formatter={(value: number) => [value.toFixed(4), 'Nilai']}
                labelStyle={{ color: '#64748b', fontSize: '11px', marginBottom: '2px' }}
              />
              <Area 
                type="monotone" 
                dataKey="rate" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRate)" 
                animationDuration={2000}
                filter="url(#shadow)"
                activeDot={{ r: 6, strokeWidth: 4, stroke: '#ecfdf5', fill: '#059669' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
             <div className="w-full h-full bg-slate-50 animate-pulse rounded-2xl flex flex-col gap-4 items-center justify-center border border-slate-100">
                <div className="w-12 h-12 rounded-full bg-slate-200/50"></div>
                <span className="text-slate-400 text-xs font-medium tracking-wide">Memuat grafik pasar...</span>
             </div>
        )}
      </div>
    </div>
  );
};