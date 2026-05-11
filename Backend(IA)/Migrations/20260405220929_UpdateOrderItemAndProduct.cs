using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VendorHub.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOrderItemAndProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProductTitle",
                table: "OrderItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductTitle",
                table: "OrderItems");
        }
    }
}
