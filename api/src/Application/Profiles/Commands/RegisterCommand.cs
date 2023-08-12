using FastEndpoints;
using PlateMyWeek.Application.Common.Interfaces;

namespace PlateMyWeek.Application.Profiles.Commands;

public class RegisterRequest
{
    public string EmailAddress { get; set; } = "";
}

public class RegisterCommand : Endpoint<RegisterRequest>
{
    private readonly IIdentityService _identityService;
    private readonly IDbContext _context;

    public RegisterCommand(IIdentityService identityService, IDbContext context)
    {
        _identityService = identityService;
        _context = context;
    }

    /// <inheritdoc />
    public override async Task HandleAsync(RegisterRequest req, CancellationToken ct)
    {
        await _context.SaveChangesAsync(ct);
    }
}
