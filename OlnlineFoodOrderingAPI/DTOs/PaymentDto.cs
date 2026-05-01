namespace OlnlineFoodOrderingAPI.DTOs
{
    public class PaymentResponseDto
    {
        public int PaymentId { get; set; }
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string Method { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? PaidAt { get; set; }
    }
}
