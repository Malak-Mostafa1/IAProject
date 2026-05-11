using VendorHub.API.Data;
using VendorHub.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace VendorHub.API.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private new readonly AppDbContext _context; // <-- أضفنا new

        public UserRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}