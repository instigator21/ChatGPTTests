import { IDatabase } from './IDatabase';

export async function initDB(db: IDatabase) {
  await db.run(
    `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT
      )`
  );

  await db.run(
    `CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      )`
  );

  await db.run(
    `CREATE TABLE IF NOT EXISTS spendings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        category_id INTEGER,
        amount REAL,
        currency TEXT,
        paid_off INTEGER DEFAULT 0,
        timestamp TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(category_id) REFERENCES categories(id)
      )`
  );

  // Add default category if not exists
  const defaultCategory = await db.get("SELECT * FROM categories WHERE id = ?", [1]);
  if (!defaultCategory) {
    await db.run("INSERT INTO categories (id, name) VALUES (?, ?)", [1, 'default']);
  }  
}
