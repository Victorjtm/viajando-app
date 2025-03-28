import { Component, OnInit } from '@angular/core';
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
import { DatabaseService } from './services/database.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
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

  constructor(
    private database: DatabaseService,
    private platform: Platform
  ) {
    console.log('🔵 Constructor de AppComponent llamado');
    addIcons({ airplane, camera, images, settings, trash });

    // Inicializar la base de datos en el constructor
    this.initializeApp();
  }

  private async initializeApp() {
    console.log('🟢 initializeApp() ejecutándose');

    try {
      console.log('🕒 Esperando platform.ready()...');
      await this.platform.ready();
      console.log('✅ Platform ready');

      console.log('🔥 TEST: Inicializando base de datos...');
      await this.database.initDB();

      console.log('📦 Obteniendo viajes existentes...');
      const viajes = await this.database.getViajes();
      console.log('🔥 TEST: Viajes existentes:', JSON.stringify(viajes));

      console.log('🚀 App inicializada correctamente');
    } catch (error) {
      console.error('🔴 Error crítico:', error);
      throw error; // Propaga el error para verlo en consola
    }
  }
}
