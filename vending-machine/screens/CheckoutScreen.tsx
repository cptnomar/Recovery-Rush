import ProductPhoto from "../components/ProductPhoto";
// Product detail and selection review. Payment happens only from the cart.
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import type { Product } from "../data/products";
import { styles } from "../styles/theme";
import { ActionButton, DrinkCan, HealthNotice, money, productTint } from "../components/ui";

type Props = { selected: Product | undefined; inCart: number; cartCount: number; isWide: boolean; onBack: () => void; onAdd: () => void; onReviewCart: () => void };
export default function CheckoutScreen({ selected, inCart, cartCount, isWide, onBack, onAdd, onReviewCart }: Props) {
  const available = selected ? Math.max(0, selected.stock - inCart) : 0;
  return (
    <ScrollView contentContainerStyle={[styles.cartContent, !isWide && styles.contentCompact, styles.checkoutScreen]}>
      <TouchableOpacity accessibilityRole="button" onPress={onBack} style={styles.backButton}><Text style={styles.backText}>← BACK TO DRINKS</Text></TouchableOpacity>
      <Text style={[styles.pageTitle, styles.centeredTitle, !isWide && { fontSize: 30, lineHeight: 35 }]}>MEET YOUR NEXT PICK.</Text>
      <Text style={[styles.pageSubtitle, styles.centeredTitle]}>Review the drink, then add it to your cart.</Text>
      {selected && <View style={[styles.selectionCard, isWide && styles.selectionCardWide]}>
        <View style={[styles.selectionArtwork, { backgroundColor: productTint(selected) }]}><ProductPhoto product={selected} width={isWide ? 155 : 120} height={isWide ? 230 : 180} /></View>
        <View style={styles.selectionDetails}>
          <Text style={styles.selectionName}>{selected.name}</Text>
          <Text style={styles.selectionCategory}>{selected.category}</Text>
          <Text style={styles.selectionDescription}>{selected.description || "Hydration beverage"}</Text>
          <Text style={styles.selectionPrice}>{money(selected.price)}</Text>
          <Text style={styles.selectionStock}>{selected.stock === 0 ? "Sold out" : `${available} available to add · ${inCart} in your cart`}</Text>
        </View>
      </View>}
      <View style={styles.checkoutActions}>
        <HealthNotice />
        <ActionButton label={available > 0 ? "ADD TO CART" : selected?.stock ? "ALL AVAILABLE DRINKS IN CART" : "SOLD OUT"} onPress={onAdd} disabled={available <= 0} hint="Add one drink and open your cart for review. No payment is charged." />
        {cartCount > 0 && <TouchableOpacity accessibilityRole="button" accessibilityLabel="Review existing cart" style={styles.outlineButton} onPress={onReviewCart}><Text style={styles.outlineButtonText}>REVIEW CART ({cartCount})</Text></TouchableOpacity>}
        <TouchableOpacity accessibilityRole="button" style={styles.outlineButton} onPress={onBack}><Text style={styles.outlineButtonText}>CONTINUE BROWSING</Text></TouchableOpacity>
        <Text style={styles.checkoutDisclaimer}>DEMO ONLY · SAMPLE PRICES · NO REAL PAYMENT</Text>
      </View>
    </ScrollView>
  );
}
