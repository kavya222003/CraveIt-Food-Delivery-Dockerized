namespace OlnlineFoodOrderingAPI.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string Method { get; set; } = "COD";
        public string Status { get; set; } = "Pending";
        public DateTime? PaidAt { get; set; }

        public Order Order { get; set; } = null!;
    }
}