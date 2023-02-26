import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import LeftButton from "./src/components/LeftButton";
import Login from "./src/components/Login";
import RightButton from "./src/components/RightButton";
import ChatScreen from "./src/screens/ChatScreen";
import CreateConversationScreen from "./src/screens/CreateConversationScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import axios from "./src/services/axios";
import { useStore } from "./src/store";

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: {};
  Chat: {};
  CreateConversation: {};
  Settings: {};
};
export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function App() {
  const { user, setUser } = useStore();

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
          <Stack.Navigator initialRouteName="Home">
            <Stack.Group>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  title: "Chats",
                  headerTitleStyle: { fontSize: 20, fontWeight: "700" },
                  headerLeft: (props) => <LeftButton {...props} />,
                  headerRight: (props) => <RightButton {...props} />,
                }}
              />
              <Stack.Screen name="Chat" component={ChatScreen} />
            </Stack.Group>
            <Stack.Group
              screenOptions={{
                presentation: "modal",
              }}
            >
              <Stack.Screen
                name="CreateConversation"
                component={CreateConversationScreen}
              />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      )}
      <StatusBar style="light" />
    </View>
  );
}
