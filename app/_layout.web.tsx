import { queryClient } from "@/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const RootStack = () => {
  return (
    <Stack initialRouteName="(tabs)">
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
    </Stack>
  );
};

const RootLayout = () => {
  return (
    <Suspense fallback={null}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <PaperProvider>
            <SQLiteProvider databaseName="myapp.db" useSuspense>
              <RootStack />
            </SQLiteProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Suspense>
  );
};

export default RootLayout;
