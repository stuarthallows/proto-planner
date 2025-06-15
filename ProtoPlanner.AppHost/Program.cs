using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var hrService = builder.AddProject<HumanResources_Endpoints>("hr-service")
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

var salesService = builder.AddProject<Sales_Endpoints>("sales-service")
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

builder.AddProject<ProtoPlanner_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithHttpHealthCheck("/health")
    .WithReference(hrService)
    .WaitFor(hrService)
    .WithReference(salesService)
    .WaitFor(salesService);

builder.Build().Run();
