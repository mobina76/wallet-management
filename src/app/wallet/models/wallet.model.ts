export type WalletCurrency = 'EUR' | 'USD' | 'IRR';
export interface Wallet {
  id: string;
  name: string;
  currency: WalletCurrency;
  balance: number;
  isActive: boolean;
}

