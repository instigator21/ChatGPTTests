import TelegramBot, { Message } from 'node-telegram-bot-api';
import { config } from './config';
import { handleSpending, handleCalcCommand, handlePayoffCommand } from './Handlers/MessageHandlers';
import { SQLiteDB } from './Database/SQLiteDB';
import { UserDAO } from './DAO/UserDAO';
import { SpendingDAO } from './DAO/SpendingDAO';

const bot = new TelegramBot(config.TOKEN, { polling: true });
const db = new SQLiteDB('database.db');
const userDao = new UserDAO(db);
const spendingDao = new SpendingDAO(db);

(async () => {
  try {
    await db.open();

    bot.on('message', (msg: Message) => {
      handleSpending(msg, userDao, spendingDao);
      handleCalcCommand(msg, bot, userDao, spendingDao);
      handlePayoffCommand(msg, bot, spendingDao);
    });

  } catch (error) {
    console.error('Failed to open database:', error);
  }
})();
