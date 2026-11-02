import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  emoji: string;
  category: string;
};

const initialProducts: Product[] = [
  { id: 1, name: "Cola", price: 1.5, stock: 10, emoji: "🥤", category: "Drinks" },
  { id: 2, name: "Water", price: 1.25, stock: 12, emoji: "💧", category: "Drinks" },
  { id: 3, name: "Coffee", price: 2.5, stock: 8, emoji: "☕", category: "Drinks" },
  { id: 4, name: "Chips", price: 1.75, stock: 10, emoji: "🍟", category: "Snacks" },
  { id: 5, name: "Popcorn", price: 2.0, stock: 7, emoji: "🍿", category: "Snacks" },
  { id: 6, name: "Cookies", price: 1.5, stock: 9, emoji: "🍪", category: "Snacks" },
  { id: 7, name: "Chocolate", price: 2.25, stock: 6, emoji: "🍫", category: "Candy" },
  { id: 8, name: "Candy", price: 1.0, stock: 15, emoji: "🍬", category: "Candy" },
];

type Screen = "welcome" | "catalog" | "cart" | "success";

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [category, setCategory] = useState("All");
  const [lastTotal, setLastTotal] = useState(0);

  const money = (amount: number) => "$" + amount.toFixed(2);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const total = products.reduce(
    (sum, product) => sum + product.price * (cart[product.id] || 0),
    0
  );

  function addToCart(product: Product) {
    const current = cart[product.id] || 0;

    if (current >= product.stock) {
      Alert.alert("Unavailable", "No more stock available.");
      return;
    }

    setCart((old) => ({
      ...old,
      [product.id]: current + 1,
    }));
  }

  function removeFromCart(id: number) {
    setCart((old) => {
      const updated = { ...old };
      const count = updated[id] || 0;

      if (count <= 1) {
        delete updated[id];
      } else {
        updated[id] = count - 1;
      }

      return updated;
    });
  }

  function checkout() {
    if (cartCount === 0) return;

    // Verify that enough inventory remains.
    for (const product of products) {
      if ((cart[product.id] || 0) > product.stock) {
        Alert.alert("Out of stock", product.name + " is unavailable.");
        return;
      }
    }

    setLastTotal(total);

    setProducts((old) =>
      old.map((product) => ({
        ...product,
        stock: product.stock - (cart[product.id] || 0),
      }))
    );

    setCart({});
    setScreen("success");
  }

  function resetDemo() {
    setProducts(initialProducts.map((product) => ({ ...product })));
    setCart({});
    setCategory("All");
    setLastTotal(0);
    setScreen("welcome");
  }

  const visibleProducts = products.filter(
    (product) => category === "All" || product.category === category
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.logo}>VENDLY</Text>
        <Text style={styles.subtitle}>SMART VENDING EXPERIENCE</Text>
      </View>

      {screen === "welcome" && (
        <View style={styles.center}>
          <Text style={styles.heroEmoji}>🥤 🍿 🍫</Text>
          <Text style={styles.heroTitle}>Welcome to Vendly</Text>
          <Text style={styles.heroText}>
            Your favorite snacks and drinks, just a tap away.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setScreen("catalog")}
          >
            <Text style={styles.primaryText}>TOUCH TO START</Text>
          </TouchableOpacity>

          <Text style={styles.demoLabel}>DEMO MODE — NO REAL PAYMENTS</Text>
        </View>
      )}

      {screen === "catalog" && (
        <>
          <View style={styles.navigation}>
            <TouchableOpacity onPress={() => setScreen("welcome")}>
              <Text style={styles.backText}>‹ Home</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setScreen("cart")}>
              <Text style={styles.cartLink}>🛒 Cart ({cartCount})</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.heading}>Choose Your Item</Text>

          <View style={styles.categories}>
            {["All", "Drinks", "Snacks", "Candy"].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setCategory(item)}
                style={[
                  styles.categoryButton,
                  category === item && styles.categoryActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === item && styles.categoryTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView contentContainerStyle={styles.grid}>
            {visibleProducts.map((product) => {
              const available =
                product.stock - (cart[product.id] || 0);

              return (
                <View key={product.id} style={styles.productCard}>
                  <Text style={styles.productEmoji}>{product.emoji}</Text>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.price}>{money(product.price)}</Text>

                  <Text style={styles.stock}>
                    {available > 0
                      ? `${available} available`
                      : "Out of stock"}
                  </Text>

                  <TouchableOpacity
                    disabled={available <= 0}
                    onPress={() => addToCart(product)}
                    style={[
                      styles.addButton,
                      available <= 0 && styles.disabledButton,
                    ]}
                  >
                    <Text style={styles.addText}>
                      {available > 0 ? "+ Add" : "Sold Out"}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>

          {cartCount > 0 && (
            <TouchableOpacity
              style={styles.bottomButton}
              onPress={() => setScreen("cart")}
            >
              <Text style={styles.primaryText}>
                View Cart ({cartCount}) · {money(total)}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {screen === "cart" && (
        <>
          <View style={styles.navigation}>
            <TouchableOpacity onPress={() => setScreen("catalog")}>
              <Text style={styles.backText}>‹ Continue Shopping</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.heading}>Your Cart</Text>

          <ScrollView style={styles.cartList}>
            {cartCount === 0 && (
              <Text style={styles.emptyText}>Your cart is empty.</Text>
            )}

            {products
              .filter((product) => (cart[product.id] || 0) > 0)
              .map((product) => (
                <View key={product.id} style={styles.cartItem}>
                  <Text style={styles.cartEmoji}>{product.emoji}</Text>

                  <View style={styles.cartInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.price}>
                      {money(product.price * cart[product.id])}
                    </Text>
                  </View>

                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => removeFromCart(product.id)}
                    >
                      <Text style={styles.quantityText}>−</Text>
                    </TouchableOpacity>

                    <Text style={styles.quantity}>{cart[product.id]}</Text>

                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => addToCart(product)}
                    >
                      <Text style={styles.quantityText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </ScrollView>

          <View style={styles.checkoutPanel}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{money(total)}</Text>
            </View>

            <TouchableOpacity
              disabled={cartCount === 0}
              style={[
                styles.primaryButton,
                cartCount === 0 && styles.disabledButton,
              ]}
              onPress={checkout}
            >
              <Text style={styles.primaryText}>FAKE BUY NOW</Text>
            </TouchableOpacity>

            <Text style={styles.demoLabel}>
              Simulation only — no payment will be charged
            </Text>
          </View>
        </>
      )}

      {screen === "success" && (
        <View style={styles.center}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.heroTitle}>Purchase Complete!</Text>
          <Text style={styles.heroText}>
            Your simulated purchase of {money(lastTotal)} was successful.
          </Text>
          <Text style={styles.heroText}>
            Thank you for shopping with Vendly!
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setScreen("catalog")}
          >
            <Text style={styles.primaryText}>SHOP AGAIN</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetDemo}>
            <Text style={styles.resetText}>Reset Demo Inventory</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FA",
  },
  header: {
    backgroundColor: "#101827",
    paddingVertical: 20,
    alignItems: "center",
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: 4,
  },
  subtitle: {
    color: "#A9B6C9",
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
  },
  heroEmoji: {
    fontSize: 55,
    marginBottom: 30,
    textAlign: "center",
  },
  heroTitle: {
    fontSize: 29,
    fontWeight: "800",
    color: "#172338",
    textAlign: "center",
    marginBottom: 12,
  },
  heroText: {
    color: "#66758B",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: "#EF4B43",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
    textAlign: "center",
  },
  demoLabel: {
    fontSize: 11,
    color: "#8A96A8",
    marginTop: 20,
    textAlign: "center",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 18,
  },
  backText: {
    color: "#354967",
    fontWeight: "700",
    fontSize: 15,
  },
  cartLink: {
    color: "#EF4B43",
    fontWeight: "800",
    fontSize: 15,
  },
  heading: {
    fontSize: 25,
    fontWeight: "800",
    color: "#172338",
    marginHorizontal: 18,
    marginBottom: 15,
  },
  categories: {
    flexDirection: "row",
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  categoryButton: {
    backgroundColor: "#E3E8F0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 7,
  },
  categoryActive: {
    backgroundColor: "#172338",
  },
  categoryText: {
    color: "#506078",
    fontWeight: "600",
    fontSize: 12,
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    marginBottom: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5EAF1",
  },
  productEmoji: {
    fontSize: 55,
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#172338",
  },
  price: {
    fontSize: 17,
    fontWeight: "800",
    color: "#EF4B43",
    marginTop: 6,
  },
  stock: {
    fontSize: 11,
    color: "#8491A4",
    marginTop: 7,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#172338",
    borderRadius: 10,
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  addText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  disabledButton: {
    backgroundColor: "#A8B0BC",
  },
  bottomButton: {
    backgroundColor: "#EF4B43",
    padding: 18,
    margin: 15,
    borderRadius: 14,
  },
  cartList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  cartItem: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },
  cartEmoji: {
    fontSize: 35,
    marginRight: 14,
  },
  cartInfo: {
    flex: 1,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#E8EDF4",
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#172338",
  },
  quantity: {
    marginHorizontal: 10,
    fontWeight: "800",
  },
  checkoutPanel: {
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 19,
    fontWeight: "700",
  },
  totalAmount: {
    fontSize: 25,
    fontWeight: "900",
    color: "#172338",
  },
  emptyText: {
    textAlign: "center",
    color: "#7A8798",
    marginTop: 40,
  },
  successEmoji: {
    fontSize: 75,
    marginBottom: 20,
  },
  resetText: {
    color: "#66758B",
    marginTop: 25,
    textDecorationLine: "underline",
  },
});
