using HumanResources.Application;
using HumanResources.Persistence;

namespace HumanResources.Infrastructure.Users;

internal sealed class UsersApi(IUserRepository userRepository) : IUsersApi
{
    public async Task<UserResponse?> Get(Guid userId, CancellationToken cancellationToken = default)
    {
        await Task.Delay(1000, cancellationToken);

        var user = await userRepository.Get(userId, cancellationToken);

        if (user == null)
        {
            return null;
        }

        return new UserResponse(
            user.UserId,
            user.FirstName,
            user.LastName,
            user.Email);
    }
}