import { useTheme } from "@/hooks/use-theme";
import { posts as postsTable } from "@/db/schema";
import { getPosts, getUserById } from "@/services";
import { Spacing } from "@/constants/theme";
import { Container } from "@mainamiru/react-native-ui";
import { useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { CircleAlert, Palette, Trash2 } from "lucide-react-native";
import { View } from "react-native";
import { Avatar, Divider, List, Text } from "react-native-paper";

const DEFAULT_USER_ID = 1;

const ProfileScreen = () => {
  const colors = useTheme();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user", DEFAULT_USER_ID],
    queryFn: async () => {
      return await getUserById(DEFAULT_USER_ID);
    },
  });

  const { data: userPosts, isLoading: postsLoading } = useQuery({
    queryKey: ["posts", "user", DEFAULT_USER_ID],
    queryFn: async () => {
      return await getPosts().where(eq(postsTable.userId, DEFAULT_USER_ID));
    },
  });

  const isLoading = userLoading || postsLoading;
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "??";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "Unknown";

  return (
    <Container loading={isLoading}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            alignItems: "center",
            paddingVertical: Spacing.five,
            paddingHorizontal: Spacing.three,
            gap: Spacing.two,
          }}
        >
          <Avatar.Text size={80} label={initials} />
          <Text variant="headlineSmall" style={{ color: colors.text }}>
            {user?.name ?? "Unknown User"}
          </Text>
          <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
            {user?.email ?? "No email"}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginHorizontal: Spacing.three,
            gap: Spacing.two,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: colors.backgroundElement,
              borderRadius: 12,
              padding: Spacing.three,
              alignItems: "center",
            }}
          >
            <Text variant="headlineSmall" style={{ color: colors.text }}>
              {userPosts?.length ?? 0}
            </Text>
            <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
              Posts
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.backgroundElement,
              borderRadius: 12,
              padding: Spacing.three,
              alignItems: "center",
            }}
          >
            <Text variant="bodySmall" style={{ color: colors.textSecondary, marginBottom: 2 }}>
              {memberSince}
            </Text>
            <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
              Member since
            </Text>
          </View>
        </View>

        <View style={{ marginTop: Spacing.four }}>
          <Divider />
          <List.Item
            title="Appearance"
            description="Dark / Light mode"
            left={(props) => <Palette {...props} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="About"
            description="App information"
            left={(props) => <CircleAlert {...props} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="Clear Data"
            description="Remove all local data"
            left={(props) => <Trash2 {...props} color="#B00020" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
        </View>
      </View>
    </Container>
  );
};

export default ProfileScreen;
