import { useNavigation } from "@react-navigation/native";
import { FC } from "react";
import { Button, Text } from "react-native";

import { NavigationProps } from "../../App";
import { useStore } from "../store";

const HomeScreen: FC = () => {
  const { user } = useStore();
  const navigation = useNavigation<NavigationProps>();

  return (
    <>
      <Text className="text-white">{JSON.stringify(user)}</Text>
      <Button
        title="Go to Chat"
        onPress={() => navigation.navigate("Chat")}
      ></Button>
    </>
  );
};

export default HomeScreen;
