import { Card } from './ui/card';
import { BudgetCategory } from '../App';
import { useLocale } from '../contexts/LocaleContext';

interface BudgetOverviewProps {
  income: number;
  categories: BudgetCategory[];
}

export function BudgetOverview({ income, categories }: BudgetOverviewProps) {
  const { t, formatCurrency } = useLocale();
  
  const totalSpent = categories.reduce(
    (sum, cat) => sum + cat.expenses.reduce((s, e) => s + e.amount, 0),
    0
  );
  const totalBudget = income;
  const remaining = totalBudget - totalSpent;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-600">{t('totalSpent')}</p>
          <p className="text-red-600">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">{t('remaining')}</p>
          <p className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map(category => {
          const budget = (income * category.percentage) / 100;
          const spent = category.expenses.reduce((sum, e) => sum + e.amount, 0);
          const percentage = budget > 0 ? (spent / budget) * 100 : 0;

          return (
            <div key={category.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">{t(category.name.toLowerCase() as any)}</span>
                <span className="text-sm text-gray-600">
                  {formatCurrency(spent).replace(/\.\d{2}$/, '')} / {formatCurrency(budget).replace(/\.\d{2}$/, '')}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: category.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}