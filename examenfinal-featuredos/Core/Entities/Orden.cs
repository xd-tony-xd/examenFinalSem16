namespace Core.Entities;

public class Orden
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public decimal Total { get; set; }
    public DateTime FechaOrden { get; set; } = DateTime.UtcNow;

    public Usuario? Usuario { get; set; } 
    public Producto? Producto { get; set; } 
}
