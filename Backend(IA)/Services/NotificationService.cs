using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using VendorHub.API.Data;
using VendorHub.API.DTOs;
using VendorHub.API.Hubs;
using VendorHub.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VendorHub.API.Services
{
    public class NotificationService
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hub;

        public NotificationService(AppDbContext context, IHubContext<NotificationHub> hub)
        {
            _context = context;
            _hub = hub;
        }

        // إنشاء Notification عند شراء منتج + إرسالها real-time للـ Vendor
        public async Task SendPurchaseNotificationAsync(int productId, int orderId)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);
            if (product == null) return;

            var notification = new Notification
            {
                VendorId = product.VendorId,
                Title = "New Purchase",
                Message = $"Your product '{product.Title}' was purchased in Order #{orderId}.",
                CreatedAt = DateTime.UtcNow,
                IsRead = false,
                OrderId = orderId
            };

            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            await _hub.Clients.Group($"vendor-{product.VendorId}")
                .SendAsync("ReceiveNotification", new
                {
                    notification.Id,
                    notification.Title,
                    notification.Message,
                    notification.OrderId,
                    notification.CreatedAt,
                    notification.IsRead
                });
        }

        // إنشاء Notification من DTO + إرسالها real-time
        public async Task<Notification> CreateNotificationAsync(NotificationDto dto)
        {
            var notification = new Notification
            {
                VendorId = dto.VendorId,
                Title = dto.Title,
                Message = dto.Message,
                CreatedAt = dto.CreatedAt != default ? dto.CreatedAt : DateTime.UtcNow,
                IsRead = dto.IsRead,
                OrderId = dto.OrderId
            };

            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            await _hub.Clients.Group($"vendor-{dto.VendorId}")
                .SendAsync("ReceiveNotification", new
                {
                    notification.Id,
                    notification.Title,
                    notification.Message,
                    notification.OrderId,
                    notification.CreatedAt,
                    notification.IsRead
                });

            return notification;
        }

        // جلب كل Notifications الخاصة بفيندور
        public async Task<List<Notification>> GetAllNotificationsForVendorAsync(int vendorId)
        {
            return await _context.Notifications
                .Where(n => n.VendorId == vendorId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        // ==============================
        // دوال إضافية للكونترولر
        // ==============================

        // جلب Notification واحد حسب الـ Id
        public async Task<Notification?> GetNotificationByIdAsync(int id)
        {
            return await _context.Notifications.FirstOrDefaultAsync(n => n.Id == id);
        }

        // تحديث Notification (مثلاً تغيير IsRead)
        public async Task UpdateNotificationAsync(Notification notification)
        {
            _context.Notifications.Update(notification);
            await _context.SaveChangesAsync();
        }
    }
}