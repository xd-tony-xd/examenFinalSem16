import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/Auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const credentials = {
      correo: this.email.value,
      contrasena: this.password.value
    };

    this.authService.login(credentials.correo, credentials.contrasena).subscribe({
      next: (user) => {
        this.loading = false;
        
        // Redirigir según el rol
        if (user.rol === 'Admin') {
          this.router.navigate(['/admin-panel']);
        } else {
          this.router.navigate(['/user-panel']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      }
    });
  }
}