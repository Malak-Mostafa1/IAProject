using Microsoft.AspNetCore.Mvc;
using VendorHub.API.Services;
using VendorHub.API.DTOs;
using VendorHub.API.Models; // ← أضف هذا السطر

namespace VendorHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _service;

        public AuthController(AuthService service)
        {
            _service = service;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await _service.RegisterAsync(dto);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest dto)
        {
            var result = await _service.LoginAsync(dto);
            return Ok(result);
        }
    }
}