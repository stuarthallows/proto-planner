namespace HumanResources.Endpoints;

public static class UserEndpoints
{
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
