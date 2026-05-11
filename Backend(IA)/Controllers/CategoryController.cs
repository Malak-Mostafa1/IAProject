using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VendorHub.API.Models;
using VendorHub.API.Services;
using VendorHub.API.DTOs;

namespace VendorHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _categoryService;

        public CategoryController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET: api/category
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();

            var categoryDtos = categories.Select(c => new CategoryDTO
            {
                Id = c.Id,
                Name = c.Name
            }).ToList();

            return Ok(categoryDtos);
        }

        // GET: api/category/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);

            if (category is null) return NotFound();

            var categoryDto = new CategoryDTO
            {
                Id = category.Id,
                Name = category.Name
            };

            return Ok(categoryDto);
        }

        // 🔥 ADMIN ONLY
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CategoryDTO? categoryDto)
        {
            if (categoryDto is null) return BadRequest();

            var category = new Category
            {
                Name = categoryDto.Name
            };

            var result = await _categoryService.AddCategoryAsync(category);

            var resultDto = new CategoryDTO
            {
                Id = result.Id,
                Name = result.Name
            };

            return Ok(resultDto);
        }

        // 🔥 ADMIN ONLY
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] CategoryDTO? categoryDto)
        {
            if (categoryDto is null) return BadRequest();

            var category = new Category
            {
                Id = categoryDto.Id,
                Name = categoryDto.Name
            };

            await _categoryService.UpdateCategoryAsync(category);

            return Ok(categoryDto);
        }

        // 🔥 ADMIN ONLY
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _categoryService.DeleteCategoryAsync(id);
            return Ok();
        }
    }
}