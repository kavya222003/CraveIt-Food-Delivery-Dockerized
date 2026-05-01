using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OlnlineFoodOrderingAPI.DTOs;
using OlnlineFoodOrderingAPI.Services;

namespace OlnlineFoodOrderingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PlaceOrder(PlaceOrderDto dto)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );
            var (success, message, order) = await _orderService.PlaceOrder(userId, dto);

            if (!success)
                return BadRequest(message);

            return StatusCode(201, order);
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );
            var orders = await _orderService.GetMyOrders(userId);
            return Ok(orders);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );
            var role = User.FindFirst(ClaimTypes.Role)!.Value;
            var order = await _orderService.GetOrderById(id, userId, role);

            if (order == null)
                return NotFound("Order not found or access denied.");

            return Ok(order);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllOrders([FromQuery] string? status)
        {
            var orders = await _orderService.GetAllOrders(status);
            return Ok(orders);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, UpdateOrderStatusDto dto)
        {
            var result = await _orderService.UpdateOrderStatus(id, dto.Status);

            if (!result)
                return NotFound($"Order {id} not found.");

            return Ok($"Order status updated to '{dto.Status}'.");
        }
    }
}