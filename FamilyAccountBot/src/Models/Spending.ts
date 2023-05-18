export class Spending {
  constructor(
    public id: number,
    public user_id: string,
    public category_id: number,
    public amount: number,
    public currency: string,
    public paid_off: boolean = false,
    public timestamp: Date = new Date()
  ) {}
}
