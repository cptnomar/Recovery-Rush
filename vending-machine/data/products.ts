export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  emoji: string;
  category: string;
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
    category: "Drinks",
    description: "Sports drink with fluids and electrolytes to support hydration after a long night.",
  },
  {
    id: 2,
    name: "Powerade",
    price: 2.75,
    stock: 10,
    emoji: "🥤",
    category: "Drinks",
    description: "Refreshing sports drink that provides fluids and electrolytes for hydration.",
  },
  {
    id: 3,
    name: "Electrolit",
    price: 3.75,
    stock: 10,
    emoji: "💧",
    category: "Drinks",
    description: "Electrolyte hydration beverage designed to help replenish fluids and electrolytes.",
  },
  {
    id: 4,
    name: "BODYARMOR",
    price: 3.50,
    stock: 10,
    emoji: "🥥",
    category: "Drinks",
    description: "Sports drink made with coconut water and electrolytes to support hydration.",
  },
  {
    id: 5,
    name: "Propel",
    price: 2.50,
    stock: 10,
    emoji: "💧",
    category: "Drinks",
    description: "Flavored electrolyte water for a light, refreshing way to stay hydrated.",
  },
];
