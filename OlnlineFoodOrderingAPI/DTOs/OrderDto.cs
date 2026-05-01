namespace OlnlineFoodOrderingAPI.DTOs
{
    public class OrderItemRequestDto
    {
        public int ItemId { get; set; }
        public int Quantity { get; set; }
    }

    public class PlaceOrderDto
    {
        public int RestaurantId { get; set; }
        public string DeliveryAddress { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = "COD";
        public List<OrderItemRequestDto> Items { get; set; } = new();

    }

    public class OrderItemResponseDto
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
    }

    public class OrderResponseDto
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public int RestaurantId { get; set; }
        public string RestaurantName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string DeliveryAddress { get; set; } = string.Empty;
        public DateTime OrderedAt { get; set; }
        public List<OrderItemResponseDto> Items { get; set; } = new();
        public string PaymentStatus { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
    }

    public class UpdateOrderStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }
}


