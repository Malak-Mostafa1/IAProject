using VendorHub.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace VendorHub.API.Repositories
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<List<Product>> GetByVendorIdAsync(int vendorId); // الدالة الخاصة
    }
}