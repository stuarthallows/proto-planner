using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Module.Inventory.ApiService.Data;
using Module.Inventory.ApiService.Features.Inventory;
using OpenTelemetry.Trace;

namespace Module.Inventory.MigrationService;

public class InventoryDbInitializer(
    IServiceProvider serviceProvider,
    IHostEnvironment hostEnvironment,
    IHostApplicationLifetime hostApplicationLifetime) : BackgroundService
{
    private readonly ActivitySource _activitySource = new(hostEnvironment.ApplicationName);

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        using var activity = _activitySource.StartActivity(hostEnvironment.ApplicationName, ActivityKind.Client);

        try
        {
            using var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<InventoryDbContext>();

            await EnsureDatabaseAsync(dbContext, cancellationToken);
            //await RunMigrationAsync(dbContext, cancellationToken);
            await SeedDataAsync(dbContext, cancellationToken);
        }
        catch (Exception ex)
        {
            activity?.AddException(ex);
            throw;
        }

        hostApplicationLifetime.StopApplication();
    }

    private static async Task EnsureDatabaseAsync(InventoryDbContext dbContext, CancellationToken cancellationToken)
    {
        var dbCreator = dbContext.GetService<IRelationalDatabaseCreator>();

        var strategy = dbContext.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            // Create the database if it does not exist
            if (!await dbCreator.ExistsAsync(cancellationToken))
            {
                await dbCreator.CreateAsync(cancellationToken);
            }
        });
    }

    private static async Task RunMigrationAsync(InventoryDbContext dbContext, CancellationToken cancellationToken)
    {
        var strategy = dbContext.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            await dbContext.Database.MigrateAsync(cancellationToken);
        });
    }

    private static async Task SeedDataAsync(InventoryDbContext dbContext, CancellationToken cancellationToken)
    {
        // Check if there are any existing items
        var hasData = await dbContext.InventoryItems.AnyAsync(cancellationToken);
        
        if (!hasData)
        {
            var seedItems = new[]
            {
                new Item { Id = Guid.NewGuid(), Name = "Initial Item 1", Quantity = 10 },
                new Item { Id = Guid.NewGuid(), Name = "Initial Item 2", Quantity = 5 }
            };

            dbContext.InventoryItems.AddRange(seedItems);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
