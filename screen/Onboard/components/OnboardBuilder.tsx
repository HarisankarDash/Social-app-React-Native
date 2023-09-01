import { View, Text, Dimensions, useColorScheme, Image } from "react-native";

import Animated, { FadeInLeft } from "react-native-reanimated";
import useGetMode from "../../../hooks/GetMode";
import FastImage, { Source } from "react-native-fast-image";

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;
export default function OnboardBuilder({
  header,
  subText,
  imageUri,
  quote,
}: {
  header: string;
  subText: string;
  imageUri: Source;
  quote: string;
}) {
  const dark = useGetMode();
  const color = !dark ? "black" : "white";

  return (
    <View style={{ width }}>
      <Animated.View
        entering={FadeInLeft.delay(200)}
        style={{
          width: width * 0.9,
          justifyContent: "center",
          height: height / 2.5,
        }}
      >
        <FastImage style={{ flex: 1 }} resizeMode="contain" source={imageUri} />
      </Animated.View>
      <Text
        style={{ fontFamily: "mulishBold", fontSize: 36, width: 300, color }}
      >
        {header}
      </Text>
      <Text style={{ fontSize: 26, fontFamily: "mulish", color: "#929292" }}>
        {subText}
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontFamily: "mulish",
          color: "#929292",
          width: "70%",
        }}
      >
        {quote}
      </Text>
    </View>
  );
}
