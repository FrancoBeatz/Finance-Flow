import React from 'react';
import { Transaction, TransactionType } from '../types';

interface BudgetProgressProps {
  transactions: Transaction[];
  budgets: { category: string; limit: number }[];
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ transactions, budgets }) => {
  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-slate-700">
      <h3 className="text-lg font-bold text-white mb-4">Budget Monitor</h3>
      <div className="space-y-6">
        {budgets.map((budget) => {
          const spent = transactions
            .filter((t) => t.type === TransactionType.EXPENSE && t.category === budget.category)
            .reduce((sum, t) => sum + t.amount, 0);
          
          const percentage = Math.min((spent / budget.limit) * 100, 100);
          const isOverBudget = spent > budget.limit;
          
          let barColor = 'bg-emerald-500';
          if (percentage > 70) barColor = 'bg-yellow-500';
          if (percentage > 90 || isOverBudget) barColor = 'bg-red-500';

          return (
            <div key={budget.category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300 font-medium">{budget.category}</span>
                <span className={`${isOverBudget ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                  ${spent.toFixed(0)} / ${budget.limit}
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
              </div>
              {isOverBudget && (
                <p className="text-xs text-red-400 mt-1">⚠️ Budget exceeded!</p>
              )}
            </div>
          );
        })}
        {budgets.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-4">No budgets set. Add some in settings.</p>
        )}
      </div>
    </div>
  );
};

export default BudgetProgress;