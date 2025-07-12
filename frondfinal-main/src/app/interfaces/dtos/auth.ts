export interface UsuarioLoginDto {
  correo: string;
  contrasena: string;
}

export interface UsuarioRegistroDto {
  nombreUsuario: string;
  correo: string;
  contrasena: string;
  nombreCompleto: string;
  telefono: string;
}