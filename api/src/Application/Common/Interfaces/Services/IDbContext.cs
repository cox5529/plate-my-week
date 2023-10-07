using Microsoft.EntityFrameworkCore;

namespace PlateMyWeek.Application.Common.Interfaces.Services;

public interface IDbContext
{
    DbSet<T> Set<T>() where T : class;

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
