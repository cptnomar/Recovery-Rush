# Recovery-Rush

The new vending machine concept that dispenses drinks designed to help reduce the effects of hangovers.

**Recovery Rush** is an interactive vending machine application that offers a convenient way to browse and purchase recovery-focused beverages. The goal is to provide customers with quick access to refreshing drinks that support hydration and recovery.

### Features
- **Interactive Interface:** A modern, touchscreen-friendly design built for mobile devices and tablets.
- **Product Selection:** Browse beverages, view prices, and check product availability.
- **Single-Drink Checkout:** Select one drink, review its description and price, and confirm a simulated purchase.
- **Inventory Management:** Simulates product stock levels and updates inventory after purchases.
- **Simulated Checkout:** Displays a randomized 3–5 second dispensing animation, then reveals a return-home button. No real payments or dispensing occur.

### Technologies Used
- **React Native** – A framework used to build cross-platform mobile applications for iOS and Android using React.
- **Expo** – A development platform that simplifies building, running, and testing React Native applications on mobile devices.
- **TypeScript** – A programming language built on JavaScript that adds static type checking to help catch errors and improve code maintainability.

### Project Status
Recovery Rush is currently a working prototype. The application demonstrates the vending machine's interface and purchasing workflow, with plans to expand its functionality in future development.

### Disclaimer
**Recovery Rush products cannot cure, prevent, or guarantee relief from a hangover.** While hydration may help with certain symptoms associated with alcohol consumption, no beverage can eliminate the effects of alcohol or guarantee faster recovery. Product descriptions and any potential recovery benefits are for informational and demonstration purposes only and should not be considered medical advice.

All beverages and transactions currently displayed in the application are fictional and simulated.

### Frontend organization
- `vending-machine/App.tsx` coordinates screen selection and in-memory inventory.
- `vending-machine/screens/` contains the welcome, product catalog, checkout, and confirmation screens.
- `vending-machine/components/ui.tsx` contains reusable product visuals and buttons.
- `vending-machine/styles/theme.ts` contains shared styles.
- `vending-machine/data/products.ts` defines the demo catalog.

Run the app from `vending-machine/` with `npm install` followed by `npx expo start --clear`.
