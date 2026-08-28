export type WalletCurrency = 'EUR' | 'USD' | 'IRR';
export type WalletStatus = 'active' | 'inactive';
export interface WalletModel {
  id: string;
  name: string;
  currency: WalletCurrency;
  balance: number;
  isActive: boolean;
}
export interface WalletFilters{
  currency: WalletCurrency | 'ALL';
  status: WalletStatus | 'ALL';
}
