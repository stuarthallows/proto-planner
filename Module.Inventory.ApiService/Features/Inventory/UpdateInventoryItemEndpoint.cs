namespace Module.Inventory.ApiService.Features.Inventory;

public class UpdateInventoryItemHandler
{
    public async Task<IResult> HandleAsync(int id, Item updatedItem, CancellationToken cancellationToken)
    {
        await Task.Delay(1000, cancellationToken);

        var item = Inventory.Instance.Find(i => i.Id == id);
        if (item is null)
        {
            return Results.NotFound();
        }

        item.Name = updatedItem.Name;
        item.Quantity = updatedItem.Quantity;
        return Results.Ok(item);
    }
}

public static class UpdateInventoryItemEndpoint
{
    public static RouteGroupBuilder MapUpdateInventoryItem(this RouteGroupBuilder group)
    {
        group.MapPut("{id:int}", async (int id, Item updatedItem, UpdateInventoryItemHandler handler, CancellationToken cancellationToken) =>
        {
            return await handler.HandleAsync(id, updatedItem, cancellationToken);
        });

        return group;
    }
}

