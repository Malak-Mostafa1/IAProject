using VendorHub.API.Models;
using System.Threading.Tasks;

namespace VendorHub.API.Repositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailAsync(string email); // دالة خاصة لليوزر
    }
}