import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../app.config.api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = `${API_URL}/auth`;

    constructor(private http: HttpClient) { }

    register(data: RegisterRequest): Observable<string> {
        return this.http.post<string>(this.apiUrl + '/register', data,
            { responseType: 'text' as 'json' }
        );
    }

    login(data: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.apiUrl + '/login', data);
    }

    saveToken(response: AuthResponse): void {
        localStorage.setItem('token',    response.token);
        localStorage.setItem('userId',   response.userId.toString());
        localStorage.setItem('userName', response.userName);
        localStorage.setItem('userRole', response.role);
    }

    getToken():    string | null { return localStorage.getItem('token'); }
    getRole():     string | null { return localStorage.getItem('userRole'); }
    getUserName(): string | null { return localStorage.getItem('userName'); }
    getUserId():   number        { return parseInt(localStorage.getItem('userId') || '0'); }
    isLoggedIn():  boolean       { return !!localStorage.getItem('token'); }
    isAdmin():     boolean       { return localStorage.getItem('userRole') === 'Admin'; }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
    }
}