import { IUserDAO } from './IUserDAO';
import { User } from '../Models/User';
import { IDatabase } from '../Database/IDatabase';

export class UserDAO implements IUserDAO {
  constructor(private db: IDatabase) {}

  async addUser(user: User): Promise<User> {
    const sql = 'INSERT OR IGNORE INTO users (id, name) VALUES (?, ?)';
    const params = [user.id, user.name];
    await this.db.run(sql, params);

    return user;
  }

  async getUser(id: string): Promise<User | undefined> {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const user = await this.db.get(sql, [id]);
    return user ? new User(user.id, user.name) : undefined;
  }

  async updateUser(user: User): Promise<void> {
    const sql = 'UPDATE users SET name = ? WHERE id = ?';
    const params = [user.name, user.id];
    await this.db.run(sql, params);
  }

  async deleteUser(id: string): Promise<void> {
    const sql = 'DELETE FROM users WHERE id = ?';
    await this.db.run(sql, [id]);
  }

  async getAllUsers(): Promise<User[]> {
    const sql = 'SELECT * FROM users';
    const rows = await this.db.all(sql);
    return rows.map(row => new User(row.id, row.name));
  }
}
