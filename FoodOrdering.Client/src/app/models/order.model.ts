export interface OrderItemRequest {
    itemId: number;
    quantity: number;
}

export interface placeOrderRequest {
    restaurantId: number;
    deliveryAddress: string;
    paymentMethod: string;
    items: OrderItemRequest[];
}

export interface OrderItemResponse {
    itemId: number;
    itemName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface OrderResponse {
    orderId: number;
    userId: number;
    restaurantId: number;
    restaurantName: string;
    totalAmount: number;
    status: string;
    deliveryAddress: string;
    orderedAt: string;
    items: OrderItemResponse[];
    paymentStatus: string;
    paymentMethod: string;
}

export interface UpdateOrderStatus{
    status: string;
} 
