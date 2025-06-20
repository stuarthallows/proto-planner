namespace Module.Inventory.ApiService.Features.Inventory;

public class AddInventoryItemHandler
{
    public async Task<IResult> HandleAsync(Item item, CancellationToken cancellationToken)
    {
        await Task.Delay(1000, cancellationToken);

        Inventory.Instance.Add(item);
        return Results.Created($"api/inventory/{item.Id}", item);
    }
}

public static class AddInventoryItemEndpoint
{
    public static RouteGroupBuilder MapAddInventoryItem(this RouteGroupBuilder group)
    {
        group.MapPost("", async (Item newItem, AddInventoryItemHandler handler, CancellationToken cancellationToken) =>
        {
            return await handler.HandleAsync(newItem, cancellationToken);
        });

        return group;
    }
}
