namespace Core.DTOs;

public class UsuarioRegistroDto
{
    public string NombreUsuario { get; set; } = null!;
    public string Correo { get; set; } = null!;
    public string Contrasena { get; set; } = null!;
    public string NombreCompleto { get; set; } = null!;
    public string Telefono { get; set; } = string.Empty;
}
