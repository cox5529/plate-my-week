using PlateMyWeek.Domain.Common;

namespace PlateMyWeek.Application.Common.Interfaces.Repositories;

public interface IAggregateRepository<T, TKey> where T : BaseEntity<TKey>
{
    Task<TKey> GetByIdAsync(TKey id, CancellationToken cancel = default);
}
