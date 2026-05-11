using VendorHub.API.Data;
using VendorHub.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VendorHub.API.Repositories
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(AppDbContext context) : base(context) { }

        // دالة خاصة مش موجودة في GenericRepository
        public async Task<List<Product>> GetByVendorIdAsync(int vendorId)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Vendor)
                .Where(p => p.VendorId == vendorId)
                .ToListAsync();
        }
    }
}