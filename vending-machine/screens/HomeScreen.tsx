// Welcome page. Displays branding, featured product artwork, and the button
// that starts the shopping flow. Product data is received from App.tsx.

import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import type { Product } from "../data/products";
import { styles } from "../styles/theme";
import { ActionButton, DrinkCan, DotPattern, money, productColor, productTint } from "../components/ui";

export default function HomeScreen({ products, isWide, onStart }: { products: Product[]; isWide: boolean; onStart: () => void }) {
  return (
          <ScrollView contentContainerStyle={styles.welcomeScroll}>
            <View style={[styles.welcomeHero, isWide && styles.welcomeHeroWide]}>
              <View style={[styles.welcomeCopy, isWide && { flex: 1, paddingRight: 0 }]}>
                <View style={styles.seriesPill}><Text style={styles.seriesText}>ϟ THE RECOVERY COLLECTION</Text></View>
                <Text style={[styles.heroTitle, { fontSize: isWide ? 66 : 48, lineHeight: isWide ? 65 : 48 }]}>BIG FLAVOR.{"\n"}FULL <Text style={styles.heroOutline}>CHARGE.</Text></Text>
                <Text style={styles.heroDescription}>Explore our hydration drink lineup and find your next refreshment.</Text>
                <View style={styles.heroButton}><ActionButton label="CHOOSE YOUR ENERGY" onPress={() => onStart()} /></View>
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
              <Text style={styles.tickerText}>{String(products.length).toUpperCase()} DRINKS</Text><Text style={styles.tickerStar}>✦</Text>
              <Text style={styles.tickerText}>ZERO BORING</Text><Text style={styles.tickerStar}>✦</Text>
              <Text style={styles.tickerText}>STAY REFRESHED</Text>
            </View>
            <View style={[styles.welcomeBottom, !isWide && { paddingHorizontal: 22 }]}>
              <View style={styles.welcomeInstructions}>
                <Text style={styles.sectionEyebrow}>YOUR NEXT PICK-ME-UP</Text>
                <Text style={styles.welcomeBottomTitle}>Good taste. Three taps away.</Text>
              </View>
              <View style={[styles.howSteps, !isWide && { width: "100%", marginTop: 22 }]}>
                {["Pick a flavor", "Review your drink", "Power up"].map((label, i) => (
                  <View key={label} style={styles.howStep}><Text style={styles.howNumber}>0{i + 1}</Text><Text style={styles.howLabel}>{label}</Text></View>
                ))}
              </View>
            </View>
            <View style={styles.demoFooter}><Text style={styles.demoFooterText}>INTERACTIVE DEMO · NO REAL PAYMENTS</Text></View>
          </ScrollView>

  );
}
