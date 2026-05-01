using Microsoft.EntityFrameworkCore;
using OlnlineFoodOrderingAPI.Data;
using OlnlineFoodOrderingAPI.DTOs;
using OlnlineFoodOrderingAPI.Models;

namespace OlnlineFoodOrderingAPI.Services
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string Message, OrderResponseDto? Order)> PlaceOrder(int userId, PlaceOrderDto dto)
        {
            var restaurant = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.RestaurantId == dto.RestaurantId && r.IsActive);

            if (restaurant == null)
                return (false, "Restaurant not found or inactive.", null);

            decimal totalAmount = 0;
            var orderItemsData = new List<(MenuItem Item, int Quantity)>();

            foreach (var cartItem in dto.Items)
            {
                var menuItem = await _context.MenuItems
                    .FirstOrDefaultAsync(m => m.ItemId == cartItem.ItemId
                        && m.RestaurantId == dto.RestaurantId
                        && m.IsAvailable);

                if (menuItem == null)
                    return (false, $"Item {cartItem.ItemId} is unavailable or not from this restaurant.", null);

                totalAmount += menuItem.Price * cartItem.Quantity;
                orderItemsData.Add((menuItem, cartItem.Quantity));
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var order = new Order
                {
                    UserId = userId,
                    RestaurantId = dto.RestaurantId,
                    TotalAmount = totalAmount,
                    Status = "Pending",
                    DeliveryAddress = dto.DeliveryAddress,
                    OrderedAt = DateTime.Now
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                var orderItems = new List<OrderItem>();
                foreach (var (item, quantity) in orderItemsData)
                {
                    orderItems.Add(new OrderItem
                    {
                        OrderId = order.OrderId,
                        ItemId = item.ItemId,
                        Quantity = quantity,
                        UnitPrice = item.Price
                    });
                }

                _context.OrderItems.AddRange(orderItems);
                await _context.SaveChangesAsync();

                var payment = new Payment
                {
                    OrderId = order.OrderId,
                    Amount = totalAmount,
                    Method = dto.PaymentMethod,
                    Status = "Pending",
                    PaidAt = null
                };

                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return (true, "Order placed successfully!", new OrderResponseDto
                {
                    OrderId = order.OrderId,
                    UserId = order.UserId,
                    RestaurantId = order.RestaurantId,
                    RestaurantName = restaurant.Name,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    DeliveryAddress = order.DeliveryAddress,
                    OrderedAt = order.OrderedAt,
                    PaymentStatus = payment.Status,
                    PaymentMethod = payment.Method,
                    Items = orderItemsData.Select(x => new OrderItemResponseDto
                    {
                        ItemId = x.Item.ItemId,
                        ItemName = x.Item.Name,
                        Quantity = x.Quantity,
                        UnitPrice = x.Item.Price,
                        Subtotal = x.Item.Price * x.Quantity
                    }).ToList()
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (false, $"Order failed: {ex.Message}", null);
            }
        }

        public async Task<List<OrderResponseDto>> GetMyOrders(int userId)
        {
            var orders = await _context.Orders
                .Include(o => o.Restaurant)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.Payment)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderedAt)
                .ToListAsync();

            return orders.Select(MapToResponseDto).ToList();
        }

        public async Task<OrderResponseDto?> GetOrderById(int orderId, int userId, string role)
        {
            var order = await _context.Orders
                .Include(o => o.Restaurant)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null) return null;

            if (role != "Admin" && order.UserId != userId)
                return null;

            return MapToResponseDto(order);
        }

        public async Task<List<OrderResponseDto>> GetAllOrders(string? status)
        {
            var query = _context.Orders
                .Include(o => o.Restaurant)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.Payment)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(o => o.Status == status);

            var orders = await query
                .OrderByDescending(o => o.OrderedAt)
                .ToListAsync();

            return orders.Select(MapToResponseDto).ToList();
        }

        public async Task<bool> UpdateOrderStatus(int orderId, string status)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null) return false;

            order.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }

        private OrderResponseDto MapToResponseDto(Order order)
        {
            return new OrderResponseDto
            {
                OrderId = order.OrderId,
                UserId = order.UserId,
                RestaurantId = order.RestaurantId,
                RestaurantName = order.Restaurant?.Name ?? "Unknown",
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                DeliveryAddress = order.DeliveryAddress,
                OrderedAt = order.OrderedAt,
                PaymentStatus = order.Payment?.Status ?? "Unknown",
                PaymentMethod = order.Payment?.Method ?? "Unknown",
                Items = order.OrderItems?.Select(oi => new OrderItemResponseDto
                {
                    ItemId = oi.ItemId,
                    ItemName = oi.MenuItem?.Name ?? "Unknown",
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    Subtotal = oi.UnitPrice * oi.Quantity
                }).ToList() ?? new List<OrderItemResponseDto>()
            };
        }
    }
}