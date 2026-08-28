import { WalletFilters } from '../models/wallet.model';
import { computed, inject, Service, signal } from '@angular/core';
import { WalletApi } from '../services/wallet-api';
import { rxResource } from '@angular/core/rxjs-interop';

@Service({ autoProvided: false })
export class WalletStore {
  private readonly walletData = inject(WalletApi);
  private readonly filters = signal<WalletFilters>({
    currency: 'ALL',
    status: 'ALL',
  });
  readonly walletsResource = rxResource({
    stream: () => this.walletData.getWallets(),
  });
  readonly filteredWallets = computed(() => {
    const wallets = this.walletsResource.hasValue()
    ? this.walletsResource.value()
      :[]
    const filters = this.filters();
    return wallets.filter((wallet) => {
      const currencyMatched = filters.currency === 'ALL' || wallet.currency === filters.currency;
      const statusMatched =
        filters.status === 'ALL' ||
        (filters.status === 'active' && wallet.isActive) ||
        (filters.status === 'inactive' && !wallet.isActive);

      return currencyMatched && statusMatched;
    });
  });
  setCurrencyFilter(currency: WalletFilters['currency']):void {
    this.filters.update((filters) => ({
      ...filters,
      currency,
    }));

  }
  setStatusFilter(status: WalletFilters['status']): void {
      this.filters.update((filters)=>({
        ...filters,
        status,
      }))
  }
}
