import ProductPhoto from "../components/ProductPhoto";
import React from "react";
import { Animated, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { DRINK_CATEGORIES, type DrinkCategory, type Product } from "../data/products";
import type { Cart } from "../data/cart";
import { styles, colors } from "../styles/theme";
import { DrinkCan, DotPattern, AppFooter, money, productColor, productTint } from "../components/ui";
import { useSlideIn } from "../components/motion";

export type Category = "All drinks" | DrinkCategory;
const CATEGORIES: Category[] = ["All drinks", ...DRINK_CATEGORIES];

type Props = {
  products: Product[]; cart: Cart; cartCount: number; total: number;
  isWide: boolean; tiny: boolean; category: Category;
  onCategoryChange: (category: Category) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onReviewCart: () => void;
};

export default function ProductsScreen({ products, cart, cartCount, total, isWide, tiny, category, onCategoryChange, onSelectProduct, onAddToCart, onReviewCart }: Props) {
  const showCartDock = cartCount > 0;
  const cartEntrance = useSlideIn(showCartDock);
  const showAll = category === "All drinks";
  const visibleProducts = showAll ? products : products.filter(product => product.category === category);

  return (
    <>
      <ScrollView contentContainerStyle={[styles.catalogContent, !isWide && styles.contentCompact]}>
        <View style={[styles.catalogHero, !isWide && { padding: 20, minHeight: 158 }]}>
          <View style={{ flex: 1, zIndex: 2 }}>
            <Text style={styles.promoEyebrow}>RECOVERY RUSH</Text>
            <Text style={[styles.catalogTitle, { fontSize: isWide ? 38 : 25, lineHeight: isWide ? 40 : 29 }]}>FIND YOUR{"\n"}REFRESHMENT.</Text>
            <Text style={styles.promoDescription}>Add drinks as you browse. Review your cart when ready.</Text>
          </View>
          {!tiny && products[0] && <View style={[styles.promoArt, { width: isWide ? 230 : 100 }]}>
            <View style={styles.promoCircle} />
            {isWide && <View style={{ position: "absolute", left: 10, top: 15 }}><DrinkCan product={products[2] || products[0]} scale={0.92} rotate="-20deg" /></View>}
            <DrinkCan product={products[0]} scale={isWide ? 1.05 : 0.82} rotate="12deg" />
          </View>}
          <DotPattern color={colors.surface} />
        </View>
        <View style={styles.collectionHeading}>
          <Text accessibilityRole="header" style={styles.collectionTitle}>
            {showAll ? "THE LINEUP" : category.toUpperCase()}{" "}
            <Text style={styles.collectionCount}>/ {String(visibleProducts.length).padStart(2, "0")}</Text>
          </Text>
          <Text style={styles.collectionHint}>CHILLED & READY</Text>
        </View>
        <View style={[styles.filters, { flexDirection: "row", flexWrap: "wrap" }]}>
          {CATEGORIES.map(item => (
            <TouchableOpacity
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected: category === item }}
              accessibilityLabel={`Filter: ${item}`}
              onPress={() => onCategoryChange(item)}
              style={[styles.filter, category === item && styles.filterActive]}
            >
              <Text style={[styles.filterText, category === item && styles.filterTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[styles.productGrid, { columnGap: tiny ? 0 : isWide ? "2%" : "4%" }]}>
          {visibleProducts.map(product => {
            const quantity = cart[product.id] || 0;
            const atStockLimit = quantity >= product.stock;
            const addLabel = product.stock === 0 ? "SOLD OUT" : atStockLimit ? "ALL IN CART" : "ADD TO CART";
            return (
              <View key={product.id} style={[styles.productCard, { width: tiny ? "100%" : isWide ? "32%" : "48%" }]}>
                <View style={[styles.productArt, { backgroundColor: productTint(product), height: isWide ? 168 : 148 }]}>
                  <View style={styles.cardTopLine}><Text style={styles.productCode}>NO. 0{product.id}</Text><View style={[styles.typeBadge, { backgroundColor: productColor(product) }]}><Text style={styles.typeSymbol}>{product.emoji}</Text></View></View>
                  <View style={[styles.productHalo, { backgroundColor: productColor(product) }]} />
                  <View style={{ marginTop: 10 }}><ProductPhoto product={product} width={isWide ? 100 : 86} height={isWide ? 125 : 112} /></View>
                  {product.stock === 0 && <View style={styles.soldOverlay}><Text style={styles.soldLabel}>SOLD OUT</Text></View>}
                </View>
                <View style={[styles.productInfo, !isWide && { padding: 12 }]}>
                  <Text style={[styles.productName, !isWide && { fontSize: 16 }]}>{product.name}</Text>
                  <Text style={styles.productFlavor}>{product.category.toUpperCase()}</Text>
                  <Text numberOfLines={3} style={styles.productDescription}>{product.description || "Hydration beverage"}</Text>
                  <View style={styles.cardBottom}>
                    <Text accessibilityLiveRegion="polite" style={styles.inCartBadge}>{quantity ? `${quantity} in your cart` : " "}</Text>
                    <View style={styles.cardPriceRow}><Text style={styles.price}>{money(product.price)}</Text><Text style={styles.stockText}>{product.stock ? `${product.stock} in stock` : "Sold out"}</Text></View>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`Add ${product.name} to cart`}
                      accessibilityState={{ disabled: atStockLimit }}
                      activeOpacity={0.8}
                      disabled={atStockLimit}
                      onPress={() => onAddToCart(product)}
                      style={[styles.addButton, atStockLimit && styles.addDisabled]}
                    >
                      <Text style={styles.addLabel}>{addLabel}</Text>
                      {!atStockLimit && <Text style={styles.addPlus}>+</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`View ${product.name}`}
                      onPress={() => onSelectProduct(product)}
                      style={[styles.backButton, { alignSelf: "center", marginBottom: 0 }]}
                    >
                      <Text style={styles.backText}>VIEW DRINK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        <View style={{ marginTop: 24 }}><AppFooter /></View>
      </ScrollView>
      {showCartDock && (
        <Animated.View style={[styles.cartDock, !isWide && { paddingHorizontal: 16 }, cartEntrance]}>
          <View style={styles.dockInfo}>
            <View style={styles.dockCount}><Text style={styles.dockCountText}>{cartCount}</Text></View>
            <View>
              <Text style={styles.dockLabel}>YOUR CART</Text>
              <Text style={styles.dockTotal}>{money(total)}</Text>
            </View>
          </View>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Review cart" activeOpacity={0.8} onPress={onReviewCart} style={styles.dockButton}>
            <Text style={styles.dockButtonText}>REVIEW CART →</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
}
