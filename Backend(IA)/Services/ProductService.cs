using VendorHub.API.DTOs;
using VendorHub.API.Models;
using VendorHub.API.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace VendorHub.API.Services
{
    public class ProductService
    {
        private readonly IProductRepository _repo;

        public ProductService(IProductRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<ProductDTO>> GetAllApprovedProductsAsync()
        {
            var products = await _repo.GetAllAsync();
            var approvedProducts = products
                .Where(p => p.IsApproved)
                .Select(MapToDTO)
                .ToList();
            return approvedProducts;
        }

        public async Task<List<ProductDTO>> GetAllProductsAsync()
        {
            var products = await _repo.GetAllAsync();
            return products.Select(MapToDTO).ToList();
        }

        public async Task<List<ProductDTO>> GetProductsByVendorIdAsync(int vendorId)
        {
            var products = await _repo.GetByVendorIdAsync(vendorId);
            return products.Select(MapToDTO).ToList();
        }

        public async Task<object> GetVendorProductPerformanceAsync(int vendorId)
        {
            var products = await _repo.GetByVendorIdAsync(vendorId);
            if (!products.Any()) return new { Message = "No products found for this vendor." };
            return new
            {
                TotalProducts = products.Count,
                TotalViews = products.Sum(p => p.ViewsCount),
                ApprovedProductsCount = products.Count(p => p.IsApproved),
                PendingProductsCount = products.Count(p => !p.IsApproved),
                TopPerformingProducts = products
                    .OrderByDescending(p => p.ViewsCount)
                    .Take(5)
                    .Select(p => new { p.Title, p.ViewsCount })
                    .ToList()
            };
        }

        public async Task<ProductDTO?> GetProductByIdAsync(int id)
        {
            var p = await _repo.GetByIdAsync(id);
            if (p == null) return null;
            return MapToDTO(p);
        }

        public async Task<Product?> GetProductEntityByIdAsync(int id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<ProductDTO> AddProductAsync(Product product)
        {
            await _repo.AddAsync(product);
            return MapToDTO(product);
        }

        public async Task UpdateProductAsync(Product product)
        {
            await _repo.UpdateAsync(product);
        }

        public async Task DeleteProductAsync(int id)
        {
            await _repo.DeleteAsync(id);
        }

        public async Task<ProductDTO?> ApproveProductAsync(int id)
        {
            var product = await _repo.GetByIdAsync(id);
            if (product == null) return null;
            product.IsApproved = true;
            await _repo.UpdateAsync(product);
            return MapToDTO(product);
        }

        public async Task<ProductDTO?> RejectProductAsync(int id)
        {
            var product = await _repo.GetByIdAsync(id);
            if (product == null) return null;
            product.IsApproved = false;
            await _repo.UpdateAsync(product);
            return MapToDTO(product);
        }

        public async Task<List<ProductDTO>> SearchProductsAsync(string? name, int? categoryId, decimal? minPrice, decimal? maxPrice)
        {
            var products = await _repo.GetAllAsync();
            var filtered = products.Where(p => p.IsApproved);
            if (!string.IsNullOrEmpty(name))
                filtered = filtered.Where(p => p.Title.Contains(name, StringComparison.OrdinalIgnoreCase));
            if (categoryId.HasValue)
                filtered = filtered.Where(p => p.CategoryId == categoryId.Value);
            if (minPrice.HasValue)
                filtered = filtered.Where(p => p.Price >= minPrice.Value);
            if (maxPrice.HasValue)
                filtered = filtered.Where(p => p.Price <= maxPrice.Value);
            return filtered.Select(MapToDTO).ToList();
        }

        private ProductDTO MapToDTO(Product p)
        {
            return new ProductDTO
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
                VendorName = p.Vendor?.FullName ?? "",
                IsApproved = p.IsApproved,
                CreatedAt = p.CreatedAt
            };
        }
    }
}