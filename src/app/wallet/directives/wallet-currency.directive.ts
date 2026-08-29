import {  Directive, input } from '@angular/core';
import { WalletCurrency } from '../models/wallet.model';

@Directive({
  selector: '[walletCurrency]',
  host: {
    '[class.border-l-4]': 'true',
    '[class.border-l-blue-400]': "currency() === 'EUR'",
    '[class.bg-blue-50/50]': "currency() === 'EUR'",
    '[class.border-l-green-400]': "currency() === 'USD'",
    '[class.bg-green-50/50]': "currency() === 'USD'",
    '[class.border-l-purple-400]': "currency() === 'IRR'",
    '[class.bg-purple-50/50]': "currency() === 'IRR'",
  },
})
export class WalletCurrencyDirective {
  readonly currency = input.required<WalletCurrency>();
}
