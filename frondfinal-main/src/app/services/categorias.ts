import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categoria } from '../interfaces/entities/categoria';
import { ApiResponse } from '../interfaces/dtos/responses';


@Injectable({
  providedIn: 'root'
})
export class Categorias {
  private apiUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) { }

  obtenerTodas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  crear(categoria: Categoria): Observable<ApiResponse<Categoria>> {
    return this.http.post<ApiResponse<Categoria>>(this.apiUrl, categoria);
  }

  actualizar(id: number, categoria: Categoria): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, categoria);
  }

  eliminar(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}