import { Component, signal } from '@angular/core';
import { Wallet } from './wallet/components/wallet-component/wallet';

@Component({
  imports: [Wallet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('wallet-management');
}
