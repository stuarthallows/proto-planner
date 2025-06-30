using Projects;
using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .WithDataVolume();

var inventoryDb = postgres.AddDatabase("inventory");

var inventoryMigrationService = builder.AddProject<Module_Inventory_MigrationService>("inventorymigration")
    .WithReference(inventoryDb);

var inventoryService = builder.AddProject<Module_Inventory_ApiService>("inventoryservice")
    .WithReference(inventoryDb)
    .WaitFor(inventoryMigrationService)
    .WithHttpHealthCheck("/health")
    .WithUrlForEndpoint("http", url =>
    {
        url.DisplayText = "Swagger";
        url.Url = "/swagger";
        url.DisplayLocation = UrlDisplayLocation.DetailsOnly;
    })
    .WithUrlForEndpoint("https", url =>
    {
        url.DisplayText = "Swagger";
        url.Url = "/swagger";
        url.DisplayLocation = UrlDisplayLocation.SummaryAndDetails;
    })
    .WithUrlForEndpoint("https", ep => new ResourceUrlAnnotation
    {
        Url = "/health",
        DisplayText = "Health",
        DisplayLocation = UrlDisplayLocation.DetailsOnly
    });

var salesService = builder.AddProject<Module_Sales_ApiService>("salesservice")
    .WithHttpHealthCheck("/health")
    .WithUrlForEndpoint("http", url =>
    {
        url.DisplayText = "Swagger";
        url.Url = "/swagger";
        url.DisplayLocation = UrlDisplayLocation.DetailsOnly;
    })
    .WithUrlForEndpoint("https", url =>
    {
        url.DisplayText = "Swagger";
        url.Url = "/swagger";
        url.DisplayLocation = UrlDisplayLocation.SummaryAndDetails;
    })
    .WithUrlForEndpoint("https", ep => new ResourceUrlAnnotation
    {
        Url = "/health",
        DisplayText = "Health",
        DisplayLocation = UrlDisplayLocation.DetailsOnly
    });

builder.AddNpmApp("webapp", "../AspireJavaScript.Vite")
    // .WithReference(inventoryService)
    // .WaitFor(inventoryService)
    // .WithReference(hrService)
    // .WaitFor(hrService)
    .WithReference(salesService)
    .WaitFor(salesService)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(env: "VITE_PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile()
    .WithHttpHealthCheck("/health");

builder.Build().Run();