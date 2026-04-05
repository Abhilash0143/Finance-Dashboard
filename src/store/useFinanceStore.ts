import { create } from "zustand"

export interface Transaction {
  id: string | number;
  date: string;
  amount: number;
  category: string;
  type: "income" | "expense";
}

interface FinanceStore {
  transactions: Transaction[];
  role: string;
  theme: string;
  setRole: (role: string) => void;
  toggleTheme: () => void;
  addTransaction: (txn: Transaction) => void;
  deleteTransaction: (id: string | number) => void;
}

const getInitialTransactions = (): Transaction[] => {
  const data = localStorage.getItem("transactions")
  return data ? JSON.parse(data) : []
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  transactions: getInitialTransactions(),
  role: "admin",
  theme: localStorage.getItem("theme") || "dark",

  setRole: (role) => set({ role }),

  toggleTheme: () => {
    const newTheme = get().theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    set({ theme: newTheme });
  },

  addTransaction: (txn) => {
    const updated = [...get().transactions, txn]
    localStorage.setItem("transactions", JSON.stringify(updated))
    set({ transactions: updated })
  },

  deleteTransaction: (id) => {
    const updated = get().transactions.filter(t => t.id !== id)
    localStorage.setItem("transactions", JSON.stringify(updated))
    set({ transactions: updated })
  }
}))
