import { Usuario } from './usuario';

export interface Rol {
  id: number;
  nombre: string;
  usuarios?: Usuario[];
}