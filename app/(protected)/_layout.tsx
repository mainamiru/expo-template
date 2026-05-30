import { Stack } from "expo-router";

const ProtectedLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="posts/add" options={{ title: "Add Post" }} />
    </Stack>
  );
};

export default ProtectedLayout;
