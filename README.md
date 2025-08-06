# 🏗️ Proto Planner

A playground application for experimenting with modern development technologies in the context of an enterprise ERP system. This project implements a microservices architecture with domain-driven design principles, focusing on inventory and sales management services.

## 🎯 Overview

This application serves as a technology experimentation platform, exploring various patterns and frameworks in a realistic enterprise ERP domain. The system demonstrates microservices architecture where each business domain is implemented as an independent service while sharing infrastructure concerns.

## 🏛️ Architecture

The application uses a .NET Aspire host to orchestrate multiple microservices:

- **ProtoPlanner.AppHost**: .NET Aspire orchestration host
- **Module.Inventory.ApiService**: Inventory management using FastEndpoints 
- **Module.Sales.ApiService**: Sales management using minimal APIs
- **ProtoPlanner.Web**: React TypeScript frontend
- **ProtoPlanner.ServiceDefaults**: Shared service configuration

### Microservices Design Principles

When defining microservices, consider:
- How the services communicate (integration events)
- How data is shared between services
- How to handle eventual consistency
- Treating each service as an independent application

## Workflow
- Start working on an app with a dictation session in SuperWhisperer
- Work with Claude to turn that into a requirements document
- Tell Claude code to create GitHub issues, issues need to be really well defined
- Install GitHub CLI to enable Claude to interact with GitHub
- Setup Playwright MCP server so Claude can test the code it writes
- Setup CI to run the test suite
- Review the PR and leave comments
- Have Claude perform a PR review, clear the context first or use a separate terminal
- Have Claude action the comments
- Merge the PR
- Clear the context
- Consider using Git worktrees to work on multiple issues simultaneously

Question: Should Claude commit the code, or should the developer?



What works surprisingly well in my workflow definition is to ask Claude to self assess confidence/familiarity of the area in the planning phase and if it's below 70 (1-100 scale), it does a spike/POC and much more research before proceeding to implementing. 

## 🚀 Exploration Checklist

- [x] Consider problem domain for code playground
- [x] Create Aspire starter app
- [x] ⛁ Database (SQL Server vs MySQL vs PostgresSQL)
- [x] Swagger / OpenApi documentation
- [x] Consider Controllers vs Fast Endpoints vs Minimal APIs
- [x] Consider vertical slice vs clean architecture pattern
- [x] Request validation
- [x] Logging
- [x] API [rate limiting](https://fast-endpoints.com/docs/rate-limiting#endpoint-rate-limiting)
- [x] Mapping
- [x] Feature flag framework - ConfigCat or Azure
- [x] Caching server side support, see [Response Caching](https://fast-endpoints.com/docs/response-caching)
- [x] Add [React app](https://learn.microsoft.com/en-us/dotnet/aspire/get-started/build-aspire-apps-with-nodejs#explore-the-react-client)
- [x] ⛁ Separate DB per service
- [x] ⛁ [Database migrations](https://github.com/dotnet/aspire-samples/tree/main/samples/DatabaseMigrations)
- [x] ⛁ Add database [admin link](https://learn.microsoft.com/en-us/dotnet/aspire/database/postgresql-integration?tabs=dotnet-cli#add-postgresql-pgadmin-resource)
- [x] Distributed tracing with OpenTelemetry
- [x] Shadcn component library
- [x] Security code scanning
- [x] Return mock data with Mock Service Worker
- [x] Reverse proxy to hide implementation services (YARP)
- [x] Full set of CRUD operations
- [x] Tanstack Query
- [ ] Consider use of Axios library rather than native fetch
- [ ] Form handling including validation
- [ ] BE Error handling global exception handler
- [ ] Claude can iterate on UI implementation using Playwright
- [ ] Return errors as `ProblemDetails`
- [ ] Infrastructure as code (Bicep vs Terraform vs Pulumi)
- [ ] ShadCN MCP server
- [ ] Component library with Storybook (expand to full design system and style guide?)
- [ ] Deployment
- [ ] Auditing
- [ ] CI/CD, build and run stages
- [ ] Inter-service communication
- [ ] Secret management
- [ ] API request idempotency
- [ ] Abstract messaging implementation with Mass Transit
- [ ] Configuration for dev/staging/production
- [ ] Alerting on abnormal system behaviour
- [ ] User authN and authZ
- [ ] Monitoring and alerting
- [ ] Router - React Router or React Start
- [ ] Localisation
- [ ] 🧪 Consider Dev Containers for testing
- [ ] 🧪 BE unit testing (xUnit and Moq)
- [ ] 🧪 BE integration testing (TestContainers)
- [ ] 🧪 FE unit testing (React Testing Library)
- [ ] 🧪 FE E2E testing (Playwright)
- [ ] 🧪 Aspire testing
- [ ] 🧪 Load testing
- [ ] ⛁ Database auto retry with backoff (only for reads)
- [ ] ⛁ Automated database backups
- [ ] ⛁ Database concurrency management
- [ ] Real time communication (SignalR)
- [ ] Asynchronous intra-service messaging (RabbitMQ on-prem)
- [ ] Runtime health checks and liveness probes
- [ ] Service auto scale out
- [ ] Customer facing status page (e.g. Statuspage or Hund)
- [ ] React module federation (see `create-tsrouter-app`)
- [ ] Consider CQRS pattern
- [ ] Consider event sourcing pattern
- [ ] Consider saga pattern
- [ ] Consider outbox pattern
- [ ] Consider Orleans
