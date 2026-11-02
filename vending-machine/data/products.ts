
export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  emoji: string;
  category: string;
};

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
];
