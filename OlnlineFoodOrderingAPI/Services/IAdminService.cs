using OlnlineFoodOrderingAPI.DTOs;

namespace OlnlineFoodOrderingAPI.Services
{
    public interface IAdminService
    {
        Task<DashboardDto> GetDashboard();
        Task<List<UserResponseDto>> GetAllUsers();
    }
}
