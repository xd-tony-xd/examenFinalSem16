namespace Core.Entities;

public class Rol
{
    public int Id { get; set; }
    public string Nombre { get; set; } = null!; // Admin o Cliente

    public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
