using PlateMyWeek.Domain.Entities;

namespace PlateMyWeek.Application.Common.Interfaces.Repositories;

public interface IProfileRepository : IAggregateRepository<Profile, Guid>
{
}
