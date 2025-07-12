import { Producto } from './producto';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  productos?: Producto[];
}