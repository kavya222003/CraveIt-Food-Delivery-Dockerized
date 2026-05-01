import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
    id: number;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    icon: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {

    private toasts = new BehaviorSubject<Toast[]>([]);
    toasts$ = this.toasts.asObservable();
    private counter = 0;

    success(message: string) { this.show('success', message, '✅'); }
    error(message: string)   { this.show('error',   message, '❌'); }
    warning(message: string) { this.show('warning', message, '⚠️'); }
    info(message: string)    { this.show('info',    message, 'ℹ️'); }

    private show(type: Toast['type'], message: string, icon: string) {
        const id = ++this.counter;
        const toast: Toast = { id, type, message, icon };
        this.toasts.next([...this.toasts.getValue(), toast]);
        setTimeout(() => this.remove(id), 3500);
    }

    remove(id: number) {
        this.toasts.next(
            this.toasts.getValue().filter(t => t.id !== id)
        );
    }
}