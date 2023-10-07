using Microsoft.EntityFrameworkCore;
using PlateMyWeek.Application.Common.Interfaces;
using PlateMyWeek.Application.Common.Interfaces.Repositories;
using PlateMyWeek.Application.Common.Interfaces.Services;
using PlateMyWeek.Domain.Entities;

namespace PlateMyWeek.Infrastructure.Repositories;

public class ProfileRepository : IProfileRepository
{
    private readonly IDbContext _context;

    public ProfileRepository(IDbContext context)
    {
        _context = context;
    }

    /// <inheritdoc />
    public Task<Profile?> GetByIdAsync(Guid id, CancellationToken cancel = default)
    {
        return _context.Set<Profile>().FirstOrDefaultAsync(x => x.Id == id, cancel);
    }

    /// <inheritdoc />
    public async Task<Guid> CreateAsync(Profile entity, CancellationToken cancel = default)
    {
        var result = await _context.Set<Profile>().AddAsync(entity, cancel);
        await _context.SaveChangesAsync(cancel);

        return result.Entity.Id;
    }

    /// <inheritdoc />
    public Task SaveAsync(Profile entity, CancellationToken cancel = default)
    {
        return _context.SaveChangesAsync(cancel);
    }
}
