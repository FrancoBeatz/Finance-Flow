export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum Category {
  FOOD = 'Food',
  TRANSPORT = 'Transport',
  HOUSING = 'Housing',
  UTILITIES = 'Utilities',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health',
  SHOPPING = 'Shopping',
  SALARY = 'Salary',
  INVESTMENT = 'Investment',
  OTHER = 'Other'
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string; // ISO string YYYY-MM-DD
}

export interface Budget {
  category: string;
  limit: number;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}