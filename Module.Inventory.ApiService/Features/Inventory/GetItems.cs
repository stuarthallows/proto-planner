using FastEndpoints;

namespace Module.Inventory.ApiService.Features.Inventory;

public class GetItemsResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class GetItemsEndpoint : EndpointWithoutRequest<List<GetItemsResponse>>
{
    public override void Configure()
    {
        Get("");
        Group<InventoryGroup>();
        Summary(s =>
        {
            s.Description = "Retrieve all inventory items.";
            s.Summary = "Get all inventory items.";
        });
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        await Task.Delay(1000, ct);
        var items = Inventory.Instance.Select(item => new GetItemsResponse
        {
            Id = item.Id,
            Name = item.Name,
            Quantity = item.Quantity
        }).ToList();
        await SendAsync(items, cancellation: ct);
    }
}

