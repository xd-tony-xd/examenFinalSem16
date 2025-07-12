    namespace Core.Entities;

    public class Usuario
    {
        public int Id { get; set; }

        public string NombreUsuario { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public string ContrasenaHash { get; set; } = null!;

        public string NombreCompleto { get; set; } = null!;
        public string Telefono { get; set; } = string.Empty;

        public int RolId { get; set; }
        public bool EstaActivo { get; set; } = true;
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        public Rol Rol { get; set; } = null!;
        public ICollection<Orden> Ordenes { get; set; } = new List<Orden>();
    }
