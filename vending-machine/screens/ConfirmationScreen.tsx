import ProductPhoto from "../components/ProductPhoto";
// A purchased cart is dispensed one drink at a time, taking 3–5 seconds per drink.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, Animated } from "react-native";
import type { Order } from "../data/cart";
import { styles } from "../styles/theme";
import { ActionButton, BrandLogo, DrinkCan, HealthNotice, money, productTint } from "../components/ui";

type Props = { order: Order; onComplete: () => void; onReturnHome: () => void };
export default function ConfirmationScreen({ order, onComplete, onReturnHome }: Props) {
  const [complete, setComplete] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const drinks = useMemo(() => order.items.flatMap(({ product, quantity }) => Array.from({ length: quantity }, () => product)), [order]);

  useEffect(() => {
    let cancelled = false;
    let animation: Animated.CompositeAnimation | undefined;
    progress.setValue(0);
    setComplete(false);
    const dispense = (index: number) => {
      if (cancelled) return;
      setActiveIndex(index);
      animation = Animated.timing(progress, { toValue: (index + 1) / drinks.length, duration: 3000 + Math.random() * 2000, useNativeDriver: false });
      animation.start(({ finished }) => {
        if (!finished || cancelled) return;
        if (index + 1 < drinks.length) dispense(index + 1);
        else { setComplete(true); onComplete(); }
      });
    };
    if (drinks.length) dispense(0);
    return () => { cancelled = true; animation?.stop(); };
  }, [drinks, onComplete, progress]);

  const active = drinks[activeIndex];
  return (
    <ScrollView contentContainerStyle={styles.dispensingScroll}>
      <View style={styles.dispensingCard}>
        <BrandLogo width={210} />
        <View style={styles.dispensingIcon}><Text style={styles.dispensingCheck}>{complete ? "✓" : "↓"}</Text></View>
        <Text style={styles.dispensingHeading}>{complete ? "YOUR ORDER IS READY." : "ORDER CONFIRMED."}</Text>
        <Text style={styles.dispensingSubheading}>{complete ? "Your simulated drinks have finished dispensing." : `Dispensing drink ${activeIndex + 1} of ${order.count}.`}</Text>
        {!complete && active && <View style={styles.dispensingProduct}>
          <View style={{ backgroundColor: productTint(active), padding: 12, borderRadius: 10 }}><ProductPhoto product={active} width={50} height={84} /></View>
          <View style={{ flex: 1, gap: 7 }}><Text style={styles.dispensingName}>{active.name}</Text><Text style={styles.dispensingCategory}>{active.category}</Text></View>
        </View>}
        <View style={styles.progressArea}>
          <View style={styles.progressTrack}><Animated.View style={[styles.progressFill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }]} /></View>
          <Text accessibilityLiveRegion="polite" style={styles.progressLabel}>{complete ? `${order.count} of ${order.count} drinks complete` : `Please wait · ${activeIndex} of ${order.count} drinks complete`}</Text>
        </View>
        <View style={styles.orderRows}>
          <Text style={styles.orderHeading}>YOUR ORDER</Text>
          {order.items.map(({ product, quantity }) => <View key={product.id} style={styles.orderLine}><Text style={styles.orderItemLabel}>{quantity} × {product.name}</Text><Text style={styles.orderAmount}>{money(product.price * quantity)}</Text></View>)}
          <View style={styles.orderLine}><Text style={styles.orderItemLabel}>Simulated total</Text><Text style={styles.orderTotal}>{money(order.total)}</Text></View>
        </View>
        <View style={{ width: "100%", marginTop: 14 }}><HealthNotice dark /></View>
        {complete && <View style={styles.homeButtonWrap}><ActionButton label="RETURN TO HOME" onPress={onReturnHome} light /></View>}
        <Text style={[styles.checkoutDisclaimer, styles.lightNoticeText]}>SIMULATION ONLY · NO PAYMENT TAKEN · NO PHYSICAL DISPENSING</Text>
      </View>
    </ScrollView>
  );
}
