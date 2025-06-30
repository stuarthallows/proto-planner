using FastEndpoints;
using Module.Inventory.ApiService.Services;

namespace Module.Inventory.ApiService.Features.Inventory;

public class GetItemResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class GetItemEndpoint(IInventoryRepository repository) : EndpointWithoutRequest<GetItemResponse>
{
    public override void Configure()
    {
        Get("items/{id:guid}");
        Group<InventoryGroup>();
        Summary(s =>
        {
            s.Summary = "Get a single inventory item by ID.";
        });
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var itemId = Route<Guid>("id");
        var item = await repository.GetItemByIdAsync(itemId, ct);
        if (item is null)
        {
            await SendNotFoundAsync(ct);
            return;
        }
        var response = new GetItemResponse { Id = item.Id, Name = item.Name, Quantity = item.Quantity };
        await SendAsync(response, cancellation: ct);
    }
}
