namespace HumanResources.Persistence;

public record User(Guid UserId, string Email, string FirstName, string LastName);

public interface IUserRepository
{
    Task<User?> Get(Guid userId, CancellationToken cancellationToken);
}

public class UserRepository : IUserRepository
{
    public async Task<User?> Get(Guid userId, CancellationToken cancellationToken = default)
    {
        await Task.Delay(1000, cancellationToken);
        
        return new User(Guid.NewGuid(), "someone@somewhere.com", "John", "Doe");
    }
}