using System.Net;
using FastEndpoints;
using FluentAssertions;
using PlateMyWeek.Application.Common.Models.PaginatedList;
using PlateMyWeek.Application.Profiles.Queries;
using Web.FunctionalTests.Fixtures;
using Xunit;

namespace Web.FunctionalTests.Profiles.Queries;

public class ListUsersTests : BaseTest
{
    public ListUsersTests(DatabaseFixture dbFixture)
        : base(dbFixture)
    {
    }

    [Fact]
    public async Task Should_RequireAuthentication()
    {
        var response = await _anonymousClient.GETAsync<ListUsersQuery, ListUsersRequest, ListUsersResponse>(
                           new ListUsersRequest
                           {
                               PageNumber = 0,
                               PageSize = 20
                           });

        response.Response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Should_ThrowBadRequestNegativePage()
    {
        var response = await _authenticatedClient.GETAsync<ListUsersQuery, ListUsersRequest, ListUsersResponse>(
                           new ListUsersRequest
                           {
                               PageNumber = -1,
                               PageSize = 20
                           });

        response.Response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Should_ThrowBadRequestNegativePageSize()
    {
        var response = await _authenticatedClient.GETAsync<ListUsersQuery, ListUsersRequest, ListUsersResponse>(
                           new ListUsersRequest
                           {
                               PageNumber = 0,
                               PageSize = -20
                           });

        response.Response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Should_ThrowBadRequestLargePageSize()
    {
        var response = await _authenticatedClient.GETAsync<ListUsersQuery, ListUsersRequest, ListUsersResponse>(
                           new ListUsersRequest
                           {
                               PageNumber = 0,
                               PageSize = 2000
                           });

        response.Response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Should_ReturnUsers()
    {
        var response = await _authenticatedClient.GETAsync<ListUsersQuery, ListUsersRequest, PaginatedList<ListUsersResponse>>(
                           new ListUsersRequest
                           {
                               PageNumber = 0,
                               PageSize = 20
                           });

        response.Result!.Items.Should().HaveCountGreaterThan(10);
    }

    [Fact]
    public async Task Should_ReturnFirstPage()
    {
        var response = await _authenticatedClient.GETAsync<ListUsersQuery, ListUsersRequest, PaginatedList<ListUsersResponse>>(
                           new ListUsersRequest
                           {
                               PageNumber = 0,
                               PageSize = 5
                           });

        response.Result!.Items.Should().HaveCount(5);
    }

    [Fact]
    public async Task Should_ReturnSecondPage()
    {
        var firstResponse = await _authenticatedClient.GETAsync<ListUsersQuery, ListUsersRequest, PaginatedList<ListUsersResponse>>(
                           new ListUsersRequest
                           {
                               PageNumber = 0,
                               PageSize = 5
                           });
        var secondResponse = await _authenticatedClient.GETAsync<ListUsersQuery, ListUsersRequest, PaginatedList<ListUsersResponse>>(
                                new ListUsersRequest
                                {
                                    PageNumber = 1,
                                    PageSize = 5
                                });

        var firstUser = firstResponse.Result!.Items.First();
        var secondUser = secondResponse.Result!.Items.First();

        firstUser.EmailAddress.Should().NotBe(secondUser.EmailAddress);
    }

    [Fact]
    public async Task Should_FilterOnEmail()
    {
        var response = await _authenticatedClient.GETAsync<ListUsersQuery, ListUsersRequest, PaginatedList<ListUsersResponse>>(
                           new ListUsersRequest
                           {
                               Query = "admin@email.com",
                               PageNumber = 0,
                               PageSize = 5
                           });

        response.Result!.Items.Should().HaveCount(1);
    }
}
