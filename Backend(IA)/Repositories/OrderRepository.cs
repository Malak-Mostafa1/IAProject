using VendorHub.API.Data;
using VendorHub.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VendorHub.API.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _context;

        public OrderRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Order>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.Id)
                .ToListAsync();
        }

        // ✅ تعديل بسيط لجعلها Nullable كما فعلنا في الـ Interface
        public async Task<Order?> GetByIdAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<List<Order>> GetAllByUserIdAsync(int userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.Id)
                .ToListAsync();
        }

        // ==========================================
        // ✅ التعديل الجديد: جلب مبيعات بائع محدد
        // ==========================================
        public async Task<List<OrderItem>> GetSalesByVendorIdAsync(int vendorId)
        {
            return await _context.OrderItems
                .Include(oi => oi.Product) // لازم عشان نعرف مين البائع
                .Include(oi => oi.Order)   // عشان نعرف تاريخ الأوردر وحالته
                .Where(oi => oi.Product.VendorId == vendorId)
                .OrderByDescending(oi => oi.Id) // أحدث المبيعات أولاً
                .ToListAsync();
        }

        public async Task AddAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
            }
        }
    }
}