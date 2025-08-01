using FastEndpoints;
using Module.Inventory.ApiModel;
using Module.Inventory.ApiService.Services;

namespace Module.Inventory.ApiService.Features.Inventory;

public class GetItemsResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class GetItemsMapper : ResponseMapper<GetItemsResponse, Item>
{
    public override GetItemsResponse FromEntity(Item entity)
    {
        return new GetItemsResponse
        {
            Id = entity.Id,
            Name = entity.Name,
            Quantity = entity.Quantity
        };
    }
}

public class GetItemsEndpoint(IInventoryRepository repository, ILogger<GetItemsEndpoint> logger) : EndpointWithoutRequest<List<GetItemsResponse>, GetItemsMapper>
{
    public override void Configure()
    {
        AllowAnonymous();
        Get(string.Empty);
        Group<InventoryGroup>();
        Summary(s =>
        {
            s.Summary = "Get all inventory items.";
            s.Description = "Retrieve all inventory items.";
        });
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var items = await repository.GetAllItemsAsync(ct);

        logger.LogInformation("Retrieved {Count} items from inventory.", items.Count);

        var responses = items.Select(Map.FromEntity).ToList();

        await Send.OkAsync(responses, ct);
    }
}
