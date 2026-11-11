# Recovery Rush implementation and testing

## Changes

- `App.tsx`: App-level NFC input/verification state, manual and simulated tap
  controls, verification progress, accessible status/errors, disabled checkout,
  cart-bound verification, cancellation when changing cart/navigation, and a
  synchronous completion guard against repeated taps. Leaving checkout, changing
  input/quantity/products, completing an order or resetting invalidates verification.
- `App.tsx` also adds reduced-motion-aware fade transitions, Android back
  navigation, keyboard avoidance and persistent keyboard taps, smaller header text
  on narrow phones, larger quantity touch targets, and purchased line items in the
  confirmation screen. Existing palette, layout and fictional product data remain.
- The five assigned hydration products are added from the existing data file,
  preserving their price/stock/descriptions. No nutrition, flavor or bottle size
  is assumed for them. Existing `data/products.ts` edits were left untouched.
- `tests/checkout.cjs`: dependency-free App handler regression tests using the
  project's TypeScript compiler and small React/Native stubs. These are logic
  checks, not device rendering or accessibility tests.
- `assets/products/SOURCES.md`: original source investigation and current asset status.
  The five user-provided PNGs are now connected through literal static requires
  in the shared product display, using contain scaling on all three screens.
- `package.json`, `package-lock.json`, `eslint.config.js`: Expo-recommended
  development-only ESLint tooling and reproducible lint/test commands. Expo's lint
  wrapper rejected the installed ESLint version, so the lint script invokes
  ESLint directly. There are no new runtime dependencies.

No new runtime dependencies. The existing state-based navigation is retained to
honor the requested small scope and avoid an Expo Router migration. No actual
payment, card reader, real CougarCard data, or dispensing integration exists.

## Automated checks

From `vending-machine/`:

```powershell
npm ci
npx tsc --noEmit
node tests/checkout.cjs
npm run lint
npx expo export --platform android --output-dir dist
```

The checkout tests cover a direct call to the completion handler without
verification (bypassing UI disablement), invalid/case/whitespace input, exact
manual input, simulated tap, verification progress, input/quantity/product changes,
pending verification cancellation, navigation/new transaction, duplicate completion,
stock decrement and empty cart.

## Exact Expo manual test steps

1. From repository root, run `cd vending-machine`, `npm ci`, then `npx expo start`.
   Open the QR code with an Expo Go version compatible with SDK 58 on a phone on
   the same network, or press `a` for a configured Android emulator.
2. Tap **CHOOSE YOUR ENERGY**. Confirm the original six products remain. Select
   **Hydration** to find Gatorade ($3.00), Powerade ($2.75), Electrolit ($3.75),
   BODYARMOR ($3.50), and Propel ($2.50), initially 10 units each.
3. Add a drink and tap **VIEW CART**. **COMPLETE DEMO ORDER** must be disabled.
   Enter `INVALID`, tap **VERIFY TEST INPUT**, and confirm the error appears and
   completion remains disabled. Also test `cougar-demo` and whitespace: only the
   exact `COUGAR-DEMO` string is accepted.
4. Enter `COUGAR-DEMO` and tap **VERIFY TEST INPUT**. During the brief verification
   progress, completion stays disabled. After verification, it becomes enabled.
   Editing the input or changing quantity must disable it again.
5. Tap **SIMULATE CARD TAP**. After verification, go back to the lineup and add a
   different drink. Reopen the cart: verification must be required again. Start
   verification then immediately change quantity or navigate away; returning must
   not show a verified card from the canceled operation.
6. Verify again, tap **COMPLETE DEMO ORDER**, and confirm purchased product names,
   quantities and total match the cart. Rapid repeated taps must produce one order.
   Tap **BACK TO THE LINEUP**: stock must decrease only by the purchased quantity.
   Add a new drink: its checkout must require fresh verification. Resetting the demo
   from a confirmation restocks the inventory and returns to the welcome screen.
7. Check Android system Back: checkout → catalog → welcome; success → catalog.
   Check transitions with Reduce Motion enabled and disabled in device settings.
   On a narrow phone and in landscape, scroll checkout with the keyboard open;
   manual input, verification and completion controls should remain reachable.
   Empty the cart and confirm the browse action is available and checkout is absent.
8. Image checks: confirm the correct Gatorade, Powerade, Electrolit, BODYARMOR
   and Propel photos in the catalog, checkout and confirmation. Add all five to
   one order to check the mapping throughout. Confirm bottles keep their proportions
   and fit their image boxes on narrow phones and in landscape. After the app has
   loaded, enable airplane mode and repeat the transaction; the images use local
   assets, not network URLs. An Expo development session initially needs Metro;
   use a standalone build to test a cold start offline.


Device visual checks have not been run by the implementation agent.
