using VendorHub.API.Data;
using VendorHub.API.Models;
using VendorHub.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace VendorHub.API.Services
{
    public class VendorPermissionService
    {
        private readonly AppDbContext _context;

        public VendorPermissionService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<VendorPermission>> GetPermissionsAsync(int vendorId)
        {
            return await _context.VendorPermissions
                .Where(vp => vp.VendorId == vendorId)
                .ToListAsync();
        }

        public async Task<VendorPermission> AddOrUpdatePermissionAsync(VendorPermission permission)
        {
            // توحيد حالة الأحرف لتجنب "AddProduct" و "addproduct" كقيمتين مختلفتين
            var normalizedName = permission.PermissionName?.Trim();

            var existing = await _context.VendorPermissions
                .FirstOrDefaultAsync(vp => vp.VendorId == permission.VendorId &&
                                           vp.PermissionName == normalizedName);

            if (existing != null)
            {
                // تحديث القيمة فقط
                existing.IsEnabled = permission.IsEnabled;
                _context.VendorPermissions.Update(existing);
                await _context.SaveChangesAsync();
                return existing;
            }
            else
            {
                // إنشاء سجل جديد بالقيمة الموحدة
                permission.PermissionName = normalizedName;
                _context.VendorPermissions.Add(permission);
                await _context.SaveChangesAsync();
                return permission;
            }
        }

        public async Task<bool> CheckPermissionAsync(int vendorId, string permissionName)
        {
            var permission = await _context.VendorPermissions
                .FirstOrDefaultAsync(vp => vp.VendorId == vendorId &&
                                           vp.PermissionName == permissionName);

            // لا توجد صلاحية = غير مسموح
            if (permission == null)
                return false;

            return permission.IsEnabled;
        }

        // دالة مساعدة لتحديث مجموعة صلاحيات مرة واحدة (للاستخدام من UserController)
        public async Task UpdatePermissionsBatchAsync(int vendorId, List<VendorPermissionDTO> permissions)
        {
            foreach (var dto in permissions)
            {
                await AddOrUpdatePermissionAsync(new VendorPermission
                {
                    VendorId = vendorId,
                    PermissionName = dto.PermissionName,
                    IsEnabled = dto.IsEnabled
                });
            }
        }
    }
}