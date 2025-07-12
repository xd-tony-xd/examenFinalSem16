import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Producto } from '../../interfaces/entities/producto';
import { Categoria } from '../../interfaces/entities/categoria';
import { Productos } from '../../services/productos';
import { Categorias } from '../../services/categorias';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-panel.html',
  styleUrls: ['./user-panel.scss']
})
export class UserPanel implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];
  categoriaSeleccionada: number | null = null;
  

  constructor(
    private router: Router,
    private productosService: Productos,
    private categoriasService: Categorias
  ) {}

  ngOnInit(): void {
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
    const mensaje = `Hola, estoy interesado en comprar el producto: ${producto.nombre} por S/ ${producto.precio}`;
    const numero = '51969130423';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }
  cerrarSesion(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  this.router.navigate(['/home']);
}

}
