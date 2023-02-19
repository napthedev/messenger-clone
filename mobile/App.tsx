import { NavigationContainer } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import Login from "./src/components/Login";
import ChatScreen from "./src/screens/ChatScreen";
import HomeScreen from "./src/screens/HomeScreen";
import axios from "./src/services/axios";
import { useStore } from "./src/store";

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: {};
  Chat: {};
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
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator />
        </View>
      ) : !user ? (
        <Login />
      ) : (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
      <StatusBar style="light" />
    </View>
  );
}
