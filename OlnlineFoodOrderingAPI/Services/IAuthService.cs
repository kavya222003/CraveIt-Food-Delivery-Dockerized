using OlnlineFoodOrderingAPI.DTOs;

namespace OlnlineFoodOrderingAPI.Services
{
    public interface IAuthService
    {
        Task<string> Register(RegisterDto dto);
        Task<AuthResponseDto?> Login(LoginDto dto);
    }
}
