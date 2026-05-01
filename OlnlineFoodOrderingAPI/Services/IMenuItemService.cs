using OlnlineFoodOrderingAPI.DTOs;

namespace OlnlineFoodOrderingAPI.Services
{
    public interface IMenuItemService
    {
        Task<List<MenuItemResponseDto>> GetMenuByRestaurant(int restaurantId);
        Task<MenuItemResponseDto?> GetMenuItemById(int id);
        Task<MenuItemResponseDto> CreateMenuItem(MenuItemDto dto);
        Task<MenuItemResponseDto?> UpdateMenuItem(int id, MenuItemDto dto);
        Task<bool> DeleteMenuItem(int id);
        Task<bool> ToggleAvailability(int id);
    }
}
