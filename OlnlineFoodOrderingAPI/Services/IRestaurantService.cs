using OlnlineFoodOrderingAPI.DTOs;

namespace OlnlineFoodOrderingAPI.Services
{
    public interface IRestaurantService
    {
        Task<List<RestaurantResponseDto>> GetAllRestaurants(string? city = null);  // FIX: added city param
        Task<RestaurantResponseDto?> GetRestaurantById(int id);
        Task<RestaurantResponseDto> CreateRestaurant(RestaurantDto dto);
        Task<RestaurantResponseDto?> UpdateRestaurant(int id, RestaurantDto dto);
        Task<bool> DeleteRestaurant(int id);
    }
}