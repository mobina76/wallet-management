import { Component, ElementRef, input, model, output, viewChild } from '@angular/core';
import { FormValueControl, transformedValue, ValidationError } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [MatFormFieldModule, MatInputModule],
  selector: 'app-currency-amount-input',
  template: `
    <mat-form-field appearance="outline" subscriptSizing="dynamic">
      <mat-label>Refund amount</mat-label>
      <span matTextPrefix class="currency-prefix">{{ currency() }}</span>
      <input
        #amountInput
        matInput
        type="text"
        inputmode="decimal"
        autocomplete="off"
        placeholder="0.00"
        [attr.aria-invalid]="invalid()"
        [disabled]="disabled()"
        [required]="required()"
        [value]="rawValue()"
        (blur)="touch.emit()"
        (input)="updateRawValue($event)"
      />
      <mat-hint>Maximum {{ maximumLabel() }}</mat-hint>
      @if (touched() && errors()[0]?.message; as message) {
        <mat-error>{{ message }}</mat-error>
      }
    </mat-form-field>
  `,
  styles: `
    :host,
    mat-form-field {
      display: block;
      width: 100%;
    }

    .currency-prefix {
      margin-right: 0.65rem;
      padding-right: 0.65rem;
      border-right: 1px solid #d7deea;
      color: #475569;
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.05em;
    }
  `,
})
export class CurrencyAmountInput implements FormValueControl<number | null> {
  readonly value = model.required<number | null>();
  readonly currency = input.required<string>();
  readonly maximumLabel = input.required<string>();

  readonly disabled = input(false);
  readonly required = input(false);
  readonly touched = input(false);
  readonly invalid = input(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly touch = output<void>();

  private readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('amountInput');

  protected readonly rawValue = transformedValue<number | null, string>(this.value, {
    parse: (rawValue) => {
      const normalized = this.normalizeDecimal(rawValue);

      if (normalized === '') {
        return { value: null };
      }

      if (!/^\d*(?:\.\d{0,2})?$/.test(normalized)) {
        return {
          error: { kind: 'amountFormat', message: 'Use a valid amount with up to 2 decimals.' },
        };
      }

      const amount = Number(normalized);
      return Number.isFinite(amount)
        ? { value: amount }
        : { error: { kind: 'amountFormat', message: 'Enter a valid amount.' } };
    },
    format: (amount) => amount?.toString() ?? '',
  });

  focus(options?: FocusOptions): void {
    this.inputElement()?.nativeElement.focus(options);
  }

  protected updateRawValue(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.rawValue.set(target.value);
  }

  private normalizeDecimal(value: string): string {
    const latinDigits = value
      .trim()
      .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
      .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));

    return latinDigits.replace(/[٫,]/g, '.').replace(/\s/g, '');
  }
}
