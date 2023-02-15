import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "./src/screens/ChatScreen";
import HomeScreen from "./src/screens/HomeScreen";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: {};
  Chat: {};
};
export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
