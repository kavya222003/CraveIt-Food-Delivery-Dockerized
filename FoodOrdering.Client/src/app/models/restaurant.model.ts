export interface Restaurant {
    restaurantId: number;
    name: string;
    address: string;
    phone: string;
    imageUrl: string;
    city: string;        
    isActive: boolean;
}

export interface RestaurantRequest {
    name: string;
    address: string;
    phone: string;
    imageUrl: string;
    city: string;
}