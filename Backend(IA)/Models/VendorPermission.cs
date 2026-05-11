namespace VendorHub.API.Models
{
    public class VendorPermission
    {
        public int Id { get; set; }

        public int VendorId { get; set; }
        public User Vendor { get; set; } = null!;

        public string PermissionName { get; set; }
        public bool IsEnabled { get; set; }
    }
}
