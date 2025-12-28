
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

interface ChartProps {
  data: { time: string; value: number }[];
  color: string;
}

export const MiningChart: React.FC<ChartProps> = ({ data, color }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorHash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.6} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <filter id="glow" height="130%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                <feOffset dx="0" dy="0" result="offsetblur"/>
                <feFlood floodColor={color} floodOpacity="0.5"/>
                <feComposite in2="offsetblur" operator="in"/>
                <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="time" 
            tick={{ fill: '#64748b', fontSize: 10 }} 
            axisLine={false}
            tickLine={false}
            minTickGap={30}
          />
          <YAxis 
            tick={{ fill: '#64748b', fontSize: 10 }} 
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', color: '#f1f5f9', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
            itemStyle={{ color: '#fff' }}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fillOpacity={1}
            fill="url(#colorHash)"
            strokeWidth={3}
            animationDuration={1000}
            filter="url(#glow)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface EarningsChartProps {
  data?: { day: string; amount: number }[];
}

export const EarningsChart: React.FC<EarningsChartProps> = ({ data }) => {
  // Default Mock Data if none provided
  const chartData = data || [
    { day: 'Mon', amount: 450 },
    { day: 'Tue', amount: 520 },
    { day: 'Wed', amount: 480 },
    { day: 'Thu', amount: 610 },
    { day: 'Fri', amount: 590 },
    { day: 'Sat', amount: 750 },
    { day: 'Sun', amount: 820 },
  ];

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <defs>
             <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                <stop offset="100%" stopColor="#059669" stopOpacity={0.6}/>
             </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="day" 
            tick={{ fill: '#64748b', fontSize: 10 }} 
            axisLine={false}
            tickLine={false} 
          />
          <YAxis 
            hide 
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 4 }}
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', color: '#f1f5f9', borderRadius: '12px', fontSize: '12px' }}
            formatter={(value: number) => [
                value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), 
                'Earnings'
            ]}
          />
          <Bar dataKey="amount" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SharesPieChart: React.FC<{ accepted: number, rejected: number }> = ({ accepted, rejected }) => {
  const data = [
    { name: 'Accepted', value: accepted },
    { name: 'Rejected', value: rejected },
  ];
  const COLORS = ['#10b981', '#ef4444'];

  if (accepted === 0 && rejected === 0) {
      return (
          <div className="h-48 w-full flex items-center justify-center text-slate-500 text-xs">
              Waiting for shares...
          </div>
      );
  }

  return (
    <div className="h-48 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
            cornerRadius={4}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: `drop-shadow(0 0 8px ${COLORS[index % COLORS.length]}80)` }} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px' }}
             itemStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-[-5px]">
         <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Yield</div>
         <div className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {accepted + rejected > 0 ? ((accepted / (accepted + rejected)) * 100).toFixed(1) : 100}%
         </div>
      </div>
    </div>
  );
};
