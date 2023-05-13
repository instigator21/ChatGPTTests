export const spendings: { [name: string]: { [currency: string]: number } } = {};

export function containsEuro(text: string): boolean {
  return text.toLowerCase().includes('euro') || text.toLowerCase().includes('евро') || text.toLowerCase().includes('євро');
}

export function isPayoffCommand(text: string): boolean {
  const lowerText = text.toLowerCase();
  return lowerText === 'payoff' || lowerText === 'pay off' || lowerText === 'payof';
}
