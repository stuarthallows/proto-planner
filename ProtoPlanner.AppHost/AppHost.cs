using Aspire.Hosting.Yarp.Transforms;
using Projects;

var builder = DistributedApplication.CreateBuilder(args);

// AddAzurePostgresFlexibleServer required for running on Azure.

var inventoryDb = builder
    .AddPostgres("postgres") // Creates a server with username 'postgres' and a random password
    .WithDataVolume()
    .WithPgWeb()  // Adds a container based on the sosedoff/pgweb image.
    .WithPgAdmin() // Adds a container based on the docker.io/dpage/pgadmin4 image.
    .AddDatabase("inventory");

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

var apiGateway = builder.AddYarp("apigateway")
    .WithConfiguration(yarpBuilder =>
    {
        yarpBuilder.AddRoute("/inventory/{**catch-all}", inventoryService)
            .WithTransformPathRemovePrefix("/inventory");

        yarpBuilder.AddRoute("/sales/{**catch-all}", salesService)
            .WithTransformPathRemovePrefix("/sales");
    });

builder.AddNpmApp("webapp", "../ProtoPlanner.Web")
    .WithReference(apiGateway)
    .WaitFor(apiGateway)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(env: "VITE_PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile()
    .WithHttpHealthCheck("/health");

builder.Build().Run();