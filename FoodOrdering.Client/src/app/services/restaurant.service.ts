import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../app.config.api';
import { Restaurant, RestaurantRequest } from '../models/restaurant.model';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
    private apiUrl = `${API_URL}/restaurants`;

    constructor(private http: HttpClient) { }

    // FIX: now sends city as query param to the backend
    getAll(city?: string): Observable<Restaurant[]> {
        const url = city
            ? `${this.apiUrl}?city=${encodeURIComponent(city)}`
            : this.apiUrl;
        return this.http.get<Restaurant[]>(url);
    }

    getById(id: number): Observable<Restaurant> {
        return this.http.get<Restaurant>(`${this.apiUrl}/${id}`);
    }

    create(data: RestaurantRequest): Observable<Restaurant> {
        return this.http.post<Restaurant>(this.apiUrl, data);
    }

    update(id: number, data: RestaurantRequest): Observable<Restaurant> {
        return this.http.put<Restaurant>(`${this.apiUrl}/${id}`, data);
    }

    delete(id: number): Observable<string> {
        return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
    }
}