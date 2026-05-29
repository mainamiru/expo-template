import { posts } from "@/db/schema";
import { getPosts } from "@/services";
import { LegendList } from "@legendapp/list/react-native";
import { Container } from "@mainamiru/react-native-ui";
import { useQuery } from "@tanstack/react-query";
import { desc } from "drizzle-orm";
import { router } from "expo-router";
import { FAB, List } from "react-native-paper";

const PostsScreen = () => {
  const { data = [], isLoading } = useQuery({
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <List.Item title={item.title} description={item.content} />
        )}
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
