import { createContext, useContext } from 'react';

// Vibe Wear sells in ONE currency only: Ghana Cedis (GHS), for every customer in
// every country. Prices are stored in GHS in the database and shown exactly as
// stored — no exchange-rate fetching, no country detection, no currency switcher.
// What's shown on the site is exactly what Paystack charges.
export const CURRENCY = { code: 'GHS', symbol: '₵', name: 'Ghana Cedi', flag: '🇬🇭', cc: 'gh', locale: 'en-GH' };

function formatGHS(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '—';
  try {
    return new Intl.NumberFormat(CURRENCY.locale, {
      style: 'currency', currency: 'GHS', minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${CURRENCY.symbol}${n.toFixed(2)}`;
  }
}

const value = {
  currency: CURRENCY.code,
  currentCurrency: CURRENCY,
  formatPrice: formatGHS,
  convert: (amount) => amount, // GHS in = GHS out; kept so existing callers keep working
};

const CurrencyContext = createContext(value);

export function CurrencyProvider({ children }) {
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
