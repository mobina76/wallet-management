import { Component, inject } from '@angular/core';
import { WalletStore } from './store/wallet-store';

@Component({
  imports: [],
  selector: 'app-wallet',
  styleUrl: './wallet.css',
  templateUrl: './wallet.html',
  providers: [WalletStore],
})
export class Wallet {
  readonly walletStore =  inject(WalletStore);

}
