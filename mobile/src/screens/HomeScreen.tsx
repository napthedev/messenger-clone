import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Conversations } from "server/src/conversation/conversation.service";

import { NavigationProps } from "../../App";
import { useStore } from "../hooks/useStore";
import { StorageKeys } from "../utils/async-storage";

const HomeScreen: FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const { user, socket } = useStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<Conversations>([]);

  useEffect(() => {
    socket.emit("get-all-conversations");

    socket.on("update-conversations-list", (data) => {
      setData(data);
      setIsLoading(false);
    });

    socket.on("error-conversations-list", () => setIsError(true));
  }, [socket]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      AsyncStorage.removeItem(StorageKeys.currentConversationId);
    }
  }, [isFocused]);

  if (isError)
    return (
      <View className="flex-1 flex justify-center items-center">
        <Text className="text-red-500 text-2xl">Something went wrong</Text>
      </View>
    );

  if (isLoading)
    return (
      <View className="flex-1 flex justify-center items-center">
        <ActivityIndicator />
      </View>
    );

  return (
    <View className="flex-1">
      {data.length === 0 && (
        <Text className="text-white my-3 text-center">
          No conversation available
        </Text>
      )}
      <FlashList
        data={data}
        estimatedItemSize={79}
        renderItem={({ item }) => (
          <>
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Chat", {
                    conversationId: item.id,
                    otherUserInfo: item.userOnConversation.find(
                      (item) => item.user.id !== user.id
                    ).user,
                  });
                }}
                className="flex-row justify-between items-center px-4 py-3 gap-3"
              >
                <View className="flex-row items-center">
                  <Image
                    className="rounded-full mr-3"
                    source={{
                      uri: item.userOnConversation[0].user.picture,
                      width: 55,
                      height: 55,
                    }}
                  />
                  <View className="justify-center gap-[2px]">
                    <Text className="text-white font-semibold text-xl">
                      {item.userOnConversation[0].user.name}
                    </Text>
                    <Text className="text-[#6D6D6D]">
                      {item.messages?.[0]?.content
                        ? `${item.messages[0].user.name}: ${
                            item.messages[0].type === "image"
                              ? "Sent you an image"
                              : item.messages[0].content
                          }`
                        : "Start sending messages"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      />
    </View>
  );
};

export default HomeScreen;
