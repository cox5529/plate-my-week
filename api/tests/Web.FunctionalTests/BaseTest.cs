using Bogus;
using FastEndpoints;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using PlateMyWeek.Application.Profiles.Commands;
using PlateMyWeek.Application.Profiles.Queries;
using PlateMyWeek.Infrastructure.Data;
using Web.FunctionalTests.Fixtures;
using Xunit;

namespace Web.FunctionalTests;

[Collection("Database collection")]
public abstract class BaseTest
{
    protected static Faker s_faker = new Faker();
    protected readonly WebApplicationFactory<Program> _factory;
    protected readonly HttpClient _anonymousClient;
    protected readonly HttpClient _authenticatedClient;

    protected DbContext Context => _factory.Services.GetRequiredService<DbContext>();

    private readonly DatabaseFixture _dbFixture;

    private static readonly object Lock = new();
    private static bool s_isStaticDataInitialized = false;

    protected BaseTest(DatabaseFixture dbFixture)
    {
        _dbFixture = dbFixture;
        _factory = new WebApplicationFactory<Program>().WithWebHostBuilder(SetupWebHost);

        lock (Lock)
        {
            if (!s_isStaticDataInitialized)
            {
                StaticInitialization(_factory).Wait();
            }

            s_isStaticDataInitialized = true;
        }
        
        _anonymousClient = _factory.CreateClient();
        _authenticatedClient = BuildAuthenticatedClient().Result;
    }

    private async static Task StaticInitialization(WebApplicationFactory<Program> factory)
    {
        var client = factory.CreateClient();
        await client.POSTAsync<RegisterCommand, RegisterRequest>(
            new RegisterRequest
            {
                EmailAddress = "admin@email.com",
                Password = "Password123!"
            });

        for (var i = 0; i < 10; i++)
        {
            await client.POSTAsync<RegisterCommand, RegisterRequest>(
                new RegisterRequest
                {
                    EmailAddress = s_faker.Internet.Email(),
                    Password = "Password123!"
                });
        }
    }

    private async Task<HttpClient> BuildAuthenticatedClient()
    {
        var client = _factory.CreateClient();

        var response = await client.POSTAsync<LoginQuery, LoginRequest, LoginResponse>(
                           new LoginRequest
                           {
                               EmailAddress = "admin@email.com",
                               Password = "Password123!"
                           });

        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {response.Result?.Token}");
        return client;
    }

    private void SetupWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration(c => c.AddJsonFile("appsettings.Test.json"));
        builder.ConfigureServices((context, services) => ConfigureServices(services, context.Configuration));
    }

    private void ConfigureServices(IServiceCollection services, IConfiguration configuration)
    {
        services.RemoveAll<DbContext>();
        services.AddScoped<DbContext>(
            _ => _dbFixture.BuildContext(configuration.GetConnectionString("DefaultConnection")!, services.BuildServiceProvider()));
    }
}
