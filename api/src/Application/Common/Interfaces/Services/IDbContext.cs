using Microsoft.EntityFrameworkCore;
using PlateMyWeek.Domain.Entities;

namespace PlateMyWeek.Application.Common.Interfaces;

public interface IDbContext
{
    DbSet<T> Set<T>() where T : class;

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
