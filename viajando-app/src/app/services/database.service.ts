import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private db!: SQLiteDBConnection;

  async initDB(): Promise<void> {
    const sqlite = CapacitorSQLite;
    const ret = await sqlite.createConnection({ database: 'viajesDB', version: 1 });
    this.db = (ret as any).connection as SQLiteDBConnection;
    await this.db.open();
    await this.createTable();
  }

  private async createTable(): Promise<void> {
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS viajes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        destino TEXT NOT NULL,
        fecha INTEGER NOT NULL,  -- Usamos INTEGER para la fecha
        descripcion TEXT
      );
    `);
  }

  async seedViajes() {
    const viajes = await this.getViajes();
    if (viajes.length === 0) {
      const sql = `
        INSERT INTO viajes (destino, fecha, descripcion) VALUES 
        ('Viaje a París', ${new Date('2025-04-15').getTime()}, 'Visita a la Torre Eiffel y museos'),
        ('Excursión a los Pirineos', ${new Date('2025-03-30').getTime()}, 'Senderismo y naturaleza'),
        ('Fin de semana en Valencia', ${new Date('2025-05-10').getTime()}, 'Playas y gastronomía');
      `;
      await this.db.execute(sql);
    }
  }

  async getViajes() {
    const res = await this.db.query('SELECT * FROM viajes');
    return res.values || [];
  }

  async addViaje(destino: string, fecha: string, descripcion: string) {
    const timestamp = new Date(fecha).getTime();
    await this.db.run('INSERT INTO viajes (destino, fecha, descripcion) VALUES (?, ?, ?)', [destino, timestamp, descripcion]);
  }

  async deleteViaje(id: number) {
    await this.db.run('DELETE FROM viajes WHERE id = ?', [id]);
  }

  async updateViaje(id: number, destino: string, fecha: string, descripcion: string) {
    const timestamp = new Date(fecha).getTime();
    await this.db.run('UPDATE viajes SET destino = ?, fecha = ?, descripcion = ? WHERE id = ?', [destino, timestamp, descripcion, id]);
  }
}
