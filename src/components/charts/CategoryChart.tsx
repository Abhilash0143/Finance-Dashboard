import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinanceStore } from '../../store/useFinanceStore';

const COLORS = ['#66fcf1', '#f75590', '#4cd964', '#fbc02d', '#9c27b0', '#03a9f4'];

export const CategoryChart = () => {
  const transactions = useFinanceStore(state => state.transactions);

  const chartData = React.useMemo(() => {
    const rawData = Object.values(
      transactions.reduce((acc: Record<string, {name: string, value: number}>, t) => {
        if (t.type === "expense") {
          acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
          acc[t.category].value += t.amount;
        }
        return acc;
      }, {})
    ).sort((a, b) => b.value - a.value);

    return rawData.length > 0 ? rawData : [{ name: 'No Data', value: 1 }];
  }, [transactions]);

  const hasData = chartData.length > 0 && chartData[0].name !== 'No Data';

  return (
    <div className="chart-container glass-panel">
      <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-heading)' }}>Expenses by Category</h3>
      <div className="flex-grow w-full" style={{ height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={hasData ? COLORS[index % COLORS.length] : 'rgba(255,255,255,0.1)'} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => hasData && typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : (value)}
              contentStyle={{ 
                backgroundColor: 'rgba(31, 40, 51, 0.9)', 
                borderColor: 'rgba(102, 252, 241, 0.2)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            {hasData && (
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', color: '#8b929a' }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
