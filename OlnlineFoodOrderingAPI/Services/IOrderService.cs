using OlnlineFoodOrderingAPI.DTOs;

namespace OlnlineFoodOrderingAPI.Services
{
    public interface IOrderService
    {
        Task<(bool Success, string Message, OrderResponseDto? Order)>
            PlaceOrder(int userId, PlaceOrderDto dto);
        Task<List<OrderResponseDto>> GetMyOrders(int userId);
        Task<OrderResponseDto?> GetOrderById(int orderId, int userId, string role);
        Task<List<OrderResponseDto>> GetAllOrders(string? status);
        Task<bool> UpdateOrderStatus(int orderId, string status);
    }
}
