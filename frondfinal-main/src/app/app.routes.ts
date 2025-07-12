import { Routes } from '@angular/router';
import { Home } from './panels/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';


// import { roleGuard } from './auth/guards/role.guard';

export const routes: Routes = [
  // HOME Y LOGIN
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // PANELES
  {
    path: 'admin-panel',
    loadComponent: () =>
      import('./panels/admin-panel/admin-panel').then((m) => m.AdminPanel),
    // canActivate: [roleGuard], data: { roles: ['Admin'] }
  },
  {
    path: 'user-panel',
    loadComponent: () =>
      import('./panels/user-panel/user-panel').then((m) => m.UserPanel),
    // canActivate: [roleGuard], data: { roles: ['User', 'Admin'] }
  },

  // CATEGORÍAS
  {
    path: 'categorias',
    loadComponent: () =>
      import('./panels/admin/categorias/categoria-list/categoria-list').then(
        (m) => m.CategoriaList
      ),
  },
  {
    path: 'categorias/nueva',
    loadComponent: () =>
      import('./panels/admin/categorias/categoria-form/categoria-form').then(
        (m) => m.CategoriaForm
      ),
  },
  {
    path: 'categorias/editar/:id',
    loadComponent: () =>
      import('./panels/admin/categorias/categoria-form/categoria-form').then(
        (m) => m.CategoriaForm
      ),
  },

  // PRODUCTOS
  {
    path: 'productos',
    loadComponent: () =>
      import('./panels/admin/productos/producto-list/producto-list').then(
        (m) => m.ProductoList
      ),
  },
  {
    path: 'productos/nuevo',
    loadComponent: () =>
      import('./panels/admin/productos/producto-form/producto-form').then(
        (m) => m.ProductoForm
      ),
  },
  {
    path: 'productos/editar/:id',
    loadComponent: () =>
      import('./panels/admin/productos/producto-form/producto-form').then(
        (m) => m.ProductoForm
      ),
  },

  // USUARIOS
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./panels/admin/usuarios/usuario-list/usuario-list').then(
        (m) => m.UsuarioList
      ),
  },
  {
    path: 'usuarios/nuevo',
    loadComponent: () =>
      import('./panels/admin/usuarios/usuario-form/usuario-form').then(
        (m) => m.UsuarioForm
      ),
  },
  {
    path: 'usuarios/editar/:id',
    loadComponent: () =>
      import('./panels/admin/usuarios/usuario-form/usuario-form').then(
        (m) => m.UsuarioForm
      ),
  },

  // ÓRDENES
  {
    path: 'ordenes',
    loadComponent: () =>
      import('./panels/admin/ordenes/orden-list/orden-list').then(
        (m) => m.OrdenList
      ),
  },

  // WILDCARD
  { path: '**', redirectTo: 'home' },
];
