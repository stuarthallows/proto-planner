namespace Module.Inventory.ApiService.Features.Inventory;

public class Item
{
    public Guid Id { get; init; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public static class Inventory
{
    public static readonly List<Item> Instance =
    [
        new() { Id = Guid.NewGuid(), Name = "Item1", Quantity = 10 },
        new() { Id = Guid.NewGuid(), Name = "Item2", Quantity = 5 }
    ];
}
