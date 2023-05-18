import { ICategoryDAO } from './ICategoryDAO';
import { Category } from '../Models/Category';
import { IDatabase } from '../Database/IDatabase';

export class CategoryDAO implements ICategoryDAO {
  constructor(private db: IDatabase) {}

  async addCategory(category: Category): Promise<void> {
    const sql = 'INSERT INTO categories (id, name) VALUES (?, ?)';
    const params = [category.id, category.name];
    await this.db.run(sql, params);
  }

  async updateCategory(category: Category): Promise<void> {
    const sql = 'UPDATE categories SET name = ? WHERE id = ?';
    const params = [category.name, category.id];
    await this.db.run(sql, params);
  }

  async deleteCategory(category: Category): Promise<void> {
    const sql = 'DELETE FROM categories WHERE id = ?';
    await this.db.run(sql, [category.id]);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const sql = 'SELECT * FROM categories WHERE id = ?';
    const category = await this.db.get(sql, [id]);
    return category ? new Category(category.id, category.name) : undefined;
  }

  async getAllCategories(): Promise<Category[]> {
    const sql = 'SELECT * FROM categories';
    const rows = await this.db.all(sql);
    return rows.map(row => new Category(row.id, row.name));
  }
}
