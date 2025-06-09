namespace ProtoPlanner.Web;

public class OrdersApiClient(HttpClient httpClient)
{
    public async Task<Order[]> GetOrdersAsync(int maxItems = 10, CancellationToken cancellationToken = default)
    {
        List<Order>? orders = null;

        await foreach (var order in httpClient.GetFromJsonAsAsyncEnumerable<Order>("/orders", cancellationToken))
        {
            if (orders?.Count >= maxItems)
            {
                break;
            }
            if (order is not null)
            {
                orders ??= [];
                orders.Add(order);
            }
        }

        return orders?.ToArray() ?? [];
    }
}

public record Order(DateOnly Date, int Count, string Description);
