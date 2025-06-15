namespace HumanResources.Endpoints.Features.Users;

public static class UserEndpoints
{
    public static RouteGroupBuilder MapUserEndpoints(this RouteGroupBuilder group)
    {
        // POST endpoint to add a user, passing email address, and first and last names
        group.MapPost("", async (/*User user, IUserService userService*/) =>
        {
            // var result = await userService.AddUserAsync(user);
            // return result;

            await Task.Delay(1000);
            return TypedResults.Created();
        });

        group.MapPut("", async (/*User user, IUserService userService*/) =>
        {
            // var result = await userService.AddUserAsync(user);
            // return result;

            await Task.Delay(1000);
            return TypedResults.Ok();
        });
        
        group.MapDelete("api/users", async (Guid userId) =>
        {
            // var result = await userService.AddUserAsync(user);
            // return result;

            await Task.Delay(1000);
            return TypedResults.NoContent();
        });
        
        return group;
    }
}
