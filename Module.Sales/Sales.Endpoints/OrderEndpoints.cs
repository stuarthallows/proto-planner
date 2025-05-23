using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

namespace Sales.Endpoints;

public static class OrderEndpoints
{
    // For this to work add a framework reference to Microsoft.AspNetCore.App.
    // See https://learn.microsoft.com/en-us/aspnet/core/fundamentals/target-aspnetcore?view=aspnetcore-3.1&tabs=visual-studio#use-the-aspnet-core-shared-framework
    
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