namespace Core.DTOs;

public class UsuarioRespuestaDto
{
    public int Id { get; set; }
    public string NombreUsuario { get; set; } = null!;
    public string Correo { get; set; } = null!;
    public string NombreCompleto { get; set; } = null!;
    public string Telefono { get; set; } = string.Empty;
    public string Rol { get; set; } = null!;
}
