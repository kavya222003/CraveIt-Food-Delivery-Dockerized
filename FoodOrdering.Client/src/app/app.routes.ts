import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', loadComponent: () =>
        import('./components/home/home/home')
        .then(m => m.HomeComponent) },

    { path: 'login', loadComponent: () =>
        import('./components/auth/login/login')
        .then(m => m.LoginComponent) },

    { path: 'register', loadComponent: () =>
        import('./components/auth/register/register')
        .then(m => m.RegisterComponent) },

    { path: 'restaurants', loadComponent: () =>
        import('./components/restaurant/restaurant-list/restaurant-list')
        .then(m => m.RestaurantListComponent) },

    { path: 'menu/:id', loadComponent: () =>
    import('./components/menu/menu-list/menu-list')
    .then(m => m.MenuListComponent) },
    
    { path: 'cart', loadComponent: () =>
    import('./components/cart/cart/cart')
    .then(m => m.CartComponent),
    canActivate: [authGuard] },


    { path: 'order-confirmation/:id', loadComponent: () =>
        import('./components/order/order-confirmation/order-confirmation')
        .then(m => m.OrderConfirmationComponent),
        canActivate: [authGuard] },

    { path: 'orders', loadComponent: () =>
        import('./components/order/order-history/order-history')
        .then(m => m.OrderHistoryComponent),
        canActivate: [authGuard] },

      { path: 'admin', loadComponent: () =>
        import('./components/admin/dashboard/dashboard')
        .then(m => m.DashboardComponent),
        canActivate: [authGuard, adminGuard] },    

    { path: '**', redirectTo: '/login' }
];