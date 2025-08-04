using FastEndpoints;
using Module.Inventory.ApiService.Services;

namespace Module.Inventory.ApiService.Features.Inventory;

public class DeleteItemEndpoint(IInventoryRepository repository) : EndpointWithoutRequest
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

    public override async Task HandleAsync(CancellationToken ct)
    {
        var itemId = Route<Guid>("id");
        var deleted = await repository.DeleteItemAsync(itemId, ct);
        
        if (!deleted)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        await Send.NoContentAsync(ct);
    }
}