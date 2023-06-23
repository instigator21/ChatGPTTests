import { ISpendingDAO } from './ISpendingDAO';
import { Spending } from '../Models/Spending';
import { IDatabase } from '../Database/IDatabase';

export class SpendingDAO implements ISpendingDAO {
  constructor(private db: IDatabase) {}

  async addSpending(spending: Spending): Promise<void> {
    const sql = `INSERT INTO spendings (user_id, category_id, amount, currency, paid_off, timestamp)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [spending.user_id, spending.category_id, spending.amount, spending.currency, spending.paid_off, spending.timestamp];
    await this.db.run(sql, params);
  }

  async getSpending(id: number): Promise<Spending | undefined> {
    const sql = 'SELECT * FROM spendings WHERE id = ?';
    const spending = await this.db.get(sql, [id]);
    return spending ? new Spending(spending.id, spending.user_id, spending.category_id, spending.amount, spending.currency, !!spending.paid_off, new Date(spending.timestamp)) : undefined;
  }

  async updateSpending(spending: Spending): Promise<void> {
    const sql = 'UPDATE spendings SET user_id = ?, category_id = ?, amount = ?, currency = ?, paid_off = ?, timestamp = ? WHERE id = ?';
    const params = [spending.user_id, spending.category_id, spending.amount, spending.currency, spending.paid_off ? 1 : 0, spending.timestamp, spending.id];
    await this.db.run(sql, params);
  }

  async deleteSpending(id: number): Promise<void> {
    const sql = 'DELETE FROM spendings WHERE id = ?';
    await this.db.run(sql, [id]);
  }

  async getUserSpendings(userId: string): Promise<Spending[]> {
    const sql = 'SELECT * FROM spendings WHERE user_id = ?';
    const rows = await this.db.all(sql, [userId]);
    return rows.map(row => new Spending(row.id, row.user_id, row.category_id, row.amount, row.currency, !!row.paid_off, new Date(row.timestamp)));
  }

  async getAllSpendings(): Promise<Spending[]> {
    const sql = 'SELECT * FROM spendings';
    const rows = await this.db.all(sql);
    return rows.map(row => new Spending(row.id, row.user_id, row.category_id, row.amount, row.currency, !!row.paid_off, new Date(row.timestamp)));
  }

  async calculateUserSpendings(userId: string): Promise<{currency: string, total: number}[]> {
    const sql = 'SELECT currency, SUM(amount) as total FROM spendings WHERE user_id = ? AND paid_off <> 1 GROUP BY currency';
    return this.db.all(sql, [userId]);
  }
}
