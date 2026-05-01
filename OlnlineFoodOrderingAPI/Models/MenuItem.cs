using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Contracts;

namespace OlnlineFoodOrderingAPI.Models
{
    public class MenuItem
    {
       [Key] 
        public int ItemId { get; set; }        
        public int RestaurantId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Category { get; set; } = string.Empty;
        public bool IsAvailable { get; set; } = true;
        public string ImageUrl { get; set; } = string.Empty;

        public Restaurant Restaurant { get; set; } = null!;
    }
}
