import { PostCard } from "@/components";
import { posts } from "@/db/schema";
import { getPosts } from "@/services";
import { LegendList } from "@legendapp/list/react-native";
import { Container } from "@mainamiru/react-native-ui";
import { useQuery } from "@tanstack/react-query";
import { desc } from "drizzle-orm";
import { router } from "expo-router";
import { RefreshControl } from "react-native";
import { FAB } from "react-native-paper";

const PostsScreen = () => {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      return await getPosts().orderBy(desc(posts.createdAt));
    },
  });

  return (
    <Container loading={isLoading}>
      <LegendList
        data={data}
        recycleItems={true}
        refreshControl={
          <RefreshControl onRefresh={refetch} refreshing={isRefetching} />
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={{
          gap: 10,
          padding: 16,
        }}
      />
      <FAB
        icon="plus"
        onPress={() => {
          router.push("/(protected)/posts/add");
        }}
        style={{
          zIndex: 1,
          right: 16,
          bottom: 16,
          position: "absolute",
        }}
      />
    </Container>
  );
};

export default PostsScreen;
