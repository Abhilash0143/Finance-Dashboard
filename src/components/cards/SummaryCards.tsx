import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, X, Send } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { calculateSummary, formatCurrency } from '../../utils/calculations';
import { toast } from 'sonner';

const NumberTicker = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = React.useState(0);
  const previousValue = React.useRef(0);

  React.useEffect(() => {
    const start = previousValue.current;
    const end = value;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out expo
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * easeOutExpo;
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousValue.current = end;
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <>{formatCurrency(displayValue)}</>;
};

export const SummaryCards = () => {
  const transactions = useFinanceStore(state => state.transactions);
  const role = useFinanceStore(state => state.role);
  const addTransaction = useFinanceStore(state => state.addTransaction);

  const { balance, income, expenses } = React.useMemo(() => {
    return calculateSummary(transactions);
  }, [transactions]);
  
  const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'income' | 'expense' }>({
    isOpen: false,
    type: 'income'
  });
  const [amount, setAmount] = useState('');

  const isPositive = balance >= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    
    if (isNaN(val) || val <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Check for insufficient balance when sending money
    if (modalState.type === 'expense' && val > balance) {
      toast.error('Insufficient balance to complete this transaction!', {
        description: `Current balance: ${formatCurrency(balance)}`
      });
      return;
    }

    addTransaction({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      amount: val,
      category: modalState.type === 'income' ? 'Deposit' : 'Transfer',
      type: modalState.type
    });

    toast.success(modalState.type === 'income' ? 'Money added successfully!' : 'Money sent successfully!');
    setModalState({ ...modalState, isOpen: false });
    setAmount('');
  };

  return (
    <section className="overview-section animate-entry delay-1">
      <div className="main-card glass-panel flex flex-col justify-between">
        <div>
          <h3>Total Balance</h3>
          <div className="balance-amount font-bold tracking-tight" style={{ color: 'var(--text-heading)' }}>
            <NumberTicker value={balance} />
          </div>
          <div className="balance-change">
            <span className={isPositive ? 'success-text' : 'error-text'}>
              {isPositive ? '+' : ''}<NumberTicker value={balance} /> This Month
            </span>
          </div>
        </div>
        
        <div className="action-buttons">
          {role === 'admin' && (
            <>
              <button 
                className="primary-btn flex items-center gap-2"
                onClick={() => setModalState({ isOpen: true, type: 'income' })}
              >
                <Wallet className="w-4 h-4" /> Add Money
              </button>
              <button 
                className="send-btn flex items-center gap-2"
                onClick={() => setModalState({ isOpen: true, type: 'expense' })}
              >
                <Send className="w-4 h-4" /> Send Money
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-header flex justify-between items-center">
            <h4>Total Income</h4>
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div className="stat-amount font-bold" style={{ color: 'var(--text-heading)' }}>
            <NumberTicker value={income} />
          </div>
          <div className="stat-change success-text">
            +14% from last month
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-header flex justify-between items-center">
            <h4>Total Expenses</h4>
            <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4 text-pink-500" />
            </div>
          </div>
          <div className="stat-amount font-bold" style={{ color: 'var(--text-heading)' }}>
            <NumberTicker value={expenses} />
          </div>
          <div className="stat-change error-text">
            -5% from last month
          </div>
        </div>
      </div>

      {/* Quick Action Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1100] p-4">
          <div className="glass-panel w-full max-w-sm animate-entry border-[var(--accent-color)]/30" style={{ padding: 'var(--panel-padding)' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {modalState.type === 'income' ? 'Add Money' : 'Send Money'}
              </h3>
              <button 
                onClick={() => setModalState({ ...modalState, isOpen: false })}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm text-[#8b929a] mb-2">Enter Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold opacity-50">₹</span>
                  <input
                    autoFocus
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-field w-full pl-10 pr-4 py-4 rounded-xl text-3xl font-bold tracking-tight text-center"
                    style={{ backgroundColor: 'var(--input-bg)' }}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  type="submit" 
                  className={modalState.type === 'income' ? 'primary-btn py-4' : 'error-btn py-4'}
                >
                  Confirm {modalState.type === 'income' ? 'Deposit' : 'Transfer'}
                </button>
                <p className="text-xs text-center text-[#8B929A]">
                   {modalState.type === 'income' 
                     ? 'Funds will be immediately added to your total balance.' 
                     : 'Money will be deducted and categorized as a Transfer.'}
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
