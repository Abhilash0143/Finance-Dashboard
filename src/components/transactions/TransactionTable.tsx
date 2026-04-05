import React, { useState, useRef, useEffect } from 'react';
import { useFinanceStore, Transaction } from '../../store/useFinanceStore';
import { formatCurrency } from '../../utils/calculations';
import { Trash2, Plus, Search, Filter, ChevronDown, Check, Download } from 'lucide-react';

export const TransactionTable = () => {
  const transactions = useFinanceStore(state => state.transactions);
  const role = useFinanceStore(state => state.role);
  const deleteTransaction = useFinanceStore(state => state.deleteTransaction);
  const addTransaction = useFinanceStore(state => state.addTransaction);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ... (Other state and filtering logic)

  // States for Add Modal
  const [isAdding, setIsAdding] = useState(false);
  const [newTxn, setNewTxn] = useState({
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense'
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filtered = React.useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.category.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      return matchesSearch && matchesType;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, search, typeFilter]);

  // Reset pagination if filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedData = React.useMemo(() => {
    return filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filtered, currentPage, pageSize]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxn.amount || !newTxn.category) return;

    addTransaction({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      amount: parseFloat(newTxn.amount),
      category: newTxn.category,
      type: newTxn.type
    });

    setIsAdding(false);
    setNewTxn({ amount: '', category: '', type: 'expense' });
  };

  const downloadCSV = () => {
    const headers = ['Date', 'Category', 'Amount', 'Type'];
    const rows = filtered.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.category,
      t.amount,
      t.type
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterOptions = [
    { label: 'All Types', value: 'all' },
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="glass-panel animate-entry delay-1" style={{ padding: 'var(--panel-padding-sm)', position: 'relative', zIndex: 10 }}>
        <div className="table-control-group">
          <div className="table-control-item relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8b929a]" />
            <input
              type="text"
              placeholder="Search category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pr-4 rounded-lg w-full"
              style={{ paddingLeft: '40px', paddingTop: '14px', paddingBottom: '14px' }}
            />
          </div>

          <div className="table-control-item custom-dropdown-container" ref={filterRef}>
            <button
              className="input-field rounded-lg w-full text-left flex items-center justify-between"
              style={{ padding: '14px 16px 14px 40px' }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8b929a]" />
              <span className="capitalize">{typeFilter === 'all' ? 'All Types' : typeFilter}</span>
              <ChevronDown className={`w-4 h-4 text-[#8b929a] transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <div className="custom-dropdown-menu">
                {filterOptions.map(option => (
                  <button
                    key={option.value}
                    className={`custom-dropdown-item ${typeFilter === option.value ? 'selected' : ''}`}
                    onClick={() => {
                      setTypeFilter(option.value);
                      setIsFilterOpen(false);
                    }}
                  >
                    <div className="flex-1 text-left">{option.label}</div>
                    {typeFilter === option.value && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="table-control-item" style={{ minWidth: 'min-content' }}>
            <button
              onClick={downloadCSV}
              className="secondary-btn flex items-center justify-center gap-2 p-0 px-4 transition-transform hover:scale-105"
              style={{ height: '54px', borderRadius: '12px', borderColor: 'var(--panel-border)', width: '100%' }}
              title="Download CSV"
            >
              <Download size={20} style={{ stroke: 'var(--accent-color)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-heading)' }}>CSV</span>
            </button>
          </div>

          {role === 'admin' && (
            <div className="table-control-item" style={{ flex: '2', minWidth: '180px' }}>
              <button
                onClick={() => setIsAdding(true)}
                className="primary-btn flex items-center justify-center gap-2 h-full py-0 w-full"
                style={{ height: '54px' }}
              >
                <Plus className="w-4 h-4" /> Add Transaction
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md animate-entry" style={{ padding: 'var(--panel-padding)' }}>
            <h3 className="text-xl mb-6 font-semibold" style={{ color: 'var(--text-heading)' }}>Add Transaction</h3>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-[#8b929a] mb-1">Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                    <input type="radio" checked={newTxn.type === 'expense'} onChange={() => setNewTxn({ ...newTxn, type: 'expense' })} />
                    Expense
                  </label>
                  <label className="flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                    <input type="radio" checked={newTxn.type === 'income'} onChange={() => setNewTxn({ ...newTxn, type: 'income' })} />
                    Income
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#8b929a] mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newTxn.amount}
                  onChange={(e) => setNewTxn({ ...newTxn, amount: e.target.value })}
                  className="input-field w-full px-4 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm text-[#8b929a] mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={newTxn.category}
                  onChange={(e) => setNewTxn({ ...newTxn, category: e.target.value })}
                  className="input-field w-full px-4 py-2 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="secondary-btn">Cancel</button>
                <button type="submit" className="primary-btn" style={{ width: 'auto' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table & Pagination Container */}
      <div className="glass-panel overflow-hidden animate-entry delay-2 flex flex-col gap-6" style={{ padding: 'var(--panel-padding-sm)' }}>
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="table-header-row">
                <th className="text-left text-sm font-semibold text-[#8b929a] w-[20%]" style={{ padding: '16px var(--panel-padding-sm)' }}>Date</th>
                <th className="text-left text-sm font-semibold text-[#8b929a] w-[30%]" style={{ padding: '16px var(--panel-padding-sm)' }}>Category</th>
                <th className="text-left text-sm font-semibold text-[#8b929a] w-[25%]" style={{ padding: '16px var(--panel-padding-sm)' }}>Amount</th>
                <th className="text-left text-sm font-semibold text-[#8b929a] w-[15%]" style={{ padding: '16px var(--panel-padding-sm)' }}>Type</th>
                {role === 'admin' && <th className="text-center text-sm font-semibold text-[#8b929a] w-[10%]" style={{ padding: '16px var(--panel-padding-sm)' }}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((t) => (
                <tr key={t.id} className="table-data-row transition-colors hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="text-left text-sm whitespace-nowrap" style={{ padding: '16px var(--panel-padding-sm)', color: 'var(--text-secondary)' }}>{new Date(t.date).toLocaleDateString()}</td>
                  <td className="text-left text-sm font-medium" style={{ padding: '16px var(--panel-padding-sm)', color: 'var(--text-heading)' }}>{t.category}</td>
                  <td className={`text-left transaction-amount ${t.type === 'income' ? 'success-text' : 'error-text'}`} style={{ padding: '16px var(--panel-padding-sm)' }}>
                    {t.type === 'income' ? '+' : '-'}{''}{formatCurrency(t.amount)}
                  </td>
                  <td className="text-left whitespace-nowrap" style={{ padding: '16px var(--panel-padding-sm)' }}>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.type === 'income' ? 'bg-green-500/10 text-green-400' : 'bg-pink-500/10 text-pink-400'
                      }`}>
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </span>
                  </td>
                  {role === 'admin' && (
                    <td className="text-center" style={{ padding: '16px var(--panel-padding-sm)' }}>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-2 text-[#8b929a] hover:text-[#f75590] hover:bg-[#f75590]/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filtered.length > 0 && (
          <div className="flex flex-row justify-between items-center gap-2 mt-2 pt-8" style={{ borderTop: '2px solid var(--table-row-border)' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="icon-box px-3 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors disabled:opacity-20 flex-1 sm:flex-none text-center"
            >
              <span className="sm:hidden">Prev</span>
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="text-[11px] sm:text-sm font-medium px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.05)] whitespace-nowrap shadow-inner" style={{ color: 'var(--text-heading)', border: '1px solid var(--panel-border)' }}>
              Page {currentPage} of {totalPages}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="icon-box px-3 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors disabled:opacity-20 flex-1 sm:flex-none text-center"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
