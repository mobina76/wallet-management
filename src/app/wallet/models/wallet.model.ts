export interface Wallet {
  id: string;
  name: string;
  currency: 'EUR' | 'USD' | 'IRR';
  balance: number;
  isActive: boolean;
}

