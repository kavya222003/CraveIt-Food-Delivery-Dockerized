export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    userId: number;
    userName: string;   // FIX: backend returns 'userName', not 'name'
    role: string;
}