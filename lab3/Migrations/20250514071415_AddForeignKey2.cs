using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace entity_framework_wyklad.Migrations
{
    /// <inheritdoc />
    public partial class AddForeignKey2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Suppliers_IsSuppliedBy",
                table: "Products");

            migrationBuilder.AlterColumn<int>(
                name: "IsSuppliedBy",
                table: "Products",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Suppliers_IsSuppliedBy",
                table: "Products",
                column: "IsSuppliedBy",
                principalTable: "Suppliers",
                principalColumn: "SupplierID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Suppliers_IsSuppliedBy",
                table: "Products");

            migrationBuilder.AlterColumn<int>(
                name: "IsSuppliedBy",
                table: "Products",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Suppliers_IsSuppliedBy",
                table: "Products",
                column: "IsSuppliedBy",
                principalTable: "Suppliers",
                principalColumn: "SupplierID");
        }
    }
}
