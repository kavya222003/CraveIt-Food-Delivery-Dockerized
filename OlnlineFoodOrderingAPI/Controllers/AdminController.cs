using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OlnlineFoodOrderingAPI.Services;

namespace OlnlineFoodOrderingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]   // FIX: was completely missing
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminservice;

        public AdminController(IAdminService adminservice)
        {
            _adminservice = adminservice;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var dashboardData = await _adminservice.GetDashboard();
            return Ok(dashboardData);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminservice.GetAllUsers();
            return Ok(users);
        }
    }
}