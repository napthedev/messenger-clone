import { FC } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "react-native";
import { NavigationProps } from "../../App";

const HomeScreen: FC = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <>
      <Text className="text-blue-600">Home</Text>
      <Button
        title="Go to Chat"
        onPress={() => navigation.navigate("Chat")}
      ></Button>
    </>
  );
};

export default HomeScreen;
