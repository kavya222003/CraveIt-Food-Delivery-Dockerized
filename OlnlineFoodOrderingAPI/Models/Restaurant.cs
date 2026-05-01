namespace OlnlineFoodOrderingAPI.Models
{
    public class Restaurant
    {
        public int RestaurantId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public string City { get; set; } = string.Empty;

        public List<MenuItem> MenuItems { get; set; } = new();
        public List<Order> Orders { get; set; } = new();
    }
}
