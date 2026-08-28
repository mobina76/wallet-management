import { Service } from '@angular/core';
import { RefundRequest } from '../models/refund.model';
import { delay, Observable, of } from 'rxjs';

@Service()
export class RefundApi {
  requestRefund(request:RefundRequest): Observable<RefundRequest>{
    return of(request).pipe(delay(800))
  }
}

