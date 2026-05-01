import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, DashboardStats, AdminUser } from '../../../services/admin.service';
import { OrderResponse } from '../../../models/order.model';
import { Restaurant, RestaurantRequest } from '../../../models/restaurant.model';
import { MenuItem, MenuItemDto } from '../../../models/menu-item.model';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

    // ── Tab state ──
    activeTab = 'dashboard';
    isLoading = false;
    successMessage = '';

    // ── Dashboard ──
    stats: DashboardStats | null = null;

    // ── Orders ──
    orders: OrderResponse[] = [];
    selectedStatus = '';

    // ── Users ──
    users: AdminUser[] = [];

    // ── Restaurants ──
    restaurants: Restaurant[] = [];
    showRestaurantForm = false;
    editingRestaurant: Restaurant | null = null;
    restaurantForm: RestaurantRequest = this.emptyRestaurantForm();
    cities = ['Mumbai','Delhi','Bangalore','Chennai','Hyderabad',
               'Pune','Kolkata','Ahmedabad','Vijayawada'];

    // ── Menu Items ──
    menuItems: MenuItem[] = [];
    selectedRestaurantForMenu: Restaurant | null = null;
    showMenuForm = false;
    editingMenuItem: MenuItem | null = null;
    menuForm: MenuItemDto = this.emptyMenuForm();
    categories = ['Starters','Main Course','Breads','Rice','Biryani',
                   'Desserts','Drinks','Snacks','Pizza','Burgers',
                   'Chinese','South Indian','North Indian','Seafood','Salads'];

    constructor(
        private adminService: AdminService,
        private toast: ToastService
    ) { }

    ngOnInit(): void { this.loadDashboard(); }

    // ────────────────────────────────────────────
    // Tab Navigation
    // ────────────────────────────────────────────
    setTab(tab: string): void {
        this.activeTab = tab;
        this.showRestaurantForm = false;
        this.showMenuForm = false;
        this.selectedRestaurantForMenu = null;
        if (tab === 'dashboard')   this.loadDashboard();
        if (tab === 'orders')      this.loadOrders();
        if (tab === 'users')       this.loadUsers();
        if (tab === 'restaurants') this.loadRestaurants();
        if (tab === 'menu')        this.loadRestaurants();
    }

    // ────────────────────────────────────────────
    // Dashboard
    // ────────────────────────────────────────────
    loadDashboard(): void {
        this.isLoading = true;
        this.adminService.getDashboard().subscribe({
            next: (data) => { this.stats = data; this.isLoading = false; },
            error: () => { this.isLoading = false; }
        });
    }

    // ────────────────────────────────────────────
    // Orders
    // ────────────────────────────────────────────
    loadOrders(): void {
        this.isLoading = true;
        this.adminService.getAllOrders(this.selectedStatus || undefined).subscribe({
            next: (data) => { this.orders = data; this.isLoading = false; },
            error: () => { this.isLoading = false; }
        });
    }

    updateStatus(orderId: number, status: string): void {
        if (!status) return;
        this.adminService.updateOrderStatus(orderId, status).subscribe({
            next: () => {
                this.toast.success(`Order #${orderId} updated to ${status}`);
                this.loadOrders();
            },
            error: () => this.toast.error('Failed to update order status')
        });
    }

    // ────────────────────────────────────────────
    // Users
    // ────────────────────────────────────────────
    loadUsers(): void {
        this.isLoading = true;
        this.adminService.getAllUsers().subscribe({
            next: (data) => { this.users = data; this.isLoading = false; },
            error: () => { this.isLoading = false; }
        });
    }

    // ────────────────────────────────────────────
    // Restaurants
    // ────────────────────────────────────────────
    loadRestaurants(): void {
        this.isLoading = true;
        this.adminService.getAllRestaurants().subscribe({
            next: (data) => { this.restaurants = data; this.isLoading = false; },
            error: () => { this.isLoading = false; }
        });
    }

    openAddRestaurant(): void {
        this.editingRestaurant = null;
        this.restaurantForm = this.emptyRestaurantForm();
        this.showRestaurantForm = true;
    }

    openEditRestaurant(r: Restaurant): void {
        this.editingRestaurant = r;
        this.restaurantForm = {
            name: r.name, address: r.address,
            phone: r.phone, imageUrl: r.imageUrl, city: r.city
        };
        this.showRestaurantForm = true;
    }

    saveRestaurant(): void {
        if (!this.restaurantForm.name || !this.restaurantForm.city) {
            this.toast.error('Name and City are required!'); return;
        }
        if (this.editingRestaurant) {
            this.adminService.updateRestaurant(this.editingRestaurant.restaurantId, this.restaurantForm).subscribe({
                next: () => {
                    this.toast.success('Restaurant updated!');
                    this.showRestaurantForm = false;
                    this.loadRestaurants();
                },
                error: () => this.toast.error('Failed to update restaurant')
            });
        } else {
            this.adminService.createRestaurant(this.restaurantForm).subscribe({
                next: () => {
                    this.toast.success('Restaurant added!');
                    this.showRestaurantForm = false;
                    this.loadRestaurants();
                },
                error: () => this.toast.error('Failed to add restaurant')
            });
        }
    }

    deleteRestaurant(id: number, name: string): void {
        if (!confirm(`Deactivate "${name}"?`)) return;
        this.adminService.deleteRestaurant(id).subscribe({
            next: () => { this.toast.success('Restaurant deactivated'); this.loadRestaurants(); },
            error: () => this.toast.error('Failed to deactivate')
        });
    }

    cancelRestaurantForm(): void {
        this.showRestaurantForm = false;
        this.editingRestaurant = null;
    }

    // ────────────────────────────────────────────
    // Menu Items
    // ────────────────────────────────────────────
    selectRestaurantForMenu(r: Restaurant): void {
        this.selectedRestaurantForMenu = r;
        this.showMenuForm = false;
        this.isLoading = true;
        this.adminService.getMenuByRestaurant(r.restaurantId).subscribe({
            next: (data) => { this.menuItems = data; this.isLoading = false; },
            error: () => { this.menuItems = []; this.isLoading = false; }
        });
    }

    openAddMenuItem(): void {
        this.editingMenuItem = null;
        this.menuForm = this.emptyMenuForm();
        this.menuForm.restaurantId = this.selectedRestaurantForMenu!.restaurantId;
        this.showMenuForm = true;
    }

    // FIX: added imageUrl
    openEditMenuItem(item: MenuItem): void {
        this.editingMenuItem = item;
        this.menuForm = {
            restaurantId: item.restaurantId,
            name:         item.name,
            description:  item.description,
            price:        item.price,
            category:     item.category,
            isAvailable:  item.isAvailable,
            imageUrl:     item.imageUrl
        };
        this.showMenuForm = true;
    }

    saveMenuItem(): void {
        if (!this.menuForm.name || !this.menuForm.category || !this.menuForm.price) {
            this.toast.error('Name, category and price are required!'); return;
        }
        if (this.editingMenuItem) {
            this.adminService.updateMenuItem(this.editingMenuItem.itemId, this.menuForm).subscribe({
                next: () => {
                    this.toast.success('Menu item updated!');
                    this.showMenuForm = false;
                    this.selectRestaurantForMenu(this.selectedRestaurantForMenu!);
                },
                error: () => this.toast.error('Failed to update menu item')
            });
        } else {
            this.adminService.createMenuItem(this.menuForm).subscribe({
                next: () => {
                    this.toast.success('Menu item added!');
                    this.showMenuForm = false;
                    this.selectRestaurantForMenu(this.selectedRestaurantForMenu!);
                },
                error: () => this.toast.error('Failed to add menu item')
            });
        }
    }

    deleteMenuItem(id: number, name: string): void {
        if (!confirm(`Delete "${name}"?`)) return;
        this.adminService.deleteMenuItem(id).subscribe({
            next: () => {
                this.toast.success('Menu item deleted');
                this.selectRestaurantForMenu(this.selectedRestaurantForMenu!);
            },
            error: () => this.toast.error('Failed to delete menu item')
        });
    }

    toggleAvailability(item: MenuItem): void {
        this.adminService.toggleMenuItemAvailability(item.itemId).subscribe({
            next: () => {
                item.isAvailable = !item.isAvailable;
                this.toast.success(`"${item.name}" is now ${item.isAvailable ? 'available' : 'unavailable'}`);
            },
            error: () => this.toast.error('Failed to toggle availability')
        });
    }

    cancelMenuForm(): void {
        this.showMenuForm = false;
        this.editingMenuItem = null;
    }

    backToRestaurantList(): void {
        this.selectedRestaurantForMenu = null;
        this.menuItems = [];
        this.showMenuForm = false;
    }

    // ────────────────────────────────────────────
    // Helpers
    // ────────────────────────────────────────────
    emptyRestaurantForm(): RestaurantRequest {
        return { name: '', address: '', phone: '', imageUrl: '', city: '' };
    }

    // FIX: added imageUrl
    emptyMenuForm(): MenuItemDto {
        return {
            restaurantId: 0,
            name:         '',
            description:  '',
            price:        0,
            category:     '',
            isAvailable:  true,
            imageUrl:     ''
        };
    }

    getStatusClass(status: string): string {
        switch (status?.toLowerCase()) {
            case 'pending':          return 'badge-pending';
            case 'confirmed':        return 'badge-confirmed';
            case 'preparing':        return 'badge-preparing';
            case 'out for delivery': return 'badge-delivery';
            case 'delivered':        return 'badge-delivered';
            default:                 return 'badge-pending';
        }
    }
}