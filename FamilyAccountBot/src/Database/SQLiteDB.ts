import { IDatabase } from './IDatabase';
import { initDB } from './InitDB';
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';

export class SQLiteDB implements IDatabase {
  private db: Database | null = null;

  constructor(private database: string) { }

  async open() {
    this.db = await open({
      filename: this.database,
      driver: sqlite3.Database,
    });
    
    await initDB(this);
  }

  async run(query: string, params: any[] = []) {
    if (!this.db) {
      throw new Error("Database is not open");
    }
    await this.db.run(query, ...params);
  }

  async get(query: string, params: any[] = []): Promise<any> {
    if (!this.db) {
      throw new Error("Database is not open");
    }
    return this.db.get(query, ...params);
  }

  async all(query: string, params: any[] = []): Promise<any[]> {
    if (!this.db) {
      throw new Error("Database is not open");
    }
    return this.db.all(query, ...params);
  }
}
