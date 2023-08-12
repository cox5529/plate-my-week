using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PlateMyWeek.Application.Common.Interfaces;
using PlateMyWeek.Application.Common.Models;

namespace PlateMyWeek.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly IAuthorizationService _authorizationService;
    private readonly IUserClaimsPrincipalFactory<ApplicationUser> _userClaimsPrincipalFactory;
    private readonly UserManager<ApplicationUser> _userManager;

    public IdentityService(
        UserManager<ApplicationUser> userManager,
        IUserClaimsPrincipalFactory<ApplicationUser> userClaimsPrincipalFactory,
        IAuthorizationService authorizationService)
    {
        _userManager = userManager;
        _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
        _authorizationService = authorizationService;
    }

    public async Task<string?> GetUserNameAsync(string userId)
    {
        ApplicationUser user = await _userManager.Users.FirstAsync(u => u.Id == userId);

        return user.UserName;
    }

    public async Task<string?> CreateUserAsync(string userName, string password)
    {
        ApplicationUser user = new ApplicationUser
        {
            UserName = userName,
            Email = userName
        };

        IdentityResult result = await _userManager.CreateAsync(user, password);

        return result.Succeeded ? user.Id : null;
    }

    public async Task<bool> IsInRoleAsync(string userId, string role)
    {
        ApplicationUser? user = _userManager.Users.SingleOrDefault(u => u.Id == userId);

        return user != null && await _userManager.IsInRoleAsync(user, role);
    }

    public async Task<bool> AuthorizeAsync(string userId, string policyName)
    {
        ApplicationUser? user = _userManager.Users.SingleOrDefault(u => u.Id == userId);

        if (user == null)
        {
            return false;
        }

        ClaimsPrincipal principal = await _userClaimsPrincipalFactory.CreateAsync(user);

        AuthorizationResult result = await _authorizationService.AuthorizeAsync(principal, policyName);

        return result.Succeeded;
    }

    public async Task<bool> DeleteUserAsync(string userId)
    {
        ApplicationUser? user = _userManager.Users.SingleOrDefault(u => u.Id == userId);

        return user != null && await DeleteUserAsync(user);
    }

    public async Task<bool> DeleteUserAsync(ApplicationUser user)
    {
        IdentityResult result = await _userManager.DeleteAsync(user);

        return result.Succeeded;
    }
}
