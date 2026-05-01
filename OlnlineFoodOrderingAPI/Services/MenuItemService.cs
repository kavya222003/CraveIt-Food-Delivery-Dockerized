using Microsoft.EntityFrameworkCore;
using OlnlineFoodOrderingAPI.Data;
using OlnlineFoodOrderingAPI.DTOs;
using OlnlineFoodOrderingAPI.Models;

namespace OlnlineFoodOrderingAPI.Services
{
    public class MenuItemService : IMenuItemService
    {
        private readonly AppDbContext _context;

        public MenuItemService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<MenuItemResponseDto>> GetMenuByRestaurant(int restaurantId)
        {
            return await _context.MenuItems
                .Where(m => m.RestaurantId == restaurantId)
                .Select(m => new MenuItemResponseDto
                {
                    ItemId = m.ItemId,
                    RestaurantId = m.RestaurantId,
                    Name = m.Name,
                    Description = m.Description,
                    Price = m.Price,
                    Category = m.Category,
                    IsAvailable = m.IsAvailable,
                    ImageUrl = m.ImageUrl
                })
                .ToListAsync();
        }

        public async Task<MenuItemResponseDto?> GetMenuItemById(int id)
        {
            var item = await _context.MenuItems
                .FirstOrDefaultAsync(m => m.ItemId == id);

            if (item == null) return null;

            return new MenuItemResponseDto
            {
                ItemId = item.ItemId,
                RestaurantId = item.RestaurantId,
                Name = item.Name,
                Description = item.Description,
                Price = item.Price,
                Category = item.Category,
                IsAvailable = item.IsAvailable,
                ImageUrl = item.ImageUrl
            };
        }

        public async Task<MenuItemResponseDto> CreateMenuItem(MenuItemDto dto)
        {
            var item = new MenuItem
            {
                RestaurantId = dto.RestaurantId,
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Category = dto.Category,
                IsAvailable = dto.IsAvailable,
                ImageUrl = dto.ImageUrl
            };

            _context.MenuItems.Add(item);
            await _context.SaveChangesAsync();

            return new MenuItemResponseDto
            {
                ItemId = item.ItemId,
                RestaurantId = item.RestaurantId,
                Name = item.Name,
                Description = item.Description,
                Price = item.Price,
                Category = item.Category,
                IsAvailable = item.IsAvailable,
                ImageUrl = item.ImageUrl
            };
        }

        public async Task<MenuItemResponseDto?> UpdateMenuItem(int id, MenuItemDto dto)
        {
            var item = await _context.MenuItems
                .FirstOrDefaultAsync(m => m.ItemId == id);

            if (item == null) return null;

            item.Name = dto.Name;
            item.Description = dto.Description;
            item.Price = dto.Price;
            item.Category = dto.Category;
            item.IsAvailable = dto.IsAvailable;
            item.ImageUrl = dto.ImageUrl;

            await _context.SaveChangesAsync();

            return new MenuItemResponseDto
            {
                ItemId = item.ItemId,
                RestaurantId = item.RestaurantId,
                Name = item.Name,
                Description = item.Description,
                Price = item.Price,
                Category = item.Category,
                IsAvailable = item.IsAvailable,
                ImageUrl = item.ImageUrl
            };
        }
        public async Task<bool> DeleteMenuItem(int id)
        {
            var item = await _context.MenuItems
                .FirstOrDefaultAsync(m => m.ItemId == id);

            if (item == null) return false;

            _context.MenuItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleAvailability(int id)
        {
            var item = await _context.MenuItems
                .FirstOrDefaultAsync(m => m.ItemId == id);

            if (item == null) return false;

            // Flip true → false or false → true
            item.IsAvailable = !item.IsAvailable;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}



