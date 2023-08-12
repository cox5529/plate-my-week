using PlateMyWeek.Application.Common.Models;

namespace PlateMyWeek.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<string?> GetUserNameAsync(string userId);

    Task<bool> IsInRoleAsync(string userId, string role);

    Task<string?> CreateUserAsync(string userName, string password);

    Task<bool> DeleteUserAsync(string userId);
}
