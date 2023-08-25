import {
  View,
  Text,
  Linking,
  useColorScheme,
  Switch,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import HeaderDrawer from "./HeaderDrawer";
import { useNavigation } from "@react-navigation/native";
import {
  GlobalIcon,
  LogoutIcon,
  MoonIcon,
  ProfileIconUnfocused,
} from "../../icons";
import { HomeNavigationProp } from "../../../types/navigation";
import useGetMode from "../../../hooks/GetMode";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { openSheet } from "../../../redux/slice/bottomSheet";
import { signOut } from "../../../redux/slice/user";
import { InAppBrowser } from "react-native-inappbrowser-reborn";
import { resetPost } from "../../../redux/slice/post";
import { resetFollowers } from "../../../redux/slice/user/followers";

export default function CustomDrawerContent(
  props: DrawerContentComponentProps
) {
  const dark = useGetMode();
  const isDark = dark;
  const style = !isDark ? "light" : "dark";
  const backgroundColor = isDark ? "white" : "black";
  const color = isDark ? "white" : "black";
  const toolbarColor = isDark ? "black" : "white";
  const pressColor = isDark ? "#BEBEBE" : "#4F4F4F";
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HomeNavigationProp>();

  const openLink = async () => {
    try {
      const url = "https://isaacojo.me";
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: "cancel",
          preferredBarTintColor: toolbarColor,
          preferredControlTintColor: color,
          readerMode: false,
          animated: true,
          modalPresentationStyle: "fullScreen",
          modalTransitionStyle: "coverVertical",
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: toolbarColor,
          secondaryToolbarColor: toolbarColor,
          navigationBarColor: toolbarColor,
          navigationBarDividerColor: "white",
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: true,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: "slide_in_right",
            startExit: "slide_out_left",
            endEnter: "slide_in_left",
            endExit: "slide_out_right",
          },
          headers: {
            "my-custom-header": "my custom header value",
          },
        });
        console.log(
          "🚀 ~ file: CustomDrawer.tsx:77 ~ openLink ~ result:",
          result
        );
      } else Linking.openURL(url);
    } catch (error) {}
  };
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <BlurView
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,

          right: 0,
          top: 0,
        }}
        tint={style}
        intensity={200}
      />
      <DrawerContentScrollView {...props}>
        <HeaderDrawer />
        <View
          style={{
            height: 1,
            width: "100%",
            marginVertical: 20,
            backgroundColor,
          }}
        />
        <DrawerItemList {...props} />
        <DrawerItem
          label={({ focused }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",

                gap: 14,
              }}
            >
              <ProfileIconUnfocused size={25} color={color} />
              <Text
                style={{
                  color,
                  fontFamily: "jakaraBold",
                  includeFontPadding: false,
                  fontSize: 20,
                }}
              >
                Profile
              </Text>
            </View>
          )}
          onPress={() => {
            props.navigation.closeDrawer();
            navigation.navigate("Profile");
          }}
        />
      </DrawerContentScrollView>

      <View
        style={{
          width: "100%",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            marginBottom: 50,
            height: 40,
            width: 40,
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <Pressable
            style={{
              height: 40,
              width: 40,
              borderRadius: 999,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              props.navigation.closeDrawer();
              dispatch(openSheet({ type: "modeSelect" }));
            }}
            android_ripple={{ color: pressColor, foreground: true }}
          >
            <MoonIcon size={25} color={color} />
          </Pressable>
        </View>
        <View
          style={{
            marginBottom: 50,
            height: 40,
            width: 40,
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <Pressable
            style={{
              height: 40,
              width: 40,
              borderRadius: 999,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              openLink();
            }}
            android_ripple={{ color: pressColor, foreground: true }}
          >
            <GlobalIcon size={25} color={color} />
          </Pressable>
        </View>
        <View
          style={{
            marginBottom: 50,
            height: 40,
            width: 40,
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <Pressable
            style={{
              height: 40,
              width: 40,
              borderRadius: 999,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              props.navigation.closeDrawer();
              dispatch(resetPost());
              dispatch(signOut());
              dispatch(resetFollowers());
            }}
            android_ripple={{ color: pressColor, foreground: true }}
          >
            <LogoutIcon size={25} color={color} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
