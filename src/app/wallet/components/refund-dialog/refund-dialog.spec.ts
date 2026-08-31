import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WalletModel } from '../../models/wallet.model';
import { RefundDialog } from './refund-dialog';

describe('RefundDialog', () => {
  let component: RefundDialog;
  let fixture: ComponentFixture<RefundDialog>;

  const wallet: WalletModel = {
    id: '1',
    name: 'EUR Wallet',
    currency: 'EUR',
    balance: 1500,
    isActive: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { wallet } },
        {
          provide: MatDialogRef,
          useValue: { close: vi.fn(), disableClose: false },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RefundDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply conditional validation for each refund type', () => {
    expect(component.refundForm.reason().required()).toBe(true);
    expect(component.refundForm.shippingAddress().required()).toBe(false);

    component.refundForm.type().value.set('physical');

    expect(component.refundForm.reason().required()).toBe(false);
    expect(component.refundForm.shippingAddress().required()).toBe(true);
  });

  it.each([
    ['12,50', 12.5],
    ['۱۲٫۵۰', 12.5],
  ])('should parse localized decimal amount %s', (rawAmount, expectedAmount) => {
    const amountInput = fixture.nativeElement.querySelector(
      'app-currency-amount-input input',
    ) as HTMLInputElement;

    amountInput.value = rawAmount;
    amountInput.dispatchEvent(new Event('input'));

    expect(component.refundForm.amount().value()).toBe(expectedAmount);
  });
});
