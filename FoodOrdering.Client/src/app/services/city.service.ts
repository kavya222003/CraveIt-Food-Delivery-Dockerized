import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface City {
    name: string;
    state: string;
    emoji: string;
}

@Injectable({ providedIn: 'root' })
export class CityService {

    readonly cities: City[] = [
        { name: 'Mumbai',      state: 'Maharashtra',   emoji: '🌊' },
        { name: 'Delhi',       state: 'Delhi',         emoji: '🏛️' },
        { name: 'Bangalore',   state: 'Karnataka',     emoji: '🌿' },
        { name: 'Chennai',     state: 'Tamil Nadu',    emoji: '🌞' },
        { name: 'Hyderabad',   state: 'Telangana',     emoji: '🍖' },
        { name: 'Pune',        state: 'Maharashtra',   emoji: '🎓' },
        { name: 'Kolkata',     state: 'West Bengal',   emoji: '🎨' },
        { name: 'Ahmedabad',   state: 'Gujarat',       emoji: '🏗️' },
        { name: 'Vijayawada',  state: 'Andhra Pradesh',emoji: '🌴' },
    ];

    private selectedCity = new BehaviorSubject<City | null>(
        this.getSavedCity()
    );
    selectedCity$ = this.selectedCity.asObservable();

    private getSavedCity(): City | null {
        const saved = localStorage.getItem('craveIt_city');
        return saved ? JSON.parse(saved) : null;
    }

    selectCity(city: City): void {
        localStorage.setItem('craveIt_city', JSON.stringify(city));
        this.selectedCity.next(city);
    }

    getSelectedCity(): City | null {
        return this.selectedCity.getValue();
    }

    clearCity(): void {
        localStorage.removeItem('craveIt_city');
        this.selectedCity.next(null);
    }

    hasCity(): boolean {
        return this.selectedCity.getValue() !== null;
    }
}