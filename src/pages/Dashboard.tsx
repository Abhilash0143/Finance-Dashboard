import React from 'react';
import { TrendingUp, Calendar, ShieldCheck } from 'lucide-react';
import { SummaryCards } from '../components/cards/SummaryCards';
import { BalanceChart } from '../components/charts/BalanceChart';
import { CategoryChart } from '../components/charts/CategoryChart';
import { RecentTransactions } from '../components/transactions/RecentTransactions';
import { useFinanceStore } from '../store/useFinanceStore';

export const Dashboard = () => {
  const transactions = useFinanceStore(state => state.transactions);

  const highestSpending = React.useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    if (expenses.length === 0) return 'N/A';
    return [...expenses].sort((a, b) => b.amount - a.amount)[0].category;
  }, [transactions]);

  return (
    <>
      <SummaryCards />
      
      <section className="bottom-section">
        <div className="animate-entry delay-2 flex-1">
          <BalanceChart />
        </div>
        <div className="animate-entry delay-3 flex-1">
          <CategoryChart />
        </div>
        <div className="animate-entry delay-4 flex-1">
          <RecentTransactions />
        </div>
      </section>
      
      {/* Insights Section */}
      <section className="glass-panel animate-entry delay-5 flex flex-col mt-8" style={{ padding: 'var(--panel-padding-sm)' }}>
        <h3 className="text-lg font-medium mb-6">Financial Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 w-full" style={{ gap: 'var(--panel-padding-sm)' }}>
          <div className="rounded-xl border flex flex-col justify-center transition-transform hover:-translate-y-1" style={{ padding: 'var(--panel-padding-sm)', backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-[rgba(247,85,144,0.1)]">
                <TrendingUp className="w-4 h-4 text-[#f75590]" />
              </div>
              <h4 className="text-[#8b929a] text-sm font-medium">Highest Spending</h4>
            </div>
            <p className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
              {highestSpending}
            </p>
          </div>
          
          <div className="rounded-xl border flex flex-col justify-center transition-transform hover:-translate-y-1" style={{ padding: 'var(--panel-padding-sm)', backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-[rgba(102,252,241,0.1)]">
                <Calendar className="w-4 h-4 text-[var(--accent-color)]" />
              </div>
              <h4 className="text-[#8b929a] text-sm font-medium">Monthly Observation</h4>
            </div>
            <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-heading)' }}>
              Your expenses are primarily concentrated in the middle of the month.
            </p>
          </div>
          
          <div className="rounded-xl border flex flex-col justify-center transition-transform hover:-translate-y-1" style={{ padding: 'var(--panel-padding-sm)', backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-[rgba(76,217,100,0.1)]">
                <ShieldCheck className="w-4 h-4 text-[#4cd964]" />
              </div>
              <h4 className="text-[#8b929a] text-sm font-medium">Budget Status</h4>
            </div>
            <p className="text-sm font-bold text-[#4cd964] leading-relaxed">
              You are currently under budget for this month. Keep it up!
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
