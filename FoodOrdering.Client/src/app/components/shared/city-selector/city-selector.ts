import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CityService, City } from '../../../services/city.service';

@Component({
    selector: 'app-city-selector',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './city-selector.html',
    styleUrl: './city-selector.css'
})
export class CitySelectorComponent implements OnInit {

    @Output() citySelected = new EventEmitter<City>();

    cities: City[] = [];
    filteredCities: City[] = [];
    searchText = '';
    isVisible = false;

    constructor(private cityService: CityService) { }

    ngOnInit(): void {
        this.cities = this.cityService.cities;
        this.filteredCities = this.cities;

        // Show popup if no city selected
        if (!this.cityService.hasCity()) {
            setTimeout(() => this.isVisible = true, 500);
        }
    }

    search(): void {
        this.filteredCities = this.cities.filter(c =>
            c.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
            c.state.toLowerCase().includes(this.searchText.toLowerCase())
        );
    }

    select(city: City): void {
        this.cityService.selectCity(city);
        this.citySelected.emit(city);
        this.close();
    }

    close(): void {
        this.isVisible = false;
    }

    open(): void {
        this.isVisible = true;
        this.searchText = '';
        this.filteredCities = this.cities;
    }
}