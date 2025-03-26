import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss']  // Cambié de .css a .scss
})
export class ConfiguracionPage {}

