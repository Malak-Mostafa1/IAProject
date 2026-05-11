namespace VendorHub.API.DTOs
{
    public class FavoriteDTO
    {
        public int ProductId { get; set; }
        public string ProductTitle { get; set; } = null!;
        public decimal Price { get; set; }
    }
}