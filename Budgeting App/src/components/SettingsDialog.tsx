import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLocale } from '../contexts/LocaleContext';
import { languages, currencies, Language } from '../lib/translations';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditIncome: () => void;
}

export function SettingsDialog({ open, onOpenChange, onEditIncome }: SettingsDialogProps) {
  const { language, setLanguage, currencyCode, setCurrencyCode, t } = useLocale();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [selectedCurrency, setSelectedCurrency] = useState(currencyCode);

  useEffect(() => {
    setSelectedLanguage(language);
    setSelectedCurrency(currencyCode);
  }, [language, currencyCode, open]);

  const handleSave = () => {
    setLanguage(selectedLanguage);
    setCurrencyCode(selectedCurrency);
    onOpenChange(false);
  };

  const handleEditIncome = () => {
    onOpenChange(false);
    onEditIncome();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('settings')}</DialogTitle>
          <DialogDescription>
            {t('language')} & {t('currency')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="language">{t('language')}</Label>
            <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as Language)}>
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

          <div className="space-y-2">
            <Label htmlFor="currency">{t('currency')}</Label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} - {currency.name} ({currency.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleEditIncome}
            >
              {t('editIncome')}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {t('saveSettings')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}