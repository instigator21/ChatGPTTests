import TelegramBot, { Message } from 'node-telegram-bot-api';
import { config } from './config';
import { handleSpending, handleCalcCommand, handlePayoffCommand } from './messageHandlers';
import { SQLiteDB } from './Database';

const bot = new TelegramBot(config.TOKEN, { polling: true });
const db = new SQLiteDB('database.db');

(async () => {
  try {
    await db.open();
    // Now you can use other methods on the `database` instance, like `addUser()`, `getUserSpending()`, etc.

    bot.on('message', (msg: Message) => {
      handleSpending(msg, db);
      handleCalcCommand(msg, bot, db);
      handlePayoffCommand(msg, bot, db);
    });

  } catch (error) {
    console.error('Failed to open database:', error);
  }
})();
