import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Orden } from '../interfaces/entities/orden';
import { ApiResponse } from '../interfaces/dtos/responses';


@Injectable({
  providedIn: 'root'
})
export class Ordenes {
  private apiUrl = `${environment.apiUrl}/ordenes`;

  constructor(private http: HttpClient) { }

  obtenerTodas(): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/admin`);
  }

  obtenerMisOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/mias`);
  }

  crear(orden: Orden): Observable<ApiResponse<Orden>> {
    return this.http.post<ApiResponse<Orden>>(this.apiUrl, orden);
  }
}