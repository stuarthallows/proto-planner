namespace HumanResources.Persistence;

public interface IUserRepository
{
    Task<User?> Get(Guid userId, CancellationToken cancellationToken);
}

public class UserRepository : IUserRepository
{
    public async Task<User?> Get(Guid userId, CancellationToken cancellationToken = default)
    {
        await Task.Delay(1000, cancellationToken);

        return new User
        {
            UserId = userId,
            Email = "someone@somewhere.com",
            FirstName = "John",
            LastName = "Doe"
        };
    }
}