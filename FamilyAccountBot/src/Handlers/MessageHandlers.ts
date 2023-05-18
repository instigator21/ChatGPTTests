import TelegramBot, { Message } from 'node-telegram-bot-api';
import { User } from '../Models/User';
import { IUserDAO } from '../DAO/IUserDAO';
import { Spending } from '../Models/Spending';
import { ISpendingDAO } from '../DAO/ISpendingDAO';
import { containsEuro, isPayoffCommand } from '../Utils/Utils';

export async function handleSpending(msg: Message, userDao: IUserDAO, spendingDao: ISpendingDAO): Promise<void> {
  if (msg.from?.first_name && msg.text?.match(/\d+/)) {
    const userId = msg.from.id.toString();
    const userName = msg.from.first_name;
    let user = await userDao.getUser(userId);
    if (!user) {
      user = await userDao.addUser(new User(userId, userName));
    }
    const amount = parseFloat(msg.text.match(/\d+/)?.[0] || '0');
    const currency = containsEuro(msg.text) ? 'EUR' : 'UAH';
    const default_categorie = 1;
    if (user) {
      const spending = new Spending(0, user.id, default_categorie, amount, currency); 
      await spendingDao.addSpending(spending);
    }
  }
}

export async function handleCalcCommand(msg: Message, bot: TelegramBot, userDao: IUserDAO, spendingDao: ISpendingDAO): Promise<void> {
  if (msg.text?.toLowerCase() === 'calc') {
    let response = '';
    const users = await userDao.getAllUsers();
    for (const user of users) {
      const spendings = await spendingDao.calculateUserSpendings(user.id);
      for (const spending of spendings) {
        response += `${user.name} spends ${spending.total} ${spending.currency}\n`;
      }
    }
    bot.sendMessage(msg.chat.id, response);
  }
}

export async function handlePayoffCommand(msg: Message, bot: TelegramBot, spendingDao: ISpendingDAO): Promise<void> {
  if (isPayoffCommand(msg.text || '')) {
    const spendings = await spendingDao.getAllSpendings();
    for (const spending of spendings) {
      if (!spending.paid_off) {
        spending.paid_off = true;
        await spendingDao.updateSpending(spending);
      }
    }
    bot.sendMessage(msg.chat.id, `All spendings have been set to zero.`);
  }
}
