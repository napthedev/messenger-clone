import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import Constants from "expo-constants";
import { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { io } from "socket.io-client";

import { NavigationProps } from "../../App";

const HomeScreen: FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");

      const newSocket = io(Constants.manifest.extra.serverURL, {
        auth: (cb) => {
          cb({ authorization: `Bearer ${token}` });
        },
      });

      newSocket.emit("get-all-conversations");

      newSocket.on("update-conversations-list", (data) => {
        console.log(JSON.stringify(data, null, 2));
        setData(data);
        setIsLoading(false);
      });

      newSocket.on("error-conversations-list", () => setIsError(true));
    })();
  }, []);

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
      <FlashList
        data={data}
        estimatedItemSize={79}
        renderItem={({ item }) => (
          <>
            <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Chat", { conversationId: item.id })
                }
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
                      Please implement the last message feature
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
