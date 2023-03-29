import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FC, useCallback } from "react";
import { Button } from "react-native";

import { NavigationProps } from "../../App";
import { useStore } from "../store";

const SettingsScreen: FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const { setIsModalOpened, setUser } = useStore();

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
      <Button
        title="Back Home"
        onPress={() => navigation.navigate("Home")}
      ></Button>
      <Button onPress={() => handleSignOut()} title="Sign out"></Button>
    </>
  );
};

export default SettingsScreen;
