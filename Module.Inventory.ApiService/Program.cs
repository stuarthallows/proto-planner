using FastEndpoints;
using FastEndpoints.Swagger;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

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

var app = builder.Build();

app.UseExceptionHandler();
app.UseFastEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerGen();
}

app.MapDefaultEndpoints();

app.Run();
