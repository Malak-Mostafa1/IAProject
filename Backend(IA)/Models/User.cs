using System.ComponentModel.DataAnnotations.Schema;

namespace VendorHub.API.Models
{
    public class User
    {
        public int Id { get; set; }

        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string Role { get; set; } = "Customer";
        public bool IsApproved { get; set; } = false;
        public DateTime CreatedAt { get; set; }

        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<Product> Products { get; set; } = new List<Product>();
        public ICollection<VendorPermission> VendorPermissions { get; set; } = new List<VendorPermission>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>(); // <--- ensure exists
    }
}