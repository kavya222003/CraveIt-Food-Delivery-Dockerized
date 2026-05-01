export interface MenuItem {
    itemId: number;
    restaurantId: number;
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
    imageUrl: string;
}

export interface MenuItemDto {
    restaurantId: number;
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
    imageUrl: string;
}