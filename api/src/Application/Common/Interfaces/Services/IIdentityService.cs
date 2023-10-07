namespace PlateMyWeek.Application.Common.Interfaces.Services;

public interface IIdentityService
{
    Task<string?> GetUserNameAsync(string userId);

    Task<bool> IsInRoleAsync(string userId, string role);

    Task<string?> CreateUserAsync(string userName, string password);

    Task<bool> DeleteUserAsync(string userId);

    Task<string?> LoginAsync(string userName, string password);
}
