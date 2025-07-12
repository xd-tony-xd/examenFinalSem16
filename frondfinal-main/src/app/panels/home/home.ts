import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Producto } from '../../interfaces/entities/producto';
import { Categoria } from '../../interfaces/entities/categoria';
import { Productos } from '../../services/productos';
import { Categorias } from '../../services/categorias';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];
  categoriaSeleccionada: number | null = null;
  usuarioLogueado = false;

  constructor(
    private productosService: Productos,
    private categoriasService: Categorias,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioLogueado = !!localStorage.getItem('token');

    this.categoriasService.obtenerTodas().subscribe({
      next: data => this.categorias = data
    });

    this.productosService.obtenerTodos().subscribe({
      next: data => {
        this.productos = data;
        this.productosFiltrados = data;
      }
    });
  }

  seleccionarCategoria(id: number | null): void {
    this.categoriaSeleccionada = id;
    this.productosFiltrados = id
      ? this.productos.filter(p => p.categoriaId === id)
      : this.productos;
  }

  comprar(producto: Producto): void {
  if (!this.usuarioLogueado) {
    alert('Debes iniciar sesión para comprar');
  } else {
    alert(`Compraste: ${producto.nombre}`);
  }
}

}
