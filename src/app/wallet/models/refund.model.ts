export type RefundType =  'online' | 'physical'
export interface RefundRequest {
  walletId : string;
  type : RefundType;
  amount : number;
  reason?: string;
  shippingAddress?: string;
}
