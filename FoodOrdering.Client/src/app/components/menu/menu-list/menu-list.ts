import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItemService } from '../../../services/menu-item.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { MenuItem } from '../../../models/menu-item.model';

@Component({
    selector: 'app-menu-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './menu-list.html',
    styleUrl: './menu-list.css'
})
export class MenuListComponent implements OnInit {

    menuItems: MenuItem[] = [];
    filteredItems: MenuItem[] = [];
    categories: string[] = [];
    selectedCategory = 'All';
    isLoading = true;
    errorMessage = '';
    restaurantId = 0;
    addedItems: Set<number> = new Set();

    constructor(
        private route: ActivatedRoute,
        private menuItemService: MenuItemService,
        private cartService: CartService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.restaurantId = +this.route.snapshot.paramMap.get('id')!;

        this.menuItemService.getByRestaurant(this.restaurantId).subscribe({
            next: (data) => {
                this.menuItems = data;
                this.filteredItems = data;
                this.categories = ['All', ...new Set(data.map(item => item.category))];
                this.isLoading = false;
            },
            error: () => {
                this.errorMessage = 'Failed to load menu items.';
                this.isLoading = false;
            }
        });
    }

    filterByCategory(category: string): void {
        this.selectedCategory = category;
        this.filteredItems = category === 'All'
            ? this.menuItems
            : this.menuItems.filter(item => item.category === category);
    }

    addToCart(item: MenuItem): void {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }
        this.cartService.addItem(item);
        this.addedItems.add(item.itemId);
        setTimeout(() => this.addedItems.delete(item.itemId), 1500);
    }

    isAdded(itemId: number): boolean {
        return this.addedItems.has(itemId);
    }

    goBack(): void {
        this.router.navigate(['/restaurants']);
    }
}