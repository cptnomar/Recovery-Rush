// Product data contract and demo inventory. App.tsx clones this initial list
// into React state so simulated purchases do not mutate the source data.

export const DRINK_CATEGORIES = ["Sports drinks", "Hydration drinks", "Coconut water"] as const;
export type DrinkCategory = (typeof DRINK_CATEGORIES)[number];

// Every product has an ID, display information, price, and remaining stock.
export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  emoji: string;
  category: DrinkCategory;
  description?: string;
};

// Prices and stock values are placeholders for the vending-machine demo.
// Confirm final prices and quantities with the team before deployment.
export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Gatorade",
    price: 3.00,
    stock: 10,
    emoji: "🥤",
    category: "Sports drinks",
    description: "Sports drink with fluids and electrolytes. Check the product label for ingredients and nutrition.",
  },
  {
    id: 2,
    name: "Powerade",
    price: 3.00,
    stock: 10,
    emoji: "🥤",
    category: "Sports drinks",
    description: "Refreshing sports drink that provides fluids and electrolytes for hydration.",
  },
  {
    id: 3,
    name: "Electrolit",
    price: 3.50,
    stock: 10,
    emoji: "💧",
    category: "Hydration drinks",
    description: "Electrolyte hydration beverage designed to help replenish fluids and electrolytes.",
  },
  {
    id: 4,
    name: "BODYARMOR",
    price: 3.50,
    stock: 10,
    emoji: "🥥",
    category: "Coconut water",
    description: "Sports drink made with coconut water and electrolytes to support hydration.",
  },
  {
    id: 5,
    name: "Propel",
    price: 3.00,
    stock: 10,
    emoji: "💧",
    category: "Hydration drinks",
    description: "Flavored electrolyte water for a light, refreshing way to stay hydrated.",
  },
];
