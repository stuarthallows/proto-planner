namespace HumanResources.Endpoints.Features.Users;

public static class GetUsersEndpoint
{
    // create a users db context
    // create a UsersRepository ??
    // 
    
    // public static IEnumerable<User> GetUsers()
    // {
    // }
    
    public static RouteGroupBuilder MapGetUsers(this RouteGroupBuilder group)
    {
        group.MapGet("", async () =>
        {
            // var result = await userService.AddUserAsync(user);
            // return result;

            await Task.Delay(1000);
            return TypedResults.Created();
        });

        return group;
    }
}
