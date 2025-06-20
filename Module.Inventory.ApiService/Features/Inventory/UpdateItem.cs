using Module.Inventory.ApiService.Endpoints;

namespace Module.Inventory.ApiService.Features.Inventory;

public static class UpdateItem
{
    public record Request(string Name, int Quantity);
    public record Response(Guid Id, string Name, int Quantity);

    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapPut("api/inventory/{id:guid}", Handler).WithTags("Inventory");
        }
    }

    public static async Task<IResult> Handler(Guid id, Request request, CancellationToken cancellationToken)
    {
        await Task.Delay(1000, cancellationToken);

        var item = Inventory.Instance.Find(i => i.Id == id);
        if (item is null)
        {
            return Results.NotFound();
        }

        item.Name = request.Name;
        item.Quantity = request.Quantity;

        return Results.Ok(new Response(item.Id, item.Name, item.Quantity));
    }
}
