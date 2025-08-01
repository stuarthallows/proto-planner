using FastEndpoints;
using Module.Inventory.ApiService.Services;

namespace Module.Inventory.ApiService.Features.Inventory;

public class DeleteItemRequest
{
    public Guid Id { get; set; }
}

public class DeleteItemEndpoint(IInventoryRepository repository) : Endpoint<DeleteItemRequest>
{
    public override void Configure()
    {
        AllowAnonymous();
        Delete("{id:guid}");
        Group<InventoryGroup>();
        Summary(s =>
        {
            s.Summary = "Delete an inventory item.";
        });
    }

    public override async Task HandleAsync(DeleteItemRequest req, CancellationToken ct)
    {
        var deleted = await repository.DeleteItemAsync(req.Id, ct);
        
        if (!deleted)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        await Send.NoContentAsync(ct);
    }
}