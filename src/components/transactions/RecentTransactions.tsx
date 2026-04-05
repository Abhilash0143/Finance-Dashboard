import React from 'react';
import { ArrowUpRight, ArrowDownRight, Coffee, ShoppingBag, Zap, DollarSign } from 'lucide-react';
import { useFinanceStore, Transaction } from '../../store/useFinanceStore';
import { formatCurrency } from '../../utils/calculations';
import { Link } from 'react-router-dom';

export const RecentTransactions = () => {
  const transactions = useFinanceStore(state => state.transactions);
  
  const recent = React.useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  const getIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'food': return <Coffee className="w-5 h-5" />;
      case 'shopping': return <ShoppingBag className="w-5 h-5" />;
      case 'utilities': return <Zap className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  return (
    <div className="recent-transactions glass-panel flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium" style={{ color: 'var(--text-heading)' }}>Recent Transactions</h3>
        <Link to="/transactions" className="text-xs text-[#66fcf1] hover:underline">View All</Link>
      </div>
      
      {recent.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-[#8b929a] text-sm">
          No transactions yet.
        </div>
      ) : (
        <div className="transaction-list">
          {recent.map(t => (
            <div key={t.id} className="transaction-item">
              <div className="transaction-info">
                <div className="transaction-icon">
                  {getIcon(t.category)}
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-heading)' }}>{t.category}</h4>
                  <div className="transaction-date">
                    {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div className={`transaction-amount ${t.type === 'income' ? 'success-text' : 'error-text'}`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
