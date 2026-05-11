using System;

namespace VendorHub.API.Models
{
    public class Notification
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