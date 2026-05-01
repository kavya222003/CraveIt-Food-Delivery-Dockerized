import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="toast-container">
            @for (toast of toasts; track toast.id) {
                <div class="toast toast-{{ toast.type }}">
                    <span class="toast-icon">{{ toast.icon }}</span>
                    <span class="toast-message">{{ toast.message }}</span>
                    <button class="toast-close"
                        (click)="toastService.remove(toast.id)">×</button>
                </div>
            }
        </div>
    `
})
export class ToastComponent implements OnInit {
    toasts: Toast[] = [];

    constructor(public toastService: ToastService) { }

    ngOnInit() {
        this.toastService.toasts$.subscribe(t => this.toasts = t);
    }
}