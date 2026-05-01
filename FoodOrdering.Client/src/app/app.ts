import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/shared/navbar/navbar';
import { ToastComponent } from './components/shared/toast/toast';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, Navbar, ToastComponent],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
    title = 'CraveIt';
}