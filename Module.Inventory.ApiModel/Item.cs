namespace Module.Inventory.ApiModel;

public class Item
{
    public Guid Id { get; init; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
}