import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Categoria } from '../../../../interfaces/entities/categoria';
import { Productos } from '../../../../services/productos';
import { Categorias } from '../../../../services/categorias';
import { Producto } from '../../../../interfaces/entities/producto';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './producto-form.html',
  styleUrls: ['./producto-form.scss']
})
export class ProductoForm implements OnInit {
  form: FormGroup;
  isEdit = false;
  productoId?: number;
  categorias: Categoria[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private productosService: Productos,
    private categoriasService: Categorias,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', Validators.maxLength(500)],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoriaId: [null, Validators.required],
      estaActivo: [true],
      urlImagen: ['']
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();
    this.productoId = +this.route.snapshot.params['id'];
    
    if (this.productoId && this.productoId > 0) {
      this.isEdit = true;
      this.cargarProducto();
    }
  }

  cargarCategorias(): void {
    this.categoriasService.obtenerTodas().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  cargarProducto(): void {
    this.loading = true;
    this.productosService.obtenerPorId(this.productoId!).subscribe({
      next: (producto) => {
        this.form.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          stock: producto.stock,
          categoriaId: producto.categoriaId,
          estaActivo: producto.estaActivo,
          urlImagen: producto.urlImagen
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        this.loading = false;
        this.router.navigate(['../'], { relativeTo: this.route });
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      this.form.patchValue({ urlImagen: base64 });
    };

    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.marcarCamposComoTouched();
      return;
    }

    this.loading = true;
    const productoData: Producto = {
      ...this.form.value,
      id: this.productoId || 0,
      categoriaId: Number(this.form.value.categoriaId)
    };

    if (this.isEdit) {
      this.actualizarProducto(productoData);
    } else {
      this.crearProducto(productoData);
    }
  }

  private crearProducto(producto: Producto): void {
    this.productosService.crear(producto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin-panel'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('Error al crear producto:', err);
        alert(`Error al crear: ${err.error?.message || 'Verifica los datos'}`);
        this.loading = false;
      }
    });
  }

  private actualizarProducto(producto: Producto): void {
    this.productosService.actualizar(producto.id, producto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin-panel'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('Error al actualizar producto:', err);
        alert(`Error al actualizar: ${err.error?.message || 'Verifica los datos'}`);
        this.loading = false;
      }
    });
  }

  private marcarCamposComoTouched(): void {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
