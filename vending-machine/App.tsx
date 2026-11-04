import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from "react-native";

// Product information and inventory come from data/products.ts.
import { initialProducts, type Product } from "./data/products";
type Category = "All drinks" | "Drinks";
type Screen = "welcome" | "catalog" | "cart" | "success";

const INK = "#14212B";
const YELLOW = "#FFDE32";
const AQUA = "#61E8D3";
const CATEGORIES: Category[] = ["All drinks", "Drinks"];
const PRODUCT_COLORS = ["#C2EC49", "#7CDDDD", "#F99AC1", "#FFB567", "#BFA4EE"];
const PRODUCT_TINTS = ["#F0F8D5", "#E1F6F4", "#FDE8F1", "#FFF0DF", "#F0E9FB"];
const productColor = (p: Product) => PRODUCT_COLORS[(p.id - 1) % PRODUCT_COLORS.length];
const productTint = (p: Product) => PRODUCT_TINTS[(p.id - 1) % PRODUCT_TINTS.length];
const money = (amount: number) => "$" + amount.toFixed(2);

function DotPattern({ color = INK }: { color?: string }) {
  return (
    <View pointerEvents="none" style={styles.dots}>
      {Array.from({ length: 30 }, (_, i) => (
        <View key={i} style={[styles.dot, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

// The can artwork is built from native Views and Text, so it works offline.
function DrinkCan({ product, scale = 1, rotate = "0deg" }: { product: Product; scale?: number; rotate?: string }) {
  return (
    <View
      accessible={false}
      pointerEvents="none"
      style={{ width: 82 * scale, height: 150 * scale, transform: [{ rotate: rotate as `${number}deg` }] }}
    >
      <View style={[styles.canShadow, { height: 12 * scale, bottom: -6 * scale }]} />
      <View style={[styles.canBody, { top: 5 * scale, bottom: 5 * scale, borderRadius: 12 * scale, backgroundColor: productColor(product) }]}>
        <View style={[styles.canSide, { width: 10 * scale }]} />
        <View style={[styles.canHighlight, { left: 7 * scale, width: 5 * scale }]} />
        <View style={[styles.canSlash, { width: 29 * scale, height: 160 * scale, right: 2 * scale, top: 13 * scale }]} />
        <Text style={[styles.canMicro, { fontSize: 5.3 * scale, letterSpacing: 1.7 * scale, marginTop: 17 * scale }]}>RECOVERY RUSH</Text>
        <Text style={[styles.canBrand, { fontSize: 26 * scale, lineHeight: 30 * scale, letterSpacing: -2 * scale }]}>RR</Text>
        <Text style={[styles.canBolt, { fontSize: 51 * scale, lineHeight: 55 * scale }]}>{product.emoji}</Text>
        <View style={[styles.canFlavorBar, { paddingVertical: 3 * scale }]}>
          <Text style={[styles.canFlavor, { fontSize: 6.4 * scale, letterSpacing: 1.2 * scale }]}>{product.name.toUpperCase()}</Text>
        </View>
        <Text style={[styles.canVolume, { fontSize: 4.8 * scale, marginTop: 4 * scale }]}>DEMO PRODUCT</Text>
      </View>
      <View style={[styles.canRim, { height: 10 * scale, borderRadius: 8 * scale }]}>
        <View style={{ width: 18 * scale, height: 4 * scale, borderRadius: 5 * scale, backgroundColor: "#7A8787", borderWidth: 1, borderColor: "#A6B1AF" }} />
      </View>
      <View style={[styles.canBottom, { height: 7 * scale, borderRadius: 5 * scale }]} />
    </View>
  );
}

function ActionButton({ label, onPress, disabled = false, light = false, hint }: { label: string; onPress: () => void; disabled?: boolean; light?: boolean; hint?: string }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled }}
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={[styles.actionButton, light && styles.actionLight, disabled && styles.actionDisabled]}
    >
      <Text style={[styles.actionText, light && { color: INK }]}>{label}</Text>
      <Text style={[styles.actionArrow, light && { color: INK }]}>↗</Text>
    </TouchableOpacity>
  );
}

function QuantityControl({ product, count, add, remove }: { product: Product; count: number; add: () => void; remove: () => void }) {
  const maxed = count >= product.stock;
  return (
    <View style={styles.quantityControl}>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Remove one ${product.name}`} onPress={remove} style={styles.quantityButton}>
        <Text style={styles.quantitySymbol}>−</Text>
      </TouchableOpacity>
      <Text accessibilityLabel={`${count} in cart`} style={styles.quantityNumber}>{count}</Text>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Add one ${product.name}`} accessibilityState={{ disabled: maxed }} disabled={maxed} onPress={add} style={[styles.quantityButton, maxed && { opacity: 0.3 }]}>
        <Text style={styles.quantitySymbol}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width >= 700;
  const tiny = width < 370;
  const [screen, setScreen] = useState<Screen>("welcome");
  const [products, setProducts] = useState<Product[]>(() => initialProducts.map(p => ({ ...p })));
  const [cart, setCart] = useState<Record<number, number>>({});
  const [category, setCategory] = useState<Category>("All drinks");
  const [receipt, setReceipt] = useState({ total: 0, count: 0 });
  const [checkoutError, setCheckoutError] = useState("");
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  const visibleProducts = products.filter(p => category === "All drinks" || p.category === category);

  function addToCart(product: Product) {
    setCheckoutError("");
    setCart(old => {
      const count = old[product.id] || 0;
      return count >= product.stock ? old : { ...old, [product.id]: count + 1 };
    });
  }

  function removeFromCart(id: number) {
    setCheckoutError("");
    setCart(old => {
      const updated = { ...old };
      if ((updated[id] || 0) <= 1) delete updated[id];
      else updated[id] -= 1;
      return updated;
    });
  }

  function checkout() {
    if (!cartCount) return;
    if (products.some(p => (cart[p.id] || 0) > p.stock)) {
      setCheckoutError("One of your drinks is out of stock. Please update your cart.");
      return;
    }
    setReceipt({ total, count: cartCount });
    setProducts(old => old.map(p => ({ ...p, stock: p.stock - (cart[p.id] || 0) })));
    setCart({});
    setCheckoutError("");
    setScreen("success");
  }

  function resetDemo() {
    setProducts(initialProducts.map(p => ({ ...p })));
    setCart({});
    setCategory("All drinks");
    setReceipt({ total: 0, count: 0 });
    setCheckoutError("");
    setScreen("welcome");
  }

  const step = screen === "catalog" ? 1 : screen === "cart" ? 2 : 3;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.machine, isWide && styles.machineWide]}>
        <View style={[styles.header, !isWide && styles.headerCompact]}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Recovery Rush home" onPress={() => setScreen("welcome")} style={styles.brand}>
            <View style={styles.logoTile}><Text style={styles.logoBolt}>ϟ</Text></View>
            <View>
              <Text style={styles.logoText}>RECOVERY RUSH<Text style={{ color: YELLOW }}>.</Text></Text>
              <Text style={styles.logoSub}>THE ENERGY STATION</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            {isWide && <View style={styles.liveStatus}><View style={styles.liveDot} /><Text style={styles.liveText}>CHILLED & READY</Text></View>}
            {screen === "welcome" ? (
              <View style={styles.editionTag}><Text style={styles.editionText}>VOL. 01</Text></View>
            ) : (
              <TouchableOpacity accessibilityRole="button" accessibilityLabel={`View cart, ${cartCount} drinks`} onPress={() => setScreen("cart")} style={styles.headerCart}>
                <Text style={styles.headerCartText}>CART</Text><View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartCount}</Text></View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {screen === "welcome" && (
          <ScrollView contentContainerStyle={styles.welcomeScroll}>
            <View style={[styles.welcomeHero, isWide && styles.welcomeHeroWide]}>
              <View style={[styles.welcomeCopy, isWide && { flex: 1, paddingRight: 0 }]}>
                <View style={styles.seriesPill}><Text style={styles.seriesText}>ϟ THE RECOVERY COLLECTION</Text></View>
                <Text style={[styles.heroTitle, { fontSize: isWide ? 66 : 48, lineHeight: isWide ? 65 : 48 }]}>BIG FLAVOR.{"\n"}FULL <Text style={styles.heroOutline}>CHARGE.</Text></Text>
                <Text style={styles.heroDescription}>Explore our hydration drink lineup and find your next refreshment.</Text>
                <View style={styles.heroButton}><ActionButton label="CHOOSE YOUR ENERGY" onPress={() => setScreen("catalog")} /></View>
                <Text style={styles.heroNote}>ICE COLD. READY WHEN YOU ARE.</Text>
              </View>
              <View style={[styles.heroArtwork, { height: isWide ? 430 : 300 }, isWide && { width: "46%" }]}>
                <View style={[styles.artCircle, { width: isWide ? 330 : 245, height: isWide ? 330 : 245, borderRadius: 200 }]} />
                <View style={styles.orbitRing} />
                <View style={[styles.burstLine, { transform: [{ rotate: "-25deg" }], top: "16%", left: "10%" }]} />
                <View style={[styles.burstLine, { transform: [{ rotate: "30deg" }], top: "23%", right: "8%" }]} />
                <View style={[styles.heroCanLeft, { left: isWide ? "7%" : "13%", top: isWide ? "25%" : "24%" }]}><DrinkCan product={(products[1] || products[0])} scale={isWide ? 1.5 : 1.1} rotate="-17deg" /></View>
                <View style={[styles.heroCanRight, { right: isWide ? "4%" : "10%", top: isWide ? "25%" : "24%" }]}><DrinkCan product={(products[2] || products[0])} scale={isWide ? 1.5 : 1.1} rotate="17deg" /></View>
                <View style={[styles.heroCanCenter, { top: isWide ? "13%" : "10%" }]}><DrinkCan product={(products[0])} scale={isWide ? 1.95 : 1.48} rotate="-5deg" /></View>
                <View style={styles.powerSticker}><Text style={styles.stickerBolt}>ϟ</Text><Text style={styles.stickerText}>PICK YOUR{"\n"}POWER-UP</Text></View>
                <View style={styles.artSpark}><Text style={styles.artSparkText}>✦</Text></View>
                <DotPattern />
              </View>
            </View>
            <View style={styles.ticker}>
              <Text style={styles.tickerText}>FIVE DRINKS</Text><Text style={styles.tickerStar}>✦</Text>
              <Text style={styles.tickerText}>ZERO BORING</Text><Text style={styles.tickerStar}>✦</Text>
              <Text style={styles.tickerText}>STAY REFRESHED</Text>
            </View>
            <View style={[styles.welcomeBottom, !isWide && { paddingHorizontal: 22 }]}>
              <View style={styles.welcomeInstructions}>
                <Text style={styles.sectionEyebrow}>YOUR NEXT PICK-ME-UP</Text>
                <Text style={styles.welcomeBottomTitle}>Good taste. Three taps away.</Text>
              </View>
              <View style={[styles.howSteps, !isWide && { width: "100%", marginTop: 22 }]}>
                {["Pick a flavor", "Build your mix", "Power up"].map((label, i) => (
                  <View key={label} style={styles.howStep}><Text style={styles.howNumber}>0{i + 1}</Text><Text style={styles.howLabel}>{label}</Text></View>
                ))}
              </View>
            </View>
            <View style={styles.demoFooter}><Text style={styles.demoFooterText}>INTERACTIVE DEMO · NO REAL PAYMENTS</Text></View>
          </ScrollView>
        )}

        {screen !== "welcome" && (
          <View style={styles.stepsBar}>
            {["CHOOSE", "YOUR CART", "POWER UP"].map((label, i) => (
              <View key={label} style={styles.stepItem}>
                <View style={[styles.stepCircle, step === i + 1 && styles.stepCircleActive, step > i + 1 && styles.stepCircleDone]}><Text style={[styles.stepNumber, step >= i + 1 && { color: INK }]}>{step > i + 1 ? "✓" : `0${i + 1}`}</Text></View>
                <Text style={[styles.stepLabel, step === i + 1 && styles.stepLabelActive]}>{label}</Text>
                {i < 2 && <View style={[styles.stepLine, tiny && { width: 10, marginHorizontal: 4 }]} />}
              </View>
            ))}
          </View>
        )}

        {screen === "catalog" && (
          <>
            <ScrollView key="catalog" contentContainerStyle={[styles.catalogContent, !isWide && styles.contentCompact]}>
              <View style={[styles.catalogHero, !isWide && { padding: 20, minHeight: 158 }]}>
                <View style={{ flex: 1, zIndex: 2 }}>
                  <Text style={styles.promoEyebrow}>FIND YOUR FLAVOR</Text>
                  <Text style={[styles.catalogTitle, { fontSize: isWide ? 40 : 28, lineHeight: isWide ? 41 : 30 }]}>CHOOSE YOUR{"\n"}POWER-UP.</Text>
                  <Text style={styles.promoDescription}>Your daily plot twist, in a can.</Text>
                </View>
                {!tiny && <View style={[styles.promoArt, { width: isWide ? 230 : 100 }]}>
                  <View style={styles.promoCircle} />
                  {isWide && <View style={{ position: "absolute", left: 10, top: 15 }}><DrinkCan product={(products[2] || products[0])} scale={0.92} rotate="-20deg" /></View>}
                  <View style={{ transform: [{ rotate: "12deg" }] }}><DrinkCan product={(products[0])} scale={isWide ? 1.05 : 0.82} /></View>
                </View>}
                <DotPattern />
              </View>

              <View style={styles.collectionHeading}><Text style={styles.collectionTitle}>THE LINEUP <Text style={styles.collectionCount}>/ {String(products.length).padStart(2, "0")}</Text></Text><Text style={styles.collectionHint}>EXPLORE THE DRINKS</Text></View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                {CATEGORIES.map(item => (
                  <TouchableOpacity key={item} accessibilityRole="button" accessibilityState={{ selected: category === item }} accessibilityLabel={`Filter: ${item}`} onPress={() => setCategory(item)} style={[styles.filter, category === item && styles.filterActive]}>
                    <Text style={[styles.filterText, category === item && styles.filterTextActive]}>{item === "All drinks" ? "✦  " : ""}{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={[styles.productGrid, { columnGap: tiny ? 0 : isWide ? 10 : 12 }]}>
                {visibleProducts.map(product => {
                  const count = cart[product.id] || 0;
                  const available = product.stock - count;
                  return (
                    <View key={product.id} style={[styles.productCard, { width: tiny ? "100%" : isWide ? "31%" : "48%" }]}>
                      <View style={[styles.productArt, { backgroundColor: productTint(product), height: isWide ? 168 : 148 }]}>
                        <View style={styles.cardTopLine}><Text style={styles.productCode}>NO. 0{product.id}</Text><View style={[styles.typeBadge, { backgroundColor: productColor(product) }]}><Text style={styles.typeSymbol}>{product.emoji}</Text></View></View>
                        <View style={[styles.productHalo, { backgroundColor: productColor(product) }]} />
                        <View style={{ marginTop: 10 }}><DrinkCan product={product} scale={isWide ? 0.91 : 0.78} rotate="-7deg" /></View>
                        {product.stock === 0 && <View style={styles.soldOverlay}><Text style={styles.soldLabel}>SOLD OUT</Text></View>}
                        
                      </View>
                      <View style={[styles.productInfo, !isWide && { padding: 12 }]}>
                        <Text style={[styles.productName, !isWide && { fontSize: 16 }]}>{product.name}</Text>
                        <Text style={styles.productFlavor}>{product.category.toUpperCase()}</Text>
                        <Text style={[styles.nutritionText, { marginTop: 10, lineHeight: 15 }]}>{product.description || "Hydration beverage"}</Text>
                        <View style={styles.cardPriceRow}><Text style={styles.price}>{money(product.price)}</Text><Text style={[styles.stockText, !available && { color: "#8A4962" }]}>{available ? `${available} left` : product.stock ? "All in cart" : "Sold out"}</Text></View>
                        {count > 0 ? (
                          <QuantityControl product={product} count={count} add={() => addToCart(product)} remove={() => removeFromCart(product.id)} />
                        ) : (
                          <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Add ${product.name} to cart`} accessibilityState={{ disabled: available <= 0 }} disabled={available <= 0} onPress={() => addToCart(product)} style={[styles.addButton, available <= 0 && styles.addDisabled]}>
                            <Text style={styles.addLabel}>{available > 0 ? "ADD TO CART" : "SOLD OUT"}</Text><Text style={styles.addPlus}>+</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
              <Text style={styles.catalogFootnote}>DEMO MODE · SAMPLE PRICES · NO REAL PAYMENTS</Text>
            </ScrollView>
            <View style={[styles.cartDock, !isWide && { paddingHorizontal: 18 }]}>
              <View style={styles.dockInfo}><View style={styles.dockCount}><Text style={styles.dockCountText}>{cartCount}</Text></View><View><Text style={styles.dockLabel}>{tiny ? "YOUR ENERGY MIX" : cartCount ? "YOUR ENERGY MIX" : "BUILD YOUR ENERGY MIX"}</Text><Text style={styles.dockTotal}>{money(total)}{!tiny && <Text style={styles.dockTotalCaption}>  / {cartCount} {cartCount === 1 ? "drink" : "drinks"}</Text>}</Text></View></View>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="View cart" accessibilityState={{ disabled: cartCount === 0 }} disabled={cartCount === 0} onPress={() => setScreen("cart")} style={[styles.dockButton, !cartCount && styles.dockDisabled]}><Text style={styles.dockButtonText}>{isWide ? "REVIEW YOUR CART" : "VIEW CART"}  →</Text></TouchableOpacity>
            </View>
          </>
        )}

        {screen === "cart" && (
          <ScrollView key="cart" contentContainerStyle={[styles.cartContent, !isWide && styles.contentCompact]}>
            <TouchableOpacity accessibilityRole="button" onPress={() => setScreen("catalog")} style={styles.backButton}><Text style={styles.backText}>← BACK TO THE LINEUP</Text></TouchableOpacity>
            <Text style={[styles.pageTitle, !isWide && { fontSize: 35, lineHeight: 39 }]}>YOUR ENERGY MIX<Text style={{ color: "#6A897C" }}>.</Text></Text>
            <Text style={styles.pageSubtitle}>Good choices. Great taste. Ready when you are.</Text>
            {cartCount === 0 ? (
              <View style={styles.emptyCart}>
                <View style={styles.emptyIcon}><Text style={styles.emptyBolt}>ϟ</Text></View>
                <Text style={styles.emptyTitle}>Running on empty?</Text>
                <Text style={styles.emptyText}>Your next favorite flavor is waiting in the lineup.</Text>
                <View style={{ width: "100%", maxWidth: 350 }}><ActionButton label="EXPLORE THE DRINKS" onPress={() => setScreen("catalog")} /></View>
              </View>
            ) : (
              <View style={[styles.checkoutLayout, isWide && { flexDirection: "row", alignItems: "flex-start" }]}>
                <View style={{ flex: 1, width: "100%" }}>
                  {products.filter(p => (cart[p.id] || 0) > 0).map(product => (
                    <View key={product.id} style={styles.cartItem}>
                      <View style={[styles.cartCanBox, { backgroundColor: productTint(product) }]}><DrinkCan product={product} scale={0.48} rotate="-7deg" /></View>
                      <View style={styles.cartItemInfo}>
                        <Text style={[styles.productName, { fontSize: 17 }]}>{product.name}</Text>
                        <Text style={styles.cartItemDetail}>{money(product.price)} each · {product.category}</Text>
                        <View style={styles.cartItemBottom}><View style={{ width: 126 }}><QuantityControl product={product} count={cart[product.id]} add={() => addToCart(product)} remove={() => removeFromCart(product.id)} /></View><Text style={styles.cartLineTotal}>{money(product.price * cart[product.id])}</Text></View>
                      </View>
                    </View>
                  ))}
                  <View style={styles.mixNote}><Text style={styles.mixNoteIcon}>✦</Text><Text style={styles.mixNoteText}>Your hydration picks, ready for simulated checkout.</Text></View>
                </View>
                <View style={[styles.receipt, isWide && { width: 306 }]}>
                  <View style={styles.receiptHeading}><Text style={styles.receiptTitle}>THE GAME PLAN</Text><Text style={styles.receiptBolt}>ϟ</Text></View>
                  <View style={styles.receiptRow}><Text style={styles.receiptLabel}>Drinks selected</Text><Text style={styles.receiptValue}>{cartCount}</Text></View>
                  <View style={styles.receiptRow}><Text style={styles.receiptLabel}>Subtotal</Text><Text style={styles.receiptValue}>{money(total)}</Text></View>
                  <View style={styles.receiptDivider} />
                  <View style={styles.receiptRow}><Text style={styles.receiptTotalLabel}>TOTAL</Text><Text style={styles.receiptTotal}>{money(total)}</Text></View>
                  {!!checkoutError && <Text accessibilityRole="alert" style={styles.errorText}>{checkoutError}</Text>}
                  <ActionButton label="POWER UP" onPress={checkout} hint="Complete a simulated purchase. No payment is charged." />
                  <View style={styles.demoPill}><Text style={styles.demoPillText}>DEMO CHECKOUT · NO CHARGE</Text></View>
                  <Text style={styles.receiptNote}>This is a vending-machine simulation. No payment or physical dispensing takes place.</Text>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {screen === "success" && (
          <ScrollView key="success" contentContainerStyle={styles.successScroll}>
            <View style={styles.successCard}>
              <View style={styles.successArt}><View style={styles.successRing} /><View style={styles.successCheck}><Text style={styles.successCheckText}>✓</Text></View><Text style={styles.successSparkLeft}>✦</Text><Text style={styles.successSparkRight}>✦</Text></View>
              <View style={styles.successPill}><Text style={styles.successPillText}>MISSION COMPLETE</Text></View>
              <Text style={[styles.successTitle, { fontSize: isWide ? 56 : 42, lineHeight: isWide ? 55 : 43 }]}>YOU'RE ALL{"\n"}CHARGED UP.</Text>
              <Text style={styles.successDescription}>Excellent taste. Your simulated order is complete.</Text>
              <View style={styles.successSummary}><View><Text style={styles.successSummaryLabel}>DRINKS IN YOUR MIX</Text><Text style={styles.successSummaryValue}>{receipt.count.toString().padStart(2, "0")}</Text></View><View style={styles.summaryLine} /><View><Text style={styles.successSummaryLabel}>SIMULATED TOTAL</Text><Text style={styles.successSummaryValue}>{money(receipt.total)}</Text></View></View>
              <View style={{ width: "100%", maxWidth: 360 }}><ActionButton label="BACK TO THE LINEUP" onPress={() => setScreen("catalog")} /></View>
              <TouchableOpacity accessibilityRole="button" onPress={resetDemo} style={styles.resetButton}><Text style={styles.resetText}>↻ Reset demo & restock</Text></TouchableOpacity>
              <Text style={styles.successFootnote}>NO PAYMENT WAS TAKEN. NO DRINK WAS DISPENSED.</Text>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0D171F", alignItems: "center" },
  machine: { flex: 1, width: "100%", maxWidth: 1120, backgroundColor: "#F8F9F4", overflow: "hidden" },
  machineWide: { marginVertical: 22, width: "94%", borderRadius: 20, borderWidth: 1, borderColor: "#36444A" },
  header: { minHeight: 88, backgroundColor: INK, paddingHorizontal: 34, paddingVertical: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 4, borderBottomColor: YELLOW },
  headerCompact: { paddingHorizontal: 18, minHeight: 80, paddingVertical: 16 },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoTile: { width: 38, height: 42, borderRadius: 8, backgroundColor: YELLOW, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-5deg" }] },
  logoBolt: { fontSize: 40, lineHeight: 43, fontWeight: "900", color: INK },
  logoText: { color: "#FFFFFF", fontSize: 19, fontWeight: "900", letterSpacing: -0.8 },
  logoSub: { color: "#BCC9CA", fontSize: 7, fontWeight: "800", letterSpacing: 1.9, marginTop: 2 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 28 },
  liveStatus: { flexDirection: "row", alignItems: "center", gap: 8 },
  liveDot: { width: 6, height: 6, backgroundColor: AQUA, borderRadius: 3 },
  liveText: { fontSize: 9, color: "#C9D6D6", fontWeight: "700", letterSpacing: 1.5 },
  editionTag: { borderWidth: 1, borderColor: "#53606A", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 4 },
  editionText: { color: YELLOW, fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  headerCart: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 10 },
  headerCartText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  cartBadge: { borderRadius: 7, minWidth: 30, height: 30, paddingHorizontal: 7, backgroundColor: YELLOW, alignItems: "center", justifyContent: "center" },
  cartBadgeText: { color: INK, fontWeight: "900", fontSize: 14 },
  welcomeScroll: { flexGrow: 1 },
  welcomeHero: { backgroundColor: YELLOW, overflow: "hidden" },
  welcomeHeroWide: { flexDirection: "row", alignItems: "center", minHeight: 452 },
  welcomeCopy: { padding: 26, paddingTop: 34 },
  seriesPill: { alignSelf: "flex-start", borderWidth: 1.5, borderColor: INK, borderRadius: 4, paddingVertical: 7, paddingHorizontal: 10, marginBottom: 22 },
  seriesText: { fontWeight: "900", letterSpacing: 1.4, fontSize: 9, color: INK },
  heroTitle: { fontWeight: "900", color: INK, letterSpacing: -2.9, fontStyle: "italic" },
  heroOutline: { color: "#3A5141" },
  heroDescription: { fontSize: 15, lineHeight: 23, color: "#3B431D", maxWidth: 320, marginTop: 20 },
  heroButton: { marginTop: 28, width: "100%", maxWidth: 340 },
  heroNote: { fontSize: 8, fontWeight: "800", letterSpacing: 1.5, marginTop: 14, color: "#485025" },
  actionButton: { minHeight: 54, backgroundColor: INK, paddingHorizontal: 20, paddingVertical: 16, borderRadius: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  actionLight: { backgroundColor: YELLOW },
  actionDisabled: { opacity: 0.35 },
  actionText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, flexShrink: 1 },
  actionArrow: { fontSize: 24, color: YELLOW, lineHeight: 24 },
  heroArtwork: { alignItems: "center", justifyContent: "center", position: "relative" },
  artCircle: { position: "absolute", backgroundColor: "#C8ED71", borderWidth: 2, borderColor: INK, transform: [{ rotate: "-15deg" }] },
  orbitRing: { position: "absolute", width: "90%", height: "48%", borderWidth: 1.5, borderColor: "#555E29", borderRadius: 150, transform: [{ rotate: "-30deg" }] },
  heroCanLeft: { position: "absolute", zIndex: 2 },
  heroCanRight: { position: "absolute", zIndex: 2 },
  heroCanCenter: { position: "absolute", zIndex: 3 },
  burstLine: { position: "absolute", width: 34, height: 7, backgroundColor: INK, borderRadius: 3 },
  powerSticker: { position: "absolute", zIndex: 4, bottom: "12%", right: "5%", flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: INK, paddingHorizontal: 12, paddingVertical: 8, transform: [{ rotate: "-8deg" }], borderRadius: 5, gap: 5 },
  stickerBolt: { fontSize: 32, fontWeight: "900", color: INK },
  stickerText: { fontSize: 10, lineHeight: 12, fontWeight: "900", color: INK },
  artSpark: { position: "absolute", top: "7%", right: "9%" },
  artSparkText: { color: INK, fontSize: 44 },
  dots: { position: "absolute", width: 86, height: 66, bottom: 10, left: 10, flexDirection: "row", flexWrap: "wrap", gap: 8, opacity: 0.14 },
  dot: { width: 4, height: 4, borderRadius: 2 },
  canShadow: { position: "absolute", width: "90%", left: "5%", backgroundColor: "#14212B", opacity: 0.12, borderRadius: 100 },
  canBody: { position: "absolute", left: 2, right: 2, borderWidth: 1.2, borderColor: "#415157", overflow: "hidden", alignItems: "center" },
  canSide: { position: "absolute", top: 0, bottom: 0, right: 0, backgroundColor: "rgba(20,33,43,0.12)" },
  canHighlight: { position: "absolute", top: 0, bottom: 0, backgroundColor: "rgba(255,255,255,0.45)" },
  canSlash: { position: "absolute", backgroundColor: "rgba(255,255,255,0.25)", transform: [{ rotate: "27deg" }] },
  canMicro: { color: INK, fontWeight: "800" },
  canBrand: { color: INK, fontWeight: "900", fontStyle: "italic" },
  canBolt: { color: INK, fontWeight: "900", textAlign: "center" },
  canFlavorBar: { backgroundColor: INK, width: "100%", alignItems: "center" },
  canFlavor: { color: "#FFFFFF", fontWeight: "900" },
  canVolume: { color: INK, fontWeight: "700" },
  canRim: { position: "absolute", top: 0, left: 4, right: 4, backgroundColor: "#DFE6E3", borderWidth: 1, borderColor: "#6B7A7E", alignItems: "center", justifyContent: "center" },
  canBottom: { position: "absolute", bottom: 0, left: 5, right: 5, backgroundColor: "#C4CFCC", borderWidth: 1, borderColor: "#6B7A7E" },
  ticker: { minHeight: 43, paddingHorizontal: 15, paddingVertical: 12, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", gap: 7, backgroundColor: INK },
  tickerText: { fontSize: 9, fontWeight: "900", color: YELLOW, letterSpacing: 1.1 },
  tickerStar: { color: AQUA, fontSize: 16 },
  welcomeBottom: { padding: 32, flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" },
  welcomeInstructions: { marginRight: 18 },
  sectionEyebrow: { fontSize: 8, fontWeight: "800", letterSpacing: 1.5, color: "#66766E" },
  welcomeBottomTitle: { fontSize: 21, fontWeight: "800", letterSpacing: -0.6, color: INK, marginTop: 7 },
  howSteps: { flexDirection: "row", gap: 24, justifyContent: "space-between" },
  howStep: { gap: 6 },
  howNumber: { fontSize: 23, color: "#6C8477", fontWeight: "900", letterSpacing: -1 },
  howLabel: { fontSize: 10, color: INK, fontWeight: "700" },
  demoFooter: { padding: 16, borderTopWidth: 1, borderTopColor: "#DEE4DC", alignItems: "center" },
  demoFooterText: { color: "#6B7972", fontSize: 7, fontWeight: "700", letterSpacing: 1, textAlign: "center" },
  stepsBar: { paddingHorizontal: 18, minHeight: 58, paddingVertical: 13, flexDirection: "row", justifyContent: "center", backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#E0E5DD" },
  stepItem: { flexDirection: "row", alignItems: "center" },
  stepCircle: { width: 25, height: 25, borderRadius: 13, backgroundColor: "#F0F2EB", alignItems: "center", justifyContent: "center", marginRight: 6 },
  stepCircleActive: { backgroundColor: YELLOW },
  stepCircleDone: { backgroundColor: AQUA },
  stepNumber: { color: "#748077", fontSize: 9, fontWeight: "800" },
  stepLabel: { fontSize: 8, letterSpacing: 0.6, fontWeight: "800", color: "#79847C" },
  stepLabelActive: { color: INK },
  stepLine: { width: 18, height: 1, backgroundColor: "#D7DED6", marginHorizontal: 9 },
  catalogContent: { padding: 28, paddingTop: 24, paddingBottom: 20 },
  contentCompact: { padding: 16, paddingTop: 20 },
  catalogHero: { backgroundColor: YELLOW, minHeight: 182, paddingHorizontal: 28, paddingVertical: 22, borderRadius: 12, flexDirection: "row", alignItems: "center", overflow: "hidden", borderWidth: 1.5, borderColor: INK },
  promoEyebrow: { fontSize: 8, fontWeight: "900", letterSpacing: 1.6, color: "#354526", marginBottom: 8 },
  catalogTitle: { fontWeight: "900", letterSpacing: -1.5, color: INK, fontStyle: "italic" },
  promoDescription: { fontSize: 11, lineHeight: 16, color: "#3F4A27", marginTop: 8, maxWidth: 230 },
  promoArt: { alignItems: "center", justifyContent: "center", height: 140 },
  promoCircle: { position: "absolute", width: 142, height: 142, borderRadius: 80, backgroundColor: "#C2EC69", borderWidth: 1, borderColor: INK },
  collectionHeading: { marginTop: 25, marginBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" },
  collectionTitle: { fontSize: 17, letterSpacing: -0.4, fontWeight: "900", color: INK },
  collectionCount: { color: "#809080", fontSize: 15 },
  collectionHint: { color: "#6B796D", fontSize: 7, fontWeight: "800", letterSpacing: 1.1 },
  filters: { gap: 8, paddingBottom: 18 },
  filter: { minHeight: 40, borderWidth: 1, borderColor: "#D7DFD5", borderRadius: 7, paddingHorizontal: 17, paddingVertical: 11, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  filterActive: { backgroundColor: INK, borderColor: INK },
  filterText: { fontSize: 10, fontWeight: "700", color: "#536251" },
  filterTextActive: { color: YELLOW },
  productGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", rowGap: 17 },
  productCard: { backgroundColor: "#FFFFFF", borderWidth: 1.5, borderColor: "#D5DDD1", borderRadius: 11, overflow: "hidden" },
  productArt: { alignItems: "center", justifyContent: "center", overflow: "hidden" },
  cardTopLine: { position: "absolute", top: 10, left: 11, right: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", zIndex: 1 },
  productCode: { fontSize: 8, color: "#4B5A4C", fontWeight: "800", letterSpacing: 1 },
  typeBadge: { width: 25, height: 25, borderRadius: 13, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(20,33,43,0.25)" },
  typeSymbol: { color: INK, fontSize: 18, lineHeight: 22, fontWeight: "900" },
  productHalo: { position: "absolute", width: 106, height: 106, borderRadius: 55, opacity: 0.5, top: 33 },
  zeroBadge: { position: "absolute", bottom: 8, left: 9, backgroundColor: "#FFFFFF", borderRadius: 3, paddingHorizontal: 5, paddingVertical: 4 },
  zeroBadgeText: { color: "#465945", fontSize: 6, fontWeight: "800", letterSpacing: 0.6 },
  soldOverlay: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(245,247,242,0.74)", alignItems: "center", justifyContent: "center", zIndex: 2 },
  soldLabel: { backgroundColor: INK, color: YELLOW, fontWeight: "900", fontSize: 14, paddingHorizontal: 12, paddingVertical: 7, transform: [{ rotate: "-8deg" }] },
  productInfo: { padding: 16 },
  productName: { color: INK, fontSize: 19, fontWeight: "800", letterSpacing: -0.6 },
  productFlavor: { fontSize: 6.5, fontWeight: "700", letterSpacing: 0.65, color: "#78816F", marginTop: 5 },
  nutritionRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", columnGap: 5, marginTop: 12 },
  nutritionText: { fontSize: 8, color: "#5C6A59" },
  nutritionDivider: { fontSize: 10, color: "#A6B09F" },
  cardPriceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, marginBottom: 12 },
  price: { color: INK, fontWeight: "900", fontSize: 22, letterSpacing: -0.6 },
  stockText: { color: "#6F7F64", fontSize: 8, fontWeight: "600" },
  addButton: { minHeight: 42, backgroundColor: INK, borderRadius: 6, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  addDisabled: { opacity: 0.35 },
  addLabel: { color: "#FFFFFF", fontSize: 8, letterSpacing: 0.6, fontWeight: "800" },
  addPlus: { color: YELLOW, fontSize: 24, lineHeight: 28, fontWeight: "600" },
  quantityControl: { minHeight: 42, backgroundColor: "#F3F6EE", borderWidth: 1, borderColor: "#CDD7C6", borderRadius: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between", overflow: "hidden" },
  quantityButton: { width: 42, height: 42, alignItems: "center", justifyContent: "center" },
  quantitySymbol: { color: INK, fontSize: 22, fontWeight: "600" },
  quantityNumber: { color: INK, fontWeight: "900", fontSize: 15 },
  catalogFootnote: { fontSize: 9, color: "#77816F", textAlign: "center", marginTop: 24, marginBottom: 3, lineHeight: 15 },
  cartDock: { backgroundColor: INK, paddingHorizontal: 28, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, borderTopWidth: 3, borderTopColor: AQUA },
  dockInfo: { flexDirection: "row", alignItems: "center", gap: 12, flexShrink: 1 },
  dockCount: { width: 36, height: 39, borderWidth: 1, borderColor: "#55656B", borderRadius: 7, alignItems: "center", justifyContent: "center" },
  dockCountText: { color: AQUA, fontSize: 18, fontWeight: "900" },
  dockLabel: { color: "#ACBFBF", fontSize: 7, fontWeight: "800", letterSpacing: 0.7 },
  dockTotal: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", letterSpacing: -0.5, marginTop: 3 },
  dockTotalCaption: { color: "#A9BAB9", fontSize: 9, fontWeight: "500", letterSpacing: 0 },
  dockButton: { minHeight: 46, backgroundColor: YELLOW, paddingVertical: 15, paddingHorizontal: 20, borderRadius: 7, alignItems: "center", justifyContent: "center" },
  dockDisabled: { opacity: 0.42 },
  dockButtonText: { color: INK, fontSize: 9, fontWeight: "900", letterSpacing: 0.5 },
  cartContent: { padding: 30, flexGrow: 1 },
  backButton: { alignSelf: "flex-start", minHeight: 42, justifyContent: "center", marginBottom: 10 },
  backText: { color: "#5E7059", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  pageTitle: { color: INK, fontWeight: "900", fontSize: 43, letterSpacing: -1.8, lineHeight: 48 },
  pageSubtitle: { fontSize: 13, color: "#6D7A65", marginTop: 10, marginBottom: 26, lineHeight: 20 },
  checkoutLayout: { gap: 24 },
  cartItem: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DCE3D6", borderRadius: 10, padding: 13, marginBottom: 12, flexDirection: "row", gap: 15, alignItems: "center" },
  cartCanBox: { width: 66, height: 95, borderRadius: 7, alignItems: "center", justifyContent: "center" },
  cartItemInfo: { flex: 1, minWidth: 0 },
  cartItemDetail: { fontSize: 9, color: "#7A8670", marginTop: 5 },
  cartItemBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 10, flexWrap: "wrap" },
  cartLineTotal: { fontSize: 19, fontWeight: "900", letterSpacing: -0.5, color: INK },
  mixNote: { paddingHorizontal: 12, paddingVertical: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  mixNoteIcon: { color: "#63875C", fontSize: 22 },
  mixNoteText: { flex: 1, fontSize: 11, color: "#6C7B61", lineHeight: 17 },
  receipt: { backgroundColor: "#F3F4DE", padding: 24, borderRadius: 11, borderWidth: 1.5, borderColor: INK },
  receiptHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  receiptTitle: { fontSize: 13, fontWeight: "900", letterSpacing: 0.6, color: INK },
  receiptBolt: { fontSize: 26, color: INK, fontWeight: "900" },
  receiptRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12 },
  receiptLabel: { fontSize: 12, color: "#6D7759" },
  receiptValue: { fontSize: 13, color: INK, fontWeight: "700" },
  receiptDivider: { height: 1, backgroundColor: "#CBD0AD", marginBottom: 21 },
  receiptTotalLabel: { fontWeight: "900", fontSize: 12, color: INK },
  receiptTotal: { color: INK, fontWeight: "900", fontSize: 33, letterSpacing: -1 },
  demoPill: { alignSelf: "center", marginTop: 16, backgroundColor: "#E1E7CA", paddingHorizontal: 9, paddingVertical: 6, borderRadius: 4 },
  demoPillText: { fontSize: 7, fontWeight: "800", letterSpacing: 0.6, color: "#516142" },
  receiptNote: { fontSize: 9, lineHeight: 15, color: "#74805E", textAlign: "center", marginTop: 10 },
  errorText: { color: "#A62E41", fontSize: 12, lineHeight: 18, marginBottom: 14 },
  emptyCart: { alignItems: "center", paddingVertical: 44, paddingHorizontal: 18, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DEE5D8", borderRadius: 12 },
  emptyIcon: { backgroundColor: YELLOW, width: 75, height: 75, borderRadius: 20, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-7deg" }] },
  emptyBolt: { fontSize: 62, color: INK, fontWeight: "900" },
  emptyTitle: { fontSize: 26, fontWeight: "900", color: INK, letterSpacing: -1, marginTop: 23 },
  emptyText: { color: "#728166", fontSize: 13, lineHeight: 20, textAlign: "center", maxWidth: 260, marginTop: 10, marginBottom: 26 },
  successScroll: { flexGrow: 1, padding: 20, justifyContent: "center", alignItems: "center", backgroundColor: "#F4F6ED" },
  successCard: { width: "100%", maxWidth: 550, alignItems: "center", paddingVertical: 22, paddingHorizontal: 12 },
  successArt: { width: 190, height: 135, alignItems: "center", justifyContent: "center" },
  successRing: { width: 132, height: 132, borderRadius: 68, borderWidth: 1, borderColor: "#A1B9A5", position: "absolute" },
  successCheck: { width: 96, height: 96, borderRadius: 25, backgroundColor: YELLOW, borderWidth: 2, borderColor: INK, transform: [{ rotate: "-8deg" }], justifyContent: "center", alignItems: "center" },
  successCheckText: { fontSize: 57, fontWeight: "900", color: INK },
  successSparkLeft: { position: "absolute", color: "#8BAF83", fontSize: 28, left: 1, bottom: 18 },
  successSparkRight: { position: "absolute", color: INK, fontSize: 35, right: 2, top: 6 },
  successPill: { backgroundColor: "#E0ECCF", borderRadius: 5, paddingHorizontal: 11, paddingVertical: 7, marginTop: 22, marginBottom: 17 },
  successPillText: { fontSize: 8, fontWeight: "900", color: "#46613F", letterSpacing: 1.4 },
  successTitle: { color: INK, fontWeight: "900", letterSpacing: -2, textAlign: "center", fontStyle: "italic" },
  successDescription: { fontSize: 13, color: "#6D7D61", textAlign: "center", lineHeight: 20, maxWidth: 260, marginTop: 17 },
  successSummary: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 22, marginVertical: 28, padding: 20, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DBE3D3", borderRadius: 8, width: "100%", maxWidth: 360 },
  successSummaryLabel: { fontSize: 7, color: "#7A876C", fontWeight: "800", letterSpacing: 0.6 },
  successSummaryValue: { fontSize: 28, fontWeight: "900", color: INK, letterSpacing: -1, marginTop: 5 },
  summaryLine: { width: 1, height: 45, backgroundColor: "#DEE5D7" },
  resetButton: { padding: 16, marginTop: 5, minHeight: 44 },
  resetText: { fontSize: 11, color: "#617656", fontWeight: "600" },
  successFootnote: { fontSize: 6.5, fontWeight: "700", letterSpacing: 0.6, color: "#859176", textAlign: "center", marginTop: 8 },
});
