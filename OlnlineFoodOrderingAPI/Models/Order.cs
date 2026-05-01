namespace OlnlineFoodOrderingAPI.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public int RestaurantId { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending";
        public string DeliveryAddress { get; set; } = string.Empty;
        public DateTime OrderedAt { get; set; } = DateTime.Now;

   
        public User User { get; set; } = null!;
        public Restaurant Restaurant { get; set; } = null!;
        public List<OrderItem> OrderItems { get; set; } = new();
        public Payment? Payment { get; set; }
    }
}