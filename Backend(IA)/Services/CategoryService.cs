using VendorHub.API.Data;
using VendorHub.API.Models;
using Microsoft.EntityFrameworkCore;

namespace VendorHub.API.Services
{
    public class CategoryService
    {
        private readonly AppDbContext _context;

        // Constructor: inject DbContext
        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        // ==============================
        // Get All Categories
        // ==============================
        // Retrieves all categories from the database
        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        // ==============================
        // Get Category By Id
        // ==============================
        // Retrieves a single category based on its Id
        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _context.Categories
                                 .FirstOrDefaultAsync(c => c.Id == id);
        }

        // ==============================
        // Add New Category
        // ==============================
        // Creates a new category and saves it to the database
        public async Task<Category> AddCategoryAsync(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return category;
        }

        // ==============================
        // Update Existing Category
        // ==============================
        // Updates category name based on Id
        public async Task UpdateCategoryAsync(Category category)
        {
            var existingCategory = await _context.Categories
                                                 .FirstOrDefaultAsync(c => c.Id == category.Id);

            if (existingCategory is null)
                throw new Exception("Category not found");

            existingCategory.Name = category.Name;

            _context.Categories.Update(existingCategory);
            await _context.SaveChangesAsync();
        }

        // ==============================
        // Delete Category
        // ==============================
        // Deletes a category from the database using Id
        public async Task DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories
                                         .FirstOrDefaultAsync(c => c.Id == id);

            if (category is not null)
            {
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
            }
        }
    }
}