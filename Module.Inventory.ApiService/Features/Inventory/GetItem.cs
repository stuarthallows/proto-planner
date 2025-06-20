using Module.Inventory.ApiService.Endpoints;

namespace Module.Inventory.ApiService.Features.Inventory;

public static class GetItem
{
    public record Response(Guid Id, string Name, int Quantity);

    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapGet("api/inventory/{id:guid}", Handler).WithTags("Inventory");
        }
    }

    public static async Task<IResult> Handler(Guid id, CancellationToken cancellationToken)
    {
        await Task.Delay(1000, cancellationToken);

        var item = Inventory.Instance.Find(i => i.Id == id);
        return item is not null ? Results.Ok(new Response(item.Id, item.Name, item.Quantity)) : Results.NotFound();
    }
}
