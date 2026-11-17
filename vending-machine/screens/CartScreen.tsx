import DemoCardVerification from "../components/DemoCardVerification";
import ProductPhoto from "../components/ProductPhoto";
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import type { Product } from "../data/products";
import type { CartItem } from "../data/cart";
import { styles } from "../styles/theme";
import { ActionButton, DrinkCan, HealthNotice, AppFooter, QuantityControl, money, productTint } from "../components/ui";

type Props = {
  items: CartItem[];
  count: number;
  total: number;
  isWide: boolean;
  error: string;
  onAdd: (product: Product) => void;
  onReduce: (id: number) => void;
  onRemove: (id: number) => void;
  onShopForMore: () => void;
  onCheckout: () => void;
  nfcInput: string; verifying: boolean; nfcVerified: boolean; onNfcInput: (value: string) => void; onVerifyNfc: (value: string) => void;
};
export default function CartScreen({ items, count, total, isWide, error, onAdd, onReduce, onRemove, onShopForMore, onCheckout, nfcInput, verifying, nfcVerified, onNfcInput, onVerifyNfc }: Props) {
  return (
    <ScrollView contentContainerStyle={[styles.cartContent, !isWide && styles.contentCompact]}>
      <View style={[{ gap: 16, marginBottom: 24 }, isWide && { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
        <View style={isWide && { flex: 1 }}>
          <Text style={[styles.pageTitle, !isWide && { fontSize: 34, lineHeight: 38 }]}>REVIEW YOUR CART.</Text>
          <Text style={[styles.pageSubtitle, { marginBottom: 0 }]}>Check your drinks, adjust quantities, and review your total.</Text>
        </View>
        {count > 0 && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Shop for more"
            onPress={onShopForMore}
            style={[styles.outlineButton, isWide && { minWidth: 180 }]}
          >
            <Text style={styles.outlineButtonText}>← SHOP FOR MORE</Text>
          </TouchableOpacity>
        )}
      </View>
      {count === 0 ? <>
        <View style={styles.emptyCart}>
          <View style={styles.emptyIcon}><Text style={styles.emptyBolt}>+</Text></View>
          <Text style={styles.emptyTitle}>Your cart is empty.</Text>
          <Text style={styles.emptyText}>Explore the lineup to find your next refreshment.</Text>
          <View style={{ width: "100%", maxWidth: 350 }}><ActionButton label="BROWSE DRINKS" onPress={onShopForMore} /></View>
        </View>
        <View style={{ marginTop: 24 }}><AppFooter /></View>
      </> : <>
        <View style={[styles.checkoutLayout, isWide && { flexDirection: "row", alignItems: "flex-start" }]}>
          <View style={{ flex: 1, width: "100%" }}>
            {items.map(({ product, quantity }) => <View key={product.id} style={styles.cartItem}>
              <View style={[styles.cartCanBox, { backgroundColor: productTint(product) }]}><ProductPhoto product={product} width={52} height={80} /></View>
              <View style={styles.cartItemInfo}>
                <View style={styles.cartRowTitle}><Text style={[styles.productName, { fontSize: 18 }]}>{product.name}</Text><Text style={styles.cartLineTotal}>{money(product.price * quantity)}</Text></View>
                <Text style={styles.cartItemDetail}>{money(product.price)} each · {product.stock} in stock</Text>
                <View style={{ maxWidth: 140, marginTop: 12 }}><QuantityControl product={product} quantity={quantity} onAdd={() => onAdd(product)} onReduce={() => onReduce(product.id)} /></View>
                <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Remove ${product.name} from cart`} onPress={() => onRemove(product.id)} style={styles.cartRemove}><Text style={styles.cartRemoveText}>Remove</Text></TouchableOpacity>
              </View>
            </View>)}
          </View>
          <View style={[styles.receipt, isWide && { width: 335 }]}>
            <View style={styles.receiptHeading}><Text style={styles.receiptTitle}>ORDER SUMMARY</Text></View>
            <View style={styles.receiptRow}><Text style={styles.receiptLabel}>Drinks selected</Text><Text style={styles.receiptValue}>{count}</Text></View>
            <View style={styles.receiptRow}><Text style={styles.receiptLabel}>Subtotal</Text><Text style={styles.receiptValue}>{money(total)}</Text></View>
            <View style={styles.receiptDivider} />
            <View style={styles.receiptRow}><Text style={styles.receiptTotalLabel}>DEMO TOTAL</Text><Text style={styles.receiptTotal}>{money(total)}</Text></View>
            <View style={styles.cartSummaryNotice}><HealthNotice /></View>
            {!!error && <Text accessibilityRole="alert" style={styles.errorText}>{error}</Text>}
            <DemoCardVerification input={nfcInput} verifying={verifying} verified={nfcVerified} onInput={onNfcInput} onVerify={onVerifyNfc} />
            <ActionButton label="COMPLETE DEMO ORDER" onPress={onCheckout} disabled={count === 0 || !nfcVerified || verifying} hint="Complete a simulated order for the drinks in your cart. No payment is charged." />
            <View style={styles.demoPill}><Text style={styles.demoPillText}>NO REAL PAYMENT OR DISPENSING</Text></View>
            <Text style={styles.receiptNote}>Sample prices. No extra fees are added in this demo. Drinks dispense one at a time in the simulation.</Text>
          </View>
        </View>
        <Text style={[styles.footerMeta, { marginTop: 28 }]}>RECOVERY RUSH · DEMO CART · NO REAL PAYMENTS</Text>
      </>}
    </ScrollView>
  );
}
