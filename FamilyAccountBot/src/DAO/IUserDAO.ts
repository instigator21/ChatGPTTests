import { User } from '../Models/User';

export interface IUserDAO {
  addUser(user: User): Promise<User>;
  getUser(id: string): Promise<User | undefined>;
  updateUser(user: User): Promise<void>;
  deleteUser(id: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
}
