export type RefundType = 'online' | 'physical';

interface RefundRequestBase {
  walletId: string;
  amount: number;
}

export type RefundRequest =
  | (RefundRequestBase & {
      type: 'online';
      reason: string;
    })
  | (RefundRequestBase & {
      type: 'physical';
      shippingAddress: string;
      reason?: string;
    });
