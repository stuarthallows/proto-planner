using FastEndpoints;
using FluentValidation;
using Module.Inventory.ApiModel;
using Module.Inventory.ApiService.Services;

namespace Module.Inventory.ApiService.Features.Inventory;

public class AddItemEndpoint(IInventoryRepository repository) : Endpoint<AddItemEndpoint.AddItemRequest, AddItemEndpoint.AddItemResponse>
{
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

    public class AddItemRequestValidator : Validator<AddItemRequest>
    {
        public AddItemRequestValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Id is required.");
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(x => x.Quantity).GreaterThanOrEqualTo(0).WithMessage("Quantity must be zero or greater.");
        }
    }

    public override void Configure()
    {
        Post(string.Empty);
        Group<InventoryGroup>();
        Summary(s =>
        {
            s.Summary = "Add a new inventory item.";
        });
        AllowAnonymous();
    }

    public override async Task HandleAsync(AddItemRequest req, CancellationToken ct)
    {
        var item = new Item
        {
            Id = req.Id,
            Name = req.Name,
            Quantity = req.Quantity
        };

        var addedItem = await repository.AddItemAsync(item, ct);

        var response = new AddItemResponse { Id = addedItem.Id, Name = addedItem.Name, Quantity = addedItem.Quantity };
        await SendAsync(response, 201, cancellation: ct);
    }
}
