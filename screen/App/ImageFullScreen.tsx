import { Pressable, View, StyleSheet, ImageBackground } from "react-native";
import { ImageFullScreenProp } from "../../types/navigation";
import { Image } from "expo-image";

import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SharedTransition,
  withTiming,
} from "react-native-reanimated";

import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useLayoutEffect } from "react";
import axios from "axios";
import RNFetchBlob from "rn-fetch-blob";
import { BlurView } from "expo-blur";
import { useAppDispatch } from "../../redux/hooks/hooks";
import { openToast } from "../../redux/slice/toast/toast";
import { SharedElement } from "react-navigation-shared-element";

//Hero Transition

export const transition = SharedTransition.custom((values) => {
  "worklet";
  return {
    width: withTiming(values.targetWidth, {
      easing: Easing.quad,
    }),
    height: withTiming(values.targetHeight, {
      easing: Easing.quad,
    }),
    originX: withTiming(values.targetOriginX, {
      easing: Easing.quad,
    }),
    originY: withTiming(values.targetOriginY, {
      easing: Easing.quad,
    }),
  };
});

export default function ImageFullScreen({
  route,
  navigation,
}: ImageFullScreenProp) {
  const { photoUri, id } = route.params;
  const dispatch = useAppDispatch();

  const handleDownload = () => {
    RNFetchBlob.config({
      addAndroidDownloads: {
        useDownloadManager: true, // <-- this is the only thing required
        // Optional, override notification setting (default to true)
        notification: true,
        // Optional, but recommended since android DownloadManager will fail when
        // the url does not contains a file extension, by default the mime type will be text/plain
        mime: "image/jpg",
        description: "File downloaded by download manager.",
      },
      // response data will be saved to this path if it has access right.
    })
      .fetch("GET", route.params?.photoUri)
      .then((res) => {
        // the path should be dirs.DocumentDir + 'path-to-file.anything'
        dispatch(
          openToast({ text: "File saved in notification", type: "Info" })
        );
      })
      .catch((e) => {});
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          android_ripple={{ color: "black" }}
          onPress={handleDownload}
          style={{
            height: 50,
            bottom: 0,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: 50,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="download-box"
              size={30}
              color="white"
            />
          </View>
        </Pressable>
      ),
    });
  });
  return (
    <>
      <StatusBar animated={true} style="light" backgroundColor="transparent"  />
      <Animated.View
        entering={FadeIn.duration(250)}
        exiting={FadeOut.duration(250)}
        style={{
          flex: 1,
          backgroundColor: "black",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ImageBackground
          source={{ uri: photoUri }}
          blurRadius={20}
          imageStyle={{opacity:0.5}}
          style={{ height:"100%", width:"100%",justifyContent: "center", }}
          resizeMode="cover"
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <SharedElement id={id} style={StyleSheet.absoluteFill}>
              <Image
                source={{ uri: photoUri }}
                contentFit="contain"
                style={{ width: "100%", height: "100%" }}
              />
            </SharedElement>
          </View>
        </ImageBackground>
      </Animated.View>
      {/* <View
        style={{
          elevation:4,
         borderColor:"white",
        backgroundColor:"#CFF8FF3C",
         borderTopWidth:0.5,
          position: "absolute",
          height: 50,
          bottom: 0,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <BlurView intensity={40} style={{position:"absolute", width:"100%",height:50}}/>
        <Pressable
          android_ripple={{ color: "black" }}
          onPress={handleDownload}
          style={{
            
            position: "absolute",
            height: 50,
            bottom: 0,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="download-box"
              size={20}
              color="white"
            />
            <Text style={{ fontFamily: "mulishBold" ,color:"white"}}>Download</Text>
          </View>
        </Pressable>
      </View> */}
    </>
  );
}
