namespace Sales.Application.Orders.Create;

public class CreateOrderCommandHandler
{
    public async Task Handle(CreateOrderCommand command, CancellationToken cancellationToken = default)
    {
        // Logic to handle the command
        // For example, create an order in the database
        await Task.CompletedTask;
    }
}

public class CreateOrderCommand
{
}