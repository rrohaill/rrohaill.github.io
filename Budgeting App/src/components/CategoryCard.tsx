import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Plus, Home, ShoppingBag, PiggyBank, Trash2, Info } from 'lucide-react';
import { BudgetCategory, Expense } from '../App';
import { AddExpenseDialog } from './AddExpenseDialog';
import { useLocale } from '../contexts/LocaleContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface CategoryCardProps {
  category: BudgetCategory;
  budget: number;
  onAddExpense: (expense: Expense) => void;
  onRemoveExpense: (expenseId: string) => void;
}

export function CategoryCard({ category, budget, onAddExpense, onRemoveExpense }: CategoryCardProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { t, formatCurrency } = useLocale();
  
  const spent = category.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - spent;
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;

  const getIcon = () => {
    switch (category.icon) {
      case 'needs':
        return <Home className="w-5 h-5" />;
      case 'wants':
        return <ShoppingBag className="w-5 h-5" />;
      case 'savings':
        return <PiggyBank className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getInfoKey = () => {
    switch (category.name.toLowerCase()) {
      case 'needs':
        return 'needsInfo';
      case 'wants':
        return 'wantsInfo';
      case 'savings':
        return 'savingsInfo';
      default:
        return 'needsInfo';
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="p-4" style={{ borderTop: `4px solid ${category.color}` }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <div style={{ color: category.color }}>
                  {getIcon()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <h3 className="text-gray-900">{t(category.name.toLowerCase() as any)}</h3>
                  <p className="text-sm text-gray-500">{category.percentage}% {t('ofIncome')}</p>
                </div>
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <Info className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">{t(getInfoKey() as any)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setShowAddDialog(true)}
              style={{ backgroundColor: category.color }}
              className="hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {formatCurrency(spent)} {t('spent')}
              </span>
              <span className={`text-sm ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(remaining))} {remaining >= 0 ? t('left') : t('over')}
              </span>
            </div>
            <Progress 
              value={Math.min(percentage, 100)} 
              className="h-2"
              style={{
                ['--progress-background' as any]: category.color
              }}
            />
          </div>

          {category.expenses.length > 0 && (
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {category.expenses.map(expense => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{expense.description}</p>
                    <p className="text-xs text-gray-500">{expense.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">{formatCurrency(expense.amount)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveExpense(expense.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <AddExpenseDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddExpense={onAddExpense}
        categoryName={category.name}
        categoryColor={category.color}
      />
    </>
  );
}