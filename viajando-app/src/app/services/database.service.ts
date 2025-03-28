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
  private webStorage = new Map<string, Viaje[]>();
  private isInitialized = false;

  constructor() {
    this.initWebData();
  }

  private initWebData(): void {
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
    if (this.isInitialized) {
      console.log('Base de datos ya inicializada');
      return;
    }

    if (this.isNative) {
      try {
        console.log('🟢 Inicializando SQLite...');
        const ret = await CapacitorSQLite.createConnection({
          database: 'viajesDB',
          version: 1
        });
        this.db = (ret as any).connection as SQLiteDBConnection;
        await this.db.open();
        await this.createTable();

        // Verificación
        const tables = await this.db.query('SELECT name FROM sqlite_master WHERE type="table"');
        console.log('📦 Tablas existentes:', tables.values);

        this.isInitialized = true;
        console.log('✅ SQLite inicializada correctamente');
      } catch (error) {
        console.error('🔴 Error al iniciar SQLite:', error);
        throw error;
      }
    } else {
      console.log('🌐 Modo web: usando almacenamiento en memoria');
      this.isInitialized = true;
    }
  }

  private async createTable(): Promise<void> {
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS viajes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        destino TEXT NOT NULL,
        fecha INTEGER NOT NULL,
        descripcion TEXT
      );
    `);
    console.log('🟡 Tabla "viajes" verificada');
  }

  async getViajes(): Promise<Viaje[]> {
    if (!this.isInitialized) await this.initDB();

    if (this.isNative) {
      const res = await this.db.query('SELECT * FROM viajes');
      return res.values?.map(v => ({
        id: v.id,
        destino: v.destino,
        fecha: v.fecha,
        descripcion: v.descripcion
      })) || [];
    }
    return this.webStorage.get('viajes') || [];
  }

  async addViaje(destino: string, fecha: string, descripcion: string = ''): Promise<void> {
    if (!this.isInitialized) await this.initDB();

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
    if (!this.isInitialized) await this.initDB();

    if (this.isNative) {
      await this.db.run('DELETE FROM viajes WHERE id = ?', [id]);
    } else {
      const viajes = (this.webStorage.get('viajes') || []).filter(v => v.id !== id);
      this.webStorage.set('viajes', viajes);
    }
    console.log('🗑️ Viaje eliminado ID:', id);
  }

  async updateViaje(id: number, destino: string, fecha: string, descripcion: string): Promise<void> {
    if (!this.isInitialized) await this.initDB();

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
    console.log('✏️ Viaje actualizado ID:', id);
  }
}
