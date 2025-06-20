namespace Module.Inventory.ApiService;

public class GetInventoryHandler
{
    public async Task<IResult> HandleAsync(CancellationToken cancellationToken)
    {
        await Task.Delay(1000, cancellationToken);
        
        return Results.Ok(Inventory.Instance);
    }
}

public static class GetInventoryEndpoint
{
    public static RouteGroupBuilder MapGetInventory(this RouteGroupBuilder group)
    {
        group.MapGet("", async (GetInventoryHandler handler, CancellationToken cancellationToken) =>
        {
            return await handler.HandleAsync(cancellationToken);
        });

        return group;
    }
}
