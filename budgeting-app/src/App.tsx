import { useState } from 'react';
import { BudgetHeader } from './components/BudgetHeader';
import { BudgetOverview } from './components/BudgetOverview';
import { CategoryCard } from './components/CategoryCard';
import { IncomeSetup } from './components/IncomeSetup';
import { SettingsDialog } from './components/SettingsDialog';
import { LocaleProvider } from './contexts/LocaleContext';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface BudgetCategory {
  name: string;
  percentage: number;
  color: string;
  icon: string;
  expenses: Expense[];
}

export default function App() {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [showSettings, setShowSettings] = useState(false);
  const [categories, setCategories] = useState<BudgetCategory[]>([
    {
      name: 'Needs',
      percentage: 50,
      color: '#4CAF50',
      icon: 'needs',
      expenses: []
    },
    {
      name: 'Wants',
      percentage: 30,
      color: '#2196F3',
      icon: 'wants',
      expenses: []
    },
    {
      name: 'Savings',
      percentage: 20,
      color: '#FF9800',
      icon: 'savings',
      expenses: []
    }
  ]);

  const addExpense = (categoryName: string, expense: Expense) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.name === categoryName
          ? { ...cat, expenses: [...cat.expenses, expense] }
          : cat
      )
    );
  };

  const removeExpense = (categoryName: string, expenseId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.name === categoryName
          ? { ...cat, expenses: cat.expenses.filter(e => e.id !== expenseId) }
          : cat
      )
    );
  };

  if (monthlyIncome === 0) {
    return (
      <LocaleProvider>
        <IncomeSetup onSetIncome={setMonthlyIncome} />
      </LocaleProvider>
    );
  }

  return (
    <LocaleProvider>
      <div className="min-h-screen bg-gray-50">
        <BudgetHeader 
          income={monthlyIncome} 
          onEditIncome={() => setMonthlyIncome(0)}
          onOpenSettings={() => setShowSettings(true)}
        />
        <div className="max-w-md mx-auto px-4 pb-6">
          <BudgetOverview income={monthlyIncome} categories={categories} />
          <div className="space-y-4 mt-6">
            {categories.map(category => (
              <CategoryCard
                key={category.name}
                category={category}
                budget={(monthlyIncome * category.percentage) / 100}
                onAddExpense={(expense) => addExpense(category.name, expense)}
                onRemoveExpense={(expenseId) => removeExpense(category.name, expenseId)}
              />
            ))}
          </div>
        </div>
        <SettingsDialog
          open={showSettings}
          onOpenChange={setShowSettings}
          onEditIncome={() => setMonthlyIncome(0)}
        />
      </div>
    </LocaleProvider>
  );
}