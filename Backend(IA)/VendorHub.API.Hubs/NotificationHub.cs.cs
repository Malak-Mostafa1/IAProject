using Microsoft.AspNetCore.SignalR;

namespace VendorHub.API.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task RegisterVendorGroup(int vendorId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"vendor-{vendorId}");
        }
    }
}