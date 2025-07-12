import { Rol } from './rol';
import { Orden } from './orden';

export interface Usuario {
  id: number;
  nombreUsuario: string;
  correo: string;
  contrasenaHash: string;
  nombreCompleto: string;
  telefono: string;
  rolId: number;
  estaActivo: boolean;
  fechaCreacion: Date;
  rol: Rol;
  ordenes?: Orden[];
}