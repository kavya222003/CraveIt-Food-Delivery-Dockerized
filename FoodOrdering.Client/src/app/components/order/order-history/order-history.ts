import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { OrderResponse } from '../../../models/order.model';

@Component({
    selector: 'app-order-history',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './order-history.html',
    styleUrl: './order-history.css'
})
export class OrderHistoryComponent implements OnInit {

    orders: OrderResponse[] = [];
    isLoading = true;
    errorMessage = '';

    constructor(
        private orderService: OrderService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.orderService.getMyOrders().subscribe({
            next: (data) => {
                this.orders = data;
                this.isLoading = false;
            },
            error: () => {
                this.errorMessage = 'Failed to load orders.';
                this.isLoading = false;
            }
        });
    }

    viewOrder(orderId: number): void {
        this.router.navigate(['/order-confirmation', orderId]);
    }

    getStatusClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'pending': return 'badge-pending';
            case 'confirmed': return 'badge-confirmed';
            case 'preparing': return 'badge-preparing';
            case 'delivered': return 'badge-delivered';
            default: return 'badge-pending';
        }
    }

    goToRestaurants(): void {
        this.router.navigate(['/restaurants']);
    }
}