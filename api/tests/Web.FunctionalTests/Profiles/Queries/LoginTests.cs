using System.Net;
using Bogus;
using FastEndpoints;
using FluentAssertions;
using PlateMyWeek.Application.Profiles.Commands;
using PlateMyWeek.Application.Profiles.Queries;
using Web.FunctionalTests.Fixtures;
using Xunit;

namespace Web.FunctionalTests.Profiles.Queries;

public class LoginTests : BaseTest
{
    public LoginTests(DatabaseFixture dbFixture)
        : base(dbFixture)
    {
    }

    [Fact]
    public async Task Should_ThrowBadRequestPassword()
    {
        var response =
            await _anonymousClient.POSTAsync<LoginQuery, LoginRequest, LoginResponse>(
                new()
                {
                    EmailAddress = "test@test.com",
                    Password = ""
                });

        response.Response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Should_ThrowBadRequestEmail()
    {
        var response =
            await _anonymousClient.POSTAsync<LoginQuery, LoginRequest, LoginResponse>(
                new()
                {
                    EmailAddress = "",
                    Password = "valid"
                });

        response.Response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Should_NotLoginMissingEmail()
    {
        var response =
            await _anonymousClient.POSTAsync<LoginQuery, LoginRequest, LoginResponse>(
                new()
                {
                    EmailAddress = "",
                    Password = "valid"
                });

        response.Response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Should_NotLoginBadPassword()
    {
        var email = await RegisterUser();
        var response =
            await _anonymousClient.POSTAsync<LoginQuery, LoginRequest, LoginResponse>(
                new LoginRequest
                {
                    EmailAddress = email,
                    Password = "bad password"
                });

        response.Response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Should_Login()
    {
        var email = await RegisterUser();
        var response =
            await _anonymousClient.POSTAsync<LoginQuery, LoginRequest, LoginResponse>(
                new LoginRequest
                {
                    EmailAddress = email,
                    Password = "Password123!"
                });

        response.Response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Should_NotReturnJwt()
    {
        var email = await RegisterUser();
        var response =
            await _anonymousClient.POSTAsync<LoginQuery, LoginRequest, LoginResponse>(
                new LoginRequest
                {
                    EmailAddress = email,
                    Password = "Password23!"
                });

        response.Result?.Token.Should().BeNull();
    }

    [Fact]
    public async Task Should_ReturnJwt()
    {
        var email = await RegisterUser();
        var response =
            await _anonymousClient.POSTAsync<LoginQuery, LoginRequest, LoginResponse>(
                new LoginRequest
                {
                    EmailAddress = email,
                    Password = "Password123!"
                });

        response.Result?.Token.Should().NotBeNull();
    }

    private async Task<string> RegisterUser()
    {
        var email = s_faker.Internet.Email();
        await _anonymousClient.POSTAsync<RegisterCommand, RegisterRequest>(
            new RegisterRequest
            {
                EmailAddress = email,
                Password = "Password123!"
            });

        return email;
    }
}
