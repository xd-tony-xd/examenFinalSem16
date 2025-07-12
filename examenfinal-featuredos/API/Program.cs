using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Core.Entities;
using BCrypt.Net;
using API.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// ✅ CORS para Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")

              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ✅ Controllers con ciclos ignorados
builder.Services.AddControllers().AddJsonOptions(x =>
{
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    x.JsonSerializerOptions.WriteIndented = true;
});

// ✅ Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ DbContext
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// ✅ JWT Config
var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddAuthorization();

// ✅ Token service
builder.Services.AddScoped<TokenService>();

var app = builder.Build();

// ✅ Crear admin por defecto
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
    context.Database.Migrate();

    if (!context.Roles.Any())
    {
        context.Roles.AddRange(
            new Rol { Nombre = "Admin" },
            new Rol { Nombre = "Cliente" }
        );
        context.SaveChanges();
    }

    if (!context.Usuarios.Any(u => u.Rol.Nombre == "Admin"))
    {
        var adminRol = context.Roles.First(r => r.Nombre == "Admin");
        var admin = new Usuario
        {
            NombreUsuario = "admin",
            Correo = "admin@admin.com",
            ContrasenaHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            NombreCompleto = "Administrador",
            Telefono = "000000000",
            EstaActivo = true,
            RolId = adminRol.Id
        };
        context.Usuarios.Add(admin);
        context.SaveChanges();
    }
}

// ✅ Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ✅ Usar CORS antes de auth
app.UseCors("AllowAngularApp");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
