using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PlateMyWeek.Application.Common.Interfaces.Services;

namespace PlateMyWeek.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly ITokenService _tokenService;
    private readonly UserManager<ApplicationUser> _userManager;

    public IdentityService(UserManager<ApplicationUser> userManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    public async Task<string?> GetUserNameAsync(string userId)
    {
        var user = await _userManager.Users.FirstAsync(u => u.Id == userId);
        return user.UserName;
    }

    public async Task<string?> CreateUserAsync(string userName, string password)
    {
        var user = new ApplicationUser
        {
            UserName = userName,
            Email = userName
        };

        var result = await _userManager.CreateAsync(user, password);
        return result.Succeeded ? user.Id : null;
    }

    public async Task<bool> IsInRoleAsync(string userId, string role)
    {
        var user = await _userManager.Users.SingleOrDefaultAsync(u => u.Id == userId);
        return user != null && await _userManager.IsInRoleAsync(user, role);
    }

    public async Task<bool> DeleteUserAsync(string userId)
    {
        var user = await _userManager.Users.SingleOrDefaultAsync(u => u.Id == userId);
        return user != null && await DeleteUserAsync(user);
    }

    public async Task<string?> LoginAsync(string userName, string password)
    {
        var user = await _userManager.FindByNameAsync(userName);
        if (user == null)
        {
            return null;
        }
        
        var isValid = await _userManager.CheckPasswordAsync(user, password);
        if (!isValid)
        {
            return null;
        }

        var roles = await _userManager.GetRolesAsync(user);
        return await _tokenService.GenerateAccessTokenAsync(user.Id, roles);
    }

    private async Task<bool> DeleteUserAsync(ApplicationUser user)
    {
        var result = await _userManager.DeleteAsync(user);
        return result.Succeeded;
    }
}
