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
  if (msg.text?.toLowerCase() === '/calc') {
    let response = '';
    const users = await userDao.getAllUsers();
    if (users.length != 2) {
      response = "This functionality currently supports exactly two users";
    } else {
      let userSpendings = await Promise.all(users.map(user => spendingDao.calculateUserSpendings(user.id)));
      
      if (userSpendings[0].length === 0 && userSpendings[1].length === 0) {
        response = "No spendings found";
      } else {
        // Create a mapping from currency to total spending for each user
        let totalSpendingUser1: { [currency: string]: number; } = {};
        for (let spending of userSpendings[0]) {
          totalSpendingUser1[spending.currency] = (totalSpendingUser1[spending.currency] || 0) + spending.total;
        }

        let totalSpendingUser2: { [currency: string]: number; } = {};
        for (let spending of userSpendings[1]) {
          totalSpendingUser2[spending.currency] = (totalSpendingUser2[spending.currency] || 0) + spending.total;
        }

        // Calculate the difference for each currency
        let currencies = new Set([...Object.keys(totalSpendingUser1), ...Object.keys(totalSpendingUser2)]);
        for (let currency of currencies) {
          const spendingUser1 = totalSpendingUser1[currency] || 0;
          const spendingUser2 = totalSpendingUser2[currency] || 0;

          const difference = spendingUser1 - spendingUser2;
          const halfDifference = difference / 2;

          if (difference > 0) {
            response += `${users[1].name} should pay ${users[0].name} ${Math.abs(halfDifference)} ${currency} to balance the spending.\n`;
          } else if (difference < 0) {
            response += `${users[0].name} should pay ${users[1].name} ${Math.abs(halfDifference)} ${currency} to balance the spending.\n`;
          } else {
            response += `Both users have spent equally in ${currency}.\n`;
          }
        }
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
