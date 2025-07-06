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

builder.AddNpmApp("webapp", "../ProtoPlanner.Web")
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