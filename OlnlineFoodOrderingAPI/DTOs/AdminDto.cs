namespace OlnlineFoodOrderingAPI.DTOs
{
    public class DashboardDto
    {
        public int TotalOrdersToday { get; set; }
        public decimal TotalRevenueToday { get; set; }
        public int ActiveRestaurants { get; set; }
        public int PendingOrders { get; set; }
        public int TotalUsers { get; set; }
        public int TotalOrdersAlltime { get; set; }
    }

    public class UserResponseDto
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role{ get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
