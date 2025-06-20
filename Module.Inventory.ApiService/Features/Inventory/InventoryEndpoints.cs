namespace Module.Inventory.ApiService.Features.Inventory;

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