import { Wallet } from '../models/wallet.model';
import { inject, Service, signal } from '@angular/core';
import { WalletApi } from '../services/wallet-api';

interface WalletState{
  wallets: Wallet[];
  isLoading: boolean;
  error: boolean
}
@Service({ autoProvided: false})
export class WalletStore{
  private readonly walletData = inject(WalletApi)
  private readonly store = signal<WalletState>({
    wallets: [],
    isLoading:false,
    error:false
  })
  loadWallets(){
    this.store.update((currentState)=>({
      ...currentState,
      isLoading: true,
      error: false
    }));
    this.walletData.getWallets().subscribe({
      next: (wallets) => {
        this.store.update((currentState) => ({
          ...currentState,
          wallets,
        }));
      },error: ()=>{
        this.store.update((currentState)=> ({
          ...currentState,
          isLoading: false,
          error: true
        }))
      },
      complete: () => {
        this.store.update((currentState) => ({
          ...currentState,
          isLoading: false,
        }))
      },
    });
  }
}
