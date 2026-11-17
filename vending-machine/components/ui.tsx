// Shared presentation helpers: palette, price formatting, decorative drink
// illustrations, and a reusable accessible action button.

import React, { useEffect, useState } from "react";
import { Animated, View, Text, TouchableOpacity, Image, Linking, Platform, StyleSheet } from "react-native";
import type { Product } from "../data/products";
import { styles, colors } from "../styles/theme";
import { useMotionEnabled } from "./motion";

export const INK = colors.ink;
// Stable per-product accent colors are selected using the product ID.
const PRODUCT_COLORS = ["#FF9A5C", "#87ACF0", "#BDD1F5", "#F8BE97", "#A6BADE"];
const PRODUCT_TINTS = [colors.orangeTint, colors.blueTint, "#F0F4FC", "#FFF5ED", "#EAF0FA"];
export const productColor = (p: Product) => PRODUCT_COLORS[(p.id - 1) % PRODUCT_COLORS.length];
export const productTint = (p: Product) => PRODUCT_TINTS[(p.id - 1) % PRODUCT_TINTS.length];
// Always show prices with two decimal places.
export const money = (amount: number) => "$" + amount.toFixed(2);

export const BRAND_LOGO = require("../assets/recovery-rush-logo.png");
export const HANGOVER_DISCLAIMER = "There is no proven cure for a hangover. These drinks do not cure or treat hangovers, and they do not speed up recovery from alcohol.";
const HANGOVER_SOURCE = "https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/hangovers";

// Use the supplied logo as-is, preserving its original aspect ratio.
export function BrandLogo({ width = 180 }: { width?: number }) {
  return <Image source={BRAND_LOGO} accessibilityLabel="Recovery Rush logo" resizeMode="contain" style={[styles.brandImage, { width, height: width * 430 / 1010 }]} />;
}

export function HealthNotice({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <View style={[compact ? uiStyles.footerNotice : styles.disclaimer, dark && styles.disclaimerDark]}>
      {!compact && <Text style={[styles.disclaimerTitle, dark && styles.lightNoticeText]}>A NOTE ON HANGOVERS</Text>}
      <Text style={[styles.disclaimerBody, compact && uiStyles.footerNoticeText, dark && styles.lightNoticeText]}>{HANGOVER_DISCLAIMER}</Text>
      <TouchableOpacity accessibilityRole="link" accessibilityLabel="Read the NIAAA facts about hangovers" onPress={() => { void Linking.openURL(HANGOVER_SOURCE).catch(() => {}); }} style={[styles.disclaimerLinkButton, compact && uiStyles.footerLink]}>
        <Text style={[styles.disclaimerLink, dark && styles.lightNoticeText]}>{compact ? "Learn more" : "Read the NIAAA facts ↗"}</Text>
      </TouchableOpacity>
    </View>
  );
}

export function AppFooter({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.footer, compact && uiStyles.compactFooter]}>
      {!compact && <BrandLogo width={140} />}
      <HealthNotice compact={compact} />
      <Text style={styles.footerMeta}>{compact ? "DEMO ONLY · NO REAL PAYMENTS" : "RECOVERY RUSH · INTERACTIVE DEMO · SAMPLE PRICES · NO REAL PAYMENTS"}</Text>
    </View>
  );
}

export function QuantityControl({ product, quantity, onAdd, onReduce }: { product: Product; quantity: number; onAdd: () => void; onReduce: () => void }) {
  const atLimit = quantity >= product.stock;
  return (
    <View style={styles.quantityControl}>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Remove one ${product.name}`} onPress={onReduce} style={styles.quantityButton}><Text style={styles.quantitySymbol}>−</Text></TouchableOpacity>
      <Text accessibilityLabel={`${quantity} ${product.name} in cart`} style={styles.quantityNumber}>{quantity}</Text>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Add one ${product.name}`} accessibilityState={{ disabled: atLimit }} disabled={atLimit} onPress={onAdd} style={[styles.quantityButton, atLimit && styles.actionDisabled]}><Text style={styles.quantitySymbol}>+</Text></TouchableOpacity>
    </View>
  );
}

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
        <View style={{ marginTop: 15 * scale, marginBottom: 8 * scale }}><BrandLogo width={66 * scale} /></View>
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
export function ActionButton({ label, onPress, disabled = false, light = false, prominent = false, hint }: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  light?: boolean;
  prominent?: boolean;
  hint?: string;
}) {
  const motionEnabled = useMotionEnabled();
  const [scale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!motionEnabled || disabled) scale.setValue(1);
    return () => scale.stopAnimation();
  }, [motionEnabled, disabled, scale]);

  function animatePress(toValue: number) {
    if (!motionEnabled) return;
    Animated.timing(scale, {
      toValue,
      duration: 120,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={hint}
        accessibilityState={{ disabled }}
        activeOpacity={0.8}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => animatePress(0.98)}
        onPressOut={() => animatePress(1)}
        style={[styles.actionButton, light && styles.actionLight, prominent && uiStyles.prominentButton, disabled && styles.actionDisabled]}
      >
        <Text style={[styles.actionText, light && { color: INK }, prominent && uiStyles.prominentLabel]}>{label}</Text>
        <Text style={[styles.actionArrow, light && { color: INK }, prominent && uiStyles.prominentArrow]}>→</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const uiStyles = StyleSheet.create({
  compactFooter: {
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    gap: 4,
    backgroundColor: colors.logoPaper,
  },
  footerNotice: { width: "100%", maxWidth: 600, alignItems: "center" },
  footerNoticeText: { color: colors.muted, textAlign: "center" },
  footerLink: { alignSelf: "center" },
  prominentButton: {
    minHeight: 62,
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 42,
  },
  prominentLabel: { fontSize: 14, letterSpacing: 1.1, textAlign: "center" },
  prominentArrow: { position: "absolute", right: 18, top: "50%", marginTop: -12 },
});

