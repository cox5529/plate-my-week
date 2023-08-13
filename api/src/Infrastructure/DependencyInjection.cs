using Ardalis.GuardClauses;
using FastEndpoints.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PlateMyWeek.Application.Common.Interfaces.Repositories;
using PlateMyWeek.Application.Common.Interfaces.Services;
using PlateMyWeek.Infrastructure.Data;
using PlateMyWeek.Infrastructure.Data.Interceptors;
using PlateMyWeek.Infrastructure.Identity;
using PlateMyWeek.Infrastructure.Repositories;
using PlateMyWeek.Infrastructure.Settings;
using DbContext = PlateMyWeek.Infrastructure.Data.DbContext;

namespace PlateMyWeek.Infrastructure;

public static class DependencyInjection
{
    public static void AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext(configuration);
        services.AddIdentity(configuration);
        services.AddSingleton(TimeProvider.System);

        services.AddRepositories();
    }

    private static void AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<IProfileRepository, ProfileRepository>();
    }

    private static void AddIdentity(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddIdentityCore<ApplicationUser>(o => configuration.GetSection("Identity").Bind(o))
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<DbContext>()
                .AddApiEndpoints();

        services.AddTransient<IIdentityService, IdentityService>();
        services.AddTransient<ITokenService, TokenService>();
        services.AddAuthorization();

        var jwtSettings = configuration.GetSection("Jwt").Get<JwtSettings>();
        services.AddJWTBearerAuth(jwtSettings!.Key);
        services.Configure<JwtSettings>(o => configuration.GetSection("Jwt").Bind(o));
    }

    private static void AddDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        Guard.Against.Null(connectionString, message: "Connection string 'DefaultConnection' not found.");

        services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();

        services.AddDbContext<DbContext>(
            (sp, options) =>
            {
                options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());

                options.UseNpgsql(connectionString);
            });

        services.AddScoped<IDbContext>(provider => provider.GetRequiredService<DbContext>());

        services.AddScoped<ApplicationDbContextInitialiser>();
    }
}
