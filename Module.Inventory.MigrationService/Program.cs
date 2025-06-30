using Module.Inventory.ApiService.Data;
using Module.Inventory.MigrationService;

var builder = Host.CreateApplicationBuilder(args);

builder.AddServiceDefaults();
builder.AddNpgsqlDbContext<InventoryDbContext>("inventory");

builder.Services.AddHostedService<InventoryDbInitializer>();
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing.AddSource(builder.Environment.ApplicationName));

var host = builder.Build();
host.Run();
