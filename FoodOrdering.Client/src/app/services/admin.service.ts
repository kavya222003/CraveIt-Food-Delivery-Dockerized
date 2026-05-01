import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../app.config.api';
import { Restaurant, RestaurantRequest } from '../models/restaurant.model';
import { MenuItem, MenuItemDto } from '../models/menu-item.model';

export interface DashboardStats {
    totalOrdersToday: number;
    totalRevenueToday: number;
    activeRestaurants: number;
    pendingOrders: number;
    totalUsers: number;
    totalOrdersAllTime: number;
}

export interface AdminUser {
    userId: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {

    private apiUrl = `${API_URL}/admin`;

    constructor(private http: HttpClient) { }

    // ── Dashboard ──
    getDashboard(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`);
    }

    getAllUsers(): Observable<AdminUser[]> {
        return this.http.get<AdminUser[]>(`${this.apiUrl}/users`);
    }

    // ── Orders ──
    getAllOrders(status?: string): Observable<any[]> {
        const url = status
            ? `${API_URL}/orders?status=${status}`
            : `${API_URL}/orders`;
        return this.http.get<any[]>(url);
    }

    updateOrderStatus(orderId: number, status: string): Observable<string> {
        return this.http.patch(
            `${API_URL}/orders/${orderId}/status`,
            { status },
            { responseType: 'text' }
        );
    }

    // ── Restaurants ──
    getAllRestaurants(): Observable<Restaurant[]> {
        return this.http.get<Restaurant[]>(`${API_URL}/restaurants`);
    }

    createRestaurant(data: RestaurantRequest): Observable<Restaurant> {
        return this.http.post<Restaurant>(`${API_URL}/restaurants`, data);
    }

    updateRestaurant(id: number, data: RestaurantRequest): Observable<Restaurant> {
        return this.http.put<Restaurant>(`${API_URL}/restaurants/${id}`, data);
    }

    deleteRestaurant(id: number): Observable<string> {
        return this.http.delete(`${API_URL}/restaurants/${id}`, { responseType: 'text' });
    }

    // ── Menu Items ──
    getMenuByRestaurant(restaurantId: number): Observable<MenuItem[]> {
        return this.http.get<MenuItem[]>(`${API_URL}/menuitems/restaurant/${restaurantId}`);
    }

    createMenuItem(data: MenuItemDto): Observable<MenuItem> {
        return this.http.post<MenuItem>(`${API_URL}/menuitems`, data);
    }

    updateMenuItem(id: number, data: MenuItemDto): Observable<MenuItem> {
        return this.http.put<MenuItem>(`${API_URL}/menuitems/${id}`, data);
    }

    deleteMenuItem(id: number): Observable<string> {
        return this.http.delete(`${API_URL}/menuitems/${id}`, { responseType: 'text' });
    }

    toggleMenuItemAvailability(id: number): Observable<string> {
        return this.http.patch(
            `${API_URL}/menuitems/${id}/availability`,
            {},
            { responseType: 'text' }
        );
    }
}