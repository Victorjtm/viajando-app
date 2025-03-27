import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';

interface Viaje {
  id: number;
  destino: string;
  fecha: number;
  descripcion?: string;
}

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private db!: SQLiteDBConnection;
  private readonly isNative = Capacitor.isNativePlatform();
  private webStorage = new Map<string, Viaje[]>(); // Fallback simple para web

  constructor() {
    // Inicializa con datos de prueba en web
    if (!this.isNative && !this.webStorage.has('viajes')) {
      this.webStorage.set('viajes', [
        {
          id: 1,
          destino: 'París',
          fecha: new Date('2024-12-01').getTime(),
          descripcion: 'Tour por la Torre Eiffel'
        },
        {
          id: 2,
          destino: 'Tokio',
          fecha: new Date('2025-03-15').getTime(),
          descripcion: 'Visita al Monte Fuji'
        }
      ]);
    }
  }

  async initDB(): Promise<void> {
    if (this.isNative) {
      try {
        const ret = await CapacitorSQLite.createConnection({ 
          database: 'viajesDB', 
          version: 1 
        });
        this.db = (ret as any).connection as SQLiteDBConnection;
        await this.db.open();
        await this.createTable();
        console.log('✅ SQLite inicializada en modo nativo');
      } catch (error) {
        console.error('❌ Error al iniciar SQLite:', error);
        throw error;
      }
    } else {
      console.log('✅ Modo web: usando almacenamiento en memoria');
    }
  }

  private async createTable(): Promise<void> {
    if (!this.isNative) return;

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS viajes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        destino TEXT NOT NULL,
        fecha INTEGER NOT NULL,
        descripcion TEXT
      );
    `);
  }

  async getViajes(): Promise<Viaje[]> {
    if (this.isNative) {
      const res = await this.db.query('SELECT * FROM viajes');
      return res.values?.map(v => ({
        id: v.id,
        destino: v.destino,
        fecha: v.fecha,
        descripcion: v.descripcion
      })) || [];
    } else {
      return this.webStorage.get('viajes') || [];
    }
  }

  async addViaje(destino: string, fecha: string, descripcion: string = ''): Promise<void> {
    const timestamp = new Date(fecha).getTime();
    
    if (this.isNative) {
      await this.db.run(
        'INSERT INTO viajes (destino, fecha, descripcion) VALUES (?, ?, ?)', 
        [destino, timestamp, descripcion]
      );
    } else {
      const viajes = this.webStorage.get('viajes') || [];
      viajes.push({
        id: Date.now(),
        destino,
        fecha: timestamp,
        descripcion
      });
      this.webStorage.set('viajes', viajes);
    }
    console.log('✅ Viaje añadido:', { destino, fecha: timestamp });
  }

  async deleteViaje(id: number): Promise<void> {
    if (this.isNative) {
      await this.db.run('DELETE FROM viajes WHERE id = ?', [id]);
    } else {
      const viajes = (this.webStorage.get('viajes') || []).filter(v => v.id !== id);
      this.webStorage.set('viajes', viajes);
    }
    console.log('✅ Viaje eliminado ID:', id);
  }

  async updateViaje(id: number, destino: string, fecha: string, descripcion: string): Promise<void> {
    const timestamp = new Date(fecha).getTime();

    if (this.isNative) {
      await this.db.run(
        'UPDATE viajes SET destino = ?, fecha = ?, descripcion = ? WHERE id = ?', 
        [destino, timestamp, descripcion, id]
      );
    } else {
      const viajes = this.webStorage.get('viajes') || [];
      const index = viajes.findIndex(v => v.id === id);
      if (index >= 0) {
        viajes[index] = { ...viajes[index], destino, fecha: timestamp, descripcion };
        this.webStorage.set('viajes', viajes);
      }
    }
    console.log('✅ Viaje actualizado ID:', id);
  }
}