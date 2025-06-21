using FastEndpoints;

namespace Module.Inventory.ApiService.Features.Inventory;

public class InventoryGroup : Group
{
    public InventoryGroup()
    {
        Configure("inventory", ep => 
        {
            ep.Description(builder => builder
              .WithTags("Inventory")
              .AllowAnonymous());
        });
    }
}