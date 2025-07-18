using FastEndpoints;
using FastEndpoints.Swagger;
using Module.Inventory.ApiModel;
using Module.Inventory.ApiService.Services;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.AddNpgsqlDbContext<InventoryDbContext>("inventory");

builder.Services
    .AddFastEndpoints()
    .SwaggerDocument(o =>
    {
        o.DocumentSettings = s =>
        {
            s.Title = "Inventory API";
            s.Description = "An ASP.NET Core Web API for managing inventory operations";
            s.Version = "v1";
        };
    });
builder.Services.AddProblemDetails();
builder.Services.AddScoped<IInventoryRepository, InventoryRepository>();

var app = builder.Build();

app.UseExceptionHandler();
app.UseFastEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerGen();
}

app.MapDefaultEndpoints();

app.Run();
