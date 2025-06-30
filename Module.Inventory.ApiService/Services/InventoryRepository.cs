using Microsoft.EntityFrameworkCore;
using Module.Inventory.ApiModel;

namespace Module.Inventory.ApiService.Services;

public interface IInventoryRepository
{
    Task<List<Item>> GetAllItemsAsync(CancellationToken cancellationToken = default);
    Task<Item?> GetItemByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Item> AddItemAsync(Item item, CancellationToken cancellationToken = default);
    Task<Item?> UpdateItemAsync(Guid id, Item item, CancellationToken cancellationToken = default);
    Task<bool> DeleteItemAsync(Guid id, CancellationToken cancellationToken = default);
}

public class InventoryRepository(InventoryDbContext context, ILogger<InventoryRepository> logger) : IInventoryRepository
{
    public async Task<List<Item>> GetAllItemsAsync(CancellationToken cancellationToken = default)
    {
        var items = await context.InventoryItems
            .OrderBy(i => i.Name)
            .ToListAsync(cancellationToken);
        
        logger.LogInformation("Retrieved {Count} items from database", items.Count);
        return items;
    }

    public async Task<Item?> GetItemByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await context.InventoryItems
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
    }

    public async Task<Item> AddItemAsync(Item item, CancellationToken cancellationToken = default)
    {
        context.InventoryItems.Add(item);
        await context.SaveChangesAsync(cancellationToken);
        
        logger.LogInformation("Added item {ItemId} - {ItemName}", item.Id, item.Name);
        return item;
    }

    public async Task<Item?> UpdateItemAsync(Guid id, Item item, CancellationToken cancellationToken = default)
    {
        var existingItem = await context.InventoryItems
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
        
        if (existingItem == null)
            return null;
        
        existingItem.Name = item.Name;
        existingItem.Quantity = item.Quantity;
        
        await context.SaveChangesAsync(cancellationToken);
        
        logger.LogInformation("Updated item {ItemId} - {ItemName}", existingItem.Id, existingItem.Name);
        return existingItem;
    }

    public async Task<bool> DeleteItemAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var item = await context.InventoryItems
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
        
        if (item == null)
            return false;
        
        context.InventoryItems.Remove(item);
        await context.SaveChangesAsync(cancellationToken);
        
        logger.LogInformation("Deleted item {ItemId}", id);
        return true;
    }
}