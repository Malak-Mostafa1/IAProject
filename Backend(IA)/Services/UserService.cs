using Microsoft.EntityFrameworkCore;
using VendorHub.API.Data;
using VendorHub.API.DTOs;
using VendorHub.API.Models;
using VendorHub.API.Repositories;

namespace VendorHub.API.Services
{
    public class UserService
    {
        private readonly IUserRepository _repo;
        private readonly AppDbContext _context;

        public UserService(IUserRepository repo, AppDbContext context)
        {
            _repo = repo;
            _context = context;
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = await _repo.GetAllAsync();
            return users.Select(u => new UserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                Role = u.Role,
                IsApproved = u.IsApproved,
                CreatedAt = u.CreatedAt
            }).ToList();
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                IsApproved = user.IsApproved,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserDto?> ApproveUserAsync(int id)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null) return null;

            user.IsApproved = true;
            await _repo.UpdateAsync(user);

            return new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                IsApproved = user.IsApproved,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserDto?> DisableUserAsync(int id)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null) return null;

            user.IsApproved = false;
            await _repo.UpdateAsync(user);

            return new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                IsApproved = user.IsApproved,
                CreatedAt = user.CreatedAt
            };
        }

        // ===== Update Vendor Permissions =====
        public async Task<List<VendorPermissionDTO>?> UpdateVendorPermissionsAsync(int vendorId, List<VendorPermissionDTO> permissions)
        {
            var vendor = await _repo.GetByIdAsync(vendorId);
            if (vendor == null || vendor.Role != "Vendor") return null;

            foreach (var permDto in permissions)
            {
                var existing = vendor.VendorPermissions.FirstOrDefault(p => p.PermissionName == permDto.PermissionName);
                if (existing != null)
                {
                    existing.IsEnabled = permDto.IsEnabled;
                }
                else
                {
                    vendor.VendorPermissions.Add(new VendorPermission
                    {
                        PermissionName = permDto.PermissionName,
                        IsEnabled = permDto.IsEnabled,
                        VendorId = vendor.Id
                    });
                }
            }

            await _repo.UpdateAsync(vendor);

            return vendor.VendorPermissions
                         .Select(p => new VendorPermissionDTO
                         {
                             Id = p.Id,
                             PermissionName = p.PermissionName,
                             IsEnabled = p.IsEnabled
                         }).ToList();
        }

        // ===== Get Vendor Permissions =====
        public async Task<List<VendorPermissionDTO>> GetVendorPermissionsAsync(int vendorId)
        {
            var permissions = await _context.VendorPermissions
                .Where(p => p.VendorId == vendorId)
                .ToListAsync();

            return permissions.Select(p => new VendorPermissionDTO
            {
                Id = p.Id,
                PermissionName = p.PermissionName,
                IsEnabled = p.IsEnabled
            }).ToList();
        }
    }
}