using OlnlineFoodOrderingAPI.DTOs;

namespace OlnlineFoodOrderingAPI.Services
{
    public interface IPaymentService
    {
        Task<(bool Success, string Message, PaymentResponseDto? Payment)> ProcessPayment(int orderId, int userId);
        Task<PaymentResponseDto?> GetPaymentByOrderId(int orderId, int userId, string role);
    }
}