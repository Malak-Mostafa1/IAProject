using Microsoft.AspNetCore.Mvc;
using VendorHub.API.DTOs;
using VendorHub.API.Models;
using VendorHub.API.Services;
using System;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using VendorHub.API.Data;
using Microsoft.Extensions.Caching.Memory;   // ⭐ أضفناها

namespace VendorHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;
        private readonly VendorPermissionService _permissionService;
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;        // ⭐ حقل الذاكرة المؤقتة

        public ProductController(
            ProductService productService,
            VendorPermissionService permissionService,
            AppDbContext context,
            IMemoryCache cache)                      // ⭐ حقن IMemoryCache
        {
            _productService = productService;
            _permissionService = permissionService;
            _context = context;
            _cache = cache;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? name,
            [FromQuery] int? categoryId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice)
        {
            var products = await _productService.GetAllApprovedProductsAsync();

            if (!string.IsNullOrEmpty(name))
                products = products.Where(p => p.Title.Contains(name, StringComparison.OrdinalIgnoreCase)).ToList();

            if (categoryId.HasValue)
                products = products.Where(p => p.CategoryId == categoryId.Value).ToList();

            if (minPrice.HasValue)
                products = products.Where(p => p.Price >= minPrice.Value).ToList();

            if (maxPrice.HasValue)
                products = products.Where(p => p.Price <= maxPrice.Value).ToList();

            return Ok(products);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin/all")]
        public async Task<IActionResult> GetAllForAdmin()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Vendor)
                .ToListAsync();

            var result = products.Select(p => new ProductDTO
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                StockQuantity = p.StockQuantity,
                ViewsCount = p.ViewsCount,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name ?? "",
                VendorId = p.VendorId,
                VendorName = p.Vendor?.FullName ?? "Unknown Vendor",
                IsApproved = p.IsApproved,
                CreatedAt = p.CreatedAt
            }).ToList();

            return Ok(result);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Vendor)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();
            if (!product.IsApproved) return Forbid();

            // ✅ زيادة المشاهدات مرة واحدة فقط لكل Customer
            if (User.Identity.IsAuthenticated && User.IsInRole("Customer"))
            {
                var userId = GetCurrentUserId();
                string cacheKey = $"view_{userId}_{id}";

                if (!_cache.TryGetValue(cacheKey, out _))
                {
                    product.ViewsCount++;
                    _cache.Set(cacheKey, true, TimeSpan.FromDays(30));
                    await _context.SaveChangesAsync();
                }
            }

            var dto = new ProductDTO
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                StockQuantity = product.StockQuantity,
                ViewsCount = product.ViewsCount,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name ?? "",
                VendorId = product.VendorId,
                VendorName = product.Vendor?.FullName ?? "Unknown Vendor",
                IsApproved = product.IsApproved,
                CreatedAt = product.CreatedAt
            };

            return Ok(dto);
        }

        // ⬇️ باقي الدوال دون تغيير (Add, Update, Delete, Approve, Reject, Search, GetCurrentUserId)
        [Authorize(Roles = "Vendor")]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateProductDTO dto)
        {
            var vendorId = GetCurrentUserId();

            var allowed = await _permissionService.CheckPermissionAsync(vendorId, "AddProduct");
            if (!allowed)
            {
                Console.WriteLine($"[PERMISSION DENIED] Vendor {vendorId} tried to add product without permission.");
                return StatusCode(403, new { message = "You are not allowed to add products." });
            }

            var product = new Product
            {
                Title = dto.Title,
                Description = dto.Description,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                StockQuantity = dto.StockQuantity,
                CategoryId = dto.CategoryId,
                VendorId = vendorId,
                IsApproved = false,
                CreatedAt = DateTime.Now,
                ViewsCount = 0
            };

            var result = await _productService.AddProductAsync(product);
            return Ok(result);
        }

        [Authorize(Roles = "Vendor")]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateProductDTO dto)
        {
            var vendorId = GetCurrentUserId();

            var allowed = await _permissionService.CheckPermissionAsync(vendorId, "UpdateProduct");
            if (!allowed)
                return StatusCode(403, new { message = "You are not allowed to update products." });

            var existingProduct = await _productService.GetProductEntityByIdAsync(dto.Id);
            if (existingProduct == null) return NotFound();
            if (existingProduct.VendorId != vendorId) return Forbid();

            existingProduct.Title = dto.Title;
            existingProduct.Description = dto.Description;
            existingProduct.Price = dto.Price;
            existingProduct.ImageUrl = dto.ImageUrl;
            existingProduct.StockQuantity = dto.StockQuantity;
            existingProduct.CategoryId = dto.CategoryId;

            await _productService.UpdateProductAsync(existingProduct);
            return Ok();
        }

        [Authorize(Roles = "Vendor")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var vendorId = GetCurrentUserId();

            var allowed = await _permissionService.CheckPermissionAsync(vendorId, "DeleteProduct");
            if (!allowed)
                return StatusCode(403, new { message = "You are not allowed to delete products." });

            var existingProduct = await _productService.GetProductEntityByIdAsync(id);
            if (existingProduct == null) return NotFound();
            if (existingProduct.VendorId != vendorId) return Forbid();

            await _productService.DeleteProductAsync(id);
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            var product = await _productService.ApproveProductAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("reject/{id}")]
        public async Task<IActionResult> Reject(int id)
        {
            var product = await _productService.GetProductEntityByIdAsync(id);
            if (product == null) return NotFound(new { message = "Product not found." });

            await _productService.DeleteProductAsync(id);
            return Ok(new { message = "Product rejected and removed." });
        }

        [Authorize(Roles = "Vendor")]
        [HttpGet("search")]
        public async Task<IActionResult> Search(
            [FromQuery] string? name,
            [FromQuery] int? categoryId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice)
        {
            var vendorId = GetCurrentUserId();
            var products = await _productService.SearchProductsAsync(name, categoryId, minPrice, maxPrice);
            var filtered = products.Where(p => p.VendorId == vendorId);
            return Ok(filtered);
        }

        private int GetCurrentUserId()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (claim == null)
                throw new Exception("User ID claim not found in token");
            return int.Parse(claim.Value);
        }
    }
}