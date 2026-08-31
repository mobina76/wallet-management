import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WalletCurrencyDirective } from '../../directives/wallet-currency.directive';
import { WalletModel } from '../../models/wallet.model';
import { WalletStore } from '../../store/wallet-store';
import { RefundDialog, RefundDialogData, RefundDialogResult } from '../refund-dialog/refund-dialog';

@Component({
  imports: [
    CurrencyPipe,
    FormField,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    WalletCurrencyDirective,
  ],
  selector: 'app-wallet',
  styleUrl: './wallet.css',
  templateUrl: './wallet.html',
  providers: [WalletStore],
})
export class Wallet {
  readonly walletStore = inject(WalletStore);
  readonly showBalance = signal(true);
  readonly walletCount = computed(() =>
    this.walletStore.walletsResource.hasValue()
      ? this.walletStore.walletsResource.value().length
      : 0,
  );
  readonly activeWalletCount = computed(() =>
    this.walletStore.walletsResource.hasValue()
      ? this.walletStore.walletsResource.value().filter((wallet) => wallet.isActive).length
      : 0,
  );

  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  toggleBalance(): void {
    this.showBalance.update((show) => !show);
  }

  openRefundDialog(wallet: WalletModel): void {
    const dialogRef = this.dialog.open<RefundDialog, RefundDialogData, RefundDialogResult>(
      RefundDialog,
      {
        data: { wallet },
        width: '560px',
        maxWidth: 'calc(100vw - 24px)',
        maxHeight: 'calc(100vh - 24px)',
        panelClass: 'refund-dialog-panel',
        backdropClass: 'refund-dialog-backdrop',
        autoFocus: 'first-tabbable',
        restoreFocus: true,
        ariaLabelledBy: 'refund-dialog-title',
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'submitted') {
        return;
      }

      this.snackBar.open('Refund submitted successfully', 'Dismiss', {
        duration: 3500,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['wallet-success-snackbar'],
      });
    });
  }
}
