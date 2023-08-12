using Ardalis.GuardClauses;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PlateMyWeek.Application.Common.Interfaces;
using PlateMyWeek.Infrastructure.Data;
using PlateMyWeek.Infrastructure.Data.Interceptors;
using PlateMyWeek.Infrastructure.Identity;
using DbContext = PlateMyWeek.Infrastructure.Data.DbContext;

namespace PlateMyWeek.Infrastructure;

public static class DependencyInjection
{
    public static void AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
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

        services.AddAuthentication().AddJwtBearer();

        services.AddAuthorizationBuilder();

        services.AddIdentityCore<ApplicationUser>()
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<DbContext>()
                .AddApiEndpoints();

        services.AddSingleton(TimeProvider.System);
        services.AddTransient<IIdentityService, IdentityService>();

        services.AddAuthorization();
    }
}
