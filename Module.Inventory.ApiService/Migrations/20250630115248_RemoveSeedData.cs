using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Module.Inventory.ApiService.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "inventory_items",
                keyColumn: "id",
                keyValue: new Guid("54c4e784-f971-44f9-8875-c5e8c33cc7bd"));

            migrationBuilder.DeleteData(
                table: "inventory_items",
                keyColumn: "id",
                keyValue: new Guid("e5ec007c-4a75-42cc-83d0-06b05599028e"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "inventory_items",
                columns: new[] { "id", "name", "quantity" },
                values: new object[,]
                {
                    { new Guid("54c4e784-f971-44f9-8875-c5e8c33cc7bd"), "Initial Item 2", 5 },
                    { new Guid("e5ec007c-4a75-42cc-83d0-06b05599028e"), "Initial Item 1", 10 }
                });
        }
    }
}
