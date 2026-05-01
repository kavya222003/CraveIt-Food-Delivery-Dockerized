import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { CityService, City } from '../../../services/city.service';
import { CitySelectorComponent } from '../city-selector/city-selector';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, CitySelectorComponent],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

    cartCount = 0;
    selectedCity: City | null = null;
    isMenuOpen = false;

    @ViewChild(CitySelectorComponent)
    citySelector!: CitySelectorComponent;

    constructor(
        public authService: AuthService,
        private cartService: CartService,
        public cityService: CityService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.cartService.cartItems$.subscribe(() => {
            this.cartCount = this.cartService.getItemCount();
        });

        this.cityService.selectedCity$.subscribe(city => {
            this.selectedCity = city;
        });
    }

    openCitySelector(): void {
        this.citySelector.open();
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }
}