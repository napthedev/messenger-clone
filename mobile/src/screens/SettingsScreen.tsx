import { useNavigation } from "@react-navigation/native";
import { FC } from "react";
import { Button } from "react-native";

import { NavigationProps } from "../../App";

const SettingsScreen: FC = () => {
  const navigation = useNavigation<NavigationProps>();
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
