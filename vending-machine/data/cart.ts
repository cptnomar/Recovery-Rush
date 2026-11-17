import type { Product } from "./products";
export type Cart = Record<number, number>;
export type CartItem = { product: Product; quantity: number };
export type Order = { items: CartItem[]; count: number; total: number };
export function cartItems(products: Product[], cart: Cart): CartItem[] {
  return products.filter(product => (cart[product.id] || 0) > 0)
    .map(product => ({ product, quantity: cart[product.id] }));
}
// Calculate money in cents to avoid accumulating floating-point rounding errors.
export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, { product, quantity }) => sum + Math.round(product.price * 100) * quantity, 0) / 100;
}
