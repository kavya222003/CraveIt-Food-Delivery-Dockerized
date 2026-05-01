import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class HomeComponent {

    constructor(
        private router: Router,
        public authService: AuthService
    ) { }

    getStarted() {
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/restaurants']);
        } else {
            this.router.navigate(['/login']);
        }
    }

    categories = [
    { emoji: '🍕', name: 'Pizza' },
    { emoji: '🍔', name: 'Burgers' },
    { emoji: '🌮', name: 'Mexican' },
    { emoji: '🍜', name: 'Noodles' },
    { emoji: '🍣', name: 'Sushi' },
    { emoji: '🥗', name: 'Salads' },
    { emoji: '🍗', name: 'Chicken' },
    { emoji: '🧁', name: 'Desserts' },
];
}