using Microsoft.EntityFrameworkCore;

namespace Module.Inventory.ApiModel;

public class InventoryDbContext(DbContextOptions<InventoryDbContext> options) : DbContext(options)
{
    public DbSet<Item> InventoryItems { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Item>(entity =>
        {
            entity.ToTable("inventory_items");
            
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();
            
            entity.Property(e => e.Name)
                .HasColumnName("name")
                .HasMaxLength(255)
                .IsRequired();
            
            entity.Property(e => e.Quantity)
                .HasColumnName("quantity")
                .IsRequired();

            entity.HasIndex(e => e.Name)
                .HasDatabaseName("idx_inventory_items_name");
        });

        // Seed data can be added programmatically in the migration service if needed
    }
}