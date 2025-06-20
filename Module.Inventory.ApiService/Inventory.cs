namespace Module.Inventory.ApiService;

public class Item
{
    public int Id { get; init; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public static class Inventory
{
    public static readonly List<Item> Instance =
    [
        new() { Id = 1, Name = "Item1", Quantity = 10 },
        new() { Id = 2, Name = "Item2", Quantity = 5 }
    ];
}
