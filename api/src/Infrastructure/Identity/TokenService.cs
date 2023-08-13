using System.Security.Claims;
using FastEndpoints.Security;
using Microsoft.Extensions.Options;
using PlateMyWeek.Application.Common.Interfaces.Services;
using PlateMyWeek.Infrastructure.Settings;

namespace PlateMyWeek.Infrastructure.Identity;

public class TokenService : ITokenService
{
    private readonly JwtSettings _settings;
    private readonly TimeProvider _dateTime;

    public TokenService(IOptions<JwtSettings> settings, TimeProvider dateTime)
    {
        _dateTime = dateTime;
        _settings = settings.Value;
    }

    public Task<string> GenerateAccessTokenAsync(string userId, IEnumerable<string> roles)
    {
        var expiration = _dateTime.GetUtcNow().AddHours(_settings.AccessTokenDurationHours).UtcDateTime;

        var token = JWTBearer.CreateToken(
            _settings.Key,
            p =>
            {
                p.Claims.Add(new Claim(ClaimTypes.NameIdentifier, userId));
            },
            _settings.Issuer,
            _settings.Audience,
            expiration);

        return Task.FromResult(token);
    }
}
