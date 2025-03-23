import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, IonButton, IonList, IonItem, IonLabel, IonIcon } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-viajes-previstos',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  templateUrl: './viajes-previstos.page.html',
  styleUrls: ['./viajes-previstos.page.scss'],
})
export class ViajesPrevistosPage implements OnInit {
  viajes: any[] = [];

  constructor(private db: DatabaseService, private alertCtrl: AlertController) {}

  async ngOnInit() {
    await this.db.initDB();
    await this.db.seedViajes();  // Este método solo se usa para inicializar datos de prueba, puedes eliminarlo si no lo necesitas
    await this.loadViajes();  // Carga los viajes de la base de datos
  }

  // Método para cargar los viajes desde la base de datos
  async loadViajes() {
    this.viajes = await this.db.getViajes();
  }

  // Método para añadir un nuevo viaje
  async addViaje() {
    const alert = await this.alertCtrl.create({
      header: 'Nuevo viaje',
      inputs: [
        { name: 'destino', placeholder: 'Destino', type: 'text' },
        { name: 'fecha', placeholder: 'Fecha', type: 'date' },
        { name: 'descripcion', placeholder: 'Descripción', type: 'textarea' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async data => {
            await this.db.addViaje(data.destino, data.fecha, data.descripcion);  // Inserta el nuevo viaje en la base de datos
            await this.loadViajes();  // Vuelve a cargar la lista de viajes
          }
        }
      ]
    });
    await alert.present();
  }

  // Método para eliminar un viaje
  async deleteViaje(id: number) {
    await this.db.deleteViaje(id);  // Elimina el viaje de la base de datos
    await this.loadViajes();  // Vuelve a cargar la lista de viajes
  }
}
