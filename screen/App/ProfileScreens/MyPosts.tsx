import { View, Animated as NativeAnimated } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";

import PostBuilder from "../../../components/home/post/PostBuilder";

import useGetMode from "../../../hooks/GetMode";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";

import { ActivityIndicator } from "react-native-paper";
import { IPost } from "../../../types/api";
import { useLazyGetMyPostsQuery } from "../../../redux/api/services";
import { openToast } from "../../../redux/slice/toast/toast";

import Bio from "../../../components/profile/Bio";

export default function MyPosts({ offset }: { offset: NativeAnimated.Value }) {
  const dark = useGetMode();
  const dispatch = useAppDispatch();
  const [posts, setPosts] = useState<IPost[]>([]);

  const isDark = dark;
  const color = isDark ? "white" : "black";

  const [skip, setSkip] = useState(0);

  const [noMore, setNoMore] = useState(false);

  const ref = useRef<any>(null);
  const [getLazyPost, postRes] = useLazyGetMyPostsQuery();

  const renderFooter = () => {
    if (postRes.isLoading) {
      return (
        <View
          style={{
            marginTop: 20,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color={color} size={20} />
        </View>
      );
    }
  };

  useEffect(() => {
    getLazyPost({ take: 20, skip })
      .unwrap()
      .then((e) => {
        setPosts(e.posts);
        setSkip(e.posts?.length);
      })
      .catch((e) => {
        console.log("🚀 ~ file: MyPosts.tsx:61 ~ useEffect ~ e:", e.status);
        dispatch(
          openToast({ text: "couldn't get recent posts", type: "Failed" })
        );
      });
  }, []);

  const fetchMoreData = () => {
    if (!noMore && !postRes.error)
      getLazyPost({ take: 20, skip })
        .unwrap()
        .then((e) => {
          setSkip(skip + e.posts.length);

          if (e.posts.length === 0) {
            setNoMore(true);
          }
        })
        .catch((e) => {
          dispatch(
            openToast({ text: "couldn't get recent posts", type: "Failed" })
          );
        });
  };

  const renderItem = ({ item }: { item: IPost }) => (
    <>
      <PostBuilder
        id={item.id}
        date={item.createdAt}
        comments={item._count.comments}
        like={item._count.like}
        thumbNail={item.videoThumbnail}
        isLiked={item.isLiked}
        imageUri={item.user?.imageUri}
        name={item.user?.name}
        userTag={item.user?.userName}
        verified={item.user?.verified}
        audioUri={item.audioUri || undefined}
        photoUri={item.photoUri}
        videoTitle={item.videoTitle || undefined}
        videoUri={item.videoUri || undefined}
        postText={item.postText}
        videoViews={item.videoViews?.toString()}
      />
    </>
  );
  const keyExtractor = (item: IPost) => item.id?.toString();
  return (
    <>
      <View style={{ flex: 1 }}>
        <NativeAnimated.FlatList
          ref={ref}
          data={posts.length === 0 ? postRes.data?.posts : posts}
          decelerationRate={0.991}
          ListHeaderComponent={<Bio />}
          ListFooterComponent={renderFooter}
          scrollEventThrottle={16}
          onScroll={NativeAnimated.event(
            [{ nativeEvent: { contentOffset: { y: offset } } }],
            { useNativeDriver: false }
          )}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.3}
          onEndReached={fetchMoreData}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
        />
      </View>
    </>
  );
}
