# Recovery Rush

An Expo / React Native / TypeScript vending-machine demo for web and Expo Go.

## Run on the web

Extract `Recovery_Rush.zip`, open a terminal in the `recovery-rush` folder, and run:

```sh
npm ci
npm run web
```

Expo opens the app in your browser. If it does not open automatically, use the local web address printed in the terminal.

## Run in Expo Go

```sh
npm start
```

Open the QR code with a compatible Expo Go client. The computer and phone must be able to reach each other on the network.

## This update

- Uses the supplied Recovery Rush logo in the header, footer, product illustrations, confirmation screen, and web favicon.
- Centralizes the blue, orange, black, and white brand palette in `styles/theme.ts`.
- Adds a shared hangover notice to the page footer, product review, cart, and order confirmation, with a link to [NIAAA's hangover information](https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/hangovers).
- Opens with a centered **Browse Drinks** button and a compact footer notice. The artwork, cart bar, and main buttons use brief animations that respect reduced-motion preferences.
- Adds a cart with item quantities, removal, stock limits, line totals, and a final order total.
- Add different drinks directly from the lineup with **Add to cart**, or use **Shop for more** in the cart to return to the lineup with your selections.
- Shows the bottom **Review Cart** bar once at least one drink is in the cart.
- Filters the lineup by **Sports drinks**, **Hydration drinks**, or **Coconut water**. **All drinks** shows the full selection.
- Keeps the cart when navigating between screens. A confirmed order dispenses one drink at a time with a 3–5 second simulation per drink.
- Keeps product cards aligned when a category has an incomplete final row.

The shared notice reads: “There is no proven cure for a hangover. These drinks do not cure or treat hangovers, and they do not speed up recovery from alcohol.”

## Main files

- `App.tsx`: state-based screen navigation, inventory, cart, and order confirmation.
- `styles/theme.ts`: shared styles and brand colors.
- `components/ui.tsx`: logo, notice, buttons, quantity controls, and product illustrations.
- `screens/CartScreen.tsx`: cart review and quantity editing.
- `screens/ConfirmationScreen.tsx`: order receipt and dispensing simulation.
- `data/products.ts`: product descriptions, sample prices, and starting inventory.
- `data/cart.ts`: cart types and total calculation.
- `assets/recovery-rush-logo.png`: supplied logo, unchanged.

The separate `theme.ts` download is the same file as `styles/theme.ts` in this project. Use the full updated project to get the new logo asset, notices, and cart functionality; replacing the theme alone only changes styling.

## Validation

```sh
npx tsc --noEmit
npx expo export --platform web
```

Both checks passed. The exported web app was also checked in Chromium for cart editing, totals, stock limits, checkout, dispensing, notices, and responsive layouts from 320 to 1280 pixels. Expo Go was not tested on a physical device.

## Demo behavior

Prices and inventory are examples. Checkout does not take payment or control a physical vending machine. Cart contents and stock are held in memory and reset when the app reloads. Products use stylized demo illustrations rather than manufacturer packaging. The native launcher icons remain the original project placeholders.
