using FastEndpoints;
using FastEndpoints.Security;
using FastEndpoints.Swagger;
using Microsoft.AspNetCore.Mvc;
using PlateMyWeek.Application.Common.Interfaces;
using PlateMyWeek.Infrastructure.Data;
using PlateMyWeek.Web.Services;
using PlateMyWeek.Web.Settings;

namespace PlateMyWeek.Web;

public static class DependencyInjection
{
    public static void AddWebServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IUser, CurrentUser>();

        services.AddHttpContextAccessor();

        services.AddHealthChecks().AddDbContextCheck<DbContext>();

        services.AddFastEndpoints();
        services.SwaggerDocument();

        var jwtSettings = configuration.GetSection("Jwt").Get<JwtSettings>();
        services.AddJWTBearerAuth(jwtSettings!.Key);
    }
}
