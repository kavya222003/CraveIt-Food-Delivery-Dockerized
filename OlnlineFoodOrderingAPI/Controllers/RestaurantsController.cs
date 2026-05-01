using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OlnlineFoodOrderingAPI.DTOs;
using OlnlineFoodOrderingAPI.Services;

namespace OlnlineFoodOrderingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantsController : ControllerBase
    {
        private readonly IRestaurantService _restaurantService;

        public RestaurantsController(IRestaurantService restaurantService)
        {
            _restaurantService = restaurantService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? city)
        {
            var restaurants = await _restaurantService.GetAllRestaurants(city);
            return Ok(restaurants);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var restaurant = await _restaurantService.GetRestaurantById(id);
            if (restaurant == null)
                return NotFound($"Restaurant with ID {id} not found.");
            return Ok(restaurant);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(RestaurantDto dto)
        {
            var restaurant = await _restaurantService.CreateRestaurant(dto);
            return StatusCode(201, restaurant);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RestaurantDto dto)
        {
            var restaurant = await _restaurantService.UpdateRestaurant(id, dto);
            if (restaurant == null)
                return NotFound($"Restaurant with ID {id} not found.");
            return Ok(restaurant);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _restaurantService.DeleteRestaurant(id);
            if (!result)
                return NotFound($"Restaurant with ID {id} not found.");
            return Ok("Restaurant deactivated successfully.");
        }
    }
}