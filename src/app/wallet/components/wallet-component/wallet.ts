import { Component, inject, signal } from '@angular/core';
import { WalletStore } from '../../store/wallet-store';
import { WalletCurrencyDirective } from '../../directives/wallet-currency.directive';
import { WalletModel } from '../../models/wallet.model';
import { RefundDialog } from '../refund-dialog/refund-dialog';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [WalletCurrencyDirective, RefundDialog, CurrencyPipe],
  selector: 'app-wallet',
  styleUrl: './wallet.css',
  templateUrl: './wallet.html',
  providers: [WalletStore],
})
export class Wallet {
  readonly walletStore = inject(WalletStore);
  readonly showBalance = signal(true);
  readonly refundSuccess = signal(false);
  readonly selectedWallet = signal<WalletModel | null>(null);

  toggleBalance() {
    this.showBalance.update((show) => !show);
  }
  selectWallet(wallet: WalletModel) {
    this.selectedWallet.set(wallet);
  }
  handleRefundSuccess(): void {
    this.refundSuccess.set(true);
    this.selectedWallet.set(null);
  }
}
