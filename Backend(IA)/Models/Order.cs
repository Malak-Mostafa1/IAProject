using System.ComponentModel.DataAnnotations.Schema;

namespace VendorHub.API.Models
{
    public class Order
    {
        public int Id { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public decimal Total { get; set; }

        public string Status { get; set; } = string.Empty;

        // تسجيل تاريخ الطلب تلقائياً
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // المنتجات الموجودة في الطلب
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}