# Recovery Rush merge notes

This is a **local test candidate**, not a Git commit or change to `main`.

## Foundation
Brian's component-based screens, centralized theme, cart helpers, branded logo, and sequential 3–5-second-per-drink dispensing.

## Integrated from Chimere
- Simulated CougarCard verification (`COUGAR-DEMO`), manual identifier input, and simulated tap with a 600 ms delay.
- Invalidate verification when the cart changes or checkout is left; revalidate in the purchase handler.
- Product PNG assets and attribution notes; images appear in catalog, details, cart, and dispensing screens.
- Keyboard-aware layout and Android hardware back navigation.
- ESLint config and adapted integration checks (`npm test`). Chimere's original test file targeted the old monolithic App and cannot be run unchanged.

## Important
No real NFC, card reader, payment processing, or physical vending hardware is implemented. Product images may require redistribution rights review; see `assets/products/SOURCES.md`.

## Test locally
From `vending-machine/`: `npm install`, `npx tsc --noEmit`, `npm test`, `npx expo start`.
