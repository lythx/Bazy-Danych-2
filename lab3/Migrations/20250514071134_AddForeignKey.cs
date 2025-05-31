using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace entity_framework_wyklad.Migrations
{
    /// <inheritdoc />
    public partial class AddForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IsSuppliedBy",
                table: "Products",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_IsSuppliedBy",
                table: "Products",
                column: "IsSuppliedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Suppliers_IsSuppliedBy",
                table: "Products",
                column: "IsSuppliedBy",
                principalTable: "Suppliers",
                principalColumn: "SupplierID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Suppliers_IsSuppliedBy",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_IsSuppliedBy",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IsSuppliedBy",
                table: "Products");
        }
    }
}
