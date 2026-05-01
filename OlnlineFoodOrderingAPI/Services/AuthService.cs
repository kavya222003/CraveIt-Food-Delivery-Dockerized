using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OlnlineFoodOrderingAPI.Data;
using OlnlineFoodOrderingAPI.DTOs;
using OlnlineFoodOrderingAPI.Models;

namespace OlnlineFoodOrderingAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<string> Register(RegisterDto dto)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return "Email already registered.";

            // Create user with hashed password
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Customer"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return "Registration successful.";
        }

        public async Task<AuthResponseDto?> Login(LoginDto dto)
        {
            // Find user by email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            // Verify password
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return null;

            // Generate token
            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Token = token,
                UserId = user.UserId,
                UserName = user.Name,
                Role = user.Role
            };
        }

        // JWT generation lives here inside the service
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!)
            );

            var creds = new SigningCredentials(
                key, SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddHours(
                    double.Parse(_config["Jwt:ExpiryHours"]!)
                ),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}