import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Categoria } from '../../../../interfaces/entities/categoria';
import { Categorias } from '../../../../services/categorias';


@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categoria-list.html',
  styleUrls: ['./categoria-list.scss']
})
export class CategoriaList {
  categorias: Categoria[] = [];
  
  constructor(private categoriasService: Categorias) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriasService.obtenerTodas().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  eliminarCategoria(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoriasService.eliminar(id).subscribe({
        next: () => this.categorias = this.categorias.filter(c => c.id !== id),
        error: (err) => console.error('Error al eliminar categoría', err)
      });
    }
  }
}