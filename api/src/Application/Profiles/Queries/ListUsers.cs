using FastEndpoints;
using PlateMyWeek.Application.Common.Interfaces.Services;
using PlateMyWeek.Application.Common.Models.PaginatedList;
using PlateMyWeek.Domain.Entities;

namespace PlateMyWeek.Application.Profiles.Queries;

public class ListUsersRequest : PaginatedListRequest
{
}

public class ListUsersResponse
{
    public Guid Id { get; set; }

    public string EmailAddress { get; set; } = "";
}

public class ListUsersQuery : Endpoint<ListUsersRequest, PaginatedList<ListUsersResponse>>
{
    private readonly IDbContext _context;

    public ListUsersQuery(IDbContext context)
    {
        _context = context;
    }

    public override void Configure()
    {
        Get("profiles");
    }

    public override async Task HandleAsync(ListUsersRequest request, CancellationToken cancel)
    {
        IQueryable<Profile> users = _context.Set<Profile>();
        if (!string.IsNullOrEmpty(request.Query))
        {
            users = users.Where(x => x.EmailAddress.Contains(request.Query));
        }

        var query = users.Select(x => new ListUsersResponse
        {
            Id = x.Id,
            EmailAddress = x.EmailAddress
        });

        Response = await PaginatedList<ListUsersResponse>.CreateAsync(query, request.PageNumber, request.PageSize);
    }
}

public class ListUsersRequestValidator : PaginatedListValidator<ListUsersRequest>
{
}
