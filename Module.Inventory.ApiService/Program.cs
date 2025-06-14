using Module.Inventory.ApiService;
using NSwag;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddProblemDetails();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(options => {
    options.PostProcess = document =>
    {
        document.Info = new OpenApiInfo
        {
            Version = "v1",
            Title = "Inventory API",
            Description = "An ASP.NET Core Web API for managing inventory operations"
        };
    };
});

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi();
}

app.MapDefaultEndpoints();

app.MapGroup("api/inventory")
   // .WithGroupName("Inventory Group API")
    .MapInventoryEndpoints();

app.Run();
