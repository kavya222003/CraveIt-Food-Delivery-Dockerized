import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../app.config.api';
import { placeOrderRequest, OrderResponse } from '../models/order.model';
import { PaymentResponse } from '../models/payment.model';

@Injectable({
    providedIn: 'root'
})

export class OrderService {

    private orderUrl = `${API_URL}/orders`;
    private paymentUrl = `${API_URL}/payments`;

    constructor(private http: HttpClient) { }

    placeOrder(data: placeOrderRequest): Observable<OrderResponse> {
        return this.http.post<OrderResponse>(this.orderUrl, data);
    }

    getMyOrders(): Observable<OrderResponse[]> {
        return this.http.get<OrderResponse[]>(`${this.orderUrl}/my`);
    }

    getById(id: number): Observable<OrderResponse> {
        return this.http.get<OrderResponse>(`${this.orderUrl}/${id}`);
    }
    
    processPayment(orderId: number): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(
        `${this.paymentUrl}/process/${orderId}`, {}
    );
}
    
    getAllOrders(status?: string): Observable<OrderResponse[]> {
        const url = status 
        ? `${this.orderUrl}?status=${status}` 
        : this.orderUrl;
        return this.http.get<OrderResponse[]>(url);
    }

    updateStatus(orderId: number, status: string): Observable<string> {
        return this.http.patch(
            `${this.orderUrl}/${orderId}/status`,
            { status },
            { responseType: 'text' }
        );
    }
}