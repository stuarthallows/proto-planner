namespace Module.Inventory.ApiService;

public class Item
{
    public int Id { get; init; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public static class InventoryEndpoints
{
    private static readonly List<Item> Inventory =
    [
        new() { Id = 1, Name = "Item1", Quantity = 10 },
        new() { Id = 2, Name = "Item2", Quantity = 5 }
    ];
    
    public static RouteGroupBuilder MapInventoryEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("", () => Inventory);

        group.MapGet("{id:int}", (int id) =>
        {
            var item = Inventory.Find(i => i.Id == id);
            return item is not null ? Results.Ok(item) : Results.NotFound();
        });

        group.MapPost("", (Item newItem) =>
        {
            Inventory.Add(newItem);
            return Results.Created($"api/inventory/{newItem.Id}", newItem);
        });

        group.MapPut("/{id:int}", (int id, Item updatedItem) =>
        {
            var item = Inventory.Find(i => i.Id == id);
            if (item is null)
            {
                return Results.NotFound();
            }

            item.Name = updatedItem.Name;
            item.Quantity = updatedItem.Quantity;
            return Results.Ok(item);
        }).WithName("Name of the Put Endpoint")
        .WithDescription("This endpoint updates an existing item in the inventory.")
        .WithSummary("Update Inventory Item");

        group.MapDelete("/{id:int}", (int id) =>
        {
            var item = Inventory.Find(i => i.Id == id);
            if (item is null)
            {
                return Results.NotFound();
            }

            Inventory.Remove(item);
            return Results.NoContent();
        });
        
        return group;
    }
}