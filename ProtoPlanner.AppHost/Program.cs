using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var hrService = builder.AddProject<HumanResources_Endpoints>("hr-service")
    .WithHttpHealthCheck("/health");

hrService
    .WithUrlForEndpoint("http", url =>
    {
        url.DisplayText = "Swagger (HTTP)";
        url.Url = "/swagger";
    })
    .WithUrlForEndpoint("https", url =>
    {
        url.DisplayText = "Swagger (HTTPS)";
        url.Url = "/swagger";
    });

var salesService = builder.AddProject<Sales_Endpoints>("sales-service")
    .WithHttpHealthCheck("/health");

salesService
    .WithUrlForEndpoint("http", url =>
    {
        url.DisplayText = "Swagger (HTTP)";
        url.Url = "/swagger";
    })
    .WithUrlForEndpoint("https", url =>
    {
        url.DisplayText = "Swagger (HTTPS)";
        url.Url = "/swagger";
    });

builder.AddProject<Projects.ProtoPlanner_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithHttpHealthCheck("/health")
    .WithReference(hrService)
    .WaitFor(hrService)
    .WithReference(salesService)
    .WaitFor(salesService);

builder.Build().Run();
