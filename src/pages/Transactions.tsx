import React from 'react';
import { TransactionTable } from '../components/transactions/TransactionTable';

export const Transactions = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="animate-entry">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-[#8b929a] mt-1">Manage and view your transaction history</p>
      </div>
      
      <TransactionTable />
    </div>
  );
};
