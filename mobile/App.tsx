import { Ionicons } from "@expo/vector-icons";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { UserType } from "server/src/user/user.service";

import Login from "./src/components/Login";
import ChatScreen from "./src/screens/ChatScreen";
import CreateConversationScreen from "./src/screens/CreateConversationScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import axios from "./src/services/axios";
import { useStore } from "./src/store";

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: {};
  Chat: {
    conversationId: string;
    otherUserInfo: UserType;
  };
  CreateConversation: {};
  Settings: {};
};
export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const queryClient = new QueryClient();

export default function App() {
  const { user, setUser, isModalOpened } = useStore();

  useEffect(() => {
    (async () => {
      try {
        const { user } = (await axios.get("/auth/verify-token")).data;
        if (!user) throw new Error("");
        setUser(user);
      } catch (error) {
        setUser(null);
      }
    })();
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <View className="flex-1">
        {typeof user === "undefined" ? (
          <View className="flex-1 justify-center items-center bg-dark">
            <ActivityIndicator />
          </View>
        ) : !user ? (
          <Login />
        ) : (
          <NavigationContainer
            theme={{
              dark: true,
              colors: {
                ...DarkTheme.colors,
                background: "#000000",
                card: "#000000",
                primary: "#2374E1",
              },
            }}
          >
            <Stack.Navigator
              initialRouteName="Home"
              {...(isModalOpened
                ? {
                    screenOptions: {
                      headerStyle: { backgroundColor: "#181818" },
                    },
                  }
                : {})}
            >
              <Stack.Group>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={({ navigation }) => ({
                    title: "Chats",
                    headerTitleStyle: { fontSize: 20, fontWeight: "700" },
                    headerLeft: (props) => (
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Settings")}
                      >
                        <Ionicons
                          name="settings-outline"
                          size={24}
                          color={props.tintColor}
                        />
                      </TouchableOpacity>
                    ),
                    headerRight: (props) => (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("CreateConversation")
                        }
                      >
                        <Ionicons
                          name="md-create-outline"
                          size={28}
                          color={props.tintColor}
                        />
                      </TouchableOpacity>
                    ),
                  })}
                />
                <Stack.Screen
                  options={{
                    headerBackTitleVisible: false,
                    headerTitle: () => <></>,
                  }}
                  name="Chat"
                  component={ChatScreen}
                />
              </Stack.Group>
              <Stack.Group
                screenOptions={{
                  presentation: "modal",
                  gestureEnabled: true,
                  headerStyle: { backgroundColor: "#000000" },
                }}
              >
                <Stack.Screen
                  name="CreateConversation"
                  component={CreateConversationScreen}
                  options={({ navigation }) => ({
                    headerLeft: () => (
                      <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text className="text-primary text-[18px]">Cancel</Text>
                      </TouchableOpacity>
                    ),
                    headerTitle: "New message",
                    headerStyle: { backgroundColor: "#222222" },
                  })}
                />
                <Stack.Screen name="Settings" component={SettingsScreen} />
              </Stack.Group>
            </Stack.Navigator>
          </NavigationContainer>
        )}
        <StatusBar style="light" />
      </View>
    </QueryClientProvider>
  );
}
