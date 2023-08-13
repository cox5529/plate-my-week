using System.ComponentModel;
using FastEndpoints;
using FluentValidation;
using PlateMyWeek.Application.Common.Interfaces.Services;

namespace PlateMyWeek.Application.Profiles.Queries;

public class LoginRequest
{
    [DefaultValue("email@gmail.com")]
    public string EmailAddress { get; set; } = "";

    [DefaultValue("Password123!")]
    public string Password { get; set; } = "";
}

public class LoginResponse
{
    public string Token { get; set; } = "";
}

public class LoginQuery : Endpoint<LoginRequest, LoginResponse>
{
    private readonly IIdentityService _identityService;

    public LoginQuery(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public override void Configure()
    {
        Post("profiles/login");
        AllowAnonymous();
    }

    public override async Task HandleAsync(LoginRequest request, CancellationToken cancel)
    {
        var token = await _identityService.LoginAsync(request.EmailAddress, request.Password);
        if (string.IsNullOrEmpty(token))
        {
            await SendUnauthorizedAsync(cancel);
            return;
        }

        Response.Token = token;
    }
}

public class LoginRequestValidator : Validator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.EmailAddress).NotEmpty();
        RuleFor(x => x.Password).NotEmpty();
    }
}

