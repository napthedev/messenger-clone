import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { UserType } from "server/src/user/user.service";
import { io } from "socket.io-client";

import Login from "./src/components/Login";
import { useStore } from "./src/hooks/useStore";
import ChatScreen from "./src/screens/ChatScreen";
import CreateConversationScreen from "./src/screens/CreateConversationScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ImageViewer from "./src/screens/ImageViewer";
import ProfileScreen from "./src/screens/ProfileScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import axios from "./src/services/axios";

Notifications.setNotificationHandler({
  handleNotification: async (data) => {
    const conversationId = (data as any).request.content.data?.message
      ?.conversationId as string;

    const currentConversationId = await AsyncStorage.getItem(
      "current-conversation-id"
    );

    // Don't show notification if the conversation is active
    if (conversationId === currentConversationId)
      return {
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
      };

    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: {};
  Chat: {
    conversationId: string;
    otherUserInfo: UserType;
  };
  Profile: {
    userId: string;
  };
  CreateConversation: {};
  Settings: {};
  ImageViewer: {
    uri: string;
  };
};
export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <View className="flex-1">
        {typeof user === "undefined" ? (
          <View className="flex-1 justify-center items-center bg-dark">
            <ActivityIndicator />
          </View>
        ) : !user ? (
          <Login />
        ) : (
          <SocketConnectorContainer />
        )}
        <StatusBar style="light" />
      </View>
    </QueryClientProvider>
  );
}

function SocketConnectorContainer() {
  const { socket, setSocket } = useStore();

  useEffect(() => {
    const newSocket = io(Constants.manifest.extra.serverURL, {
      auth: async (cb) => {
        const token = await AsyncStorage.getItem("token");
        cb({ authorization: `Bearer ${token}` });
      },
    });

    newSocket.on("connect", () => setSocket(newSocket));
  }, [setSocket]);

  if (socket) return <MainNavigation />;
  return (
    <View className="flex-1 justify-center items-center bg-dark">
      <ActivityIndicator />
    </View>
  );
}

function MainNavigation() {
  const { isModalOpened } = useStore();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      Alert.alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token) => {
      if (token) {
        const existingPushToken = await AsyncStorage.getItem("pushToken");
        if (existingPushToken !== token) {
          AsyncStorage.setItem("pushToken", token);
          axios.post(`/auth/add-push-token?token=${token}`);
        }
      }
    });
  }, []);

  return (
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
              headerTitleAlign: "center",
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
                  onPress={() => navigation.navigate("CreateConversation")}
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
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              headerTitle: () => <></>,
              headerBackTitleVisible: false,
              headerShadowVisible: false,
            }}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: "fullScreenModal" }}>
          <Stack.Screen
            name="ImageViewer"
            component={ImageViewer}
            options={({ navigation }) => ({
              headerTitle: () => <></>,
              headerLeft: (props) => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Feather name="x" size={24} color={props.tintColor} />
                </TouchableOpacity>
              ),
              headerRight: (props) => (
                <TouchableOpacity>
                  <Feather name="download" size={24} color={props.tintColor} />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
              headerShadowVisible: false,
            })}
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
              headerTitleAlign: "center",
              headerTitle: "New message",
              headerStyle: { backgroundColor: "#222222" },
            })}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={({ navigation }) => ({
              headerRight: () => (
                <Button
                  onPress={() => navigation.navigate("Home")}
                  title="Done"
                ></Button>
              ),
              headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
              headerStyle: { backgroundColor: "#222222" },
              headerShadowVisible: false,
              headerTitleAlign: "center",
              headerBackVisible: false,
            })}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
