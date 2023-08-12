using System.Text.Json;
using FastEndpoints;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using PlateMyWeek.Application.Common.Interfaces;

namespace PlateMyWeek.Application.Common.Behaviours;

public class LoggingPreprocessor : IGlobalPreProcessor
{
    /// <inheritdoc />
    public async Task PreProcessAsync(object request, HttpContext ctx, List<ValidationFailure> failures, CancellationToken ct)
    {
        var user = ctx.Resolve<IUser>();
        var identityService = ctx.Resolve<IIdentityService>();
        var logger = ctx.Resolve<ILogger<LoggingPreprocessor>>();

        var path = ctx.Request.Path;
        var userId = user.Id ?? string.Empty;
        var userName = string.Empty;

        if (!string.IsNullOrEmpty(userId))
        {
            userName = await identityService.GetUserNameAsync(userId);
        }

        var body = JsonSerializer.Serialize(request);
        logger.LogInformation("Request received: {Name} {@UserId} {@UserName} {@Request}", path, userId, userName, body);
    }
}
