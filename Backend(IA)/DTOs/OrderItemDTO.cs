namespace VendorHub.API.DTOs
{
    public class OrderItemDTO
    {
        // حقول الإدخال من العميل (مطلوبة)
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        // حقول إضافية يتم ملؤها من الخادم عند الإرجاع (اختيارية للاستقبال)
        public int Id { get; set; }
        public string? ProductTitle { get; set; }
        public decimal Price { get; set; }
        public int OrderId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}