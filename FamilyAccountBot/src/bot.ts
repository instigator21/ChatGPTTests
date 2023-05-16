import TelegramBot, { Message } from 'node-telegram-bot-api';
import { config } from './config';
import { handleSpending, handleCalcCommand, handlePayoffCommand } from './messageHandlers';
import { SQLiteDB } from './Database';
import { UserDAO } from './UserDataAccessObject';

const bot = new TelegramBot(config.TOKEN, { polling: true });
const db = new SQLiteDB('database.db');
const userDao = new UserDAO(db);

(async () => {
  try {
    await db.open();
    // Now you can use other methods on the `database` instance, like `addUser()`, `getUserSpending()`, etc.

    bot.on('message', (msg: Message) => {
      handleSpending(msg, userDao);
      handleCalcCommand(msg, bot, userDao);
      handlePayoffCommand(msg, bot, userDao);
    });

  } catch (error) {
    console.error('Failed to open database:', error);
  }
})();
