import { Button } from './ui/button';
import { Settings } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

interface BudgetHeaderProps {
  income: number;
  onEditIncome: () => void;
  onOpenSettings: () => void;
}

export function BudgetHeader({ income, onEditIncome, onOpenSettings }: BudgetHeaderProps) {
  const { t, formatCurrency } = useLocale();

  return (
    <div className="bg-green-600 text-white px-4 py-6 mb-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white">{t('budgetTracker')}</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="text-white hover:bg-green-700"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
        <div>
          <p className="text-green-100 text-sm">{t('monthlyIncome')}</p>
          <p className="text-white">{formatCurrency(income)}</p>
        </div>
      </div>
    </div>
  );
}