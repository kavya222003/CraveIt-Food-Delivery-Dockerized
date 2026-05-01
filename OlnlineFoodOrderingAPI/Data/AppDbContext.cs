using Microsoft.EntityFrameworkCore;
using OlnlineFoodOrderingAPI.Models;

namespace OlnlineFoodOrderingAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }  
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.MenuItem)
                .WithMany()
                .HasForeignKey(oi => oi.ItemId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<MenuItem>()
                .Property(m => m.Price).HasPrecision(10, 2);

            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount).HasPrecision(10, 2);

            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.UnitPrice).HasPrecision(10, 2);

            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount).HasPrecision(10, 2);
        }
    }
}