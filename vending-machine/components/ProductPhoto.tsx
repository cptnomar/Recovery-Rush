// Local manufacturer product images from Chimere's contribution. See assets/products/SOURCES.md.
import React from "react";
import { Image, type ImageSourcePropType } from "react-native";
import type { Product } from "../data/products";
const PHOTOS: Record<number, ImageSourcePropType> = {
  1: require("../assets/products/gatorade.png"),
  2: require("../assets/products/powerade.png"),
  3: require("../assets/products/electrolit.png"),
  4: require("../assets/products/bodyarmor.png"),
  5: require("../assets/products/propel.png"),
};
export default function ProductPhoto({ product, width = 80, height = 125 }: { product: Product; width?: number; height?: number }) {
  return <Image accessibilityLabel={`${product.name} product photo`} source={PHOTOS[product.id]} resizeMode="contain" style={{ width, height }} />;
}
