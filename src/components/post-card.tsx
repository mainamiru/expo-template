import { PostModel } from "@/db/types/post";
import { StyleProp, ViewStyle } from "react-native";
import { Card, CardProps, Text } from "react-native-paper";

interface PostCardProps extends Omit<CardProps, "children" | "elevation"> {
  post: PostModel;
  style?: StyleProp<ViewStyle>;
}

export const PostCard = ({ post, style, ...props }: PostCardProps) => {
  return (
    <Card style={style} {...props}>
      <Card.Content>
        <Card.Cover source={{ uri: "https://picsum.photos/700/400" }} />
        <Text variant="titleMedium">{post.title}</Text>
        <Text variant="bodyMedium">{post.content}</Text>
      </Card.Content>
    </Card>
  );
};
