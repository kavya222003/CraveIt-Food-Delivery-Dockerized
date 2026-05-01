import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../../services/restaurant.service';
import { Restaurant } from '../../../models/restaurant.model';
import { CityService, City } from '../../../services/city.service';

@Component({
    selector: 'app-restaurant-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './restaurant-list.html',
    styleUrl: './restaurant-list.css'
})
export class RestaurantListComponent implements OnInit {

    restaurants: Restaurant[] = [];
    isLoading = true;
    errorMessage = '';
    selectedCity: City | null = null;

    constructor(
        private restaurantService: RestaurantService,
        private router: Router,
        private cityService: CityService
    ) { }

    ngOnInit(): void {
        this.selectedCity = this.cityService.getSelectedCity();

        // FIX: reload restaurants whenever city changes
        this.cityService.selectedCity$.subscribe(city => {
            this.selectedCity = city;
            this.loadRestaurants();
        });
    }

    loadRestaurants(): void {
        this.isLoading = true;
        this.errorMessage = '';

        // FIX: pass city to API — was always fetching all restaurants before
        const cityName = this.selectedCity?.name;

        this.restaurantService.getAll(cityName).subscribe({
            next: (data) => {
                this.restaurants = data;
                this.isLoading = false;
            },
            error: () => {
                this.errorMessage = 'Failed to load restaurants.';
                this.isLoading = false;
            }
        });
    }

    goToMenu(restaurantId: number): void {
        this.router.navigate(['/menu', restaurantId]);
    }
}