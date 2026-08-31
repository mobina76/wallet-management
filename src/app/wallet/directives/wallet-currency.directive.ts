import { Directive, input } from '@angular/core';
import { WalletCurrency } from '../models/wallet.model';

@Directive({
  selector: '[walletCurrency]',
  host: {
    class: 'digital-wallet',
    '[attr.data-currency]': 'currency()',
  },
})
export class WalletCurrencyDirective {
  readonly currency = input.required<WalletCurrency>();
}
