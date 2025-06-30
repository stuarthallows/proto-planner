# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a .NET Aspire application implementing a modular monolith architecture with domain-driven design principles. The application consists of:

- **ProtoPlanner.AppHost**: .NET Aspire host orchestrating all services, PostgreSQL database, and the frontend
- **Module.Inventory.ApiService**: Inventory management module using FastEndpoints with PostgreSQL persistence
- **Module.Inventory.MigrationService**: Worker service that handles database migrations for the inventory module
- **Module.Sales.ApiService**: Sales management module using minimal APIs  
- **AspireJavaScript.Vite**: React TypeScript frontend built with Vite
- **ProtoPlanner.ServiceDefaults**: Shared service configuration with OpenTelemetry, health checks, and service discovery
- **ProtoPlanner.Tests**: Integration tests using Aspire testing framework

The modules communicate through integration events and are designed to be treated as separate applications while sharing infrastructure concerns.

## Development Commands

### Running the Application
```bash
# Run the entire application (all services + frontend)
dotnet run --project ProtoPlanner.AppHost
```

### Building
```bash
# Build entire solution
dotnet build

# Build specific project
dotnet build Module.Inventory.ApiService
```

### Testing
```bash
# Run all tests
dotnet test

# Run specific test project
dotnet test ProtoPlanner.Tests
```

### Database Operations
```bash
# From Module.Inventory.ApiService directory (migrations are stored here)
cd Module.Inventory.ApiService

# Add new migration
dotnet ef migrations add <MigrationName>

# Remove last migration (if not applied)
dotnet ef migrations remove

# Note: Database updates are handled automatically by Module.Inventory.MigrationService
# The InventoryDbInitializer runs before the API service to ensure database is ready
# This follows the official .NET Aspire database migrations sample pattern
```

### Frontend Development
```bash
# From AspireJavaScript.Vite directory
cd AspireJavaScript.Vite

# Install dependencies
npm install

# Run frontend in development mode
npm run dev

# Build frontend
npm run build

# Lint TypeScript/React code
npm run lint
```

## Module Structure

### Inventory Module (FastEndpoints)
- Uses vertical slice architecture with Features folder organization
- Each endpoint is a separate class (GetItems, AddItem, UpdateItem, etc.)
- Response mappers handle entity-to-DTO conversion
- Groups endpoints under `/api/inventory` prefix
- **Database**: PostgreSQL with Entity Framework Core
- **DbContext**: `InventoryDbContext` with `inventory_items` table (id UUID, name VARCHAR, quantity INTEGER)
- **Repository Pattern**: `IInventoryRepository` handles all database operations with EF Core
- **Migrations**: EF Core migrations handle database schema creation and updates
- **Migration Service**: Dedicated worker service (`Module.Inventory.MigrationService`) with `InventoryDbInitializer` following Aspire patterns
- **Startup Order**: Migration service runs before API service to ensure database is ready
- **Pattern**: Follows the official .NET Aspire database migrations sample structure

### Sales Module (Minimal APIs)
- Uses traditional minimal API approach
- Endpoints defined directly in Program.cs
- Currently has weather forecast example and order endpoints

## Key Patterns

- **Service Defaults**: All API services inherit common configuration through `AddServiceDefaults()`
- **Health Checks**: All services expose `/health` and `/alive` endpoints in development
- **OpenTelemetry**: Comprehensive observability with metrics, traces, and logging
- **Service Discovery**: Services can communicate using logical names
- **Resilience**: HTTP clients have standard resilience patterns enabled by default
- **Database Integration**: PostgreSQL managed by Aspire with automatic connection string configuration
- **Entity Framework Core**: Code-first approach with migrations for database schema management
- **Repository Pattern**: Clean separation between business logic and data access using EF Core
- **Migration Services**: Dedicated worker services handle database migrations following Aspire patterns
- **Service Dependencies**: API services wait for migration services to complete before starting

## Frontend Integration

The Vite React app is orchestrated by Aspire and can reference backend services. Environment variables are used for service discovery and configuration.