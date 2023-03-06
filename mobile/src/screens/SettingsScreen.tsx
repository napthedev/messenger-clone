import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FC, useCallback } from "react";
import { Button } from "react-native";

import { NavigationProps } from "../../App";
import { useStore } from "../store";

const SettingsScreen: FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const { setIsModalOpened } = useStore();

  useFocusEffect(
    useCallback(() => {
      setIsModalOpened(true);
      return () => setIsModalOpened(false);
    }, [setIsModalOpened])
  );

  return (
    <>
      <Button
        title="Back Home"
        onPress={() => navigation.navigate("Home")}
      ></Button>
    </>
  );
};

export default SettingsScreen;
