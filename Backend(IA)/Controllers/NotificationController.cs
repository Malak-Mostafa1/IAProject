using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using VendorHub.API.DTOs;
using VendorHub.API.Models;
using VendorHub.API.Services;
using VendorHub.API.Hubs;
using System.Threading.Tasks;
using System.Linq;

namespace VendorHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Vendor")]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationService _service;
        private readonly IHubContext<NotificationHub> _hub;

        public NotificationController(NotificationService service, IHubContext<NotificationHub> hub)
        {
            _service = service;
            _hub = hub;
        }

        // GET: api/Notification
        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            // ✅ تعديل استخراج VendorId من التوكن
            var vendorId = int.Parse(User.Claims
                .FirstOrDefault(c =>
                    c.Type == System.Security.Claims.ClaimTypes.NameIdentifier ||
                    c.Type.EndsWith("/nameidentifier")
                )?.Value ?? "0");

            var notifications = await _service.GetAllNotificationsForVendorAsync(vendorId);
            return Ok(notifications);
        }

        // POST: api/Notification/send
        [HttpPost("send")]
        public async Task<IActionResult> SendNotification([FromBody] NotificationDto dto)
        {
            var notification = await _service.CreateNotificationAsync(dto);

            // ارسال الاشعار مباشرة عبر SignalR للفيندور
            await _hub.Clients.Group($"vendor-{notification.VendorId}")
                .SendAsync("ReceiveNotification", new
                {
                    notification.Id,
                    notification.Title,
                    notification.Message,
                    notification.OrderId,
                    notification.CreatedAt,
                    notification.IsRead
                });

            return Ok(notification);
        }

        // POST: api/Notification/mark-as-read/{id}
        [HttpPost("mark-as-read/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _service.GetNotificationByIdAsync(id);
            if (notification == null)
                return NotFound();

            notification.IsRead = true;
            await _service.UpdateNotificationAsync(notification);

            return Ok(notification);
        }
    }
}