import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Expense } from '../App';
import { useLocale } from '../contexts/LocaleContext';
import { expenseSuggestions } from '../lib/translations';

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExpense: (expense: Expense) => void;
  categoryName: string;
  categoryColor: string;
}

export function AddExpenseDialog({
  open,
  onOpenChange,
  onAddExpense,
  categoryName,
  categoryColor
}: AddExpenseDialogProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [useCustomDescription, setUseCustomDescription] = useState(false);
  const { t, getCurrencySymbol } = useLocale();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expenseAmount = parseFloat(amount);
    
    if (description.trim() && expenseAmount > 0) {
      const expense: Expense = {
        id: Date.now().toString(),
        description: description.trim(),
        amount: expenseAmount,
        date: new Date().toLocaleDateString()
      };
      
      onAddExpense(expense);
      setDescription('');
      setAmount('');
      setUseCustomDescription(false);
      onOpenChange(false);
    }
  };

  const getSuggestionsForCategory = () => {
    const categoryKey = categoryName.toLowerCase() as 'needs' | 'wants' | 'savings';
    return expenseSuggestions[categoryKey] || [];
  };

  const handleSuggestionSelect = (value: string) => {
    if (value === 'custom') {
      setUseCustomDescription(true);
      setDescription('');
    } else {
      setUseCustomDescription(false);
      setDescription(t(value as any));
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setDescription('');
      setAmount('');
      setUseCustomDescription(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('addExpenseTo')} {t(categoryName.toLowerCase() as any)}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('description')} & {t('amount')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">{t('description')}</Label>
            {!useCustomDescription ? (
              <Select onValueChange={handleSuggestionSelect}>
                <SelectTrigger id="description">
                  <SelectValue placeholder={t('selectOrType')} />
                </SelectTrigger>
                <SelectContent>
                  {getSuggestionsForCategory().map(suggestion => (
                    <SelectItem key={suggestion} value={suggestion}>
                      {t(suggestion as any)}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">
                    {t('expensePlaceholder')}
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('expensePlaceholder')}
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setUseCustomDescription(false);
                    setDescription('');
                  }}
                  className="text-xs"
                >
                  ← {t('selectOrType')}
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="amount">{t('amount')}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{getCurrencySymbol()}</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogClose(false)}
              className="flex-1"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1 hover:opacity-90"
              style={{ backgroundColor: categoryColor }}
            >
              {t('addExpense')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}