using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VendorHub.API.Services;

namespace VendorHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Customer")]
    public class FavoriteController : ControllerBase
    {
        private readonly FavoriteService _service;
        private readonly ILogger<FavoriteController> _logger;

        public FavoriteController(FavoriteService service, ILogger<FavoriteController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            var userId = GetCurrentUserId();
            var result = await _service.GetFavoritesAsync(userId); // الآن List<Product>
            return Ok(result);
        }

        [HttpPost("{productId}")]
        public async Task<IActionResult> AddToFavorites(int productId)
        {
            var userId = GetCurrentUserId();
            try
            {
                await _service.AddToFavoritesAsync(userId, productId);
                return Ok(new { message = "Product added to favorites successfully." });
            }
            catch (Exception ex) when (ex.Message.Contains("not found") || ex.Message.Contains("already exists"))
            {
                _logger.LogWarning(ex, "Add favorite failed for user {UserId}, product {ProductId}", userId, productId);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error adding favorite for user {UserId}, product {ProductId}", userId, productId);
                return StatusCode(500, new { message = "An error occurred while adding to favorites." });
            }
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> RemoveFromFavorites(int productId)
        {
            var userId = GetCurrentUserId();
            try
            {
                await _service.RemoveFromFavoritesAsync(userId, productId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Favorite item not found." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing favorite for user {UserId}, product {ProductId}", userId, productId);
                return StatusCode(500, new { message = "An error occurred while removing from favorites." });
            }
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)
                           ?? User.FindFirst("sub")
                           ?? User.FindFirst("Id")
                           ?? User.FindFirst("nameid")
                           ?? User.Claims.FirstOrDefault(c => c.Type.EndsWith("nameidentifier", StringComparison.OrdinalIgnoreCase));

            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User ID claim not found in token.");

            if (!int.TryParse(userIdClaim.Value, out int userId))
                throw new UnauthorizedAccessException("Invalid user ID format in token.");

            return userId;
        }
    }
}