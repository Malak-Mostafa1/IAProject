using VendorHub.API.Data;
using VendorHub.API.DTOs;
using VendorHub.API.Models;
using Microsoft.EntityFrameworkCore;

namespace VendorHub.API.Services
{
    public class CartService
    {
        private readonly AppDbContext _context;

        public CartService(AppDbContext context)
        {
            _context = context;
        }

        // دالة جلب السلة
        public async Task<List<CartItemDTO>> GetCartItemsAsync(int userId)
        {
            return await _context.CartItems
                .Include(ci => ci.Product)
                .Where(ci => ci.UserId == userId)
                .Select(ci => new CartItemDTO
                {
                    Id = ci.Id,
                    ProductId = ci.ProductId,
                    ProductTitle = ci.Product.Title,
                    Quantity = ci.Quantity,
                    Price = ci.Product.Price
                }).ToListAsync();
        }

        // wrapper قديم لو في Controller بيستدعي GetCartAsync
        public async Task<List<CartItemDTO>> GetCartAsync(int userId)
        {
            return await GetCartItemsAsync(userId);
        }

        public async Task AddToCartAsync(int userId, int productId, int quantity)
        {
            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId);

            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
                _context.CartItems.Update(existingItem);
            }
            else
            {
                var cartItem = new CartItem
                {
                    UserId = userId,
                    ProductId = productId,
                    Quantity = quantity
                };
                _context.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();
        }

        public async Task UpdateCartItemAsync(int userId, int productId, int quantity)
        {
            var item = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId);

            if (item == null) throw new Exception("Item not in cart");

            item.Quantity = quantity;
            _context.CartItems.Update(item);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveCartItemAsync(int userId, int productId)
        {
            var item = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId);

            if (item != null)
            {
                _context.CartItems.Remove(item);
                await _context.SaveChangesAsync();
            }
        }
    }
}