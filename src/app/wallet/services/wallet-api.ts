import { Service } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Wallet } from '../models/wallet.model';

@Service()
export class WalletApi{
  getWallets(): Observable<Wallet[]>{
   const wallets: Wallet[] = [
     {
       id: '1',
       name: 'EUR Wallet',
       currency: 'EUR',
       balance: 1500,
       isActive: true,
     }, {
       id: '2',
       name: 'USD Wallet',
       currency: 'USD',
       balance: 300,
       isActive: true,
     }, {
       id: '3',
       name: 'IRR Wallet',
       currency: 'IRR',
       balance: 1406000,
       isActive: false,
     },
   ];
   return of(wallets).pipe(
     delay(800)
   )
  }
}
