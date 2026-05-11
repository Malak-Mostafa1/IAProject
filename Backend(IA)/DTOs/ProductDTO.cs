using System;

namespace VendorHub.API.DTOs
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = null!;
        public int StockQuantity { get; set; }
        public int ViewsCount { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public int VendorId { get; set; }
        public string VendorName { get; set; } = null!;
        public bool IsApproved { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}