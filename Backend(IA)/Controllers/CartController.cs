using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VendorHub.API.Services;
using System.Security.Claims;

namespace VendorHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Customer")] // تقييد الوصول بالعملاء فقط
    public class CartController : ControllerBase
    {
        private readonly CartService _service;

        public CartController(CartService service)
        {
            _service = service;
        }

        // GET: api/cart
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = GetCurrentUserId();
            var result = await _service.GetCartAsync(userId);
            return Ok(result);
        }

        // POST: api/cart?productId=1&quantity=2
        [HttpPost]
        public async Task<IActionResult> AddToCart(int productId, int quantity)
        {
            if (quantity <= 0)
                return BadRequest("Quantity must be greater than zero.");

            var userId = GetCurrentUserId();
            await _service.AddToCartAsync(userId, productId, quantity);
            return Ok();
        }

        // DELETE: api/cart/{productId}
        [HttpDelete("{productId}")]
        public async Task<IActionResult> RemoveFromCart(int productId)
        {
            var userId = GetCurrentUserId();
            await _service.RemoveCartItemAsync(userId, productId);
            return NoContent();
        }

        /// <summary>
        /// استخراج معرف المستخدم الحالي من التوكن (JWT)
        /// </summary>
        private int GetCurrentUserId()
        {
            // نبحث عن الـ claim الخاص بالمعرف باستخدام الأنواع الشائعة
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)   // "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                           ?? User.FindFirst("sub")                       // بعض الأنظمة تستخدم "sub"
                           ?? User.FindFirst("Id");                       // إذا تم تخزينه باسم "Id"

            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User ID claim not found in token.");

            if (!int.TryParse(userIdClaim.Value, out int userId))
                throw new UnauthorizedAccessException("Invalid user ID format in token.");

            return userId;
        }
    }
}