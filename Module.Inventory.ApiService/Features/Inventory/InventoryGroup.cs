using FastEndpoints;

namespace Module.Inventory.ApiService.Features.Inventory;

public class InventoryGroup : Group
{
    public InventoryGroup()
    {
        Configure("api/inventory", ep => 
        {
            ep.Description(builder => builder
              .WithTags("Inventory")
              .AllowAnonymous());
        });
    }
}