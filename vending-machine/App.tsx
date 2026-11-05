// Application coordinator. Owns the current screen, selected drink, and in-memory stock.
// Screen changes use React state (Option A); no navigation library is required.

import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StatusBar, useWindowDimensions } from "react-native";
import { initialProducts, type Product } from "./data/products";
import { styles } from "./styles/theme";
import { INK, YELLOW } from "./components/ui";
import HomeScreen from "./screens/HomeScreen";
import ProductsScreen, { type Category } from "./screens/ProductsScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import ConfirmationScreen from "./screens/ConfirmationScreen";

// These are the four pages in the single-drink purchase flow.
type Screen = "welcome" | "catalog" | "checkout" | "success";

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width >= 700;
  const tiny = width < 370;
  // Screen and inventory state live here so all pages stay synchronized.
  const [screen, setScreen] = useState<Screen>("welcome");
  const [products, setProducts] = useState<Product[]>(() => initialProducts.map(p => ({ ...p })));
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [category, setCategory] = useState<Category>("All drinks");
  const [purchased, setPurchased] = useState<Product | null>(null);
  const [checkoutError, setCheckoutError] = useState("");
  const selected = products.find(p => p.id === selectedId);

  // Open checkout for one in-stock drink; no shopping cart is maintained.
  function chooseProduct(product: Product) {
    if (product.stock <= 0) return;
    setSelectedId(product.id);
    setCheckoutError("");
    setScreen("checkout");
  }

  // Record the selected drink and deduct exactly one unit of stock.
  // This is a local simulation; no real payment or backend request occurs.
  function checkout() {
    if (!selected) return;
    if (selected.stock <= 0) {
      setCheckoutError("This drink is out of stock. Please select another.");
      return;
    }
    setPurchased({ ...selected });
    setProducts(old => old.map(p => p.id === selected.id ? { ...p, stock: p.stock - 1 } : p));
    setSelectedId(null);
    setCheckoutError("");
    setScreen("success");
  }

  // Clear the current transaction without resetting remaining inventory.
  function returnHome() {
    setPurchased(null);
    setSelectedId(null);
    setCategory("All drinks");
    setScreen("welcome");
  }

  // Keep the progress indicator aligned with the active page.
  const step = screen === "catalog" ? 1 : screen === "checkout" ? 2 : 3;
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.machine, isWide && styles.machineWide]}>
        <View style={[styles.header, !isWide && styles.headerCompact]}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Recovery Rush home" onPress={() => { if (screen !== "success") { setSelectedId(null); setScreen("welcome"); } }} style={styles.brand}>
            <View style={styles.logoTile}><Text style={styles.logoBolt}>ϟ</Text></View>
            <View>
              <Text style={styles.logoText}>RECOVERY RUSH<Text style={{ color: YELLOW }}>.</Text></Text>
              <Text style={styles.logoSub}>THE ENERGY STATION</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            {isWide && <View style={styles.liveStatus}><View style={styles.liveDot} /><Text style={styles.liveText}>CHILLED & READY</Text></View>}
            <View style={styles.editionTag}><Text style={styles.editionText}>VOL. 01</Text></View>
          </View>
        </View>


        {/* Render exactly one page based on the current navigation state. */}
        {screen === "welcome" && <HomeScreen products={products} isWide={isWide} onStart={() => setScreen("catalog")} />}
        {screen !== "welcome" && (
          <View style={styles.stepsBar}>
            {["CHOOSE", "REVIEW", "DISPENSE"].map((label, i) => (
              <View key={label} style={styles.stepItem}>
                <View style={[styles.stepCircle, step === i + 1 && styles.stepCircleActive, step > i + 1 && styles.stepCircleDone]}><Text style={[styles.stepNumber, step >= i + 1 && { color: INK }]}>{step > i + 1 ? "✓" : `0${i + 1}`}</Text></View>
                <Text style={[styles.stepLabel, step === i + 1 && styles.stepLabelActive]}>{label}</Text>
                {i < 2 && <View style={[styles.stepLine, tiny && { width: 10, marginHorizontal: 4 }]} />}
              </View>
            ))}
          </View>
        )}

        {screen === "catalog" && <ProductsScreen products={products} isWide={isWide} tiny={tiny} category={category} onCategoryChange={setCategory} onSelectProduct={chooseProduct} />}
        {screen === "checkout" && <CheckoutScreen selected={selected} isWide={isWide} checkoutError={checkoutError} onBack={() => setScreen("catalog")} onPurchase={checkout} />}
        {screen === "success" && purchased && <ConfirmationScreen purchased={purchased} onReturnHome={returnHome} />}
      </View>
    </SafeAreaView>
  );
}
