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
    name: "Cola",
    price: 1.50,
    stock: 10,
    emoji: "🥤",
    category: "Drinks",
  },
  {
    id: 2,
    name: "Water",
    price: 1.25,
    stock: 12,
    emoji: "💧",
    category: "Drinks",
  },
  {
    id: 3,
    name: "Coffee",
    price: 2.50,
    stock: 8,
    emoji: "☕",
    category: "Drinks",
  },
  {
    id: 4,
    name: "Chips",
    price: 1.75,
    stock: 10,
    emoji: "🍟",
    category: "Snacks",
  },
  {
    id: 5,
    name: "Popcorn",
    price: 2.00,
    stock: 7,
    emoji: "🍿",
    category: "Snacks",
  },
  {
    id: 6,
    name: "Cookies",
    price: 1.50,
    stock: 9,
    emoji: "🍪",
    category: "Snacks",
  },
  {
    id: 7,
    name: "Chocolate",
    price: 2.25,
    stock: 6,
    emoji: "🍫",
    category: "Candy",
  },
  {
    id: 8,
    name: "Candy",
    price: 1.00,
    stock: 15,
    emoji: "🍬",
    category: "Candy",
  },
  {
    id: 9,
    name: "Gatorade",
    price: 3.00,
    stock: 10,
    emoji: "🥤",
    category: "Drinks",
    description: "Sports drink with fluids and electrolytes to support hydration after a long night.",
  },
  {
    id: 10,
    name: "Powerade",
    price: 2.75,
    stock: 10,
    emoji: "🥤",
    category: "Drinks",
    description: "Refreshing sports drink that provides fluids and electrolytes for hydration.",
  },
  {
    id: 11,
    name: "Electrolit",
    price: 3.75,
    stock: 10,
    emoji: "💧",
    category: "Drinks",
    description: "Electrolyte hydration beverage designed to help replenish fluids and electrolytes.",
  },
  {
    id: 12,
    name: "BODYARMOR",
    price: 3.50,
    stock: 10,
    emoji: "🥥",
    category: "Drinks",
    description: "Sports drink made with coconut water and electrolytes to support hydration.",
  },
  {
    id: 13,
    name: "Propel",
    price: 2.50,
    stock: 10,
    emoji: "💧",
    category: "Drinks",
    description: "Flavored electrolyte water for a light, refreshing way to stay hydrated.",
  },
];
