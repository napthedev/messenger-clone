import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { HeaderBackButtonProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { FC } from "react";
import { TouchableOpacity } from "react-native";

import { NavigationProps } from "../../App";

const RightButton: FC<HeaderBackButtonProps> = (props) => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("CreateConversation");
      }}
    >
      <Ionicons name="md-create-outline" size={28} color={props.tintColor} />
    </TouchableOpacity>
  );
};

export default RightButton;
