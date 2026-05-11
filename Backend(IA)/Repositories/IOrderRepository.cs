using VendorHub.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace VendorHub.API.Repositories
{
    public interface IOrderRepository
    {
        Task<List<Order>> GetAllAsync();

        Task<Order?> GetByIdAsync(int id); // جعلناه Nullable للأمان

        Task<List<Order>> GetAllByUserIdAsync(int userId);

        // ✅ التعديل الجديد: جلب تاريخ المبيعات الخاص ببائع معين
        // بنرجع OrderItem لأن البائع يهمه يعرف "منتجاته" اللي اتباعت في أي أوردر
        Task<List<OrderItem>> GetSalesByVendorIdAsync(int vendorId);

        Task AddAsync(Order order);

        Task UpdateAsync(Order order);

        Task DeleteAsync(int id);
    }
}