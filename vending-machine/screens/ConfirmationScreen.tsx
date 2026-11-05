// Simulated dispensing page. Animates progress for 3–5 seconds, then
// reveals the Return to Home button only after the animation finishes.

import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, Animated } from "react-native";
import type { Product } from "../data/products";
import { styles } from "../styles/theme";
import { ActionButton, DrinkCan, money, productTint } from "../components/ui";

export default function ConfirmationScreen({ purchased, onReturnHome }: { purchased: Product; onReturnHome: () => void }) {
  // Completion is separate from progress so the home button stays hidden.
  const [dispensingComplete, setDispensingComplete] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  // Start one animation on mount and stop it if this page unmounts.
  useEffect(() => {
    progress.setValue(0);
    setDispensingComplete(false);
    // Every simulated purchase takes a random 3.00 to 5.00 seconds.
    const duration = 3000 + Math.random() * 2000;
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      useNativeDriver: false, // Animating width requires the JS driver.
    });
    animation.start(({ finished }) => {
      if (finished) setDispensingComplete(true);
    });
    return () => animation.stop();
  }, [progress]);

  return (
          <ScrollView key="success" contentContainerStyle={styles.dispensingScroll}>
            <View style={styles.dispensingCard}>
              <View style={styles.dispensingIcon}><Text style={styles.dispensingCheck}>{dispensingComplete ? "✓" : "ϟ"}</Text></View>
              <Text style={styles.dispensingHeading}>{dispensingComplete ? "DISPENSING COMPLETE!" : "PURCHASE CONFIRMED!"}</Text>
              <Text style={styles.dispensingSubheading}>{dispensingComplete ? "Your simulated drink is ready." : "Your drink is being dispensed."}</Text>
              <View style={styles.dispensingProduct}>
                <View style={{ backgroundColor: productTint(purchased), padding: 12, borderRadius: 10 }}><DrinkCan product={purchased} scale={0.55} /></View>
                <View style={{ flex: 1, gap: 7 }}><Text style={styles.dispensingName}>{purchased.name}</Text><Text style={styles.dispensingPrice}>{money(purchased.price)}</Text><Text style={styles.dispensingCategory}>{purchased.category}</Text></View>
              </View>
              <View style={styles.progressArea}>
                <View style={styles.progressTrack}>
                  <Animated.View style={[styles.progressFill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }]} />
                </View>
                <Text accessibilityRole="text" style={styles.progressLabel}>{dispensingComplete ? "Complete!" : "Dispensing your drink..."}</Text>
              </View>
              {/* Do not allow a return until the dispensing simulation finishes. */}
              {dispensingComplete && <View style={styles.homeButtonWrap}><ActionButton label="RETURN TO HOME" onPress={onReturnHome} light /></View>}
              <Text style={styles.checkoutDisclaimer}>SIMULATION ONLY · NO PAYMENT TAKEN · NO PHYSICAL DISPENSING</Text>
            </View>
          </ScrollView>
  );
}
