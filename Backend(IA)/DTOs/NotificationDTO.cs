using System;

namespace VendorHub.API.DTOs
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public int VendorId { get; set; }
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? OrderId { get; set; }
    }
}