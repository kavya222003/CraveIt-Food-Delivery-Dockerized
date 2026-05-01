using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OlnlineFoodOrderingAPI.DTOs;
using OlnlineFoodOrderingAPI.Services;

namespace OlnlineFoodOrderingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuItemsController : ControllerBase
    {
        private readonly IMenuItemService _menuItemService;

        public MenuItemsController(IMenuItemService menuItemService)
        {
            _menuItemService = menuItemService;
        }

        [HttpGet("restaurant/{restaurantId}")]
        public async Task<IActionResult> GetByRestaurant(int restaurantId)
        {
            var items = await _menuItemService.GetMenuByRestaurant(restaurantId);

            if (!items.Any())
                return NotFound($"No menu items found for restaurant {restaurantId}.");

            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _menuItemService.GetMenuItemById(id);

            if (item == null)
                return NotFound($"Menu item with ID {id} not found.");

            return Ok(item);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(MenuItemDto dto)
        {
            var item = await _menuItemService.CreateMenuItem(dto);
            return StatusCode(201, item);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, MenuItemDto dto)
        {
            var item = await _menuItemService.UpdateMenuItem(id, dto);

            if (item == null)
                return NotFound($"Menu item with ID {id} not found.");

            return Ok(item);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _menuItemService.DeleteMenuItem(id);

            if (!result)
                return NotFound($"Menu item with ID {id} not found.");

            return Ok("Menu item deleted successfully.");
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/availability")]
        public async Task<IActionResult> ToggleAvailability(int id)
        {
            var result = await _menuItemService.ToggleAvailability(id);

            if (!result)
                return NotFound($"Menu item with ID {id} not found.");

            return Ok("Availability updated successfully.");
        }

    }
}
