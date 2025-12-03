import React, { useState } from 'react';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import { parseTransactionFromText } from '../services/geminiService';
import { Transaction, TransactionType, Category } from '../types';

interface AddTransactionProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onAdd }) => {
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [loading, setLoading] = useState(false);
  
  // AI State
  const [aiInput, setAiInput] = useState('');

  // Manual State
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(Category.FOOD);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    setLoading(true);
    try {
      const result = await parseTransactionFromText(aiInput);
      if (result) {
        onAdd({
            amount: result.amount,
            type: result.type as TransactionType,
            category: result.category,
            description: result.description,
            date: result.date
        });
        setAiInput('');
      } else {
        alert("Could not understand that transaction. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to AI service.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAdd({
      amount: parseFloat(amount),
      type,
      category,
      description,
      date
    });

    // Reset form
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" /> Add Transaction
        </h2>
        <div className="flex bg-slate-900 rounded-lg p-1">
            <button 
                onClick={() => setMode('manual')}
                className={`px-3 py-1 text-sm rounded-md transition-all ${mode === 'manual' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
            >
                Manual
            </button>
            <button 
                onClick={() => setMode('ai')}
                className={`px-3 py-1 text-sm rounded-md transition-all flex items-center gap-1 ${mode === 'ai' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                <Sparkles className="w-3 h-3" /> AI
            </button>
        </div>
      </div>

      {mode === 'ai' ? (
        <form onSubmit={handleAiSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Describe your transaction naturally
            </label>
            <textarea
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="e.g., Spent $25 on burgers at Shake Shack today"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !aiInput.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Process with AI
          </button>
          <p className="text-xs text-slate-500 text-center">
            Powered by Gemini. Can automatically detect category, amount, date, and type.
          </p>
        </form>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-slate-400 mb-1">Type</label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setType(TransactionType.EXPENSE)}
                            className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${type === TransactionType.EXPENSE ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setType(TransactionType.INCOME)}
                            className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${type === TransactionType.INCOME ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                        >
                            Income
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-slate-400 mb-1">Amount ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="0.00"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-slate-400 mb-1">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="e.g. Salary, Rent"
                        required
                    />
                </div>
                 <div>
                    <label className="block text-xs text-slate-400 mb-1">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs text-slate-400 mb-1">Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                >
                    {Object.values(Category).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                className="w-full bg-primary hover:bg-indigo-600 text-white font-medium py-2 rounded-lg transition-colors"
            >
                Add Transaction
            </button>
        </form>
      )}
    </div>
  );
};

export default AddTransaction;