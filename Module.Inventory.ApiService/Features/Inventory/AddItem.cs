using FastEndpoints;

namespace Module.Inventory.ApiService.Features.Inventory;

public class AddItemRequest
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class AddItemResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class AddItemEndpoint : Endpoint<AddItemRequest, AddItemResponse>
{
    public override void Configure()
    {
        Post("");
        Group<InventoryGroup>();
        Summary(s =>{
            s.Summary = "Add a new inventory item.";
        });
    }

    public override async Task HandleAsync(AddItemRequest req, CancellationToken ct)
    {
        await Task.Delay(1000, ct);

        var item = new Item
        {
            Id = req.Id,
            Name = req.Name,
            Quantity = req.Quantity
        };

        Inventory.Instance.Add(item);

        var response = new AddItemResponse { Id = item.Id, Name = item.Name, Quantity = item.Quantity };
        await SendAsync(response, 201, cancellation: ct);
    }
}
