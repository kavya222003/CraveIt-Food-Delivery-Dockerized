import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { OrderResponse } from '../../../models/order.model';

@Component({
    selector: 'app-order-confirmation',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './order-confirmation.html',
    styleUrl: './order-confirmation.css'
})
export class OrderConfirmationComponent implements OnInit {

    order: OrderResponse | null = null;
    isLoading = true;
    errorMessage = '';

    constructor(
        private route: ActivatedRoute,
        private orderService: OrderService,
        private router: Router
    ) { }

    ngOnInit(): void {
        const orderId = +this.route.snapshot.paramMap.get('id')!;
        this.orderService.getById(orderId).subscribe({
            next: (data) => {
                this.order = data;
                this.isLoading = false;
            },
            error: () => {
                this.errorMessage = 'Could not load order details.';
                this.isLoading = false;
            }
        });
    }

   processPayment(): void {
    if (!this.order) return;
    this.orderService.processPayment(this.order.orderId).subscribe({
        next: () => {
            if (this.order) {
                this.order.status = 'Confirmed';
                this.order.paymentStatus = 'Success';
            }
        },
        error: () => {
            this.errorMessage = 'Payment failed. Please try again.';
        }
    });
}

    goToOrders(): void {
        this.router.navigate(['/orders']);
    }

    goToRestaurants(): void {
        this.router.navigate(['/restaurants']);
    }
}