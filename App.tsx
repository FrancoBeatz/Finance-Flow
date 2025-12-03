import React, { useState, useEffect } from 'react';
import { Wallet, TrendingDown, TrendingUp, LayoutDashboard, History, Settings } from 'lucide-react';
import { Transaction, TransactionType, Category, Budget } from './types';
import SummaryCard from './components/SummaryCard';
import AddTransaction from './components/AddTransaction';
import ExpenseChart from './components/ExpenseChart';
import BudgetProgress from './components/BudgetProgress';
import Insights from './components/Insights';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions'>('dashboard');

  // Load data from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('finance_flow_transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load transactions", e);
      }
    } else {
        // Seed initial data
        setTransactions([
            { id: '1', amount: 5000, type: TransactionType.INCOME, category: Category.SALARY, description: 'Monthly Salary', date: '2023-10-01' },
            { id: '2', amount: 120, type: TransactionType.EXPENSE, category: Category.FOOD, description: 'Weekly Groceries', date: '2023-10-05' },
            { id: '3', amount: 1500, type: TransactionType.EXPENSE, category: Category.HOUSING, description: 'Rent', date: '2023-10-01' },
            { id: '4', amount: 60, type: TransactionType.EXPENSE, category: Category.TRANSPORT, description: 'Gas', date: '2023-10-10' },
        ]);
    }
  }, []);

  // Save to local storage whenever transactions change
  useEffect(() => {
    localStorage.setItem('finance_flow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
      setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Derived Statistics
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Mock Budgets (could be stateful in a full app)
  const budgets: Budget[] = [
    { category: Category.FOOD, limit: 500 },
    { category: Category.ENTERTAINMENT, limit: 200 },
    { category: Category.SHOPPING, limit: 300 },
    { category: Category.HOUSING, limit: 2000 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              FinanceFlow
            </h1>
          </div>
          <div className="text-xs text-slate-500 hidden md:block">
            Personal Finance Manager
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard 
            title="Total Balance" 
            amount={balance} 
            icon={Wallet} 
            colorClass="text-primary" 
          />
          <SummaryCard 
            title="Total Income" 
            amount={totalIncome} 
            icon={TrendingUp} 
            colorClass="text-secondary" 
          />
          <SummaryCard 
            title="Total Expenses" 
            amount={totalExpense} 
            icon={TrendingDown} 
            colorClass="text-danger" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Input and Lists */}
            <div className="lg:col-span-2 space-y-8">
                {activeTab === 'dashboard' && (
                    <>
                        <AddTransaction onAdd={addTransaction} />
                        
                        {/* Recent Transactions List (Mini) */}
                        <div className="bg-card rounded-xl shadow-lg border border-slate-700 overflow-hidden">
                            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                                <button 
                                    onClick={() => setActiveTab('transactions')}
                                    className="text-sm text-primary hover:text-indigo-400 transition-colors"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="divide-y divide-slate-700">
                                {transactions.slice(0, 5).map(tx => (
                                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${tx.type === TransactionType.INCOME ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700 text-slate-300'}`}>
                                                {tx.type === TransactionType.INCOME ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{tx.description}</p>
                                                <p className="text-xs text-slate-400">{tx.category} • {tx.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`font-bold ${tx.type === TransactionType.INCOME ? 'text-emerald-400' : 'text-slate-200'}`}>
                                                {tx.type === TransactionType.INCOME ? '+' : '-'}${tx.amount.toFixed(2)}
                                            </span>
                                            <button 
                                                onClick={() => deleteTransaction(tx.id)}
                                                className="text-slate-600 hover:text-red-400 transition-colors"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {transactions.length === 0 && (
                                    <div className="p-8 text-center text-slate-500">
                                        No transactions yet. Add one above!
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'transactions' && (
                     <div className="bg-card rounded-xl shadow-lg border border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                             <h3 className="text-lg font-bold text-white">All Transactions</h3>
                             <button onClick={() => setActiveTab('dashboard')} className="text-sm text-primary">Back to Dashboard</button>
                        </div>
                        <div className="divide-y divide-slate-700 max-h-[600px] overflow-y-auto">
                             {transactions.map(tx => (
                                 <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-800/50">
                                     <div className="flex items-center gap-4">
                                         <div className={`p-2 rounded-full ${tx.type === TransactionType.INCOME ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700 text-slate-300'}`}>
                                             {tx.type === TransactionType.INCOME ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                         </div>
                                         <div>
                                             <p className="font-medium text-white">{tx.description}</p>
                                             <p className="text-xs text-slate-400">{tx.category} • {tx.date}</p>
                                         </div>
                                     </div>
                                     <div className="flex items-center gap-4">
                                         <span className={`font-bold ${tx.type === TransactionType.INCOME ? 'text-emerald-400' : 'text-slate-200'}`}>
                                             {tx.type === TransactionType.INCOME ? '+' : '-'}${tx.amount.toFixed(2)}
                                         </span>
                                         <button 
                                             onClick={() => deleteTransaction(tx.id)}
                                             className="text-slate-600 hover:text-red-400"
                                         >
                                             Delete
                                         </button>
                                     </div>
                                 </div>
                             ))}
                        </div>
                     </div>
                )}
            </div>

            {/* Right Column: Visuals & Stats */}
            <div className="space-y-8">
                <Insights transactions={transactions} />
                <ExpenseChart transactions={transactions} />
                <BudgetProgress transactions={transactions} budgets={budgets} />
            </div>
        </div>
      </main>

      {/* Mobile Navigation (Sticky Bottom) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 flex justify-around p-4 z-50">
        <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-primary' : 'text-slate-500'}`}
        >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-xs">Dashboard</span>
        </button>
        <button 
             onClick={() => setActiveTab('transactions')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'transactions' ? 'text-primary' : 'text-slate-500'}`}
        >
            <History className="w-5 h-5" />
            <span className="text-xs">History</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500 opacity-50 cursor-not-allowed">
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default App;