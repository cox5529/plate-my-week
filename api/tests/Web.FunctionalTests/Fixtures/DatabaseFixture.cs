using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using DbContext = PlateMyWeek.Infrastructure.Data.DbContext;

namespace Web.FunctionalTests.Fixtures;

public class DatabaseFixture
{
    private static readonly object Lock = new();
    private static bool s_databaseInitialized = false;
    
    public DbContext BuildContext(string connectionString, IServiceProvider provider)
    {
        var options = new DbContextOptionsBuilder<DbContext>().UseNpgsql(connectionString)
                                                              .AddInterceptors(provider.GetServices<ISaveChangesInterceptor>());
        var context = new DbContext(options.Options);

        lock (Lock)
        {
            if (!s_databaseInitialized)
            {
                context.Database.EnsureDeleted();
                context.Database.Migrate();

                ConfigureTestSeedData(context);
            }

            s_databaseInitialized = true;
        }
        
        return context;
    }

    private void ConfigureTestSeedData(DbContext context)
    {
        
    }
}

[CollectionDefinition("Database collection")]
public class DatabaseCollection : ICollectionFixture<DatabaseFixture>
{
}
