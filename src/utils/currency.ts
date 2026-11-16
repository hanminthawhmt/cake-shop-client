export const CURRENCY_SYMBOL = '฿'

/**
 * Formats a numeric or string price to Thai Baht (฿) with two decimal places.
 * E.g. 43.29 -> "฿43.29", "73.75" -> "฿73.75"
 */
export function formatPrice(amount: number | string | undefined | null): string {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount || 0))
  const safeNum = isNaN(num) ? 0 : num
  return `${CURRENCY_SYMBOL}${safeNum.toFixed(2)}`
}

/**
 * Formats an option price modifier.
 * E.g. 5 -> "+฿5.00", 0 -> "Included"
 */
export function formatModifier(amount: number | string | undefined | null): string {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount || 0))
  const safeNum = isNaN(num) ? 0 : num
  if (safeNum > 0) {
    return `+${CURRENCY_SYMBOL}${safeNum.toFixed(2)}`
  }
  return 'Included'
}
