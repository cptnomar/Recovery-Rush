// Demo-only identifier: never a real NFC reader or payment authorization.
export const DEMO_CARD_ID = "COUGAR-DEMO";
export function isDemoCardValid(value: string): boolean { return value === DEMO_CARD_ID; }
export function cartFingerprint(cart: Record<number, number>): string {
  return JSON.stringify(Object.entries(cart).filter(([, qty]) => qty > 0).sort(([a], [b]) => Number(a) - Number(b)));
}
export function canCompleteDemoOrder(verifiedFingerprint: string | null, cart: Record<number, number>, input: string, verifying: boolean): boolean {
  return !verifying && isDemoCardValid(input) && verifiedFingerprint === cartFingerprint(cart) && Object.values(cart).some(qty => qty > 0);
}
