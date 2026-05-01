import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../models/auth.model';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './register.html',
    styleUrl: './register.css'
})
export class RegisterComponent {

    registerData: RegisterRequest = {
        name: '',
        email: '',
        password: ''
    };

    errorMessage = '';
    successMessage = '';
    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onRegister(): void {
        this.errorMessage = '';
        this.successMessage = '';
        this.isLoading = true;

        this.authService.register(this.registerData).subscribe({
            next: () => {
                this.isLoading = false;
                this.successMessage = 'Registration successful! Redirecting to login...';
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 1500);
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.error || 'Registration failed. Please try again.';
            }
        });
    }
}