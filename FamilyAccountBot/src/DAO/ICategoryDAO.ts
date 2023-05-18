import { Category } from '../Models/Category';

export interface ICategoryDAO {
  addCategory(category: Category): Promise<void>;
  updateCategory(category: Category): Promise<void>;
  deleteCategory(category: Category): Promise<void>;
  getCategory(id: number): Promise<Category | undefined>;
  getAllCategories(): Promise<Category[]>;
}