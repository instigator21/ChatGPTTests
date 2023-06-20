import { handleSpending, handleCalcCommand } from '../Handlers/MessageHandlers';
import { User } from '../Models/User';
import { IUserDAO } from '../DAO/IUserDAO';
import { Spending } from '../Models/Spending';
import { ISpendingDAO } from '../DAO/ISpendingDAO';

// Mocking telegram bot
const botMock = {
  sendMessage: jest.fn()
};

// Mocking UserDAO
const userDAOMock: IUserDAO = {
  addUser: jest.fn(),
  getUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  getAllUsers: jest.fn()
};

// Mocking SpendingDAO
const spendingDAOMock: ISpendingDAO = {
  addSpending: jest.fn(),
  getSpending: jest.fn(),
  updateSpending: jest.fn(),
  deleteSpending: jest.fn(),
  getUserSpendings: jest.fn(),
  getAllSpendings: jest.fn(),
  calculateUserSpendings: jest.fn()
};

describe('handleSpending', () => {
  it('should process user spending', async () => {
    const user1 = new User("1", "Alice");
    const user2 = new User("2", "Bob");

    (userDAOMock.getUser as jest.Mock).mockResolvedValueOnce(user1).mockResolvedValueOnce(user2);

    const msg1 = { from: { id: user1.id, first_name: user1.name }, text: "100 UAH" };
    const msg2 = { from: { id: user2.id, first_name: user2.name }, text: "200 UAH" };

    await handleSpending(msg1 as any, userDAOMock, spendingDAOMock);
    await handleSpending(msg2 as any, userDAOMock, spendingDAOMock);

    expect(userDAOMock.getUser).toHaveBeenCalledWith(user1.id);
    expect(userDAOMock.getUser).toHaveBeenCalledWith(user2.id);
    expect(spendingDAOMock.addSpending).toHaveBeenCalledTimes(2);
  });
});

describe('handleCalcCommand', () => {
  it('should calculate user spendings', async () => {
    const user1 = new User("1", "Alice");
    const user2 = new User("2", "Bob");

    (userDAOMock.getAllUsers as jest.Mock).mockResolvedValue([user1, user2]);

    (spendingDAOMock.calculateUserSpendings as jest.Mock).mockResolvedValueOnce([
      { currency: 'UAH', total: 100 }
    ]).mockResolvedValueOnce([
      { currency: 'UAH', total: 200 }
    ]);

    const msg = { chat: { id: "1234" }, text: "/calc" };

    await handleCalcCommand(msg as any, botMock as any, userDAOMock, spendingDAOMock);

    expect(botMock.sendMessage).toHaveBeenCalledTimes(1);
  });
});

describe('handleCalcCommand', () => {
  it('should calculate who should pay whom', async () => {
    const user1 = new User("1", "Alice");
    const user2 = new User("2", "Bob");

    (userDAOMock.getAllUsers as jest.Mock).mockResolvedValue([user1, user2]);

    const msg1 = { from: { id: user1.id, first_name: user1.name }, text: "100 UAH" };
    const msg2 = { from: { id: user1.id, first_name: user1.name }, text: "200 UAH" };
    const msg3 = { from: { id: user1.id, first_name: user1.name }, text: "300 UAH" };
    const msg4 = { from: { id: user2.id, first_name: user2.name }, text: "50 UAH" };
    const msg5 = { from: { id: user2.id, first_name: user2.name }, text: "75 UAH" };

    await handleSpending(msg1 as any, userDAOMock, spendingDAOMock);
    await handleSpending(msg2 as any, userDAOMock, spendingDAOMock);
    await handleSpending(msg3 as any, userDAOMock, spendingDAOMock);
    await handleSpending(msg4 as any, userDAOMock, spendingDAOMock);
    await handleSpending(msg5 as any, userDAOMock, spendingDAOMock);

    (spendingDAOMock.calculateUserSpendings as jest.Mock).mockResolvedValueOnce([
      { currency: 'UAH', total: 600 } // User1 total spendings
    ]).mockResolvedValueOnce([
      { currency: 'UAH', total: 125 } // User2 total spendings
    ]);

    const msgCalc = { chat: { id: "1234" }, text: "/calc" };
    await handleCalcCommand(msgCalc as any, botMock as any, userDAOMock, spendingDAOMock);

    expect(botMock.sendMessage.mock.calls[1][1]).toEqual("Bob should pay Alice 237.5 UAH to balance the spending.");
  });
});

