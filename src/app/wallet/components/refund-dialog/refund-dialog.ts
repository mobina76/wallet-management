import { Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { WalletModel } from '../../models/wallet.model';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { lessThanBalanceValidator, positiveAmountValidator } from '../../validators/refund.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RefundRequest, RefundType } from '../../models/refund.model';
import { RefundApi } from '../../services/refund-api';
import { startWith } from 'rxjs';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-refund-dialog',
  styleUrl: './refund-dialog.css',
  templateUrl: './refund-dialog.html',
})
export class RefundDialog implements OnInit {
  readonly wallet = input.required<WalletModel>();
  readonly close = output<void>();
  readonly success = output<void>();
  readonly isSubmit = signal(false);
  private readonly refundApi = inject(RefundApi);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  readonly refundForm = this.fb.group({
    type: this.fb.nonNullable.control<RefundType>('online'),
    amount: this.fb.control<number | null>(null, [Validators.required, positiveAmountValidator]),
    reason: this.fb.nonNullable.control('', Validators.required),
    shippingAddress: this.fb.nonNullable.control('', Validators.required),
  });

  ngOnInit(): void {
    this.refundForm.controls.amount.addValidators(lessThanBalanceValidator(this.wallet().balance));
    this.refundForm.controls.amount.updateValueAndValidity();
    this.refundForm.controls.type.valueChanges
      .pipe(startWith(this.refundForm.controls.type.value), takeUntilDestroyed(this.destroyRef))
      .subscribe((type: RefundType) => {
        this.updateRefundTypeValidation(type);
      });
  }
  private updateRefundTypeValidation(type: RefundType): void {
    const reason = this.refundForm.controls.reason;
    const shippingAddress = this.refundForm.controls.shippingAddress;
    if (type === 'physical') {
      reason.clearValidators();
      shippingAddress.setValidators(Validators.required);
    } else {
      reason.setValidators(Validators.required);
      shippingAddress.clearValidators();
    }
    reason.updateValueAndValidity();
    shippingAddress.updateValueAndValidity();
  }

  submitRefund(): void {
    if (this.refundForm.invalid) {
      this.refundForm.markAllAsTouched();
      return;
    }
    const refundData = this.refundForm.getRawValue();
    if (refundData.amount === null) {
      return;
    }
    const request: RefundRequest = {
      walletId: this.wallet().id,
      type: refundData.type,
      amount: refundData.amount,
    };
    if (refundData.type === 'online') {
      request.reason = refundData.reason;
    } else {
      request.shippingAddress = refundData.shippingAddress;
    }
    this.isSubmit.set(true);
    this.refundApi.requestRefund(request).subscribe({
      next: () => {
        this.success.emit()
      },
      error: () => {
        this.isSubmit.set(false);
      },
      complete: () => {
        this.isSubmit.set(false);
      },
    });
  }
}
