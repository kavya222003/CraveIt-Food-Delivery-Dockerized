import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_URL } from "../app.config.api";
import { MenuItem } from "../models/menu-item.model";

@Injectable({
    providedIn: 'root'
})
export class MenuItemService {

    private apiUrl = `${API_URL}/menuitems`;

    constructor(private http: HttpClient) { }

    getByRestaurant(restaurantId: number): Observable<MenuItem[]> {
        return this.http.get<MenuItem[]>(
            `${this.apiUrl}/restaurant/${restaurantId}`
        );
    }
    
    getbyId(id: number): Observable<MenuItem> {
        return this.http.get<MenuItem>(`${this.apiUrl}/${id}`);
    }
}    