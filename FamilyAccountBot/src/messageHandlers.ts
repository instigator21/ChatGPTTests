import TelegramBot, { Message } from 'node-telegram-bot-api';
import { spendings, containsEuro, isPayoffCommand } from './utils';

export function handleSpending(msg: Message): void {
  if (msg.from?.first_name && msg.text?.match(/\d+/)) {
    if (!spendings[msg.from.first_name]) {
      spendings[msg.from.first_name] = { UAH: 0, EUR: 0 };
    }
    const amount = parseFloat(msg.text.match(/\d+/)?.[0] || '0');
    const currency = containsEuro(msg.text) ? 'EUR' : 'UAH';
    spendings[msg.from.first_name][currency] += amount;
  }
}

export function handleCalcCommand(msg: Message, bot: TelegramBot): void {
  if (msg.text?.toLowerCase() === 'calc') {
    let response = '';
    for (const user in spendings) {
      response += `${user} spends ${spendings[user]['UAH']} UAH and ${spendings[user]['EUR']} EUR\n`;
    }
    bot.sendMessage(msg.chat.id, response);
  }
}

export function handlePayoffCommand(msg: Message, bot: TelegramBot): void {
  if (isPayoffCommand(msg.text || '')) {
    for (const user in spendings) {
      spendings[user]['UAH'] = 0;
      spendings[user]['EUR'] = 0;
    }
    bot.sendMessage(msg.chat.id, `All spendings have been set to zero.`);
  }
}
