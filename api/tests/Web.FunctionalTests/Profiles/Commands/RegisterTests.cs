using System.Net;
using FastEndpoints;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using PlateMyWeek.Application.Profiles.Commands;
using PlateMyWeek.Domain.Entities;
using Web.FunctionalTests.Fixtures;
using Xunit;

namespace Web.FunctionalTests.Profiles.Commands;

public class RegisterTests : BaseTest
{
    public RegisterTests(DatabaseFixture dbFixture)
        : base(dbFixture)
    {
    }

    [Theory]
    [InlineData("password")]
    [InlineData("alll0w#r")]
    [InlineData("ALLC@P2")]
    [InlineData("Sh0rt!")]
    [InlineData("veryLong01234!@#veryLong01234!@#veryLong01234!@#veryLong01234!@#veryLong01234!@#veryLong01234!@#veryLong01234!@#")]
    public async Task Should_ThrowBadRequestWithWeakPasswords(string password)
    {
        var response = await _anonymousClient.POSTAsync<RegisterCommand, RegisterRequest>(
                           new RegisterRequest
                           {
                               EmailAddress = "test@gmail.com",
                               Password = password
                           });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("test")]
    [InlineData("test@")]
    [InlineData("@test")]
    public async Task Should_ThrowBadRequestWithInvalidEmails(string email)
    {
        var response = await _anonymousClient.POSTAsync<RegisterCommand, RegisterRequest>(
                           new RegisterRequest
                           {
                               EmailAddress = email,
                               Password = "Password123!"
                           });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Should_ThrowBadRequestExistingEmail()
    {
        var response = await _anonymousClient.POSTAsync<RegisterCommand, RegisterRequest>(
                           new RegisterRequest
                           {
                               EmailAddress = "admin@email.com",
                               Password = "Password123!"
                           });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Should_AllowValidEmailAndPassword()
    {
        var response = await _anonymousClient.POSTAsync<RegisterCommand, RegisterRequest>(
                           new RegisterRequest
                           {
                               EmailAddress = "test@test.com",
                               Password = "Password123!"
                           });

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Should_CreateUser()
    {
        await _anonymousClient.POSTAsync<RegisterCommand, RegisterRequest>(
                           new RegisterRequest
                           {
                               EmailAddress = "test2@test.com",
                               Password = "Password123!"
                           });

        var profile = await Context.Set<Profile>().FirstOrDefaultAsync(x => x.EmailAddress == "test2@test.com");
        profile.Should().NotBeNull();
    }
}
