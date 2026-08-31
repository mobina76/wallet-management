import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  applyWhen,
  form,
  FormField,
  maxLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';
import { RefundRequest, RefundType } from '../../models/refund.model';
import { WalletModel } from '../../models/wallet.model';
import { RefundApi } from '../../services/refund-api';

export interface RefundDialogData {
  wallet: WalletModel;
}

export type RefundDialogResult = 'submitted' | undefined;

interface RefundFormModel {
  type: RefundType;
  amount: number | null;
  reason: string;
  shippingAddress: string;
}

@Component({
  imports: [
    CurrencyPipe,
    FormField,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  selector: 'app-refund-dialog',
  styleUrl: './refund-dialog.css',
  templateUrl: './refund-dialog.html',
})
export class RefundDialog {
  private readonly dialogData = inject<RefundDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<RefundDialog, RefundDialogResult>>(MatDialogRef);
  private readonly refundApi = inject(RefundApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly wallet = this.dialogData.wallet;
  readonly submitError = signal<string | null>(null);
  private readonly refundModel = signal<RefundFormModel>({
    type: 'online',
    amount: null,
    reason: '',
    shippingAddress: '',
  });

  readonly refundForm = form(this.refundModel, (path) => {
    required(path.amount, { message: 'Enter the amount you want to refund.' });
    validate(path.amount, ({ value }) => {
      const amount = value();

      if (amount === null) {
        return undefined;
      }

      if (!Number.isFinite(amount)) {
        return { kind: 'finiteAmount', message: 'Enter a valid amount.' };
      }

      if (amount <= 0) {
        return { kind: 'positiveAmount', message: 'Amount must be greater than zero.' };
      }

      if (amount >= this.wallet.balance) {
        return {
          kind: 'lessThanBalance',
          message: 'Amount must be less than the available balance.',
        };
      }

      return undefined;
    });

    maxLength(path.reason, 300, { message: 'Keep the reason under 300 characters.' });
    maxLength(path.shippingAddress, 500, {
      message: 'Keep the address under 500 characters.',
    });

    applyWhen(
      path,
      ({ valueOf }) => valueOf(path.type) === 'online',
      (onlinePath) => {
        required(onlinePath.reason, { message: 'Tell us why you need this refund.' });
        validate(onlinePath.reason, ({ value }) => {
          const reason = value();
          return reason.length > 0 && reason.trim().length === 0
            ? { kind: 'meaningfulReason', message: 'Reason cannot contain only spaces.' }
            : undefined;
        });
      },
    );

    applyWhen(
      path,
      ({ valueOf }) => valueOf(path.type) === 'physical',
      (physicalPath) => {
        required(physicalPath.shippingAddress, {
          message: 'Enter the delivery address for the physical refund.',
        });
        validate(physicalPath.shippingAddress, ({ value }) => {
          const address = value();
          return address.length > 0 && address.trim().length === 0
            ? { kind: 'meaningfulAddress', message: 'Address cannot contain only spaces.' }
            : undefined;
        });
      },
    );
  });

  async submitRefund(): Promise<void> {
    if (this.refundForm().submitting()) {
      return;
    }

    this.submitError.set(null);
    this.dialogRef.disableClose = true;

    try {
      await submit(this.refundForm, {
        action: async (field) => {
          const request = this.buildRequest(field().value());
          await firstValueFrom(
            this.refundApi.requestRefund(request).pipe(takeUntilDestroyed(this.destroyRef)),
          );
          this.dialogRef.close('submitted');
        },
        onInvalid: (field) => {
          field().focusBoundControl();
        },
      });
    } catch {
      this.submitError.set('We could not submit the refund. Please try again.');
    } finally {
      this.dialogRef.disableClose = false;
    }
  }

  private buildRequest(model: RefundFormModel): RefundRequest {
    if (model.amount === null) {
      throw new Error('A valid refund form must include an amount.');
    }

    if (model.type === 'online') {
      return {
        walletId: this.wallet.id,
        type: model.type,
        amount: model.amount,
        reason: model.reason.trim(),
      };
    }

    const reason = model.reason.trim();

    return {
      walletId: this.wallet.id,
      type: model.type,
      amount: model.amount,
      shippingAddress: model.shippingAddress.trim(),
      ...(reason ? { reason } : {}),
    };
  }
}
