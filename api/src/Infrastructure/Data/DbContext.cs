using System.Reflection;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PlateMyWeek.Application.Common.Interfaces;
using PlateMyWeek.Application.Common.Interfaces.Services;
using PlateMyWeek.Domain.Entities;
using PlateMyWeek.Infrastructure.Identity;

namespace PlateMyWeek.Infrastructure.Data;

public class DbContext : IdentityDbContext<ApplicationUser>, IDbContext
{
    public DbContext(DbContextOptions<DbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        base.OnModelCreating(builder);
    }
}
