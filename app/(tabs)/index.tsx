import { PostCard } from "@/components";
import { Spacing } from "@/constants/theme";
import { posts } from "@/db/schema";
import { useTheme } from "@/hooks/use-theme";
import { getPosts, getUsers } from "@/services";
import { LegendList } from "@legendapp/list/react-native";
import { Container } from "@mainamiru/react-native-ui";
import { useQuery } from "@tanstack/react-query";
import { desc } from "drizzle-orm";
import { router } from "expo-router";
import { View } from "react-native";
import { Card, Text } from "react-native-paper";

const RECENT_POSTS_LIMIT = 3;

const HomeScreen = () => {
  const colors = useTheme();

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      return await getPosts().orderBy(desc(posts.createdAt));
    },
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await getUsers();
    },
  });

  const recentPosts = postsData?.slice(0, RECENT_POSTS_LIMIT) ?? [];
  const totalPosts = postsData?.length ?? 0;
  const totalUsers = usersData?.length ?? 0;

  return (
    <Container loading={postsLoading || usersLoading}>
      <LegendList
        data={recentPosts}
        recycleItems={true}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={
          <View style={{ gap: Spacing.three }}>
            <View style={{ paddingTop: Spacing.three }}>
              <Text variant="headlineMedium" style={{ color: colors.text }}>
                Welcome back
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: colors.textSecondary }}
              >
                Here&apos;s what&apos;s happening with your posts
              </Text>
            </View>

            <View
              style={{
                gap: Spacing.two,
                flexDirection: "row",
              }}
            >
              <Card
                style={{
                  flex: 1,
                  backgroundColor: colors.backgroundElement,
                }}
              >
                <Card.Content style={{ alignItems: "center" }}>
                  <Text variant="headlineLarge" style={{ color: colors.text }}>
                    {totalPosts}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: colors.textSecondary }}
                  >
                    Posts
                  </Text>
                </Card.Content>
              </Card>
              <Card
                style={{
                  flex: 1,
                  backgroundColor: colors.backgroundElement,
                }}
              >
                <Card.Content style={{ alignItems: "center" }}>
                  <Text variant="headlineLarge" style={{ color: colors.text }}>
                    {totalUsers}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: colors.textSecondary }}
                  >
                    Users
                  </Text>
                </Card.Content>
              </Card>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text variant="titleMedium" style={{ color: colors.text }}>
                Recent Posts
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: colors.textSecondary }}
                onPress={() => router.push("/posts")}
              >
                See all
              </Text>
            </View>
          </View>
        }
        contentContainerStyle={{
          gap: Spacing.two,
          padding: Spacing.two,
          paddingBottom: Spacing.four,
        }}
      />
    </Container>
  );
};

export default HomeScreen;
