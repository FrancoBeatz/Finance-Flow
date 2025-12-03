import React, { useState } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { getFinancialInsights } from '../services/geminiService';
import { Transaction } from '../types';

interface InsightsProps {
  transactions: Transaction[];
}

const Insights: React.FC<InsightsProps> = ({ transactions }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    if (transactions.length === 0) {
        setInsight("Add some transactions first to get insights!");
        return;
    }
    setLoading(true);
    try {
      const result = await getFinancialInsights(transactions);
      setInsight(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-xl shadow-lg border border-indigo-700/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
      
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-300" /> AI Financial Coach
        </h3>
        <button 
            onClick={generateInsights}
            disabled={loading}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80"
        >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="text-indigo-100 text-sm leading-relaxed min-h-[80px] relative z-10">
        {loading ? (
            <div className="flex items-center gap-2 animate-pulse">
                <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                Analyzing your spending habits...
            </div>
        ) : insight ? (
            <div className="prose prose-invert prose-sm">
                <div className="whitespace-pre-line">{insight}</div>
            </div>
        ) : (
            <p className="italic text-indigo-300">Click refresh to get personalized advice based on your recent activity.</p>
        )}
      </div>
    </div>
  );
};

export default Insights;