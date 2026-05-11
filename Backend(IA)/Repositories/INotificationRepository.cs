using VendorHub.API.Models;

namespace VendorHub.API.Repositories
{
    public interface INotificationRepository
    {
        Task<List<Notification>> GetAllByVendorIdAsync(int vendorId);
        Task AddAsync(Notification notification);
        Task MarkAsReadAsync(int notificationId);
    }

}