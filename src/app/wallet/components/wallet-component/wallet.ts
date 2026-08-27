import { Component, inject, signal } from '@angular/core';
import { WalletStore } from '../../store/wallet-store';
import { WalletCurrencyDirective } from '../../directives/wallet-currency.directive';
import { WalletModel } from '../../models/wallet.model';
import { RefundDialog } from '../refund-dialog/refund-dialog';

@Component({
  imports: [WalletCurrencyDirective,RefundDialog],
  selector: 'app-wallet',
  styleUrl: './wallet.css',
  templateUrl: './wallet.html',
  providers: [WalletStore],
})
export class Wallet {
  readonly walletStore = inject(WalletStore);
  readonly showBalance = signal(true);
  readonly selectedWallet= signal<WalletModel | null>(null)

  toggleBalance() {
    this.showBalance.update((show) => !show);
  }
  selectWallet(wallet: WalletModel) {
    this.selectedWallet.set(wallet);
  }
}
