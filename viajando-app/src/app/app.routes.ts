import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'viajes-previstos', // Redirige a la página de "Viajes previstos"
    pathMatch: 'full',
  },
  {
    path: 'viajes-previstos',
    loadComponent: () =>
      import('./pages/viajes-previstos/viajes-previstos.page').then(
        (m) => m.ViajesPrevistosPage
      ),
  },
  {
    path: 'generar-recuerdo',
    loadComponent: () =>
      import('./pages/generar-recuerdo/generar-recuerdo.page').then(
        (m) => m.GenerarRecuerdoPage
      ),
  },
  {
    path: 'mis-recuerdos',
    loadComponent: () =>
      import('./pages/mis-recuerdos/mis-recuerdos.page').then(
        (m) => m.MisRecuerdosPage
      ),
  },
  {
    path: 'configuracion',
    loadComponent: () =>
      import('./pages/configuracion/configuracion.page').then(
        (m) => m.ConfiguracionPage
      ),
  },
];