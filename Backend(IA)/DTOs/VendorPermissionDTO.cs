namespace VendorHub.API.DTOs
{
    public class VendorPermissionDTO
    {
        public int Id { get; set; }
        public string PermissionName { get; set; } = string.Empty;
        public bool IsEnabled { get; set; }
    }
}