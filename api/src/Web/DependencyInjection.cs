using FastEndpoints;
using FastEndpoints.Swagger;
using PlateMyWeek.Application.Common.Interfaces.Services;
using PlateMyWeek.Infrastructure.Data;
using PlateMyWeek.Web.Services;

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
    }
}
