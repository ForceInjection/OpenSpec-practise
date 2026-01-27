/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} priceCents
 * @property {number} stock
 */

/**
 * @typedef {Object} CartItem
 * @property {string} id
 * @property {string} productId
 * @property {number} quantity
 */

/**
 * @typedef {Object} Cart
 * @property {string} userId
 * @property {CartItem[]} items
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} productId
 * @property {number} priceCents
 * @property {number} quantity
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {"PENDING_PAYMENT" | "PAID"} status
 * @property {number} totalCents
 * @property {OrderItem[]} items
 * @property {string} userId
 */
