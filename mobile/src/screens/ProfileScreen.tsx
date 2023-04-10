import { FontAwesome5 } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { UserType } from "server/src/user/user.service";

import axios from "../services/axios";
import { imageProxy } from "../utils/image";

const ProfileScreen: FC = () => {
  const route = useRoute();

  const { userId } = route.params as {
    userId: string;
  };

  const { data, isLoading, isError } = useQuery<UserType>(
    ["user-info"],
    async () =>
      (await axios.get(`/user/user-info`, { params: { userId } })).data
  );

  if (isError)
    return (
      <View className="flex-1 flex justify-center items-center">
        <Text className="text-red-500 text-2xl">Something went wrong</Text>
      </View>
    );

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      <Image
        className="rounded-full"
        source={{ uri: imageProxy(data.picture), width: 90, height: 90 }}
      />
      <Text className="text-xl font-bold text-white mt-3 mb-6">
        {data.name}
      </Text>
      <View className="gap-2 items-center">
        <TouchableOpacity
          onPress={async () => {
            const url = `https://facebook.com/${data.id}`;
            const supported = await Linking.canOpenURL(url);

            if (supported) {
              await Linking.openURL(url);
            } else {
              Alert.alert(`Don't know how to open this URL: ${url}`);
            }
          }}
          className="p-[7px] rounded-full bg-dark-lightened"
        >
          <FontAwesome5 name="facebook" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white">Profile</Text>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
