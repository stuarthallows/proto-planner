using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

namespace HumanResources.Endpoints;

public static class UserEndpoints
{
    // For this to work add a framework reference to Microsoft.AspNetCore.App.
    // See https://learn.microsoft.com/en-us/aspnet/core/fundamentals/target-aspnetcore?view=aspnetcore-3.1&tabs=visual-studio#use-the-aspnet-core-shared-framework
    
    public static void MapUserEndpoints(this IEndpointRouteBuilder routes)
    {
        string[] summaries = ["Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"];

        routes.MapGet("/hr-weatherforecast", () =>
            {
                var forecast = Enumerable.Range(1, 5).Select(index =>
                        new WeatherForecast
                        (
                            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                            Random.Shared.Next(-20, 55),
                            summaries[Random.Shared.Next(summaries.Length)]
                        ))
                    .ToArray();
                return forecast;
            })
        .WithName("GetHRWeatherForecast");
    }
}

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
