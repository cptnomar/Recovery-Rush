// Shared presentation helpers: palette, price formatting, decorative drink
// illustrations, and a reusable accessible action button.

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { Product } from "../data/products";
import { styles } from "../styles/theme";

export const INK = "#14212B";
export const YELLOW = "#FFDE32";
export const AQUA = "#61E8D3";
// Stable per-product accent colors are selected using the product ID.
const PRODUCT_COLORS = ["#C2EC49", "#7CDDDD", "#F99AC1", "#FFB567", "#BFA4EE"];
const PRODUCT_TINTS = ["#F0F8D5", "#E1F6F4", "#FDE8F1", "#FFF0DF", "#F0E9FB"];
export const productColor = (p: Product) => PRODUCT_COLORS[(p.id - 1) % PRODUCT_COLORS.length];
export const productTint = (p: Product) => PRODUCT_TINTS[(p.id - 1) % PRODUCT_TINTS.length];
// Always show prices with two decimal places.
export const money = (amount: number) => "$" + amount.toFixed(2);

// Decorative halftone dots used in the page artwork.
export function DotPattern({ color = INK }: { color?: string }) {
  return (
    <View pointerEvents="none" style={styles.dots}>
      {Array.from({ length: 30 }, (_, i) => (
        <View key={i} style={[styles.dot, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

// The can artwork is built from native Views and Text, so it works offline.
export function DrinkCan({ product, scale = 1, rotate = "0deg" }: { product: Product; scale?: number; rotate?: string }) {
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

// Shared call-to-action button with disabled and accessibility support.
export function ActionButton({ label, onPress, disabled = false, light = false, hint }: { label: string; onPress: () => void; disabled?: boolean; light?: boolean; hint?: string }) {
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

