export interface IDatabase {
  run(query: string, params?: any[]): Promise<void>;
  get(query: string, params?: any[]): Promise<any>;
  all(query: string, params?: any[]): Promise<any[]>;
}
