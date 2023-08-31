import { View, Text, useColorScheme } from "react-native";

import useGetMode from "../../../hooks/GetMode";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { ProfileIcon, VerifiedIcon } from "../../icons";
import FastImage from "react-native-fast-image";

export default function HeaderDrawer() {
  const dark = useGetMode();
  const isDark = dark;

  const color = isDark ? "white" : "black";
  const user = useAppSelector((state) => state.user.data);
  const follows = useAppSelector((state) => state.followers);
  return (
    <View style={{ paddingLeft: 14, flex: 1 }}>
      {user?.imageUri ? (
        <FastImage
          style={{ height: 50, width: 50, borderRadius: 9999 }}
          source={{ uri: user?.imageUri }}
        />
      ) : (
        <ProfileIcon color={color} size={50} />
      )}
      <View style={{ marginTop: 10 }}>
        <Text
          style={{
            fontFamily: "jakaraBold",
            includeFontPadding: false,
            color,
            fontSize: 22,
          }}
        >
          {user?.name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{ fontFamily: "jakara", color, includeFontPadding: false }}
          >
            @{user?.userName}
          </Text>
          {user?.verified && (
            <View>
              <VerifiedIcon size={20} color="green" />
            </View>
          )}
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={{ marginTop: 16, flexDirection: "row", gap: 4 }}>
          <Text
            style={{
              fontFamily: "jakaraBold",
              color,
              includeFontPadding: false,
            }}
          >
            {follows.following || 0}
          </Text>
          <Text
            style={{ fontFamily: "jakara", color, includeFontPadding: false }}
          >
            Following
          </Text>
        </View>
        <View style={{ marginTop: 16, flexDirection: "row", gap: 4 }}>
          <Text
            style={{
              fontFamily: "jakaraBold",
              color,
              includeFontPadding: false,
            }}
          >
            {follows.followers || 0}
          </Text>
          <Text
            style={{ fontFamily: "jakara", color, includeFontPadding: false }}
          >
            Followers
          </Text>
        </View>
      </View>
    </View>
  );
}
