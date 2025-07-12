import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Categorias } from '../../../../services/categorias';
import { Categoria } from '../../../../interfaces/entities/categoria';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './categoria-form.html',
  styleUrls: ['./categoria-form.scss']
})
export class CategoriaForm implements OnInit {
  form: FormGroup;
  isEdit = false;
  categoriaId?: number;

  constructor(
    private fb: FormBuilder,
    private categoriasService: Categorias,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.categoriaId = this.route.snapshot.params['id'];
    if (this.categoriaId) {
      this.isEdit = true;
      this.cargarCategoria();
    }
  }

  cargarCategoria(): void {
    this.categoriasService.obtenerPorId(this.categoriaId!).subscribe({
      next: (categoria) => {
        this.form.patchValue({
          nombre: categoria.nombre,
          descripcion: categoria.descripcion
        });
      },
      error: (err) => {
        console.error('Error al cargar categoría', err);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.marcarCamposComoTouched();
      return;
    }

    const categoria: Categoria = this.form.value;

    if (this.isEdit) {
      this.actualizarCategoria(categoria);
    } else {
      this.crearCategoria(categoria);
    }
  }

  private crearCategoria(categoria: Categoria): void {
    this.categoriasService.crear(categoria).subscribe({
      next: () => {
        this.router.navigate(['/admin-panel'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('Error al crear categoría', err);
      }
    });
  }

  private actualizarCategoria(categoria: Categoria): void {
    const categoriaConId: Categoria = {
      ...categoria,
      id: this.categoriaId!
    };

    this.categoriasService.actualizar(this.categoriaId!, categoriaConId).subscribe({
      next: () => {
        this.router.navigate(['/admin-panel'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('Error al actualizar categoría', err);
      }
    });
  }

  private marcarCamposComoTouched(): void {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
