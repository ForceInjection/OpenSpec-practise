export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
}
