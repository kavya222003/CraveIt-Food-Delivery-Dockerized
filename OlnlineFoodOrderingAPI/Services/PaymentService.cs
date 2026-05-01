using Microsoft.EntityFrameworkCore;
using OlnlineFoodOrderingAPI.Data;
using OlnlineFoodOrderingAPI.DTOs;
using System.Text;

namespace OlnlineFoodOrderingAPI.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly AppDbContext _context;

        public PaymentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string Message, PaymentResponseDto? Payment)> ProcessPayment(int orderId, int userId)
        {
            // Find order — must belong to this user!
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.OrderId == orderId
                    && o.UserId == userId);

            if (order == null)
                return (false, "Order not found or access denied.", null);

            // Can't pay for already confirmed/delivered orders
            if (order.Status != "Pending")
                return (false, $"Order is already '{order.Status}'. Cannot process payment.", null);

            // Find payment record
            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.OrderId == orderId);

            if (payment == null)
                return (false, "Payment record not found.", null);

            // Already paid?
            if (payment.Status == "Success")
                return (false, "Payment already processed.", null);

            // ✅ Simulate payment success
            payment.Status = "Success";
            payment.PaidAt = DateTime.Now;

            // Update order status
            order.Status = "Confirmed";

            await _context.SaveChangesAsync();

            return (true, "Payment successful!", new PaymentResponseDto
            {
                PaymentId = payment.PaymentId,
                OrderId = payment.OrderId,
                Amount = payment.Amount,
                Method = payment.Method,
                Status = payment.Status,
                PaidAt = payment.PaidAt
            });
        }

        public async Task<PaymentResponseDto?> GetPaymentByOrderId(int orderId, int userId, string role)
        {
            var payment = await _context.Payments
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.OrderId == orderId);

            if (payment == null) return null;

            // Customer can only see their OWN payment
            if (role != "Admin" && payment.Order.UserId != userId)
                return null;

            return new PaymentResponseDto
            {
                PaymentId = payment.PaymentId,
                OrderId = payment.OrderId,
                Amount = payment.Amount,
                Method = payment.Method,
                Status = payment.Status,
                PaidAt = payment.PaidAt
            };
        }
    }
}