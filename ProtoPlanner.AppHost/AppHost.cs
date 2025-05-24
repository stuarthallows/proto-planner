var builder = DistributedApplication.CreateBuilder(args);

var apiService = builder.AddProject<Projects.ProtoPlanner_ApiService>("apiservice")
    .WithHttpHealthCheck("/health");

apiService
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
    .WithReference(apiService)
    .WaitFor(apiService);

builder.Build().Run();
