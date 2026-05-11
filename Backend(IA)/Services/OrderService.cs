using Microsoft.AspNetCore.SignalR;
using VendorHub.API.Data;
using VendorHub.API.DTOs;
using VendorHub.API.Hubs;
using VendorHub.API.Models;
using VendorHub.API.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VendorHub.API.Services
{
    public class OrderService
    {
        private readonly IOrderRepository _repo;
        private readonly NotificationService _notificationService;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly AppDbContext _context;

        public OrderService(
            IOrderRepository repo,
            NotificationService notificationService,
            IHubContext<NotificationHub> hubContext,
            AppDbContext context)
        {
            _repo = repo;
            _notificationService = notificationService;
            _hubContext = hubContext;
            _context = context;
        }

        // ==========================================
        // ✅ دالة CheckoutAsync – معالجة كاملة
        // ==========================================
        public async Task<Order> CheckoutAsync(int userId, List<OrderItemDTO> items)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. جلب المنتجات المطلوبة مع البائع (Vendor)
                var productIds = items.Select(i => i.ProductId).ToList();
                var products = await _context.Products
                    .Where(p => productIds.Contains(p.Id))
                    .ToDictionaryAsync(p => p.Id);

                // 2. التحقق من المخزون
                foreach (var item in items)
                {
                    if (!products.TryGetValue(item.ProductId, out var product))
                        throw new InvalidOperationException($"Product with ID {item.ProductId} not found.");

                    if (product.StockQuantity < item.Quantity)
                        throw new InvalidOperationException($"Insufficient stock for '{product.Title}'. Available: {product.StockQuantity}.");
                }

                // 3. إنشاء الطلب
                var order = new Order
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    Status = "Processed",
                    OrderItems = new List<OrderItem>()
                };

                decimal total = 0;

                foreach (var item in items)
                {
                    var product = products[item.ProductId];
                    var orderItem = new OrderItem
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        Price = product.Price,
                        ProductTitle = product.Title
                    };
                    order.OrderItems.Add(orderItem);
                    total += item.Quantity * product.Price;

                    // خصم المخزون
                    product.StockQuantity -= item.Quantity;
                }

                order.Total = total;
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // 4. حذف السلة
                var cartItems = await _context.CartItems
                    .Where(c => c.UserId == userId)
                    .ToListAsync();
                _context.CartItems.RemoveRange(cartItems);
                await _context.SaveChangesAsync();

                // 5. إرسال الإشعارات للبائعين (باستخدام المنتجات من القاموس)
                foreach (var item in order.OrderItems)
                {
                    if (!products.TryGetValue(item.ProductId, out var product))
                        continue;

                    var notificationDto = new NotificationDto
                    {
                        VendorId = product.VendorId,
                        Title = "New Purchase",
                        Message = $"Your product '{product.Title}' has been purchased in Order #{order.Id}",
                        CreatedAt = DateTime.UtcNow,
                        IsRead = false,
                        OrderId = order.Id
                    };

                    await _notificationService.CreateNotificationAsync(notificationDto);
                    await _hubContext.Clients.Group($"vendor-{product.VendorId}")
                        .SendAsync("ReceiveNotification", notificationDto);
                }

                await transaction.CommitAsync();
                return order;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // ==========================================
        // ✅ دالة GetOrderByIdAsync – لعرض تفاصيل الطلب
        // ==========================================
        public async Task<OrderDTO?> GetOrderByIdAsync(int orderId, int userId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null)
                return null;

            return new OrderDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                Total = order.Total,
                Status = order.Status,
                CreatedAt = order.CreatedAt,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDTO
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductTitle = oi.ProductTitle,
                    Quantity = oi.Quantity,
                    Price = oi.Price
                }).ToList()
            };
        }

        // =============== دوال مساعدة أخرى (بدون تغيير) ===============
        public async Task<Product?> GetProductByIdAsync(int productId)
        {
            return await _context.Products.FindAsync(productId);
        }

        public async Task<List<OrderItemDTO>> GetVendorSalesHistoryAsync(int vendorId)
        {
            var sales = await _context.OrderItems
                .Include(oi => oi.Order)      // ⭐ تحميل الطلب المرتبط
                .Include(oi => oi.Product)    // تحميل المنتج لضمان اسمه
                .Where(oi => oi.Product.VendorId == vendorId)
                .OrderByDescending(oi => oi.Order.CreatedAt)
                .ToListAsync();

            return sales.Select(oi => new OrderItemDTO
            {
                Id = oi.Id,
                ProductId = oi.ProductId,
                ProductTitle = oi.Product?.Title ?? "Unknown Product",
                Quantity = oi.Quantity,
                Price = oi.Price,
                OrderId = oi.OrderId,
                CreatedAt = oi.Order?.CreatedAt ?? DateTime.UtcNow
            }).ToList();
        }
        public async Task<object> GetVendorStatisticsAsync(int vendorId)
        {
            Console.WriteLine($"[Statistics] Fetching stats for VendorId: {vendorId}");

            // 1. إجمالي منتجات البائع
            var totalProducts = await _context.Products
                .CountAsync(p => p.VendorId == vendorId);
            Console.WriteLine($"[Statistics] TotalProducts: {totalProducts}");

            // 2. مبيعات البائع
            var sales = await _repo.GetSalesByVendorIdAsync(vendorId);
            var salesList = sales.ToList();
            Console.WriteLine($"[Statistics] Sales items count: {salesList.Count}");

            var totalOrders = salesList.Select(s => s.OrderId).Distinct().Count();
            var totalRevenue = salesList.Sum(s => s.Price * s.Quantity);

            // 3. متوسط التقييم (من جدول المراجعات)
            var productIds = await _context.Products
                .Where(p => p.VendorId == vendorId)
                .Select(p => p.Id)
                .ToListAsync();

            var averageRating = 0.0;
            if (productIds.Any())
            {
                var reviews = await _context.Reviews
                    .Where(r => productIds.Contains(r.ProductId))
                    .ToListAsync();
                averageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0.0;
            }
            Console.WriteLine($"[Statistics] AverageRating: {averageRating}");

            // 4. المنتجات الأكثر مبيعاً
            var topSellingProducts = salesList
                .GroupBy(s => new { s.ProductId, s.ProductTitle })
                .Select(g => new
                {
                    ProductId = g.Key.ProductId,
                    Title = g.Key.ProductTitle ?? "Unknown",
                    SoldQuantity = g.Sum(x => x.Quantity)
                })
                .OrderByDescending(x => x.SoldQuantity)
                .Take(5)
                .ToList();
            Console.WriteLine($"[Statistics] TopSellingProducts count: {topSellingProducts.Count}");

            return new
            {
                TotalProducts = totalProducts,
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue,
                AverageRating = averageRating,
                TopSellingProducts = topSellingProducts
            };
        }

        public async Task<List<OrderDTO>> GetAllOrdersAsync(int userId)
        {
            var orders = await _repo.GetAllByUserIdAsync(userId);
            return orders.Select(o => new OrderDTO
            {
                Id = o.Id,
                UserId = o.UserId,
                Total = o.Total,
                Status = o.Status,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDTO
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductTitle = oi.Product?.Title,
                    Quantity = oi.Quantity,
                    Price = oi.Price
                }).ToList()
            }).ToList();
        }

        public async Task<OrderDTO> CreateOrderAsync(Order order)
        {
            await _repo.AddAsync(order);
            foreach (var item in order.OrderItems)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQuantity -= item.Quantity;
                    _context.Products.Update(product);
                }
            }
            await _context.SaveChangesAsync();
            return new OrderDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                Total = order.Total,
                Status = order.Status,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDTO
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductTitle = oi.Product?.Title,
                    Quantity = oi.Quantity,
                    Price = oi.Price
                }).ToList()
            };
        }
    }
}