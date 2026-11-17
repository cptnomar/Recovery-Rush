# Recovery Rush development notes

This is an Expo / React Native / TypeScript app.

## Navigation
The project intentionally uses **Option A**: screen selection through React state in `App.tsx`, not Expo Router. Screens live in `screens/`. Do not add Expo Router unless the project owner requests a migration.

## Project layout
- `App.tsx`: screen navigation and shared product inventory
- `screens/`: individual UI screens
- `components/ui.tsx`: shared buttons and product illustrations
- `styles/theme.ts`: shared styles
- `data/products.ts`: product definitions and initial stock

## Commands
- `npm install`
- `npx expo start --clear`
- `npx tsc --noEmit`

The user requested cart review: support multiple drinks, quantities, removal, and a single order review. Dispense one drink at a time with a randomized 3–5 second animation for each drink. Keep the supplied Recovery Rush logo and shared blue/orange palette. Display the no-hangover-cure notice on the footer, product details, cart, and confirmation. Expo Go is the target for current testing.
