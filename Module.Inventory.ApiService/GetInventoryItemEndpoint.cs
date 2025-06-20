namespace Module.Inventory.ApiService;

public class GetInventoryItemHandler
{
    public async Task<IResult> HandleAsync(int id, CancellationToken cancellationToken)
    {
        await Task.Delay(1000, cancellationToken);

        var item = Inventory.Instance.Find(i => i.Id == id);
        return item is not null ? Results.Ok(item) : Results.NotFound();
    }
}

public static class GetInventoryItemEndpoint
{
    public static RouteGroupBuilder MapGetInventoryItem(this RouteGroupBuilder group)
    {
        group.MapGet("{id:int}", async (int id, GetInventoryItemHandler handler, CancellationToken cancellationToken) =>
        {
            return await handler.HandleAsync(id, cancellationToken);
        });

        return group;
    }
}
