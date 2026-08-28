import { Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { WalletModel } from '../../models/wallet.model';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { lessThanBalanceValidator, positiveAmountValidator } from '../../validators/refund.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RefundType } from '../../models/refund.model';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-refund-dialog',
  styleUrl: './refund-dialog.css',
  templateUrl: './refund-dialog.html',
})
export class RefundDialog implements OnInit{
  readonly wallet = input.required<WalletModel>();
  readonly close = output<void>();
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  readonly refundForm = this.fb.group({
    type: this.fb.nonNullable.control<RefundType>('online'),
    amount: this.fb.control<number | null>(null, [
      Validators.required,
      positiveAmountValidator,
    ]),
    reason: ['', Validators.required],
    shippingAddress: [''],
  });

  ngOnInit(): void {
    this.refundForm.controls.amount.addValidators(
      lessThanBalanceValidator(this.wallet().balance),
    );
    this.refundForm.controls.amount.updateValueAndValidity();
    this.refundForm.controls.type.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (type:RefundType)=> {
        this.updateRefundTypeValidation(type)
      }
    )
  }
  private updateRefundTypeValidation(type:RefundType): void {
    const reason = this.refundForm.controls.reason;
    const shippingAddress = this.refundForm.controls.shippingAddress;
    if(type === 'physical') {
      reason.clearValidators();
      shippingAddress.setValidators(Validators.required)
    } else {
      reason.setValidators(Validators.required);
      shippingAddress.clearValidators()
    }
    reason.updateValueAndValidity();
    shippingAddress.updateValueAndValidity()
  }
}
