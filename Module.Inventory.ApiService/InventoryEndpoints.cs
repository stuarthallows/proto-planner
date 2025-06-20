namespace Module.Inventory.ApiService;

public static class InventoryEndpoints
{   
    public static RouteGroupBuilder MapInventoryEndpoints(this RouteGroupBuilder group)
    {
        group
            // .WithGroupName("Inventory Group API")
            .MapGetInventory()
            .MapGetInventoryItem()
            .MapAddInventoryItem()
            .MapUpdateInventoryItem();

        return group;
    }
}