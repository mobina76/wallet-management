import { Wallet } from '../models/wallet.model';

interface WalletState{
  wallets: Wallet[];
  isLoading: boolean;
  error: string | null
}
