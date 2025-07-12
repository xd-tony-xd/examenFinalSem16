import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/Auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.scss']
})
export class AdminPanel implements OnInit {
  nombreAdmin: string = 'Administrador';
  fechaAcceso: string;

  constructor(private authService: AuthService, private router: Router) {
    this.fechaAcceso = new Date().toLocaleString('es-ES');
  }

  ngOnInit(): void {
    if (!this.authService.isAdmin) {
      this.router.navigate(['/']);
      return;
    }

    const userData = this.authService.currentUserValue;
    if (userData && userData.nombreUsuario) {
      this.nombreAdmin = userData.nombreUsuario;
    } else if (userData && userData.correo) {
      this.nombreAdmin = userData.correo.split('@')[0];
    }
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
