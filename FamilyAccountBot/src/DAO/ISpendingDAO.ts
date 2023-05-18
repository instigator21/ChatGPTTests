import { Spending } from '../Models/Spending';

export interface ISpendingDAO {
  addSpending(spending: Spending): Promise<void>;
  getSpending(id: number): Promise<Spending | undefined>;
  updateSpending(spending: Spending): Promise<void>;
  deleteSpending(id: number): Promise<void>;
  getUserSpendings(userId: string): Promise<Spending[]>;
  getAllSpendings(): Promise<Spending[]>;
  calculateUserSpendings(userId: string): Promise<{currency: string, total: number}[]>;
}