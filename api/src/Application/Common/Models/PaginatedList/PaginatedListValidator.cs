using FastEndpoints;
using FluentValidation;

namespace PlateMyWeek.Application.Common.Models.PaginatedList;

public class PaginatedListValidator<T> : Validator<T> where T : PaginatedListRequest
{
    public PaginatedListValidator()
    {
        RuleFor(x => x.PageNumber).GreaterThanOrEqualTo(0);
        RuleFor(x => x.PageSize).GreaterThanOrEqualTo(1).LessThanOrEqualTo(50);
    }
}
