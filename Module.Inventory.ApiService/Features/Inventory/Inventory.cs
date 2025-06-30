using Module.Inventory.ApiModel;

namespace Module.Inventory.ApiService.Features.Inventory;

public static class Inventory
{
    public static readonly List<Item> Instance =
    [
        new() { Id = Guid.NewGuid(), Name = "Item1", Quantity = 10 },
        new() { Id = Guid.NewGuid(), Name = "Item2", Quantity = 5 }
    ];
}
