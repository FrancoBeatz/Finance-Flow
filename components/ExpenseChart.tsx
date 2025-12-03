import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction, TransactionType } from '../types';

interface ExpenseChartProps {
  transactions: Transaction[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
  const expenseData = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[])
    .sort((a, b) => b.value - a.value);

  if (expenseData.length === 0) {
    return (
        <div className="bg-card p-6 rounded-xl shadow-lg border border-slate-700 h-[400px] flex items-center justify-center text-slate-500">
            No expenses recorded yet.
        </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-slate-700 h-[400px]">
      <h3 className="text-lg font-bold text-white mb-4">Expenses by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={expenseData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {expenseData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            itemStyle={{ color: '#f8fafc' }}
            formatter={(value: number) => `$${value.toFixed(2)}`}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;