namespace HumanResources.Application;

public sealed record UserResponse(Guid UserId, string FirstName, string LastName, string Email);

public interface IUsersApi
{
    Task<UserResponse?> Get(Guid userId, CancellationToken cancellationToken);
}