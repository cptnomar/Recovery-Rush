import { DEMO_CARD_ID, cartFingerprint, canCompleteDemoOrder, isDemoCardValid } from "./data/verification";
// State-based navigation, shared cart, and in-memory inventory for the Expo demo.
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StatusBar, useWindowDimensions, BackHandler, Keyboard, Platform, KeyboardAvoidingView } from "react-native";
import { initialProducts, type Product } from "./data/products";
import { cartItems, cartTotal, type Cart, type Order } from "./data/cart";
import { styles } from "./styles/theme";
import { BrandLogo } from "./components/ui";
import HomeScreen from "./screens/HomeScreen";
import ProductsScreen, { type Category } from "./screens/ProductsScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import CartScreen from "./screens/CartScreen";
import ConfirmationScreen from "./screens/ConfirmationScreen";

type Screen = "welcome" | "catalog" | "product" | "cart" | "success";

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width >= 800;
  const tiny = width < 370;
  const [screen, setScreen] = useState<Screen>("welcome");
  const [products, setProducts] = useState<Product[]>(() => initialProducts.map(p => ({ ...p })));
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [category, setCategory] = useState<Category>("All drinks");
  const [cart, setCart] = useState<Cart>({});
  const [order, setOrder] = useState<Order | null>(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [dispensing, setDispensing] = useState(false);
  const purchaseLock = useRef(false);
  // Verification belongs to the exact cart contents, not just the current screen.
  const [nfcInput, setNfcInput] = useState("");
  const [verifiedCart, setVerifiedCart] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const verificationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartKey = cartFingerprint(cart);
  const nfcVerified = canCompleteDemoOrder(verifiedCart, cart, nfcInput, verifying);
  const resetNfc = useCallback(() => {
    if (verificationTimer.current) clearTimeout(verificationTimer.current);
    verificationTimer.current = null;
    setVerifying(false);
    setVerifiedCart(null);
    setNfcInput("");
  }, []);
  useEffect(() => () => { if (verificationTimer.current) clearTimeout(verificationTimer.current); }, []);
  function editNfcInput(value: string) { resetNfc(); setNfcInput(value); setCheckoutError(""); }
  function verifyNfc(value: string) {
    resetNfc(); setNfcInput(value); setCheckoutError("");
    if (screen !== "cart" || count === 0) return;
    if (!isDemoCardValid(value)) { setCheckoutError("Card not recognized. Enter COUGAR-DEMO exactly or simulate a tap."); return; }
    Keyboard.dismiss();
    setVerifying(true);
    const fingerprint = cartFingerprint(cart);
    verificationTimer.current = setTimeout(() => {
      verificationTimer.current = null;
      setVerifiedCart(fingerprint);
      setVerifying(false);
    }, 600);
  }
  useEffect(() => {
    const back = BackHandler.addEventListener("hardwareBackPress", () => {
      if (screen === "welcome" || dispensing) return screen !== "welcome";
      navigate(screen === "cart" ? "catalog" : "welcome");
      return true;
    });
    return () => back.remove();
  }, [screen, dispensing]);
  const selected = products.find(p => p.id === selectedId);
  const items = cartItems(products, cart);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartTotal(items);

  function chooseProduct(product: Product) {
    setSelectedId(product.id);
    setCheckoutError("");
    setScreen("product");
  }

  function addToCart(product: Product) {
    if (dispensing) return;
    resetNfc();
    setCheckoutError("");
    setCart(old => {
      const quantity = old[product.id] || 0;
      return quantity >= product.stock ? old : { ...old, [product.id]: quantity + 1 };
    });
  }

  function reduceQuantity(id: number, removeAll = false) {
    resetNfc();
    setCheckoutError("");
    setCart(old => {
      const next = { ...old };
      if (removeAll || (next[id] || 0) <= 1) delete next[id];
      else next[id] -= 1;
      return next;
    });
  }

  function checkout() {
    if (purchaseLock.current || screen !== "cart" || count === 0) return;
    // Recheck authorization inside the handler, not just the disabled button.
    if (!canCompleteDemoOrder(verifiedCart, cart, nfcInput, verifying)) {
      setCheckoutError("Verify a simulated CougarCard before completing your order.");
      return;
    }
    if (items.some(({ product, quantity }) => quantity > product.stock)) {
      setCheckoutError("A drink is no longer available in that quantity. Please update your cart.");
      return;
    }
    purchaseLock.current = true;
    setOrder({ items: items.map(item => ({ product: { ...item.product }, quantity: item.quantity })), total, count });
    setProducts(old => old.map(product => ({ ...product, stock: product.stock - (cart[product.id] || 0) })));
    setCart({});
    resetNfc();
    setSelectedId(null);
    setCheckoutError("");
    setDispensing(true);
    setScreen("success");
  }

  const finishDispensing = useCallback(() => {
    setDispensing(false);
    purchaseLock.current = false;
  }, []);

  function navigate(target: Screen) {
    if (dispensing) return;
    if (target !== screen) { resetNfc(); Keyboard.dismiss(); }
    setScreen(target);
    setCheckoutError("");
    if (target === "welcome") {
      setSelectedId(null);
      setCategory("All drinks");
    }
  }

  const step = screen === "catalog" || screen === "product" ? 1 : screen === "cart" ? 2 : 3;
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={[styles.machine, isWide && styles.machineWide]}>
        <View style={[styles.header, !isWide && styles.headerCompact]}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Recovery Rush home" accessibilityState={{ disabled: dispensing }} disabled={dispensing} onPress={() => navigate("welcome")} style={styles.brand}>
            <BrandLogo width={tiny ? 150 : isWide ? 230 : 180} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            {isWide && <View style={styles.liveStatus}><View style={styles.liveDot} /><Text style={styles.liveText}>CHILLED & READY</Text></View>}
            <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Review cart, ${count} drinks`} accessibilityState={{ disabled: dispensing }} disabled={dispensing} onPress={() => navigate("cart")} style={[styles.headerCart, dispensing && styles.actionDisabled]}>
              <Text style={styles.headerCartText}>CART</Text><View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{count}</Text></View>
            </TouchableOpacity>
          </View>
        </View>
        {screen !== "welcome" && (
          <View style={styles.stepsBar}>
            {["CHOOSE", "REVIEW CART", "DISPENSE"].map((label, i) => (
              <View key={label} style={styles.stepItem}>
                <View style={[styles.stepCircle, step === i + 1 && styles.stepCircleActive, step > i + 1 && styles.stepCircleDone]}><Text style={[styles.stepNumber, step >= i + 1 && styles.stepNumberActive]}>{step > i + 1 ? "✓" : `0${i + 1}`}</Text></View>
                <Text style={[styles.stepLabel, step === i + 1 && styles.stepLabelActive]}>{label}</Text>
                {i < 2 && <View style={[styles.stepLine, tiny && { width: 6, marginHorizontal: 4 }]} />}
              </View>
            ))}
          </View>
        )}
        {screen === "welcome" && <HomeScreen products={products} isWide={isWide} onStart={() => navigate("catalog")} />}
        {screen === "catalog" && (
          <ProductsScreen
            products={products}
            cart={cart}
            cartCount={count}
            total={total}
            isWide={isWide}
            tiny={tiny}
            category={category}
            onCategoryChange={setCategory}
            onSelectProduct={chooseProduct}
            onAddToCart={addToCart}
            onReviewCart={() => navigate("cart")}
          />
        )}
        {screen === "product" && <CheckoutScreen selected={selected} inCart={selected ? cart[selected.id] || 0 : 0} cartCount={count} isWide={isWide} onBack={() => navigate("catalog")} onReviewCart={() => navigate("cart")} onAdd={() => { if (selected) { addToCart(selected); navigate("cart"); } }} />}
        {screen === "cart" && (
          <CartScreen
            items={items}
            count={count}
            total={total}
            isWide={isWide}
            error={checkoutError}
            onAdd={addToCart}
            onReduce={id => reduceQuantity(id)}
            onRemove={id => reduceQuantity(id, true)}
            onShopForMore={() => navigate("catalog")}
            onCheckout={checkout}
            nfcInput={nfcInput}
            verifying={verifying}
            nfcVerified={nfcVerified}
            onNfcInput={editNfcInput}
            onVerifyNfc={verifyNfc}
          />
        )}
        {screen === "success" && order && <ConfirmationScreen order={order} onComplete={finishDispensing} onReturnHome={() => navigate("welcome")} />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
