import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface User {
  id: number;
  nombreUsuario: string;
  correo: string;
  rol: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAdmin(): boolean {
    return this.currentUserValue?.rol === 'Admin';
  }

  public get isUser(): boolean {
    return this.currentUserValue?.rol === 'Usuario';
  }

  login(correo: string, contrasena: string): Observable<User> {
    return this.http.post(`${this.apiUrl}/auth/login`, { correo, contrasena }, { responseType: 'text' })
      .pipe(
        map((token: string) => {
          const user = this.decodeJwtToken(token.trim());
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.redirectBasedOnRole(user.rol);
          return user;
        })
      );
  }

  private decodeJwtToken(token: string): User {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: parseInt(payload.sub),
      nombreUsuario: payload.nombreUsuario,
      correo: payload.email,
      rol: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      token: token
    };
  }

  private redirectBasedOnRole(role: string): void {
    switch(role) {
      case 'Admin':
        this.router.navigate(['/admin-panel']);
        break;
      case 'Usuario':
        this.router.navigate(['/user-panel']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  // Agrega este nuevo método para registro
  registrar(usuario: {
    nombreUsuario: string;
    correo: string;
    contrasena: string;
    nombreCompleto: string;
    telefono: string;
  }): Observable<User> {
    return this.http.post(`${this.apiUrl}/auth/registro`, usuario, { responseType: 'text' })
      .pipe(
        map((token: string) => {
          const user = this.decodeJwtToken(token.trim());
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.redirectBasedOnRole(user.rol);
          return user;
        })
      );
  }
}