import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { HeaderBackButtonProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { FC } from "react";
import { TouchableOpacity } from "react-native";

import { NavigationProps } from "../../App";

const LeftButton: FC<HeaderBackButtonProps> = (props) => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Settings");
      }}
    >
      <Ionicons name="settings-outline" size={24} color={props.tintColor} />
    </TouchableOpacity>
  );
};

export default LeftButton;
