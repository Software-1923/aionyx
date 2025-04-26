/**
 * Format a number as a currency string
 * 
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @returns A formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}