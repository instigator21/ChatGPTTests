import TelegramBot, { Message } from 'node-telegram-bot-api';
import { containsEuro, isPayoffCommand } from './utils';
import { IUserDAO } from './UserDataAccessObject';

export async function handleSpending(msg: Message, userDao: IUserDAO): Promise<void> {
  if (msg.from?.first_name && msg.text?.match(/\d+/)) {
    const userId = msg.from.id.toString();
    const userName = msg.from.first_name;
    const user = await userDao.getUserSpending(userId);
    if (!user) {
      await userDao.addUser(userId, userName);
    }
    const amount = parseFloat(msg.text.match(/\d+/)?.[0] || '0');
    const currency = containsEuro(msg.text) ? 'EUR' : 'UAH';
    await userDao.updateUserSpending(userId, currency, amount);
  }
}

export async function handleCalcCommand(msg: Message, bot: TelegramBot, userDao: IUserDAO): Promise<void> {
  if (msg.text?.toLowerCase() === 'calc') {
    let response = '';
    const users = await userDao.getAllUsers();
    for (const user of users) {
      response += `${user.name} spends ${user.spending_uah} UAH and ${user.spending_eur} EUR\n`;
    }
    bot.sendMessage(msg.chat.id, response);
  }
}

export async function handlePayoffCommand(msg: Message, bot: TelegramBot, userDao: IUserDAO): Promise<void> {
  if (isPayoffCommand(msg.text || '')) {
    const users = await userDao.getAllUsers();
    for (const user of users) {
      await userDao.resetUserSpending(user.id);
    }
    bot.sendMessage(msg.chat.id, `All spendings have been set to zero.`);
  }
}
