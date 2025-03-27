import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  AlertController, 
  IonButton, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonIcon, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButtons,
  IonMenuButton
} from '@ionic/angular/standalone';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-viajes-previstos',
  templateUrl: './viajes-previstos.page.html',
  styleUrls: ['./viajes-previstos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonButtons,
    IonMenuButton
  ]
})
export class ViajesPrevistosPage implements OnInit {
  viajes: any[] = [];

  constructor(
    private db: DatabaseService,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await this.db.initDB();
      await this.loadViajes();
    } catch (error) {
      console.error('Error inicializando base de datos:', error);
    }
  }

  async loadViajes(): Promise<void> {
    this.viajes = await this.db.getViajes();
    console.log('Viajes cargados:', this.viajes);
  }

  async addViaje(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Nuevo viaje',
      inputs: [
        { 
          name: 'destino', 
          placeholder: 'Destino', 
          type: 'text',
          attributes: {
            required: true
          }
        },
        { 
          name: 'fecha', 
          type: 'date',
          attributes: {
            required: true
          }
        },
        { 
          name: 'descripcion', 
          placeholder: 'Descripción (opcional)', 
          type: 'textarea' 
        }
      ],
      buttons: [
        { 
          text: 'Cancelar', 
          role: 'cancel' 
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (data.destino && data.fecha) {
              await this.db.addViaje(data.destino, data.fecha, data.descripcion || '');
              await this.loadViajes();
              return true;
            }
            return false;
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteViaje(id: number): Promise<void> {
    await this.db.deleteViaje(id);
    await this.loadViajes();
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}