using HumanResources.Endpoints;
using Sales.Endpoints;

var builder = WebApplication.CreateBuilder(args);
 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(options =>
{
    options.Title = "ProtoPlanner";
});

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddProblemDetails();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi();
}

app.MapUserEndpoints();
app.MapOrderEndpoints();

app.MapDefaultEndpoints();

app.Run();
