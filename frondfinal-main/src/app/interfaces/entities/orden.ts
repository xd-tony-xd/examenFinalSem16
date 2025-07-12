import { Usuario } from './usuario';
import { Producto } from './producto';

export interface Orden {
  id: number;
  usuarioId: number;
  productoId: number;
  cantidad: number;
  total: number;
  fechaOrden: Date;
  usuario?: Usuario;
  producto?: Producto;
}