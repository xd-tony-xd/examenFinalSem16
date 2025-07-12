import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/Auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      nombreCompleto: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid || this.f['password'].value !== this.f['confirmPassword'].value) {
      this.errorMessage = 'Verifica los datos y asegúrate que las contraseñas coincidan.';
      return;
    }

    const data = {
      nombreUsuario: this.f['username'].value,
      correo: this.f['email'].value,
      contrasena: this.f['password'].value,
      nombreCompleto: this.f['nombreCompleto'].value,
      telefono: this.f['telefono'].value
    };

    this.loading = true;

    this.authService.registrar(data).subscribe({
      next: () => {
        this.successMessage = 'Registro exitoso. Redirigiendo al login...';
        this.registerForm.reset();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.errorMessage = 'Registro exitoso';
        this.loading = false;
      }
    });
  }
}
