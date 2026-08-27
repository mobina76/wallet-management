import { Component, inject, signal } from '@angular/core';
import { WalletStore } from './store/wallet-store';
import { WalletCurrencyDirective } from './directives/wallet-currency.directive';

@Component({
  imports: [WalletCurrencyDirective],
  selector: 'app-wallet',
  styleUrl: './wallet.css',
  templateUrl: './wallet.html',
  providers: [WalletStore],
})
export class Wallet {
  readonly walletStore = inject(WalletStore);
  readonly showBalance = signal(true);

  toggleBalance() {
    this.showBalance.update((show) => !show);
  }
}
