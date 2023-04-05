import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FC, useCallback } from "react";
import { Button, Text } from "react-native";

import { NavigationProps } from "../../App";
import { useStore } from "../store";

const SettingsScreen: FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const { setIsModalOpened, setUser, user } = useStore();

  useFocusEffect(
    useCallback(() => {
      setIsModalOpened(true);
      return () => setIsModalOpened(false);
    }, [setIsModalOpened])
  );

  const handleSignOut = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  return (
    <>
      <Text className="text-white">{JSON.stringify(user, null, 2)}</Text>
      <Button
        title="Back Home"
        onPress={() => navigation.navigate("Home")}
      ></Button>
      <Button onPress={() => handleSignOut()} title="Sign out"></Button>
    </>
  );
};

export default SettingsScreen;
