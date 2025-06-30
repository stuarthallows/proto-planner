using Microsoft.EntityFrameworkCore;
using Module.Inventory.ApiModel;
using Module.Inventory.MigrationService;

var builder = Host.CreateApplicationBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddHostedService<DbInitializer>();

builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing.AddSource(builder.Environment.ApplicationName));


builder.Services.AddDbContextPool<InventoryDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("inventory"), sqlOptions =>
        sqlOptions.MigrationsAssembly("Module.Inventory.MigrationService")
    ));
builder.EnrichNpgsqlDbContext<InventoryDbContext>();

var host = builder.Build();
host.Run();
