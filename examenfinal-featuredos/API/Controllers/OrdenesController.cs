using Core.Entities;
using Infraestructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdenesController : ControllerBase
{
    private readonly StoreContext _context;

    public OrdenesController(StoreContext context)
    {
        _context = context;
    }

    // Admin ve todas las órdenes
    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<Orden>>> GetTodasOrdenes()
    {
        return await _context.Ordenes
            .Include(o => o.Usuario)
            .Include(o => o.Producto)
            .ToListAsync();
    }

    // Cliente ve solo sus órdenes
    [HttpGet("mias")]
    public async Task<ActionResult<IEnumerable<Orden>>> GetMisOrdenes()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        return await _context.Ordenes
            .Include(o => o.Producto)
            .Where(o => o.UsuarioId == userId)
            .ToListAsync();
    }

    // Cliente crea una orden
    [HttpPost]
    public async Task<ActionResult<Orden>> CrearOrden(Orden orden)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var producto = await _context.Productos.FindAsync(orden.ProductoId);
        if (producto == null || !producto.EstaActivo || producto.Stock < orden.Cantidad)
            return BadRequest("Producto no disponible o stock insuficiente.");

        orden.UsuarioId = userId;
        orden.Total = producto.Precio * orden.Cantidad;
        orden.FechaOrden = DateTime.UtcNow;

        producto.Stock -= orden.Cantidad;

        _context.Ordenes.Add(orden);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMisOrdenes), new { }, orden);
    }
}
