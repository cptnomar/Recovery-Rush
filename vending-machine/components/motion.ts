import { useEffect, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Platform } from "react-native";

export function useMotionEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (Platform.OS === "web") {
      if (typeof window === "undefined" || !window.matchMedia) return;
      const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
      const update = () => setEnabled(!preference.matches);
      update();
      preference.addEventListener("change", update);
      return () => preference.removeEventListener("change", update);
    }

    let mounted = true;
    const update = (reduced: boolean) => {
      if (mounted) setEnabled(!reduced);
    };
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", update);
    void AccessibilityInfo.isReduceMotionEnabled().then(update, () => {});
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return enabled;
}

export function useSlideIn(visible = true) {
  const enabled = useMotionEnabled();
  const [translateY] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!visible || !enabled) {
      translateY.setValue(0);
      return;
    }
    translateY.setValue(10);
    const animation = Animated.timing(translateY, {
      toValue: 0,
      duration: 230,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
    });
    animation.start();
    return () => animation.stop();
  }, [visible, enabled, translateY]);

  return { transform: [{ translateY }] };
}
