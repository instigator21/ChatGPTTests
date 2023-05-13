import TelegramBot, { Message } from 'node-telegram-bot-api';
import { containsEuro, isPayoffCommand } from './utils';
import { SQLiteDB } from './Database';

export async function handleSpending(msg: Message, db: SQLiteDB): Promise<void> {
  if (msg.from?.first_name && msg.text?.match(/\d+/)) {
    const userId = msg.from.id.toString();
    const userName = msg.from.first_name;
    const user = await db.getUserSpending(userId);
    if (!user) {
      await db.addUser(userId, userName);
    }
    const amount = parseFloat(msg.text.match(/\d+/)?.[0] || '0');
    const currency = containsEuro(msg.text) ? 'EUR' : 'UAH';
    await db.updateUserSpending(userId, currency, amount);
  }
}

export async function handleCalcCommand(msg: Message, bot: TelegramBot, db: SQLiteDB): Promise<void> {
  if (msg.text?.toLowerCase() === 'calc') {
    let response = '';
    const users = await db.getAllUsers();
    for (const user of users) {
      response += `${user.name} spends ${user.spending_uah} UAH and ${user.spending_eur} EUR\n`;
    }
    bot.sendMessage(msg.chat.id, response);
  }
}

export async function handlePayoffCommand(msg: Message, bot: TelegramBot, db: SQLiteDB): Promise<void> {
  if (isPayoffCommand(msg.text || '')) {
    const users = await db.getAllUsers();
    for (const user of users) {
      await db.resetUserSpending(user.id);
    }
    bot.sendMessage(msg.chat.id, `All spendings have been set to zero.`);
  }
}
