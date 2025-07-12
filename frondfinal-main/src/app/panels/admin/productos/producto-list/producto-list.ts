import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Producto } from '../../../../interfaces/entities/producto';
import { Categoria } from '../../../../interfaces/entities/categoria';
import { Productos } from '../../../../services/productos';
import { Categorias } from '../../../../services/categorias';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './producto-list.html',
  styleUrls: ['./producto-list.scss']
})
export class ProductoList implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  loading = true;

  constructor(
    private productosService: Productos,
    private categoriasService: Categorias
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos(): void {
    this.productosService.obtenerTodos().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.loading = false;
      }
    });
  }

  cargarCategorias(): void {
    this.categoriasService.obtenerTodas().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  obtenerNombreCategoria(categoriaId: number): string {
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nombre : 'Sin categoría';
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productosService.eliminar(id).subscribe({
        next: () => this.productos = this.productos.filter(p => p.id !== id),
        error: (err) => console.error('Error al eliminar producto', err)
      });
    }
  }

  formatearMoneda(precio: number): string {
    return '$' + precio.toFixed(2);
  }
}