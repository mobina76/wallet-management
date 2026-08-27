import {  Directive, input } from '@angular/core';
import { WalletCurrency } from '../models/wallet.model';

@Directive({
  selector: '[walletCurrency]',
  host: {
    '[class.border-blue-300]': "currency() === 'EUR'",
    '[class.border-green-300]': "currency() === 'USD'",
    '[class.border-purple-300]': "currency() === 'IRR'",
  },
})
export class WalletCurrencyDirective {
  readonly currency = input.required<WalletCurrency>();
}
