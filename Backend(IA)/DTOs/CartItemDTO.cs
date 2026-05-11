namespace VendorHub.API.DTOs
{
    public class CartItemDTO
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductTitle { get; set; } = null!;
        public decimal Price { get; set; }   
        public int Quantity { get; set; }
    }
}