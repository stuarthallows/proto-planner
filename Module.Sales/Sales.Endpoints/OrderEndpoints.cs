namespace Sales.Endpoints;

public static class OrderEndpoints
{
    public static void MapOrderEndpoints(this IEndpointRouteBuilder routes)
    {
        string[] sku = ["Frame", "Bolt", "Screw", "Nut", "Washer"];
        
        routes.MapGet("/orders", () =>
            {
                var orders = Enumerable.Range(1, 5).Select(index =>
                        new Order
                        (
                            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                            Random.Shared.Next(1, 200),
                            sku[Random.Shared.Next(sku.Length)]
                        ))
                    .ToArray();
                return orders;
            })
            .WithName("GetOrders");
    }
}

internal record Order(DateOnly Date, int Count, string Description);