import { queryClient } from "@/client";
import { users } from "@/db/schema";
import { useDatabase } from "@/hooks";
import { Center } from "@mainamiru/react-native-ui";
import { QueryClientProvider } from "@tanstack/react-query";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import React, { Suspense } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { PaperProvider, Text } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import migrations from "../drizzle/migrations";
export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const RootStack = () => {
  const db = useDatabase();
  const { success, error } = useMigrations(db, migrations);

  // hide splash screen when migrations are successful
  React.useEffect(() => {
    if (success) {
      SplashScreen.hideAsync();

      // remove this in prduction
      db.insert(users)
        .values({
          id: 1,
          name: "John Doe",
          email: "test@example.com",
        })
        .onConflictDoNothing()
        .catch((error) => {
          console.log("Error: ", error);
        });
    } else if (error) {
      SplashScreen.hideAsync();
    }
  }, [success, error, db]);

  if (error) {
    return (
      <Center flex={1} gap={10} padding={20}>
        <Text variant="titleLarge">Migration error</Text>
        <Text variant="bodyMedium" style={{ color: "red" }}>
          {error.message}
        </Text>
        <Text variant="bodyMedium" style={{ color: "gray" }}>
          How to fix? Clear the app data and try again.
        </Text>
      </Center>
    );
  } else {
    return (
      <Stack initialRouteName="(tabs)">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      </Stack>
    );
  }
};

const RootLayout = () => {
  return (
    <KeyboardProvider statusBarTranslucent>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <PaperProvider>
            <Suspense fallback={<Text>Loading...</Text>}>
              <SQLiteProvider useSuspense databaseName="myapp.db">
                <RootStack />
              </SQLiteProvider>
            </Suspense>
          </PaperProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </KeyboardProvider>
  );
};

export default RootLayout;
