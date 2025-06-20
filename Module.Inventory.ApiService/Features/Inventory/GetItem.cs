using FastEndpoints;

namespace Module.Inventory.ApiService.Features.Inventory;

public class GetItemResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class GetItemEndpoint : EndpointWithoutRequest<GetItemResponse>
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
        await Task.Delay(1000, ct);

        var itemId = Route<Guid>("id");
        var item = Inventory.Instance.Find(i => i.Id == itemId);
        if (item is null)
        {
            await SendNotFoundAsync(ct);
            return;
        }
        var response = new GetItemResponse { Id = item.Id, Name = item.Name, Quantity = item.Quantity };
        await SendAsync(response, cancellation: ct);
    }
}
