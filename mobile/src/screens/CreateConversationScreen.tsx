import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { UsersType } from "server/src/user/user.service";

import { useModalBackgroundColor } from "../hooks/useModalBackgroundColor";
import axios from "../services/axios";

const CreateConversationScreen: FC = () => {
  useModalBackgroundColor();

  const { data, isLoading, isError } = useQuery<UsersType>(
    ["all-users-except-current"],
    async () => (await axios.get("/user/all-users-except-current")).data
  );

  return (
    <View className="flex-1 bg-dark">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#fff" />
        </View>
      ) : isError ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-center text-3xl text-red-500">Error</Text>
        </View>
      ) : (
        <View className="flex-1">
          <FlashList
            data={data}
            renderItem={({ item }) => (
              <View className="flex-row px-4 py-3 gap-3 border-b border-b-[#333333]">
                <Image
                  className="rounded-full"
                  source={{ uri: item.picture, width: 55, height: 55 }}
                />
                <View className="justify-center">
                  <Text className="text-white font-bold text-xl">
                    {item.name}
                  </Text>
                </View>
              </View>
            )}
            estimatedItemSize={79}
          />
        </View>
      )}
    </View>
  );
};

export default CreateConversationScreen;
