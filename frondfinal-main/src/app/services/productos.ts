import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto } from '../interfaces/entities/producto';
import { ApiResponse } from '../interfaces/dtos/responses';


@Injectable({
  providedIn: 'root'
})
export class Productos {
  private apiUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  crear(producto: Producto): Observable<ApiResponse<Producto>> {
    return this.http.post<ApiResponse<Producto>>(this.apiUrl, producto);
  }

  actualizar(id: number, producto: Producto): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, producto);
  }

  eliminar(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}