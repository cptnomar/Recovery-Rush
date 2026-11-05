// Product catalog. Displays stock, prices, descriptions, and category filters.
// Selecting an available drink notifies App.tsx; this screen does not sell items.

import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import type { Product } from "../data/products";
import { styles } from "../styles/theme";
import { ActionButton, DrinkCan, DotPattern, money, productColor, productTint } from "../components/ui";
// Category choices shown by the catalog filter.
export type Category = "All drinks" | "Drinks";
const CATEGORIES: Category[] = ["All drinks", "Drinks"];

export default function ProductsScreen({ products, isWide, tiny, category, onCategoryChange, onSelectProduct }: { products: Product[]; isWide: boolean; tiny: boolean; category: Category; onCategoryChange: (category: Category) => void; onSelectProduct: (product: Product) => void }) {
  return (
    <React.Fragment>
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
                  <TouchableOpacity key={item} accessibilityRole="button" accessibilityState={{ selected: category === item }} accessibilityLabel={`Filter: ${item}`} onPress={() => onCategoryChange(item)} style={[styles.filter, category === item && styles.filterActive]}>
                    <Text style={[styles.filterText, category === item && styles.filterTextActive]}>{item === "All drinks" ? "✦  " : ""}{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={[styles.productGrid, { columnGap: tiny ? 0 : isWide ? 10 : 12 }]}>
                {/* Only matching products are shown; sold-out products cannot be selected. */}
                {products.filter(p => category === "All drinks" || p.category === category).map(product => (
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
                      <View style={styles.cardPriceRow}><Text style={styles.price}>{money(product.price)}</Text><Text style={styles.stockText}>{product.stock ? `${product.stock} left` : "Sold out"}</Text></View>
                      <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Select ${product.name}`} accessibilityState={{ disabled: product.stock === 0 }} disabled={product.stock === 0} onPress={() => onSelectProduct(product)} style={[styles.addButton, product.stock === 0 && styles.addDisabled]}>
                        <Text style={styles.addLabel}>{product.stock ? "SELECT DRINK" : "SOLD OUT"}</Text><Text style={styles.addPlus}>→</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
              <Text style={styles.catalogFootnote}>DEMO MODE · SAMPLE PRICES · NO REAL PAYMENTS</Text>
            </ScrollView>

          </>
    </React.Fragment>
  );
}
