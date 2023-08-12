using Microsoft.EntityFrameworkCore;
using PlateMyWeek.Domain.Entities;

namespace PlateMyWeek.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<T> Set<T>() where T : class;

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
