using API.Services;
using BCrypt.Net;
using Core.DTOs;
using Core.Entities;
using Infraestructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly StoreContext _context;
        private readonly TokenService _tokenService;

        public AuthController(StoreContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("registro")]
        public async Task<ActionResult<UsuarioRespuestaDto>> Registrar(UsuarioRegistroDto dto)
        {
            if (await _context.Usuarios.AnyAsync(x => x.Correo == dto.Correo))
                return BadRequest("Ya existe un usuario con ese correo.");

            var rolCliente = await _context.Roles.FirstOrDefaultAsync(r => r.Nombre == "Usuario");
            if (rolCliente == null)
                return BadRequest("Rol Cliente no existe.");

            var usuario = new Usuario
            {
                NombreUsuario = dto.NombreUsuario,
                Correo = dto.Correo,
                ContrasenaHash = BCrypt.Net.BCrypt.HashPassword(dto.Contrasena),
                NombreCompleto = dto.NombreCompleto,
                Telefono = dto.Telefono,
                RolId = rolCliente.Id
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return new UsuarioRespuestaDto
            {
                Id = usuario.Id,
                NombreUsuario = usuario.NombreUsuario,
                Correo = usuario.Correo,
                NombreCompleto = usuario.NombreCompleto,
                Telefono = usuario.Telefono,
                Rol = rolCliente.Nombre
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UsuarioLoginDto dto)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(x => x.Correo == dto.Correo);

            if (usuario == null || !usuario.EstaActivo)
                return Unauthorized("Credenciales inválidas");

            if (!BCrypt.Net.BCrypt.Verify(dto.Contrasena, usuario.ContrasenaHash))
                return Unauthorized("Credenciales inválidas");

            var token = _tokenService.CrearToken(usuario, usuario.Rol.Nombre);
            return Ok(token);
        }

        [HttpPost("registrar-admin")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UsuarioRespuestaDto>> RegistrarAdmin(UsuarioRegistroDto dto)
        {
            if (await _context.Usuarios.AnyAsync(x => x.Correo == dto.Correo))
                return BadRequest("Ya existe un usuario con ese correo.");

            var rolAdmin = await _context.Roles.FirstOrDefaultAsync(r => r.Nombre == "Admin");
            if (rolAdmin == null)
                return BadRequest("Rol Admin no existe.");

            var usuario = new Usuario
            {
                NombreUsuario = dto.NombreUsuario,
                Correo = dto.Correo,
                ContrasenaHash = BCrypt.Net.BCrypt.HashPassword(dto.Contrasena),
                NombreCompleto = dto.NombreCompleto,
                Telefono = dto.Telefono,
                RolId = rolAdmin.Id
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return new UsuarioRespuestaDto
            {
                Id = usuario.Id,
                NombreUsuario = usuario.NombreUsuario,
                Correo = usuario.Correo,
                NombreCompleto = usuario.NombreCompleto,
                Telefono = usuario.Telefono,
                Rol = rolAdmin.Nombre
            };
        }
    }
}
