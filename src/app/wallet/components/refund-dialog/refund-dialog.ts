import { Component, input, output } from '@angular/core';
import { Wallet } from '../wallet-component/wallet';
import { WalletModel } from '../../models/wallet.model';

@Component({
  imports: [],
  selector: 'app-refund-dialog',
  styleUrl: './refund-dialog.css',
  templateUrl: './refund-dialog.html',
})
export class RefundDialog {
  readonly wallet = input.required<WalletModel>();
  readonly close = output<void>();
}
