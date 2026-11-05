// Single-item review page. Shows the chosen drink and calls App.tsx to
// confirm the simulated purchase; it does not update inventory directly.

import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import type { Product } from "../data/products";
import { styles } from "../styles/theme";
import { ActionButton, DrinkCan, DotPattern, money, productColor, productTint } from "../components/ui";

export default function CheckoutScreen({ selected, isWide, checkoutError, onBack, onPurchase }: { selected: Product | undefined; isWide: boolean; checkoutError: string; onBack: () => void; onPurchase: () => void }) {
  return (
          <ScrollView contentContainerStyle={[styles.cartContent, styles.checkoutScreen]}>
            <TouchableOpacity accessibilityRole="button" onPress={() => onBack()} style={styles.backButton}><Text style={styles.backText}>← BACK TO DRINKS</Text></TouchableOpacity>
            <Text style={[styles.pageTitle, styles.centeredTitle, !isWide && { fontSize: 30 }]}>CONFIRM YOUR SELECTION</Text>
            <Text style={[styles.pageSubtitle, styles.centeredTitle]}>Review your drink before purchasing.</Text>
            {/* The product is optional while navigating; only show details when selected. */}
            {selected && (
              <View style={[styles.selectionCard, isWide && styles.selectionCardWide]}>
                <View style={[styles.selectionArtwork, { backgroundColor: productTint(selected) }]}>
                  <DrinkCan product={selected} scale={isWide ? 1.45 : 1.12} />
                </View>
                <View style={styles.selectionDetails}>
                  <Text style={styles.selectionName}>{selected.name}</Text>
                  <Text style={styles.selectionCategory}>{selected.category}</Text>
                  <Text style={styles.selectionDescription}>{selected.description || "Hydration beverage"}</Text>
                  <Text style={styles.selectionPrice}>{money(selected.price)}</Text>
                  <Text style={styles.selectionStock}>In stock: {selected.stock}</Text>
                </View>
              </View>
            )}
            {/* The parent supplies stock-validation errors, if any. */}
            {!!checkoutError && <Text accessibilityRole="alert" style={styles.errorText}>{checkoutError}</Text>}
            <View style={styles.checkoutActions}>
              <ActionButton label="PURCHASE DRINK" onPress={onPurchase} disabled={!selected || selected.stock <= 0} hint="Simulate purchasing one drink. No payment is charged." />
              <TouchableOpacity accessibilityRole="button" style={styles.outlineButton} onPress={() => onBack()}><Text style={styles.outlineButtonText}>CHOOSE A DIFFERENT DRINK</Text></TouchableOpacity>
              <Text style={styles.checkoutDisclaimer}>DEMO CHECKOUT · NO REAL PAYMENT OR DISPENSING</Text>
            </View>
          </ScrollView>

  );
}
