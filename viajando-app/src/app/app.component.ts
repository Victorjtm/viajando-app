import { Component } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { airplane, camera, images, settings, trash } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp,
    IonRouterOutlet,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
  ],
  standalone: true
})
export class AppComponent {
  constructor() {
    // Registra todos los iconos que uses en la aplicación
    addIcons({
      airplane,  // Para el menú de viajes
      camera,    // Para generar recuerdos
      images,    // Para mis recuerdos
      settings,  // Para configuración
      trash      // Para el botón de eliminar
    });
  }
}