using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VendorHub.API.DTOs;
using VendorHub.API.Services;

namespace VendorHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;
        private readonly NotificationService _notificationService;
        private readonly ILogger<OrderController> _logger;

        public OrderController(
            OrderService orderService,
            NotificationService notificationService,
            ILogger<OrderController> logger)
        {
            _orderService = orderService;
            _notificationService = notificationService;
            _logger = logger;
        }

        // ================================
        // Customer: View his orders
        // ================================
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var userId = GetCurrentUserId();
            var orders = await _orderService.GetAllOrdersAsync(userId);
            return Ok(orders);
        }

        // ================================
        // Customer: View a single order
        // ================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var userId = GetCurrentUserId();
            var order = await _orderService.GetOrderByIdAsync(id, userId);
            if (order == null)
                return NotFound(new { message = "Order not found." });
            return Ok(order);
        }

        // ================================
        // Customer: Checkout
        // ================================
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] List<OrderItemDTO> items)
        {
            if (items == null || !items.Any())
                return BadRequest(new { message = "Order items cannot be empty." });

            var userId = GetCurrentUserId();
            _logger.LogInformation("User {UserId} is checking out with {Count} items.", userId, items.Count);

            try
            {
                var order = await _orderService.CheckoutAsync(userId, items);
                return Ok(order);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Checkout failed: {Message}", ex.Message);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected checkout error");
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }
        }

        // ================================
        // Vendor: Sales History
        // ================================
        [Authorize(Roles = "Vendor")]
        [HttpGet("vendor/sales-history")]
        public async Task<IActionResult> GetVendorSalesHistory()
        {
            var vendorId = GetCurrentUserId();
            var sales = await _orderService.GetVendorSalesHistoryAsync(vendorId);
            return Ok(sales);
        }

        // ================================
        // Vendor: Product Statistics
        // ================================
        [Authorize(Roles = "Vendor")]
        [HttpGet("vendor/statistics")]
        public async Task<IActionResult> GetVendorStatistics()
        {
            var vendorId = GetCurrentUserId();
            var stats = await _orderService.GetVendorStatisticsAsync(vendorId);
            return Ok(stats);
        }

        // ================================
        // Helper: Get UserId from token
        // ================================
        private int GetCurrentUserId()
        {
            var claim = User.Claims.FirstOrDefault(c =>
                c.Type == ClaimTypes.NameIdentifier ||
                c.Type.EndsWith("/nameidentifier"));

            if (claim == null)
                throw new Exception("User ID claim not found in token");

            return int.Parse(claim.Value);
        }
    }
}