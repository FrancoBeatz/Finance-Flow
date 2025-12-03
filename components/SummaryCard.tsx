import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  colorClass: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, icon: Icon, colorClass }) => {
  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-slate-700 flex items-center justify-between hover:border-slate-600 transition-colors">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">
          ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>
      </div>
      <div className={`p-3 rounded-full bg-opacity-20 ${colorClass} bg-current`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('text-', '')}`} />
      </div>
    </div>
  );
};

export default SummaryCard;