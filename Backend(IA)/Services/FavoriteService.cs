using VendorHub.API.Data;
using VendorHub.API.Models;
using Microsoft.EntityFrameworkCore;

namespace VendorHub.API.Services
{
    public class FavoriteService
    {
        private readonly AppDbContext _context;

        public FavoriteService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// جلب قائمة المنتجات المفضلة لمستخدم معين، مع جميع تفاصيل المنتج (السعر، المخزون، الصورة، إلخ)
        /// </summary>
        public async Task<List<Product>> GetFavoritesAsync(int userId)
        {
            return await _context.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Product)
                    .ThenInclude(p => p.Category)   // لجلب اسم الفئة إن احتجناها
                .Select(f => f.Product)
                .ToListAsync();
        }

        public async Task AddToFavoritesAsync(int userId, int productId)
        {
            // 1. التأكد من وجود المستخدم
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
                throw new Exception($"User with ID {userId} not found in database.");

            // 2. التأكد من وجود المنتج
            var productExists = await _context.Products.AnyAsync(p => p.Id == productId);
            if (!productExists)
                throw new Exception("Product not found.");

            // 3. التحقق إذا كان المنتج مضافاً مسبقاً
            var exists = await _context.Favorites
                .AnyAsync(f => f.UserId == userId && f.ProductId == productId);

            if (!exists)
            {
                var favorite = new Favorite
                {
                    UserId = userId,
                    ProductId = productId
                };
                _context.Favorites.Add(favorite);
                await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveFromFavoritesAsync(int userId, int productId)
        {
            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId);

            if (favorite is not null)
            {
                _context.Favorites.Remove(favorite);
                await _context.SaveChangesAsync();
            }
        }
    }
}