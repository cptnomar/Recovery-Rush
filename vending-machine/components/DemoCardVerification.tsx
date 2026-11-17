// Chimere's demo NFC flow adapted for Brian's component-based cart.
import React from "react";
import { ActivityIndicator, Text, TextInput, View, TouchableOpacity } from "react-native";
import { DEMO_CARD_ID } from "../data/verification";
import { styles } from "../styles/theme";
import { ActionButton } from "./ui";
type Props = { input: string; verifying: boolean; verified: boolean; onInput: (text: string) => void; onVerify: (value: string) => void };
export default function DemoCardVerification({ input, verifying, verified, onInput, onVerify }: Props) {
 return <View style={{ gap: 10, marginVertical: 15, padding: 14, borderRadius: 12, backgroundColor: "#EAF0FA" }}>
   <Text style={{ fontWeight: "800", color: "#14212B" }}>SIMULATED COUGARCARD</Text>
   <Text style={{ color: "#14212B" }}>Simulate a tap or enter COUGAR-DEMO. This is not a real NFC scan or payment.</Text>
   <ActionButton label="SIMULATE CARD TAP" onPress={() => onVerify(DEMO_CARD_ID)} disabled={verifying} />
   <TextInput accessibilityLabel="Simulated NFC identifier" value={input} onChangeText={onInput} autoCapitalize="characters" autoCorrect={false} placeholder="COUGAR-DEMO" style={{ borderWidth: 1, borderColor: "#7E91A5", backgroundColor: "white", color: "#14212B", borderRadius: 8, padding: 12, minHeight: 48 }} returnKeyType="done" onSubmitEditing={() => onVerify(input)} />
   <ActionButton label="VERIFY TEST INPUT" onPress={() => onVerify(input)} disabled={verifying || !input} />
   <View accessibilityLiveRegion="polite" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
     {verifying && <ActivityIndicator />}
     <Text style={{ color: "#14212B", flex: 1 }}>{verifying ? "Verifying simulated card…" : verified ? "✓ Demo card verified for this cart." : "Verification required. Cart changes invalidate verification."}</Text>
   </View>
 </View>;
}
