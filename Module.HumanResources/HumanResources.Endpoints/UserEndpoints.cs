using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace HumanResources.Endpoints;

public static class UserEndpoints
{
    // For this to work add a framework reference to Microsoft.AspNetCore.App.
    // See https://learn.microsoft.com/en-us/aspnet/core/fundamentals/target-aspnetcore?view=aspnetcore-3.1&tabs=visual-studio#use-the-aspnet-core-shared-framework
    
    public static void MapUserEndpoints(this IEndpointRouteBuilder routes)
    {
        // POST endpoint to add a user, passing email address, and first and last names
        routes.MapPost("/hr-users", async (/*User user, IUserService userService*/) =>
        {
            // var result = await userService.AddUserAsync(user);
            // return result;

            await Task.Delay(1000);
            return TypedResults.Created();
        });

        routes.MapPut("/hr-users", async (/*User user, IUserService userService*/) =>
        {
            // var result = await userService.AddUserAsync(user);
            // return result;

            await Task.Delay(1000);
            return TypedResults.Ok();
        });
        
        routes.MapDelete("/hr-users", async (Guid userId) =>
        {
            // var result = await userService.AddUserAsync(user);
            // return result;

            await Task.Delay(1000);
            return TypedResults.NoContent();
        });
    }
}
