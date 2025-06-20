using FastEndpoints;

namespace Module.Inventory.ApiService.Features.Inventory;

public class UpdateItemRequest
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class UpdateItemResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class UpdateItemEndpoint : Endpoint<UpdateItemRequest, UpdateItemResponse>
{
    public override void Configure()
    {
        Put("{id:guid}");
        Group<InventoryGroup>();
        Summary(s =>
        {
            s.Summary = "Update an inventory item.";
        });
    }

    public override async Task HandleAsync(UpdateItemRequest req, CancellationToken ct)
    {
        await Task.Delay(1000, ct);
        var item = Inventory.Instance.Find(i => i.Id == req.Id);
        if (item is null)
        {
            await SendNotFoundAsync(ct);
            return;
        }
        item.Name = req.Name;
        item.Quantity = req.Quantity;
        var response = new UpdateItemResponse { Id = item.Id, Name = item.Name, Quantity = item.Quantity };
        await SendAsync(response, cancellation: ct);
    }
}
