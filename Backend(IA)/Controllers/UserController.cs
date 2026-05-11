using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VendorHub.API.Services;
using VendorHub.API.DTOs;


namespace VendorHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly VendorPermissionService _permissionService; // ⭐ أضفناها

        public UserController(UserService userService, VendorPermissionService permissionService)
        {
            _userService = userService;
            _permissionService = permissionService;
        }

        // GET: api/user
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        // GET: api/user/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user is null) return NotFound();
            return Ok(user);
        }

        // PUT: api/user/approve/5
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            var user = await _userService.ApproveUserAsync(id);
            if (user is null) return NotFound();
            return Ok(user);
        }

        // PUT: api/user/disable/5
        [HttpPut("disable/{id}")]
        public async Task<IActionResult> Disable(int id)
        {
            var user = await _userService.DisableUserAsync(id);
            if (user is null) return NotFound();
            return Ok(user);
        }

        // GET: api/user/permissions/5
        [HttpGet("permissions/{vendorId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetVendorPermissions(int vendorId)
        {
            var permissions = await _userService.GetVendorPermissionsAsync(vendorId);
            return Ok(permissions);
        }

        // PUT: api/user/permissions/5
        [HttpPut("permissions/{vendorId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatePermissions(int vendorId, [FromBody] List<VendorPermissionDTO> permissions)
        {
            try
            {
                // استخدمنا VendorPermissionService مباشرة للتحديث (يمنع التكرارات)
                await _permissionService.UpdatePermissionsBatchAsync(vendorId, permissions);
                return Ok(new { message = "Permissions updated successfully." });
            }
            catch (Exception ex)
            {
                // يمكنك استخدام ILogger لتسجيل الخطأ
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}