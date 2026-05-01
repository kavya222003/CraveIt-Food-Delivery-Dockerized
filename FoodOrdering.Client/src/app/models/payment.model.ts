export interface PaymentResponse{
    paymentId: number;
    orderId: number;
    amount: number;
    method: string;
    status: string;
    paidAt: string | null;
}