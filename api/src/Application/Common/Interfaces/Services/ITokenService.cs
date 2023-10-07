namespace PlateMyWeek.Application.Common.Interfaces.Services;

public interface ITokenService
{
    Task<string> GenerateAccessTokenAsync(string userId, IEnumerable<string> roles);
}
