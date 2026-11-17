import React from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Product } from "../data/products";
import { ActionButton, AppFooter, DrinkCan } from "../components/ui";
import { useSlideIn } from "../components/motion";
import { colors, styles } from "../styles/theme";

export default function HomeScreen({ products, isWide, onStart }: {
  products: Product[];
  isWide: boolean;
  onStart: () => void;
}) {
  const artworkEntrance = useSlideIn();
  const featured = products[0];

  return (
    <ScrollView contentContainerStyle={styles.welcomeScroll}>
      <View style={home.hero}>
        <View pointerEvents="none" style={[home.edgeRing, home.edgeRingLeft]} />
        <View pointerEvents="none" style={[home.edgeRing, home.edgeRingRight]} />
        {featured && (
          <Animated.View
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            aria-hidden
            style={[home.artwork, isWide && home.artworkWide, artworkEntrance]}
          >
            <View style={[home.artDisc, isWide && home.artDiscWide]} />
            <View style={[home.artOrbit, isWide && home.artOrbitWide]} />
            <DrinkCan product={featured} scale={isWide ? 1.18 : 0.9} rotate="-13deg" />
            <Text style={[home.spark, home.sparkTop]}>✦</Text>
            <Text style={[home.spark, home.sparkBottom]}>✦</Text>
          </Animated.View>
        )}
        <Text accessibilityRole="header" style={[styles.heroTitle, home.title, isWide && home.titleWide]}>
          COLD DRINKS.{"\n"}<Text style={home.titleAccent}>QUICK PICKS.</Text>
        </Text>
        <View style={home.browseButton}>
          <ActionButton label="BROWSE DRINKS" onPress={onStart} light prominent />
        </View>
      </View>
      <AppFooter compact />
    </ScrollView>
  );
}

const home = StyleSheet.create({
  hero: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: colors.blue,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  edgeRing: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 260,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  edgeRingLeft: { left: -295, bottom: -330 },
  edgeRingRight: { right: -278, top: -355 },
  artwork: {
    width: 224,
    height: 159,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  artworkWide: { width: 290, height: 198, marginBottom: 18 },
  artDisc: {
    position: "absolute",
    width: 124,
    height: 124,
    borderRadius: 100,
    backgroundColor: colors.orange,
  },
  artDiscWide: { width: 157, height: 157 },
  artOrbit: {
    position: "absolute",
    width: 190,
    height: 90,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: colors.orangeTint,
    transform: [{ rotate: "-24deg" }],
  },
  artOrbitWide: { width: 245, height: 112 },
  spark: { position: "absolute", color: colors.orangeTint, fontSize: 24, lineHeight: 28 },
  sparkTop: { right: "12%", top: "8%" },
  sparkBottom: { left: "13%", bottom: "11%", fontSize: 16 },
  title: { color: colors.surface, textAlign: "center", fontSize: 42, lineHeight: 44, letterSpacing: -2 },
  titleWide: { fontSize: 66, lineHeight: 67, letterSpacing: -3.5 },
  titleAccent: { color: colors.blueTint },
  browseButton: { width: "100%", maxWidth: 310, marginTop: 24 },
});
