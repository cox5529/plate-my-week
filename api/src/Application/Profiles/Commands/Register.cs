using System.ComponentModel;
using FastEndpoints;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using PlateMyWeek.Application.Common.Extensions;
using PlateMyWeek.Application.Common.Interfaces.Repositories;
using PlateMyWeek.Application.Common.Interfaces.Services;
using PlateMyWeek.Domain.Entities;

namespace PlateMyWeek.Application.Profiles.Commands;

public class RegisterRequest
{
    [DefaultValue("email@gmail.com")]
    public string EmailAddress { get; set; } = "";

    [DefaultValue("Password123!")]
    public string Password { get; set; } = "";
}

public class RegisterCommand : Endpoint<RegisterRequest>
{
    private readonly IProfileRepository _profileRepository;
    private readonly IIdentityService _identityService;

    public RegisterCommand(IProfileRepository profileRepository, IIdentityService identityService)
    {
        _profileRepository = profileRepository;
        _identityService = identityService;
    }

    public override void Configure()
    {
        Post("profiles/register");
        Description(b => b.Produces(204));
        AllowAnonymous();
    }

    public override async Task HandleAsync(RegisterRequest request, CancellationToken cancel)
    {
        var userId = await _identityService.CreateUserAsync(request.EmailAddress, request.Password);
        if (string.IsNullOrEmpty(userId))
        {
            ThrowError("Email address is already in use");
        }

        var profile = new Profile(request.EmailAddress, userId);
        await _profileRepository.CreateAsync(profile, cancel);
    }
}

public class RegisterRequestValidator : Validator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.EmailAddress).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).Password();
    }
}

