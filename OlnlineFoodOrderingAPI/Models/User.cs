using Microsoft.AspNetCore.Identity;

namespace OlnlineFoodOrderingAPI.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public List<Order> Orders { get; set; } = new();
    }
}
