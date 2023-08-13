using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PlateMyWeek.Domain.Entities;

namespace PlateMyWeek.Infrastructure.Data.Configurations;

public class ProfileConfiguration : IEntityTypeConfiguration<Profile>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<Profile> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasIndex(x => x.UserId);

        builder.Property(x => x.UserId).HasMaxLength(128);
    }
}
