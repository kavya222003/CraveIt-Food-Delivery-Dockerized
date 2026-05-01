import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { MenuItem } from '../models/menu-item.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
    cartItems$ = this.cartItemsSubject.asObservable();
    private currentRestaurantId: number | null = null;

    addItem(item: MenuItem): void {
        const current: CartItem[] = this.cartItemsSubject.getValue();

        if (this.currentRestaurantId &&
            this.currentRestaurantId !== item.restaurantId) {
            if (!confirm('Adding items from a different restaurant will clear your cart. Continue?')) {
                return;
            }
            this.clearCart();
        }

        this.currentRestaurantId = item.restaurantId;

        const existing = current.find(
            (c: CartItem) => c.menuItem.itemId === item.itemId
        );

        if (existing) {
            const updated = current.map((c: CartItem) =>
                c.menuItem.itemId === item.itemId
                    ? { ...c, quantity: c.quantity + 1 }
                    : c
            );
            this.cartItemsSubject.next(updated);
        } else {
            this.cartItemsSubject.next([
                ...current,
                { menuItem: item, quantity: 1 }
            ]);
        }
    }

    removeItem(itemId: number): void {
        const updated = this.cartItemsSubject.getValue()
            .filter((c: CartItem) => c.menuItem.itemId !== itemId);
        this.cartItemsSubject.next(updated);

        if (updated.length === 0) {
            this.currentRestaurantId = null;
        }
    }

    updateQuantity(itemId: number, quantity: number): void {
        if (quantity <= 0) {
            this.removeItem(itemId);
            return;
        }
        const updated = this.cartItemsSubject.getValue()
            .map((c: CartItem) =>
                c.menuItem.itemId === itemId ? { ...c, quantity } : c
            );
        this.cartItemsSubject.next(updated);
    }

    getTotal(): number {
        return this.cartItemsSubject.getValue()
            .reduce((sum: number, c: CartItem) =>
                sum + (c.menuItem.price * c.quantity), 0
            );
    }

    getItemCount(): number {
        return this.cartItemsSubject.getValue()
            .reduce((sum: number, c: CartItem) =>
                sum + c.quantity, 0
            );
    }

    getRestaurantId(): number | null {
        return this.currentRestaurantId;
    }

    getItems(): CartItem[] {
        return this.cartItemsSubject.getValue();
    }

    clearCart(): void {
        this.cartItemsSubject.next([]);
        this.currentRestaurantId = null;
    }
}