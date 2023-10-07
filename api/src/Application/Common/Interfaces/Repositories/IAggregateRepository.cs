using PlateMyWeek.Domain.Common;

namespace PlateMyWeek.Application.Common.Interfaces.Repositories;

public interface IAggregateRepository<T, TKey> where T : BaseEntity<TKey>
{
    Task<T?> GetByIdAsync(TKey id, CancellationToken cancel = default);

    Task<TKey> CreateAsync(T entity, CancellationToken cancel = default);

    Task SaveAsync(T entity, CancellationToken cancel = default);
}
