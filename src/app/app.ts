import { Component } from '@angular/core';
import { Wallet } from './wallet/components/wallet-component/wallet';

@Component({
  imports: [Wallet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
