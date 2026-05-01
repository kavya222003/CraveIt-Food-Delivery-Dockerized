using Microsoft.EntityFrameworkCore;
using OlnlineFoodOrderingAPI.Data;
using OlnlineFoodOrderingAPI.DTOs;
namespace OlnlineFoodOrderingAPI.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;
        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardDto> GetDashboard()
        {
            var today = DateTime.Today;

            var todayOrders = await _context.Orders
                .Where(o => o.OrderedAt >= today)
                .ToListAsync();

            var revenueToday = await _context.Payments
                .Include(p => p.Order)
                .Where(p => p.Status == "Success"
                    && p.PaidAt.HasValue
                    && p.PaidAt.Value.Date == today)
                .SumAsync(p => p.Amount);

            var activeRestaurants = await _context.Restaurants
                .CountAsync(r => r.IsActive);

            var pendingOrders = await _context.Orders
                .CountAsync(o => o.Status == "Pending");

            var totalUsers = await _context.Users.CountAsync();

            var totalOrders = await _context.Orders.CountAsync();

            return new DashboardDto
            {
                TotalOrdersToday = todayOrders.Count,
                TotalRevenueToday = revenueToday,
                ActiveRestaurants = activeRestaurants,
                PendingOrders = pendingOrders,
                TotalUsers = totalUsers,
                TotalOrdersAlltime = totalOrders
            };
        }

        public async Task<List<UserResponseDto>> GetAllUsers()
        {
            return await _context.Users
                .Select(u => new UserResponseDto
                {
                    UserId = u.UserId,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

        }
    }
}
