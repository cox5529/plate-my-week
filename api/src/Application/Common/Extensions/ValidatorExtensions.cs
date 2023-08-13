using FluentValidation;

namespace PlateMyWeek.Application.Common.Extensions;

public static class ValidatorExtensions
{
    public static IRuleBuilderOptions<T, string> Password<T>(this IRuleBuilder<T, string> builder)
    {
        return builder.MinimumLength(8)
                      .MaximumLength(64)
                      .Must(x => x.Any(char.IsDigit))
                      .WithMessage("Must contain at least one digit")
                      .Must(x => x.Any(char.IsUpper))
                      .WithMessage("Must contain at least one uppercase letter")
                      .Must(x => x.Any(char.IsLower))
                      .WithMessage("Must contain at least one lowercase letter")
                      .Must(x => x.Any(c => !char.IsLetterOrDigit(c)))
                      .WithMessage("Must contain at least one symbol");
    }
}
