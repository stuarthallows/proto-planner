using Module.Inventory.ApiService.Endpoints;

namespace Module.Inventory.ApiService.Features.Inventory;

public static class AddItem
{
    public record Request(Guid Id, string Name, int Quantity);
    public record Response(Guid Id, string Name, int Quantity);

    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapPost("api/inventory", Handler).WithTags("Inventory");
        }
    }

    public static async Task<IResult> Handler(Request request, CancellationToken cancellationToken)
    {
        await Task.Delay(1000, cancellationToken);

        var item = new Item
        {
            Id = request.Id,
            Name = request.Name,
            Quantity = request.Quantity
        };

        Inventory.Instance.Add(item);

        var response = new Response(item.Id, item.Name, item.Quantity);
        return Results.Created($"api/inventory/{response.Id}", response);
    }
}
