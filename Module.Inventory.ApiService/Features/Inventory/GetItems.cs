using Module.Inventory.ApiService.Endpoints;

namespace Module.Inventory.ApiService.Features.Inventory;

public static class GetItems
{
    public record Response(Guid Id, string Name, int Quantity);

    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapGet("api/inventory", Handler).WithTags("Inventory");
        }
    }

    public static async Task<IResult> Handler(CancellationToken cancellationToken)
    {
        await Task.Delay(1000, cancellationToken);

        return Results.Ok(Inventory.Instance.Select(item => new Response(item.Id, item.Name, item.Quantity)));
    }
}

