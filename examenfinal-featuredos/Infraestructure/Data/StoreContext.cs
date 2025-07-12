using System;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Data;

public class StoreContext(DbContextOptions<StoreContext> options) : DbContext(options)
{
     public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Rol> Roles { get; set; }
    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Producto> Productos { get; set; }
    public DbSet<Orden> Ordenes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Puedes mover estas configuraciones a clases separadas si lo prefieres (usando IEntityTypeConfiguration)
        modelBuilder.Entity<Usuario>()
            .HasOne(u => u.Rol)
            .WithMany(r => r.Usuarios)
            .HasForeignKey(u => u.RolId);

        modelBuilder.Entity<Producto>()
            .HasOne(p => p.Categoria)
            .WithMany(c => c.Productos)
            .HasForeignKey(p => p.CategoriaId);

        modelBuilder.Entity<Orden>()
            .HasOne(o => o.Usuario)
            .WithMany(u => u.Ordenes)
            .HasForeignKey(o => o.UsuarioId);

        modelBuilder.Entity<Orden>()
            .HasOne(o => o.Producto)
            .WithMany(p => p.Ordenes)
            .HasForeignKey(o => o.ProductoId);

        // Opcional: establecer valores por defecto o restricciones
        modelBuilder.Entity<Rol>().HasData(
            new Rol { Id = 1, Nombre = "Admin" },
            new Rol { Id = 2, Nombre = "Usuario" }
        );
    }
  
}
