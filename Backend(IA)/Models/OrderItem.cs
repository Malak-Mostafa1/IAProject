using System.ComponentModel.DataAnnotations.Schema;

namespace VendorHub.API.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        [ForeignKey("Order")]
        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;

        [ForeignKey("Product")]
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string ProductTitle { get; set; } = ""; // دي ضفتها لحل مشكلة Checkout
    }
}