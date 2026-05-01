import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { CartItem } from '../../../models/cart.model';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './cart.html',
    styleUrl: './cart.css'
})
export class CartComponent implements OnInit {

    cartItems: CartItem[] = [];
    deliveryAddress = '';
    paymentMethod = 'COD';
    isLoading = false;
    errorMessage = '';
    phoneNumber = '';

    constructor(
        public cartService: CartService,
        private orderService: OrderService,
        private authService: AuthService,
        private toastservice: ToastService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.cartService.cartItems$.subscribe(items => {
            this.cartItems = items;
        });
    }

    updateQuantity(itemId: number, quantity: number): void {
        this.cartService.updateQuantity(itemId, quantity);
    }

    removeItem(itemId: number): void {
        this.cartService.removeItem(itemId);
    }

placeOrder(): void {
    if (!this.deliveryAddress.trim()) {
        this.toastservice.error('Please enter a delivery address!');
        return;
    }

    if (!this.phoneNumber.trim()) {
        this.toastservice.error('Please enter your phone number!');
        return;
    }

    if (this.phoneNumber.trim().length < 10) {
        this.toastservice.error('Please enter a valid 10-digit phone number!');
        return;
    }

    if (this.cartItems.length === 0) {
        this.toastservice.error('Your cart is empty!');
        return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const orderData = {
        restaurantId: this.cartService.getRestaurantId()!,
        deliveryAddress: this.deliveryAddress,
        paymentMethod: this.paymentMethod,
        items: this.cartItems.map(c => ({
            itemId: c.menuItem.itemId,
            quantity: c.quantity
        }))
    };

    this.orderService.placeOrder(orderData).subscribe({
        next: (order) => {
            this.cartService.clearCart();
            this.isLoading = false;
            this.router.navigate(['/order-confirmation', order.orderId]);
        },
        error: (err) => {
            this.isLoading = false;
            this.errorMessage = 'Failed to place order. Please try again.';
        }
    });
}

    goBack(): void {
        this.router.navigate(['/restaurants']);
    }
}