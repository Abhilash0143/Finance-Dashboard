import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useFinanceStore } from '../../store/useFinanceStore';

export const BalanceChart = () => {
  const transactions = useFinanceStore(state => state.transactions);
  
  const chartData = React.useMemo(() => {
    // Create cumulative balance data points
    let currentBalance = 0;
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (sorted.length === 0) {
      return [
        { name: 'Mon', balance: 0 },
        { name: 'Tue', balance: 0 },
        { name: 'Wed', balance: 0 },
        { name: 'Thu', balance: 0 },
        { name: 'Fri', balance: 0 }
      ];
    }

    return sorted.map((t) => {
      if (t.type === 'income') currentBalance += t.amount;
      else currentBalance -= t.amount;
      
      return {
        name: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        balance: currentBalance,
      };
    });
  }, [transactions]);

  return (
    <div className="chart-container glass-panel">
      <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-heading)' }}>Balance Trend</h3>
      <div className="flex-grow w-full" style={{ height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#66fcf1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#66fcf1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#8b929a', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#8b929a', fontSize: 12 }}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(31, 40, 51, 0.9)', 
                borderColor: 'rgba(102, 252, 241, 0.2)',
                borderRadius: '8px',
                color: '#fff'
              }}
              itemStyle={{ color: '#66fcf1' }}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#66fcf1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
