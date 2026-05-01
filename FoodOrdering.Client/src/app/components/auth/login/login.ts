import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/auth.model';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class LoginComponent {

    loginData: LoginRequest = {
        email: '',
        password: ''
    };

    errorMessage = '';
    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onLogin(): void {
        this.errorMessage = '';
        this.isLoading = true;

        this.authService.login(this.loginData).subscribe({
            next: (response) => {
                this.authService.saveToken(response);
                this.isLoading = false;
                if (response.role === 'Admin') {
                    this.router.navigate(['/admin']);
                } else {
                    this.router.navigate(['/restaurants']);
                }
            },
            error: () => {
                this.isLoading = false;
                this.errorMessage = 'Invalid email or password. Please try again.';
            }
        });
    }
}