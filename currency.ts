/**
 * Formats a numeric value into Indian Rupee currency format (e.g. ₹1,85,000)
 */
export const formatINR = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const CURRENCY_SYMBOL = '₹';
