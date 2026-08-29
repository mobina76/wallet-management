Wallet Management

A small wallet management feature built with Angular 22.

The application displays wallets, supports filtering and balance visibility, and allows users to submit refund requests for active wallets.

Getting Started

Install dependencies:

npm install

Run the application:

npm start

Then open:

http://localhost:4200

Implementation Notes

* Built with Angular 22 using standalone components.
* Wallet data and refund requests are provided through mock API services using RxJS Observables with simulated network delay.
* rxResource is used to manage wallet loading, error, and data states.
* Signals are used for local UI state and derived state.
* A feature-scoped WalletStore manages wallet data, filters, and filtered wallet results.
* Signal Forms are used for wallet filters.
* Reactive Forms are used for the refund form and conditional validation.
* Custom validators are used to validate positive refund amounts and ensure the amount is less than the selected wallet balance.
* A custom directive handles currency-specific wallet styling.
* Angular CurrencyPipe is used to format wallet balances.
* ngx-mask is used to format refund amounts.
* takeUntilDestroyed is used for subscription lifecycle management.

Assumptions

* Balance visibility applies to all wallet cards at once.
* Refunds can only be initiated for active wallets.
* Online refunds require a reason.
* Physical refunds require a shipping address, while the reason is optional.
* The refund amount must be greater than zero and strictly less than the wallet balance.
* A successful refund request does not modify the wallet balance because balance mutation was not specified as part of the challenge.
* Mock API services return deterministic successful responses by default. Error states are handled by the UI and can be verified by temporarily returning an error Observable from the mock service.

Project Structure

src/app/wallet/
├── components/
├── directives/
├── models/
├── services/
├── store/
└── validators/