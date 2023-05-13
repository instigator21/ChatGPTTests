import TelegramBot, { Message } from 'node-telegram-bot-api';
import { config } from './config';
import { handleSpending, handleCalcCommand, handlePayoffCommand } from './messageHandlers';

const bot = new TelegramBot(config.TOKEN, { polling: true });

bot.on('message', (msg: Message) => {
  handleSpending(msg);
  handleCalcCommand(msg, bot);
  handlePayoffCommand(msg, bot);
});