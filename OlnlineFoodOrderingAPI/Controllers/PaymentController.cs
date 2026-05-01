using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OlnlineFoodOrderingAPI.Services;

namespace OlnlineFoodOrderingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [Authorize]
        [HttpPost("process/{orderId}")]
        public async Task<IActionResult> ProcessPayment(int orderId)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var result = await _paymentService.ProcessPayment(orderId, userId);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result.Payment);
        }

        [Authorize]
        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetPayment(int orderId)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );
            var role = User.FindFirst(ClaimTypes.Role)!.Value;

            var payment = await _paymentService
                .GetPaymentByOrderId(orderId, userId, role);

            if (payment == null)
                return NotFound("Payment not found or access denied.");

            return Ok(payment);
        }
    }
}