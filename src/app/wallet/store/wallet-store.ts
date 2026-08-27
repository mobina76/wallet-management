import { Wallet, WalletFilters } from '../models/wallet.model';
import { computed, inject, Service, signal } from '@angular/core';
import { WalletApi } from '../services/wallet-api';
import { readonly } from '@angular/forms/signals';

interface WalletState {
  wallets: Wallet[];
  isLoading: boolean;
  error: boolean;
  filters: WalletFilters;
}
@Service({ autoProvided: false })
export class WalletStore {
  private readonly walletData = inject(WalletApi);
  private readonly store = signal<WalletState>({
    wallets: [],
    isLoading: false,
    error: false,
    filters: {
      currency: 'ALL',
      status: 'ALL',
    },
  });
  readonly filteredWallets = computed(() => {
    const { wallets, filters } = this.state();

    return wallets.filter((wallet) => {
      const currencyMatched = filters.currency === 'ALL' || wallet.currency === filters.currency;

      const statusMatched =
        filters.status === 'ALL' ||
        (filters.status === 'active' && wallet.isActive) ||
        (filters.status === 'inactive' && !wallet.isActive);

      return currencyMatched && statusMatched;
    });
  });
  readonly state = this.store.asReadonly();
  constructor() {
    this.loadWallets();
  }
  loadWallets() {
    this.store.update((currentState) => ({
      ...currentState,
      isLoading: true,
      error: false,
    }));
    this.walletData.getWallets().subscribe({
      next: (wallets) => {
        this.store.update((currentState) => ({
          ...currentState,
          wallets,
        }));
      },
      error: () => {
        this.store.update((currentState) => ({
          ...currentState,
          isLoading: false,
          error: true,
        }));
      },
      complete: () => {
        this.store.update((currentState) => ({
          ...currentState,
          isLoading: false,
        }));
      },
    });
  }
  setCurrencyFilter(currency: WalletFilters['currency']) {
    this.store.update((currentState) => ({
      ...currentState,
      filters: {
        ...currentState.filters,
        currency,
      },
    }));
  }
  setStatusFilter(status: WalletFilters['status']): void {
    this.store.update((currentState) => ({
      ...currentState,
      filters: {
        ...currentState.filters,
        status,
      },
    }));
  }
}
