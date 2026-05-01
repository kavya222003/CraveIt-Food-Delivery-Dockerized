using Microsoft.EntityFrameworkCore;
using OlnlineFoodOrderingAPI.Data;
using OlnlineFoodOrderingAPI.DTOs;
using OlnlineFoodOrderingAPI.Models;

namespace OlnlineFoodOrderingAPI.Services
{
    public class RestaurantService : IRestaurantService
    {
        private readonly AppDbContext _context;

        public RestaurantService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<RestaurantResponseDto>> GetAllRestaurants(string? city = null)
        {
            var query = _context.Restaurants
                .Where(r => r.IsActive)
                .AsQueryable();

            if (!string.IsNullOrEmpty(city))
            {
                query = query.Where(r =>
                    r.City.ToLower() == city.ToLower());
            }

            return await query
                .Select(r => new RestaurantResponseDto
                {
                    RestaurantId = r.RestaurantId,
                    Name = r.Name,
                    Address = r.Address,
                    Phone = r.Phone,
                    ImageUrl = r.ImageUrl,
                    City = r.City,
                    IsActive = r.IsActive
                })
                .ToListAsync();
        }

        public async Task<RestaurantResponseDto?> GetRestaurantById(int id)
        {
            var restaurant = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.RestaurantId == id && r.IsActive);

            if (restaurant == null) return null;

            return new RestaurantResponseDto
            {
                RestaurantId = restaurant.RestaurantId,
                Name = restaurant.Name,
                Address = restaurant.Address,
                Phone = restaurant.Phone,
                ImageUrl = restaurant.ImageUrl,
                City = restaurant.City,
                IsActive = restaurant.IsActive
            };
        }

        public async Task<RestaurantResponseDto> CreateRestaurant(RestaurantDto dto)
        {
            var restaurant = new Restaurant
            {
                Name = dto.Name,
                Address = dto.Address,
                Phone = dto.Phone,
                ImageUrl = dto.ImageUrl,
                City = dto.City,
                IsActive = true
            };

            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            return new RestaurantResponseDto
            {
                RestaurantId = restaurant.RestaurantId,
                Name = restaurant.Name,
                Address = restaurant.Address,
                Phone = restaurant.Phone,
                ImageUrl = restaurant.ImageUrl,
                City = restaurant.City,
                IsActive = restaurant.IsActive
            };
        }

        public async Task<RestaurantResponseDto?> UpdateRestaurant(int id, RestaurantDto dto)
        {
            var restaurant = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.RestaurantId == id);

            if (restaurant == null) return null;

            restaurant.Name = dto.Name;
            restaurant.Address = dto.Address;
            restaurant.Phone = dto.Phone;
            restaurant.ImageUrl = dto.ImageUrl;
            restaurant.City = dto.City;

            await _context.SaveChangesAsync();

            return new RestaurantResponseDto
            {
                RestaurantId = restaurant.RestaurantId,
                Name = restaurant.Name,
                Address = restaurant.Address,
                Phone = restaurant.Phone,
                ImageUrl = restaurant.ImageUrl,
                City = restaurant.City,
                IsActive = restaurant.IsActive
            };
        }

        public async Task<bool> DeleteRestaurant(int id)
        {
            var restaurant = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.RestaurantId == id);

            if (restaurant == null) return false;

            restaurant.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}