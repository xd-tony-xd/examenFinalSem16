using Core.Entities;
using Infraestructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class RolesController : ControllerBase
{
    private readonly StoreContext _context;

    public RolesController(StoreContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Rol>>> GetRoles()
    {
        return await _context.Roles.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Rol>> CrearRol(Rol rol)
    {
        _context.Roles.Add(rol);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetRoles), new { id = rol.Id }, rol);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> ActualizarRol(int id, Rol rol)
    {
        if (id != rol.Id) return BadRequest();
        _context.Entry(rol).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> EliminarRol(int id)
    {
        var rol = await _context.Roles.FindAsync(id);
        if (rol == null) return NotFound();
        _context.Roles.Remove(rol);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
