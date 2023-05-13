import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';

export class SQLiteDB {
  private db: Database | null = null;

  constructor(private database: string) { }

  async open() {
    this.db = await open({
      filename: this.database,
      driver: sqlite3.Database,
    });
    await this.db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        spending_uah REAL DEFAULT 0,
        spending_eur REAL DEFAULT 0
      )`
    );
  }

  async addUser(id: string, name: string) {
    if (!this.db) {
      throw new Error("Database is not open");
    }
    await this.db.run(
      `INSERT OR IGNORE INTO users (id, name) VALUES (?, ?)`,
      id,
      name
    );
  }

  async getUserSpending(id: string) {
    if (!this.db) {
      throw new Error("Database is not open");
    }
    return this.db.get(
      `SELECT * FROM users WHERE id = ?`,
      id
    );
  }

  async updateUserSpending(id: string, currency: string, amount: number) {
    if (!this.db) {
      throw new Error("Database is not open");
    }
    const column = currency === 'UAH' ? 'spending_uah' : 'spending_eur';
    await this.db.run(
      `UPDATE users SET ${column} = ${column} + ? WHERE id = ?`,
      amount,
      id
    );
  }

  async resetUserSpending(id: string) {
    if (!this.db) {
      throw new Error("Database is not open");
    }
    await this.db.run(
      `UPDATE users SET spending_uah = 0, spending_eur = 0 WHERE id = ?`,
      id
    );
  }

  async getAllUsers() {
    if (!this.db) {
      throw new Error("Database is not open");
    }
    return this.db.all(
      `SELECT * FROM users`
    );
  }
}
