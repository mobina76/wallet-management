import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Wallet } from './wallet/components/wallet-component/wallet';

@Component({
  imports: [RouterOutlet, Wallet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('wallet-management');
}
