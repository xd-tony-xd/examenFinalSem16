namespace Core.Entities;

public class Producto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = null!;
    public string? Descripcion { get; set; }
    public decimal Precio { get; set; }
    public int Stock { get; set; }
    public bool EstaActivo { get; set; } = true;
    public int CategoriaId { get; set; }
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public string? UrlImagen { get; set; }
    public Categoria? Categoria { get; set; }

    public ICollection<Orden> Ordenes { get; set; } = new List<Orden>();
}
