using FastEndpoints;
using FastEndpoints.Swagger;
using PlateMyWeek.Application;
using PlateMyWeek.Application.Common.Behaviours;
using PlateMyWeek.Infrastructure;
using PlateMyWeek.Infrastructure.Data;
using PlateMyWeek.Web;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddWebServices(builder.Configuration);

// Configure the HTTP request pipeline.
var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    await app.InitialiseDatabaseAsync();
}
else
{
    app.UseHttpsRedirection();
    app.UseHsts();
}

app.UseDefaultExceptionHandler();
app.UseHealthChecks("/health");
app.UseAuthorization();
app.UseFastEndpoints(
    c =>
    {
        c.Endpoints.RoutePrefix = "api";
        c.Endpoints.Configurator = ep =>
        {
            ep.PreProcessors(Order.Before, new LoggingPreprocessor());

            if (ep.Verbs != null && !ep.Verbs.Contains("GET"))
            {
                ep.Description(b => b.ClearDefaultProduces(200));
            }
        };
    });
app.UseSwaggerGen();

app.Run();
