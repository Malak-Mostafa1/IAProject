using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using VendorHub.API.Data;
using VendorHub.API.Hubs;
using VendorHub.API.Models;
using VendorHub.API.Repositories;
using VendorHub.API.Services;

namespace VendorHub.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // ⭐ إضافة خيارات JSON لتجاهل الحلقات المرجعية
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                });

            // -------------------------------
            // DbContext
            // -------------------------------
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("HMConnection")));

            // -------------------------------
            // Generic Repository (CRUD عام)
            // -------------------------------
            builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

            // -------------------------------
            // Repositories خاصة
            // -------------------------------
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IProductRepository, ProductRepository>();
            builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
            builder.Services.AddScoped<IOrderRepository, OrderRepository>();

            // -------------------------------
            // Services
            // -------------------------------
            builder.Services.AddScoped<NotificationService>();
            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<UserService>();
            builder.Services.AddScoped<ProductService>();
            builder.Services.AddScoped<OrderService>();
            builder.Services.AddScoped<CategoryService>();
            builder.Services.AddScoped<ReviewService>();
            builder.Services.AddScoped<FavoriteService>();
            builder.Services.AddScoped<CartService>();
            builder.Services.AddScoped<VendorPermissionService>();

            // ⭐ خدمة التخزين المؤقت (Memory Cache)
            builder.Services.AddMemoryCache();

            // -------------------------------
            // CORS
            // -------------------------------
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(p =>
                    p.AllowAnyHeader()
                     .AllowAnyMethod()
                     .AllowCredentials()
                     .SetIsOriginAllowed(_ => true));
            });

            // -------------------------------
            // SignalR
            // -------------------------------
            builder.Services.AddSignalR();

            // -------------------------------
            // JWT Authentication
            // -------------------------------
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                    };
                });

            var app = builder.Build();

            // -------------------------------
            // تطبيق Migrations و Seed Database
            // -------------------------------
            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                // إعادة إنشاء قاعدة البيانات وتطبيق Migration
                dbContext.Database.Migrate();

                // ========== بذور بيانات مشفرة بـ BCrypt ==========
                if (!dbContext.Users.Any(u => u.Role == "Admin"))
                {
                    dbContext.Users.Add(new User
                    {
                        FullName = "System Admin",
                        Email = "eid@gmail.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("eid345"),
                        Role = "Admin",
                        IsApproved = true,
                        CreatedAt = DateTime.UtcNow
                    });
                }

                if (!dbContext.Users.Any(u => u.Email == "vendor@storehub.com"))
                {
                    dbContext.Users.Add(new User
                    {
                        FullName = "Demo Vendor",
                        Email = "vendor@storehub.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Vendor@1234"),
                        Role = "Vendor",
                        IsApproved = true,
                        CreatedAt = DateTime.UtcNow
                    });
                }

                if (!dbContext.Users.Any(u => u.Email == "customer@storehub.com"))
                {
                    dbContext.Users.Add(new User
                    {
                        FullName = "Demo Customer",
                        Email = "customer@storehub.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer@1234"),
                        Role = "Customer",
                        IsApproved = true,
                        CreatedAt = DateTime.UtcNow
                    });
                }

                if (!dbContext.Categories.Any())
                {
                    dbContext.Categories.AddRange(
                        new Category { Name = "Laptops" },
                        new Category { Name = "Mobile Phones" },
                        new Category { Name = "Headphones" },
                        new Category { Name = "Storage Devices" },
                        new Category { Name = "Smartwatches" },
                        new Category { Name = "Tablets" }
                    );
                }

                dbContext.SaveChanges();
            }

            // -------------------------------
            // Middleware
            // -------------------------------
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.MapHub<NotificationHub>("/notificationHub");

            app.Run();
        }
    }
}