namespace VendorHub.API.DTOs
{
    public class CreateProductDTO
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = null!;
        public int StockQuantity { get; set; }
        public int CategoryId { get; set; }
    }
}