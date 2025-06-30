using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Module.Inventory.ApiService.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "inventory_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_inventory_items", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "inventory_items",
                columns: new[] { "id", "name", "quantity" },
                values: new object[,]
                {
                    { new Guid("0696465f-c6d4-45e5-b30b-8432dbb92fee"), "Initial Item 2", 5 },
                    { new Guid("5d1cd8f1-26cd-462d-a72f-5b8dd95e84ee"), "Initial Item 1", 10 }
                });

            migrationBuilder.CreateIndex(
                name: "idx_inventory_items_name",
                table: "inventory_items",
                column: "name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "inventory_items");
        }
    }
}
