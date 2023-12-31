﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using PlateMyWeek.Application.Common.Interfaces;
using PlateMyWeek.Application.Common.Interfaces.Services;
using PlateMyWeek.Domain.Common;

namespace PlateMyWeek.Infrastructure.Data.Interceptors;

public class AuditableEntityInterceptor : SaveChangesInterceptor
{
    private readonly TimeProvider _dateTime;
    private readonly IUser _user;

    public AuditableEntityInterceptor(IUser user, TimeProvider dateTime)
    {
        _user = user;
        _dateTime = dateTime;
    }

    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        UpdateEntities(eventData.Context);

        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        UpdateEntities(eventData.Context);

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    public void UpdateEntities(Microsoft.EntityFrameworkCore.DbContext? context)
    {
        if (context == null)
        {
            return;
        }

        foreach (EntityEntry<BaseAuditableEntity<object>> entry in context.ChangeTracker.Entries<BaseAuditableEntity<object>>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedBy = _user.Id;
                entry.Entity.Created = _dateTime.GetUtcNow();
            }

            if (entry.State == EntityState.Added || entry.State == EntityState.Modified || entry.HasChangedOwnedEntities())
            {
                entry.Entity.LastModifiedBy = _user.Id;
                entry.Entity.LastModified = _dateTime.GetUtcNow();
            }
        }
    }
}

public static class Extensions
{
    public static bool HasChangedOwnedEntities(this EntityEntry entry)
    {
        return entry.References.Any(
            r => r.TargetEntry != null
              && r.TargetEntry.Metadata.IsOwned()
              && (r.TargetEntry.State == EntityState.Added || r.TargetEntry.State == EntityState.Modified));
    }
}
