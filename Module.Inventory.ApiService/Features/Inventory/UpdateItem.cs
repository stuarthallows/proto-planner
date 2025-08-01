using FastEndpoints;
using Module.Inventory.ApiModel;
using Module.Inventory.ApiService.Services;

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

public class UpdateItemEndpoint(IInventoryRepository repository) : Endpoint<UpdateItemRequest, UpdateItemResponse>
{
    public override void Configure()
    {
        AllowAnonymous();
        Put("{id:guid}");
        Group<InventoryGroup>();
        Summary(s =>
        {
            s.Summary = "Update an inventory item.";
        });
    }

    public override async Task HandleAsync(UpdateItemRequest req, CancellationToken ct)
    {
        var item = new Item
        {
            Id = req.Id,
            Name = req.Name,
            Quantity = req.Quantity
        };

        var updatedItem = await repository.UpdateItemAsync(req.Id, item, ct);
        if (updatedItem is null)
        {
            await Send.NotFoundAsync(ct);
            return;
        }
        var response = new UpdateItemResponse { Id = updatedItem.Id, Name = updatedItem.Name, Quantity = updatedItem.Quantity };
        await Send.OkAsync(response, ct);
    }
}
