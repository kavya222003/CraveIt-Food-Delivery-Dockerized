using Microsoft.AspNetCore.Mvc;
using OlnlineFoodOrderingAPI.DTOs;
using OlnlineFoodOrderingAPI.Services;

namespace OlnlineFoodOrderingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await _authService.Register(dto);

            // FIX: matches the period "." that AuthService actually returns
            if (result == "Email already registered.")
                return BadRequest(result);

            return StatusCode(201, result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _authService.Login(dto);
            if (result == null)
                return Unauthorized("Invalid email or password!");
            return Ok(result);
        }
    }
}