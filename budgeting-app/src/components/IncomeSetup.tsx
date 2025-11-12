import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DollarSign } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { languages, currencies, Language } from '../lib/translations';

interface IncomeSetupProps {
  onSetIncome: (income: number) => void;
}

export function IncomeSetup({ onSetIncome }: IncomeSetupProps) {
  const [income, setIncome] = useState('');
  const { t, getCurrencySymbol, language, setLanguage, currencyCode, setCurrencyCode } = useLocale();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(income);
    if (amount > 0) {
      onSetIncome(amount);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-green-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="mb-2">{t('welcomeTitle')}</h1>
          <p className="text-gray-600">{t('welcomeSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{t('preferences')}</p>
            
            <div>
              <Label htmlFor="language">{t('language')}</Label>
              <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.nativeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currency">{t('currency')}</Label>
              <Select value={currencyCode} onValueChange={setCurrencyCode}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="income" className="block mb-2 text-gray-700">
              {t('monthlyIncome')}
            </Label>
            <p className="text-xs text-gray-500 mb-2">{t('afterTaxNote')}</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{getCurrencySymbol()}</span>
              <Input
                id="income"
                type="number"
                step="0.01"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="pl-8"
                placeholder="0.00"
                autoFocus
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            {t('getStarted')}
          </Button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900 mb-2">📊 {t('budgetRule')}</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 50% - {t('needsDescription')}</li>
            <li>• 30% - {t('wantsDescription')}</li>
            <li>• 20% - {t('savingsDescription')}</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}