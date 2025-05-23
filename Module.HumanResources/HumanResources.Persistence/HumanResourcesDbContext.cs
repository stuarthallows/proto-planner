using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace HumanResources.Persistence;

public class HumanResourcesDbContext(DbContextOptions<HumanResourcesDbContext> options, IConfiguration configuration)
    : DbContext(options)  // , IUnitOfWork
{
    public DbSet<User> Users { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Role> Roles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(b =>
        {
            b.HasKey(u => u.UserId);
            b.Property(u => u.Email).HasMaxLength(100);
            b.Property(u => u.FirstName).HasMaxLength(100);
            b.Property(u => u.LastName).HasMaxLength(100);
        });

        modelBuilder.Entity<Role>(b =>
        {
            b.HasKey(u => u.RoleId);
            b.Property(e => e.Name).HasMaxLength(100);
        });
        
        base.OnModelCreating(modelBuilder); 
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseNpgsql(configuration.GetConnectionString("HumanResourcesDb"));
    }
}

public class User
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    
    public List<UserRole> UserRoles { get; set; } = [];
}

public class UserRole
{
    public Guid UserRoleId { get; set; }
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }

    public required User User { get; set; }
    public required Role Role { get; set; }
}

public class Role
{
    public Guid RoleId { get; set; }
    public string Name { get; set; } = null!;
}
