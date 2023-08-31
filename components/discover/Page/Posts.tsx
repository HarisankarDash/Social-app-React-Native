import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeOut,
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import PostsContainer from "../PostsContainer";
import { SearchSkeleton } from "../Skeleton/SearchSkeleton";
import { IPostContent } from "../../../types/api";
import { postState } from "../../../redux/slice/post";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator } from "react-native-paper";
import useGetMode from "../../../hooks/GetMode";
import { PostSearchSkeleton } from "../Skeleton/PostSearchSkeleton";

export default function Posts({ posts }: { posts: postState }) {
  const [showLoading, setShowLoading] = useState(posts?.data?.length > 8);
  const dark = useGetMode();
  const color = dark ? "white" : "black";
  const acolor = !dark ? "white" : "black";
  const handleStopLoading = () => {
    setShowLoading(false);
  };

  function callback() {
    "worklet";
    runOnJS(handleStopLoading)();
  }

  const opacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(opacity.value, [0, 1], [1, 0]),
    };
  });

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
    return () => {
      cancelAnimation(opacity);
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        entering={FadeInLeft.withCallback(callback)
          .springify()
          .delay(posts?.data?.length > 8 ? 400 : 0)}
        style={{ flex: 1 }}
      >
        {posts.loading && (
          <Animated.View
            style={[{ gap: 5, marginTop: 160, padding: 10 }, animatedStyle]}
          >
            {[0, 1, 2].map((idx) => (
              <PostSearchSkeleton key={idx} />
            ))}
          </Animated.View>
        )}
        <FlashList
          data={posts.data}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={100}
          contentContainerStyle={{
            paddingTop: 160,
            paddingBottom: 100,
            paddingHorizontal: 10,
          }}
          renderItem={({ item }) => (
            <PostsContainer
              id={item.id}
              imageUri={item.user?.imageUri}
              userTag={item.user?.userName}
              verified={item.user?.verified}
              audioUri={item.audioUri || undefined}
              photoUri={item.photoUri}
              videoUri={item.videoUri || undefined}
              postText={item.postText}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </Animated.View>
      {showLoading && (
        <Animated.View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <ActivityIndicator color={acolor} size={40} />
        </Animated.View>
      )}
    </View>
  );
}
