import { SQLiteDB } from './Database';

export interface IUserDAO {
  addUser(id: string, name: string): Promise<void>;
  getUserSpending(id: string): Promise<any>;
  updateUserSpending(id: string, currency: string, amount: number): Promise<void>;
  resetUserSpending(id: string): Promise<void>;
  getAllUsers(): Promise<any>;
}

export class UserDAO implements IUserDAO {
  constructor(private db: SQLiteDB) {}

  async addUser(id: string, name: string): Promise<void> {
    return this.db.addUser(id, name);
  }

  async getUserSpending(id: string): Promise<any> {
    return this.db.getUserSpending(id);
  }

  async updateUserSpending(id: string, currency: string, amount: number): Promise<void> {
    return this.db.updateUserSpending(id, currency, amount);
  }

  async resetUserSpending(id: string): Promise<void> {
    return this.db.resetUserSpending(id);
  }

  async getAllUsers(): Promise<any> {
    return this.db.getAllUsers();
  }
}
