namespace Module.Sales.ApiService;

public static class OrderEndpoints
{
    private static readonly List<Order> Orders =
    [
        new(Guid.Parse("a1b2c3d4-e5f6-7890-abcd-123456789012"),
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-2)), 10, "Frame", "Pending"),
        new(Guid.Parse("f8e7d6c5-b4a3-9182-7365-fedcba987654"),
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1)), 25, "Bolt", "Completed"),
        new(Guid.Parse("12345678-90ab-cdef-1234-567890abcdef"), DateOnly.FromDateTime(DateTime.UtcNow), 15,
            "Screw", "Processing")
    ];

    public static void MapOrderEndpoints(this IEndpointRouteBuilder routes)
    {
        // GET /orders - Get all orders
        routes.MapGet("/orders", () => Results.Ok(Orders))
            .WithName("GetAllOrders");

        // GET /orders/{id} - Get order by ID
        routes.MapGet("/orders/{id:guid}", (Guid id) =>
            {
                var order = Orders.FirstOrDefault(o => o.Id == id);
                return order is not null ? Results.Ok(order) : Results.NotFound();
            })
            .WithName("GetOrderById");

        // POST /orders - Create new order
        routes.MapPost("/orders", (CreateOrderRequest request) =>
            {
                var order = new Order(Guid.NewGuid(), DateOnly.FromDateTime(DateTime.UtcNow), 
                    request.Count, request.Description, request.Status ?? "Pending");
                Orders.Add(order);
                return Results.Created($"/orders/{order.Id}", order);
            })
            .WithName("CreateOrder");

        // PUT /orders/{id} - Update existing order
        routes.MapPut("/orders/{id:guid}", (Guid id, UpdateOrderRequest request) =>
            {
                var existingOrder = Orders.FirstOrDefault(o => o.Id == id);
                if (existingOrder is null)
                    return Results.NotFound();

                var updatedOrder = existingOrder with
                {
                    Count = request.Count ?? existingOrder.Count,
                    Description = request.Description ?? existingOrder.Description,
                    Status = request.Status ?? existingOrder.Status
                };

                var index = Orders.IndexOf(existingOrder);
                Orders[index] = updatedOrder;
                
                return Results.Ok(updatedOrder);
            })
            .WithName("UpdateOrder");

        // DELETE /orders/{id} - Delete order
        routes.MapDelete("/orders/{id:guid}", (Guid id) =>
            {
                var order = Orders.FirstOrDefault(o => o.Id == id);
                if (order is null)
                    return Results.NotFound();

                Orders.Remove(order);
                return Results.NoContent();
            })
            .WithName("DeleteOrder");
    }
}

public record Order(Guid Id, DateOnly Date, int Count, string Description, string Status);

public record CreateOrderRequest(int Count, string Description, string? Status = null);

public record UpdateOrderRequest(int? Count = null, string? Description = null, string? Status = null);
