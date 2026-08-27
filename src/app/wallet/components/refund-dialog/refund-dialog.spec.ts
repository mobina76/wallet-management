import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RefundDialog } from './refund-dialog';

describe('RefundDialog', () => {
  let component: RefundDialog;
  let fixture: ComponentFixture<RefundDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(RefundDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
