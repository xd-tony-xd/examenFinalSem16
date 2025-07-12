import { Categoria } from './categoria';
import { Orden } from './orden';

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  estaActivo: boolean;
  categoriaId: number;
  fechaCreacion: Date;
  urlImagen?: string;
  categoria?: Categoria;
  ordenes?: Orden[];
}